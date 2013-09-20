## RIGHT() that uses a special environment to evaluate the expressions:

# CHECK (junghoon): is there a better way?
# To avoid "no visible binding for '<<-' assignment to '.RIGHT'":
.RIGHT <- NULL

# Environment used to collect all the necessary information to assemble the HTML file
# that derives the RIGHT JavaScript API:
#
# This creates a local environment to the package before it gets sealed. See 
#    http://stackoverflow.com/questions/12598242/global-variables-in-packages-in-r
# for more explanation.
.onLoad <- function(libname, pkgname) {
  
  # CHECK (junghoon): should I use a reference class instead of .RIGHT?
  assign(".RIGHT", new.env(), envir = parent.frame()) 
  options(supportRIGHT = TRUE)
  
} # function .onLoad

# This function has side effect.
initRIGHT <- function() {
  
  # Keep the location of the library:
  libDir_RIGHT <- file.path(path.package("RIGHT"), "inst", "JavaScript")  
    
  # Script files always necessary:
  sourceArray <- c("kinetic-v4.6.0.js",
                   "common.js",
                   "structure.js",
                   "axis.js",
                   "color.js",
                   "callback.js",
                   "node_event.js",
                   "menu.js")
  sourceArray <- file.path(libDir_RIGHT, sourceArray)
  
  # Css files always necessary:
  linkArray <- c("right.css")
  linkArray <- file.path(libDir_RIGHT, linkArray)
  
  .RIGHT <<- list2env(list(libDir_RIGHT = libDir_RIGHT,
                           nameArray = c(), # keep variable names for checking
                           sourceArray = sourceArray, # scripts to source
                           linkArray = linkArray, # links for CSS
                           divArray = c(), # div for plot layout
                           scriptArray = c(), # JavaScript code
                           numAxis = 0, # number of axis used
                           numPoints = 0, # number of points objects
                           numLines = 0, # number of lines objects
                           numHist = 0,
                           numPie = 0))
                 
  invisible()
  
} # function initRIGHT

#' @title Entry Function for RIGHT
#' 
#' @param expr plotting expression to evaluate
#' @param ... data.frame objects used in \code{expr}.
#' @param title title of the visualization. The default value is "RIGHT: R Interactive Graphics via HTml."
#' @param dir directory name to store files used for the visualization. Temporary directory is created under the current working directory by default.
#' @param isOverwrite rewrite exiting files if the directory name matches. FALSE by default.
#' @param supportRIGHT allow inserting Google AdSense to support further development of RIGHT. Use \code{\link{options}} and \code{\link{getOption}} to set and retrieve global option supportRIGHT.
#' 
#' @export
#' @importFrom stringr str_trim
RIGHT <- function(expr = {}, ..., 
                  title = "RIGHT: R Interactive Graphics via HTml",
                  dir = tempfile(tmpdir = getwd()), # CHECK (junghoon): not used for now
                  isOverwrite = FALSE,
                  supportRIGHT = getOption("supportRIGHT")) {
  
  ## ---
  ## Check input arguments:
  ## ---
  
  if (isOverwrite == FALSE && file.exists(dir)) {
    stop(dir, " already exists.")
  } # if

  # Get the data objects and their names:
  dataArray <- as.character(as.list(match.call(expand.dots = FALSE))$...)
  if (length(dataArray) == 0) {
    stop("No data object is given.")
  } # if
  if (any(grepl(".", dataArray, fixed = TRUE))) {
    stop("The names of the data objects cannot contain any periods.")
  } # if
  
  #   dataList <- mget(dataArray, envir = parent.frame(), inherits = TRUE)
  dataList <- setNames(list(...), dataArray)
  if (any(!sapply(dataList, is.data.frame))) {
    stop("All data objects should be given as data.frame objects.")
  } # if
  
  ## ---
  ## Setup directory:
  ## ---
  
  # Initialize the environment that keeps track of the information:
  initRIGHT()

  # Convert to absolute path:
  # CHECK (junghoon): is this the best way?
  dir <- stringr::str_trim(dir)
  if (!stringr::str_detect(dir, "^[/\\\\]")) {
    dir <- file.path(getwd(), dir)
  } # if
  
  # Create a directory structure for all the necessary files for RIGHT:
  if (!file.exists(dir)) {
    dir.create(dir)
  } # if
  tempDir <- file.path(dir, "www")
  if (!file.exists(tempDir)) {
    dir.create(tempDir)
  } # if
  
  ## ---
  ## Process data.frame objects:
  ## ---
  
  fileNameArray <- prepareData(dataList, dir) 

  loadData(dataArray)
  addBlankLine()

  # Keep the name of the data.frame objects for checking:
  .RIGHT$nameArray <<- dataArray 

  ## ---
  ## Evaluate the given expression:
  ## ---

  # Special environment is created to overload base graphics plotting function when evaluating
  # the given expression:
  eval(substitute(expr), envir = list(plot = plot_RIGHT,
                                    points = points_RIGHT,
                                    lines = lines_RIGHT,
                                    hist = hist_RIGHT,
                                    pie = pie_RIGHT))

  # Add event handler:
  addBlankLine()
  addEventTrigger(.RIGHT$numAxis)
  
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
summary.RIGHT <- function(object, ...) {
  
  # CHECK: improve this?
  print.default(object)
  
} # function summary.RIGHT

#' Cleanup RIGHT Object
#' 
#' @param obj RIGHT object.
#' 
#' @export
cleanup <- function(obj) {
  
  # CHECK (junghoon): is there a way to tightly integrate this with rm()?  
  # CHECK (junghoon): more sophisticated cleanup is necessary.
  unlink(obj$dir, recursive = TRUE)
  
} # function cleanup.RIGHT
