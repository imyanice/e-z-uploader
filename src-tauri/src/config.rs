use serde::{Deserialize, Serialize};
#[derive(Debug, Deserialize, Serialize, Default)]
pub struct UserConfig {
    pub api_key: String,
    pub setup: bool,
    pub upload_url: String,
    pub upload_count: i64,
    pub auto_wipe: bool,
}

pub fn get_config(app: &tauri::AppHandle) -> UserConfig {
    let path = app
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .join("config.toml");

    let config: UserConfig = confy::load_path(path).expect("Could not load config");

    config
}

pub fn set_config(app: &tauri::AppHandle, config: UserConfig) {
    let path = app
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .join("config.toml");

    confy::store_path(path, config).expect("Could not save config");
}
