#include "controller.h"
#include "fetch.h"

int main(void) {
	uploader_init();
	if (!fetch_init())
		return 1;
	uploader_run();
}
