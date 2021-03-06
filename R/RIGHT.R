## RIGHT() that uses a special environment to evaluate the expressions:

# CHECK (jonghyun) : This comment is test for github workplace setting.
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
  .RIGHT$linkArray <- c("right.css", "shared/bootstrap/css/bootstrap.min.css")
  
  # Keep names of data.frame objects for checking:
  .RIGHT$nameArray <- c()
  
  # Variables used to build the html file:
  .RIGHT$divArray <- c()
  .RIGHT$scriptArray <- c()
  .RIGHT$searchArray <- c()
  .RIGHT$structArray <- c()
  .RIGHT$ncolGraph <- NULL
  .RIGHT$searchCss <- c('
body {
  padding-top: ',
  'padding-bottom: 30px;
}

.theme-dropdown .dropdown-menu {
  position: static;
  display: block;
  margin-bottom: 20px;
}

.theme-showcase > p > .btn {
  margin: 5px 0;
}

.theme-showcase .navbar .container {
  width: auto;
}')
  
  # Variables used to build the server.R file:
  .RIGHT$serverArray <- c()
  .RIGHT$exprArray <- c()
  .RIGHT$flagServer <- FALSE
  .RIGHT$numServer <- 0
  .RIGHT$parseData <- '
AlldataArr <- scan("./www/data.js", what="")
firstag <- FALSE
changeJSON <- FALSE
iData <- 1
dataObj <- c()

repeat { 
  if(iData <= length(AlldataArr)) {
    if(AlldataArr[iData] == "var" && firstag == FALSE) {
      iFirst <- iData
      firstag <- TRUE
    } else if(AlldataArr[iData] == "var" && firstag == TRUE) {
      iData <- iData - 1
      iSecond <- iData
      firstag <- FALSE
      changeJSON <- TRUE
    }
  } else if(iData > length(AlldataArr) && firstag == TRUE) {
    iSecond <- iData - 1
    firstag <- FALSE
    changeJSON <- TRUE
  }
  
  if(changeJSON == TRUE) {
    dataName <- paste0(".", AlldataArr[iFirst + 1])
    for(i in (iFirst+3):iSecond) {
      dataObj <- paste0(dataObj, paste0(" ", AlldataArr[i]))
    } 
    dataObj <- rjson::fromJSON(dataObj) 
    obj <- as.data.frame(lapply(dataObj, function (x) {
      if (is.list(x)) {
        return(factor(x$index, labels = x$level))
      } else {
        return(x)
      } 
    }))   
    names(obj) <- names(dataObj)
    assign(dataName, obj)
    dataObj <- c()
    changeJSON <- FALSE
  }
  
  if(iData > length(AlldataArr)) {
    break
  } else {  
    iData <- iData + 1
  }
}
'
  
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
#' @param ncol support improved layout to group related plots together
#' @param browser a character string giving the name of the browser. It should be in the PATH, or a full path specified. getOption("browser") by default.
#' @param supportRIGHT allow inserting Google AdSense to support further development of RIGHT. Use \code{\link{options}} and \code{\link{getOption}} to set and retrieve global option supportRIGHT.
#' 
#' @export
#' 
#' @examples
#' {
#'        RIGHT({plot(conc ~ Time, Theoph, type = "p", color = "Subject")
#'        lines(conc ~ Time, Theoph, by="Subject")
#'        hist(Wt, Theoph)
#'        boxplot(conc ~ Time, Theoph)
#'        pie(Subject, Theoph)
#'        search(Theoph)
#'        table(Theoph)})
#' }
RIGHT <- function(expr = {},
                  ...,
                  title = "RIGHT: R Interactive Graphics via HTml",
                  ncol = NULL,
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
                                      table = table_RIGHT,
                                      qplot = createQplot, 
                                      ggplot = createGgplot,
                                      print.ggplot = ggplot_RIGHT))
  
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
  
  # Update ncol variable
  if(!is.null(ncol)) {
    .RIGHT$ncolGraph <- ncol
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
  
  if(.RIGHT$flagServer) {
    
    # add files to use server-offloading
    addSource("shared/jquery.js")
    addSource("shared/shiny.js")
    addSource("shared/bootstrap/js/bootstrap.min.js")
    addSource("shared/slider/js/jquery.slider.min.js")
    addSource("shiny-right.js")
    
    addLink("shared/shiny.css")
    addLink("shared/bootstrap/css/bootstrap-responsive.min.css")
    addLink("shared/slider/css/jquery.slider.min.css")
    
    # copt files about javascript polder
    scriptTo <- file.path(dir, "www")    
    file.copy(.RIGHT$libDir_RIGHT, scriptTo, recursive = TRUE)
        
    # make server.R file
    writeLines(c(.RIGHT$parseData,
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
  ## Make css file if using searchBox
  ## ---
  
  if(.RIGHT$numSearch > 0) {
    writeLines(c(paste0(.RIGHT$searchCss[1], 180*.RIGHT$numSearch, "px;"), .RIGHT$searchCss[2]), con=file.path(dir, "www", "theme.css"))
    addLink("theme.css")
  }
  
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
#' @examples \dontrun{
#' obj <- RIGHT(plot(conc ~ Time, Theoph), Theoph)
#' print(obj)
#' }
print.RIGHT <- function(x, ...) {
  
  fileName_index <- file.path(x$dir, "www", "index.html")
  if (!file.exists(fileName_index)) {
    stop("cleanup was called on the object.")
  } # if
  
  if(!(.RIGHT$flagServer)) {
    browseURL(fileName_index, browser = x$browser)
  } else {
    shiny::runApp(x$dir)
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
#' @examples \dontrun{
#' obj <- RIGHT(plot(conc ~ Time, Theoph), Theoph)
#' summary(obj)
#' }
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
#' @examples \dontrun{
#' obj <- RIGHT(plot(conc ~ Time, Theoph), Theoph)
#' clean(obj)
#' }
clean <- function(obj) {
  
  unlink(obj$dir, recursive = TRUE)
  
} # function clean
