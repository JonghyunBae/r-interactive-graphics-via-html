## ---
## Test points_RIGHT():
## ---

assign(".RIGHT", list2env(list(libDir = ".",
                               nameArray = "Theoph",
                               numAxis = 0,
                               numPoints = 0,
                               sourceArray = c(),
                               scriptArray = c())), envir = asNamespace("RIGHT"))
       
# CHECK (junghoon): is there a way to check the error message?

# No exis:
expect_error(points_RIGHT(conc ~ Time, Theoph)) 
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numPoints, 0)

# dummy does not exists:
assign(".RIGHT", list2env(list(libDir = ".",
                               nameArray = "Theoph",
                               numAxis = 1,
                               numPoints = 0,
                               sourceArray = c(),
                               scriptArray = c())), envir = asNamespace("RIGHT"))

expect_error(points_RIGHT(conc ~ Time, dummy))
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numPoints, 0)

# Check column names:
expect_error(points_RIGHT(conc1 ~ Time, Thoeph))
expect_error(points_RIGHT(conc ~ Time1, Thoeph))
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numPoints, 0)

points_RIGHT(conc ~ Time, Theoph)
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numPoints, 1)
expect_identical(temp$scriptArray, "var points1 = new Dots(axis1, Theoph, 'Time', 'conc', {});")
expect_true(any(file.path(temp$libDir, "dot.js") %in% temp$sourceArray))

points_RIGHT(conc ~ Time, "Theoph")
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numPoints, 2)
expect_identical(temp$scriptArray, c("var points1 = new Dots(axis1, Theoph, 'Time', 'conc', {});",
                                       "var points2 = new Dots(axis1, Theoph, 'Time', 'conc', {});"))
expect_true(any(file.path(temp$libDir, "dot.js") %in% temp$sourceArray))
