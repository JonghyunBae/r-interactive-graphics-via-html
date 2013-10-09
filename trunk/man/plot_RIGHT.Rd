\name{plot_RIGHT}
\alias{plot_RIGHT}
\title{X-Y Plotting}
\usage{
  plot_RIGHT(form, data, type = "b", color = NULL,
    isString = FALSE)
}
\arguments{
  \item{form}{a formula describing the x and y variables as
  y ~ x.}

  \item{data}{a data.frame object.}

  \item{type}{the type of plot. Currently, only "n", "b",
  "p", "l" are supported. See \code{\link{plot}} for more
  details.}

  \item{color}{column used to define the colors used to
  fill the bars. Default is NULL.}

  \item{isString}{a character is expected for \code{data}
  and \code{color} if \code{TRUE}. It is useful for
  programming.}
}
\description{
  Function to create x-y scatter and line plots, including
  the axis.
}
\examples{
\donttest{
obj <- RIGHT(plot(conc ~ Time, Theoph, type = "b", color = Subject))
print(obj)
}
}
\seealso{
  \code{\link{plot}}
}

