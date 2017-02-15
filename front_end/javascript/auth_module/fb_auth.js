function redirectToAuth() {
  window.location.port = 3000;
}

function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

var query_str = window.location.search.substring(1);
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

if(!queries.hasOwnProperty('id'))
  redirectToAuth();
else {
  var id = queries['id'];
  if(!readCookie('fb_id')) createCookie('fb_id', id, 7);

  //redirect
  window.location.href = '/onboarding_courses_module.html';
}
