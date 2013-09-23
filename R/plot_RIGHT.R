## plot_RIGHT.R

#' @title X-Y Plotting
#' 
#' @description Function to create x-y scatter and line plots, including the axis.
#' 
#' @param form a formula describing the x and y variables as y ~ x.
#' @param data a data.frame object.
#' @param type the type of plot. Currently, only "n", "b", "p", "l" are supported. See \code{\link{plot}} for more details.
#' @param col color of the visual elements. 
#' 
#' @seealso \code{\link{plot}}
#' 
#' @export
#' 
#' @examples
#' \donttest{obj <- RIGHT(plot(conc ~ Time, Theoph, type = "b"), Theoph)}
#' \donttest{print(obj)}
plot_RIGHT <- function(form, data, type = "b", col = NULL) {
  
  ## ---
  ## Check input arguments:
  ## ---
  
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
  ## Create an axis:
  ## ---
  
  # Increment the number of axes:
  .RIGHT$numAxis <- .RIGHT$numAxis + 1
  
  # Add div in body:
  .RIGHT$divArray <- append(.RIGHT$divArray, 
                            paste0('<div id="container', .RIGHT$numAxis,
                                   '" oncontextmenu="return false;"></div>'))
  
  # Add script in body:
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                               paste0("var axis", .RIGHT$numAxis,
                                      " = new Axis(", .RIGHT$numAxis, 
                                      ", ", dataName,
                                      ", '", axisName$x, "', '", axisName$y, "', {});"))
  
  ## ---
  ## Plot lines if necessary:
  ## ---

  # CHECK (junghoon): refine this to support type == "c" as well.
  if (type == "l" || type == "b") {
    lines_RIGHT(form, char(dataName), col = col)
  } # if
  
  ## ---
  ## Plot points if necessary:
  ## ---
  
  if (type == "p" || type == "b") {
    points_RIGHT(form, char(dataName), col = col)
  } # if
  
  invisible()
  
} # function plot_RIGHT
