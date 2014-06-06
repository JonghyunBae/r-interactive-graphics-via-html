library(shiny)

shinyServer(function(input, output) {
  output$loessArray1 <- reactive({
    if (length(input$mainArr1) != 0) {
     if (length(input$mainArr1) > 1) {
       # just copy
       obj <- loess(price ~ carat, data = sub.diamonds)
       xRange <- range(sub.diamonds$carat)
       simArray <- data.frame(carat = seq(xRange[1], xRange[2], length.out = 100))
       simArray$price <- predict(obj, newdata = simArray)
       
       # generation
       for loop in length
        simArray <- simArray[colname[i]][!input$mmainArr1]
       return("loessArray1", simArray) # output$loessArray <- simArray
       
     } else {
       output <- list(-1, -1)
       return (output)
     }
    }
  })
  
  output$content2 <- reactive({
    if (length(input$mainArr2) != 0) {
      if (length(input$mainArr2) > 1) {
        x <- Theoph$Time[!input$mainArr2]
        y <- Theoph$conc[!input$mainArr2]
        p <- cbind(x, y)
        p <- data.frame(p)
        obj <- lm(y ~ x, p)
        xRange <- range(x)
        xArray <- seq(xRange[1], xRange[2], length.out = length(x))
        yArray <- predict(obj, data.frame(x = xArray))
        output <- list("regArr2", data.frame(xx = xArray, yy = yArray))
        return(output)
      } else {
        output <- list(-1, -1)
        return (output)
      }
    }
  })
})