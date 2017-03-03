
class videoClass {
    
    constructor (url, timestamp, mainDiv, srtData, slides, callback) {

        this.mainDiv = mainDiv;
        this.slides = slides;
        this.index = 0;
        var self = this;
        //this.getInfo()
    
        this.initWithCaptions(srtData, function(){
            var player = videojs('my-video');

            self.setSource(url);
            self.setTime(timestamp);
            self.getTime();
            self.initHotKeys();
            self.initListeners();
            callback();
        });
           
    }
    
    initListeners(){
        var self = this;

        //when to change video
        this.mainDiv.on('changeVideo', function(e, deet){
            videojs('my-video').ready(function() {
            });
        });

        this.timeUpdateListener(videojs('my-video'));
    }
   
    setSource(source){
        videojs('my-video').src({type: 'video/mp4', src: source});
        this.source = source;
    }
    
    initHotKeys(){
      
        videojs('my-video').hotkeys({
          //  volumeStep: 0.1,
            seekStep: 10,
            enableModifiersForNumbers: false,
            enableVolumeScroll: false
        });
    }
    
    setTime(time){
        videojs('my-video').currentTime(time);   
    }

    timeUpdateListener (video) {  
        var currentSlide = 1;
        video.ready(function() {    
            video.on('timeupdate', function () {
                var newSlide = this.getSlideForTime(video.currentTime());
                if (newSlide != currentSlide) {
                    $(this.mainDiv).trigger( "slideChange", [ newSlide ] );
                    currentSlide = newSlide;
                }
            }.bind(this));
        }.bind(this));
    }
    getSlideForTime (timeValueInSeconds) {
        var targetSlide = this.getSlideForTimeHelper(this.slides, function(x){
            return x-timeValueInSeconds;
        });
        return targetSlide + 1; // slides start at index 1!!
    }

    getSlideForTimeHelper (arr, compare) {
        var l = 0,
        r = arr.length - 1;
        while (l <= r) {
            var m = l + ((r - l) >> 1);
            var comp = compare(arr[m]);
            if (comp < 0) // arr[m] comes before the element
                l = m + 1;
            else if (comp > 0) // arr[m] comes after the element
                r = m - 1;
            else // arr[m] equals the element
                return m;
        }
        return l-1; // return the index of the next left item
                    // usually you would just return -1 in case nothing is found
    }


    getTime() {
       this.mainDiv.on('getTime', function(e){
            videojs('my-video').ready(function() {
                var video = videojs('my-video');
                var time = video.currentTime();
                var minutes = Math.floor(time/60);   
                var seconds = Math.floor(time - minutes * 60);
                var x = minutes < 10 ? "0" + minutes : minutes;
                var y = seconds < 10 ? "0" + seconds : seconds;
            }.bind(this));
        }.bind(this));
    }
    initWithCaptions(srtData, callback){
       
            var f = new File([srtData], "captionFile.srt");
            var duri = URL.createObjectURL(f);
            
            //reinit videojs 
            if(videojs.getPlayers()['my-video']) {
                delete videojs.getPlayers()['my-video'];
            }
            videojs('my-video', {
                controls:true,
                class: 'video-js vjs-default-skin vjs-big-play-centered vjs-16-9',
                playbackRates: [1,1.25,1.5,1.75,2,2.25,2.5], 
                autoplay: false,
                  tracks: [
                    { src:duri, kind:'captions', srclang:'en', label:'English' }
                  ]
            }, callback);
                    

    }

}