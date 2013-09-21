#' @title Pie Charts
#' 
#' @description Draw a pie chart.
#'
#' @param x variable name for which the histogram is desired.
#' @param data a data.frame object.
#'
#' @export
#' 
#' @examples
#' obj <- RIGHT(pie(Subject, Theoph), Theoph)
#' \donttest{print(obj)}
#' \dontshow{cleanup(obj)}
pie_RIGHT <- function(x, data) {
  
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
  # CHECK (junghoon): is there a way to deal with strings? Why is this different from, say, plot_RIGHT()?
  xName <- as.character(argArray$x)
  checkAxisName(xName, dataArray)
  
  ## ---
  ## Create a pie chart:
  ## ---
  
  # Increment the number of axes and pie charts:
  .RIGHT$numAxis <- .RIGHT$numAxis + 1
  .RIGHT$numPie <- .RIGHT$numPie + 1
  
  # Add div in body:
  .RIGHT$divArray <- append(.RIGHT$divArray, 
                            paste0('<div id="container', .RIGHT$numAxis,
                                   '" oncontextmenu="return false;"></div>'))
  
  # Add script in body:
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                               c(paste0("var pieObj", .RIGHT$numPie,
                                        " = new ddply(", dataName, 
                                        ", ['", xName, "'], {});"),
                                 paste0("var axis", .RIGHT$numAxis,
                                        " = new Axis(", .RIGHT$numAxis, 
                                        ", pieObj", .RIGHT$numPie, # pie object is used to set axis
                                        ", '", xName, "', '", 'frequency', 
                                        "', {legend: '", xName, "'});"),
                                 paste0("var pie", .RIGHT$numPie,
                                        " = new Pie(axis", .RIGHT$numAxis,
                                        ", pieObj", .RIGHT$numPie,
                                        ", '", xName, "', 'frequency', {});")))
  
  # Source pie.js in head:
  addSource(file.path(.RIGHT$libDir_RIGHT, "pie.js"))
  
} # function pie_RIGHT
