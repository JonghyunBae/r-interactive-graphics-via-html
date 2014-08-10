## ggplot_RIGHT.R

#' @title Extract data object's name
#' 
#' @description Function to create data object name in ggplot function.
#' 
#' @param data a data.frame object.
#' @param ... other options to draw graph(colour, fill)
#' 
#' @seealso \code{\link{ggplot2}}
#' 
#' @export
#' 
#' @examples
#' \donttest{
#' obj <- RIGHT({ggplot(Theoph, aes(Time, conc, colour=Subject)) + geom_point()
#'               ggplot(Theoph, aes(Time, fill=Subject)) + geom_bar()})
#' print(obj)
#' }
ggplot_RIGHT <- function(data, ...) {
  
  argArray <- as.list(match.call())
  
  obj <- ggplot(data, ...)
  
  data <- if (is.null(argArray$data)) NULL else as.character(argArray$data)
  
  .RIGHT$axis.x <- obj$labels$x
  .RIGHT$axis.y <- obj$labels$y
  .RIGHT$axis.fill <- obj$labels$fill
  .RIGHT$axis.color <- obj$labels$colour
  .RIGHT$axis.data <- data
    
  return(obj)
  
} # function ggplot_RIGHT

ggplot_point <- function() {
  
  dataArray <- get(.RIGHT$axis.data, envir = parent.frame(), inherits = TRUE)
  argArray <- is.axis.null()
  
  aesthetics <- plyr::compact(argArray)
  class(aesthetics) <- "uneval"
  
  obj <- ggplot(dataArray, aesthetics) + geom_point()
  attr(obj, "NAME") <- .RIGHT$axis.data
  
  ggplot2RIGHT(obj)
  
} # function ggplot_point

ggplot_line <- function() {
  
  dataArray <- get(.RIGHT$axis.data, envir = parent.frame(), inherits = TRUE)
  argArray <- is.axis.null()
  
  aesthetics <- plyr::compact(argArray)
  class(aesthetics) <- "uneval"
  
  obj <- ggplot(dataArray, aesthetics) + geom_line()
  attr(obj, "NAME") <- .RIGHT$axis.data
  
  ggplot2RIGHT(obj)
  
} # function ggplot_line

ggplot_bar <- function() {
  
  dataArray <- get(.RIGHT$axis.data, envir = parent.frame(), inherits = TRUE)
  argArray <- is.axis.null()
  
  aesthetics <- plyr::compact(argArray)
  class(aesthetics) <- "uneval"
  
  obj <- ggplot(dataArray, aesthetics) + geom_bar()
  attr(obj, "NAME") <- .RIGHT$axis.data
  
  ggplot2RIGHT(obj)
  
} # function ggplot_line

ggplot_boxplot <- function() {
  
  dataArray <- get(.RIGHT$axis.data, envir = parent.frame(), inherits = TRUE)
  argArray <-  is.axis.null()
  
  aesthetics <- plyr::compact(argArray)
  class(aesthetics) <- "uneval"
  
  obj <- ggplot(dataArray, aesthetics) + geom_boxplot()
  attr(obj, "NAME") <- .RIGHT$axis.data
  
  ggplot2RIGHT(obj)
  
} # function ggplot_line

is.axis.null <- function() {
  
  argArray <- c()
  
  if(!is.null(.RIGHT$axis.x))
    argArray$x <- as.symbol(.RIGHT$axis.x)
  
  if(!is.null(.RIGHT$axis.y))
    argArray$y <- as.symbol(.RIGHT$axis.y)
  
  if(!is.null(.RIGHT$axis.fill))
    argArray$fill <- as.symbol(.RIGHT$axis.fill)
  
  if(!is.null(.RIGHT$axis.color))
    argArray$colour <- as.symbol(.RIGHT$axis.color)    
  
  return(argArray)
  
} # function is.axis.null

