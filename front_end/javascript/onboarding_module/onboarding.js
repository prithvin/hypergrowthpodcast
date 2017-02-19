var Onboarding = class Onboarding {
  constructor(mainDiv) {
    $(mainDiv).find('.fb-login-button')[0].onclick = () => {
      window.location.href = login_origins.backend + '/auth/facebook?callbackURL=' + login_origins.callback + '/%23/courses&errorCallbackURL=' + login_origins.callback;
    }
  }
}
