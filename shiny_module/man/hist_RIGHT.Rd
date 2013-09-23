\name{hist_RIGHT}
\alias{hist_RIGHT}
\title{Histograms}
\usage{
  hist_RIGHT(x, data)
}
\arguments{
  \item{x}{variable name for which the histogram is
  desired.}

  \item{data}{a data.frame object.}
}
\description{
  Draw a histogram of the given data values.
}
\examples{
\donttest{obj <- RIGHT(hist(Subject, Theoph), Theoph)}
\donttest{print(obj)}
}
\seealso{
  \code{\link{hist}}
}

