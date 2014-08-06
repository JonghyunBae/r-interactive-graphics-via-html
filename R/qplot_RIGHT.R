## qplot_RIGHT.R

#' @title Extract data object's name
#' 
#' @description Function to create data object name in qplot function.
#' 
#' @param x xaxis to draw graph.
#' @param y yaxis to draw graph. Default is NULL
#' @param data a data.frame object.
#' @param geom graph type to draw(point, line, bar, boxplot). Default is "point"
#' 
#' @seealso \code{\link{qplot}}
#' 
#' @export
#' 
#' @examples
#' \donttest{
#' obj <- RIGHT({qplot(x=Time, y=conc, data=Theoph, geom="point", colour=Subject)
#'               qplot(x=Time, fill=Subject, data=Theoph, geom="bar")})
#' print(obj)
#' }
qplot_RIGHT <- function(x, y = NULL, ..., data, geom = "point") {
  
  .all_aesthetics <- c("adj", "alpha", "angle", "bg", "cex", "col", "color", "colour", "fg", "fill", "group", "hjust", "label", "linetype", "lower", "lty", "lwd", "max", "middle", "min", "order", "pch", "radius", "sample", "shape", "size", "srt", "upper", "vjust", "weight", "width", "x", "xend", "xmax", "xmin", "xintercept", "y", "yend", "ymax", "ymin", "yintercept", "z")
  argArray <- as.list(match.call())
  
  aesthetics <- plyr::compact(argArray[.all_aesthetics])
  class(aesthetics) <- "uneval"

  obj <- ggplot2::ggplot(data, aesthetics)
  
  data <- if (is.null(argArray$data)) NULL else as.character(argArray$data)
  attr(obj, "NAME") <- data
  
  if(geom == "point") {
    obj <- obj + ggplot2::geom_point()
  } else if(geom == "bar") {
    obj <- obj + ggplot2::geom_bar()
  } else if(geom == "line") {
    obj <- obj + ggplot2::geon_line()
  } else if(geom == "boxplot") {
    obj <- obj + ggplot2::geom_boxplot()
  } # if
 
  return(obj)
  
} # function qplot_RIGHT

is.constant <- function(x) {
  sapply(x, function(x) "I" %in% all.names(asOneSidedFormula(x)))
} # function is.constant
