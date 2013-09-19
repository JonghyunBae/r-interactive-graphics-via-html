library(shiny)

shinyServer(function(input, output) {
  output$content <- reactive({
    if(length(input$first) != 0){
      if(input$first == 1){
        obj <- lm(conc ~ Time, Theoph)
        xRange <- range(Theoph$Time)
        xArray <- seq(xRange[1], xRange[2], length.out = length(Theoph$Time))
        yArray <- predict(obj, data.frame(Time = xArray))
        fitArray <- data.frame(x = xArray, y = yArray)
        containerId <- 2
        output <- list("first", fitArray)
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