#' @title Make RIGHT html code using ggplot object
#' 
#' @description Function to create data object name in ggplot function.
#' 
#' @param obj a data.frame object.
#' 
#' @seealso \code{\link{ggplot2}}
#' 
#' @export
#' 
#' @examples
#' \donttest{
#' obj <- ggplot(Theoph, aes(Time, conc)) + geom_point()
#' ggplot2RIGHT(obj)
#' }
ggplot2RIGHT <- function(obj) {
  
  type <- as.list(as.list(obj$layers[[1]])$geom)$objname
  data <- attr(obj, "NAME")
  col <- NULL # TEMPORARY
  
  # get is necessary in case a character string is given for data:
  if (!exists(data, envir = parent.frame())) {
    stop(data, " does not exist.")
  } # if
  dataArray <- get(data, envir = parent.frame(), inherits = TRUE)

  # Keep name of the data object:
  .RIGHT$nameArray <- append(.RIGHT$nameArray, data)
  
  # Increment the number of axes:
  .RIGHT$numAxis <- .RIGHT$numAxis + 1
  
  # Add div in body:
  .RIGHT$divArray <- append(.RIGHT$divArray, 
                            paste0('<div id="container', .RIGHT$numAxis,
                                   '" oncontextmenu="return false;"></div>'))
  
  if(type == "point") {
    
    # Increment the number of points:
    .RIGHT$numPoints <- .RIGHT$numPoints + 1
    
    axis.x <- obj$labels$x
    axis.y <- obj$labels$y  
    axis.color <- obj$labels$colour
    
    checkColumnName(axis.x, dataArray)
    checkColumnName(axis.y, dataArray)
    checkColumnName(axis.color, dataArray)
    
    # Add script in body:
    .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                                 paste0("var axis", .RIGHT$numAxis,
                                        " = new Axis(", .RIGHT$numAxis, 
                                        ", ", data,
                                        ", '", axis.x, "', '", axis.y, 
                                        "', ", createObject(legend = axis.color, alwaysObject = TRUE), ");"))
    
    .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                                 paste0("var point", .RIGHT$numPoints,
                                        " = new Dot(axis", .RIGHT$numAxis,
                                        ", ", data,
                                        ", '", axis.x, "', '", axis.y, "', ",
                                        createObject(baseColor = col, alwaysObject = TRUE) ,");"))
    
    # Source dot.js in head:
    addSource("dot.js")
    
  } else if(type == "line") {
    
    # Increment the number of lines:
    .RIGHT$numLines <- .RIGHT$numLines + 1
    
    axis.x <- obj$labels$x
    axis.y <- obj$labels$y
    axis.color <- obj$labels$colour
    axis.by <- obj$labels$group
    
    checkColumnName(axis.x, dataArray)
    checkColumnName(axis.y, dataArray)
    checkColumnName(axis.color, dataArray)
    
    # Add script in body:
    .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                                 paste0("var axis", .RIGHT$numAxis,
                                        " = new Axis(", .RIGHT$numAxis, 
                                        ", ", data,
                                        ", '", axis.x, "', '", axis.y, 
                                        "', ", createObject(legend = axis.color, alwaysObject = TRUE), ");"))
    
    .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                                 c(paste0("var lineObj", .RIGHT$numLines,
                                          " = new MakeLineObj(", data, 
                                          ", '", axis.x, "', '", axis.y, "', ",
                                          createObject(group = axis.by, alwaysObject = TRUE),");"),
                                   paste0("var line", .RIGHT$numLines,
                                          " = new Line(axis", .RIGHT$numAxis,
                                          ", lineObj", .RIGHT$numLines,
                                          ", 'x1', 'x2', 'y1', 'y2', ",
                                          createObject(baseColor = col, alwaysObject = TRUE), ");")))
    
    # Source line.js in head:
    addSource("line.js")
    
  } else if(type == "bar") {
    
    # Increment the number of histograms:
    .RIGHT$numHist <- .RIGHT$numHist + 1
    
    axis.x <- obj$labels$x
    axis.color <- obj$labels$fill
    
    checkColumnName(axis.x, dataArray)
    checkColumnName(axis.color, dataArray)
    
    # Add script in body:
    .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                                 c(paste0("var histObj", .RIGHT$numHist,
                                          " = new ddply(", data, 
                                          ", ", createArray(unique(c(axis.x, axis.color)), alwaysArray = TRUE), ", {});"),
                                   paste0("var axis", .RIGHT$numAxis,
                                          " = new Axis(", .RIGHT$numAxis, 
                                          ", histObj", .RIGHT$numHist, # hist object is used to set axis
                                          ", '", axis.x, 
                                          "', 'frequency', ", createObject(legend = axis.color, alwaysObject = TRUE), ");"),
                                   paste0("var hist", .RIGHT$numHist,
                                          " = new Bar(axis", .RIGHT$numAxis,
                                          ", histObj", .RIGHT$numHist,
                                          ", '", axis.x, "', 'frequency', {});")))
    
    # Source bar.js in head:
    addSource("bar.js")
    
  } else if(type == "boxplot") {
    
    # Increment the number of Box-whisker:
    .RIGHT$numBox <- .RIGHT$numBox + 1
    
    axis.x <- obj$labels$x
    axis.y <- obj$labels$y
    
    checkColumnName(axis.x, dataArray)
    checkColumnName(axis.y, dataArray)
    
    # Add script in body:
    .RIGHT$scriptArray <- append(.RIGHT$scriptArray,
                                 c(paste0("var boxObj", .RIGHT$numBox,
                                          " = new MakeBoxObj(", data,
                                          ", ['", axis.x, "'], ['", axis.y, "'], {});"),
                                   paste0("var axis", .RIGHT$numAxis,
                                          " = new Axis(", .RIGHT$numAxis, 
                                          ", boxObj", .RIGHT$numBox, # box object is used to set axis
                                          ", '", axis.x, "', '", axis.y, "', {});"),
                                   paste0("var box", .RIGHT$numBox,
                                          " = new Box(axis", .RIGHT$numAxis,
                                          ", boxObj", .RIGHT$numBox,
                                          ", ", createObject(baseColor = NULL, alwaysObject = TRUE), ");")))
    
    # Source box.js in head:
    addSource("box.js")  
    
  } # if
  
  invisible()
  
} # function ggplot2RIGHT