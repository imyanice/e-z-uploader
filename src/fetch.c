#include "json.h"
#include "notification.h"
#include "utils.h"
#include <curl/curl.h>
#include <string.h>
static vector curl_body = {.data = NULL, .len = 0, .size = 0};

CURL *curl;
void delete_remote_file(const char *url) {
  if (!curl)
    return;
  curl_easy_setopt(curl, CURLOPT_URL, url);
  curl_easy_perform(curl);
}

void upload_file(char *path) {
  if (!path)
    return;
  curl_body.len = 0;

  struct curl_slist *headers = curl_slist_append(NULL, "key: ");

  curl_mime *cmime = curl_mime_init(curl);
  curl_mimepart *file_part = curl_mime_addpart(cmime);
  curl_mime_name(file_part, "file");
  curl_mime_filedata(file_part, path);

  curl_easy_setopt(curl, CURLOPT_URL, "https://api.e-z.host/files");
  curl_easy_setopt(curl, CURLOPT_USERAGENT, "e-z uploader v3");
  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
  curl_easy_setopt(curl, CURLOPT_MIMEPOST, cmime);
  curl_easy_setopt(curl, CURLOPT_HEADERFUNCTION, fwrite);
  curl_easy_setopt(curl, CURLOPT_HEADERDATA, stdout);

  curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, cwrite_data);
  curl_easy_setopt(curl, CURLOPT_WRITEDATA, &curl_body);

  CURLcode cresult = curl_easy_perform(curl);

  long response_code;
  curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &response_code);
  if (cresult != CURLE_OK) {
    error_notification("Failed to upload file!", "An internal error occured!");
    goto cleanup;
  } else if (response_code == 413) {
    error_notification("Failed to upload file!",
                       "Your file exceeds the upload limit!");
    goto cleanup;
  } else if (response_code == 403) {
    error_notification("Invalid API Key!",
                       "Set your API Key in the tray menue");
    goto cleanup;
  } else if (response_code != 200) {
    error_notification("Failed to upload file!", "Non 200 exit code.");
    goto cleanup;
  }

  JSONElement *JSON_response = JSON_parse((char *)curl_body.data);

  JSONElement *image_url = JSON_get("imageUrl", JSON_response);
  if (!image_url || image_url->JSONType != JSONType_STRING) {
    error_notification("Failed to upload file!", "Invalid JSON.");
    goto cleanup;
  }
  JSONElement *deletion_url = JSON_get("deletionUrl", JSON_response);
  if (!deletion_url || deletion_url->JSONType != JSONType_STRING) {
    error_notification("Failed to upload file!", "Invalid JSON.");
    goto cleanup;
  }
  FILE *clipboard = popen("pbcopy", "w");
  fwrite(image_url->value.string, 1, strlen(image_url->value.string),
         clipboard);
  pclose(clipboard);

  display_notification("File uploaded!",
                       "The URL has been copied to your clipboard",
                       deletion_url->value.string);
  JSON_free(JSON_response);
  goto cleanup;
/* cleanup */
cleanup:
  curl_slist_free_all(headers);
  curl_mime_free(cmime);
  return;
}

bool fetch_init() {
  if (curl_global_init(CURL_GLOBAL_ALL) != CURLE_OK)
    return false;
  curl = curl_easy_init();
  return curl != NULL;
}
