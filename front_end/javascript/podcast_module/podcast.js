class PodcastPage {

    constructor () {
        $( window ).resize(function() {
            updatePostHeights();
        });
    }

    updatePostHeights() {
        var newHeight =$(window).height() - $(".podcast-page-div").find("#navbox").height();
        $(".podcast-page-div").find("#podcast-posts").css("height",newHeight );
    }
};