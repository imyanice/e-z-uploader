use std::fs;
use std::fs::File;
use std::io::Write;
use std::path::Path;

use crate::files::delete_file;
use crate::utils;
use arboard::Clipboard;
use reqwest::blocking::{
    multipart::{Form, Part},
    Client,
};
use serde::{Deserialize, Serialize};
use tauri::api::dialog::message;
use tauri::api::notification::Notification;
use tauri::regex::Regex;
use tauri::{AppHandle, Manager};
#[allow(dead_code, non_snake_case)]
#[derive(Deserialize)]
struct UploadResponse {
    success: bool,
    imageUrl: String,
    rawUrl: String,
    deletionUrl: String,
}

#[derive(Serialize, Deserialize)]
pub(crate) struct UploadedFile {
    pub path: String,
    pub deletion_url: String,
    pub name: String,
    pub size: i64,
    pub url: String,
}
#[allow(dead_code, non_snake_case)]
#[derive(Deserialize)]
struct ErrorResponse {
    error: String,
    success: bool,
}

pub fn upload_file_to_host(file: &Path, app_handle: &tauri::AppHandle) {
    let upload_url_regex = Regex::new(r"https:\/\/.*\.e-z\.(?:...|....)\/files").unwrap();

    let config = crate::config::get_config(app_handle);
    if !upload_url_regex.is_match(&config.upload_url) {
        let main_window = app_handle.get_window("local").unwrap();
        message(
            Some(&main_window),
            "Uh Oh...",
            "Please provide a valid upload url.",
        );
        return;
    }
    // sentry::capture_message(file.to_str().unwrap(), Level::Info);

    match Part::file(file) {
        Ok(part_file) => {
            let client = Client::builder()
                .user_agent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36")
                .build()
                .expect("failed to build client");
            let request = client
                .post(config.upload_url)
                .header("key", config.api_key)
                .multipart(Form::new().part("file", part_file))
                .send();
            // sentry::capture_message("Request has been sent", Level::Info);

            match request {
                Ok(data) => {
                    // sentry::capture_message("The data is ok", Level::Info);

                    match data.status() {
                        reqwest::StatusCode::OK => {
                            let response = data
                                .json::<UploadResponse>()
                                .expect("Could not parse upload response");
                            let mut clipboard = Clipboard::new().unwrap();
                            let url = response.imageUrl.clone();
                            match clipboard.set_text(response.imageUrl) {
                                Ok { .. } => {
                                    if !config.auto_wipe {
                                        add_file_data(app_handle, file, response.deletionUrl, url)
                                    };
                                    utils::add_int_to_uploaded_files(app_handle);
                                    display_successful_notification(app_handle);
                                }
                                Err(err) => {
                                    display_error_message(app_handle);
                                    sentry::capture_error(&err);
                                }
                            };
                        }
                        reqwest::StatusCode::UNAUTHORIZED => {
                            display_error_message(app_handle);
                            println!("Invalid API Key")
                        }
                        _ => {
                            display_error_message(app_handle);
                            panic!("An invalid status code has been given");
                        }
                    }
                }
                Err(err) => {
                    sentry::capture_error(&err);
                    display_no_internet_notification(app_handle);
                }
            }
        }
        Err(_) => {
            // sentry::capture_message("A file did not exist", Level::Info);
            println!("file doesnt exist")
        }
    }

    if config.auto_wipe {
        delete_file(file);
    }
}

fn display_successful_notification(app_handle: &tauri::AppHandle) {
    Notification::new(app_handle.config().tauri.bundle.identifier.clone())
        .title("File Uploaded!")
        .body("The URL has been copied to your clipboard".to_string())
        .show()
        .expect("error while showing notification");
}

fn display_no_internet_notification(app_handle: &AppHandle) {
    Notification::new(app_handle.config().tauri.bundle.identifier.clone())
        .title("Could not upload to E-Z.host!")
        .body("You are not connected to the internet.")
        .show()
        .expect("error while showing notification");
}

fn display_error_message(app_handle: &tauri::AppHandle) {
    Notification::new(app_handle.config().tauri.bundle.identifier.clone())
        .title("Could not upload to E-Z.host!")
        .body("An error occurred while uploading your file.")
        .show()
        .expect("error while showing notification");
}
fn add_file_data(app_handle: &AppHandle, file_path: &Path, deletion_url: String, url: String) {
    let path = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .join("uploaded_files.json");
    match fs::read_to_string(&path) {
        Ok(cfg) => match file_path.symlink_metadata() {
            Ok(file_meta) => {
                let mut json: Vec<UploadedFile> = serde_json::from_str(cfg.as_str()).unwrap();
                json.push(UploadedFile {
                    path: file_path.as_os_str().to_str().unwrap().to_string(),
                    deletion_url,
                    name: file_path.file_name().unwrap().to_str().unwrap().to_string(),
                    size: file_meta.len() as i64,
                    url,
                });
                let s = serde_json::to_string(&json).unwrap().to_string();
                File::create(&path)
                    .unwrap()
                    .write_all(s.as_ref())
                    .expect("TODO: panic message");
            }
            Err(_) => {
                let mut json: Vec<UploadedFile> = serde_json::from_str(cfg.as_str()).unwrap();
                json.push(UploadedFile {
                    path: file_path.as_os_str().to_str().unwrap().to_string(),
                    deletion_url,
                    name: file_path.file_name().unwrap().to_str().unwrap().to_string(),
                    size: 0i64,
                    url,
                });
                let s = serde_json::to_string(&json).unwrap().to_string();
                File::create(&path)
                    .unwrap()
                    .write_all(s.as_ref())
                    .expect("TODO: panic message");
            }
        },
        Err(ref e) if e.kind() == std::io::ErrorKind::NotFound => {
            File::create(&path)
                .unwrap()
                .write_all(b"[]")
                .expect("TODO: panic message");
        }
        Err(err) => {
            sentry::capture_error(&err);
        }
    }
}
