function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}


function callAJAX (mytype, url, datastruct, callback) {
    $.ajax({
        type: mytype,
        url:  url,
        data: datastruct,
        success: callback,
        xhrFields: {withCredentials: true},
        error:function(){
            console.log("ERROR");
        }
    });
}

