#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <sys/types.h>
#ifndef UPLOADER_UTILS_H
#define UPLOADER_UTILS_H

typedef struct {
  uint8_t *data;
  ssize_t len;
  ssize_t size;
} vector;
void release_vector(vector **vec);

vector *get_vector(size_t size, uint8_t *initial_data, size_t initial_data_len);
size_t cwrite_data(char *buf, size_t size, size_t nmenb, vector *vec);
char **split(char *string, const char *delim, size_t *rl);
bool includes_string(int c, char **strs, char *incl);
#endif
