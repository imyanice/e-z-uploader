#include "json.h"
#include <ctype.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define ADVANCE_CURSOR(data, cursor)                                           \
  do {                                                                         \
    while (isspace(data[cursor]))                                              \
      cursor++;                                                                \
  } while (0)

JSONElement *_JSON_parse(char *data, size_t *cursor_ptr) {

  ADVANCE_CURSOR(data, (*cursor_ptr));
  if (data[(*cursor_ptr)] == '\0') {
    printf("format error at cursor pos: %zu\n", (*cursor_ptr));
    return NULL;
  }
  JSONElement *element = malloc(sizeof(JSONElement));
  element->key = NULL;
  element->child_count = 0;
  if (data[(*cursor_ptr)] == '{') {
    (*cursor_ptr)++;
    element->JSONType = JSONType_OBJECT;
    while (data[(*cursor_ptr)] != '}') {
      ADVANCE_CURSOR(data, (*cursor_ptr));
      if (data[(*cursor_ptr)] != '"') {
        printf("58 | format error at cursor pos: %zu, expected `\"`\n",
               (*cursor_ptr));
        free(element);
        return NULL;
      }

      char *key;
      size_t key_start = ++(*cursor_ptr);

      while (data[(*cursor_ptr)] != '"') {
        if (data[(*cursor_ptr)] == '\\')
          (*cursor_ptr)++;
        (*cursor_ptr)++;
      }
      if ((*cursor_ptr) - key_start == 0) {
        key = strdup("");
      } else {
        key = strndup(data + key_start, (*cursor_ptr) - key_start);
      }

      (*cursor_ptr)++;
      ADVANCE_CURSOR(data, (*cursor_ptr));
      if (data[(*cursor_ptr)] != ':') {
        printf("format error at cursor pos: %zu, expected `:`\n",
               (*cursor_ptr));
        free(element);
        return NULL;
      }
      (*cursor_ptr)++;
      ADVANCE_CURSOR(data, (*cursor_ptr));

      JSONElement *child = _JSON_parse(data, cursor_ptr);
      if (!child) {
        // the child errored
        return NULL;
      }

      child->key = key;

      if (element->child_count == 0) {
        element->value.object = malloc(sizeof(JSONElement));
      } else {
        element->value.object =
            realloc(element->value.object,
                    (element->child_count + 1) * sizeof(JSONElement));
      }

      if (!element->value.object) {
        perror("out of memory");
        free(element);
        return NULL;
      }

      element->value.object[element->child_count] = child;
      element->child_count = element->child_count + 1;
      ADVANCE_CURSOR(data, (*cursor_ptr));

      if (data[(*cursor_ptr)] == ',') {
        (*cursor_ptr)++;
        ADVANCE_CURSOR(data, (*cursor_ptr));
        if (data[(*cursor_ptr)] == '}') {
          printf("format error at cursor pos: %zu, expected JSONElement\n",
                 (*cursor_ptr));
          free(element);
          return NULL;
        }
      } else {
        if (data[(*cursor_ptr)] == '}') {
          break;
        } else {
          printf("format error at cursor pos: %zu, expected `,` OR `}`, but "
                 "found `%c`\n",
                 (*cursor_ptr), data[(*cursor_ptr)]);
          free(element);
          return NULL;
        }
      }
    }
    (*cursor_ptr)++;

    return element;
  }

  if (data[(*cursor_ptr)] == '[') {
    (*cursor_ptr)++;
    element->JSONType = JSONType_ARRAY;
    element->key = NULL;
    while (data[(*cursor_ptr)] != ']') {
      ADVANCE_CURSOR(data, (*cursor_ptr));

      JSONElement *child = _JSON_parse(data, cursor_ptr);
      if (!child) {
        // the child errored
        return NULL;
      }

      if (element->child_count == 0) {
        element->value.array = malloc(sizeof(JSONElement));
      } else {
        element->value.array =
            realloc(element->value.array,
                    (element->child_count + 1) * sizeof(JSONElement));
      }
      if (!element->value.array) {
        perror("out of memory");
        free(element);
        return NULL;
      }

      element->value.array[element->child_count] = child;
      element->child_count = element->child_count + 1;
      ADVANCE_CURSOR(data, (*cursor_ptr));

      if (data[(*cursor_ptr)] == ',') {
        (*cursor_ptr)++;
        ADVANCE_CURSOR(data, (*cursor_ptr));
        if (data[(*cursor_ptr)] == ']') {
          printf("format error at cursor pos: %zu, expected JSONElement\n",
                 (*cursor_ptr));
          free(element);
          return NULL;
        }
      } else {
        if (data[(*cursor_ptr)] == ']') {
          break;
        } else {
          printf("format error at cursor pos: %zu, expected `,` OR `]`, but "
                 "found `%c`\n",
                 (*cursor_ptr), data[(*cursor_ptr)]);
          free(element);
          return NULL;
        }
      }
    }
    (*cursor_ptr)++;
    return element;
  }

  if (data[(*cursor_ptr)] == '"') {
    element->JSONType = JSONType_STRING;
    size_t val_start = ++(*cursor_ptr);

    while (data[(*cursor_ptr)] != '"') {
      if (data[(*cursor_ptr)] == '\\')
        (*cursor_ptr)++;
      (*cursor_ptr)++;
    }
    if ((*cursor_ptr) - val_start == 0) {
      element->value.string = strdup("");
    } else {
      element->value.string =
          strndup(data + val_start, (*cursor_ptr) - val_start);
    }
    (*cursor_ptr)++;
    return element;
  }

  if (isdigit(data[(*cursor_ptr)])) {
    char *endptr;
    double val = strtod(data + (*cursor_ptr), &endptr);
    if (endptr == data + (*cursor_ptr)) {
      printf("format error at cursor pos: %zu, expected a number (double)\n",
             (*cursor_ptr));
      free(element);
      return NULL;
    }
    (*cursor_ptr) = endptr - data;
    element->JSONType = JSONType_NUMBER;
    element->value.number = val;
    return element;
  }

  if (strncmp("true", data + (*cursor_ptr), 4) == 0) {
    element->JSONType = JSONType_BOOLEAN;
    element->value.boolean = true;
    (*cursor_ptr) += 4;
    return element;
  }
  if (strncmp("false", data + (*cursor_ptr), 5) == 0) {
    element->JSONType = JSONType_BOOLEAN;
    element->value.boolean = false;
    (*cursor_ptr) += 5;
    return element;
  }
  if (strncmp("null", data + (*cursor_ptr), 4) == 0) {
    printf("null\n");
    element->JSONType = JSONType_NULL;
    element->value.boolean = false;
    (*cursor_ptr) += 4;
    return element;
  }

  printf("format error at cursor pos: %zu, expected a "
         "JSONElement\ngot char: `%c`\n",
         (*cursor_ptr), data[(*cursor_ptr)]);
  free(element);
  return NULL;
}
JSONElement *JSON_parse(char *data) {
  size_t cursor = 0;
  return _JSON_parse(data, &cursor);
}

