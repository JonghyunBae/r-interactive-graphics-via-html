## RIGHT() that uses a special environment to evaluate the expressions:

# CHECK (junghoon): should I use a reference class instead of .RIGHT?
.RIGHT <- new.env(parent = emptyenv())
# options(supportRIGHT = TRUE)

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
  sourceArray <- c("kinetic-v4.7.0.js",
                   "common.js",
                   "structure.js",
                   "axis.js",
                   "color.js",
                   "callback.js",
                   "node_event.js",
                   "menu.js")
  .RIGHT$sourceArray <- file.path(.RIGHT$libDir_RIGHT, sourceArray)
  
  # Css files always necessary:
  linkArray <- c("right.css")
  .RIGHT$linkArray <- file.path(.RIGHT$libDir_RIGHT, linkArray)
  
  # Keep names of data.frame objects for checking:
  .RIGHT$nameArray <- c()
  
  # Variables used to build the html file:
  .RIGHT$divArray <- c()
  .RIGHT$scriptArray <- c()
  
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
#' @param isOverwrite rewrite exiting files if the directory name matches. FALSE by default.
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
                  isOverwrite = FALSE,
                  supportRIGHT = getOption("supportRIGHT")) {
  
  ## ---
  ## Check input arguments:
  ## ---
  
  if (isOverwrite == FALSE && file.exists(dir)) {
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
  
  # Add event handler:
  appendBlankLine()
  addEventTrigger(.RIGHT$numAxis)
  
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
  fileNameArray <- prepareData(dataList, dir) 
  
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
                        fileNameArray = fileNameArray),
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
  
  # CHECK (junghoon): is there a better way?
  if (Sys.info()["sysname"] == "Windows") {
    shell.exec(fileName_index)
  } else {
    system(paste0("firefox -new-tab ", fileName_index, " &"))
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
