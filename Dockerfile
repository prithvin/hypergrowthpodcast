FROM ubuntu:17.04
WORKDIR /app

RUN apt-get update
RUN apt-get install -y ffmpeg
RUN apt-get install -y git nodejs-legacy npm
RUN git clone https://github.com/prithvin/cse110projectocr.git
RUN cd cse110projectocr/ocr_backend && npm install ffmpeg --save && npm install imagemagick --save && npm install retext --save && npm install retext-keywords --save && npm install worder --save && npm install check-word --save && npm install node-tesseract --save && npm install wordsworth --save && npm install fast-levenshtein --save
RUN cd /app/cse110projectocr/ocr_backend && git pull && node index.js
