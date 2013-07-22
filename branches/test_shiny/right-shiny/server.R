library(shiny)

shinyServer(function(input, output) {
  output$content <- reactive(function() {
    xAxis <-input$xAxis
    yAxis <-input$yAxis
    color <-input$color
    legend <-input$legend
    width <-input$width
    height <-input$height
    bin <-input$bin
    hide <- input$TestEntry1    
    graphName <- input$graphName    
    whichOption <- input$whichOption
    changeOption <- input$changeOption
    #linear regression 
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
      output<-list(xAxis, yAxis, color, legend, width, height, bin, hide, graphName, whichOption, changeOption, id, fitArray);  
      #print(fitArray)
      #output<-list(xAxis, yAxis, color, legend, width, height, bin, hide, graphName, whichOption, changeOption, linearOut);
      #linear regreession End
    }else{
      output<-list(xAxis, yAxis, color, legend, width, height, bin, hide, graphName, whichOption, changeOption);    
    } 
    
    return(output)
  })
})
