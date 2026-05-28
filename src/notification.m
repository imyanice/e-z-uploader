#import "fetch.h"
#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#import <UserNotifications/UserNotifications.h>
@interface DeleteFileDelegate : NSObject <UNUserNotificationCenterDelegate>
@end
@implementation DeleteFileDelegate
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void (^)(void))completionHandler {

    NSString *url = response.notification.request.content.userInfo[@"DELETION_URL"];
    delete_remote_file(url.cString);
    completionHandler();
}
@end

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
