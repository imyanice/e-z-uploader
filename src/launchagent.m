#import "objc/launchagent.h"
#import "Foundation/Foundation.h"
static int launch_agent_enabled = -1;
static NSString *launchAgentPlistPath(void) {
    return [NSHomeDirectory()
        stringByAppendingPathComponent:@"Library/LaunchAgents/me.yanice.e-z-uploader.plist"];
}

BOOL isLaunchAgentInstalled(void) {
    if (launch_agent_enabled == -1)
        launch_agent_enabled =
            [[NSFileManager defaultManager] fileExistsAtPath:launchAgentPlistPath()] ? 1 : 0;
    return launch_agent_enabled == 1;
}

void toggle_launch_agent() {
    NSString *path = launchAgentPlistPath();
    if (!isLaunchAgentInstalled()) {
        NSDictionary *plist = @{
            @"Label" : [[NSBundle mainBundle] bundleIdentifier],
            @"ProgramArguments" : @[ @"/usr/bin/open", [[NSBundle mainBundle] bundlePath] ],
            @"RunAtLoad" : @YES,
        };
        [plist writeToFile:path atomically:YES];
        launch_agent_enabled = 1;
    } else {
        [[NSFileManager defaultManager] removeItemAtPath:path error:nil];
        launch_agent_enabled = 0;
    }
}
