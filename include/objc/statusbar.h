#import "../statusbar.h"
#import <AppKit/AppKit.h>
#ifndef UPLOADER_OBJC_STATUSBAR_H
#define UPLOADER_OBJC_STATUSBAR_H 1
@interface StatusBarActionController : NSMenu
@property(strong) NSMenuItem *enable_autodelete;
@property(strong) NSMenuItem *shottr_location;
@property(strong) NSMenuItem *screenshot_location;
@property(strong) NSMenuItem *cleanshotx_location;
@property(strong) NSMenuItem *toggle_launch_agent;
@property(strong) NSMenuItem *location_menu_holder;
@property(strong) NSMenuItem *upload_files_item;
+ (instancetype)sharedController;
- (void)handle_api_key_item:(id)sender;
- (void)setup;
- (void)update_dir_size_badge;
- (void)update_upload_count_badge;
@end
#endif
