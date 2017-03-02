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

    FB.init({
      appId: '1606385449650440',
      version: 'v2.4'
    });

  $(mainDiv).find('.fb-login-button').on("click", function ()  {
      FB.login(function(response) {
        if (response.status === 'connected') {
          FB.api('/me', function(response) {
            console.log(response);    // TODO over here, then call server and
                                      // store user data and redirect
            var callbackURL = window.location.origin + window.location.pathname
                                                     + "#/courses";
            if(queries && queries.hasOwnProperty('redirectURL')) {
              callbackURL = decodeURIComponent(queries['redirectURL']);
            }

            callAPI(login_origins.backend + '/loginorcreate', 'GET', response, function (data) {
              if (data == true)
                window.location.href = callbackURL;
              else
                swal("Oops!", "Looks like you did not log into Facebook correctly. Try again!");
            });
          });
        } else {
          swal("Oops!", "Looks like you did not log into Facebook correctly. Try again!")
        }
      }, {scope: 'public_profile,email'});
    });

    callAPI(login_origins.backend + '/isUserLoggedIn', 'GET', {}, (data) => {
      if(data === true) {
          window.location.hash =  '/courses';
      }
    });
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
