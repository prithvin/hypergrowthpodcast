
class videoClass {

    constructor (urlParams) {
        this.urlParams = urlParams;
        this.setSource(this.getDataOrDefault("source"));
        this.setTime(this.getDataOrDefault("time"));

        this.initHotKeys();
    }
    
                     
        
    getDataOrDefault (key) {
        if (this.urlParams[key] == null)
            return "N/A";
        return decodeURIComponent(this.urlParams[key]);
    }

    setSource(source){
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

}