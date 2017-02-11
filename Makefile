all: build run

build:
	sudo docker build . -t cse110projectocr/app

run:
	sudo docker run -i -t cse110projectocr/app bash

new:
	sudo docker build . --no-cache -t cse110projectocr/app

interactive:
	sudo docker run -it --entrypoint=/bin/bash cse110projectocr/app -i
