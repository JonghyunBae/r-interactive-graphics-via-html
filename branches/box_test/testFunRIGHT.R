## Script to test funRight.R:

source("funRIGHT.R")

diamonds <- diamonds[sample(1:nrow(diamonds), 1000, F), ]

obj <- RIGHT(diamonds, fun = {
  plot.RIGHT(diamonds, "x", price, color, "left")
  plot.RIGHT(diamonds, "clarity", depth, depth, "right")
  plot.RIGHT(diamonds, "table", cut, cut)
  hist.RIGHT(diamonds, "color")
  hist.RIGHT(diamonds, x)
  hist.RIGHT(diamonds, cut)}, file = "right_test.html")

print(obj)