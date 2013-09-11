## ---
## Test plot_RIGHT():
## ---

.RIGHT <- list2env(list(nameArray = "Theoph",
                        divArray = c(),
                        scriptArray = c(),
                        numAxis = 0,
                        numPoints = 0))

# dummy does not exists:
expect_error(plot_RIGHT(conc ~ Time, dummy, type = "n"))
expect_identical(.RIGHT$numAxis, 0)

# Check column names:
expect_error(points_RIGHT(conc1 ~ Time, Thoeph, type = "n"))
expect_error(points_RIGHT(conc ~ Time1, Thoeph, type = "n"))
expect_identical(.RIGHT$numAxis, 0)

# Test default value for type:
plot_RIGHT(conc ~ Time, Theoph)
expect_identical(.RIGHT$numAxis, 1)
expect_identical(.RIGHT$divArray, '<div id="container1" oncontextmenu="return false;"></div>')
expect_identical(.RIGHT$scriptArray, "var axis1 = new Axis(1, Theoph, 'Time', 'conc', {});")

plot_RIGHT(conc ~ Time, Theoph, type = "n")
expect_identical(.RIGHT$numAxis, 2)
expect_identical(.RIGHT$divArray, c('<div id="container1" oncontextmenu="return false;"></div>', 
                                    '<div id="container2" oncontextmenu="return false;"></div>'))
expect_identical(.RIGHT$scriptArray, c("var axis1 = new Axis(1, Theoph, 'Time', 'conc', {});", 
                                       "var axis2 = new Axis(2, Theoph, 'Time', 'conc', {});"))

plot_RIGHT(conc ~ Time, Theoph, type = "p")
expect_identical(.RIGHT$numAxis, 3)
expect_identical(.RIGHT$divArray, c('<div id="container1" oncontextmenu="return false;"></div>', 
                                    '<div id="container2" oncontextmenu="return false;"></div>',
                                    '<div id="container3" oncontextmenu="return false;"></div>'))
expect_identical(.RIGHT$scriptArray, c("var axis1 = new Axis(1, Theoph, 'Time', 'conc', {});", 
                                       "var axis2 = new Axis(2, Theoph, 'Time', 'conc', {});",
                                       "var axis3 = new Axis(3, Theoph, 'Time', 'conc', {});",
                                       "var points1 = new Dots(axis3, Theoph, 'Time', 'conc', {});"))
