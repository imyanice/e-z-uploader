#import "objc/config.h"
#import <Foundation/Foundation.h>

bool autodelete = NO;
char *api_key_header = NULL;
char *watch_path = NULL;

NSString *get_api_key(void) { return [[NSUserDefaults standardUserDefaults] stringForKey:@"key"]; }
void set_api_key(NSString *val) {
    [[NSUserDefaults standardUserDefaults] setValue:val forKeyPath:@"key"];
}
void set_watch_path(NSString *val) {
    [[NSUserDefaults standardUserDefaults] setValue:val forKeyPath:@"watch_path"];
}
NSString *get_watch_path(void) {
    return [[NSUserDefaults standardUserDefaults] stringForKey:@"watch_path"];
}
void set_autodelete(BOOL val) {
    return [[NSUserDefaults standardUserDefaults] setBool:val forKey:@"autodelete"];
}
bool get_autodelete(void) {
    return [[NSUserDefaults standardUserDefaults] boolForKey:@"autodelete"];
}
char *get_utf8_string_for_space_and_key(NSString *domain, NSString *key) {
    NSUserDefaults *screenshot_app_defaults = [[NSUserDefaults alloc] initWithSuiteName:domain];
    NSString *default_screenshots_folder_location = /* lazy */
        screenshot_app_defaults ? [screenshot_app_defaults stringForKey:key]
                                      ? [screenshot_app_defaults stringForKey:key]
                                      : @""
                                : @"";
    return strdup([default_screenshots_folder_location UTF8String]);
}
void update_prefs(void) {
    autodelete = get_autodelete();

    NSString *key = get_api_key();
    NSString *header = [@"key: " stringByAppendingString:key];

    free(api_key_header);
    api_key_header = strdup([header UTF8String]);

    NSString *watch_path_cfg = get_watch_path();
    free(watch_path);
    if ([watch_path_cfg isEqualToString:@"SCREENSHOT.APP"]) {
        watch_path = get_utf8_string_for_space_and_key(@"com.apple.screencapture", @"location");
    } else if ([watch_path_cfg isEqualToString:@"SHOTTR.APP"]) {
        watch_path = get_utf8_string_for_space_and_key(@"cc.ffitch.shottr", @"defaultFolder");
    } else if ([watch_path_cfg isEqualToString:@"CLEANSHOTX.APP"]) {
        watch_path = get_utf8_string_for_space_and_key(@"pl.maketheweb.cleanshotx", @"exportPath");
    } else {
        watch_path = strdup([watch_path_cfg UTF8String]);
    }

    NSLog(@"autodelete: %@", autodelete ? @"YES" : @"NO");
    NSLog(@"watch_path: %@", watch_path_cfg);
}
