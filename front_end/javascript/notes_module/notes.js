class Notes{
    
    constructor(mainDiv, text){
        this.text = text;
        this.mainDiv = mainDiv;

        this.getTime();
        this.initListeners();
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
            
        }
        else{
            this.ap = "PM";
            this.hour -= 12;
        }
        if(this.hour == 0){
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
    };



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
            console.log(textToSave);
            if(textToSave != this.text){
                this.text = textToSave;
                console.log("saved");
                this.getTime();
                $('.comment').html('Last updated on ' + this.month + '/' + this.day + ' at ' + this.hour + ":" + this.min + " " + this.ap);

            }
        }.bind(this));
        
        /*
        document.onpaste = function(event){
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            console.log(JSON.stringify(items)); // will give you the mime types
            for (index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                var blob = item.getAsFile();
                var reader = new FileReader();
                reader.onload = function(event){
                        console.log(event.target.result); // data url!
                        $('.notes-content').append('<img src="' + event.target.result + '" />');
                        $('.comment').html('Last updated by you on ' + this.m + '/' + this.d +'')
                    }.bind(this);
                reader.readAsDataURL(blob);
                }
            }
        }*/
    }
    
    

    
}
