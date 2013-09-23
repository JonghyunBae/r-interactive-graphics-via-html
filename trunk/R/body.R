
# Add blank script lines. This function has side effects:
addBlankLine <- function(numLine = 1) {
  
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray, rep("", numLine))
  
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
    
    .RIGHT$scriptArray <- append(.RIGHT$scriptArray, 
                                 paste0(nameArray, ' = createMainStructure("', file.path("..", fileNameArray), '");')) 
    
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
