\name{box_RIGHT}
\alias{box_RIGHT}
\title{Box-whisker}
\usage{
  box_RIGHT(form, data)
}
\arguments{
  \item{form}{a formula describing the x and y variables as
  y ~ x.}

  \item{data}{a data.frame object.}
}
\description{
  Draw a box-whisker of the given data values.
}
\examples{
obj <- RIGHT(box(conc ~ Subject, Theoph), Theoph)
\donttest{print(obj)}
\dontshow{cleanup(obj)}
}

