#include "fetch.h"
#include "json.h"
#include "notification.h"
#include "utils.h"
#include <CoreFoundation/CoreFoundation.h>
#include <CoreServices/CoreServices.h>
#include <curl/curl.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

#define has_flag(v, flag) ((v & flag) == flag)
void callback(ConstFSEventStreamRef streamRef, void *clientCallBackInfo,
			  size_t numEvents, void *eventPaths,
			  const FSEventStreamEventFlags *eventFlags,
			  const FSEventStreamEventId *eventIds) {

	char **paths = eventPaths;
	for (size_t i = 0; i < numEvents; i++) {
		unsigned int flags = eventFlags[i];
		if (!has_flag(flags, kFSEventStreamEventFlagItemIsFile))
			continue;
		size_t path_parts_length = 0;
		char *duped_path = strdup(paths[i]);
		char **path_parts = split(duped_path, "/", &path_parts_length);
		char *filename = path_parts[path_parts_length - 1];
		if (filename[0] == '.' || filename[0] == '\0') {
			free(duped_path);
			free(path_parts);
			continue;
		}
		if (!has_flag(flags, kFSEventStreamEventFlagItemCreated) &&
			!has_flag(flags, kFSEventStreamEventFlagItemRenamed)) {
			free(duped_path);
			free(path_parts);
			continue;
		}
		struct stat candidate_state = {0};
		if (lstat(paths[i], &candidate_state) == -1) {
			perror("error with lstat");
			free(duped_path);
			free(path_parts);
			continue;
		}

		time_t now = time(NULL);
		long dt = labs(now - candidate_state.st_birthtimespec.tv_sec);
		if (dt > 5) {
			free(duped_path);
			free(path_parts);
			continue;
		}

		printf("'%s': flag: %04x, id: %llu, birth: %li\n",
			   path_parts[path_parts_length - 1], eventFlags[i], eventIds[i],
			   candidate_state.st_birthtimespec.tv_sec);
		bool autodelete = get_autodelete_c();
		printf("[C] - Making request with %s\n", get_api_key_header_c());
		printf("[C] - Autodelete: %s\n", get_autodelete_c() ? "YES" : "NO");
		if (upload_file(paths[i], get_api_key_header_c()) && autodelete) {
			unlink(paths[i]);
		};
		free(duped_path);
		free(path_parts);
	}
}

int main(void) {
	uploader_init();
	if (!fetch_init())
		return 1;

	CFStringRef path = CFStringCreateWithCString(
		NULL, "/Users/yanjobs/screenshots", kCFStringEncodingUTF8);
	const void *CFPaths[] = {path};
	CFArrayRef paths = CFArrayCreate(NULL, (void *)CFPaths, 1, NULL);

	dispatch_queue_t q = dispatch_queue_create(
		"me.yanice.e-z-uploader.file-watcher", DISPATCH_QUEUE_SERIAL);

	FSEventStreamRef file_events_stream = FSEventStreamCreate(
		NULL, callback, NULL, paths, kFSEventStreamEventIdSinceNow, 1,
		kFSEventStreamCreateFlagFileEvents);

	FSEventStreamSetDispatchQueue(file_events_stream, q);
	FSEventStreamStart(file_events_stream);
	uploader_run();
}
