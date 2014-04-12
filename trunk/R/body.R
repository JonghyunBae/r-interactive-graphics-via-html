
# Add blank script lines. This function has side effects:
appendBlankLine <- function(numLine = 1) {
  
  .RIGHT$scriptArray <- c(.RIGHT$scriptArray, rep("", numLine))
  
} # function appendBlankLine

prependBlankLine <- function(numLine = 1) {
  
  .RIGHT$scriptArray <- c(rep("", numLine), .RIGHT$scriptArray)
  
} # function prependBlankLine

levelParsing <- function(dataList) {
  mainFrame <- data.frame(dataList)
  count <- 1
  
  saveLev <- ""
  mainLev <- "{ 'Pos' : ["
  
  for(i in 1:ncol(mainFrame)) {
    tmpCol <- levels(mainFrame[[i]])
    tmpLen <- length(tmpCol)
    
    if(length(tmpCol) != 0) {
      saveLev[count] <- paste(i-1)
      count <- (count + 1)
    }
  }
  
  for(i in 1:(count-1) ) {
    mainLev <- paste(mainLev, "\"", saveLev[i], "\"", sep = "")
    if(i < (count-1) ) {
      mainLev <- paste(mainLev, ", ", sep = "")
    } else {
      mainLev <- paste(mainLev, "], 'Levels' : [", sep = "") 
    }
  }
  
  for(i in 1:(count-1) ) {
    mainLev <- paste(mainLev, "[", sep = "")
    
    tmpCol <- as.character(levels(mainFrame[[as.numeric(saveLev[i])+1]]))
    tmpLen <- length(tmpCol)
    
    for(j in 1:tmpLen) {
      mainLev <- paste(mainLev, "\"", tmpCol[j], "\"", sep = "")
      if(j < tmpLen) {
        mainLev <- paste(mainLev, ", ", sep = "")
      } else {
        if(i < count-1) {
          mainLev <- paste(mainLev, "], ", sep = "")
        } else {
          mainLev <- paste(mainLev, "]", sep = "")
        }
      }
    }
  }
  
  mainLev <- paste(mainLev, "]}", sep = "")
  return (mainLev)
}

# Save data.frame objects in temporary files:
prepareDataE <- function(dataList) {
  
  # CHECK (junghoon): what happens if no names are given?
  nameArray <- names(dataList)
  dataframe <- data.frame(dataList)

  # print(dataList[[nameArray]]["carat"])
  
  # lapply will not work since it does not preserve the names of the list entries
  numData <- length(nameArray)  
  
  mainLev <- levelParsing(dataList)
  
  for(i in 1:ncol(dataframe)) {
    check <- levels(dataframe[, i])
    if(length(check) > 0) {
      dataList[[nameArray]][i] <- as.numeric(dataframe[, i])
    }  
  }
  
  mainArr <- toJSON(dataList)
  
  .RIGHT$scriptArray <- c(paste0("rawArr = ", mainArr, ";"), .RIGHT$scriptArray)
  .RIGHT$scriptArray <- c(paste0("rawLev = ", mainLev, ";"), .RIGHT$scriptArray)
} # function prepareData

prepareData <- function(dataList, dir = ".") {
  
  # CHECK (junghoon): what happens if no names are given?
  nameArray <- names(dataList)
  
  # lapply will not work since it does not preserve the names of the list entries
  dataframe <- data.frame(dataList)
  numData <- length(nameArray)
  
  mainLev <- levelParsing(dataList)
  
  for(i in 1:ncol(dataframe)) {
    check <- levels(dataframe[, i])
    if(length(check) > 0) {
      dataList[[nameArray]][i] <- as.numeric(dataframe[, i])
    }  
  }
  
  fileNameArray <- vector("character", numData)
  for (iData in 1:numData) {
    
    fileNameArray[iData] <- paste0("_", nameArray[iData], ".csv")
    write.csv(dataList[[iData]], file = file.path(dir, fileNameArray[iData]), row.names = F)
    
  } # for
  .RIGHT$scriptArray <- c(paste0("rawLev = ", mainLev, ";"), .RIGHT$scriptArray)
  return(fileNameArray)
  
} # function prepareData

# Add JavsScript expressions to load data. This function has side effects:
loadDataE <- function(nameArray = NULL) {
  
  if (!is.null(nameArray)) {
    
    # Data objects should be loaded before any plotting:
    .RIGHT$scriptArray <- c(paste0(nameArray, ' = createMainStructureE(rawArr, rawLev);'), 
                            .RIGHT$scriptArray) 
  } # if
  
  invisible()
  
} # function loadData

loadData <- function(nameArray = NULL, fileNameArray = paste0("_", nameArray, ".csv")) {
  
  if (!is.null(nameArray)) {
    
    if (length(nameArray) != length(fileNameArray)) {
      stop("nameArray and fileNameArray should have the same length.")
    } # if
    
    # Data objects should be loaded before any plotting:
    .RIGHT$scriptArray <- c(paste0(nameArray, ' = createMainStructure("', file.path("..", fileNameArray), '", rawLev);'), 
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
