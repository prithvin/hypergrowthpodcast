
class videoClass {

    constructor (urlParams) {
        this.urlParams = urlParams;
        this.setSource(this.getDataOrDefault("source"),this.getDataOrDefault("previous"),this.getDataOrDefault("next"));
        this.setTime(this.getDataOrDefault("time"));
        this.getTime();
        this.initHotKeys();
        this.changeVideo();
    }
    
    getDataOrDefault (key) {
        if (this.urlParams[key] == null)
            return "N/A";
        return decodeURIComponent(this.urlParams[key]);
    }

    setSource(source, previous, next){
        $("#videosrc").attr("src", source);
    }
    
    initHotKeys(){
        document.addEventListener('videojsLoaded', function(e){
            videojs('my-video').ready(function() {
                console.log("loading hotkeys");
                this.hotkeys({
                    volumeStep: 0.1,
                    seekStep: 5,
                    enableModifiersForNumbers: false
                });
            });
        });
        
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
        document.addEventListener('changeVideo', function(e){
            videojs('my-video').ready(function() {
                if (e.type == 'previous')
                    $("#videosrc").attr("src", "prev");
                else
                    $("#videosrc").attr("src", "next");
                videojs('my-video').load();
                console.log(document.getElementById("videosrc").src);
            });
        });
    }                                                    

}