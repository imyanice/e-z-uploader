use crate::upload::upload_file_to_host;
use arboard::Clipboard;
use reqwest::header::USER_AGENT;
use std::fs::File;
use std::io::Write;
use std::string::String;
use std::{fs, process::Command, thread, time};
use tauri::api::dialog::{message, FileDialogBuilder};
use tauri::api::process::restart;
use tauri::api::shell::open;
use tauri::Manager;

use crate::utils::get_screenshot_dir;
use tauri::api::notification::Notification;
use tauri::{regex::Regex, AppHandle};

fn create_directory() -> Result<(), String> {
    let path = get_screenshot_dir();
    fs::create_dir_all(path).map_err(|e| format!("{}", e))
}

#[tauri::command]
pub fn get_api_key(app_handle: tauri::AppHandle) -> String {
    let config = crate::config::get_config(&app_handle);

    config.api_key
}

#[tauri::command]
pub fn is_setup(app_handle: tauri::AppHandle) -> bool {
    let config = crate::config::get_config(&app_handle);

    config.setup
}

#[tauri::command]
pub fn get_upload_url(app_handle: tauri::AppHandle) -> String {
    let config = crate::config::get_config(&app_handle);

    config.upload_url
}

#[tauri::command]
pub fn set_api_key(app_handle: tauri::AppHandle, api_key: String) {
    let client = reqwest::blocking::Client::new();
    let r = client
        .get("https://api.e-z.gg/app?key=".to_owned() + &api_key.clone())
        .header(USER_AGENT, "i hate cloudflear")
        .send()
        .unwrap();

    if r.status().is_success() {
        let mut config = crate::config::get_config(&app_handle);
        config.api_key = api_key;
        crate::config::set_config(&app_handle, config);
    } else {
        let main_window = app_handle.get_window("local").unwrap();
        message(
            Some(&main_window),
            "Uh Oh...",
            "Please provide a valid API key.",
        );
    }
}

#[tauri::command]
pub fn set_upload_url(app_handle: tauri::AppHandle, upload_url: String) {
    let upload_url_regex = Regex::new(r"https:\/\/.*\.e-z\.(?:...|....)\/files").unwrap();

    if upload_url_regex.is_match(&upload_url) {
        let mut config = crate::config::get_config(&app_handle);

        config.upload_url = upload_url;

        crate::config::set_config(&app_handle, config);
    } else if upload_url == "dick" {
        open(&app_handle.shell_scope(), "https://cdn.discordapp.com/attachments/999709029536374934/1030179201229262868/togif.gif?ex=65c517a5&is=65b2a2a5&hm=d43794a47202c873217eded4965ba6e9e3597ce44798c0c08e97f0621b7f95a7&", None).expect("could not open url");
    } else {
        let main_window = app_handle.get_window("local").unwrap();
        message(
            Some(&main_window),
            "Uh Oh...",
            "Please provide a valid upload url.",
        );
    }
}

#[tauri::command]
pub fn setup(app_handle: tauri::AppHandle) {
    let mut config = crate::config::get_config(&app_handle);
    return if config.setup {
        let main_window = app_handle.get_window("local").unwrap();
        message(Some(&main_window), "Uh Oh...", "How did we get there?");
    } else if !config.api_key.is_empty() {
        config.setup = true;
        crate::config::set_config(&app_handle, config);
        if cfg!(target_os = "macos") {
            Command::new("sh")
                .arg("-c")
                .arg("defaults write com.apple.screencapture location ~/screenshots")
                .output()
                .expect("failed to execute process");
            Command::new("sh")
                .arg("-c")
                .arg("defaults write com.apple.screencapture disable-shadow -bool true")
                .output()
                .expect("failed to execute process");
            Command::new("sh")
                .arg("-c")
                .arg("defaults write pl.maketheweb.cleanshotx exportPath ~/screenshots")
                .output()
                .expect("failed to execute process");
            Command::new("sh")
                .arg("-c")
                .arg("defaults write cc.ffitch.shottr defaultFolder ~/screenshots")
                .output()
                .expect("failed to execute process");
        }

        let directory_creation_output = create_directory();
        match directory_creation_output {
            Ok(()) => {
                Notification::new(app_handle.config().tauri.bundle.identifier.clone())
                    .title("Setup completed!")
                    .body("The uploader is now living in your task bar.")
                    .show()
                    .expect("error while showing notification");
                thread::sleep(time::Duration::from_millis(1000));
                restart(&app_handle.env());
            }
            Err(_e) => (),
        };
    } else if Manager::windows(&app_handle).is_empty() {
        panic!("no main window created")
    } else {
        let main_window = app_handle.get_window("local").unwrap();
        message(
            Some(&main_window),
            "Uh Oh...",
            "We're missing your API Key, please provide one.",
        );
    };
}

