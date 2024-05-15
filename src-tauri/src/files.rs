use arboard::{Clipboard, ImageData};
use image::io::Reader as ImageReader;
use std::{borrow::Cow, path::Path};

#[cfg(target_os = "macos")]
pub fn copy_image_to_clipboard(path: &Path) {
    if path.ends_with("png")
        || path.ends_with("jpg")
        || path.ends_with("jpeg")
        || path.ends_with("gif")
        || path.ends_with("webp")
    {
        let file = ImageReader::open(path).expect("Could not open image");

        let image = file.decode().expect("Could not decode image");

        let mut clipboard = Clipboard::new().unwrap();

        let img_data = ImageData {
            width: usize::try_from(image.width()).expect("Could not convert width"),
            height: usize::try_from(image.height()).expect("Could not convert height"),
            bytes: Cow::Borrowed(image.as_bytes()),
        };
        match clipboard.set_image(img_data) {
            Ok(_) => (),
            Err(e) => {
                sentry::capture_error(&e);
            }
        }
    }
}

pub fn is_image(path: &Path) -> bool {
    let ext = path.extension().unwrap().to_str().unwrap();
    matches!(
        ext,
        "png"
            | "jpg"
            | "jpeg"
            | "gif"
            | "bmp"
            | "webp"
            | "zip"
            | "exe"
            | "mov"
            | "mp4"
            | "mp3"
            | "app"
            | "dmg"
    )
}

pub fn delete_file(file: &Path) {
    std::fs::remove_file(file).expect("Could not delete file");
}
