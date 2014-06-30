AlldataArr <- scan("./www/data.js", what="")

dataObj <- c()
  levelSt <- c()
  levelArr <- c()
  indexSt <- c()
  indexEd <- c()
  dataArr <- c()
  
  for(index in 1:length(AlldataArr)) {
  
  if(AlldataArr[index] == "=") {
  
  start <- index+1
  objName <- paste0(".",AlldataArr[index-1])
  
  } else if(AlldataArr[index] == "};") {
  
  end <- index
  AlldataArr[index] <- "}"
  
  dataObj <- AlldataArr[start:end]
  
  for(iData in start:end - start + 1) {
  
  if(dataObj[iData] == "level") {
  levelSt <- append(levelSt, iData+3)
  } else if(dataObj[iData] == "index") {
  indexSt <- append(indexSt, iData+3)
  } 
  
  } 
  
  for(iData in 1:length(levelSt)) {
  
  for(jData in seq(levelSt[iData], (indexSt[iData]-5), 2)) {
  levelArr <- append(levelArr, dataObj[jData])
  }
  
  jData <- indexSt[iData]
  
  while(dataObj[jData] != "]") {
  
  if(dataObj[jData+1] == "]") {
  dataObj[jData] <- paste0('"', levelArr[as.integer(dataObj[jData]) + 1], '"') 
  } else {        
  tempArr <- strsplit(dataObj[jData], ",")
  dataObj[jData] <- paste0('"', levelArr[as.integer(tempArr[[1]]) + 1], '",')        
  } 
  
  jData <- jData+1
  
  } 
  
  indexEd <- append(indexEd, jData+1)
  
  if(dataObj[indexEd[iData]] == "},") {
  dataObj[[indexEd[iData]]] <- "], "
  } 
  
  levelArr <- c()
  } 
  
  for(iData in length(levelSt):1) {  
  dataObj <- dataObj[c(-(indexEd[iData]-1), -((indexSt[iData]-2) : (levelSt[iData]-4)))]
  } 
  
  for(iData in 1:length(dataObj)) {
  
  if(dataObj[iData + 1] == ":" && iData < length(dataObj)) {
  dataObj[iData] <- paste0('"', dataObj[iData], '"')
  } 
  
  dataArr <- paste0(dataArr, dataObj[iData])
  } 
  
  assign(objName, data.frame(fromJSON(dataArr)))
  
  dataArr <- c()
  dataObj <- c()
  levelSt <- c()
  indexSt <- c()
  indexEd <- c()
  
  } 
  } 
shinyServer(function(input, output) {

	output$loessArray1 <- reactive({ 
		if (length(input$subDiamonds) != 0) { 
			if (length(input$subDiamonds) > 1) { 
				subDiamonds <- .subDiamonds[!input$subDiamonds, ]
				{
    obj <- loess(carat ~ price, data = subDiamonds)
    xRange <- range(subDiamonds$price)
    simArray <- data.frame(price = seq(xRange[1], xRange[2], length.out = 132))
    simArray$carat <- predict(obj, newdata = simArray)
    return(simArray)
}
			} else { 
				output <- list(-1, -1) 
				return (output) 
			}
		}
	})
	output$lmArray1 <- reactive({ 
		if (length(input$subDiamonds) != 0) { 
			if (length(input$subDiamonds) > 1) { 
				subDiamonds <- .subDiamonds[!input$subDiamonds, ]
				{
    obj <- lm(carat ~ price, data = subDiamonds)
    xRange <- range(subDiamonds$price)
    simArray <- data.frame(price = seq(xRange[1], xRange[2], length.out = 132))
    simArray$carat <- predict(obj, newdata = simArray)
    return(simArray)
}
			} else { 
				output <- list(-1, -1) 
				return (output) 
			}
		}
	})
	output$loessArray2 <- reactive({ 
		if (length(input$Theoph) != 0) { 
			if (length(input$Theoph) > 1) { 
				Theoph <- .Theoph[!input$Theoph, ]
				{
    obj <- loess(conc ~ Time, data = Theoph)
    xRange <- range(Theoph$Time)
    simArray <- data.frame(Time = seq(xRange[1], xRange[2], length.out = 132))
    simArray$conc <- predict(obj, newdata = simArray)
    return(simArray)
}
			} else { 
				output <- list(-1, -1) 
				return (output) 
			}
		}
	})
	output$lmArray2 <- reactive({ 
		if (length(input$Theoph) != 0) { 
			if (length(input$Theoph) > 1) { 
				Theoph <- .Theoph[!input$Theoph, ]
				{
    obj <- lm(conc ~ Time, data = Theoph)
    xRange <- range(Theoph$Time)
    simArray <- data.frame(Time = seq(xRange[1], xRange[2], length.out = 132))
    simArray$conc <- predict(obj, newdata = simArray)
    return(simArray)
}
			} else { 
				output <- list(-1, -1) 
				return (output) 
			}
		}
	})
})
