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

# CHECK (junghoon): think about what to do with is.overwrite
RIGHT <- function(..., fun = {}, 
                  header = "RIGHT: R Interactive Graphics via HTml",
                  dir = tempfile(tmpdir = getwd()), # CHECK (junghoon): not used for now
                  lib.dir = getwd(), # CHECK (junghoon): this should be updated
                  is.overwrite = T) {
  
  require("XML")
  
  dataList <- as.list(match.call(expand.dots = F))$...

  # If dir does not contain path information, use the current location:
#   tempArray <- unlist(strsplit(dir, ""))
#   if (all(tempArray != "/") && all(tempArray != "\\")) dir <- file.path(getwd(), dir)

  # CHECK (junghoon): this is temporary
  dir <- getwd()
  
  # Create a directory for all the files:
  if (!file.exists(dir)) dir.create(dir)
  
    
  # Keep track of the file names of the data:
  numData <- length(dataList)
  fileNameArray <- vector("character", numData)
  
  ## ---
  ## Write all the data to csv files:
  ## ---
  
  dataObj <- xmlNode("script")
  
  for (iData in 1:numData) {
    
    data <- dataList[[iData]]
    fileName <- paste0("_", as.character(data), ".csv")
#     fileName.full <- file.path(dir, fileName)
    fileName.full <- fileName
    do.call(write.csv, list(data, file = fileName.full, row.names = F))
    
    index <- length(dataObj$children) + 1
    dataObj$children[[index]] <- xmlTextNode(I(paste0("createMainStructure('", fileName.full, "');")))
    
    fileNameArray[iData] <- fileName
    
  } # for
  
  # Set some global variables:
#   index <- length(dataObj$children)
#   
#   dataObj$children[[index + 1]] <- xmlTextNode("var plotWidth=500;")
#   dataObj$children[[index + 2]] <- xmlTextNode("var plotHeight=500;")
  
  ## ---
  ## Evaluate the user defined script:
  ## ---

  assign("contentObj", xmlNode("div", attrs = c(id = "content")), envir = RIGHT.env)
  assign("scriptObj", xmlNode("script"), envir = RIGHT.env)
  
  fun;
  
  ## ---
  ## Create HTML file from bottom up:
  ## ---
  
  # Create search:
  searchObj <- xmlNode("form", attrs = c(id = "searchForm1"),
                       xmlNode("input", attrs = c(type = "text",
                                                  id = "searchBox",
                                                  name = "searchId",
                                                  placeholder = "Please input boolean statement...",
                                                  onkeydown = "if (event.which || event.keyCode){if ((event.which == 13) || (event.keyCode == 13)) {booleanSearch(searchForm1);  printAns(); return false;}};"),
                               xmlTextNode("")),
                       xmlNode("a", attrs = c(id = "searchBtn",
                                              href = "#",
                                              class = "myButton",
                                              onClick = "booleanSearch(searchForm1); printAns(); return false;"),
                               xmlTextNode("Search")),
                       xmlNode("a", attrs = c(id = "clearBtn",
                                              href = "#",
                                              class = "myButton",
                                              onClick = "clearSearchBox(); return false;"),
                               xmlTextNode("Clear")),
                       xmlNode("a", attrs = c(id = "showTable",
                                              href = "#",
                                              class = "myButton",
                                              onClick = "return false;"),
                               xmlTextNode("Show Table")),
                       xmlNode("a", attrs = c(id = "hideTable",
                                              href = "#",
                                              class = "myButton",
                                              onClick = "return false;"),
                               xmlTextNode("Hide Table")))
  
  searchObj <- xmlNode("div", attrs = c(id = "head"),
                       xmlNode("div", attrs = c(class = "wrap"), 
                               xmlNode("script", attrs = c(src = "search.js"), xmlTextNode("")),
                               searchObj))
  
  # Create footer:
  footerObj <- xmlNode("div", attrs = c(id = "footer"),
                       xmlNode("div", attrs = c(class = "wrap2"),
                               xmlNode("p", xmlTextNode(I('Created by <a herf="#">RIGHT</a>'))),
                               xmlNode("p", xmlTextNode(I('Copyright &copy; 2013 <a herf="#">RIGHT team</a>')))))
  
  # Load libraries:
  libArray <- c("kinetic-v4.3.1.js",
                "structure.js",
                "common.js",
                "scatter.js",
                "hist.js",
                "box.js",
                "node_event.js")
  bodyObj <- xmlNode("body")

  # CHECK: optimize Javascript loading for different types of plots.
  # CHECK: is xmlTextNode("") really necessary to make this work?
  for (iLib in 1:length(libArray)) {
#     bodyObj$children[[iLib]] <- xmlNode("script", attrs= c(src = file.path(lib.dir, libArray[iLib])), xmlTextNode(""))
    bodyObj$children[[iLib]] <- xmlNode("script", attrs= c(src = libArray[iLib]), xmlTextNode(""))
  } # for
  
  index <- length(bodyObj$children)
  bodyObj$children[[index + 1]] <- dataObj
  bodyObj$children[[index + 2]] <- searchObj
  bodyObj$children[[index + 3]] <- get("contentObj", RIGHT.env)
  bodyObj$children[[index + 4]] <- get("scriptObj", RIGHT.env)
  bodyObj$children[[index + 5]] <- xmlNode("script", attrs = c(src = "button_event.js"), xmlTextNode(""))
  bodyObj$children[[index + 6]] <- xmlNode("script", attrs = c(src = "table.js"), xmlTextNode(""))
  bodyObj$children[[index + 7]] <- footerObj
  
  headObj <- xmlNode("head", 
                     xmlNode("meta", attrs = c(charset = "UTF-8")),
                     xmlNode("title", xmlTextNode(header)),
#                      xmlNode("link", attrs = c(rel = "stylesheet", href = file.path(lib.dir, "right.css"))))
                     xmlNode("link", attrs = c(rel = "stylesheet", href = "right.css")))
  
  XMLObj <- xmlNode("html", headObj, bodyObj)
  
  ## ---
  ## Construct a RIGHT object:
  ## ---
  
  RIGHTObj <- list(XML = XMLObj,
                   dir = dir,
                   file.data = fileNameArray)
  class(RIGHTObj) <- "RIGHT"

  return(RIGHTObj)
  
} # function RIGHT

