var OnboardingCourses = class OnboardingCourses {
    constructor (coursesData, mainDiv) {
        this.coursesData = coursesData;
        this.autokeys = [];
        this.mainDiv = $(mainDiv).find(".onboarding-courses-module");
        this.tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
        this.fetchCourses();
        this.initAutocomplete();
    }

    fetchCourses() {
        var apiURL = "./fake_data/getCourses.json";
        callAPI(apiURL, "GET", {}, function (data) {
            this.loadCourses(data);
        }.bind(this));
    }
    
    loadCourses(data) {
        for(var i = 0; i < data.length; i++) {
            var row = this.tableRef.insertRow(this.tableRef.rows.length);
            var cell = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell.className = 'cell cell-end';
            cell2.className = 'cell cell-mid';
            cell3.className = 'cell cell-end';
            row.className = 'table-row';
            row.id = data[i]['Course'];
            var att = document.createAttribute('onclick');
            var path = window.location.pathname;
            att.value = "document.location = '" + path + "#/course_homepage/" + data[i]['Id'] + "'";   
            row.setAttributeNode(att);
            var course_str = data[i]['Course'];
            var title_str = data[i]['Title'];
            var quarter_str =  data[i]['Quarter'];
            var course = document.createTextNode(course_str);
            var title = document.createTextNode(title_str);
            var quarter = document.createTextNode(quarter_str);
            cell.appendChild(course);
            cell2.appendChild(title);
            cell3.appendChild(quarter);
        } 
    }
    
    initAutocomplete() {
        var self = this;
        var apiURL = "./fake_data/getCourses.json";
        callAPI(apiURL, "GET", {}, function (data) {
            for (var x = 0; x < data.length; x++) {
                self.autokeys.push(data[x]['Course']);
            }
            console.log(self.autokeys);
            $("#searchBar").autocomplete({
                source: self.autokeys,
                minLength: 2,
            });
        });
        
        document.getElementById("searchBar").addEventListener("change", function() {
            var text = document.getElementById('searchBar').value.toLowerCase();
            if ($.inArray(text, self.autokeys) == -1)
                self.autokeys.push(text);
            console.log(self.autokeys);
        });                   
    }
}











/*
$(".table-row").click(function() {
     window.location = this.data("link");
    });*/

/* Search Function */
function myFunction() {
  var input, filter, table, tr, td, td1, td2, i;
  input = document.getElementById("searchBar");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    td1 = tr[i].getElementsByTagName("td")[1];
    td2 = tr[i].getElementsByTagName("td")[2];
    if (td && td1 && td2) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1 ||
          td1.innerHTML.toUpperCase().indexOf(filter) > -1 ||
          td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }    
  }
}
/* Sort Function */
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("tr");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}