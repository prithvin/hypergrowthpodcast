
class videoClass {
    
    constructor (url, timestamp, mainDiv) {
            this.mainDiv = mainDiv;
            this.index = 0;
           
            this.setSource(url);
            this.setTime(timestamp);
            this.getTime();
            this.initHotKeys();
            this.initListeners();

    }
    
    initListeners(){
        var self = this;

        $('#prevButton').click(function(){
            var event = new CustomEvent('changeVideo', {'detail': "previous"});
            self.mainDiv.trigger('changeVideo', ["prev"]);
        });
        $('#nextButton').click(function(){
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
   
    setSource(source){
        console.log("loading: " + source);
        videojs('my-video').src({type: 'video/mp4', src: source});
        this.source = source;
    }
    
    initHotKeys(){
      
        videojs('my-video').hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
        });
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


}