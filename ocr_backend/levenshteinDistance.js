var levenshtein = require('fast-levenshtein');

module.exports = {
  levenshteinDistance: function (s, t) {
    return levenshtein.get(s, t); 
  },
};
