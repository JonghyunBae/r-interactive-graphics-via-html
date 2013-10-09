#' @title Add Lines to a Plot
#'
#' @description lines_RIGHT draws a sequence of points in the current axis.
#' 
#' @param form a formula describing the x and y variables as y ~ x.
#' @param data a data.frame object.
#' @param isString a character is expected for \code{data} if \code{TRUE}. It is useful for programming.
#'
#' @seealso \code{\link{lines}} 
#' 
#' @export
#' 
#' @examples
#' \donttest{
#' obj <- RIGHT({plot(conc ~ Time, Theoph, type = "n") # create blank axis
#'               lines(conc ~ Time, Theoph)})
#' print(obj)
#' }
lines_RIGHT <- function(form, data, isString = FALSE) {
  
  col <- NULL # TEMPORARY
  
  ## ---
  ## Take strings if asked:
  ## ---
  
  # Make sure that data exists:
  argArray <- as.list(match.call())
  
  if (!isString) {
    
    data <- if (is.null(argArray$data)) NULL else as.character(argArray$data)
    
  } # if
  
  ## ---
  ## Check input arguments:
  ##
  ## CHECK (junghoon): this part is common to both points_RIGHT and lines_RIGHT.
  ## ---
  
  # Make sure that there is at least one axis to draw on:
  if (.RIGHT$numAxis == 0) {
    stop("plot_RIGHT has not been called yet.")
  } # if
  
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

  # Check col option:
  checkCol(col)
  col <- getRGB(col)
  
  ## ---
  ## Plot points:
  ## ---

  # Keep name of the data object:
  .RIGHT$nameArray <- append(.RIGHT$nameArray, data)

  # Increment the number of points:
  .RIGHT$numLines <- .RIGHT$numLines + 1
  
  # Add script in body:
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                               c(paste0("var lineObj", .RIGHT$numLines,
                                        " = new MakeLineObj(", data, 
                                        ", '", axisName$x, "', '", axisName$y, "');"),
                                 paste0("var line", .RIGHT$numLines,
                                        " = new Line(axis", .RIGHT$numAxis,
                                        ", lineObj", .RIGHT$numLines,
                                        ", 'x1', 'x2', 'y1', 'y2', ",
                                        createObject(baseColor = col, alwaysObject = TRUE), ");")))
  
  # Source dot.js in head:
  addSource(file.path(.RIGHT$libDir_RIGHT, "line.js"))
  
  invisible()
  
} # function lines_RIGHT
