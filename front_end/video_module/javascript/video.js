
class videoClass {
    
    
    
    constructor (urlParams) {
        this.urlParams = urlParams;
        this.initSourceArray(this.getDataOrDefault("source"));

        this.setSource(this.getDataOrDefault("index"));
        this.setTime(this.getDataOrDefault("time"));

        this.initHotKeys();
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
        console.log("loading: " + this.sourceArray[this.index]);
        $("#videosrc").attr("src", this.sourceArray[this.index]);

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
                            
                                                        
    

}