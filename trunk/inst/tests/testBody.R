context("Test body.R")

## ---
## Test addBlankLine():
## ---

setRIGHT(scriptArray = c("LINE"))

test_that("Test blank line insertion", {
  
  appendBlankLine()
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, c("LINE", 
                                                                              ""))
  
  appendBlankLine(2)
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, c("LINE", 
                                                                              rep("", 3)))
  
  prependBlankLine()
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, c("", 
                                                                              "LINE", 
                                                                              rep("", 3)))

  prependBlankLine(2)
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, c(rep("", 3), 
                                                                              "LINE", 
                                                                              rep("", 3)))
  
}) # test_that

## ---
## Test prepareData():
## ---

A <- data.frame(ID = 1:10, NAME = letters[1:10])
B <- data.frame(VALUE = 1:5)

test_that("Check whether data.frame objects are properly saved", {
  
  prepareData(list(A = A, B = B))
  expect_true(file.exists("data.js"))
  
}) # test_that

test_that("Check whether data.frame objects can be saved in another directory", {
  
  dir.create("TEMP")
  prepareData(list(A = A), "TEMP")  
  expect_true(file.exists(file.path("TEMP", "data.js")))
  
  unlink("TEMP", recursive = TRUE)
  
}) # test_that

## ---
## Test loadData():
## ---

setRIGHT(scriptArray = c())

test_that("Test script generation for loading data", {
  
  loadData("A")
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, 
                   paste0('A = createMainStructureE(rawArr1);'))
  
  loadData()
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, 
                   paste0('A = createMainStructureE(rawArr1);'))
  
  expect_error(loadData(c("B", "C"), "data.js"))
  
  loadData(c("B", "C"))
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, 
                   c(paste0('C = createMainStructureE(rawArr2);'),
                     paste0('B = createMainStructureE(rawArr1);'),
                     paste0('A = createMainStructureE(rawArr1);')))      
}) # test_that

## ---
## Test addEventTrigger():
## ---

setRIGHT(scriptArray = c())

test_that("Test event trigger script generation", {
  
  addEventTrigger()
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, c())
  
  addEventTrigger(0)
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, c())
  
  addEventTrigger(1)
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, 
                   "var AllAxisObjArr = [axis1]; eventTrigger(AllAxisObjArr);")
  
  addEventTrigger(3)
  expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, 
                   c("var AllAxisObjArr = [axis1]; eventTrigger(AllAxisObjArr);", 
                     "var AllAxisObjArr = [axis1, axis2, axis3]; eventTrigger(AllAxisObjArr);"))
  
}) # test_that

## ---
## Test createDiv():
## ---

test_that("Test div block generation:", {
  
  expect_identical(createDiv(), NULL)
  expect_identical(createDiv(c()), NULL)
  expect_identical(createDiv(c("A", "B")),
                   c('<div id="content" class="right-output">',
                     "  A",
                     "  B",
                     "</div>"))
  
}) # test_that

## ---
## Test createScript():
## ---

test_that("Test script block generation", {
  
  expect_identical(createScript(), NULL)
  expect_identical(createScript(c()), NULL)
  expect_identical(createScript(c("A", "B")),
                   c("<script>",
                     "  A",
                     "  B",
                     "</script>"))
  
}) # test_that

## ---
## Test createBody():
## ---

setRIGHT(divArray = c(),
         scriptArray = c())

test_that("Check body block generation", {
  
  expect_identical(createBody(),
                   c("<body>",
                     "",
                     '  <div id="footer">',
                     '  <p id="copyright">&copy; 2013 - <a href="#">The RIGHT team</a></p>',
                     '  <p id="dont-delete-this">E-mail : <a href="mailto:right-user@googlegroups.com">right-user@googlegroups.com</a></p>',
                     "  </div>",
                     "",
                     "</body>"))
  
  setRIGHT(divArray = c("A", "B"),
           scriptArray = c())
  
  expect_identical(createBody(),
                   c("<body>",
                     "",
                     '  <div id="content" class="right-output">',
                     "    A",
                     "    B",
                     "  </div>",
                     "",
                     '  <div id="footer">',
                     '  <p id="copyright">&copy; 2013 - <a href="#">The RIGHT team</a></p>',
                     '  <p id="dont-delete-this">E-mail : <a href="mailto:right-user@googlegroups.com">right-user@googlegroups.com</a></p>',
                     "  </div>",
                     "",
                     "</body>"))
  
  setRIGHT(divArray = c("A", "B"),
           scriptArray = c("C", "D"))
  
  expect_identical(createBody(),
                   c("<body>",
                     "",
                     '  <div id="content" class="right-output">',
                     "    A",
                     "    B",
                     "  </div>",
                     "",
                     "  <script>",
                     "    C",
                     "    D",
                     "  </script>",
                     "",
                     '  <div id="footer">',
                     '  <p id="copyright">&copy; 2013 - <a href="#">The RIGHT team</a></p>',
                     '  <p id="dont-delete-this">E-mail : <a href="mailto:right-user@googlegroups.com">right-user@googlegroups.com</a></p>',
                     "  </div>",
                     "",
                     "</body>"))
  
}) # test_that