#' @title Histograms
#' 
#' @description Draw a histogram of the given data values.
#' 
#' @param x variable name for which the histogram is desired.
#' @param data a data.frame object.
#' 
#' @seealso \code{\link{hist}}
#' @export
#' 
#' @examples
#' \donttest{obj <- RIGHT(hist(Subject, Theoph), Theoph)}
#' \donttest{print(obj)}
hist_RIGHT <- function(x, data) {
  
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
  ## Create a histogram:
  ## ---
  
  # Increment the number of axes and histograms:
  .RIGHT$numAxis <- .RIGHT$numAxis + 1
  .RIGHT$numHist <- .RIGHT$numHist + 1
  
  # Add div in body:
  .RIGHT$divArray <- append(.RIGHT$divArray, 
                            paste0('<div id="container', .RIGHT$numAxis,
                                   '" oncontextmenu="return false;"></div>'))
  
  # Add script in body:
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                               c(paste0("var histObj", .RIGHT$numHist,
                                        " = new ddply(", dataName, 
                                        ", ['", xName, "'], {});"),
                                 paste0("var axis", .RIGHT$numAxis,
                                        " = new Axis(", .RIGHT$numAxis, 
                                        ", histObj", .RIGHT$numHist, # hist object is used to set axis
                                        ", '", xName, 
                                        "', 'frequency', {legend: '", xName, "'});"),
                                 paste0("var hist", .RIGHT$numHist,
                                        " = new Bar(axis", .RIGHT$numAxis,
                                        ", histObj", .RIGHT$numHist,
                                        ", '", xName, "', 'frequency', {});")))
  
  # Source bar.js in head:
  addSource(file.path(.RIGHT$libDir_RIGHT, "bar.js"))
  
} # function hist_RIGHT