JSONElement *get_element_from_object(char *key, JSONElement *object) {
  if (object->JSONType != JSONType_OBJECT)
    return NULL;
  size_t i = 0;
  while (i < object->child_count &&
         strcmp(object->value.object[i]->key, key) != 0) {
    i++;
  }
  if (i == object->child_count)
    return NULL;
  return object->value.object[i];
}
JSONElement *JSON_get(char *key, JSONElement *element) {
  if (element == NULL)
    return NULL;
  if (!key || *key == '\0')
    return element;
  char *end = key;
  key = strsep(&end, ".");
  char *walker = key;
  while (*walker != '\0' && *walker != '[')
    walker++;
  if (*walker == '[') {
    char *array_index_start = walker;
    while (*walker != ']' && *walker != '\0')
      walker++;
    if (*walker == ']') {
      char *endptr;
      size_t index = strtoul(walker, &endptr, 10);
      if (endptr == walker) {
        if (element->JSONType == JSONType_OBJECT) {
          size_t i = 0;
          while (i < element->child_count &&
                 strncmp(element->value.object[i]->key, key,
                         key - array_index_start) != 0) {
            i++;
          }
          if (i == element->child_count) {
            return JSON_get(end, get_element_from_object(key, element));
          } else {
            if (element->value.object[i]->JSONType != JSONType_ARRAY) {
              return JSON_get(end, get_element_from_object(key, element));

            } else {
              if (index >= element->value.object[i]->child_count) {
                return JSON_get(end, get_element_from_object(key, element));
              } else {
                size_t inner_index = 0;
                while (inner_index < index) {
                  inner_index++;
                }
                return JSON_get(end, element->value.object[i]->value.array[i]);
              }
            }
          }
        }
      }
    }
  }
  return JSON_get(end, get_element_from_object(key, element));
}

void JSON_free(JSONElement *element) {
  if (element->JSONType == JSONType_ARRAY ||
      element->JSONType == JSONType_OBJECT) {
    size_t i = 0;
    while (i < element->child_count) {
      JSON_free(element->value.array[i++]);
    }
    free(element->value.array);
  }
  if (element->JSONType == JSONType_STRING) {
    free(element->value.string);
  }

  free(element->key);
  free(element);
}
