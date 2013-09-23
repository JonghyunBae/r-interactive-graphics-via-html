\name{lines_RIGHT}
\alias{lines_RIGHT}
\title{Add Lines to a Plot}
\usage{
  lines_RIGHT(form, data, col = NULL)
}
\arguments{
  \item{form}{a formula describing the x and y variables as
  y ~ x.}

  \item{data}{a data.frame object.}

  \item{col}{color of the boxes.}
}
\description{
  lines_RIGHT draws a sequence of points in the current
  axis.
}
\examples{
\donttest{obj <- RIGHT({plot(conc ~ Time, Theoph, type = "n") # create blank axis
              lines(conc ~ Time, Theoph)}, Theoph)}
\donttest{print(obj)}
}
\seealso{
  \code{\link{lines}}
}