#[tauri::command]
pub fn upload_count(app_handle: AppHandle) -> i64 {
    let config = crate::config::get_config(&app_handle);

    config.upload_count
}

#[tauri::command]
pub fn ss_folder_size(_app_handle: AppHandle) -> u64 {
    return match home::home_dir() {
        Some(path) if !path.as_os_str().is_empty() => {
            let str_path = get_screenshot_dir();
            return fs_extra::dir::get_size(str_path).unwrap_or(0);
        }
        _ => 0,
    };
}

#[tauri::command]
pub fn set_auto_wipe(app_handle: AppHandle) -> bool {
    let mut config = crate::config::get_config(&app_handle);
    config.auto_wipe = !config.auto_wipe;
    let value = config.auto_wipe;
    crate::config::set_config(&app_handle, config);
    value
}

#[tauri::command]
pub fn auto_wipe_on(app_handle: AppHandle) -> bool {
    let config = crate::config::get_config(&app_handle);

    config.auto_wipe
}
#[tauri::command]
pub fn select_files_to_upload(app_handle: AppHandle) {
    let path = get_screenshot_dir();
    println!("{:?}", path);
    FileDialogBuilder::new()
        .add_filter(
            "Allowed files",
            &[
                "png", "jpg", "jpeg", "gif", "bmp", "webp", "zip", "exe", "mov", "mp4", "mp3",
                "app", "dmg",
            ],
        )
        .set_title("Choose a file to upload.")
        .set_directory(path)
        .set_parent(&app_handle.get_window("local").unwrap())
        .pick_file(move |file| match file {
            None => {}
            Some(path) => upload_file_to_host(&path, &app_handle),
        });
}

#[tauri::command]
pub fn write_to_cb(_app_handle: AppHandle, text: String) {
    let mut clipboard = Clipboard::new().unwrap();
    clipboard.set_text(text).expect("TODO: panic message");
}

#[tauri::command]
pub fn delete_file(app_handle: AppHandle, file_path: String, index: i64) {
    fs::remove_file(file_path).expect("TODO: panic message");
    let path = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .join("uploaded_files.json");
    match fs::read_to_string(&path) {
        Ok(cfg) => {
            let mut json: Vec<crate::upload::UploadedFile> =
                serde_json::from_str(cfg.as_str()).unwrap();
            json.remove(index as usize);
            let s = serde_json::to_string(&json).unwrap().to_string();
            File::create(&path)
                .unwrap()
                .write_all(s.as_ref())
                .expect("TODO: panic message");
        }
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

#[tauri::command]
pub fn reset_settings(app_handle: AppHandle) {
    let main_window = app_handle.get_window("local").unwrap();
    tauri::api::dialog::ask(
        Some(&main_window),
        "Are you really, really, really sure?",
        "This will erase ALL of your saved data (screenshots will be kept).",
        move |answer| {
            if answer {
                let path = app_handle.path_resolver().app_data_dir().unwrap();
                fs::remove_dir_all(path).expect("Failed resetting config!!");
                restart(&app_handle.env());
            }
        },
    )
}
