## Test closure:

getFunction <- function() {
  a <- 0
  
  setA <- function(.a) {
    a <<- .a
    invisible(NULL)
  } # function setA
  
  getA <- function() {
    return(a)
  } # function getA
  
  return(list(setA = setA, getA = getA))
  
} # function getFunction

AA <- getFunction()

AA$getA() # 0
AA$setA(10)
AA$getA() # 10
