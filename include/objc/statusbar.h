#import <AppKit/AppKit.h>
#ifndef UPLOADER_OBJC_STATUSBAR_H
#define UPLOADER_OBJC_STATUSBAR_H 1
@interface StatusBarActionController : NSMenu
@property(strong) NSMenuItem *enable_autodelete;
@property(strong) NSMenuItem *shottr_location;
@property(strong) NSMenuItem *screenshot_location;
@property(strong) NSMenuItem *cleanshotx_location;
+ (instancetype)sharedController;
- (void)handle_api_key_item:(id)sender;
- (void)setup;
@end
#endif
