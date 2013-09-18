# CHECK (junghoon): check use of char().

## ---
## Test plot_RIGHT():
## ---

assign(".RIGHT", list2env(list(nameArray = "Theoph",
                               divArray = c(),
                               scriptArray = c(),
                               numAxis = 0,
                               numPoints = 0,
                               numLines = 0)), envir = asNamespace("RIGHT"))

# dummy does not exists:
expect_error(plot_RIGHT(conc ~ Time, dummy, type = "n"))
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 0)
expect_identical(temp$numPoints, 0)
expect_identical(temp$numLines, 0)

# Check column names:
expect_error(plot_RIGHT(conc1 ~ Time, Thoeph, type = "n"))
expect_error(plot_RIGHT(conc ~ Time1, Thoeph, type = "n"))
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 0)
expect_identical(temp$numPoints, 0)
expect_identical(temp$numLines, 0)

# CHECK (junghoon): should check default option?

plot_RIGHT(conc ~ Time, Theoph, type = "n")
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 1)
expect_identical(temp$numPoints, 0)
expect_identical(temp$numLines, 0)
expect_identical(temp$divArray, '<div id="container1" oncontextmenu="return false;"></div>')
expect_identical(temp$scriptArray, "var axis1 = new Axis(1, Theoph, 'Time', 'conc', {});")

plot_RIGHT(conc ~ Time, Theoph, type = "p")
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 2)
expect_identical(temp$numPoints, 1)
expect_identical(temp$numLines, 0)
expect_identical(temp$divArray, c('<div id="container1" oncontextmenu="return false;"></div>', 
                                  '<div id="container2" oncontextmenu="return false;"></div>'))
expect_identical(temp$scriptArray, c("var axis1 = new Axis(1, Theoph, 'Time', 'conc', {});", 
                                     "var axis2 = new Axis(2, Theoph, 'Time', 'conc', {});",
                                     "var point1 = new Dot(axis2, Theoph, 'Time', 'conc', {});"))

plot_RIGHT(conc ~ Time, Theoph, type = "l")
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 3)
expect_identical(temp$numPoints, 1)
expect_identical(temp$numLines, 1)
expect_identical(temp$divArray, c('<div id="container1" oncontextmenu="return false;"></div>', 
                                  '<div id="container2" oncontextmenu="return false;"></div>',
                                  '<div id="container3" oncontextmenu="return false;"></div>'))
expect_identical(temp$scriptArray, c("var axis1 = new Axis(1, Theoph, 'Time', 'conc', {});", 
                                     "var axis2 = new Axis(2, Theoph, 'Time', 'conc', {});",
                                     "var point1 = new Dot(axis2, Theoph, 'Time', 'conc', {});",
                                     "var axis3 = new Axis(3, Theoph, 'Time', 'conc', {});",
                                     "var lineObj1 = new MakeLineObj(Theoph);",
                                     "var line1 = new Line(axis3, lineObj1, 'Time', 'conc', {});"))

plot_RIGHT(conc ~ Time, Theoph, type = "b")
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 4)
expect_identical(temp$numPoints, 2)
expect_identical(temp$numLines, 2)
expect_identical(temp$divArray, c('<div id="container1" oncontextmenu="return false;"></div>', 
                                  '<div id="container2" oncontextmenu="return false;"></div>',
                                  '<div id="container3" oncontextmenu="return false;"></div>',
                                  '<div id="container4" oncontextmenu="return false;"></div>'))
expect_identical(temp$scriptArray, c("var axis1 = new Axis(1, Theoph, 'Time', 'conc', {});", 
                                     "var axis2 = new Axis(2, Theoph, 'Time', 'conc', {});",
                                     "var point1 = new Dot(axis2, Theoph, 'Time', 'conc', {});",
                                     "var axis3 = new Axis(3, Theoph, 'Time', 'conc', {});",
                                     "var lineObj1 = new MakeLineObj(Theoph);",
                                     "var line1 = new Line(axis3, lineObj1, 'Time', 'conc', {});",
                                     "var axis4 = new Axis(4, Theoph, 'Time', 'conc', {});",
                                     "var lineObj2 = new MakeLineObj(Theoph);",
                                     "var line2 = new Line(axis4, lineObj2, 'Time', 'conc', {});",
                                     "var point2 = new Dot(axis4, Theoph, 'Time', 'conc', {});"))
