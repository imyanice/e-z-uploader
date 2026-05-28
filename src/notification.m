#import "fetch.h"
#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#import <UserNotifications/UserNotifications.h>

NSString *get_api_key(void) { return [[NSUserDefaults standardUserDefaults] stringForKey:@"key"]; }
void set_api_key(NSString *val) {
    return [[NSUserDefaults standardUserDefaults] setValue:val forKeyPath:@"key"];
}
void set_autodelete(BOOL val) {
    return [[NSUserDefaults standardUserDefaults] setBool:val forKey:@"autodelete"];
}
BOOL get_autodelete(void) {
    return [[NSUserDefaults standardUserDefaults] boolForKey:@"autodelete"];
}

@interface DeleteFileDelegate : NSObject <UNUserNotificationCenterDelegate>
@end
@implementation DeleteFileDelegate
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void (^)(void))completionHandler {

    NSString *url = response.notification.request.content.userInfo[@"DELETION_URL"];
    delete_remote_file([url cStringUsingEncoding:NSUTF8StringEncoding]);
    completionHandler();
}
@end

@interface StatusBarActionController : NSMenu
+ (instancetype)sharedController;
- (void)handle_api_key_item:(id)sender;
- (void)setup;
@end
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
    [tray_menu addItem:fake_title];
    [tray_menu addItem:[NSMenuItem separatorItem]];
    [tray_menu addItem:set_key];
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
        NSLog(@"%@", [api_key_field stringValue]);
        set_api_key([api_key_field stringValue]);
    }
    [alert release];
    [api_key_field release];
}
@end

void setupMainMenu(void) {
    NSMenu *mainMenu = [[NSMenu alloc] init];

    NSMenuItem *appMenuItem = [[NSMenuItem alloc] init];
    [mainMenu addItem:appMenuItem];
    NSMenu *appMenu = [[NSMenu alloc] init];
    [appMenu addItemWithTitle:@"Quit Scrubble" action:@selector(terminate:) keyEquivalent:@"q"];
    [appMenuItem setSubmenu:appMenu];

    NSMenuItem *editMenuItem = [[NSMenuItem alloc] init];
    [mainMenu addItem:editMenuItem];
    NSMenu *editMenu = [[NSMenu alloc] initWithTitle:@"Edit"];
    [editMenu addItemWithTitle:@"Undo" action:@selector(undo:) keyEquivalent:@"z"];
    [editMenu addItemWithTitle:@"Redo" action:@selector(redo:) keyEquivalent:@"Z"];
    [editMenu addItem:[NSMenuItem separatorItem]];
    [editMenu addItemWithTitle:@"Cut" action:@selector(cut:) keyEquivalent:@"x"];
    [editMenu addItemWithTitle:@"Copy" action:@selector(copy:) keyEquivalent:@"c"];
    [editMenu addItemWithTitle:@"Paste" action:@selector(paste:) keyEquivalent:@"v"];
    [editMenu addItemWithTitle:@"Select All" action:@selector(selectAll:) keyEquivalent:@"a"];
    [editMenuItem setSubmenu:editMenu];

    [NSApp setMainMenu:mainMenu];
}
void uploader_init() {
    [NSApplication sharedApplication];
    [[NSProcessInfo processInfo] disableSuddenTermination];

    UNNotificationAction *delete_action =
        [UNNotificationAction actionWithIdentifier:@"DELETE_FILE"
                                             title:@"Delete"
                                           options:(UNNotificationActionOptionDestructive)];
    UNNotificationCategory *not_cat = [UNNotificationCategory
        categoryWithIdentifier:@"DELETE_CAT"
                       actions:@[ delete_action ]
             intentIdentifiers:@[]
                       options:UNNotificationCategoryOptionCustomDismissAction];

    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];

    center.delegate = DeleteFileDelegate.alloc;
    [center setNotificationCategories:[NSSet setWithArray:@[ not_cat ]]];

    [[StatusBarActionController sharedController] setup];

    setupMainMenu();
}
void uploader_run(void) { [NSApp run]; }

void display_notification(char *title, char *body, char *url) {
    @autoreleasepool {

        printf("URL: %s\n", url);

        NSString *t = [NSString stringWithUTF8String:title];
        NSString *b = [NSString stringWithUTF8String:body];
        NSString *u = url ? [NSString stringWithUTF8String:url] : nil;

        NSLog(@"NSURL: %@\n", u);

        UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];

        [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert |
                                                 UNAuthorizationOptionSound)
                              completionHandler:^(BOOL granted, NSError *_Nullable error) {
                                  if (!granted) {
                                      if (error)
                                          NSLog(@"notification auth denied: %@", error);
                                      return;
                                  }

                                  UNMutableNotificationContent *content =
                                      [[UNMutableNotificationContent alloc] init];
                                  content.title = t;
                                  content.body = b;
                                  content.sound = UNNotificationSound.defaultSound;
                                  if (u) {
                                      content.userInfo = @{@"DELETION_URL" : u};
                                      content.categoryIdentifier = @"DELETE_CAT";
                                  }

                                  UNNotificationRequest *request = [UNNotificationRequest
                                      requestWithIdentifier:[[NSUUID UUID] UUIDString]
                                                    content:content
                                                    trigger:nil];

                                  [center addNotificationRequest:request
                                           withCompletionHandler:^(NSError *_Nullable error) {
                                               if (error)
                                                   NSLog(@"notification delivery "
                                                         @"failed: %@",
                                                         error);
                                           }];
                              }];
    }
}

void error_notification(char *title, char *body) { display_notification(title, body, NULL); }
