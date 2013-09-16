library(shiny)

shinyServer(function(input, output) {
  output$content <- reactive({
    if(length(input$start != 0)){
      if(input$start != -1){
        if(input$graph == "linear"){
          containerId <- input$containerId
          xx <- input$xx
          yy <- input$yy
          pp <- cbind(xx,yy)
          pp <- data.frame(pp)
          obj.lm <- lm(yy ~ xx, pp)
          xRange <- range(xx)
          xArray <- seq(xRange[1], xRange[2], length.out = length(xx))
          yArray <- predict(obj.lm, data.frame(xx = xArray))
          fitArray <- data.frame(xx = xArray, yy = yArray)
          output <- list(containerId, fitArray)
          return(output)
        }else if(input$graph == "loess"){
          containerId <- input$containerId
          xx <- input$xx
          yy <- input$yy
          pp <- cbind(xx,yy)
          pp <- data.frame(pp)
          obj <- loess(yy ~ xx, pp)
          xRange <- range(xx)
          xArray <- seq(xRange[1], xRange[2], length.out = length(xx))
          yArray <- predict(obj, data.frame(xx = xArray))
          fitArray <- data.frame(xx = xArray, yy = yArray)
          output <- list(containerId, fitArray) 
          return(output)
        }
      }else{
        output<-list(-1,-1)
        return(output)
      }      
    }
  })
  output$content1 <- reactive({
    if(length(input$yy1) != 0){
      if(input$id1 != -1){
        if(input$type1 == "scatter" && input$graph1 == "loess"){
          xx1 <- input$xx1
          yy1 <- input$yy1
          pp1 <- cbind(xx1,yy1)
          pp1 <- data.frame(pp1)
          id1 <- input$id1
          obj <- loess(yy1 ~ xx1, pp1)
          xRange1 <- range(xx1)
          xArray1 <- seq(xRange1[1], xRange1[2], length.out = length(xx1))
          yArray1 <- predict(obj, data.frame(xx1 = xArray1))
          fitArray1 <- data.frame(xx1 = xArray1, yy1 = yArray1)
          # NEW CODE
          yRange1 <- range(yy1)
          fitArray1 <- fitArray1[yRange1[1] <= fitArray1$yy1 & fitArray1$yy1 <= yRange1[2], ]
          # END: NEW CODE
          output<-list(id1, input$graph1, fitArray1) 
          return(output)            
        }          
      }else{
        output<-list(-1,-1)
        return(output)
      }
    }
  })
})
