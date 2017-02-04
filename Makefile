all: build run

build:
	sudo docker build . -t cse110projectocr/app

run:
	sudo docker run -i -t cse110projectocr/app
