\name{RIGHT}
\alias{RIGHT}
\title{Entry Function for RIGHT}
\usage{
  RIGHT(expr = { }, ...,
    title = "RIGHT: R Interactive Graphics via HTml",
    dir = tempfile(), isOverwrite = FALSE,
    supportRIGHT = getOption("supportRIGHT"))
}
\arguments{
  \item{expr}{plotting expression to evaluate}

  \item{...}{data.frame objects used in \code{expr}. If
  they are used in one of the plotting functions, it is not
  necessary to list them.}

  \item{title}{title of the visualization. The default
  value is "RIGHT: R Interactive Graphics via HTml."}

  \item{dir}{directory name to store files used for the
  visualization. Temporary directory is created under the
  current working directory by default.}

  \item{isOverwrite}{rewrite exiting files if the directory
  name matches. FALSE by default.}

  \item{supportRIGHT}{allow inserting Google AdSense to
  support further development of RIGHT. Use
  \code{\link{options}} and \code{\link{getOption}} to set
  and retrieve global option supportRIGHT.}
}
\description{
  Entry Function for RIGHT
}
\examples{
library(ggplot2)

set.seed(123456)

subArray <- diamonds[sample(1:nrow(diamonds), 1000, TRUE), ]
fitObj <- loess(price ~ carat, subArray)
xRange <- range(subArray$carat)
fitArray <- data.frame(carat = seq(xRange[1], xRange[2], length.out = 100))
fitArray$price <- predict(fitObj, newdata = fitArray)

\donttest{
obj <- RIGHT({plot(price ~ carat, subArray, type = "p", color = "color")
              lines(price ~ carat, fitArray)
              hist(color, subArray, color = "cut")
              boxplot(price ~ color, subArray)
              pie(cut, subArray)
              search(subArray)
              table(subArray)})
print(obj)
}
}

