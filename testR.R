library("shiny")
library("grid")
library("ggplot2")
library("XML")
## Functions for RIGHT:

# Directory Setting
mainDir <- getwd()
dir.create(file.path(mainDir, "right-shiny"), showWarnings = FALSE, mode = "0777")
shinyDir <- paste(mainDir, "right-shiny", sep ="/")
dataDir <- paste(shinyDir, "www", sep ="/")


# Make server.R -> stable now(not changing)
setwd(shinyDir)
file.create("server.R",path = shinyDir)
fileConn <- file("server.R")
data <- "library(shiny)
shinyServer(function(input, output) {
  output$scatterContainer1 <- reactive(function() {
    xAxis <-input$xAxis
    yAxis <-input$yAxis
    color <-input$color
    legend <-input$legend
    width <-input$width
    height <-input$height
    bin <-input$bin
    hide <- input$TestEntry1    
    graphName <- input$graphName    
    whichOption <- input$whichOption
    changeOption <- input$changeOption
    output<-list(xAxis, yAxis, color, legend, width, height, bin, hide, graphName, whichOption, changeOption);
    return(output)
  })
})"
write(data, fileConn)
close(fileConn)
setwd(mainDir)
# End making server.R

# Make ui.R -> changing by users functions.
RIGHT.env <- new.env()

plot.RIGHT <- function(dataArray, x, y, 
                       color = NA, legend = NA, width = 250, height = 250) {
  
  callList <- match.call()
  
  # CHECK: check for existance of column names
  x <- as.character(callList$x)
  y <- as.character(callList$y)
  color <- as.character(callList$color) # CHECK: check for NA?
  legend <- as.character(callList$legend) # CHECK: check for NA?
  
  # Assign a content ID:
  ID <- length(contentObj$children) + 1
  ID.string <- paste0("scatterContainer", ID)
  
  # CHECK: is xmlTextNode("") really necessary to make this work?  
  
  contentObj$children[[ID]] <<- paste0("createDiv(\"", ID.string , "\"),")
  
  # Call the function to draw:
  index <- length(scriptObj$children) 
  
  # I() prevents expansion of ':
  scriptObj$children[[index + 1]] <<- paste0("var scatter", ID, " = new Scatter(", ID, ", mainArr,",
                                                           "{x: '", x, "'", 
                                                           ", y: '", y, "'",
                                                           ifelse(is.na(color), "", paste0(", color: '", color, "'")),
                                                           ifelse(is.na(legend), "", paste0(", legend: '", legend, "'")),
                                                           ", width: ", width, 
                                                           ", height: ", height, "});")
  scriptObj$children[[index + 2]] <<- paste0("scatter", ID, ".draw(", ID, ");")
  scriptObj$children[[index + 3]] <<- paste0("eventTrigger(scatter", ID, ");")
  
  invisible(NULL)
  
} # function plot.RIGHT

environment(plot.RIGHT) <- RIGHT.env

hist.RIGHT <- function(dataARray, x,
                       bin = 0.5, width = 250, height = 250) {  
  # CHECK: check for existance of column names
  x = as.character(match.call()$x)  
  # Assign a content ID:
  ID <- length(contentObj$children) + 1
  ID.string <- paste0("histContainer", ID)  
  # CHECK: is xmlTextNode("") really necessary to make this work?  
  contentObj$children[[ID]] <<- paste0("createDiv(\"", ID.string , "\"),")
  
  # Call the function to draw:
  index <- length(scriptObj$children)   
  # I() prevents expansion of ':
  scriptObj$children[[index + 1]] <<-paste0("var hist", ID, " = new Hist(", ID, ", mainArr,",
                                                           "{bin: ", bin, 
                                                           ", x: '", x, "'", 
                                                           ", width: ", width, 
                                                           ", height: ", height, "});")
  scriptObj$children[[index + 2]] <<- paste0("hist", ID, ".draw(", ID, ");")
  scriptObj$children[[index + 3]] <<- paste0("eventTrigger(hist", ID, ");")
  invisible(NULL)  
} # function hist.RIGHT
environment(hist.RIGHT) <- RIGHT.env


box.RIGHT <- function(dataArray, x, y, 
                       width = 250, height = 250) {
  
  callList <- match.call()
  
  # CHECK: check for existance of column names
  x <- as.character(callList$x)
  y <- as.character(callList$y)
  color <- as.character(callList$color) # CHECK: check for NA?
  legend <- as.character(callList$legend) # CHECK: check for NA?
  
  # Assign a content ID:
  ID <- length(contentObj$children) + 1
  ID.string <- paste0("boxContainer", ID)
  
  # CHECK: is xmlTextNode("") really necessary to make this work?  
  
  contentObj$children[[ID]] <<- paste0("createDiv(\"", ID.string , "\"),")
  
  # Call the function to draw:
  index <- length(scriptObj$children) 
  
  # I() prevents expansion of ':
  scriptObj$children[[index + 1]] <<- paste0("var box", ID, " = new Box(", ID, ", mainArr,",
                                             "{x: '", x, "'", 
                                             ", y: '", y, "'",
                                             ", width: ", width, 
                                             ", height: ", height, "});")
  scriptObj$children[[index + 2]] <<- paste0("box", ID, ".draw(", ID, ");")
  scriptObj$children[[index + 3]] <<- paste0("eventTrigger(box", ID, ");")
  
  invisible(NULL)
  
} # function plot.RIGHT

