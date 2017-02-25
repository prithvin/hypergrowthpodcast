#!/bin/bash

cd crud_backend
sudo npm install
node server.js &

cd ..
cd front_end
python -m SimpleHTTPServer 8000 &
