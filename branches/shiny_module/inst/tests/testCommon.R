
## ---
## Check checkDataName():
## ---

assign(".RIGHT", list2env(list(nameArray = "Theoph")), envir = asNamespace("RIGHT"))

expect_error(checkDataName("dummy"))
checkDataName("Theoph")

## ---
## Check checkFormula_xy():
## ---

expect_error(checkFormula_xy(~ x))
expect_error(checkFormula_xy(~ x + y))
expect_error(checkFormula_xy(z ~ x + y))
expect_error(checkFormula_xy(z ~ y ~ x))

expect_identical(checkFormula_xy(y ~ x), list(x = "x", y = "y"))

## ---
## Check checkFormula_x():
## ---

expect_error(checkFormula_x(y ~ x))
expect_error(checkFormula_x(~x + y))
expect_error(checkFormula_x(z ~ x ~ y))

expect_identical(checkFormula_x(~ x), list(x = "x"))
expect_identical(checkFormula_x(. ~ x), list(x = "x"))

## ---
## Check checkAxisName():
## ---

expect_error(checkAxisName("dummy", Theoph))
checkAxisName("conc", Theoph)

## ---
## Check createArray():
## ---

# CHECK (junghoon): how to check expression?
expect_error(createArray(list(a = 1, 2, 3)))
expect_error(createArray(y ~ x))

expect_identical(createArray(), NULL)
expect_identical(createArray(c()), NULL)
expect_identical(createArray(alwaysArray = FALSE), NULL)
expect_identical(createArray(alwaysArray = TRUE), "[]")
expect_identical(createArray(c(), FALSE), NULL)
expect_identical(createArray(c(), TRUE), "[]")

expect_identical(createArray(1), "1")
expect_identical(createArray(1, FALSE), "1")
expect_identical(createArray(1, TRUE), "[1]")

expect_identical(createArray(c(1, 2, 3)), "[1, 2, 3]")
expect_identical(createArray(c(1, 2, 3), FALSE), "[1, 2, 3]")
expect_identical(createArray(c(1, 2, 3), TRUE), "[1, 2, 3]")

expect_identical(createArray(c("a", "B", "C")), "[a, B, C]")
expect_identical(createArray(c(TRUE, FALSE, TRUE)), "[true, false, true]")
expect_identical(createArray(c(F, T, F)), "[false, true, false]")
expect_identical(createArray(as.factor(c(1, 2, 3))), "[1, 2, 3]")

## ---
## Check createObject():
## ---

# fieldList should be a list object:
expect_error(createObject(fieldList = 1)) 
expect_error(createObject(fieldList = c(1, 2, 3)))

# Error due to no name:
expect_error(createObject(1)) 
expect_error(createObject(fieldList = list(1))) 
expect_error(createObject(a = 1, fieldList = list(2))) 
expect_error(createObject(1, fieldList = list(b = 2)))

# Same name is repeated:
expect_error(createObject(a = 1, fieldList = list(a = 1, b = 2)))

expect_identical(createObject(), NULL)
expect_identical(createObject(alwaysObject = FALSE), NULL)
expect_identical(createObject(alwaysObject = TRUE), "{}")

expect_identical(createObject(a = 1, b = list()), "{a: 1}")
expect_identical(createObject(a = 1, b = list(), alwaysObject = FALSE), "{a: 1}")
expect_identical(createObject(a = 1, b = list(), alwaysObject = TRUE), "{a: 1, b: {}}")

expect_identical(createObject(a = 1), "{a: 1}")
expect_identical(createObject(a = 1, alwaysArray = FALSE), "{a: 1}")
expect_identical(createObject(a = 1, alwaysArray = TRUE), "{a: [1]}")

expect_identical(createObject(a = 1, b = list(c = 1)), "{a: 1, b: {c: 1}}")
expect_identical(createObject(a = 1, b = list(c = 1), alwaysArray = FALSE), "{a: 1, b: {c: 1}}")
expect_identical(createObject(a = 1, b = list(c = 1), alwaysArray = TRUE), "{a: [1], b: {c: [1]}}")

expect_identical(createObject(a = c(1, 2, 3), fieldList = list(b = c(4, 5, 6))), "{a: [1, 2, 3], b: [4, 5, 6]}")
expect_identical(createObject(a = c(1, 2, 3), b = list(c = c(4, 5, 6))), "{a: [1, 2, 3], b: {c: [4, 5, 6]}}")

# Check the use of createArray:
expect_identical(createObject(a = c("a", "B", "C")), "{a: [a, B, C]}")
expect_identical(createObject(a = c(TRUE, FALSE, TRUE)), "{a: [true, false, true]}")
expect_identical(createObject(a = c(F, T, F)), "{a: [false, true, false]}")
expect_identical(createObject(a = as.factor(c(1, 2, 3))), "{a: [1, 2, 3]}")
