#!/usr/bin/python

import urllib3
from bs4 import BeautifulSoup
from sys import argv

URL = 'https://podcast.ucsd.edu/'

if len(argv) > 1 and argv[1] == '--new':
    urllib3.disable_warnings()
    http = urllib3.PoolManager()
    soup = BeautifulSoup(http.request('GET', URL).data, 'html.parser')

    courses = []
    for tr in soup.find_all('tr'):
        try:
            if tr.class_ != 'authentication':
                courses.append(tr.td.a.get('href'))

        except:
            pass

    for course in courses:
        soup = BeautifulSoup(http.request('GET', URL + course).data, 'html.parser')

        videos = []
        for t in soup.find_all(class_='timePie'):
            try:
                media = t.get('forfile')
                if media.endswith('mp4'):
                    videos.append(media)

            except:
                pass

        arr = []
        for video in videos:
            if len(argv) > 2 and 'wi17' in video and any(key == video.split('/')[-2] for key in argv[2:]):
                if 'A0' not in video and 'B0' not in video and 'C0' not in video and 'D0' not in video:
                    print(URL + 'Podcasts//' + video)

else:
    with open ('./scraped', 'r') as f:
        lines = f.read().rstrip()

    print(lines)
