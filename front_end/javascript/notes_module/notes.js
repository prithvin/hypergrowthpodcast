class Notes{
    
    constructor(mainDiv, text, podcastid){
        this.text = text;
        this.mainDiv = mainDiv;
        this.podcastid = podcastid;

        this.getTime();
        this.initListeners();
        if (!text)
            text = "";
        if(text.length > 0){
            this.mainDiv.find('.notes-content').text(text);
        }
    }
    
    getTime(){
        var today = new Date();
        this.month = today.getMonth();
        this.day = today.getDate();
        this.hour = today.getHours();
        this.min = today.getMinutes();
        
        if(this.hour < 12){
            this.ap = "AM";
x
        }
        else{
            this.ap = "PM";
            this.hour -= 12;
        }
        if(this.hour === 0){
            this.hour = 12;
        }
        this.month = this.checkTime(this.month);
        this.day = this.checkTime(this.day);
        
    }
    checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }



    initListeners(){
        this.mainDiv.find('.notes-content').keydown(function(event) {
            if(event.keyCode == 9){
            //add tab
            document.execCommand('insertHTML', false, '&#009');
            //prevent focusing on next element
            event.preventDefault();   
          }
        }.bind(this));
        
        this.mainDiv.find('.save').click(function(){
            
            var textToSave = $(".notes-content")[0].innerText;
            if(!textToSave){
                textToSave = $(".notes-content").html().trim().replace(/<br\s*\/*>/ig, '\n') .replace(/(<(p|div))/ig, '\n$1') .replace(/(<([^>]+)>)/ig, "");
            }

            if(textToSave != this.text){
                var obj = {
                    "PodcastId": this.podcastid,
                    "Content": textToSave
                };
                callAPI(login_origins.backend + "/createNotes", "POST", obj, function (postID) {
                    this.text = textToSave;
                    this.getTime();
                    $('.comment').html('Last updated on ' + this.month + '/' + this.day + ' at ' + this.hour + ":" + this.min + " " + this.ap);
                }.bind(this));
            }
        }.bind(this));
    
    }
    
    

    
}
