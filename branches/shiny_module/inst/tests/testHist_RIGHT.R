## ---
## Test hist_RIGHT():
## ---

assign(".RIGHT", list2env(list(libDir_RIGHT = ".", 
                               nameArray = "Theoph",
                               divArray = c(),
                               scriptArray = c(),
                               numAxis = 0,
                               numHist = 0)), envir = asNamespace("RIGHT"))

# dummy does not exists:
expect_error(hist_RIGHT(Subject, dummy))
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 0)
expect_identical(temp$numHist, 0)

# Check column names:
expect_error(hist_RIGHT(Subject1, Thoeph))
# expect_error(hist_RIGHT(char("Subject1"), Thoeph)) # CHECK (junghoon)
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 0)
expect_identical(temp$numHist, 0)

hist_RIGHT(Subject, Theoph)
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 1)
expect_identical(temp$numHist, 1)
expect_identical(temp$divArray, '<div id="container1" oncontextmenu="return false;"></div>')
expect_identical(temp$scriptArray, 
                 c("var histObj1 = new ddply(Theoph, ['Subject'], {});",
                   "var axis1 = new Axis(1, histObj1, 'Subject', 'frequency', {legend: 'Subject'});",
                   "var hist1 = new Bar(axis1, histObj1, 'Subject', 'frequency', {});"))
expect_true(any(file.path(temp$libDir_RIGHT, "bar.js") %in% temp$sourceArray))
