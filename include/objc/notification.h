#import "../notification.h"

#import <UserNotifications/UserNotifications.h>
#ifndef UPLOADER_OBJC_NOTIFICATION_H
#define UPLOADER_OBJC_NOTIFICATION_H 1
@interface NotificationHandler : NSObject <UNUserNotificationCenterDelegate>
+ (instancetype)sharedDelegate;
- (void)setup;
@end
#endif
