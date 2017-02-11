class NavBarLoggedInCourse {
    constructor (params) {

        this.params = params;

        this.setClassName(this.getDataOrDefault("classname"));
        this.setClassQuarter(this.getDataOrDefault("classqrtr"));
        this.setUserName(this.getDataOrDefault("firstname"));
        this.setProfPic(this.getDataOrDefault("profpic"));
        this.setCoursesHyperLink(this.getDataOrDefault("userid"));
        this.setPlaceHolder(this.getDataOrDefault("classname"), this.getDataOrDefault("classqrtr"));
    }

    getDataOrDefault (key) {
        if (this.params[key] == null && key != "profpic")
            return "N/A";
        else if (this.params[key] == null)
            return "http://static.boredpanda.com/blog/wp-content/uploads/2016/07/fox-faces-roeselien-raimond-red-fox.jpg";
        return decodeURIComponent(this.params[key]);
    }

    setClassName(className) {
        $("#className").html(className);
    }

    setClassQuarter(classQuarter) {
        $("#classQuarter").html(classQuarter);
    }

    setPlaceHolder(className, classQuarter) {
        $("#searchBar").attr("placeholder", "Search in " + className + " " + classQuarter);
    }
    setUserName(userFirstName) {
        $("#firstName").html(userFirstName);
    }


    setProfPic (userPicture) {
        $("#userProfPic").attr("src", userPicture)
    }

    setCoursesHyperLink (userID) {
        $("#course_button").on("click", function () {
            window.location = ("http://www.google.com/" + userID);
        })
    }

}