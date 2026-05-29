#import "objc/config.h"
#import <Foundation/Foundation.h>

static bool autodelete = NO;
static char *api_key_header = NULL;
NSString *get_api_key(void) { return [[NSUserDefaults standardUserDefaults] stringForKey:@"key"]; }
void set_api_key(NSString *val) {
    [[NSUserDefaults standardUserDefaults] setValue:val forKeyPath:@"key"];
}
void set_autodelete(BOOL val) {
    return [[NSUserDefaults standardUserDefaults] setBool:val forKey:@"autodelete"];
}

bool get_autodelete(void) {
    return [[NSUserDefaults standardUserDefaults] boolForKey:@"autodelete"];
}

void update_prefs(void) {
    autodelete = get_autodelete();

    NSString *key = get_api_key();
    if (!key)
        key = @"";
    NSString *header = [@"key: " stringByAppendingString:key];

    free(api_key_header);
    api_key_header = strdup([header UTF8String]);

    NSLog(@"%s", api_key_header);
    NSLog(@"autodelete: %s", autodelete ? "YES" : "NO");
}
