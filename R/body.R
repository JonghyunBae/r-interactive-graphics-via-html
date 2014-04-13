
# Add blank script lines. This function has side effects:
appendBlankLine <- function(numLine = 1) {
  
  .RIGHT$scriptArray <- c(.RIGHT$scriptArray, rep("", numLine))
  
} # function appendBlankLine

prependBlankLine <- function(numLine = 1) {
  
  .RIGHT$scriptArray <- c(rep("", numLine), .RIGHT$scriptArray)
  
} # function prependBlankLine

# Find discrete data and return
levelParsing <- function(dataList) {
  mainFrame <- data.frame(dataList)
  count <- 1
  
  saveLev <- ""
  mainLev <- "{ 'Pos' : ["
  
  # Fine discrete column
  for (i in 1:ncol(mainFrame)) {
    
    tmpCol <- levels(mainFrame[[i]])
    tmpLen <- length(tmpCol)
    
    if (length(tmpCol) != 0) {
     
      saveLev[count] <- paste(i-1)
      count <- (count + 1)
    
    } # if
  
  } # for
  
  # Save column that can use in javascript object
  for (i in 1:(count-1) ) {
    
    mainLev <- paste(mainLev, "\"", saveLev[i], "\"", sep = "")
    if (i < (count-1) )
      mainLev <- paste(mainLev, ", ", sep = "")
    else
      mainLev <- paste(mainLev, "], 'Levels' : [", sep = "") 

  } # for
  
  # Save levels that can use in javascript object
  for (i in 1:(count-1) ) {
    
    mainLev <- paste(mainLev, "[", sep = "")
    tmpCol <- as.character(levels(mainFrame[[as.numeric(saveLev[i])+1]]))
    tmpLen <- length(tmpCol)
    
    for (j in 1:tmpLen) {
      mainLev <- paste(mainLev, "\"", tmpCol[j], "\"", sep = "")
      if(j < tmpLen)
        mainLev <- paste(mainLev, ", ", sep = "")
      else {
        
        if(i < count-1)
          mainLev <- paste(mainLev, "], ", sep = "")
        else 
          mainLev <- paste(mainLev, "]", sep = "")
        
      } # if
      
    } # for
    
  } # for
  
  mainLev <- paste(mainLev, "]}", sep = "")
  return (mainLev)
  
} # function leveParsing

# Save data.frame objects in html code:
prepareDataE <- function(dataList) {
  
  # CHECK (junghoon): what happens if no names are given?
  nameArray <- names(dataList)
  
  # lapply will not work since it does not preserve the names of the list entries
  numData <- length(nameArray)  

  # Save data array using json form
  for (iData in 1:numData) {
    
    dataframe <- data.frame(dataList[[nameArray[iData]]])
    mainLev <- levelParsing(dataList[[nameArray[iData]]])
    
    for (j in 1:ncol(dataframe)) {
      
      check <- levels(dataframe[, j])
      
      if (length(check) > 0){
        dataList[[nameArray[iData]]][j] <- as.numeric(dataframe[, j]) - 1
      }
    } # for
  
    mainArr <- toJSON(dataList[[nameArray[iData]]])
    .RIGHT$scriptArray <- c(paste0("rawArr", iData, "= ", mainArr, ";"), .RIGHT$scriptArray)
    .RIGHT$scriptArray <- c(paste0("rawLev", iData, "= ", mainLev, ";"), .RIGHT$scriptArray)
  } # for
  
} # function prepareDataE

