## RIGHT() that uses a special environment to evaluate the expressions:

# Environment used to collect all the necessary information to assemble the HTML file
# that derives the RIGHT JavaScript API:
.RIGHT <- NA

# Special environment used to keep aliases of functions. This is used by RIGHT() to evaluate
# the given expression:
.RIGHT_FUN <- list2env(list(plot = plot_RIGHT,
                            points = points_RIGHT,
                            lines = lines_RIGHT))

# This function has side effect.
initRIGHT <- function() {
  
  # CHECK (junghoon): this has to change
  # Keep the location of the library:
  libDir <- "d:/Shared/RIGHT/branches/shiny_module/inst/www"  
    
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
  
  .RIGHT <<- list2env(list(libDir = libDir,
                           nameArray = c(), # keep variable names for checking
                           sourceArray = sourceArray, # scripts to source
                           linkArray = linkArray, # links for CSS
                           divArray = c(), # div for plot layout
                           scriptArray = c(), # JavaScript code
                           numBox = 0, # number of containers
                           numAxis = 0) # number of axis used
                      
} # function initRIGHT

RIGHT <- function(expr = {}, ..., 
                  header = "RIGHT: R Interactive Graphics via HTml",
                  dir = tempfile(tmpdir = getwd()), # CHECK (junghoon): not used for now
                  isOverwrite = T) {
  
  # Initialize the environment that keeps track of the information:
  initRIGHT()

  # Create a directory structure for all the necessary files for RIGHT:
  if (!file.exists(dir)) {
    dir.create(dir)
  } # if
  tempDir <- file.path(dir, "www")
  if (!file.exists(tempDir)) {
    dir.create(tempDir)
  } # if
  
  # Get the data objects and their names:
  # CHECK (junghoon): there may be a better way than this
  # CHECK (junghoon): what happens if no objects are given?
  dataArray <- as.character(as.list(match.call(expand.dots = F))$...)
  prepareData(mget(dataArray, envir = parent.frame()), dir) # mget returns a list that perserves the names
  
  loadData(dataArray)
  addBlankLine()
  
} # function RIGHT

