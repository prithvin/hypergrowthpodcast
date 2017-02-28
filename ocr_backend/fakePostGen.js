var dbuploader = require('./dbuploader.js');
var fs = require('fs');

function getProfiles(filename) {
  var contents = fs.readFileSync(filename, 'utf8');
  var lines = contents.split('\n');
  var ret = [];
  for (let i = 0; i < lines.length; i++) {
    var pair = lines[i].split(',');
    if (pair.length != 2) {
      continue;
    }
    ret.push([pair[0], pair[1].replace('\r', '')]);
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
  var posts = [];


  for(var i = 0; i < num_posts; i++) {
    var com_nums = [0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,5,5];
    var num_comments = com_nums[Math.floor(Math.random() * com_nums.length)];
    var comments = [];
    for(var j = 0; j < num_comments; j++) {
      var comment = sentences[Math.floor(sentences.length * Math.random())];
      var nameIndex = Math.floor(name_len * Math.random());
      comments.push({
        'PosterName': names[nameIndex][0],
        'Pic': names[nameIndex][1],
        'Content': comment + '.'
      });
    }

    var nameIndex = Math.floor(name_len * Math.random());
    var post = {
      'Name': names[nameIndex][0],
      'ProfilePic':  names[nameIndex][1],
      'Content': sentences[Math.floor(sentences_len * Math.random())] + '.',
      'Comments': comments
    }

    posts.push(post);
  }

  dbuploader.generateFakePosts(posts, (id) => {console.log('generated post for podcast: ' + id);});
}

var profile_names = getProfiles('character-list.txt');
var sentences = generateSentenceCorpus('pride-and-prejudice.txt');
createFakePosts(1000, profile_names, sentences);
