

# Add blank script lines. This function has side effects:
addBlankLine <- function(numLine = 1) {
  
  .RIGHT$scriptArray <<- append(.RIGHT$scriptArray, rep("", numLine))
  
} # function addBlankLine

# Save data.frame objects in temporary files:
prepareData <- function(dataList, dir = ".") {
  
  # CHECK (junghoon): what happens if no names are given?
  nameArray <- names(dataList)
  
  # lapply will not work since it does not preserve the names of the list entries
  numData <- length(nameArray)
  
  fileNameArray <- vector("character", numData)
  for (iData in 1:numData) {

    fileNameArray[iData] <- paste0("_", nameArray[iData], ".csv")
    write.csv(dataList[[iData]], file = file.path(dir, fileNameArray[iData]), row.names = F)
    
  } # for
  
  return(fileNameArray)
  
} # function prepareData

# Add JavsScript expressions to load data. This function has side effects:
loadData <- function(nameArray = NULL, fileNameArray = paste0("_", nameArray, ".csv")) {

  if (!is.null(nameArray)) {
    
    if (length(nameArray) != length(fileNameArray)) {
      stop("nameArray and fileNameArray should have the same length.")
    } # if
    
    .RIGHT$scriptArray <<- append(.RIGHT$scriptArray, 
                                  paste0(nameArray, ' = createMainStructure("', file.path("..", fileNameArray), '");')) 
    
  } # if
  
  invisible()
  
} # function loadData
