library(shiny)

shinyServer(function(input, output) {
  output$content <- reactive(function() {
    #linear regression 
   # print("tttttt")
    if(length(input$xx) != 0){
      xx <- input$xx
      yy <- input$yy
      pp <- cbind(xx,yy)    
      pp <- data.frame(pp)
      #print(pp)
      id <- input$id
      obj.lm <- lm(yy ~ xx, pp)
      xRange <- range(xx)
      #print(xRange)
      xArray <- seq(xRange[1], xRange[2], length.out = length(xx))
      yArray <- predict(obj.lm, data.frame(xx = xArray))
      fitArray <- data.frame(xx = xArray, yy = yArray)
      output<-list(id, fitArray);  
      
      return(output)
    }
    hide <- input$hide
   # print("gggggg")
   # print(hide)
    output <- list(hide)
    return(output)
    
  })
})
