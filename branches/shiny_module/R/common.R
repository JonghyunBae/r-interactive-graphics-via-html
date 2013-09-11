

checkDataName <- function(dataName) {
  
  if (!is.element(dataName, .RIGHT$nameArray)) {
    stop(dataName, " does not exist.")
  } # if
  
  invisible()
  
} # function checkDataName

checkAxisName <- function(axisName, dataArray) {
  
  if (!is.element(axisName, names(dataArray))) {
    stop(axisName, " column does not exist.")
  } # if
  
  invisible()
  
} # function checkAxisName