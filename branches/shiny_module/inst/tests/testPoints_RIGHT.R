## ---
## Test points_RIGHT():
## ---

.RIGHT <- list2env(list(libDir = ".",
                        nameArray = "Theoph",
                        numAxis = 0,
                        numPoints = 0,
                        sourceArray = c(),
                        scriptArray = c()))

# CHECK (junghoon): is there a way to check the error message?

# No exis:
expect_error(points_RIGHT(conc ~ Time, Theoph)) 
expect_identical(.RIGHT$numPoints, 0)

# dummy does not exists:
.RIGHT$numAxis <- 1
expect_error(points_RIGHT(conc ~ Time, dummy))
expect_identical(.RIGHT$numPoints, 0)

# Check column names:
expect_error(points_RIGHT(conc1 ~ Time, Thoeph))
expect_error(points_RIGHT(conc ~ Time1, Thoeph))
expect_identical(.RIGHT$numPoints, 0)

points_RIGHT(conc ~ Time, Theoph)
expect_identical(.RIGHT$numPoints, 1)
expect_identical(.RIGHT$scriptArray, "var points1 = new Dots(axis1, Theoph, 'Time', 'conc', {});")
expect_true(any(file.path(.RIGHT$libDir, "dot.js") %in% .RIGHT$sourceArray))

points_RIGHT(conc ~ Time, "Theoph")
expect_identical(.RIGHT$numPoints, 2)
expect_identical(.RIGHT$scriptArray, c("var points1 = new Dots(axis1, Theoph, 'Time', 'conc', {});",
                                       "var points2 = new Dots(axis1, Theoph, 'Time', 'conc', {});"))
expect_true(any(file.path(.RIGHT$libDir, "dot.js") %in% .RIGHT$sourceArray))
