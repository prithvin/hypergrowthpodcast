module.exports = {
  levenshteinDistance: function (s, t) {
    return levyHelper(s, t);
  },
};

function levyHelper (s, t) {
  console.log("HEY");
  if (s.length === 0) return t.length;
  if (t.length === 0) return s.length;

  return Math.min(
    levyHelper(s.substr(1), t) + 1,
    levyHelper(t.substr(1), s) + 1,
    levyHelper(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
  );
}