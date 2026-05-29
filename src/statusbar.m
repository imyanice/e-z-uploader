#import "objc/statusbar.h"
#import "fetch.h"
#import "files.h"
#import "objc/config.h"
#import "objc/launchagent.h"
#import "utils.h"
#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>

static off_t upload_dir_size = 0;
static off_t upload_count = 0;

void update_upload_count(unsigned int c) {
    upload_count += c;
    [[NSUserDefaults standardUserDefaults] setInteger:upload_count forKey:@"upload_count"];

    [[StatusBarActionController sharedController] update_upload_count_badge];
}
void init_upload_count() {
    upload_count = [[NSUserDefaults standardUserDefaults] integerForKey:@"upload_count"];
}
void dir_size_updater(off_t file_size) {
    upload_dir_size += file_size;
    [[StatusBarActionController sharedController] update_dir_size_badge];
}

@implementation StatusBarActionController
+ (instancetype)sharedController {
    static StatusBarActionController *sharedController = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{ sharedController = [[StatusBarActionController alloc] init]; });
    return sharedController;
}
- (void)setup {
    /* */
    /* E-Z Uploader */
    /* ------------ */
    /* Set API Key */
    /* Launch at Login */
    /* Screenshots location > */
    /* ------------           Set location manually*/
    /*                        ------------ */
    /* Quit                   Use Screenshot's (default) */
    /*                        Use Shottr's */
    /*                        Use CleanshotX's */

    NSImage *tray_icon = [NSImage imageNamed:@"tray.png"];
    CGFloat height = 18.0;
    NSSize new_size = {.height = height,
                       .width = (height * tray_icon.size.width) / tray_icon.size.height};
    [tray_icon setSize:new_size];

    NSMenuItem *fake_title = [NSMenuItem sectionHeaderWithTitle:@"E-Z Uploader"];

    NSMenuItem *set_key = [[NSMenuItem alloc] initWithTitle:@"Set API Key"
                                                     action:@selector(handle_api_key_item:)
                                              keyEquivalent:@","];
    [set_key setTarget:self];

    _enable_autodelete = [[NSMenuItem alloc] initWithTitle:@"Autodelete files"
                                                    action:@selector(handle_enable_autodelete:)
                                             keyEquivalent:@""];
    _enable_autodelete.state = autodelete ? NSControlStateValueOn : NSControlStateValueOff;
    [_enable_autodelete setTarget:self];

    NSString *current_location = get_watch_path();
    NSMenuItem *set_screenshot_location =
        [[NSMenuItem alloc] initWithTitle:@"Set location"
                                   action:@selector(handle_ss_location_to_custom:)
                            keyEquivalent:@""];
    _screenshot_location =
        [[NSMenuItem alloc] initWithTitle:@"Use Screenshot's (default)"
                                   action:@selector(handle_ss_location_to_default:)
                            keyEquivalent:@""];
    _shottr_location = [[NSMenuItem alloc] initWithTitle:@"Use Shottr's"
                                                  action:@selector(handle_ss_location_to_shottr:)
                                           keyEquivalent:@""];
    _cleanshotx_location =
        [[NSMenuItem alloc] initWithTitle:@"Use CleanShotX's"
                                   action:@selector(handle_ss_location_to_cleanshotx:)
                            keyEquivalent:@""];

    _cleanshotx_location.state =
        ([current_location isEqualToString:@"CLEANSHOTX.APP"] ? NSControlStateValueOn
                                                              : NSControlStateValueOff);
    _shottr_location.state =
        ([current_location isEqualToString:@"SHOTTR.APP"] ? NSControlStateValueOn
                                                          : NSControlStateValueOff);
    _screenshot_location.state =
        ([current_location isEqualToString:@"SCREENSHOT.APP"] ? NSControlStateValueOn
                                                              : NSControlStateValueOff);
    [_screenshot_location setTarget:self];
    [_cleanshotx_location setTarget:self];
    [_shottr_location setTarget:self];
    [set_screenshot_location setTarget:self];

    NSMenu *location_menu = [[NSMenu alloc] initWithTitle:@"Screenshots location"];

    [location_menu addItem:set_screenshot_location];
    [location_menu addItem:[NSMenuItem separatorItem]];
    [location_menu addItem:_screenshot_location];
    [location_menu addItem:_shottr_location];
    [location_menu addItem:_cleanshotx_location];

    _location_menu_holder = [[NSMenuItem alloc] initWithTitle:@"Screenshots location"
                                                       action:NULL
                                                keyEquivalent:@""];

    upload_dir_size = folder_size(watch_path);
    [self update_dir_size_badge];

    _toggle_launch_agent = [[NSMenuItem alloc] initWithTitle:@"Launch at Login"
                                                      action:@selector(handle_toggle_launch_agent:)
                                               keyEquivalent:@""];
    [_toggle_launch_agent setTarget:self];
    _toggle_launch_agent.state =
        isLaunchAgentInstalled() ? NSControlStateValueOn : NSControlStateValueOff;

    NSMenuItem *quit_item = [[NSMenuItem alloc] initWithTitle:@"Quit"
                                                       action:@selector(terminate:)
                                                keyEquivalent:@"q"];

    NSMenu *tray_menu = [[NSMenu alloc] initWithTitle:@"E-Z Uploader"];
    [tray_menu setSubmenu:location_menu forItem:_location_menu_holder];

    [tray_menu addItem:fake_title];
    [tray_menu addItem:[NSMenuItem separatorItem]];
    [tray_menu addItem:set_key];
    [tray_menu addItem:_enable_autodelete];
    [tray_menu addItem:_location_menu_holder];
    [tray_menu addItem:[NSMenuItem separatorItem]];
    [tray_menu addItem:_toggle_launch_agent];
    [tray_menu addItem:quit_item];

    NSStatusItem *status_item =
        [[NSStatusBar systemStatusBar] statusItemWithLength:NSVariableStatusItemLength];
    [status_item button].image = tray_icon;

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
- (void)handle_ss_location_to_default:(id)sender {
    _screenshot_location.state = NSControlStateValueOn;
    _shottr_location.state = NSControlStateValueOff;
    _cleanshotx_location.state = NSControlStateValueOff;

    set_watch_path(@"SCREENSHOT.APP");
    update_prefs();

    upload_dir_size = folder_size(watch_path);
    [self update_dir_size_badge];

    watch_directory(watch_path);
}
- (void)handle_ss_location_to_shottr:(id)sender {
    _screenshot_location.state = NSControlStateValueOff;
    _shottr_location.state = NSControlStateValueOn;
    _cleanshotx_location.state = NSControlStateValueOff;

    set_watch_path(@"SHOTTR.APP");
    update_prefs();

    upload_dir_size = folder_size(watch_path);
    [self update_dir_size_badge];

    watch_directory(watch_path);
}
- (void)handle_ss_location_to_cleanshotx:(id)sender {
    _screenshot_location.state = NSControlStateValueOff;
    _shottr_location.state = NSControlStateValueOff;
    _cleanshotx_location.state = NSControlStateValueOn;

    set_watch_path(@"CLEANSHOTX.APP");
    update_prefs();

    upload_dir_size = folder_size(watch_path);
    [self update_dir_size_badge];

    watch_directory(watch_path);
}
- (void)handle_ss_location_to_custom:(id)sended {
    NSOpenPanel *location_selector = [NSOpenPanel openPanel];
    location_selector.canChooseFiles = NO;
    location_selector.canChooseDirectories = YES;
    location_selector.allowsMultipleSelection = NO;

    NSModalResponse clicked = [location_selector runModal];
    if (clicked != NSModalResponseOK)
        return;
    NSURL *folder = [location_selector URL];

    _screenshot_location.state = NSControlStateValueOff;
    _shottr_location.state = NSControlStateValueOff;
    _cleanshotx_location.state = NSControlStateValueOff;

    set_watch_path([folder path]);
    update_prefs();

    upload_dir_size = folder_size(watch_path);
    [self update_dir_size_badge];

    watch_directory(watch_path);
}
- (void)handle_toggle_launch_agent:(id)sender {
    toggle_launch_agent();
    _toggle_launch_agent.state =
        isLaunchAgentInstalled() ? NSControlStateValueOn : NSControlStateValueOff;
}
- (void)update_dir_size_badge {
    NSMenuItemBadge *location_menu_holder_badge = [[NSMenuItemBadge alloc]
        initWithString:[NSByteCountFormatter
                           stringFromByteCount:upload_dir_size
                                    countStyle:NSByteCountFormatterCountStyleFile]];

    _location_menu_holder.badge = location_menu_holder_badge;
}
- (void)update_upload_count_badge {
    NSMenuItemBadge *upload_files_item_badge = [[NSMenuItemBadge alloc]
        initWithString:[NSString stringWithFormat:@"%llu File%s", upload_count,
                                                  upload_count > 1 ? "s" : ""]];

    _upload_files_item.badge = upload_files_item_badge;
}
@end
