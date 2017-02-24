class Notes{
    
    constructor(mainDiv, text){
        this.mainDiv = mainDiv;
        this.typingTimer;
        this.doneTypingInterval = 10;
        this.finaldoneTypingInterval = 2000;
        var today = new Date();
        this.m = today.getMonth();
        this.d = today.getDate();
        this.m = this.checkTime(this.m);
        this.d = this.checkTime(this.d);
        this.initListeners();

    }
    
    checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };



    initListeners(){
        this.mainDiv.find('.notes-content, .notes-title').keydown(function() {
            clearTimeout(this.typingTimer);
            if ($('.content, .title').val) {
                this.typingTimer = setTimeout(function() {
                $(".rest").removeClass('active');
                    $(".notes-dot").removeClass('saved');
                }, this.doneTypingInterval);
            }
        }.bind(this));
        this.mainDiv.find('.notes-content, .notes-title').keyup(function() {
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(function() {
                $('.rest').addClass('active');
                $('.notes-dot').addClass('saved');
                $('.comment').html('Last updated by you on ' + this.m + '/' + this.d +'')
            }.bind(this), this.finaldoneTypingInterval);
        }.bind(this));
        
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
        }
        this.mainDiv.find("#selectedFile").change(this.previewFile.bind(this));
    }
    
    previewFile() {
        var file = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();

        reader.onloadend = function () {
            reader.result;
            console.log(reader.result)
            this.mainDiv.find('.notes-content').append('<img src="' + reader.result + '" />');
        }

        if (file) {
            reader.readAsDataURL(file);
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(function() {
                this.mainDiv.find('.rest').addClass('active');
                this.mainDiv.find('.notes-dot').addClass('saved');
                this.mainDiv.find('.comment').html('Last updated by you on ' + this.d + '/' + this.m +'')
            }, this.finaldoneTypingInterval);
        } else {
        }
    }

    
}
