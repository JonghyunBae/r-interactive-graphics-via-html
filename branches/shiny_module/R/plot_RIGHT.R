## plot_RIGHT.R

plot_RIGHT <- function(form, data, type = "n",
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
  
  # Check whether the columns exist:
  dataArray <- get(dataName, envir = parent.frame())
  checkAxisName(as.character(form[[2]]), dataArray)
  checkAxisName(as.character(form[[3]]), dataArray)
  
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
                                       ", '", form[[3]], "', '", form[[2]], "', {});"))
  
  ## ---
  ## Plot points if necessary:
  ## ---
  
  if (type == "p" || type == "b") {
    points_RIGHT(form, dataName, isString = TRUE)
  } # if
  
} # function plot_RIGHT