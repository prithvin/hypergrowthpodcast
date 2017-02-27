var dbuploader = require('./dbuploader.js');
var fs = require('fs');

function getProfiles(filename) {
  var contents = fs.readFileSync(filename, 'utf8');
  var lines = contents.split('\n');
  var ret = {};
  for (let i = 0; i < lines.length; i++) {
    var pair = lines[i].split(',');
    if (pair.length != 2) {
      continue;
    }
    ret[pair[0]] = pair[1].replace('\r', '');
  }
  return ret;
}

function generateSentenceCorpus(filename) {
  var contents = fs.readFileSync(filename, 'utf8');
  return contents.replace(/\n/g, " ").replace(/\r/g, '').replace(/Mr\./g, 'Mr').replace(/Mrs\./g, 'Mrs').split('. ');
}

function createFakePosts(num_posts, names, sentences) {
  var name_len = Object.keys(names).length;
  var sentences_len = sentences.length;
  var time_tolerance = 1000*60*60*24*365*10;
  var posts = [];

  var postTime = (new Date()).getTime() - Math.random() * time_tolerance;

  for(var i = 0; i < num_posts; i++) {
    var com_nums = [0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,10,10];
    var num_comments = Math.floor(Math.random() * com_nums.length);
    var comments = [];
    for(var j = 0; j < num_comments; j++) {
      var comment = sentences[Math.floor(sentences.length * Math.random())];
      var posterName = Object.keys(names)[Math.floor(name_len * Math.random())];
      comments.push({
        'PosterName': posterName,
        'Pic': names[posterName],
        'Time': postTime,
        'Content': comment + '.'
      });
    }

    var post = {
      'Name': Object.keys(names)[Math.floor(name_len * Math.random())],
      'TimeOfPost': postTime,
      'Content': sentences[Math.floor(sentences_len * Math.random())] + '.',
      'Comments': comments
    }
    post.ProfilePic = names[post['Name']];

    posts.push(post);
  }

  dbuploader.generateFakePosts(posts, (id) => {console.log('generated post for podcast: ' + id);});
}

var profile_names = getProfiles('character-list.txt');
var sentences = generateSentenceCorpus('pride-and-prejudice.txt');
createFakePosts(500, profile_names, sentences);
