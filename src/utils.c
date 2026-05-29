#include "utils.h"
#include <dirent.h>
#include <fcntl.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

void release_vector(vector **vec) {
	if ((*vec)) {
		free((*vec)->data);
		free((*vec));
		*vec = NULL;
	}
}

size_t append_vector(vector *vec, uint8_t *data, size_t nb) {
	if ((ssize_t)(nb + vec->len) >= vec->size) {
		void *tmp = realloc(vec->data, (nb + vec->len) * 2);
		if (!tmp)
			return 0;
		vec->data = tmp;
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
			void *tmp = realloc(res, bi * 2 * sizeof(char *));
			if (!tmp) {
				free(res);
				perror("out of memory");
				return NULL;
			}
			res = tmp;
			bi = bi * 2;
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

static off_t folder_size_fd(int dfd) {
	DIR *dir = fdopendir(dfd);
	if (!dir) {
		close(dfd);
		return 0;
	}

	off_t total = 0;
	struct dirent *e;

	while ((e = readdir(dir)) != NULL) {
		if (strcmp(e->d_name, ".") == 0 || strcmp(e->d_name, "..") == 0)
			continue;

		struct stat st;
		if (fstatat(dfd, e->d_name, &st, AT_SYMLINK_NOFOLLOW) != 0)
			continue;

		if (S_ISREG(st.st_mode)) {
			total += st.st_blocks * 512;
		} else if (S_ISDIR(st.st_mode)) {
			int child = openat(dfd, e->d_name, O_RDONLY | O_DIRECTORY);
			if (child >= 0)
				total += folder_size_fd(child);
		}
	}

	closedir(dir);
	return total;
}

off_t folder_size(const char *path) {
	int fd = open(path, O_RDONLY | O_DIRECTORY);
	if (fd < 0)
		return -1;
	return folder_size_fd(fd);
}
