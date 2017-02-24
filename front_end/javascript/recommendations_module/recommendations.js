var Recommendations = class Recommendations {
  constructor(mainDiv) {
    this.getRecommendations((recommendations) => {
      this.displayRecomm($(mainDiv).find('.podcast-recommendations'), recommendations);
    });
  }

  displayRecomm(rec_div, recommendations) {
    for(var recommendation in recommendations) {
      var id = recommendation['PodcastId'];
      var preview_src = recommendation['PodcastImage'];
      var title = recommendation['Date'];

      var rec_container = document.createElement('div');
      $(rec_container).addClass('rec-container col-sm-3');

      var preview_img = document.createElement('img');
      preivew_img.src = preview_src;
      $(preivew_img).addClass('preview-img');

      var rec_title = document.createElement('div');
      rec_title.textContent = title;
      $(rec_title).addClass('rec-title');

      $(rec_container).append(preview_img);
      $(rec_container).append(rec_title);

      $(rec_div).append(rec_container);
    }
  }

  getRecommendations(callback) {
    callAPI('/fake_data/recommendations.json', 'GET', {}, (data) => {
      callback(data['Recommendations']);
    });
  }
}
