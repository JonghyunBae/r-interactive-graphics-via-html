#' Add Lines to a Plot
#'
#' lines_RIGHT draws a sequence of points in the current axis.
#' 
#' @param form y ~ x formula
#' @param data data.frame object containing data
#' @param col color of the points
#' @param subset condition to subset data
#' 
#' @aliases lines
#' 
#' @export

lines_RIGHT <- function(form, data, col = NULL, subset = NULL,
                        isString = FALSE) {

  ## ---
  ## Check input arguments:
  ##
  ## CHECK (junghoon): this part is common to both points_RIGHT and lines_RIGHT.
  ## ---
  
  # Make sure that there is at least one axis to draw on:
  if (.RIGHT$numAxis == 0) {
    stop("plot_RIGHT has not been called yet.")
  } # if
  
  # Make sure that data exists:
  argArray <- as.list(match.call())
  
  if (isString == TRUE) {
    dataName <- data
  } else {
    dataName <- as.character(argArray$data) 
  } # if
  checkDataName(dataName)

  dataArray <- get(dataName, envir = parent.frame())
  
  # Check whether the columns exist:
  axisName <- checkFormula_xy(form)
  checkAxisName(axisName$x, dataArray)
  checkAxisName(axisName$y, dataArray)
  
  ## ---
  ## Plot points:
  ## ---
  
  # Increment the number of points:
  .RIGHT$numLines <<- .RIGHT$numLines + 1
  
  # Add script in body:
  .RIGHT$scriptArray <<- append(.RIGHT$scriptArray,
                                paste0("var lines", .RIGHT$numLines,
                                       " = new Line(axis", .RIGHT$numAxis,
                                       ", ", dataName,
                                       ", '", axisName$x, "', '", axisName$y, "', {});"))
  
  # Source dot.js in head:
  addSource(file.path(.RIGHT$libDir, "line.js"))
  
  invisible()
  
} # function lines_RIGHT
