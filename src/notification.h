#ifndef UPLOADER_NOTIFICATION_H
#define UPLOADER_NOTIFICATION_H 1
void display_notification(char *title, char *body, char *url);
void uploader_init();
void uploader_run(void);
void error_notification(char *title, char *body);

bool get_autodelete_c(void);
const char *get_api_key_header_c();
#endif
