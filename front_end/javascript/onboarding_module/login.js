$('.fb-login-button')[0].onclick = () => {
  window.location.href = login_origins.backend + '/auth/facebook?callbackURL=' + login_origins.callback + '/onboarding_courses_module.html&errorCallbackURL=http://yahoo.com';
}
