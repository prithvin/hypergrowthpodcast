
class videoClass {
    
    constructor (urlParams) {

            this.urlParams = urlParams;
            this.initSourceArray(this.getDataOrDefault("source"));
        

        
        
            this.setTime(this.getDataOrDefault("time"));
            this.getTime();
            this.initAfterJS();
    }
    initAfterJS(){
        var thus = this;

        document.addEventListener('videojsLoaded', function(e){
            thus.setSource(thus.getDataOrDefault("index"));
            thus.initHotKeys();

            thus.changeVideo();

        });

    }
    getDataOrDefault (key) {
        if (this.urlParams[key] == null)
            return "N/A";
        return decodeURIComponent(this.urlParams[key]);
    }
    
    initSourceArray(source){
        this.sourceArray = JSON.parse(source);
        console.log("loaded video series of length " + this.sourceArray.length);
    }

    setSource(index){
        if(index < 0){
            this.index = 0;
            console.log("VIDEO SOURCE INDEX OUT OF BOUNDS");
        }
        else if(index >= this.sourceArray.length){
            this.index = this.sourceArray.length - 1;
            console.log("VIDEO SOURCE INDEX OUT OF BOUNDS");
        }
        else{
            this.index = index;
        }
        console.log(this.index);
        console.log("loading: " + this.sourceArray[this.index]);
        videojs('my-video').src({type: 'video/mp4', src: this.sourceArray[this.index]});
    }
    
    initHotKeys(){
        //document.addEventListener('videojsLoaded', function(e){
            videojs('my-video').ready(function() {
                console.log("loading hotkeys");
                this.hotkeys({
                    volumeStep: 0.1,
                    seekStep: 5,
                    enableModifiersForNumbers: false
                });
            });
        //});
        
    }
    
    setTime(time){
        document.getElementById("my-video").currentTime = time;   
        
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
                console.log(x + ':' + y);
                document.getElementById("timer").innerHTML = x + ':' + y;
            });
        });
    }
    
    changeVideo() {
        var thus = this;
        document.addEventListener('changeVideo', function(e){
            videojs('my-video').ready(function() {
                console.log(e.detail);
                console.log(e);
    
                if ((e.detail) == ('previous')) {
                    thus.setSource(thus.index - 1);
                    console.log("loading prev");
                } else {
                    thus.setSource(thus.index + 1);
                    console.log("loading next");
                }
                videojs('my-video').load();
                console.log(document.getElementById("videosrc").src);
            });
        });
    }                                                    

}