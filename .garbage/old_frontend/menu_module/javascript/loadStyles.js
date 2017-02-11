function loadCSSBasedOnURLPath (urlPath) {
    loadCSSDynamically("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css");
    loadCSSDynamically("https://fonts.googleapis.com/css?family=Roboto:300,400,700,900");
    loadCSSDynamically("https://unpkg.com/purecss@0.6.2/build/pure-min.css");
    loadCSSDynamically(urlPath + "/style_sheets/logo.css");
    loadCSSDynamically(urlPath + "/style_sheets/navbar.css");
    loadCSSDynamically(urlPath + "/style_sheets/searchbar.css");
  

}