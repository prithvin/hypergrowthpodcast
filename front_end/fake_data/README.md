This folder will contain the fake data for us to use to "process" AJAX requests 
until the backend is completed.

DO NOT make fake data without consulting with someone on the backend CRUD team first. 
This folder will be deleted once the backend CRUD is ready.

Fake Data Available:

    --API: ./fake_data/getPosts.json
    Fetch posts for lecture (sidebar on podcast page)
        -Pass in PodcastID
    Fetch posts for course (sidebar on course home page)
        -Pass in CourseID
    Fetch posts for search (sidebar on search page)
        -Pass in CourseID and SearchTerm
        Implementation Details: Goes through every single post in a course, and if a post has a keyword match, then that post is returned. 

    --API: ./fake_data/getUser.json
    Get current user
        -Literally based on session (nothing ot pass in)
        {
            Name:
            Pic: 
        } RETURNED

    Get notes for User


    IsUserLoggedIn
        -Must call before calling get current user due to limitations in spoofing data
        -Will always return false


TODO - for prithvi (give to others)
    -2 other dummy apis
    -OCR, audio transcription dummy data
    -Podcast video dummy data with SRT stuff, recommendations and etc.
    -OCR, audio transcription data passed in and used in search
    -Navbar menu working
    -default video start time data and other video data stuff passed in to search (in podcast) and podcast layer
    -Make/test listener for when anything in post is clicked for pages that need it
    -Fix up video APIS
    -Set up passing parameters to other pages with hyper links (video data nad stuff for podcast page)
    -User notes
    