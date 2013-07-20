library(shiny)

shinyServer(function(input, output) {
  output$scatterContainer1 <- reactive(function() {
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
    output<-list(xAxis, yAxis, color, legend, width, height, bin, hide, graphName, whichOption, changeOption);
    return(output)
  })
})
