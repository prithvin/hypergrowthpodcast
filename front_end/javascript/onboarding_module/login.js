$('.fb-login-button')[0].onclick = () => {
  window.location.href = '/auth/facebook?callbackURL=http://www.google.com&errorCallbackURL=http://yahoo.com';
}
