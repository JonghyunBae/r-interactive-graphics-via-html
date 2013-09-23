#' @title Add Points to a Plot
#'
#' @description points_RIGHT draws a sequence of points in the current axis.
#' 
#' @param form a formula describing the x and y variables as y ~ x.
#' @param data a data.frame object.
#' @param col color of the points. 
#' 
#' @seealso \code{\link{points}}
#' 
#' @export
#' 
#' @examples
#' \donttest{obj <- RIGHT({plot(conc ~ Time, Theoph, type = "n") # create blank axis
#'               points(conc ~ Time, Theoph)}, Theoph)}
#' \donttest{print(obj)}
points_RIGHT <- function(form, data, col = NULL) {
  
  ## ---
  ## Check input arguments:
  ## ---
  
  # Make sure that there is at least one axis to draw on:
  if (.RIGHT$numAxis == 0) {
    stop("plot_RIGHT has not been called yet.")
  } # if
  
  # Make sure that data exists:
  argArray <- as.list(match.call())
  
  dataAttr <- attr(data, "char")
  if (!is.null(dataAttr) && dataAttr == TRUE) {
    dataName <- data
  } else {
    dataName <- as.character(argArray$data) 
  } # if
  checkDataName(dataName)
  
  # get is necessary in case a character string is given for data:
  dataArray <- get(dataName, envir = parent.frame())
  
  # Check whether the columns exist:
  # CHECK (junghoon): is there a way to check whether form is a formula?
  axisName <- checkFormula_xy(form)
  checkAxisName(axisName$x, dataArray)
  checkAxisName(axisName$y, dataArray)
  
  ## ---
  ## Plot points:
  ## ---
  
  # Increment the number of points:
  .RIGHT$numPoints <- .RIGHT$numPoints + 1
  
  # Add script in body:
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                               paste0("var point", .RIGHT$numPoints,
                                      " = new Dot(axis", .RIGHT$numAxis,
                                      ", ", dataName,
                                      ", '", axisName$x, "', '", axisName$y, "', ",
                                      createObject(baseColor = col, alwaysObject = TRUE) ,");"))
  
  # Source dot.js in head:
  addSource(file.path(.RIGHT$libDir_RIGHT, "dot.js"))
  
  invisible()
  
} # function point_RIGHT
