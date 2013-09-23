context("Test boxplot_RIGHT.R")

setRIGHT(libDir_RIGHT = ".", 
         nameArray = "Theoph",
         divArray = c(),
         scriptArray = c(),
         numAxis = 0,
         numBox = 0)

test_that("data.frame object should exist", {
  
  expect_error(boxplot_RIGHT(conc ~ Subject, dummy))
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numAxis, 0)
  expect_identical(temp$numBox, 0)
  
}) # test_that

test_that("Column name should exist", {
  
  expect_error(boxplot_RIGHT(conc1 ~ Subject1, Thoeph))
  # expect_error(boxplot_RIGHT(char("conc1 ~ Subject1"), Thoeph)) # CHECK (junghoon)
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numAxis, 0)
  expect_identical(temp$numBox, 0)
  
}) # test_that

test_that("Check script generation", {
  
  boxplot_RIGHT(conc ~ Subject, Theoph)
  temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
  expect_identical(temp$numAxis, 1)
  expect_identical(temp$numBox, 1)
  expect_identical(temp$divArray, '<div id="container1" oncontextmenu="return false;"></div>')
  expect_identical(temp$scriptArray, 
                   c("var boxObj1 = new MakeBoxObj(Theoph, 'Subject', 'conc', {});",
                     "var axis1 = new Axis(1, boxObj1, 'Subject', 'conc', {});",
                     "var box1 = new Box(axis1, boxObj1, {});"))
  expect_true(any(file.path(temp$libDir_RIGHT, "box.js") %in% temp$sourceArray))
  
}) # test_that
