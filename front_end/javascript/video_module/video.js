
class videoClass {
    
    constructor (urlParams, mainDiv) {
            this.mainDiv = mainDiv;
        console.log(this.mainDiv);
            this.index = 0;
           // this.srcAttr = $("#videosrc");
            this.urlParams = urlParams;
            //this.sid = 0;
            //var self = this;
            //this.loadScriptJS("http://vjs.zencdn.net/5.16.0/video.js", function(){
            //this.initSourceArray(this.getDataOrDefault("source"));
            this.setSource(this.getDataOrDefault("source"));
            this.setTime(this.getDataOrDefault("time"));
            this.getTime();
            this.initHotKeys();
                    this.initListeners();

            //this.changeVideo();
            //});
            
            
    }
    
    initListeners(){
        var self = this;

        $('#prevButton').click(function(){
            //console.log("got changeVid event prev");

            var event = new CustomEvent('changeVideo', {'detail': "previous"});
            self.mainDiv.trigger('changeVideo', ["prev"]);
        });
        $('#nextButton').click(function(){
            //console.log("got changeVid event next");

            //var event = new CustomEvent('changeVideo', {'detail': "next"});
            self.mainDiv.trigger('changeVideo', ["next"]);
        });
        
        videojs('my-video').on("timeupdate", function() {
                videojs('my-video').ready(function() {
                    var video = videojs('my-video');
                    var time = video.currentTime();
                    var minutes = Math.floor(time/60);   
                    var seconds = Math.floor(time - minutes * 60)
                    var x = minutes < 10 ? "0" + minutes : minutes;
                    var y = seconds < 10 ? "0" + seconds : seconds;
                    $("#timer").html(x + ':' + y);
                });
        });
        
        //when to change video
        this.mainDiv.on('changeVideo', function(e, deet){
            videojs('my-video').ready(function() {
                console.log("got changeVid event: " + deet);
            });
        });
    }
    getDataOrDefault (key) {
        if (this.urlParams[key] == null)
            return 0;
        var result = decodeURIComponent(this.urlParams[key]);
        /*if (key == "index"){
            return parseInt(result);
        }*/
        return result;
    }
    
    /*initSourceArray(source){
        this.sourceArray = JSON.parse(source);
        console.log("loaded video series of length " + this.sourceArray.length);
    }*/
    
    /*updateNavButtons(){
        if(this.index <= 0){
            this.mainDiv.find("#prevButton").style.visibility = "hidden";
        }
        else{
            this.mainDiv.find("#prevButton").style.visibility = "visible";
        }
        if(this.index >= this.sourceArray.length - 1){
            this.mainDiv.find("#nextButton").style.visibility = "hidden";
        }
        else{
            this.mainDiv.find("#nextButton").style.visibility = "visible";
        }
        
    }*/
    /*
    initSource(index){
            
        if(index < 0){
            index = 0;
            console.log("VIDEO SOURCE INDEX OUT OF BOUNDS");
        }
        else if(index >= this.sourceArray.length){
            index = this.sourceArray.length - 1;
            console.log("VIDEO SOURCE INDEX OUT OF BOUNDS");
        }
        console.log("loading: " + this.sourceArray[index]);
        $("#videosrc").attr("src", this.sourceArray[index]);
        this.index = index;
        this.updateNavButtons();
    }*/
    /*
    setSource(index){
            
        if(index < 0){
            index = 0;
            console.log("VIDEO SOURCE INDEX OUT OF BOUNDS");
        }
        else if(index >= this.sourceArray.length){
            index = this.sourceArray.length - 1;
            console.log("VIDEO SOURCE INDEX OUT OF BOUNDS");
        }
        console.log(index);
        console.log("loading: " + this.sourceArray[index]);
        videojs('my-video').src({type: 'video/mp4', src: this.sourceArray[index]});
        this.index = index;
        this.updateNavButtons();

    }*/
    setSource(source){
        console.log("loading: " + source);
        videojs('my-video').src({type: 'video/mp4', src: source});
        this.source = source;
    }
    
    initHotKeys(){
       // this.loadScriptJS("https://cdn.sc.gl/videojs-hotkeys/0.2/videojs.hotkeys.min.js", 
         //                  function(){
            videojs('my-video').hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableModifiersForNumbers: false
            });
       // });        
    }
    
    setTime(time){
        videojs('my-video').currentTime(time);   
    }
    
    getTime() {
       this.mainDiv.on('getTime', function(e){
           console.log("?");    
            videojs('my-video').ready(function() {
                var video = videojs('my-video');
                var time = video.currentTime();
                var minutes = Math.floor(time/60);   
                var seconds = Math.floor(time - minutes * 60)
                var x = minutes < 10 ? "0" + minutes : minutes;
                var y = seconds < 10 ? "0" + seconds : seconds;
                //console.log(x + ':' + y);
                ("#timer").html(x + ':' + y);
            });
        });
    }
    
    /*
    loadScriptJS( scriptURL, callback ) {
        var script = this.mainDiv.createElement( "script" );
        script.type = "text/javascript";
        if(script.readyState) {  //IE
            script.onreadystatechange = function() {
                if ( script.readyState === "loaded" || script.readyState === "complete" ) {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function() {
            callback();
        };
      }

      script.src = scriptURL;
      this.mainDiv.appendChild( script );
    }*/


}