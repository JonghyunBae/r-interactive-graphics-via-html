
## ---
## Test addBlankLine():
## ---

# CHECK (junghoon): is there a better way to do this?
assign(".RIGHT", list2env(list(scriptArray = c())), envir = asNamespace("RIGHT"))

addBlankLine()
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, "")

addBlankLine(2)
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, rep("", 3))

## ---
## Test prepareData():
## ---

A <- data.frame(ID = 1:10, NAME = letters[1:10])
B <- data.frame(VALUE = 1:5)

fileNameArray <- prepareData(list(A = A, B = B))
expect_identical(fileNameArray, c("_A.csv", "_B.csv"))

expect_true(file.exists("_A.csv"))
expect_identical(A, read.csv("_A.csv"))

expect_true(file.exists("_B.csv"))
expect_identical(B, read.csv("_B.csv"))

unlink(fileNameArray)

dir.create("TEMP")
fileNameArray <- prepareData(list(A = A), "TEMP")
expect_identical(fileNameArray, "_A.csv")

expect_true(file.exists(file.path("TEMP", "_A.csv")))

unlink("TEMP", recursive = TRUE)

## ---
## Test loadData():
## ---

assign(".RIGHT", list2env(list(scriptArray = c())), envir = asNamespace("RIGHT"))

loadData("A")
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, 
                 paste0('A = createMainStructure("', file.path("..", "_A.csv"), '");'))

loadData()
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, 
                 paste0('A = createMainStructure("', file.path("..", "_A.csv"), '");'))

expect_error(loadData(c("B", "C"), "BB.csv"))

loadData(c("B", "C"), c("BB.csv", "CC.csv"))
expect_identical(get(".RIGHT", envir = asNamespace("RIGHT"))$scriptArray, 
                 c(paste0('A = createMainStructure("', file.path("..", "_A.csv"), '");'),
                   paste0('B = createMainStructure("', file.path("..", "BB.csv"), '");'),
                   paste0('C = createMainStructure("', file.path("..", "CC.csv"), '");')))
