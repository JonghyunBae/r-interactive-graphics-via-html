## RIGHT() that uses a special environment to evaluate the expressions:

# CHECK (junghoon): should I use a reference class instead of .RIGHT?
.RIGHT <- new.env(parent = emptyenv())

# Environment used to collect all the necessary information to assemble the HTML file
# that derives the RIGHT JavaScript API:
#
# This creates a local environment to the package before it gets sealed. See 
#    http://stackoverflow.com/questions/12598242/global-variables-in-packages-in-r
# for more explanation.
.onLoad <- function(libname, pkgname) {
  
  # CHECK (junghoon): is it necessary to do this here?
  #   .RIGHT <- new.env(parent = emptyenv())
  options(supportRIGHT = TRUE)
  
} # function .onLoad

# This function has side effect.
initRIGHT <- function() {
  
  # Keep the location of the library:
  .RIGHT$libDir_RIGHT <- system.file("JavaScript", package = "RIGHT")
  
  # Script files always necessary:
  .RIGHT$sourceArray <- c("kinetic-v5.0.1.js",
                          "common.js",
                          "structure.js",
                          "axis.js",
                          "color.js",
                          "callback.js",
                          "node_event.js",
                          "menu.js",
                          "array.js")
  
  # Css files always necessary:
  .RIGHT$linkArray <- c("right.css")
  
  # Keep names of data.frame objects for checking:
  .RIGHT$nameArray <- c()
  
  # Variables used to build the html file:
  .RIGHT$divArray <- c()
  .RIGHT$scriptArray <- c()
  
  # Variables used to build the server.R file:
  .RIGHT$serverArray <- c()
  .RIGHT$exprArray <- c()
  .RIGHT$numServer <- FALSE
  
  # Variables used to build the html file using server-offloading:
  .RIGHT$serverScript <- "<script>\n"
  .RIGHT$offDataArr <- c()
  .RIGHT$offNameArr <- c()
  .RIGHT$offIndex <- c()
  .RIGHT$curDataObj <- c()
  
  # Variables used to track different plots:
  .RIGHT$numAxis <- 0
  .RIGHT$numPoints <- 0
  .RIGHT$numLines <- 0
  .RIGHT$numBox <- 0
  .RIGHT$numHist <- 0
  .RIGHT$numPie <- 0
  .RIGHT$numSearch <- 0
  .RIGHT$numTable <- 0
  
  invisible()
  
} # function initRIGHT

