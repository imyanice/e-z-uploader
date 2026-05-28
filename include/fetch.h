#include <stdbool.h>
#ifndef UPLOADER_FETCH_H
#define UPLOADER_FETCH_H 1
void delete_remote_file(const char *url);
bool fetch_init();
bool upload_file(char *path, const char *key);
#endif
