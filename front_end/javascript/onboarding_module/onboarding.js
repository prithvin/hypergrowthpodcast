var Onboarding = class Onboarding {
  constructor(mainDiv) {
    $(mainDiv).find('.fb-login-button')[0].onclick = () => {
      var baseURL = window.location.origin + window.location.pathname;
      var targetCallbackURL = encodeURIComponent(baseURL + "/#/courses");
      var errorCallbackURL = encodeURIComponent(baseURL + "/#");
      window.location.href = login_origins.backend + '/auth/facebook?callbackURL=' + targetCallbackURL + '&errorCallbackURL=' + errorCallbackURL;
    }

    callAPI(login_origins.backend + '/isUserLoggedIn', 'GET', {}, (data) => {
      console.log("isuser");
      if(data.result === true) {
        window.location.href = window.location.origin + '/#/courses';
      } else {
        callAPI(login_origins.backend + '/getUserSession', 'GET', {}, (data) => {
          console.log("getuser");
          if(data['user']) {
            callAPI(login_origins.backend + '/setUserFromSession', 'GET', {}, (data) => {
              console.log("setuser");
              window.location.href = window.location.origin + '/#/courses';
            });
          }
        });
      }
    });
  }
}
