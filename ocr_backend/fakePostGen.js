var dbuploader = require('./dbuploader.js');
var fs = require('fs');

function getProfileNames(filename) {
  var contents = fs.readFileSync(filename, 'utf8');
  return contents.split('\n');
}

function generateSentenceCorpus(filename) {
  var contents = fs.readFileSync(filename, 'utf8');
  return contents.replace(/\n/g, " ").split('\n');
}

function createFakePosts(num_posts, names, sentences) {
  var name_len = names.length;
  var sentences_len = sentences.length;
  var time_tolerance = 1000*60*60*24*365*10;
  var counter = 0;

  for(var i = 0; i < num_posts; i++) {
    var com_nums = [0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,10,10];
    var num_comments = Math.floor(Math.random() * com_nums.length);
    var comments = [];
    for(var j = 0; j < num_comments; j++) {
      var comment = sentences[counter];
      counter++;
      comments.push(comment);
    }

    var post = {
      'Name': names[Math.floor(name_len * Math.random())],
      'TimeOfPost': (new Date()).getTime() - Math.random() * time_tolerance,
      'Content': sentences[Math.floor(sentences_len * Math.random())],
      'Comments': comments
    }

    posts.push(post);
  }
      
  dbuploader.generateFakePosts(posts, (id) => {console.log('generated post for podcast: ' + id);});
}

var profile_names = getProfileNames('character-list.txt');
var sentences = generateSentenceCorpus('pride-and-prejudice.txt');
createFakePosts(50000, profile_names, sentences);
