library(shiny)
includeJS <- function(fileName) {
  tagList(
    singleton(tags$head(tags$script(src = fileName)))    
  )
}
includeCSS <- function() {
  tagList(
    singleton(tags$head(HTML("<link rel=\"stylesheet\" href=\"right.css\"/>
                             <title>RIGHT: R Interactive Graphics via HTml</title>"
    ))) 
    )
}
createDiv <- function(inputId) {
  tagList(
    tags$div(id = inputId,
             # class = "right-output",
             oncontextmenu="return false;")
  )
}

shinyUI(bootstrapPage(
  includeCSS(), 
  includeJS("../../inst/www/shiny-right.js"),
  includeJS("../../inst/www/callback.js"),
  includeJS("../../inst/www/kinetic-v4.6.0.js"),
  includeJS("../../inst/www/structure.js"),
  includeJS("../../inst/www/common.js"),
  includeJS("../../inst/www/axis.js"),
  includeJS("../../inst/www/color.js"),
  includeJS("../../../inst/www/dot.js"),
  includeJS("../../../inst/www/bar.js"),
  includeJS("../../../inst/www/box.js"),
  includeJS("../../../inst/www/pie.js"),
  includeJS("../../../inst/www/line.js"),
  includeJS("../../../inst/www/node_event.js"),
  includeJS("../../../inst/www/menu.js"),
  includeJS("../../../inst/www/button_event.js"),
  includeJS("../../../inst/www/table.js"),
  includeJS("../../../inst/www/search.js"),
  includeJS("../../../inst/www/legend.js"),
  HTML("<script> var mainArr1 = createMainStructure('../../../inst/www/Theoph-from-R.csv');</script>"),
  HTML("<div id=\"head\"> 
       <div class=\"wrap\">
       <form id=\"searchForm1\">
      <script>makeSearchButton(mainArr1);</script>
       <input type=\"text\" id=\"searchBox\" name=\"searchId\" placeholder=\"Please input boolean statement...\" onkeydown=\"if (event.which || event.keyCode){if ((event.which == 13) || (event.keyCode == 13)) {booleanSearch(searchForm1);  printAns(); return false;}};\"/>
       <a id=\"searchBtn\" href=\"#\" class=\"myButton\" onClick=\"booleanSearch(searchForm1); printAns(); return false;\">Search</a>
       <a id=\"clearBtn\" href=\"#\" class=\"myButton\" onClick=\"clearSearchBox(); return false;\">Clear</a>
       <a id=\"showTable\" href=\"#\" class=\"myButton\" onClick=\"return false;\">Hide Table</a>
       <a id=\"saveImg\" href=\"#\" class=\"myButton\" onClick=\"return false;\">Save Image</a>
       </form>
       </div>
       </div>
        <script>
         	addButtonEvent();      	
       	</script>
       <div id=\"content1\" class = \"right-output1\" >
       <div id=\"content\" class = \"right-output\" >"),
  createDiv("container1"),
  createDiv("container2"),
  createDiv("container3"),
  createDiv("container4"),
  createDiv("container5"),
  createDiv("container6"),
  HTML("
       </div>
       </div>
       
        <script>

       var lobj1 = new MakeLineObj(mainArr1, 'Time', 'conc');
       var axis1 = new Axis(1, lobj1, 'Time', 'conc', {});
       var l1 = new Line(axis1, lobj1, 'x1', 'x2', 'y1', 'y2', {});
       
       

       var axis2 = new Axis(2, mainArr1, 'Time', 'conc', {});
       var d1 = new Dot(axis2, mainArr1, 'Time', 'conc', {});
       
       var histObj1 = new ddply(mainArr1, ['conc'], {});
       var axis3 = new Axis(3, histObj1, 'conc', 'frequency', {legend: 'conc'});
       var hist1 = new Bar(axis3, histObj1, 'conc', 'frequency', {});
     

       eventTrigger([axis1, axis2, axis3]);
       var axisSaving1 = new axisSaving([axis1, axis2, axis3]);
       </script>
        <script>
        
        var runOffload = {};
        (function() {
          runOffload = function () {
        	};
        	runOffload.prototype = {
        		_run: function(xArr, yArr) {
        			axis2._drawRegression(xArr, yArr);	
        		},
        		_run2: function(dataObj){
        			var tt = new MakeLineObj(dataObj, 'x', 'y');
        			var tt2 = new Line(axis1, tt, 'x1', 'x2', 'y1', 'y2', {});
        		}        		
        	};
        })();
        offload = new runOffload();
        $(function() {
            setTimeout(function() {
            window.Shiny.onInputChange('first', 1);
            }, 1)
          });
        </script>
       <div id=\"footer\">
       <p id=\"copyright\">&copy; 2013 - <a href=\"#\">The RIGHT team</a></p>
       <p id=\"dont-delete-this\">E-mail : <a href=\"mailto:teamrightjs@gmail.com\">team.right.js@gmail.com</a></p>
       </div>
       ")
))