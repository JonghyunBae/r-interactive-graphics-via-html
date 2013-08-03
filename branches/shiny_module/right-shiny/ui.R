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
  includeJS("kinetic-v4.5.4.js"),
  includeJS("structure.js"),
  includeJS("common.js"),
  includeJS("axis.js"),
  includeJS("scatter.js"),
  includeJS("hist.js"),
  includeJS("box.js"),
  includeJS("pie.js"),
  includeJS("node_event.js"),
  includeJS("menu.js"),
  HTML("<script>var mainArr1 = createMainStructure('_sub.diamonds.csv');</script>"), 
  HTML("<div id=\"head\"> 
       <div class=\"wrap\">
       
       </div>
       </div>
       <div id=\"content1\" class = \"right-output1\" >
       <div id=\"content\" class = \"right-output\" >"),
  createDiv("container1"),
  createDiv("container2"),
  createDiv("container3"),
  createDiv("container4"),
  HTML("
       </div>
       </div>
       <script>
        var histArr= new MakeHistObj(mainArr1, 'cut', {bin:0.5, color:'cut'});
        var axis1 = new MakeAxis(1, histArr.xArr, histArr.yArr, histArr.isDiscrete, 'false', {xLabel : histArr.xLabel , yLabel : histArr.yLabel, xbin: histArr.bin});
        var hist1 = new Hist(axis1, histArr);

        var axis2 = new MakeAxis(2, mainArr1['carat'], mainArr1['color'], mainArr1.isDiscrete['carat'], mainArr1.isDiscrete['color'], {xLabel : 'carat', yLabel : 'color'})
        var scatter1 = new Scatter(mainArr1, axis2, 'carat', 'color', {color: 'cut'});
       
        //var axis1 = new MakeAxis(1, mainArr1, {x:'cut', y:'table'});
        //var scatter1 = new Scatter(axis1, mainArr1, {x:'cut', y:'table', color: 'cut'});
        //eventTrigger(scatter1, mainArr1);
        //var axis2 = new MakeAxis(2, mainArr1, {x:'cut', y:'depth'});
        //var hist1 = new Hist(axis2, mainArr1, {x:'cut', color: 'cut'});
        //eventTrigger(hist1, mainArr1);
       
       </script>

       <div id=\"footer\">
       <p id=\"copyright\">&copy; 2013 - <a href=\"#\">The RIGHT team</a></p>
       <p id=\"dont-delete-this\">E-mail : <a href=\"mailto:teamrightjs@gmail.com\">team.right.js@gmail.com</a></p>
       </div>
       ")
  ))
