library("grid")
library("ggplot2")
library("XML")

## Functions for RIGHT:

# CHECK: is this the best way to do this?
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
  
  contentObj$children[[ID]] <<- xmlNode("div", attrs = c(id = ID.string,
                                                         style = "margin: 5px 5px 5px 5px; float: left; position : relative; border:1px solid black; background:  #eeeeee; ",
                                                         oncontextmenu="return false;"),
                                        xmlTextNode(""))
  
  # Call the function to draw:
  index <- length(scriptObj$children) 
  
  # I() prevents expansion of ':
  scriptObj$children[[index + 1]] <<- xmlTextNode(I(paste0("var scatter", ID, " = new Scatter(mainArr,",
                                                           "{x: '", x, "'", 
                                                           ", y: '", y, "'",
                                                           ifelse(is.na(color), "", paste0(", color: '", color, "'")),
                                                           ifelse(is.na(legend), "", paste0(", legend: '", legend, "'")),
                                                           ", width: ", width, 
                                                           ", height: ", height, "});")))
  scriptObj$children[[index + 2]] <<- xmlTextNode(paste0("scatter", ID, ".draw(", ID, ");"))
  scriptObj$children[[index + 3]] <<- xmlTextNode(paste0("eventTrigger(scatter", ID, ");"))
  
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

  contentObj$children[[ID]] <<- xmlNode("div", attrs = c(id = ID.string,
                                                         style = "margin: 5px 5px 5px 5px; float: left; position : relative; border:1px solid black; background:  #eeeeee; ",
                                                         oncontextmenu="return false;"),
                                        xmlTextNode(""))
  
  # Call the function to draw:
  index <- length(scriptObj$children) 
  
  # I() prevents expansion of ':
  scriptObj$children[[index + 1]] <<- xmlTextNode(I(paste0("var hist", ID, " = new Hist(mainArr,",
                                                         "{bin: ", bin, 
                                                         ", x: '", x, "'", 
                                                         ", width: ", width, 
                                                         ", height: ", height, "});")))
  scriptObj$children[[index + 2]] <<- xmlTextNode(paste0("hist", ID, ".draw(", ID, ");"))
  scriptObj$children[[index + 3]] <<- xmlTextNode(paste0("eventTrigger(hist", ID, ");"))
  
  invisible(NULL)
  
} # function hist.RIGHT
environment(hist.RIGHT) <- RIGHT.env

RIGHT <- function(..., fun = {}, 
                  header = "RIGHT: R Interactive Graphics via HTml",
                  file = tempfile(tmpdir = getwd(), fileext = ".html")) {
  
  require("XML")
  
  dataList <- as.list(match.call(expand.dots = F))$...

  # Keep the list of files to clean up:
  # CHECK: create a directory for data files?
  numData <- length(dataList)
  fileNameArray <- vector("character", numData)
  
  ## ---
  ## Write all the data to csv files:
  ## ---
  
  dataObj <- xmlNode("script")
  
  for (iData in 1:numData) {
    
    data <- dataList[[iData]]
    fileName <- paste0("_", as.character(data), ".csv")
    do.call(write.csv, list(data, file = fileName, row.names = F))
    
    index <- length(dataObj$children) + 1
    dataObj$children[[index]] <- xmlTextNode(I(paste0("createMainStructure('", fileName, "');")))
    
    fileNameArray[iData] <- fileName
    
  } # for
  
  # Set some global variables:
  index <- length(dataObj$children)
  

  ## ---
  ## Evaluate the user defined script:
  ## ---

  assign("contentObj", xmlNode("div", attrs = c(id = "content")), envir = RIGHT.env)
  assign("scriptObj", xmlNode("script"), envir = RIGHT.env)
  
  fun;
  
  ## ---
  ## Create HTML file from bottom up:
  ## ---
  
  # CHECK: optimize Javascript loading for different types of plots.
  # CHECK: is xmlTextNode("") really necessary to make this work?
  bodyObj <- xmlNode("body",
                     get("contentObj", RIGHT.env),
                     xmlNode("script", attrs = c(src = "kinetic-v4.3.1.js"), xmlTextNode("")),
                     xmlNode("script", attrs = c(src = "structure.js"), xmlTextNode("")),
                     xmlNode("script", attrs = c(src = "common.js"), xmlTextNode("")),
                     xmlNode("script", attrs = c(src = "scatter.js"), xmlTextNode("")),
                     xmlNode("script", attrs = c(src = "hist.js"), xmlTextNode("")),
                     xmlNode("script", attrs = c(src = "box.js"), xmlTextNode("")),
                     xmlNode("script", attrs = c(src = "node_event.js"), xmlTextNode("")),
                     dataObj,
                     get("scriptObj", RIGHT.env))
  
  headObj <- xmlNode("head", 
                     xmlNode("meta", attrs = c(charset = "UTF-8")),
                     xmlNode("title", xmlTextNode(header)),
                     xmlNode("link", attrs = c(rel = "stylesheet", href = "right.css")))
  
  XMLObj <- xmlNode("html", headObj, bodyObj)
  
  ## ---
  ## Construct a RIGHT object:
  ## ---
  
  RIGHTObj <- list(XML = XMLObj,
                   fileName.XML = file,
                   fileName.data = fileNameArray)
  class(RIGHTObj) <- "RIGHT"

  return(RIGHTObj)
  
} # function RIGHT

print.RIGHT <- function(obj) {

  if (is.null(obj$fileName.data)) stop("cleanup was called on the object.")
  
  saveXML(obj$XML, file = obj$fileName.XML, 
          prefix = NULL, doctype = "<!DOCTYPE HTML>")

  # CHECK: this will only work on Windows 7 for the moment.
  # CHECK: should shell be used?
  system(paste0("C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe ", obj$fileName.XML))

  shell.exec("right.html")
  
} # function print.RIGHT

summary.RIGHT <- function(obj) {

  # CHECK: improve this?
  print.default(obj)
  
} # function summary.RIGHT

cleanup <- function(obj) {
  UseMethod("cleanup", obj)
} # function cleanup

# CHECK: does not work properly yet
# CHECK: should I overload rm()?
cleanup.RIGHT <- function(obj) {

  objName <- match.call()$obj
  
  if (!is.null(obj$fileName.data)) unlink(obj$fileName.data)
  if (file.exists(obj$fileName.data)) unlink(obj$fileName.XML)
  
  # CHECK: should use assign in the parent frame?
  obj$fileName.data <- NULL
  
} # function cleanup.RIGHT
