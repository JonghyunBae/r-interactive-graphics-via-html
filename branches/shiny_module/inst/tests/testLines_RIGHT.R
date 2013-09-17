## ---
## Test lines_RIGHT():
## ---

assign(".RIGHT", list2env(list(libDir = ".",
                               nameArray = "Theoph",
                               numAxis = 0,
                               numLines = 0,
                               sourceArray = c(),
                               scriptArray = c())), envir = asNamespace("RIGHT"))
       
# No axis:
expect_error(lines_RIGHT(conc ~ Time, Theoph)) 
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numLines, 0)

# dummy does not exists:
assign(".RIGHT", list2env(list(libDir = ".",
                               nameArray = "Theoph",
                               numAxis = 1,
                               numLines = 0,
                               sourceArray = c(),
                               scriptArray = c())), envir = asNamespace("RIGHT"))

expect_error(lines_RIGHT(conc ~ Time, dummy))
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numLines, 0)

# Check column names:
expect_error(lines_RIGHT(conc1 ~ Time, Thoeph))
expect_error(lines_RIGHT(conc ~ Time1, Thoeph))
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$numLines, 0)

lines_RIGHT(conc ~ Time, Theoph)
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numLines, 1)
expect_identical(temp$scriptArray, "var lines1 = new Line(axis1, Theoph, 'Time', 'conc', {});")
expect_true(any(file.path(temp$libDir, "line.js") %in% temp$sourceArray))

lines_RIGHT(conc ~ Time, "Theoph")
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numLines, 2)
expect_identical(temp$scriptArray, c("var lines1 = new Line(axis1, Theoph, 'Time', 'conc', {});",
                                     "var lines2 = new Line(axis1, Theoph, 'Time', 'conc', {});"))
expect_true(any(file.path(temp$libDir, "line.js") %in% temp$sourceArray))
