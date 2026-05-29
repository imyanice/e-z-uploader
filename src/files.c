#include "config.h"
#include "fetch.h"
#include "utils.h"
#include <CoreFoundation/CoreFoundation.h>
#include <CoreServices/CoreServices.h>
#include <stdio.h>
#include <sys/stat.h>

#define has_flag(v, flag) ((v & flag) == flag)
static dispatch_queue_t file_creation_queue = NULL;
static FSEventStreamRef current_fs_stream = NULL;

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

		// printf("'%s': flag: %04x, id: %llu, birth: %li\n",
		// 	   path_parts[path_parts_length - 1], eventFlags[i], eventIds[i],
		// 	   candidate_state.st_birthtimespec.tv_sec);
		printf("[C] - Uploading file\n");
		if (upload_file(paths[i], api_key_header) && autodelete) {
			unlink(paths[i]);
		};
		free(duped_path);
		free(path_parts);
	}
}

void watch_directory(char *path) {

	printf("[C] - Watching directory: %s\n", path);

	CFStringRef path_cfstr =
		CFStringCreateWithCString(NULL, path, kCFStringEncodingUTF8);
	const void *CFPaths[] = {path_cfstr};
	CFArrayRef paths = CFArrayCreate(NULL, (void *)CFPaths, 1, NULL);

	if (current_fs_stream) {
		FSEventStreamStop(current_fs_stream);
		FSEventStreamRelease(current_fs_stream);
	}

	current_fs_stream = FSEventStreamCreate(NULL, callback, NULL, paths,
											kFSEventStreamEventIdSinceNow, 1,
											kFSEventStreamCreateFlagFileEvents);
	if (!file_creation_queue) {
		file_creation_queue = dispatch_queue_create(
			"me.yanice.e-z-uploader.file-watcher", DISPATCH_QUEUE_SERIAL);
	}

	FSEventStreamRetain(current_fs_stream);
	FSEventStreamSetDispatchQueue(current_fs_stream, file_creation_queue);
	FSEventStreamStart(current_fs_stream);
}
