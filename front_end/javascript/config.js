var login_origins = {
  //backend: "http://" + window.location.hostname + ':3000'
  backend: "http://104.131.147.159:3000"
}

if (window.location.hostname == "podcastucsd.ml")
    login_origins.backend = "https://www.podcastucsd.ml/api";