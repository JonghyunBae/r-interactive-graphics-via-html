#' @title Add Lines to a Plot
#'
#' @description lines_RIGHT draws a sequence of points in the current axis.
#' 
#' @param form a formula describing the x and y variables as y ~ x.
#' @param data a data.frame object.
#' 
#' @export
#' 
#' @examples
#' obj <- RIGHT({plot(conc ~ Time, Theoph, type = "n") # create blank axis
#'               lines(conc ~ Time, Theoph)}, Theoph)
#' \donttest{print(obj)}
#' \dontshow{cleanup(obj)}

lines_RIGHT <- function(form, data) {
  
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
  .RIGHT$numLines <- .RIGHT$numLines + 1
  
  # Add script in body:
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                               c(paste0("var lineObj", .RIGHT$numLines,
                                        " = new MakeLineObj(", dataName, 
                                        ", '", axisName$x, "', '", axisName$y, "');"),
                                 paste0("var line", .RIGHT$numLines,
                                        " = new Line(axis", .RIGHT$numAxis,
                                        ", lineObj", .RIGHT$numLines,
                                        ", 'x1', 'x2', 'y1', 'y2', {});")))
  
  # Source dot.js in head:
  addSource(file.path(.RIGHT$libDir_RIGHT, "line.js"))
  
  invisible()
  
} # function lines_RIGHT
