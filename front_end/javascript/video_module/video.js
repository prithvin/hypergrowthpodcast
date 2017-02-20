
class videoClass {
    
    constructor (url, timestamp, mainDiv, srtFile) {

            this.mainDiv = mainDiv;
            this.index = 0;
            var self = this;
            //this.getInfo()
        
            this.initWithCaptions(function(){
            self.setSource(url);
            self.setTime(timestamp);
            self.getTime();
            self.initHotKeys();
            self.initListeners();
            });
           
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
    initWithCaptions(callback){
        callAPI("./fake_data/getVideo.json", "GET", {}, function(data){
            //var duri = window.URL.createObjectURL(data['SRTFile']);
            var content = data['SRTFile'];
            var f = new File([content], "captionFile.srt");
            var duri = URL.createObjectURL(f);
            //console.log(content);
            var furi = "fake_data/sample.vtt";
            videojs('my-video', {
                controls:true,
                class: 'video-js vjs-default-skin vjs-big-play-centered vjs-16-9',
                playbackRates: [1,1.5,2], 
                autoplay: true,
                  tracks: [
                    { src:furi, kind:'captions', srclang:'en', label:'English' }
                  ]
                }, callback);
        });
    }

}