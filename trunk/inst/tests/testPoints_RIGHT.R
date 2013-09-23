context("Test points_RIGHT.R")

# CHECK (junghoon): check use of char().

## ---
## Test points_RIGHT():
## ---

setRIGHT(libDir_RIGHT = ".",
         nameArray = "Theoph",
         numAxis = 0,
         numPoints = 0,
         sourceArray = c(),
         scriptArray = c())

# CHECK (junghoon): is there a way to check the error message?

test_that("There should be an axis to use points_RIGHT()", {
  
  expect_error(points_RIGHT(conc ~ Time, Theoph)) 
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numPoints, 0)
  
}) # test_that

setRIGHT(numAxis = 1)

test_that("data.frame object should exist", {
  
  expect_error(points_RIGHT(conc ~ Time, dummy))
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numPoints, 0)
  
}) # test_that

test_that("Column names should exist", {
  
  expect_error(points_RIGHT(conc1 ~ Time, Thoeph))
  expect_error(points_RIGHT(conc ~ Time1, Thoeph))
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numPoints, 0)
  
}) # test_that

test_that("Check script generation", {
  
  points_RIGHT(conc ~ Time, Theoph)
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numPoints, 1)
  expect_identical(temp$scriptArray, "var point1 = new Dot(axis1, Theoph, 'Time', 'conc', {});")
  expect_true(any(file.path(temp$libDir_RIGHT, "dot.js") %in% temp$sourceArray))
  
  points_RIGHT(conc ~ Time, "Theoph")
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numPoints, 2)
  expect_identical(temp$scriptArray, c("var point1 = new Dot(axis1, Theoph, 'Time', 'conc', {});",
                                       "var point2 = new Dot(axis1, Theoph, 'Time', 'conc', {});"))
  expect_true(any(file.path(temp$libDir_RIGHT, "dot.js") %in% temp$sourceArray))
  
}) # test_that
