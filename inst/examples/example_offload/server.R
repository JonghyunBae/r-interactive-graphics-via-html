library(shiny)

shinyServer(function(input, output) {
  output$loessArray <- reactive({
    if (length(input$subDiamonds) != 0) {
      if (length(input$subDiamonds) > 1) {
        
        # just copy user's code
        # need to object name for user that detect data object's name which is not default in R (i.e. subDiamonds)
        obj <- loess(price ~ carat, data = subDiamonds)
        xRange <- range(subDiamonds$carat)
        simArray <- data.frame(carat = seq(xRange[1], xRange[2], length.out = 100))
        simArray$price <- predict(obj, newdata = simArray)
       
        # Cheking isHidden property at here (I think it is no problem to operate server-offloading)
        simArray <- simArray[!input$subDiamonds, ]
        
        # no list in return
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
        
        obj <- lm(conc ~ Time, data = Theoph)
        xRange <- range(Theoph$Time)
        simArray <- data.frame(Time = seq(xRange[1], xRange[2], length.out = 132))
        simArray$conc <- predict(obj, newdata = simArray)
        
        simArray <- simArray[!input$Theoph, ]
      
        return(simArray) 
        
      } else {
        output <- list(-1, -1)
        return (output)
      }
    }
  })
})