#' @title Box-whisker
#' 
#' @description Draw a box-whisker of the given data values.
#' 
#' @param form a formula describing the x and y variables as y ~ x.
#' @param data a data.frame object.
#' @param col color of the boxes. 
#' 
#' @seealso \code{\link{boxplot}}
#' 
#' @export
#' 
#' @examples
#' \donttest{obj <- RIGHT(boxplot(conc ~ Subject, Theoph), Theoph)}
#' \donttest{print(obj)}
boxplot_RIGHT <- function(form, data, col = NULL) {
  
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
  ## Create a box-whisker:
  ## ---
  
  # Increment the number of axes and Box-whisker:
  .RIGHT$numAxis <- .RIGHT$numAxis + 1
  .RIGHT$numBox <- .RIGHT$numBox + 1
  
  # Add div in body:
  .RIGHT$divArray <- append(.RIGHT$divArray, 
                            paste0('<div id="container', .RIGHT$numAxis,
                                   '" oncontextmenu="return false;"></div>'))
  
  # Add script in body:
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                               c(paste0("var boxObj", .RIGHT$numBox,
                                        " = new MakeBoxObj(", dataName,
                                        ", '", axisName$x, "', '", axisName$y, "', {});"),
                                 paste0("var axis", .RIGHT$numAxis,
                                        " = new Axis(", .RIGHT$numAxis, 
                                        ", boxObj", .RIGHT$numBox, # box object is used to set axis
                                        ", '", axisName$x, "', '", axisName$y, "', {});"),
                                 paste0("var box", .RIGHT$numBox,
                                        " = new Box(axis", .RIGHT$numAxis,
                                        ", boxObj", .RIGHT$numBox,
                                        ", ", createObject(baseColor = col, alwaysObject = TRUE), ");")))
  
  # Source box.js in head:
  addSource(file.path(.RIGHT$libDir_RIGHT, "box.js"))
  
} # function boxplot_RIGHT
