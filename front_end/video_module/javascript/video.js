class videoClass {
    constructor (urlParams) {
        this.urlParams = urlParams;
        this.setSource(this.getDataOrDefault("source"));
        
        this.setTime(this.getDataOrDefault("time"));
    }
    
    getDataOrDefault (key) {
        if (this.urlParams[key] == null)
            return "N/A";
        return decodeURIComponent(this.urlParams[key]);
    }

    setSource(source){
        $("#videosrc").attr("src", source);
    }
    setTime(time){
        var video = videojs("my-video");
        video.currentTime(time);
    }

}