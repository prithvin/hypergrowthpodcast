import rake
import operator
import sys
import json


rake_object = rake.Rake("SmartStoplist.txt", 3, 3, 1)


text = sys.argv[1]
    
keywords = rake_object.run(text)
     
print json.dumps(keywords)
