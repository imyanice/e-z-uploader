#import "objc/statusbar.h"
#import "objc/config.h"
#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>

@implementation StatusBarActionController
+ (instancetype)sharedController {
    static StatusBarActionController *sharedController = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{ sharedController = [[StatusBarActionController alloc] init]; });
    return sharedController;
}
- (void)setup {
    NSStatusItem *status_item =
        [[NSStatusBar systemStatusBar] statusItemWithLength:NSVariableStatusItemLength];
    [status_item button].alternateImage = nil;

    NSImage *tray_icon = [NSImage imageNamed:@"tray.png"];
    CGFloat height = 18.0;
    NSSize new_size = {.height = height,
                       .width = (height * tray_icon.size.width) / tray_icon.size.height};
    [tray_icon setSize:new_size];
    [status_item button].image = tray_icon;

    NSMenu *tray_menu = [[NSMenu alloc] initWithTitle:@"E-Z Uploader"];
    NSMenuItem *fake_title = [[NSMenuItem alloc] initWithTitle:@"E-Z Uploader"
                                                        action:NULL
                                                 keyEquivalent:@""];
    fake_title.enabled = NO;

    NSMenuItem *set_key = [[NSMenuItem alloc] initWithTitle:@"Set API Key"
                                                     action:@selector(handle_api_key_item:)
                                              keyEquivalent:@","];
    [set_key setTarget:self];

    _enable_autodelete = [[NSMenuItem alloc] initWithTitle:@"Autodelete files"
                                                    action:@selector(handle_enable_autodelete:)
                                             keyEquivalent:@""];
    _enable_autodelete.state = autodelete ? NSControlStateValueOn : NSControlStateValueOff;
    [_enable_autodelete setTarget:self];

    [tray_menu addItem:fake_title];
    [tray_menu addItem:[NSMenuItem separatorItem]];
    [tray_menu addItem:set_key];
    [tray_menu addItem:_enable_autodelete];
    [status_item setMenu:tray_menu];
}
- (void)handle_api_key_item:(id)sender {
    [NSApp activateIgnoringOtherApps:YES];
    NSTextField *api_key_field = [[NSTextField alloc] initWithFrame:NSMakeRect(0, 0, 300, 22)];
    api_key_field.placeholderString = @"API Key";
    NSAlert *alert = [[NSAlert alloc] init];
    [alert addButtonWithTitle:@"Save"];
    [alert addButtonWithTitle:@"Cancel"];

    alert.messageText = @"API Key";
    [alert setInformativeText:@"Set your upload API Key. Get it @ https://e-z.gg"];
    alert.accessoryView = api_key_field;
    NSInteger button = [alert runModal];
    if (button == NSAlertFirstButtonReturn) {
        set_api_key([api_key_field stringValue]);
        update_prefs();
    }
}
- (void)handle_enable_autodelete:(id)sender {
    set_autodelete(!autodelete);
    _enable_autodelete.state = !autodelete ? NSControlStateValueOn : NSControlStateValueOff;
    update_prefs();
}
@end
