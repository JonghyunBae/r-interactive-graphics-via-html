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
        <script src = \"axis.js\"></script>
       <script src = \"scatter.js\"></script>
       <script src = \"hist.js\"></script>
       <script src = \"box.js\"></script>
       <script src = \"pie.js\"></script>
       <script src = \"node_event.js\"></script>
      <script src = \"menu.js\"></script>
       
       "),
  HTML("<script>var mainArr1 = createMainStructure('_sub.diamonds.csv');</script>"),
  includeCSS(), includeJS("shiny-right.js"),includeJS("callback.js"),
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
        var axis1 = new MakeAxis(1, mainArr1, {x:'cut', y:'table'});
        var scatter1 = new Scatter(1, axis1, mainArr1, {x:'cut', y:'table', color: 'cut'})
       
       </script>

       <div id=\"footer\">
       <p id=\"copyright\">&copy; 2013 - <a href=\"#\">The RIGHT team</a></p>
       <p id=\"dont-delete-this\">E-mail : <a href=\"mailto:teamrightjs@gmail.com\">team.right.js@gmail.com</a></p>
       </div>
       ")
  ))
