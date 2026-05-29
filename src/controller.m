#import "objc/config.h"
#import "objc/notification.h"
#import "objc/statusbar.h"
#import <AppKit/AppKit.h>
void setupMainMenu(void) {
    NSMenu *mainMenu = [[NSMenu alloc] init];

    NSMenuItem *appMenuItem = [[NSMenuItem alloc] init];
    [mainMenu addItem:appMenuItem];
    NSMenu *appMenu = [[NSMenu alloc] init];
    [appMenu addItemWithTitle:@"Quit E-Z Uploader" action:@selector(terminate:) keyEquivalent:@"q"];
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
    [[NSUserDefaults standardUserDefaults] registerDefaults:@{@"key" : @"", @"autodelete" : @NO}];
    update_prefs();

    [[NotificationHandler sharedDelegate] setup];
    [[StatusBarActionController sharedController] setup];

    setupMainMenu();
}
void uploader_run(void) { [NSApp run]; }
