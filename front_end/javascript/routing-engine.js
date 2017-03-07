require(['director', 'components', 'loader', 'config'], function () {

  function timeToHideLoader (time) {
    if (!time)
      time = 0;
    setTimeout(function () {
       $("#loader-animation").fadeOut();
    }, time);
  };



  var loginPage = function () {
    $("#loader-animation").show();
    require(['onboarding'], function () {
      loadComponent("OnboardingFrontPage", $("#page"), function () {
        new Onboarding($('#page').find('.onboarding-page'));
        timeToHideLoader(1000);
      });
    });
  };

  var onboardingCoursesPage = function(courses) {
    $("#loader-animation").show();
    loadComponentOrLogin("OnboardingCoursesModule", $("#page"), function () {
      require(['course-selection'], function () {
        new OnboardingCourses($("#page").find(".onboarding-courses-page"));
        timeToHideLoader(1000);
      });
    });
  }


  var podcast = function (podcastId, slide) {
    $("#loader-animation").show();
    if (!slide)
      slide = 0;

    loadComponentOrLogin("PodcastModule", $("#page"), function () {
      require(['podcast'], function () {
        new PodcastPage(podcastId, $("#page").find(".podcast-page-div"), slide, function() {
          $("#loader-animation").fadeOut();  
        });
      });
    });
  };

  var search = function (courseId, searchTerm) {
    searchTerm = decodeURIComponent(searchTerm);
    $("#loader-animation").show();

    require(['searchResults'], function () {
      loadComponentOrLogin("CourseSearchModule", $("#page"), function () {
        new SearchPage(courseId, $("#page").find(".search-results-div"), searchTerm);
        timeToHideLoader(1000);
      });
    });
  };

  var courseHomepage = function(courseId) {
    $("#loader-animation").show();
    loadComponentOrLogin("CourseHomepageModule", $("#page"), function() {
      require(['course-homepage'], function() {
        new CourseHomepageClass(courseId, $("#page").find(".course-homepage-div"), function() {
          timeToHideLoader(1000);
        });
      });
    });
  }

  var routes = {
    '/podcast/:podcastId': podcast,
    '/podcast/:podcastId/:slide': podcast,
    '/search/:courseId/:searchTerm': search,
    '/': loginPage,
    '': loginPage,
    '/courses/:courseId': courseHomepage,
    '/courses': onboardingCoursesPage
  };

  var router = Router(routes);

  // Scripts above are required on every single page

  loadComponent("LoaderModule", $("#loader-animation"), function () {
    setTimeout(function () {
      router.init('/');
    }, 20);
  });
});
  
     