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
  textOutput("TestEntry"),
  HTML("
       <script src = \"kinetic-v4.5.4.js\"></script>
       <script src = \"structure.js\"></script>
       <script src = \"common.js\"></script>
       <script src = \"scatter.js\"></script>
       <script src = \"hist.js\"></script>
       <script src = \"box.js\"></script>
       <script src = \"node_event.js\"></script>
       <script src = \"callback.js\"></script>
       "),
  HTML("<script>createMainStructure('_sub.diamonds.csv');</script>"),
  includeCSS(), includeJS("shiny-right.js"),
  HTML("<div id=\"head\"> 
       <div class=\"wrap\">
       <script src=\"search.js\"></script>
       <form id=\"searchForm1\">
       <input type=\"text\" id=\"searchBox\" name=\"searchId\" placeholder=\"Please input boolean statement...\" onkeydown=\"if (event.which || event.keyCode){if ((event.which == 13) || (event.keyCode == 13)) {booleanSearch(searchForm1);  printAns(); return false;}};\"/>
       <a id=\"searchBtn\" href=\"#\" class=\"myButton\" onClick=\"booleanSearch(searchForm1); printAns(); return false;\">Search</a>
       <a id=\"clearBtn\" href=\"#\" class=\"myButton\" onClick=\"clearSearchBox(); return false;\">Clear</a>
       <a id=\"showTable\" href=\"#\" class=\"myButton\" onClick=\"return false;\">Show Table</a>
       <a id=\"hideTable\" href=\"#\" class=\"myButton\" onClick=\"return false;\">Hide Table</a>
       </form>
       </div>
       </div>
       
       <div id=\"content\" class = \"right-output\" >"),
  createDiv("scatterContainer1"),
  createDiv("histContainer2"),
  createDiv("boxContainer3"),
  HTML("
       </div>
       <script>
       var scatter1 = new Scatter(1, mainArr,{x: 'carat', y: 'price', color: 'color', legend: 'right', width: 300, height: 300});
       scatter1.draw(1);
       eventTrigger(scatter1);
       var hist2 = new Hist(2, mainArr,{bin: 2, x: 'cut', width: 300, height: 300});
       hist2.draw(2);
       eventTrigger(hist2);
       var box3 = new Box(3, mainArr,{x: 'carat', y: 'price', width: 300, height: 300});
       box3.draw(3);
       eventTrigger(box3);
       </script>
       <script src=\"button_event.js\"></script>
       <script src=\"table.js\"></script>
       <div id=\"footer\">
       <p id=\"copyright\">&copy; 2013 - <a href=\"#\">The RIGHT team</a></p>
       <p id=\"dont-delete-this\">E-mail : <a href=\"mailto:teamrightjs@gmail.com\">team.right.js@gmail.com</a></p>
       </div>
       ")
  ))
