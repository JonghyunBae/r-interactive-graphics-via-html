library(shiny)

shinyServer(function(input, output) {
  output$content1 <- reactive({
    if (length(input$mainArr1) != 0) {
     if (length(input$mainArr1) > 1) {
       x <- Theoph$Time[!input$mainArr1]
       y <- Theoph$conc[!input$mainArr1]
       p <- cbind(x, y)
       p <- data.frame(p)
       obj <- lm(y ~ x, p)
       xRange <- range(x)
       xArray <- seq(xRange[1], xRange[2], length.out = length(x))
       yArray <- predict(obj, data.frame(x = xArray))
       output <- list("regArr1", data.frame(xx = xArray, yy = yArray))
       return(output)
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