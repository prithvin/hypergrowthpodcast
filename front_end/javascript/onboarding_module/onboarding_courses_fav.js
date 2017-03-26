var OnboardingCourses = class OnboardingCourses {
    constructor (mainDiv) {
        this.colors = ['rgba(244, 162, 45, 1)', 'rgba(68, 108, 179, 1)', 'rgba(141, 193, 83, 1)', 'rgba(229, 77, 66, 1)', 'rgba(229, 77, 66, 1)', 'rgba(41, 187, 156, 1)'];
        this.quarters_short = ['fa', 'wi', 'sp', 's1', 's2'];
        this.quarters_long = ['Fall ', 'Winter ', 'Spring ', 'SS1 ', 'SS2 '];
        this.data = [];
        this.table = [];            /* Current Table Representation */
        this.favorites = [];        /* User's Favorites */
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
        
        var self = this;
        for(var i = 0; i < data.length; i++) {
            /* Row Creation */
            var row = document.createElement('tr');
            row.className = 'table-row animated fadeInUpBig';
            if ( i < 10) $(row).css({"-webkit-animation-delay": i*10/data.length + "s"});
            row.id = i;
            
            var cell = row.insertCell(0);
            cell.className = 'cell cell-end';
            cell.id = data[i]['Id'];
            
            var cell2 = row.insertCell(1);
            cell2.className = 'cell cell-mid';
            cell2.setAttribute('index', i);
            
            var cell3 = row.insertCell(2);
            cell3.className = 'cell cell-end';
            cell3.id = data[i]['Id'];
            
            /*var link_anchor = document.createElement('a');
            link_anchor.href = "#/courses/" + row.id;
            $(link_anchor).css({"text-decoration": "none"});*/
            
            cell.addEventListener("click", function() {
                    window.location.hash =  "/courses/" + this.id;
            });
            cell2.addEventListener("click", function() {
                var index = parseInt(this.getAttribute('index'));
                self.toggleCourseFavorite(self.data[index]['Course'], index);
            });
            cell3.addEventListener("click", function() {
                    window.location.hash =  "/courses/" + this.id;
            });
            
            /* Quarter String Conversion */
            var index = 0;
            var qtr = data[i]['Quarter'];
            while (qtr.indexOf(this.quarters_short[index]) <= -1 && index < this.quarters_short.length) {index++}
            qtr = this.quarters_long[index] + qtr.slice(-2);
            $(row).css({'background-color': this.colors[1]});
            
            /* Appending Items to Cells and Cells to Row*/
            var course = document.createTextNode(data[i]['Course']);
            var quarter = document.createTextNode(qtr);
            
            var sym = document.createElement('i');
            sym.setAttribute('aria-hidden', 'true');
            sym.className = 'fa fa-graduation-cap sym'; //fa-graduation-cap
            sym.id = data[i]['Course'];
            
            var starred = 'false';
            var starred = localStorage.getItem(sym.id);
            if (starred == undefined) starred = 'false';
            sym.setAttribute('starred', starred);
            
            cell.appendChild(course);
            cell2.appendChild(sym);
            cell3.appendChild(quarter);
            
            $("#course--table").append(row);
            this.table.push(row);
            
            if (sym.getAttribute('starred') == 'true') {
                $(sym).css({'opacity': '1'});
                $(row).css({'background': 'rgba(56, 90, 154, 1)'});
                row.className = 'table-row';
                this.initFavorite(parseInt(cell2.getAttribute('index')), row);
            } 
        }
    }
    
    toggleCourseFavorite(id_star, index_row) {
        var sym = document.getElementById(id_star);
        var row = document.getElementById(index_row);
        row.className = 'table-row';
        
        var toggle = sym.getAttribute('starred');
        if (toggle == 'true') sym.setAttribute('starred', 'false');
        else sym.setAttribute('starred', 'true');
        
        if (sym.getAttribute('starred') == 'true')  {
            $(sym).css({'opacity': '1'});
            $(row).css({'background': 'rgba(56, 90, 154, 1)'});
            
            // Favorite Row (add to favorites list sorted)
            this.favorite(index_row, row);
        }
        else {
            $(sym).css({'opacity': ""});
            $(row).css({'background': 'rgba(68, 108, 179, 1)'});
            
            // Unfavorite Row (add back to list sorted)
            this.unfavorite(index_row, row);
            
        }
        console.log(this.table);
        console.log(this.favorites);
        localStorage.setItem(sym.id, sym.getAttribute('starred'));
    }
    
    initFavorite(index_row, row ) {
        var indexTable = this.table.indexOf(row); //index in table
        this.table.splice(indexTable, 1);
        /* Begin Binary Search after favorited courses */
        var start = 0;
        var end = this.favorites.length;
        var mid = 0;
        var current = 0;
             
        /* Binary Search to find the next largest row to insert before*/
        while(start <= end) {
            mid = Math.floor((end + start)/2);
            if (mid == this.favorites.length) break;
            current = parseInt(this.table[mid].id);
            if (current < index_row) start = mid + 1;
            else end = mid - 1;
        }
        
        /* Reinsert row & Update table & favorites Representation */
       if (this.favorites.length == 0) {
            $("#course--table").prepend(row);
            this.table.splice(start, 0, row);
            this.favorites.splice(start, 0, row);
        } else {
            current = parseInt(this.table[--start].id);
            $(row).insertAfter('#' + current);
            this.table.splice(start, 0, row);
            this.favorites.splice(start, 0, row);
        }
    }
    
    favorite(index_row, row) {
        var indexTable = this.table.indexOf(row); //index in table
        this.table.splice(indexTable, 1);
        /* Begin Binary Search after favorited courses */
        var start = 0;
        var end = this.favorites.length;
        var mid = 0;
        var current = 0;
             
        /* Binary Search to find the next largest row to insert before*/
        while(start <= end) {
            mid = Math.floor((end + start)/2);
            if (mid == this.favorites.length) break;
            current = parseInt(this.table[mid].id);
            if (current < index_row) start = mid + 1;
            else end = mid - 1;
        }
        
        /* Reinsert row & Update table & favorites Representation */
        current = parseInt(this.table[start].id);
        $(row).insertBefore('#' + current);
        this.table.splice(start, 0, row);
        this.favorites.splice(start, 0, row);
    }
    
    unfavorite(index_row, row) {
        var indexFavorite = this.favorites.indexOf(row);    //index in favorites
        this.favorites.splice(indexFavorite, 1);
        this.table.splice(indexFavorite, 1);
        /* Begin Binary Search after favorited courses */
        var start = this.favorites.length;
        var end = this.table.length;
        var mid = 0;
        var current = 0;
            
        /* Binary Search to find the next largest row to insert before*/
        while(start <= end) {
            mid = Math.floor((end + start)/2);
            if (mid == this.table.length) break;
            current = parseInt(this.table[mid].id);
            ///console.log("Compare with row id #" + current);
            if (current < index_row) start = mid + 1;
            else end = mid - 1;
        }
        
        /* Reinsert row & Update table & favorites Representation */
        /* Check if toggling last row */
        if (start == this.table.length) {
            current = parseInt(this.table[--start].id);
            $(row).insertAfter('#' + current);
            this.table.push(row);
        } else {
            current = parseInt(this.table[start].id);
            $(row).insertBefore('#' + current);
            this.table.splice(start, 0, row);
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