\name{RIGHT}
\alias{RIGHT}
\title{Entry Function for RIGHT}
\usage{
  RIGHT(expr = { }, ...,
    title = "RIGHT: R Interactive Graphics via HTml",
    dir = tempfile(tmpdir = getwd()), isOverwrite = FALSE,
    supportRIGHT = getOption("supportRIGHT"))
}
\arguments{
  \item{expr}{plotting expression to evaluate}

  \item{...}{data.frame objects used in \code{expr}.}

  \item{title}{title of the visualization. The default
  value is "RIGHT: R Interactive Graphics via HTml."}

  \item{dir}{directory name to store files used for the
  visualization. Temporary directory is created under the
  current working directory by default.}

  \item{isOverwrite}{rewrite exiting files if the directory
  name matches. FALSE by default.}

  \item{supportRIGHT}{allow inserting Google AdSense to
  support further development of RIGHT. Use
  \code{\link{options}} and \code{\link{getOption}} to set
  and retrieve global option supportRIGHT.}
}
\description{
  Entry Function for RIGHT
}

