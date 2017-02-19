var OnboardingCourses = class OnboardingCourses {
    constructor (coursesData, mainDiv) {
        this.coursesData = coursesData;
        this.mainDiv = $(mainDiv).find(".courses-module");
        this.loadCourseTableModule(this.coursesData);
        this.classes = coursesData['Classes'];
        this.tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
        this.loadCourses();
    }
    
    loadCourses() {
        for(var i = 0; i < this.classes.length; i++) {
            var row = this.tableRef.insertRow(this.tableRef.rows.length);
            var cell = row.insertCell(0);
            cell.className = 'cell';
            row.className = 'table-row';
            row.id = this.classes[i]['classname'];
            var att = document.createAttribute('data-href');
            att.value = this.classes[i]['classpage'];
            row.setAttributeNode(att);
            console.log(row);
            var myClass = document.createTextNode(this.classes[i]['classname'] + ' - ' + this.classes[i]['classqrtr']);
            cell.appendChild(myClass);
        }
    }
       
}

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