print.RIGHT <- function(obj) {

  if (!file.exists(obj$dir) ||
        !all(file.exists(file.path(obj$dir, obj$file.data)))) {
    stop("Cleanup was called on the object.")
  } # if

  fileName.full <- file.path(obj$dir, "index.html")
  saveXML(obj$XML, file = fileName.full, 
          prefix = NULL, doctype = "<!DOCTYPE HTML>")

  # CHECK (junghoon): is there a better way?
  if (Sys.info()["sysname"] == "Windows") {
    shell.exec(fileName.full)
  } else {
    system(paste0("firefox -new-tab ", fileName.full, " &"))
  } # if
  
} # function print.RIGHT

summary.RIGHT <- function(obj) {

  # CHECK: improve this?
  print.default(obj)
  
} # function summary.RIGHT

cleanup <- function(obj) {
  UseMethod("cleanup", obj)
} # function cleanup

# CHECK (junghoon): is there a way to tightly integrate this with rm()?
cleanup.RIGHT <- function(obj) {

  # CHECK (junghoon): index.html is not deleted temporarily
#   for (name in c("index.html", obj$file.data)) {
  for (name in obj$file.data) {
      
    fileName <- file.path(obj$dir, name)
    if (file.exists(fileName)) unlink(fileName)
    
  } # for
  
  if (length(dir(path = obj$dir)) == 0) unlink(obj$dir, recursive = T)
  
} # function cleanup.RIGHT

