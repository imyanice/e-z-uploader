use crate::config;
use std::path::PathBuf;
use tauri::AppHandle;

pub fn add_int_to_uploaded_files(app_handle: &AppHandle) {
    let mut config = config::get_config(app_handle);

    config.upload_count += 1;

    config::set_config(app_handle, config)
}

pub fn get_screenshot_dir() -> PathBuf {
    if cfg!(windows) {
        home::home_dir()
            .unwrap()
            .join("Pictures")
            .join("Screenshots")
    } else {
        home::home_dir().unwrap().join("screenshots")
    }
}
