
# Add blank script lines. This function has side effects:
appendBlankLine <- function(numLine = 1) {
  
  .RIGHT$scriptArray <- c(.RIGHT$scriptArray, rep("", numLine))
  
} # function appendBlankLine

prependBlankLine <- function(numLine = 1) {
  
  .RIGHT$scriptArray <- c(rep("", numLine), .RIGHT$scriptArray)
  
} # function prependBlankLine

# Save data.frame objects:
prepareData <- function(dataList, dir = ".") {
  
  # Array to save all data (data array, discrete data level)
  dataScript <- ""
  
  # CHECK (junghoon): what happens if no names are given?
  nameArray <- names(dataList)
  
  # lapply will not work since it does not preserve the names of the list entries
  numData <- length(nameArray)  

  # Save data array using json form
  for (iData in 1:numData) {
    
    tempData <- as.list(dataList[[nameArray[iData]]])
    dataArr <- lapply(tempData, function(x) if (is.factor(x)) list(level = levels(x), index = as.numeric(x) - 1) else x)
    
    mainArr <- toJSON(dataArr)
    
    dataScript <- c(paste0("var rawArr", iData, "= ", mainArr, ";"), dataScript)
  } # for
  
  # Write dataScript to "data.js" file
  writeLines(as.character(dataScript), con=file.path(dir, "data.js"))
  addSource('../data.js')
  
} # function prepareDataE

# Add JavsScript expressions to load data. This function has side effects:
loadData <- function(nameArray = NULL) {
  
  numData <- length(nameArray)
  if (!is.null(nameArray)) {
    
    # Data objects should be loaded before any plotting:
    for(iData in 1:numData)
      .RIGHT$scriptArray <- c(paste0("var ",nameArray[iData], ' = createMainStructureE(rawArr',iData, ');'), 
                            .RIGHT$scriptArray) 
  } # if
  
  invisible()
  
} # function loadDataE

# This function has side effects:
addDrawTrigger <- function(nameArray = NULL) {
  
  if(is.null(nameArray)) {
    return(NULL)
  } # if
  
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                               paste0(nameArray, ".draw();"))
}

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
  
  tempArray <- '<div id="content">\n'
  divIndex <- 1
  divId <- c()
  
  if(.RIGHT$numServer > 0) {
    
    for(iData in .RIGHT$numAxis) {
      
      divId <- c(divId, paste("content", iData, sep=""))
      
      for(i in 1:length(.RIGHT$offIndex) ) {
        
        if(iData == .RIGHT$offIndex[i]) {
          
          divId[iData] <- .RIGHT$offNameArr[divIndex]
          divIndex <- divIndex+1
          break
          
        } # if
        
      } # for
      
    } # for
  
  } else {
    
    for(iData in .RIGHT$numAxis) {
      
      divId <- c(divId, paste("content", iData, sep="")) 
    } # for
    
  } # if
  
  # match 1 content to 1 container
  for(temp in divArray) {
    
    tempArray <- paste(tempArray, '<div id="', divId, '" class = "right-output">\n',
						           temp, "</div>\n", sep = "")					
  } # for
  
  return(c(tempArray, "</div>"))
  
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
           .RIGHT$serverScript,
           paste0("  ", createFooter()), "",
           "</body>"))
  
} # function createBody
