import rake
import operator
import sys
import json


rake_object = rake.Rake("SmartStoplist.txt", 3, 3, 1)

with open ("keywordEncoding.txt", "r") as myFile: 
    text = myFile.read().replace("\n", " ");

    
keywords = rake_object.run(text)
     
print json.dumps(keywords)
