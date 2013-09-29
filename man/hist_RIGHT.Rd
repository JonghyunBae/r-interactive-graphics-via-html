\name{hist_RIGHT}
\alias{hist_RIGHT}
\title{Histograms}
\usage{
  hist_RIGHT(x, data, color = NULL)
}
\arguments{
  \item{x}{variable name for which the histogram is
  desired.}

  \item{data}{a data.frame object.}

  \item{color}{column used to define the colors used to
  fill the bars. Default is NULL.}
}
\description{
  Draw a histogram of the given data values.
}
\examples{
\donttest{obj <- RIGHT(hist(Time, Theoph, color = "Subject"))}
\donttest{print(obj)}
}
\seealso{
  \code{\link{hist}}
}

