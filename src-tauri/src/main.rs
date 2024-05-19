#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod config;
mod files;
mod listeners;
mod upload;
mod utils;

use crate::utils::get_screenshot_dir;
use sentry::User;
use std::thread;
use tauri::regex::Regex;
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri_plugin_autostart::MacosLauncher;

fn main() {
    let _guard = sentry::init(("", sentry::ClientOptions {
        release: Some("me.yanice.e-z-uploader@2.0.2".into()),
        environment: Some("production".into()),
        ..Default::default()
    }));

    let mut app = tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .system_tray(get_system_tray())
        .on_system_tray_event(handle_tray_click)
        .invoke_handler(tauri::generate_handler![
            commands::get_api_key,
            commands::set_api_key,
            commands::setup,
            commands::set_upload_url,
            commands::get_upload_url,
            commands::is_setup,
            commands::upload_count,
            commands::ss_folder_size,
            commands::auto_wipe_on,
            commands::set_auto_wipe,
            commands::select_files_to_upload,
            commands::write_to_cb,
            commands::delete_file,
            commands::reset_settings,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    let app_handle = app.handle();
    let base_config = config::get_config(&app_handle);

    let user;
    if base_config.api_key.is_empty() {
        user = Some(User {
            username: Some(get_screenshot_dir().to_str().unwrap().into()),
            ..Default::default()
        });
    } else {
        let re = Regex::new(r"^[^_]+").unwrap();

        if let Some(mat) = re.find(base_config.api_key.as_str()) {
            user = Some(User {
                username: Some(mat.as_str().into()),
                ..Default::default()
            });
        } else {
            user = Some(User {
                username: Some(get_screenshot_dir().to_str().unwrap().into()),
                ..Default::default()
            });
        }
    }
    sentry::configure_scope(|scope| {
        scope.set_user(user.clone());
    });

    if base_config.upload_url.is_empty() {
        let mut config_with_upload_url = config::get_config(&app_handle);
        config_with_upload_url.upload_url = "https://api.e-z.host/files".to_string();
        config::set_config(&app_handle, config_with_upload_url);
    }
    // let version = reqwest::blocking::get("https://github.com/imyanice/e-z-uploader/raw/main/.version").unwrap().text().unwrap();
    // if version != app.package_info().version.to_string() + "\n" {
    //     tauri::api::notification::Notification::new(app_handle.config().tauri.bundle.identifier.clone()).title("New update available").body("Download it from your dashboard/the GitHub page.").show().expect("could not show update notification");
    // }

    if base_config.setup {
        #[cfg(target_os = "macos")]
        app.set_activation_policy(tauri::ActivationPolicy::Accessory);

        thread::spawn(move || {
            listeners::watch_file_system(app_handle);
        });
    } else {
        tauri::WindowBuilder::new(&app, "local", tauri::WindowUrl::App("index.html".into()))
            .title("E-Z Services")
            .inner_size(1200f64, 600f64)
            .min_inner_size(730f64, 600f64)
            .center()
            .build()
            .expect("Could not start window");
    }

    app.run(move |_app_handle, event| {
        if let tauri::RunEvent::ExitRequested { api, .. } = event {
            if base_config.setup {
                api.prevent_exit();
            }
        }
    });
}

fn get_system_tray() -> SystemTray {
    let title = CustomMenuItem::new("title", "E-Z Services Uploader").disabled();

    let options = CustomMenuItem::new("options".to_string(), "Open settings");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    let tray_menu = SystemTrayMenu::new()
        .add_item(title)
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(options)
        .add_item(quit);

    SystemTray::new().with_menu(tray_menu)
}

fn handle_tray_click(app: &tauri::AppHandle, event: SystemTrayEvent) {
    if let SystemTrayEvent::MenuItemClick { id, .. } = event {
        match id.as_str() {
            "options" => {
                if Manager::windows(app).is_empty() {
                    tauri::WindowBuilder::new(
                        app,
                        "local",
                        tauri::WindowUrl::App("index.html".into()),
                    )
                    .inner_size(1200f64, 600f64)
                    .min_inner_size(730f64, 600f64)
                    .center()
                    .title("E-Z Services")
                    .build()
                    .expect("error while creating local window");
                } else {
                    let main_window = app.get_window("local").unwrap();
                    main_window.set_focus().expect("TODO: panic message");
                }
            }
            "quit" => {
                std::process::exit(0);
            }
            _ => {}
        }
    }
}
