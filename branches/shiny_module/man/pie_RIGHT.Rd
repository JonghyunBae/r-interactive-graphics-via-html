\name{pie_RIGHT}
\alias{pie_RIGHT}
\title{Pie Charts}
\usage{
  pie_RIGHT(x, data)
}
\arguments{
  \item{x}{variable name for which the histogram is
  desired.}

  \item{data}{a data.frame object.}
}
\description{
  Draw a pie chart.
}
\examples{
obj <- RIGHT(pie(Subject, Theoph), Theoph)
\donttest{print(obj)}
\dontshow{cleanup(obj)}
}

