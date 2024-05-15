use notify::event::{CreateKind, ModifyKind};
use notify::{Config, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::sync::mpsc::channel;

use crate::utils::get_screenshot_dir;
use crate::{files, upload};

pub fn watch_file_system(app: tauri::AppHandle) {
    let mut last_image = String::new();

    let path = get_screenshot_dir();

    let (tx, rx) = channel();

    let mut watcher = RecommendedWatcher::new(tx, Config::default()).unwrap();

    watcher
        .watch(path.as_ref(), RecursiveMode::NonRecursive)
        .unwrap();

    loop {
        for res in &rx {
            match res {
                Ok(event) => {
                    if event.kind == EventKind::Create(CreateKind::File) && event.kind == EventKind::Modify(ModifyKind::Any)
                        && last_image != event.paths[0].to_str().unwrap()
                        && files::is_image(&event.paths[0])
                    {
                        last_image = event.paths[0].to_str().unwrap().to_owned();
                        #[cfg(target_os = "macos")]
                        files::copy_image_to_clipboard(event.paths[0].as_path());
                        upload::upload_file_to_host(event.paths[0].as_path(), &app);
                    }
                }
                Err(error) => {
                    sentry::capture_error(&error);
                }
            }
        }
    }
}