#' @title Entry Function for RIGHT
#' 
#' @param expr plotting expression to evaluate
#' @param ... data.frame objects used in \code{expr}. If they are used in one of the plotting functions, it is not necessary to list them.
#' @param title title of the visualization. The default value is "RIGHT: R Interactive Graphics via HTml."
#' @param dir directory name to store files used for the visualization. Temporary directory is created under the current working directory by default.
#' @param overwrite rewrite exiting files if the directory name matches. FALSE by default.
#' @param browser a character string giving the name of the browser. It should be in the PATH, or a full path specified. getOption("browser") by default.
#' @param supportRIGHT allow inserting Google AdSense to support further development of RIGHT. Use \code{\link{options}} and \code{\link{getOption}} to set and retrieve global option supportRIGHT.
#' 
#' @export
#' 
#' @examples
#' library(ggplot2)
#' 
#' set.seed(123456)
#' 
#' subArray <- diamonds[sample(1:nrow(diamonds), 1000, TRUE), ]
#' fitObj <- loess(price ~ carat, subArray)
#' xRange <- range(subArray$carat)
#' fitArray <- data.frame(carat = seq(xRange[1], xRange[2], length.out = 100))
#' fitArray$price <- predict(fitObj, newdata = fitArray)
#' 
#' \donttest{
#' obj <- RIGHT({plot(price ~ carat, subArray, type = "p", color = "color")
#'               lines(price ~ carat, fitArray)
#'               hist(color, subArray, color = "cut")
#'               boxplot(price ~ color, subArray)
#'               pie(cut, subArray)
#'               search(subArray)
#'               table(subArray)})
#' print(obj)
#' }
RIGHT <- function(expr = {},
                  ...,
                  title = "RIGHT: R Interactive Graphics via HTml",
                  dir = tempfile(), 
                  overwrite = FALSE,
                  browser = getOption("browser"),
                  supportRIGHT = getOption("supportRIGHT")) {
  
  ## ---
  ## Check input arguments:
  ## ---
  
  if (overwrite == FALSE && file.exists(dir)) {
    stop(dir, " already exists.")
  } # if
  
  ## ---
  ## Evaluate the given expression:
  ## ---
  
  # Initialize the environment that keeps track of the information:
  initRIGHT()
  
  # Special environment is created to overload base graphics plotting function when evaluating
  # the given expression:
  
  eval(substitute(expr), envir = list(plot = plot_RIGHT,
                                      points = points_RIGHT,
                                      lines = lines_RIGHT,
                                      hist = hist_RIGHT,
                                      boxplot = boxplot_RIGHT,
                                      pie = pie_RIGHT,
                                      search = search_RIGHT,
                                      table = table_RIGHT))
  
  ## ---
  ## Process data.frame objects:
  ## ---
  
  # Use only the unique names:
  nameArray <- unique(c(as.character(as.list(match.call(expand.dots = FALSE))$...),
                        .RIGHT$nameArray))
  
  # There should be at least one data object to plot:
  if (length(nameArray) == 0) {
    stop("No data object is given.")
  } # if
  
  # Check validitiy of the names:
  if (any(grepl(".", nameArray, fixed = TRUE))) {
    stop("The names of the data objects cannot contain any periods.")
  } # if
  
  # Check existance of the data objects and whether they are data.frame objects:
  isExist <- exists(nameArray, envir = parent.frame())
  if (any(!isExist)) {
    stop("The following data objects do not exist: ", paste0(nameArray[!isExist], collapse = ", "))
  } # if
  dataList <- setNames(mget(nameArray, envir = parent.frame(), inherits = TRUE), nameArray)
  if (any(!sapply(dataList, is.data.frame))) {
    stop("All data objects should be given as data.frame objects.")
  } # if
  
  # Add scripts to load data objects:
  prependBlankLine()
  loadData(nameArray)
  
  # Add event handler:
  appendBlankLine()
  addDrawTrigger(nameArray)
  addEventTrigger(.RIGHT$numAxis)
  ## ---
  ## Setup directory:
  ##
  ## Start creating files once most of the error checking is done.
  ## ---
  
  # Convert to absolute path:
  dir <- normalizePath(dir, mustWork = FALSE)
  
  # Create a directory structure for all the necessary files for RIGHT:
  if (!file.exists(dir)) {
    dir.create(dir)
  } # if
  tempDir <- file.path(dir, "www")
  if (!file.exists(tempDir)) {
    dir.create(tempDir)
  } # if
  
  # Save data objects to file:
  prepareData(dataList, dir)
  
  ## ---
  ## Assemble server.R code if user uses server-offloading
  ## ---
  
  if(.RIGHT$numServer) {
    
    # add files to use server-offloading
    addSource("shared/jquery.js")
    addSource("shared/shiny.js")
    addSource("shared/bootstrap/js/bootstrap.min.js")
    addSource("shared/slider/js/jquery.slider.min.js")
    addSource("shiny-right.js")
    
    addLink("shared/shiny.css")
    addLink("shared/bootstrap/css/bootstrap-responsive.min.css")
    addLink("shared/bootstrap/css/bootstrap.min.css")
    addLink("shared/slider/css/jquery.slider.min.css")
    
    # copt files about javascript polder
    scriptTo <- file.path(dir, "www")    
    file.copy(.RIGHT$libDir_RIGHT, scriptTo, recursive = TRUE)
    tempArray <- c()
    
    # make JSON file to open in server.R
    
    for(name in unique(.RIGHT$offDataArr)) {
      
      writeLines(toJSON(eval(parse(text = name))), 
                 con = file.path(dir, paste0(name,".JSON")))
      
      tempArray <- paste0(tempArray, 
                         ".", name, '<- data.frame(fromJSON("', name, '.JSON"))\n')
    } # for
    
    # make server.R file
    writeLines(c(tempArray,
                 "shinyServer(function(input, output) {",
                 .RIGHT$serverArray,
                 "})" ),
               con = file.path(dir, "server.R"))
    
    # generate html code about server-offloading
    .RIGHT$serverScript <- paste0(.RIGHT$serverScript,
                                  "$(function() {\n",
                                  "setTimeout(function() {\n")
    
    tempArray <- c()
    for(name in .RIGHT$offDataArr) {
      tempArray <- append(tempArray,
                          paste0("window.Shiny.onInputChange('", name, "', ", name,
                                 ".$isHidden);\n"))
    } # for

    for(name in unique(tempArray)) {
      .RIGHT$serverScript <- paste0(.RIGHT$serverScript, name)  
    } # for
    
    .RIGHT$serverScript <- paste0(.RIGHT$serverScript, "}, 1)\n});\n")  
    
  } # if
  
  .RIGHT$serverScript <- paste0(.RIGHT$serverScript, "</script>\n")
    
  ## ---
  ## Assemble client-side code:
  ## ---
  
  writeLines(c("<!DOCTYPE html>",
               "<html>",
               createHead(title),
               createBody(),
               "</html>"),
             con = file.path(dir, "www", "index.html"))  
  
  ## ---
  ## Assemble the RIGHT object:
  ## ---
  
  return(structure(list(dir = dir,
                        browser = browser),
                   class = "RIGHT"))
  
} # function RIGHT

