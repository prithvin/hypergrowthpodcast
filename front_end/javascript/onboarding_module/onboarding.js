var Onboarding = class Onboarding {
  constructor(mainDiv) {
    var queries;
		var query_str = window.location.search.substring(1);
    if(!query_str) {
      var query_start = window.location.href.indexOf('?');
      if(query_start > 0) {
        query_str = window.location.href.substring(query_start + 1);
        queries = this.getQueries(query_str);
      }
    } else {
      queries = this.getQueries(query_str);
    }

    $(mainDiv).find('.fb-login-button')[0].onclick = () => {
      var baseURL = window.location.origin + window.location.pathname;
      var targetCallbackURL = encodeURIComponent(baseURL + "#/courses");
      var errorCallbackURL = encodeURIComponent(baseURL + "#");
      console.log(login_origins.backend + '/auth/facebook?callbackURL=' + targetCallbackURL + '&errorCallbackURL=' + errorCallbackURL);
      window.location.href = login_origins.backend + '/auth/facebook?callbackURL=' + targetCallbackURL + '&errorCallbackURL=' + errorCallbackURL;
    }

    if(queries && queries.hasOwnProperty('redirectURL')) {
      callAPI(login_origins.backend + '/isUserLoggedIn', 'GET', {}, (data) => {
        if(!data.result) {
          var baseURL = window.location.origin + window.location.pathname;
          var targetCallbackURL = encodeURIComponent(baseURL + '#/?redirectURL=' + queries['redirectURL']);
          var errorCallbackURL = encodeURIComponent(baseURL + "#");
          window.location.href = login_origins.backend + '/auth/facebook?callbackURL=' + targetCallbackURL + '&errorCallbackURL=' + errorCallbackURL;
        } else {
          window.location.href = decodeURIComponent(queries['redirectURL']);
        }
      });
    } else {
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

  getQueries(query_str) {
		//Map-reduce queries into a single object
		var queries = query_str.split('&').map((q) => {
      var parts = q.split('=');
      var key = parts[0];
      var val = parts[1];
      var query = {}; 
      query[key] = val;
      return query;
    }).reduce((acc_obj, q) => {
      var key = Object.keys(q)[0];
      acc_obj[key] = q[key];
      return acc_obj;
    }, {});

    return queries;
  }
}
