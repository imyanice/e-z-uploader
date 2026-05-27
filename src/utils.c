
#include "utils.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
void release_vector(vector **vec) {
  if ((*vec)) {
    free((*vec)->data);
    free((*vec));
    *vec = NULL;
  }
}

vector *get_vector(size_t size, uint8_t *initial_data,
                   size_t initial_data_len) {
  vector *vec = malloc(sizeof(vector));
  vec->data = malloc(size);
  if (!vec->data) {
    free(vec);
    return NULL;
  }
  vec->size = size;
  vec->len = 0;
  if (initial_data) {
    memcpy(vec->data, initial_data, initial_data_len);
  }
  return vec;
}
size_t append_vector(vector *vec, uint8_t *data, size_t nb) {
  if ((ssize_t)(nb + vec->len) >= vec->size) {
    vec->data = realloc(vec->data, (nb + vec->len) * 2);
    if (!vec->data)
      return 0;
    vec->size = (nb + vec->len) * 2;
  }
  memcpy(vec->data + vec->len, data, nb);
  vec->len += nb;
  vec->data[vec->len] = 0;
  return nb;
}

size_t cwrite_data(char *buf, size_t size, size_t nmenb, vector *vec) {
  (void)size;
  append_vector(vec, (uint8_t *)buf, nmenb);
  return nmenb;
}

char **split(char *string, const char *delim, size_t *rl) {
  char **res = malloc(10 * sizeof(char *));
  size_t bi = 10;
  size_t res_i = 0;
  char *start;
  while ((start = strsep(&string, delim)) != NULL) {
    if (res_i >= bi) {
      res = realloc(res, bi * 2);
      if (!res)
        perror("out of memory");
      bi = bi * 2 + 1;
    }
    res[res_i++] = start;
  }
  if (rl)
    *rl = res_i;
  return res;
}

bool includes_string(int c, char **strs, char *incl) {
  c--;
  while (c >= 0 && strcmp(incl, strs[c]) != 0)
    c--;
  return c >= 0;
}
