var OnboardingCourses = class OnboardingCourses {
    constructor (mainDiv) {
        this.colors = ['rgba(68, 108, 179, 1)', 'rgba(107, 185, 240, 1)'];
        this.quarters_short = ['fa', 'wi', 'sp', 's1', 's2'];
        this.quarters_long = ['Fall ', 'Winter ', 'Spring ', 'SS1 ', 'SS2 '];
        this.tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
        this.fetchCourses();
    }

    fetchCourses() {
        var apiURL = login_origins.backend + "/getCourses";
        callAPI(apiURL, "GET", {}, function (data) {
            this.loadCourses(data, true);
            this.data = data;
        }.bind(this));
    }
    
    sortData(data) {
        var quarterPriority = {
            "wi" : 1,
            "sp" : 2,
            "s1" : 3,
            "s2" : 4,
            "fa" : 5
        };
        data.sort(
            function(x,y){
                if(!x || !y || x.Quarter == null || y.Quarter == null || x.Quarter.length < 4 || y.Quarter.length < 4) return 0;
                if(x.Quarter.substring(2,4) - y.Quarter.substring(2,4) != 0) return (y.Quarter.substring(2,4) - x.Quarter.substring(2,4));
                else {
                    var result = quarterPriority[y.Quarter.substring(0,2)] - quarterPriority[x.Quarter.substring(0,2)];
                    if (result === 0) result = x.Course.localeCompare(y.Course, undefined, {numeric: true, sensitivity: 'base'});
                    return result;
                }
            }
        );
    }

    loadCourses(data, toSort) {
        /* Sort */
        if(toSort) this.sortData(data);
        
        for(var i = 0; i < data.length; i++) {
            /* Row Creation */
            var row = document.createElement('tr');
            var cell = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell.className = 'cell cell-end';
            cell2.className = 'cell cell-mid';
            cell3.className = 'cell cell-end';
            row.className = 'table-row animated fadeInUpBig';
            if ( i < 10) $(row).css({"-webkit-animation-delay": i*10/data.length + "s"});
            row.id = data[i]['Id'];
     
            var link_anchor = document.createElement('a');
            link_anchor.href = "#/courses/" + row.id;
            $(link_anchor).css({"text-decoration": "none"});
            var course = document.createTextNode(data[i]['Course']);
            var qtr = data[i]['Quarter'];
            
            /* Quarter Conversion */
            var index = 0;
            while (qtr.indexOf(this.quarters_short[index]) <= -1 && index < this.quarters_short.length) {index++}
            qtr = this.quarters_long[index] + qtr.slice(-2);
            $(row).css({'background-color': this.colors[i % 2]});
            
            /* Appending Items to Cells and Cells to Row*/
            var quarter = document.createTextNode(qtr);
            var sym = document.createElement('i');
            sym.setAttribute('aria-hidden', 'true');
            sym.className = 'fa fa-graduation-cap sym'; //fa-graduation-cap
            cell.appendChild(course);
            cell2.appendChild(sym);
            cell3.appendChild(quarter);
                       
            link_anchor.appendChild(row);
            this.tableRef.appendChild(link_anchor);
        }
    }
}

/* Search Function */
function onboardingSearch() {
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
      var course = td.innerHTML + " " + td2.innerHTML;
      var nospace = course.replace(/\s/g,'');
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1 ||
          td1.innerHTML.toUpperCase().indexOf(filter) > -1 ||
          td2.innerHTML.toUpperCase().indexOf(filter) > -1 || 
          course.toUpperCase().indexOf(filter) > -1 ||
          nospace.toUpperCase().indexOf(filter) > -1) {
          tr[i].className = 'table-row';
          tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
        count++;
      }
    }
  }
  // No Results Logic
  if (count == tr.length) $('.no-results-courses').addClass('no-results-show');
  else $('.no-results-courses').removeClass('no-results-show');
}