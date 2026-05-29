#import "../config.h"
#import <Foundation/Foundation.h>
#import <stdbool.h>

#ifndef UPLOADER_OBJC_CONFIG_H
#define UPLOADER_OBJC_CONFIG_H 1

NSString *get_api_key(void);
void set_api_key(NSString *val);

void set_autodelete(BOOL val);
bool get_autodelete(void);

void update_prefs(void);
#endif
