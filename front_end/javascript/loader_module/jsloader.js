function loadJavascriptDynamically (arr, callback) {
    loadJSDynamicallyHelper(arr, 0, callback);
}

function loadJSDynamicallyHelper (arr, index, callback) {
    if (index == arr.length) {
        callback();
        return;
    }
    $.getScript(arr[index], function(data, textStatus, jqxhr) {
        if (textStatus != "success") {
            console.error(arr[index] + " failed to load");
        }
        loadJSDynamicallyHelper(arr, index + 1, callback);
    });
}

function loadCSSDynamically (url) {
    $("head").append("<link>");
    var css = $("head").children(":last");
    css.attr({
          rel:  "stylesheet",
          type: "text/css",
          href: url
    });
}