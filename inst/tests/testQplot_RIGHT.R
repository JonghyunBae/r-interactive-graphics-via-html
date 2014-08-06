context("Test qplot_RIGHT.R")

## ---
## Test qplot_RIGHT():
## ---

test_that("Check returned object from qplot_RIGHT()", {
  
  expect_error(qplot_RIGHT(dummy)) 
  
  obj <- qplot_RIGHT(x=conc, y=Time, data=Theoph)
  
  expect_identical(obj$labels$x, "conc")
  expect_identical(obj$labels$y, "Time")
  expect_identical(attr(obj, "NAME"), "Theoph")
  expect_identical(as.list(as.list(obj$layers[[1]])$geom)$objname, "point")
  
  obj <- qplot_RIGHT(x=Wt, y=Dose, colour=Subject, data=Theoph)
  
  expect_identical(obj$labels$x, "Wt")
  expect_identical(obj$labels$y, "Dose")
  expect_identical(obj$labels$colour, "Subject")
  expect_identical(attr(obj, "NAME"), "Theoph")
  expect_identical(as.list(as.list(obj$layers[[1]])$geom)$objname, "point")
  
  obj <- qplot_RIGHT(x=conc, fill=Subject, data=Theoph, geom="bar")
  
  expect_identical(obj$labels$x, "conc")
  expect_identical(obj$labels$fill, "Subject")
  expect_identical(attr(obj, "NAME"), "Theoph")
  expect_identical(as.list(as.list(obj$layers[[1]])$geom)$objname, "bar")
}) # test_that