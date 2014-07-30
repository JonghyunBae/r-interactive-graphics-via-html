ggplot_RIGHT <- function(expr) {
  
  for(numPlot in 2:length(expr)) {

    comp <- strsplit(.RIGHT$str[numPlot], "[(]")
    
    if(comp[[1]][1] != "ggplot" && comp[[1]][1] != "qplot") {
      next
    } else if(comp[[1]][1] == "ggplot") {
      
      comp <- strsplit(.RIGHT$str[numPlot], "[+]")
      
      eval(parse(text = comp[[1]][1]), envir = list(ggplot = ggplot2data))
    } else {
      eval(parse(text = .RIGHT$str[numPlot]), envir = list(qplot = qplot2data))
    }
    
    
    obj <- eval(parse(text = .RIGHT$str[numPlot]))  
    obj.type <- c()
    
    if(length(obj$layers) == 1) {
      obj.type <- as.list(as.list(obj$layers[[1]])$geom)$objname
    } else if(length(obj$layers) > 1) {
      for(iData in 1:length(obj$layers)) {
        obj.type <- append(obj.type, 
                           as.list(as.list(obj$layers[[iData]])$geom)$objname)
      }
    }
    
    obj.data <- obj$data
    
    if(obj.type == "point" || obj.type == "line") {
      obj.x <- obj$labels$x
      obj.y <- obj$labels$y
    } else if(obj.type == "bar") {
      obj.x <- obj$labels$x
      obj.y <- obj$labels$fill
    }
    
    checkColumnName(obj.x, obj.data)
    checkColumnName(obj.y, obj.data)
    
    .RIGHT$nameArray <- append(.RIGHT$nameArray, .RIGHT$gg2data)
    .RIGHT$numAxis <- .RIGHT$numAxis + 1
    
    .RIGHT$divArray <- append(.RIGHT$divArray, 
                              paste0('<div id="container', .RIGHT$numAxis,
                                     '" oncontextmenu="return false;"></div>'))
    
    if(length(obj.type) == 1) {
      if(obj.type == "point") {
        
        .RIGHT$numPoints <- .RIGHT$numPoints + 1
    
        .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                                     c(paste0("var axis", .RIGHT$numAxis,
                                              " = new Axis(", .RIGHT$numAxis, 
                                              ", ", .RIGHT$gg2data,
                                              ", '", obj.x, "', '", obj.y, 
                                              "', ", "{}", ");"),
                                       paste0("var point", .RIGHT$numPoints,
                                              " = new Dot(axis", .RIGHT$numAxis,
                                              ", ", .RIGHT$gg2data,
                                              ", '", obj.x, "', '", obj.y, "', ",
                                              "{}" ,");")))
        
        addSource("dot.js")
        
      } else if(obj.type == "line") {
        
        .RIGHT$numLines <- .RIGHT$numLines + 1
        
        .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                                     c(paste0("var axis", .RIGHT$numAxis,
                                              " = new Axis(", .RIGHT$numAxis, 
                                              ", ", .RIGHT$gg2data,
                                              ", '", obj.x, "', '", obj.y, 
                                              "', ", "{}", ");"),
                                       paste0("var lineObj", .RIGHT$numLines,
                                              " = new MakeLineObj(", .RIGHT$gg2data, 
                                              ", '", obj.x, "', '", obj.y, "', ",
                                              "{}",");"),
                                       paste0("var line", .RIGHT$numLines,
                                              " = new Line(axis", .RIGHT$numAxis,
                                              ", lineObj", .RIGHT$numLines,
                                              ", 'x1', 'x2', 'y1', 'y2', ",
                                              "{}", ");")))
        
        addSource("line.js")
        
      } else if(obj.type == "bar") {
        
        .RIGHT$numHist <- .RIGHT$numHist + 1
        
        .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                                     c(paste0("var histObj", .RIGHT$numHist,
                                              " = new ddply(", .RIGHT$gg2data, 
                                              ", ", createArray(unique(c(obj.x, obj.y)), alwaysArray = TRUE), ", {});"),
                                       paste0("var axis", .RIGHT$numAxis,
                                              " = new Axis(", .RIGHT$numAxis, 
                                              ", histObj", .RIGHT$numHist, # hist object is used to set axis
                                              ", '", obj.x, 
                                              "', 'frequency', ", createObject(legend = obj.y, alwaysObject = TRUE), ");"),
                                       paste0("var hist", .RIGHT$numHist,
                                              " = new Bar(axis", .RIGHT$numAxis,
                                              ", histObj", .RIGHT$numHist,
                                              ", '", obj.x, "', 'frequency', {});")))
        
        addSource("bar.js")
      }
    } else if(length(obj.type) > 1) {
      if(as.character(sort(obj)) == as.character(c("line", "point"))) {
        print("true")
      }
    }
  }
  
  invisible()
} # function ggplot_RIGHT

ggplot2data <- function(data, ...) {
  
  argArray <- as.list(match.call())
  
  # extract data object name
  .RIGHT$gg2data <- if (is.null(argArray$data)) NULL else as.character(argArray$data)
  
} # function ggplot2data

qplot2data <- function(..., data) {
  
  argArray <- as.list(match.call())
  
  # extract data object name
  .RIGHT$gg2data <- if (is.null(argArray$data)) NULL else as.character(argArray$data)

} # function qplot2data
