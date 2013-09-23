\name{boxplot_RIGHT}
\alias{boxplot_RIGHT}
\title{Box-whisker}
\usage{
  boxplot_RIGHT(form, data, col = "black")
}
\arguments{
  \item{form}{a formula describing the x and y variables as
  y ~ x.}

  \item{data}{a data.frame object.}

  \item{col}{color of the boxes. The default is black.}
}
\description{
  Draw a box-whisker of the given data values.
}
\examples{
\donttest{obj <- RIGHT(boxplot(Subject, Theoph), Theoph)}
\donttest{print(obj)}
}
\seealso{
  \code{\link{boxplot}}
}

