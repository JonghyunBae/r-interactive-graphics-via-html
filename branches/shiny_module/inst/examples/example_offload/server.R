library(shiny)

shinyServer(function(input, output) {
  output$content <- reactive({
    if(length(input$first) != 0){
      if(input$first == 1){
        obj <- lm(conc ~ Time, Theoph)
        xRange <- range(Theoph$Time)
        xArray <- seq(xRange[1], xRange[2], length.out = length(Theoph$Time))
        yArray <- predict(obj, data.frame(Time = xArray))
        #regArr <- data.frame(xx = xArray, yy = yArray)
        output <- list("regArr", data.frame(xx = xArray, yy = yArray))
        return(output)
      }else{
        output <- list(-1, -1)
        return(output)
      }
    }      
  })
})
