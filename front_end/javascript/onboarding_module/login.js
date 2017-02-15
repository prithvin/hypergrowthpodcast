$('.fb-login-button')[0].onclick = () => {
  var origin = window.location.origin;
  window.location.href = '/auth/facebook?callbackURL=' + origin + '/auth/facebook&errorCallbackURL=http://yahoo.com';
}
