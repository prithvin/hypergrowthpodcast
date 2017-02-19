var OnboardingCourses = class OnboardingCourses {
    constructor (coursesData, mainDiv) {
        this.coursesData = coursesData;
        this.mainDiv = $(mainDiv).find(".onboarding-courses-module");
        this.tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
        this.loadCoursesFromServer();
        $(".table-row").click(function() {
            window.location = this.data("link");
        })
    }

    loadCoursesFromServer() {
        var thus = this;
        var apiURL = "./fake_data/getCourses.json";
        callAPI(apiURL, "GET", {}, function (data) {
            for(var i = 0; i < data.length; i++) {
                var row = thus.tableRef.insertRow(thus.tableRef.rows.length);
                var cell = row.insertCell(0);
                cell.className = 'cell';
                row.className = 'table-row';
                row.id = data[i]['Course'];
                var att = document.createAttribute('onclick');
                var pathArray = window.location.pathname.split( '/' );
                var newPathname = window.location.pathname;
                att.value = "document.location = '" + newPathname + "#/course_homepage/1'";   // Course Path
                console.log(att);
                row.setAttributeNode(att);
                console.log(row);
                var myClass = document.createTextNode(data[i]['Course'] + ' - ' + data[i]['Quarter']);
                cell.appendChild(myClass);
            }
        });
    }   
}

/* Search Function */
function myFunction() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchBar");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}