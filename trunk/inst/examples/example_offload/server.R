library(shiny)

shinyServer(function(input, output) {
  output$loessArray <- reactive({
    if (length(input$mainArr1) != 0) {
      if (length(input$mainArr1) > 1) {
       
        # just copy
        obj <- loess(Time ~ conc, data = Theoph)
        xRange <- range(Theoph$conc)
        simArray <- data.frame(conc = seq(xRange[1], xRange[2], length.out = 132))
        simArray$Time <- predict(obj, newdata = simArray)
       
        # generation
        temp.x <- simArray[[colnames(simArray)[1]]][!input$mainArr1]
        temp.y <- simArray[[colnames(simArray)[2]]][!input$mainArr1]
        
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
})