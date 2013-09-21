context("Test lines_RIGHT.R")

## ---
## Test lines_RIGHT():
## ---

setRIGHT(libDir_RIGHT = ".",
         nameArray = "Theoph",
         numAxis = 0,
         numLines = 0,
         sourceArray = c(),
         scriptArray = c())

test_that("There should be an axis to use lines_RIGHT()", {

  expect_error(lines_RIGHT(conc ~ Time, Theoph)) 
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numLines, 0)

}) # test_that

setRIGHT(numAxis = 1)

test_that("data.frame object should exist", {
  
  expect_error(lines_RIGHT(conc ~ Time, dummy))
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numLines, 0)

}) # test_that

test_that("Column names should exist", {
  
  expect_error(lines_RIGHT(conc1 ~ Time, Thoeph))
  expect_error(lines_RIGHT(conc ~ Time1, Thoeph))
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numLines, 0)

}) # test_that

test_that("Check script generation", {
  
  lines_RIGHT(conc ~ Time, Theoph)
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numLines, 1)
  expect_identical(temp$scriptArray, 
                   c("var lineObj1 = new MakeLineObj(Theoph, 'Time', 'conc');",
                     "var line1 = new Line(axis1, lineObj1, 'x1', 'x2', 'y1', 'y2', {});"))
  expect_true(any(file.path(temp$libDir_RIGHT, "line.js") %in% temp$sourceArray))
  
  lines_RIGHT(conc ~ Time, "Theoph")
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numLines, 2)
  expect_identical(temp$scriptArray, c("var lineObj1 = new MakeLineObj(Theoph, 'Time', 'conc');",
                                       "var line1 = new Line(axis1, lineObj1, 'x1', 'x2', 'y1', 'y2', {});",
                                       "var lineObj2 = new MakeLineObj(Theoph, 'Time', 'conc');",
                                       "var line2 = new Line(axis1, lineObj2, 'x1', 'x2', 'y1', 'y2', {});"))
  expect_true(any(file.path(temp$libDir_RIGHT, "line.js") %in% temp$sourceArray))

}) # test_that
