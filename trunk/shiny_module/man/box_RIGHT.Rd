\name{box_RIGHT}
\alias{box_RIGHT}
\title{Box-whisker}
\usage{
  hist_RIGHT(x, data)
}
\arguments{
  \item{x}{variable name for which the box-whisker is
  desired.}

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

