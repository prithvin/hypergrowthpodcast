class Norvig {
  constructor(dictionary) {
    this.dictionary = dictionary;
    this.WORD_COUNTS = this.getWordCounts(this.dictionary);
    this.alphabet = "abcdefghijklmnopqrstuvwxyz";
  }

  /*
    Returns an object with each unique word in the input as a key,
    and the count of the number of occurances of that word as the value.
    (HINT: the code `text.toLowerCase().match(/[a-z]+/g)` will return an array
    of all lowercase words in the string.)
  */
  getWordCounts(text) {
    var wordsArray = text.toLowerCase().match(/[a-z]+/g);
    var resultObj = {};
    for(var i = 0; i < wordsArray.length; i++){
      if(resultObj.hasOwnProperty(wordsArray[i])){
        resultObj[wordsArray[i]]++;
      } else {
        resultObj[wordsArray[i]] = 1;
      }
    }
    return resultObj;
  }

  //console.log(WORD_COUNTS)
  //var alphabet = "abcdefghijklmnopqrstuvwxyz";

  /*
    Returns the set of all strings 1 edit distance away from the input word.
    This consists of all strings that can be created by:
      - Adding any one character (from the alphabet) anywhere in the word.
      - Removing any one character from the word.
      - Transposing (switching) the order of any two adjacent characters in a word.
      - Substituting any character in the word with another character.
  */
  editDistance1(word) {
    word = word.toLowerCase().split('');
    var results = [];

    //Adding any one character (from the alphabet) anywhere in the word.
    for(var i = 0; i <= word.length; i++){
      for(var j = 0; j < this.alphabet.length; j++){
        var newWord = word.slice();
        newWord.splice(i, 0, this.alphabet[j]);
        results.push(newWord.join(''));
      }
    }

    //Removing any one character from the word.
    if(word.length > 1){
      for(var i = 0; i < word.length; i++){
        var newWord = word.slice();
        newWord.splice(i,1);
        results.push(newWord.join(''));
      }
    }

    //Transposing (switching) the order of any two adjacent characters in a word.
    if(word.length > 1){
    for(var i = 0; i < word.length - 1; i++){
      var newWord = word.slice();
      var r = newWord.splice(i,1);
      newWord.splice(i + 1, 0, r[0]);
      results.push(newWord.join(''));
    }
  }

  //Substituting any character in the word with another character.
  for(var i = 0; i < word.length; i++){
    for(var j = 0; j < this.alphabet.length; j++){
      var newWord = word.slice();
      newWord[i] = this.alphabet[j];
      results.push(newWord.join(''));
    }
  }


    return results;
  }




  /* Given a word, attempts to correct the spelling of that word.
    - First, if the word is a known word, return the word.
    - Second, if the word has any known words edit-distance 1 away, return the one with
      the highest frequency, as recorded in NWORDS.
    - Third, if the word has any known words edit-distance 2 away, return the one with
      the highest frequency, as recorded in NWORDS. (HINT: what does applying
      "editDistance1" *again* to each word of its own output do?)
    - Finally, if no good replacements are found, return the word.
  */
  correct(word) {
    if (word in this.WORD_COUNTS){
      return word;
    }

    var maxCount = 0;
    var correctWord = word;
    var editDistance1Words = this.editDistance1(word);
    var editDistance2Words = [];

    for(var i = 0; i < editDistance1Words.length; i++){
      editDistance2Words = editDistance2Words.concat(this.editDistance1(editDistance1Words[i]));
    }



    for(var i = 0; i < editDistance1Words.length; i++){
      // console.log(editDistance1Words[i])
      if(editDistance1Words[i] in this.WORD_COUNTS){
        //console.log(editDistance1Words[i], WORD_COUNTS[editDistance1Words[i]])
        if(this.WORD_COUNTS[editDistance1Words[i]] > maxCount){
          maxCount = this.WORD_COUNTS[editDistance1Words[i]];
          correctWord = editDistance1Words[i];
        }
      }
    }
  //console.log('========================================================================')
    var maxCount2 = 0;
    var correctWord2 = correctWord;

    for(var i = 0; i < editDistance2Words.length; i++){
      if(editDistance2Words[i] in this.WORD_COUNTS){
        //console.log(editDistance2Words[i], WORD_COUNTS[editDistance2Words[i]])
        if(this.WORD_COUNTS[editDistance2Words[i]] > maxCount2){
          maxCount2 = this.WORD_COUNTS[editDistance2Words[i]];
          correctWord2 = editDistance2Words[i];
        }
      }
    }

    if (word.length < 6) {
      if(maxCount2 > 100*maxCount){
        return correctWord2
      }
      return correctWord;  
    }
    else {
      if(maxCount2 > 4*maxCount){
        return correctWord2
      }
      return correctWord;  
    };
  }

}
