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
        document.getElementById("my-video").addEventListener("loadedmetadata", function() {
            this.currentTime = time;
        }, false);
    }

}