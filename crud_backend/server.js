const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiFunctions = require('./api.js');
const routes = require('./routes.js');
app.use('/',routes);
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://testUser:testUser@ds139899.mlab.com:39899/testdbnaruto', function(error){
  if(error){
    console.log("Error Connecting" + error);
  }
  else{
    console.log("Connection Successful");
    apiFunctions.coursePageFunctions.createPodcasts();
  }
});

app.listen(3000, function() {
  console.log('listening on 3000')
})
