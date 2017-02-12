var NUM_RECOMMENDED = 5;

module.exports = {
  getRecommendedPodcasts: function(input_podcast, podcastList, callback) {
		// Make a copy of the array
		var tmp = podcastList.slice(podcastList);
		var ret = [];

    for(var i = 0; i < tmp.length; i++) {
      if(podcastList[i]['_id'] === input_podcast['_id']) {
        tmp.splice(i, 1);
        break;
      }
    }

		while(tmp.length > 0 && ret.length < 5) {
			var index = Math.floor(Math.random() * tmp.length);
			var removed = tmp.splice(index, 1);

			// Since we are only removing one element
      ret.push(removed[0]);
    }

    callback(ret);
	}
}
