FROM ubuntu:17.04
WORKDIR /app

RUN apt-get update
RUN apt-get install -y ffmpeg
RUN apt-get install -y libopencv-dev python-opencv
RUN apt-get install -y git nodejs-legacy npm
RUN apt-get install -y tesseract-ocr tesseract-ocr-eng
RUN git clone https://github.com/prithvin/cse110projectocr.git
RUN cd cse110projectocr/ocr_backend && npm install ffmpeg --save && npm install imagemagick --save && npm install retext --save && npm install retext-keywords --save && npm install worder --save && npm install check-word --save && npm install node-tesseract --save && npm install wordsworth --save && npm install fast-levenshtein --save && npm install download-file --save && npm install count-words --save && npm install file-reader --save && npm install fs-extra --save
RUN apt-get install -y python-pip && pip install --upgrade pip
RUN pip install urllib3
RUN pip install beautifulsoup4
RUN pip install scipy
RUN pip install progressbar
RUN pip install pyocr
ENTRYPOINT cd /app/cse110projectocr/ocr_backend && git pull && node index.js
