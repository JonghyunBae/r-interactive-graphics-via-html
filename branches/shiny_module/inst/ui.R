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
  includeJS("shiny-right.js"),
  includeJS("callback.js"),
  includeJS("kinetic-v4.6.0.js"),
  includeJS("structure.js"),
  includeJS("common.js"),
  includeJS("axis.js"),
  includeJS("color.js"),
  includeJS("dot.js"),
  includeJS("bar.js"),
  includeJS("box.js"),
  includeJS("pie.js"),
  includeJS("line.js"),
  includeJS("node_event.js"),
  includeJS("menu.js"),
  includeJS("button_event.js"),
  includeJS("table.js"),
  includeJS("search.js"),
  includeJS("legend.js"),
  HTML("<script> var mainArr1 = createMainStructure('_sub.diamonds.csv');</script>"),
  HTML("<script>//var mainArr2 = createMainStructure('Theoph-from-R.csv');</script>"),
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
       var axis1 = new Axis(1, mainArr1, 'carat', 'price', {});
        var s1 = new Dot(axis1, mainArr1, 'carat', 'price',{baseColor: 'blue'});
      legend('color', axis1, 'left', ['A', 'B', 'C'], ['green', 'red', 'yellow']);
    //  var s1 = new Dot(axis1, mainArr1, 'carat', 'price',{});
       
        
      var hobj1 = new ddply(mainArr1, ['color'], {});
        var axis3 = new Axis(3, hobj1, 'color', 'frequency', {legend:'cut', position: 'left'});
       var s3 = new Bar(axis3, hobj1, 'color', 'frequency',{});
      

      var hobj3 = new ddply(mainArr1, ['color', 'cut'], {});
      var axis4 = new Axis(4, hobj3, 'cut', 'frequency', {legend:'color', position: 'left'});
      var s5 = new Bar(axis4, hobj3, 'cut', 'frequency', {});

      eventTrigger([axis1, axis3, axis4]);
       </script>
       <script>makeTable('1', mainArr1, 200)</script>

       <div id=\"footer\">
       <p id=\"copyright\">&copy; 2013 - <a href=\"#\">The RIGHT team</a></p>
       <p id=\"dont-delete-this\">E-mail : <a href=\"mailto:teamrightjs@gmail.com\">team.right.js@gmail.com</a></p>
       </div>
       ")
))