library(shiny)
rm(list = ls())

.subDiamonds <- data.frame(fromJSON("subDiamonds.JSON"))
.Theoph <- data.frame(fromJSON("Theoph.JSON"))

shinyServer(function(input, output) {
  output$loessArray <- reactive({
    if (length(input$subDiamonds) != 0) {
      if (length(input$subDiamonds) > 1) {
       
        # copy data .subDiamonds <- subDiamonds? where?
        subDiamonds <- .subDiamonds[!input$subDiamonds, ]
        
        # user code   
        obj <- loess(price ~ carat, data = subDiamonds)
        xRange <- range(subDiamonds$carat)
        simArray <- data.frame(carat = seq(xRange[1], xRange[2], length.out = 100))
        simArray$price <- predict(obj, newdata = simArray)
       
        return(simArray) # output$loessArray <- simArray
       
      } else {
        output <- list(-1, -1)
        return (output)
      }
    }
  })
  
  output$lmArray <- reactive({
    if (length(input$Theoph) != 0) {
      if (length(input$Theoph) > 1) {
        
        # how to make .Theoph (it has origin data of Theoph)
        Theoph <- .Theoph[!input$Theoph, ]
        
        # user code
        
        obj <- lm(conc ~ Time, data = Theoph)
        xRange <- range(Theoph$Time)
        simArray <- data.frame(Time = seq(xRange[1], xRange[2], length.out = 100))
        simArray$conc <- predict(obj, newdata = simArray)
              
        return(simArray) 
        
      } else {
        output <- list(-1, -1)
        return (output)
      }
    }
  })
})