environment(box.RIGHT) <- RIGHT.env





# CHECK (junghoon): think about what to do with is.overwrite
RIGHT <- function(..., fun = {}, 
                  header = "RIGHT: R Interactive Graphics via HTml",
                  dir = tempfile(tmpdir = getwd()), # CHECK (junghoon): not used for now
                  lib.dir = getwd(), # CHECK (junghoon): this should be updated
                  is.overwrite = T) {
  
  require("XML")
  
  lib <- "library(shiny)
  includeJS <- function(fileName) {
    tagList(
      singleton(tags$head(tags$script(src = fileName)))    
    )
  }
  includeCSS <- function() {
    tagList(
      singleton(tags$head(HTML(\"<link rel=\\\"stylesheet\\\" href=\\\"right.css\\\"/>
                             <title>RIGHT: R Interactive Graphics via HTml</title>\"
                             ))) 
    )
}
createDiv <- function(inputId) {
  tagList(
    tags$div(id = inputId,
                class = \"right-output\",
             oncontextmenu=\"return false;\")
  )
}
"
  
  libArray <- c("HTML(\"", "<script src = \\\"kinetic-v4.5.4.js\\\"></script>",
                "<script src = \\\"structure.js\\\"></script>",
                "<script src = \\\"common.js\\\"></script>",
                "<script src = \\\"scatter.js\\\"></script>",
                "<script src = \\\"hist.js\\\"></script>",
                "<script src = \\\"box.js\\\"></script>",
                "<script src = \\\"node_event.js\\\"></script>", "\"),") 
  
  dataList <- as.list(match.call(expand.dots = F))$...
  numData <- length(dataList)
  fileNameArray <- vector("character", numData)  
  for (iData in 1:numData) {
    data <- dataList[[iData]]
    fileName <- paste0("_", as.character(data), ".csv")
    fileName.full <- fileName
    setwd(dataDir)
    do.call(write.csv, list(data, file = fileName.full, row.names = F))
    setwd(mainDir)
  }  

  fileName <- paste0("HTML(\"","<script>createMainStructure('", fileName, "');</script>", "\"),") 
  
  mid <- "includeCSS(), includeJS(\"shiny-right.js\"),"
  
  midtemp <- paste0("\ HTML(\"","<div id=\\\"head\\\"> 
                    <div class=\\\"wrap\\\">
                    <script src=\\\"search.js\\\"></script>
                    <form id=\\\"searchForm1\\\">
                    <input type=\\\"text\\\" id=\\\"searchBox\\\" name=\\\"searchId\\\" placeholder=\\\"Please input boolean statement...\\\" onkeydown=\\\"if (event.which || event.keyCode){if ((event.which == 13) || (event.keyCode == 13)) {booleanSearch(searchForm1);  printAns(); return false;}};\\\"/>
                    <a id=\\\"searchBtn\\\" href=\\\"#\\\" class=\\\"myButton\\\" onClick=\\\"booleanSearch(searchForm1); printAns(); return false;\\\">Search</a>
                  <a id=\\\"clearBtn\\\" href=\\\"#\\\" class=\\\"myButton\\\" onClick=\\\"clearSearchBox(); return false;\\\">Clear</a>
                    <a id=\\\"showTable\\\" href=\\\"#\\\" class=\\\"myButton\\\" onClick=\\\"return false;\\\">Show Table</a>
                    <a id=\\\"hideTable\\\" href=\\\"#\\\" class=\\\"myButton\\\" onClick=\\\"return false;\\\">Hide Table</a>
                    </form>
                    </div>
                    </div>
                    <div id=\\\"content\\\">",              
                    "\"),")     
  mid <- c(mid, midtemp)
  
  assign("contentObj", c(), envir = RIGHT.env)
  assign("scriptObj", c(), envir = RIGHT.env)
  fun;
  
  body <- get("contentObj", RIGHT.env)
  body <- unlist(body)
  mid <- c(mid, body)
  
  body <- get("scriptObj", RIGHT.env)
  body <- unlist(body)
  body <- c("<script>", body, "</script>")
  midtemp <- paste0("<script src=\\\"button_event.js\\\"></script>
                    <script src=\\\"table.js\\\"></script>
                    <div id=\\\"footer\\\">
                   <p id=\\\"copyright\\\">&copy; 2013 - <a href=\\\"#\\\">The RIGHT Team</a></p>
                   <p id=\\\"dont-delete-this\\\">E-mail : <a href=\\\"mailto:teamrightjs@gmail.com\\\">team.right.js@gmail.com</a></p>")
  body <- c("</div>", body, midtemp, "</div>")  
  
  mid <- c(mid,"HTML(\"", body, "\")")
  
 
  panel <- c("textOutput(\"TestEntry\"),",libArray, fileName, mid)
  panel <- c("shinyUI(bootstrapPage(", panel, "))")
  
  totaldata <- c(lib, panel)
  
  RIGHTObj <- list(data = totaldata,
                   dir = dir)
  class(RIGHTObj) <- "RIGHT"
  
  return(RIGHTObj)
  
} # function RIGHT

print.RIGHT <- function(obj) {
  #file.create("ui.R",path = obj$dir)
  fileConn <- file("right-shiny/ui.R")
  write(obj$data, fileConn)  
  close(fileConn)
  runApp("right-shiny")
} # function print.RIGHT

