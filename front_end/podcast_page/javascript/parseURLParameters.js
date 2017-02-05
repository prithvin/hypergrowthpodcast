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
        url: getLocalhost() + url,
        data: datastruct,
        success: callback,
        xhrFields: {withCredentials: true},
        error:function(){
            console.log("ERROR");
        }
    });
}

/*
callAJAX("GET", "http://localhost:7888/TesseractNew/cse110projectocr/front_end/podcast_page/index.html", { classname: "CSE 110", classqrtr: "Winter 2017", "firstname" : "Megan" }, function (data) {
    $("body").html(data)
});
*/