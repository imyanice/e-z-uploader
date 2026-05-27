FILES = $(wildcard src/*.m src/*.c)
OBJS = $(patsubst src/%.c,build/%.o,$(patsubst src/%.m,build/%.o,$(FILES)))
FRAMEWORKS = \
-framework AppKit \
-framework UserNotifications \
-framework CoreFoundation \
-framework Foundation \
-framework CoreServices
LIBS = -lcurl
CFLAGS = -Wall -Wextra
build/%.o: src/%.c | build
	clang -c $< -o $@ $(CFLAGS)
build/%.o: src/%.m | build
	clang -c $< -o $@ $(CFLAGS)

uploader: $(OBJS)
	clang $^ -o $@ -g $(LIBS) $(FRAMEWORKS) $(CFLAGS)

copy:
	cp uploader "E-Z Uploader.app/Contents/MacOS/uploader"

test_app: uploader copy
	codesign -s - --force "E-Z Uploader.app"
	open "E-Z Uploader.app"

test_exec: uploader copy
	./E-Z\ Uploader.app/Contents/MacOS/uploader

clean:
	rm -rf uploader build

build:
	mkdir -p build
.PHONY: test_main clean copy