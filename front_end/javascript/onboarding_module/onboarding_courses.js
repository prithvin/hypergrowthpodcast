var OnboardingCourses = class OnboardingCourses {
    constructor (mainDiv) {
        this.tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
        this.fetchCourses();
    }

    fetchCourses() {
        var apiURL = login_origins.backend + "/getCourses";
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
            row.id = data[i]['Id'];
            
            row.addEventListener("click", function() {
                var baseURL = window.location.origin + window.location.pathname;
                var targetURL = baseURL + "#/courses/" + this.id;
                window.location.href = targetURL;
                window.location.hash =  "/courses/" + this.id;
            });  
            
            var course = document.createTextNode(data[i]['Course']);
            var qtr = data[i]['Quarter'];
            if (qtr.indexOf("fa") > -1) qtr = "Fall " + qtr.slice(-2);
            if (qtr.indexOf("wi") > -1) qtr = "Winter " + qtr.slice(-2);
            if (qtr.indexOf("sp") > -1) qtr = "Spring " + qtr.slice(-2);
            if (qtr.indexOf("s2") > -1) qtr = "SS2 " + qtr.slice(-2);
            if (qtr.indexOf("s1") > -1) qtr = "SS1 " + qtr.slice(-2);
            var quarter = document.createTextNode(qtr);
            var sym = document.createElement('i');
            var att = document.createAttribute('aria-hidden');
            att.value = 'true';
            sym.setAttributeNode(att);
            sym.className = 'fa fa-graduation-cap sym'; //fa-graduation-cap
            cell.appendChild(course);
            cell2.appendChild(sym);
            cell3.appendChild(quarter);
        } 
    }
}

/* Search Function */
function myFunction() {
  var input, filter, table, tr, td, td1, td2, i;
  input = document.getElementById("searchBar1");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  var count = 0;
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
        count++;
      }
    }    
  }
  if (count == tr.length - 1) {
      // No results
      $('.no-results-courses').addClass('no-results-show');
  } else {
      $('.no-results-courses').removeClass('no-results-show');
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