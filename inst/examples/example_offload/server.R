library(shiny)

shinyServer(function(input, output) {
  output$loessArray <- reactive({
    if (length(input$mainArr1) != 0) {
      if (length(input$mainArr1) > 1) {
       
        # just copy
        obj <- loess(conc ~ Time, data = Theoph)
        xRange <- range(Theoph$Time)
        simArray <- data.frame(Time = seq(xRange[1], xRange[2], length.out = 132))
        simArray$conc <- predict(obj, newdata = simArray)
       
        # generation
        # some problem
        for(i in 1:length(simArray))
          simArray[[colnames(simArray)[i]]] <- simArray[[colnames(simArray)[i]]][!input$mainArr1]
        
        # no multiple output
        return(list("loessArray", simArray)) # output$loessArray <- simArray
       
      } else {
        output <- list(-1, -1)
        return (output)
      }
    }
  })
})