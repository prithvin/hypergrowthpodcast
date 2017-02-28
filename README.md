# Podcast Search Project
Full-fledged webapp that allows for searching of UCSD podcasts by keyword with respect to the content on each podcast, as well as social comment feeds for each podcast that is connected through Facebook.

## Operations
Our current production environment is a low-end DigitalOcean droplet (1 core, 512MB RAM + 8GB swap, 20GB SSD) running Ubuntu Xenial.

The IP address of this droplet is: `104.131.147.159`

### front_end
The client-side directory is served with nginx.

### crud_backend
This code is served by Node.js on port 3000 (must be opened). We are using nodemon, persisted in a tmux session, to automatically restart the process when changes are made:

    cd crud_backend
    npm install
    npm install -g nodemon
    nodemon server

### ocr_backend
This code is run intermittently to populate the database (a 500MB MongoDB sandbox on mlab.com). It has the following dependencies:
- Python 2
- OpenCV
- Tesseract + English language pack
- ImageMagick
- MEncoder (bundled with many MPlayer distributions)
- FFmpeg
- Cairo
- Pango
- PyPI packages: `autosub`, `beautifulsoup4`, `scipy`, `progressbar`, `pyocr`, `urllib3`

To run: After installing the dependencies, copy this directory to a different location so that git pulls don't affect processing:

    cp -r ocr_backend ~/ocr_backend_production && cd ~/ocr_backend_production

Place a list of MP4 URLs in the file `ocr_backend/scraped`. They can be obtained using the following method:

    ./scrape_podcasts.py --new > scraped
    # trim list as necessary

 Then

    npm install
    node index
