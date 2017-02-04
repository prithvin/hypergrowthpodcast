#!/usr/bin/python

import urllib3
from bs4 import BeautifulSoup

URL = 'http://podcast.ucsd.edu/'

# suppress InsecureRequestWarning
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

    for video in videos:
        print(URL + 'Podcasts//' + video)
