#' Add Points to a Plot
#'
#' points_RIGHT draws a sequence of points in the current axis.
#' 
#' @param form y ~ x formula
#' @param data data.frame object containing data
#' @param col color of the points
#' @param subset condition to subset data
#' 
#' @aliases points
#' 
#' @examples
#' plot_RIGHT(conc ~ Time, Thoeph, type = "n") # initialize axis
#' points_RIGHT(conc ~ Time, Theoph)
#' 
#' @export

points_RIGHT <- function(form, data, col = NULL, subset = NULL,
                         isString = FALSE) {

  ## ---
  ## Check input arguments:
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
  
  # Check whether the columns exist:
  dataArray <- get(dataName, envir = parent.frame())
  checkAxisName(as.character(form[[2]]), dataArray)
  checkAxisName(as.character(form[[3]]), dataArray)
  
  ## ---
  ## Plot points:
  ## ---
  
  # Increment the number of points:
  .RIGHT$numPoints <<- .RIGHT$numPoints + 1
  
  # Add script in body:
  .RIGHT$scriptArray <<- append(.RIGHT$scriptArray,
                                paste0("var points", .RIGHT$numPoints,
                                       " = new Dots(axis", .RIGHT$numAxis,
                                       ", ", dataName,
                                       ", '", form[[3]], "', '", form[[2]], "', {});"))
  
  # Source dot.js in head:
  addSource(file.path(.RIGHT$libDir, "dot.js"))
  
  invisible()
  
} # function point_RIGHT
