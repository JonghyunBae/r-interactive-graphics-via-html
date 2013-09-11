
## ---
## Check checkDataName():
## ---

assign(".RIGHT", list2env(list(nameArray = "Theoph")), envir = asNamespace("RIGHT"))

expect_error(checkDataName("dummy"))
checkDataName("Theoph")

## ---
## Check checkAxisName():
## ---

expect_error(checkAxisName("dummy", Theoph))
checkAxisName("conc", Theoph)