#' @title Print RIGHT Object
#' 
#' @param x RIGHT object.
#' @param ... additional arguments affecting the summary produced.
#' 
#' @method print RIGHT
#' @export
#' 
#' @examples
#' \donttest{obj <- RIGHT(plot(conc ~ Time, Theoph), Theoph)}
#' \donttest{print(obj)}
print.RIGHT <- function(x, ...) {
  
  fileName_index <- file.path(x$dir, "www", "index.html")
  if (!file.exists(fileName_index)) {
    stop("cleanup was called on the object.")
  } # if
  
  if(!(.RIGHT$numServer)) {
    browseURL(fileName_index, browser = x$browser)
  } else {
    runApp(x$dir)
  } # if
  
} # function print.RIGHT

#' @title Summarize RIGHT Object
#' 
#' @param object RIGHT object.
#' @param ... additional arguments affecting the summary produced.
#' 
#' @method summary RIGHT
#' @export
#' 
#' @examples
#' \donttest{obj <- RIGHT(plot(conc ~ Time, Theoph), Theoph)}
#' \donttest{summary(obj)}
summary.RIGHT <- function(object, ...) {
  
  # CHECK: improve this?
  print.default(object)
  
} # function summary.RIGHT

#' Cleanup RIGHT Object
#' 
#' @param obj RIGHT object.
#' 
#' @export
#' 
#' @examples
#' \donttest{obj <- RIGHT(plot(conc ~ Time, Theoph), Theoph)}
#' \donttest{clean(obj)}
clean <- function(obj) {
  
  # CHECK (junghoon): is there a way to tightly integrate this with rm()?  
  # CHECK (junghoon): more sophisticated cleanup is necessary.
  unlink(obj$dir, recursive = TRUE)
  
} # function clean

runServer <- function(offName, expr = {}) {
  
  .RIGHT$numServer <- TRUE
  
  # Copy user's code and base code about server-offloading
  .RIGHT$exprArray <- c(.RIGHT$exprArray, expr)
  .RIGHT$offNameArr <- c(.RIGHT$offNameArr, offName)
   
  return(structure(eval(parse(text = expr)), class = "RIGHTServer"))
  
} # function runServer.RIGHT
