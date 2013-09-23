context("Test pie_RIGHT.R")

setRIGHT(libDir_RIGHT = ".",
         nameArray = "Theoph",
         divArray = c(),
         scriptArray = c(),
         numAxis = 0,
         numPie = 0)

test_that("data.frame object should exist", {
  
  expect_error(pie_RIGHT(Subject, dummy))
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numAxis, 0)
  expect_identical(temp$numPie, 0)
  
}) # test_that

test_that("Column name should exist", {
  
  expect_error(pie_RIGHT(Subject1, Thoeph))
  # expect_error(pie_RIGHT(char("Subject1"), Thoeph)) # CHECK (junghoon)
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numAxis, 0)
  expect_identical(temp$numPie, 0)
  
}) # test_that

test_that("Check script generation", {
  
  pie_RIGHT(Subject, Theoph)
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numAxis, 1)
  expect_identical(temp$numPie, 1)
  expect_identical(temp$divArray, '<div id="container1" oncontextmenu="return false;"></div>')
  expect_identical(temp$scriptArray, 
                   c("var pieObj1 = new ddply(Theoph, ['Subject'], {});",
                     "var axis1 = new Axis(1, pieObj1, 'Subject', 'frequency', {legend: 'Subject'});",
                     "var pie1 = new Pie(axis1, pieObj1, 'Subject', 'frequency', {});"))
  expect_true(any(file.path(temp$libDir_RIGHT, "pie.js") %in% temp$sourceArray))
  
}) # test_that