var Onboarding = class Onboarding {
  constructor(mainDiv) {
    $(mainDiv).find('.fb-login-button')[0].onclick = () => {
      var baseURL = window.location.origin + window.location.pathname;
      var targetCallbackURL = encodeURIComponent(baseURL + "#/courses");
      var errorCallbackURL = encodeURIComponent(baseURL + "#");
      window.location.href = login_origins.backend + '/auth/facebook?callbackURL=' + targetCallbackURL + '&errorCallbackURL=' + errorCallbackURL;
    }

    callAPI(login_origins.backend + '/isUserLoggedIn', 'GET', {}, (data) => {
      if(data.result === true) {
        window.location.hash =  '/courses';
      } else {
        callAPI(login_origins.backend + '/getUserSession', 'GET', {}, (data) => {
          if(data['user']) {
            callAPI(login_origins.backend + '/setUserFromSession', 'GET', {}, (data) => {
              window.location.hash =  '/courses';
            });
          }
        });
      }
    });
  }
}
