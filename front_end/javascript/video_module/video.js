class videoClass {
    
    constructor (urlParams) {
            //loadCSSBasedOnURLPath();

            this.index = 0;
            this.srcAttr = $("#videosrc");
            this.urlParams = urlParams;
            this.sid = 0;
            var self = this;
            this.loadScriptJS("http://vjs.zencdn.net/5.16.0/video.js", function(){
                self.initSourceArray(self.getDataOrDefault("source"));
                self.setSource(self.getDataOrDefault("index"));
                self.setTime(self.getDataOrDefault("time"));
                self.getTime();
                self.initHotKeys();
                self.changeVideo();
            });
            
            
    }
    
    getDataOrDefault (key) {
        if (this.urlParams[key] == null)
            return 0;
        var result = decodeURIComponent(this.urlParams[key])
        if (key == "index"){
            return parseInt(result);
        }
        return result;
    }
    
    initSourceArray(source){
        this.sourceArray = JSON.parse(source);
        console.log("loaded video series of length " + this.sourceArray.length);
    }
    
    updateNavButtons(){
        if(this.index <= 0){
            document.getElementById("prev").style.visibility = "hidden";
        }
        else{
            document.getElementById("prev").style.visibility = "visible";
        }
        if(this.index >= this.sourceArray.length - 1){
            document.getElementById("next").style.visibility = "hidden";
        }
        else{
            document.getElementById("next").style.visibility = "visible";
        }
        
    }
    
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
    }
    
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

    }
    
    initHotKeys(){
        this.loadScriptJS("https://cdn.sc.gl/videojs-hotkeys/0.2/videojs.hotkeys.min.js", 
                           function(){
            videojs('my-video').hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableModifiersForNumbers: false
            });
        });        
    }
    
    setTime(time){
        videojs('my-video').currentTime(time);   
    }
    
    getTime() {
       document.addEventListener('getTime', function(e){
            videojs('my-video').ready(function() {
                var video = videojs('my-video');
                var time = video.currentTime();
                var minutes = Math.floor(time/60);   
                var seconds = Math.floor(time - minutes * 60)
                var x = minutes < 10 ? "0" + minutes : minutes;
                var y = seconds < 10 ? "0" + seconds : seconds;
                //console.log(x + ':' + y);
                document.getElementById("timer").innerHTML = x + ':' + y;
            });
        });
    }
    
    changeVideo() {
        var thus = this;
        document.addEventListener('changeVideo', function(e){
            videojs('my-video').ready(function() {
                console.log(e.detail);
                
                if ((e.detail) == ('previous')) {
                    if(thus.index <= 0){
                        console.log("Already at start of video series");
                        return;
                    }
                    thus.setSource(thus.index - 1);
                    console.log("loading prev");
                } else {
                    if(thus.index >= thus.sourceArray.length - 1){
                        console.log("Already at end of video series");
                        return;
                    }
                    thus.setSource(thus.index + 1);
                    console.log("loading next");
                }
                videojs('my-video').load();
            });
        });
    }  
    
    loadScriptJS( scriptURL, callback ) {
        var script = document.createElement( "script" );
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
      document.getElementsByTagName( "footer" )[0].appendChild( script );
    }


}