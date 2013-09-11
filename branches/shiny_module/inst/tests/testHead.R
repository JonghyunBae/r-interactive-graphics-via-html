## Script to test head.R

## ---
## Test sourcing related functions:
## ---

assign(".RIGHT", list2env(list(sourceArray = c())), envir = asNamespace("RIGHT"))

addSource("common.js")
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$sourceArray, 
                 "common.js")

addSource()
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$sourceArray, 
                 "common.js")

addSource(c("structure.js", "event.js"))
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$sourceArray, 
                 c("common.js", "structure.js", "event.js"))

# Repeated values are allowed:
addSource("common.js")
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$sourceArray, 
                 c("common.js", "structure.js", "event.js", "common.js"))

expect_error(addSource(1))

expect_identical(createSource(), NULL)
expect_identical(createSource(c()), NULL)
expect_identical(createSource(c("A", "B", "", "A")),
                 c('<script src="A" type="text/javascript"></script>',
                   '<script src="B" type="text/javascript"></script>'))

## ---
## Test linking related functions:
## ---

assign(".RIGHT", list2env(list(linkArray = c())), envir = asNamespace("RIGHT"))
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$linkArray , 
                 c())

addLink("shared/shiny.css")
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$linkArray, 
                 "shared/shiny.css")

addLink()
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$linkArray, 
                 "shared/shiny.css")

addLink(c("right.css", "shared/slider/css/jquery.slider.min.css"))
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$linkArray, 
                 c("shared/shiny.css", "right.css", "shared/slider/css/jquery.slider.min.css"))

# Repeated values are allowed:
addLink("right.css")
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$linkArray, 
                 c("shared/shiny.css", "right.css", "shared/slider/css/jquery.slider.min.css", "right.css"))

expect_error(addLink(1))

expect_identical(createLink(), NULL)
expect_identical(createLink(c()), NULL)
expect_identical(createLink(c("A", "B", "", "A")),
                 c('<link rel="stylesheet" type="text/css" href="A"/>',
                   '<link rel="stylesheet" type="text/css" href="B"/>'))

## ---
## Test createHead():
## ---

assign(".RIGHT", list2env(list(linkArray = c(),
                               sourceArray = c())), envir = asNamespace("RIGHT"))

expect_identical(createHead("NOTHING & EMPTY"),
                 c("<head>",
                   "",
                   '  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>',
                   "",
                   "  <title>NOTHING &amp; EMPTY</title>", 
                   "",
                   "</head>"))

assign(".RIGHT", list2env(list(linkArray = "right.css",
                               sourceArray = c())), envir = asNamespace("RIGHT"))

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

assign(".RIGHT", list2env(list(linkArray = "right.css",
                               sourceArray = "common.js")), envir = asNamespace("RIGHT"))

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
