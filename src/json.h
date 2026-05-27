#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#ifndef UPLOADER_JSON_H
#define UPLOADER_JSON_H

#define JSON_key(s)                                                            \
  (char[]) { s }

struct JSONElement {
  char *key;
  enum {
    JSONType_NULL,
    JSONType_BOOLEAN,
    JSONType_NUMBER,
    JSONType_STRING,
    JSONType_OBJECT,
    JSONType_ARRAY
  } JSONType;
  union JSONValue {
    bool boolean;
    double number;
    char *string;
    struct JSONElement **object;
    struct JSONElement **array;
  } value;
  size_t child_count; // only applicable for objects and arrays
};
typedef struct JSONElement JSONElement;

JSONElement *JSON_parse(char *data);
JSONElement *JSON_get(char *key, JSONElement *element);
void JSON_free(JSONElement *element);
void JSON_print(JSONElement *element, char *pref);
#endif
