## plot_RIGHT.R

#' X-Y Plotting
#' 
#' Function to create x-y scatter and line plots, including the axis.
#' @export

plot_RIGHT <- function(form, data, type = "b",
                       isString = FALSE) {
  
  ## ---
  ## Check input arguments:
  ## ---
  
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
  ## Create an axis:
  ## ---
  
  # Increment the number of points:
  .RIGHT$numAxis <<- .RIGHT$numAxis + 1
  
  # Add div in body:
  .RIGHT$divArray <<- append(.RIGHT$divArray, 
                             paste0('<div id="container', .RIGHT$numAxis,
                                    '" oncontextmenu="return false;"></div>'))
  
  # Add script in body:
  .RIGHT$scriptArray <<- append(.RIGHT$scriptArray,
                                paste0("var axis", .RIGHT$numAxis,
                                       " = new Axis(", .RIGHT$numAxis, 
                                       ", ", dataName,
                                       ", '", axisName$x, "', '", axisName$y, "', {});"))
  
  ## ---
  ## Plot points if necessary:
  ## ---
  
  if (type == "p" || type == "b") {
    # CHECK (junghoon): should axis name be passed?
    points_RIGHT(form, dataName, isString = TRUE)
  } # if
  
} # function plot_RIGHT
