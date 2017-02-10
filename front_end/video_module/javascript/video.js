
class videoClass {

    constructor (urlParams) {
        this.urlParams = urlParams;
        this.setSource(this.getDataOrDefault("source"),this.getDataOrDefault("previous"),this.getDataOrDefault("next"));
        this.setTime(this.getDataOrDefault("time"));
        this.nextVid(this.getDataOrDefault("next"));
        this.prevVid(this.getDataOrDefault("previous"));
        this.initHotKeys();
    }
    
                     
        
    getDataOrDefault (key) {
        if (this.urlParams[key] == null)
            return "N/A";
        return decodeURIComponent(this.urlParams[key]);
    }

    setSource(source, previous, next){
        $("#videosrc").attr("src", source);
        /*$("#videosrc").src([
            { type: "video/mp4", src: "source" },
            { type: "video/mp4", src: "previous" },
            { type: "video/mp4", src: "next" }
        ]);*/
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
    
    showTime() {
        document.getElementById("my-video").addEventListener("timeupdate", function() {
            document.getElementById("timer").innerHTML = this.currentTime;
            currentTime = this.currentTime;
            console.log(currentTime);
        });
    }
    
    nextVid(next) {
        /*document.getElementById("next").addEventListener("click", function() {
            var video = document.getElementById('my-video');
            $("#videosrc").attr("src", next);
            video.load();
            console.log(document.getElementById("videosrc").src);
        });*/
    }
    
    prevVid(previous) {
        /*document.getElementById("prev").addEventListener("click", function() {
            var video = document.getElementById('my-video');
            $("#videosrc").attr("src", previous);
            video.load();
            console.log(document.getElementById("videosrc").src);
        });*/
    }
    
    
                            
                                                        
    

}