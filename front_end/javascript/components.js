function loadComponent (fileName, domTarget, callback, hideUntilAfter, dontShow) {
    $.ajax({
        url: fileName,
        data: {},
        success: function (data) {
            if (hideUntilAfter == null) 
                hideUntilAfter = 0;
            $(domTarget).hide();
            $(domTarget).html(data).promise().done(function(){
                setTimeout( function () {
                    if (!dontShow)
                        $(domTarget).show();
                    callback();
                }, hideUntilAfter)
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Something went wrong when loading " + fileName);
            console.log("Status: " + textStatus + " Error: " + errorThrown);
        }  
    });
}

function loadHTML (fileName, callback) {
    $.ajax({
        url: fileName,
        data: {},
        success: function (data) {
            callback(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Something went wrong when loading " + fileName);
            console.log("Status: " + textStatus + " Error: " + errorThrown);
        }  
    });
}


function callAPI (targetURL, type, callData, callback) {
    $.ajax({
        url: targetURL,
        data: callData,
        type: type,
        success: function (data) {
            callback(data);
          }
    });
}



