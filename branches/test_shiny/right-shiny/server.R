library(shiny)


# Define server logic required to summarize and view the selected dataset
shinyServer(function(input, output) {
  
  # Return the requested dataset
#  datasetInput <- reactive({
 #   switch(input$dataset,
 #          "rock" = rock,
#           "pressure" = pressure,
#           "cars" = cars)
#  })
#  xAxis <- reactive({
#    switch(input$dataset,
#           "carat" = carat,           
#           "cut" = cut,
#           "color" = color,
#           "clarity" = clarity,
#           "depth" = depth)
#  })
  
  

  sad <- reactive({as.data.frame(lapply(input$TestEntry2, unlist))})
  observe({print(sad())})
  
  output$scatterContainer1 <- reactive(function() {
  #  input$Width    
    xAxis <-input$xAxis
    yAxis <-input$yAxis
    color <-input$color
    legend <-input$legend
    width <-input$width
    height <-input$height
    bin <-input$bin
    hide <- input$TestEntry1
    fun <-{as.data.frame(lapply(input$TestEntry1, unlist))}
    #output<-list(xAxis, yAxis, color, legend, width, height, bin);
    output<-list(xAxis, yAxis, color, legend, width, height, bin, hide);
    return(output)
  })
  
 
  
  
  
})
