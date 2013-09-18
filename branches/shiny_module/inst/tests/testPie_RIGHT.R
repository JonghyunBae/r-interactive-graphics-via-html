## ---
## Test pie_RIGHT():
## ---

assign(".RIGHT", list2env(list(nameArray = "Theoph",
                               divArray = c(),
                               scriptArray = c(),
                               numAxis = 0,
                               numPie = 0)), envir = asNamespace("RIGHT"))

# dummy does not exists:
expect_error(pie_RIGHT(Subject, dummy))
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 0)
expect_identical(temp$numPie, 0)

# Check column names:
expect_error(pie_RIGHT(Subject1, Thoeph))
# expect_error(pie_RIGHT(char("Subject1"), Thoeph)) # CHECK (junghoon)
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 0)
expect_identical(temp$numPie, 0)

pie_RIGHT(Subject, Theoph)
temp <- get(".RIGHT", envir = asNamespace("RIGHT"))
expect_identical(temp$numAxis, 1)
expect_identical(temp$numPie, 1)
expect_identical(temp$divArray, '<div id="container1" oncontextmenu="return false;"></div>')
expect_identical(temp$scriptArray, 
                 c("var pieObj1 = new ddply(Theoph, ['Subject'], {});",
                   "var axis1 = new Axis(1, pieObj1, 'Subject', 'Subject', {legend: 'Subject'});",
                   "var pie1 = new Pie(axis1, pieObj1, 'Subject', 'frequency', {});"))
