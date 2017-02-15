class CourseVideosClass {
    constructor (params, mainDiv, controller) {
        this.params = params;
        this.mainDiv = mainDiv;
        this.controller = controller;
        
        var masterDiv = document.getElementById('course-videos-div');
        document.getElementById('course-title').innerHTML = params['CourseTitle'];
        
        var row = document.createElement('div');
        row.className = 'row';
        masterDiv.appendChild(row);
        
        var videos = params['Videos'];
        for (var i = 0; i < videos.length; i++) {
            if (row.childElementCount == 3) {
                row = document.createElement('div');
                row.className = 'row';
                masterDiv.appendChild(row);
            }
            var videoDiv = document.createElement('div');
            videoDiv.className = 'col-md-4';
            row.appendChild(videoDiv);
            
            var img = document.createElement('img');
            img.className = 'img-fluid';
            img.src = videos[i]['PreviewImage'];
            videoDiv.appendChild(img);
            
            var heading = document.createElement('h5');
            heading.align = 'center';
            heading.innerHTML = videos[i]['Date'];
            videoDiv.appendChild(heading);
        }
        
//        this.loadHeader(this.params["Name"], this.params["ProfilePic"]);
//        this.loadMainContent(this.params["Content"], this.params["TimeOfPost"], this.params["SlideOfPost"]);
//        this.loadCommentContent(this.params["Comments"]);
//        this.postId = this.params["PostId"];
//
//        var parentClass = this;
//        $(this.mainDiv).find(".comment-form").on("submit", function (ev) {
//            ev.preventDefault();
//            console.log(parentClass.postId);
//            parentClass.addComment($(parentClass.mainDiv).find(".comment-answer"), currentUserPic, currentUserName, new Date().getTime());
//        })
    }
}


/* Sample call

new CourseVideosClass(
    {
     "CourseTitle": "CSE 100 - Advanced Data Structures - Winter 2017",
     "Videos": [
     {
        "Id" : 1,
        "Date" : "Mon 1/0",
        "PreviewImage": "https://image.ibb.co/fLk5Dv/slide.jpg"
     },
     {
        "Id" : 2,
        "Date" : "Mon 1/0",
        "PreviewImage": "https://image.ibb.co/fLk5Dv/slide.jpg"
     },
     {
        "Id" : 3,
        "Date" : "Mon 1/0",
        "PreviewImage": "https://image.ibb.co/fLk5Dv/slide.jpg"
     },
     ]
    }
)

new APost(
    {"Name": "Rauhmel Bob",
     "ProfilePic": "http://3.bp.blogspot.com/-AMQ283sRFI4/VeMuQ2FeLdI/AAAAAAAC_4k/cWfG1Hmg4d8/s1600/Miley_Cyrus_E%2521_NEWS.jpg", 
     "Content": "This is a test post with some random data just to test the functionality", 
     "TimeOfPost": 1486659593882, 
     "SlideOfPost": 5,
     "Comments": [
     {
        "Pic" : "http://3.bp.blogspot.com/-AMQ283sRFI4/VeMuQ2FeLdI/AAAAAAAC_4k/cWfG1Hmg4d8/s1600/Miley_Cyrus_E%2521_NEWS.jpg",
        "PosterName" : "Rauhmel Tob",
        "Content" : "This is a really cool test commement",
        "Time" : 1486691019627
     },
     {
        "Pic" : "http://3.bp.blogspot.com/-AMQ283sRFI4/VeMuQ2FeLdI/AAAAAAAC_4k/cWfG1Hmg4d8/s1600/Miley_Cyrus_E%2521_NEWS.jpg",
        "PosterName" : "LOL Bob",
        "Content" : "This is a really cool test commement and it is going to be abbsurdley long to test a weird edge case that wil hopefully not break everything",
        "Time" : 1486691009627
     }
     ]
    }, "Prithvi Narasimhan", "http://pages.stern.nyu.edu/~sbp345/websys/phonegap-facebook-plugin-master/src/android/facebook/FacebookLib/res/drawable/com_facebook_profile_picture_blank_square.png", null, $(".post-container"))

*/