const express = require('express');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const apiFunctions = require('./api.js');
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://testUser:testUser@ds139899.mlab.com:39899/testdbnaruto', function(error){
  if(error){
    console.log("Error Connecting" + error);
  }
  else{
    console.log("Connection Successful");
  }
});

app.get('/', function(req,res){
  res.send("Routed to main page");
})

app.get('/search/:keywords',function(req,res){
  apiFunctions.addTodo();
})


app.listen(3000, function() {
  console.log('listening on 3000')
})
