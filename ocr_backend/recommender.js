var NUM_RECOMMENDED = 5;

module.exports = {
  getRecommendedPodcasts: function(input_podcast, podcastList, callback) {
		// Make a copy of the array
		var tmp = podcastList.slice(podcastList);
		var ret = [];

    var indexOfInputPodcast = 0;
    for(var i = 0; i < tmp.length; i++) {
      if(String(podcastList[i]['_id']) === String(input_podcast['_id'])) {
        tmp.splice(i, 1);
        indexOfInputPodcast = i;
        break;
      }
    }
    console.log(indexOfInputPodcast);

    var indexOfNextPodcast = indexOfInputPodcast + 1;
    var indexOfPrevPodcast = indexOfInputPodcast - 1;

    if (indexOfPrevPodcast < 0)
      indexOfPrevPodcast = podcastList.length - 1;

    if (indexOfNextPodcast >= podcastList.length)
      indexOfNextPodcast = 0;

		while(tmp.length > 0 && ret.length < 5) {
			var index = Math.floor(Math.random() * tmp.length);
			var removed = tmp.splice(index, 1);

			// Since we are only removing one element
      ret.push(removed[0]);
    }

    callback(ret, podcastList[indexOfPrevPodcast]['_id'], podcastList[indexOfNextPodcast]['_id']);
	}
}
