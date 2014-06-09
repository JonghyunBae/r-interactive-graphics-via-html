library(shiny)

shinyServer(function(input, output) {
  output$loessArray <- reactive({
    if (length(input$subDiamonds) != 0) {
      if (length(input$subDiamonds) > 1) {
       
        # just copy
        obj <- loess(price ~ carat, data = subDiamonds)
        xRange <- range(subDiamonds$carat)
        simArray <- data.frame(carat = seq(xRange[1], xRange[2], length.out = 100))
        simArray$price <- predict(obj, newdata = simArray)
       
        # generation
        temp.x <- simArray[[colnames(simArray)[1]]][!input$subDiamonds]
        temp.y <- simArray[[colnames(simArray)[2]]][!input$subDiamonds]
        
        temp.names <- colnames(simArray)
        simArray <- data.frame(temp.x, temp.y)
        
        for(i in 1:length(simArray))
          colnames(simArray)[i] <- temp.names[i]
        
        # can't multiple output in R
        return(list("loessArray", simArray)) # output$loessArray <- simArray
       
      } else {
        output <- list(-1, -1)
        return (output)
      }
    }
  })
  
  output$lmArray <- reactive({
    if (length(input$Theoph) != 0) {
      if (length(input$Theoph) > 1) {
        
        # just copy
        obj <- lm(conc ~ Time, data = Theoph)
        xRange <- range(Theoph$Time)
        simArray <- data.frame(Time = seq(xRange[1], xRange[2], length.out = 132))
        simArray$conc <- predict(obj, newdata = simArray)
        
        # Need to change new method
        temp.x <- simArray[[colnames(simArray)[1]]][!input$Theoph]
        temp.y <- simArray[[colnames(simArray)[2]]][!input$Theoph]
        
        temp.names <- colnames(simArray)
        simArray <- data.frame(temp.x, temp.y)
        
        for(i in 1:length(simArray))
          colnames(simArray)[i] <- temp.names[i]
        
        # can't multiple output in R
        return(list("lmArray", simArray)) # output$loessArray <- simArray
        
      } else {
        output <- list(-1, -1)
        return (output)
      }
    }
  })
})