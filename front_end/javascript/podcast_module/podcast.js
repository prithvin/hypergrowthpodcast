$( window ).resize(function() {
    updatePostHeights();
});

function updatePostHeights() {
    var newHeight =$(window).height() - $(".podcast-page-div").find("#navbox").height();
    $(".podcast-page-div").find("#podcast-posts").css("height",newHeight );
}