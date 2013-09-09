## Script to test head.R

source("R/head.R")

## ---
## Test sourcing related functions:
## ---

.RIGHT <- list2env(list(sourceArray = c()))
expect_identical(.RIGHT$sourceArray , c())

addSource("common.js")
expect_identical(.RIGHT$sourceArray, "common.js")

addSource()
expect_identical(.RIGHT$sourceArray, "common.js")

addSource(c("structure.js", "event.js"))
expect_identical(.RIGHT$sourceArray, c("common.js", "structure.js", "event.js"))

# Repeated values are allowed:
addSource("common.js")
expect_identical(.RIGHT$sourceArray, c("common.js", "structure.js", "event.js", "common.js"))

expect_error(addSource(1))

expect_identical(createSource(), NULL)
expect_identical(createSource(c()), NULL)
expect_identical(createSource(c("A", "B", "", "A")),
                 c('<script src="A" type="text/javascript"></script>',
                   '<script src="B" type="text/javascript"></script>'))

## ---
## Test linking related functions:
## ---

.RIGHT <- list2env(list(linkArray = c()))
expect_identical(.RIGHT$linkArray , c())

addLink("shared/shiny.css")
expect_identical(.RIGHT$linkArray, "shared/shiny.css")

addLink()
expect_identical(.RIGHT$linkArray, "shared/shiny.css")

addLink(c("right.css", "shared/slider/css/jquery.slider.min.css"))
expect_identical(.RIGHT$linkArray, c("shared/shiny.css", "right.css", "shared/slider/css/jquery.slider.min.css"))

# Repeated values are allowed:
addLink("right.css")
expect_identical(.RIGHT$linkArray, c("shared/shiny.css", "right.css", "shared/slider/css/jquery.slider.min.css", "right.css"))

expect_error(addLink(1))

expect_identical(createLink(), NULL)
expect_identical(createLink(c()), NULL)
expect_identical(createLink(c("A", "B", "", "A")),
                 c('<link rel="stylesheet" type="text/css" href="A"/>',
                   '<link rel="stylesheet" type="text/css" href="B"/>'))

## ---
## Test createHead():
## ---

.RIGHT <- list2env(list(linkArray = c(),
                     sourceArray = c()))

expect_identical(createHead("NOTHING & EMPTY"),
                 c("<head>",
                   "",
                   '  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>',
                   "",
                   "  <title>NOTHING &amp; EMPTY</title>", 
                   "",
                   "</head>"))

.RIGHT$linkArray <- "right.css"
expect_identical(createHead("LINK' GIVEN"),
                 c("<head>",
                   "",
                   '  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>',
                   "",
                   '  <link rel="stylesheet" type="text/css" href="right.css"/>',
                   "",
                   "  <title>LINK&#39; GIVEN</title>", 
                   "",
                   "</head>"))

.RIGHT$sourceArray <- "common.js"
expect_identical(createHead("BOTH GIVEN"),
                 c("<head>",
                   "",
                   '  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>',
                   "",
                   '  <link rel="stylesheet" type="text/css" href="right.css"/>',
                   "",
                   "  <title>BOTH GIVEN</title>", 
                   "",
                   '  <script src="common.js" type="text/javascript"></script>',
                   "",
                   "</head>"))
