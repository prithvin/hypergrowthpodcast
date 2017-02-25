var Recommendations = class Recommendations {
  constructor(mainDiv) {
    this.getRecommendations((recommendations) => {
      this.displayRecomm($(mainDiv).find('.podcast-recommendations'), recommendations);
    });
  }

  displayRecomm(rec_div, recommendations) {
    for(var recommendation of recommendations) {
      var id = recommendation['PodcastId'];
      var preview_src = recommendation['PodcastImage'];
      var title = recommendation['Date'];

      var link_anchor = document.createElement('a');
      link_anchor.href = document.documentURI.substring(0, document.documentURI.lastIndexOf('/') + 1) + id;

      var rec_container = document.createElement('div');
      $(rec_container).addClass('rec-container pure-u-6-24');

      var preview_img = document.createElement('img');
      preview_img.src = preview_src;
      $(preview_img).addClass('preview-img');

      var rec_title = document.createElement('div');
      rec_title.textContent = title;
      $(rec_title).addClass('rec-title');

      $(rec_container).append(preview_img);
      $(rec_container).append(rec_title);

      $(link_anchor).append(rec_container);
      $(rec_div).append(link_anchor);
    }
  }

  getRecommendations(callback) {
    callAPI('/fake_data/recommendations.json', 'GET', {}, (data) => {
      callback(data['Recommendations']);
    });
  }
}
