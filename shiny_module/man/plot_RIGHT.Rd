\name{plot_RIGHT}
\alias{plot_RIGHT}
\title{X-Y Plotting}
\usage{
  plot_RIGHT(form, data, type = "b")
}
\arguments{
  \item{form}{a formula describing the x and y variables as
  y ~ x.}

  \item{data}{a data.frame object.}

  \item{type}{the type of plot. Currently, only "n", "b",
  "p", "l" are supported. See \code{\link{plot}} for more
  details.}
}
\description{
  Function to create x-y scatter and line plots, including
  the axis.
}
\examples{
obj <- RIGHT(plot(conc ~ Time, Theoph, type = "b"), Theoph)
\donttest{print(obj)}
\dontshow{cleanup(obj)}
}

