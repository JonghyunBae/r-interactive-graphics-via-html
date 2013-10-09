## plot_RIGHT.R

#' @title X-Y Plotting
#' 
#' @description Function to create x-y scatter and line plots, including the axis.
#' 
#' @param form a formula describing the x and y variables as y ~ x.
#' @param data a data.frame object.
#' @param type the type of plot. Currently, only "n", "b", "p", "l" are supported. See \code{\link{plot}} for more details.
#' @param color column used to define the colors used to fill the bars. Default is NULL.
#' @param isString a character is expected for \code{data} and \code{color} if \code{TRUE}. It is useful for programming.
#' 
#' @seealso \code{\link{plot}}
#' 
#' @export
#' 
#' @examples
#' \donttest{
#' obj <- RIGHT(plot(conc ~ Time, Theoph, type = "b", color = Subject))
#' print(obj)
#' }
plot_RIGHT <- function(form, data, type = "b", color = NULL,
                       isString = FALSE) {

  # @param col color used for all the visual elements. color option overrides \code{col} option.
  col <- NULL # TEMPORARY
  
  ## ---
  ## Take strings if asked:
  ## ---
  
  argArray <- as.list(match.call())
  
  if (!isString) {
    
    data <- if (is.null(argArray$data)) NULL else as.character(argArray$data)
    color <- if (is.null(argArray$color)) NULL else as.character(argArray$color)
    
  } # if
  
  ## ---
  ## Check input arguments:
  ## ---
  
  # get is necessary in case a character string is given for data:
  if (!exists(data, envir = parent.frame())) {
    stop(data, " does not exist.")
  } # if
  dataArray <- get(data, envir = parent.frame(), inherits = TRUE)
  
  # Check whether the columns exist:
  # CHECK (junghoon): is there a way to check whether form is a formula?
  axisName <- checkFormula_xy(form) 
  checkColumnName(axisName$x, dataArray)
  checkColumnName(axisName$y, dataArray)
  
  # Check color option:
  checkColumnName(color, dataArray)
  
  # col option is checked by points_RIGHT() or line_RIGHT().
  
  ## ---
  ## Create an axis:
  ## ---
  
  # Keep name of the data object:
  .RIGHT$nameArray <- append(.RIGHT$nameArray, data)

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
                                      ", ", data,
                                      ", '", axisName$x, "', '", axisName$y, 
                                      "', ", createObject(legend = color, alwaysObject = TRUE), ");"))
  
  ## ---
  ## Plot lines if necessary:
  ## ---

  # CHECK (junghoon): refine this to support type == "c" as well.
  if (type == "l" || type == "b") {
#     lines_RIGHT(form, data, col = col, isString = TRUE)
    lines_RIGHT(form, data, isString = TRUE)
  } # if
  
  ## ---
  ## Plot points if necessary:
  ## ---
  
  if (type == "p" || type == "b") {
#     points_RIGHT(form, data, col = col, isString = TRUE)
    points_RIGHT(form, data, isString = TRUE)
  } # if
  
  invisible()
  
} # function plot_RIGHT
