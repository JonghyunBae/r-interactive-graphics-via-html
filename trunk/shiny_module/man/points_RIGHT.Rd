\name{points_RIGHT}
\alias{points_RIGHT}
\title{Add Points to a Plot}
\usage{
  points_RIGHT(form, data)
}
\arguments{
  \item{form}{a formula describing the x and y variables as
  y ~ x.}

  \item{data}{a data.frame object.}
}
\description{
  points_RIGHT draws a sequence of points in the current
  axis.
}
\examples{
obj <- RIGHT({plot(conc ~ Time, Theoph, type = "n") # create blank axis
              points(conc ~ Time, Theoph)}, Theoph)
\donttest{print(obj)}
\dontshow{cleanup(obj)}
}

