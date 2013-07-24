library(shiny)

shinyServer(function(input, output) {
  output$content <- reactive(function() {
    #linear regression 
    if(length(input$yy) != 0){
        if(input$id != -1){
          if(input$type == "scatter" && input$graph == "linear"){
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
            output<-list(id, input$type, fitArray) 
            return(output)
          }else if(input$type == "scatter" && input$graph == "loess"){
            xx <- input$xx
            yy <- input$yy
            pp <- cbind(xx,yy)
            pp <- data.frame(pp)
            id <- input$id
            obj <- loess(yy ~ xx, pp)
            xRange <- range(xx)
            xArray <- seq(xRange[1], xRange[2], length.out = length(xx))
            yArray <- predict(obj, data.frame(xx = xArray))
            fitArray <- data.frame(xx = xArray, yy = yArray)
            output<-list(id, input$type, fitArray) 
            return(output)            
          }
          
        }else{
          output<-list(-1,-1)
          return(output)
        }
      }
  })
})
