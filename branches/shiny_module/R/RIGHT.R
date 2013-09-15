## RIGHT() that uses a special environment to evaluate the expressions:

# Environment used to collect all the necessary information to assemble the HTML file
# that derives the RIGHT JavaScript API:
#
# This creates a local environment to the package before it gets sealed. See 
#    http://stackoverflow.com/questions/12598242/global-variables-in-packages-in-r
# for more explanation.
.onLoad <- function(libname, pkgname) {
  assign(".RIGHT", new.env(), envir = parent.frame()) 
}

# Special environment used to keep aliases of functions. This is used by RIGHT() to evaluate
# the given expression:
# .RIGHT_FUN <- list2env(list(plot = plot_RIGHT,
#                             points = points_RIGHT))

# This function has side effect.
initRIGHT <- function() {
  
  # Keep the location of the library:
  libDir <- file.path(path.package("RIGHT"), "inst", "www")  
    
  # Script files always necessary:
  sourceArray <- c("kinetic-v4.6.0.js",
                   "common.js",
                   "structure.js",
                   "axis.js",
                   "color.js",
                   "callback.js",
                   "node_event.js",
                   "menu.js")
  sourceArray <- file.path(libDir, sourceArray)
  
  # Css files always necessary:
  linkArray <- c("right.css")
  linkArray <- file.path(libDir, linkArray)
  
  # CHECK (junghoon): should I use a reference class instead?
  .RIGHT <<- list2env(list(libDir = libDir,
                           nameArray = c(), # keep variable names for checking
                           sourceArray = sourceArray, # scripts to source
                           linkArray = linkArray, # links for CSS
                           divArray = c(), # div for plot layout
                           scriptArray = c(), # JavaScript code
                           numAxis = 0, # number of axis used
                           numPoints = 0, # number of points objects
                           numLines = 0)) # number of lines objects
                      
} # function initRIGHT

#' Entry Function for RIGHT
#' 
#' @export

RIGHT <- function(expr = {}, ..., 
                  title = "RIGHT: R Interactive Graphics via HTml",
                  dir = tempfile(tmpdir = getwd()), # CHECK (junghoon): not used for now
                  isOverwrite = TRUE) {
  
  if (isOverwrite == FALSE && file.exists(dir)) {
    stop(dir, " already exists.")
  } # if
  
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
  
  # Get the data objects and their names:
  dataArray <- as.character(as.list(match.call(expand.dots = F))$...)
  if (length(dataArray) == 0) {
    stop("No data is given.")
  } # if

  dataList <- mget(dataArray, envir = parent.frame(), inherits = TRUE)
  if (any(!sapply(dataList, is.data.frame))) {
    stop("All data should be given as data.frame objects.")
  } # if
  
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
  eval(substitute(expr), env = list(plot = plot_RIGHT,
                                    points = points_RIGHT))

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

#' Print RIGHT Object
#' 
#' @export

print.RIGHT <- function(obj) {
  
  fileName_index <- file.path(obj$dir, "www", "index.html")
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

#' Summarize RIGHT Object
#' 
#' @export

summary.RIGHT <- function(obj) {
  
  # CHECK: improve this?
  print.default(obj)
  
} # function summary.RIGHT

#' Cleanup RIGHT Object
#' 
#' @export

cleanup <- function(obj) {
  
  # CHECK (junghoon): is there a way to tightly integrate this with rm()?  
  # CHECK (junghoon): more sophisticated cleanup is necessary.
  unlink(obj$dir, recursive = TRUE)
  
} # function cleanup.RIGHT
