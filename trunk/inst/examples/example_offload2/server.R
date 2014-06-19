.subDiamonds<- data.frame(fromJSON("subDiamonds.JSON"))
.Theoph<- data.frame(fromJSON("Theoph.JSON"))

shinyServer(function(input, output) {

	output$loessArray <- reactive({ 
		if (length(input$subDiamonds) != 0) { 
			if (length(input$subDiamonds) > 1) { 
				subDiamonds <- .subDiamonds[!input$subDiamonds, ]
        obj <- loess(price ~ carat, data = subDiamonds)
        xRange <- range(subDiamonds$carat)
        simArray <- data.frame(carat = seq(xRange[1], xRange[2], length.out = 100))
        simArray$price <- predict(obj, newdata = simArray)
                        
        return(simArray)
			} else { 
				output <- list(-1, -1) 
				return (output) 
			}
		}
	})
	output$lmArray <- reactive({ 
		if (length(input$Theoph) != 0) { 
			if (length(input$Theoph) > 1) { 
				Theoph <- .Theoph[!input$Theoph, ]
				obj <- lm(conc ~ Time, data = Theoph)
        xRange <- range(Theoph$Time)
        simArray <- data.frame(Time = seq(xRange[1], xRange[2], length.out = 132))
        simArray$conc <- predict(obj, newdata = simArray)
                        
        return(simArray)
			} else { 
				output <- list(-1, -1) 
				return (output) 
			}
		}
	})
})