# Save data.frame objects in temporary files:
prepareData <- function(dataList, dir = ".") {
  
  # CHECK (junghoon): what happens if no names are given?
  nameArray <- names(dataList)
  
  # lapply will not work since it does not preserve the names of the list entries
  numData <- length(nameArray)
  fileNameArray <- vector("character", numData)
  
  for (iData in 1:numData) {
    
    dataframe <- data.frame(dataList[[nameArray[iData]]])
    mainLev <- levelParsing(dataList[[nameArray[iData]]])
  
    for (j in 1:ncol(dataframe)) {
      
      check <- levels(dataframe[, j]) 
      if (length(check) > 0) {
        dataList[[nameArray[iData]]][j] <- as.numeric(dataframe[ , j]) - 1
      }
    } # for
    
    fileNameArray[iData] <- paste0("_", nameArray[iData], ".csv")
    write.csv(dataList[[iData]], file = file.path(dir, fileNameArray[iData]), row.names = F)
    .RIGHT$scriptArray <- c(paste0("rawLev", iData, "= ", mainLev, ";"), .RIGHT$scriptArray)
  
  } # for
  
  return(fileNameArray)
  
} # function prepareData

# Add JavsScript expressions to load data using embed option. This function has side effects:
loadDataE <- function(nameArray = NULL) {
  
  numData <- length(nameArray)
  if (!is.null(nameArray)) {
    
    # Data objects should be loaded before any plotting:
    for(iData in 1:numData)
      .RIGHT$scriptArray <- c(paste0(nameArray[iData], ' = createMainStructureE(rawArr',iData, ', rawLev',iData,');'), 
                            .RIGHT$scriptArray) 
  } # if
  
  invisible()
  
} # function loadDataE

# Add JavsScript expressions to load data not using embed option. This function has side effects:
loadData <- function(nameArray = NULL, fileNameArray = paste0("_", nameArray, ".csv")) {
  
  numData <- length(nameArray)
  if (!is.null(nameArray)) {
    
    if (length(nameArray) != length(fileNameArray)) {
      stop("nameArray and fileNameArray should have the same length.")
    } # if
    
    # Data objects should be loaded before any plotting:
    for(iData in 1:numData)
      .RIGHT$scriptArray <- c(paste0(nameArray[iData], ' = createMainStructure("', file.path("..", fileNameArray[iData]), '", rawLev', iData, ");"), 
                            .RIGHT$scriptArray) 
    
  } # if
  
  invisible()
  
} # function loadData

# This function has side effects:
addEventTrigger <- function(numAxis = NULL) {
  
  if (is.null(numAxis) || numAxis == 0) {
    return(NULL)
  } # if
  
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray, 
                               paste0("var AllAxisObjArr = [", 
                                      paste0(paste0("axis", 1:numAxis), collapse = ", "),
                                      "]; eventTrigger(AllAxisObjArr);"))
  
} # function addEventTrigger

# CHECK (junghoon): can these functions organized differently?
# Create div block:
createDiv <- function(divArray = NULL) {
  
  if (is.null(divArray)) {
    return(NULL)
  } # if 
  
  return(c('<div id="content" class="right-output">',
           paste0("  ", divArray),
           "</div>"))
  
} # function createDiv

# Create script block:
createScript <- function(scriptArray = NULL) {
  
  if (is.null(scriptArray)) {
    return(NULL)
  } # if 
  
  return(c("<script>",
           paste0("  ", scriptArray),
           "</script>"))
  
} # function createScript

# Create footer block for copyright statement:
createFooter <- function() {
  
  return(c('<div id="footer">',
           '<p id="copyright">&copy; 2013 - <a href="#">The RIGHT team</a></p>',
           '<p id="dont-delete-this">E-mail : <a href="mailto:right-user@googlegroups.com">right-user@googlegroups.com</a></p>',
           "</div>"))
  
} # function createFooter

# Assemble the body:
createBody <- function() {
  
  # Links and sourced scripts:
  divArray <- createDiv(.RIGHT$divArray)
  if (!is.null(divArray)) {
    divArray <- paste0("  ", divArray)
  } # if
  
  scriptArray <- createScript(.RIGHT$scriptArray)
  if (!is.null(scriptArray)) {
    scriptArray <- paste0("  ", scriptArray)
  } # if
  
  return(c("<body>", "",
           divArray, if (!is.null(divArray)) "" else NULL, 
           scriptArray, if (!is.null(scriptArray)) "" else NULL,
           paste0("  ", createFooter()), "",
           "</body>"))
  
} # function createBody
