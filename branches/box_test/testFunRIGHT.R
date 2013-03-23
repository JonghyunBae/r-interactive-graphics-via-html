## Script to test funRight.R:

source("funRIGHT.R")

subdia <- diamonds[sample(1:nrow(diamonds), 2000, F), ]

obj <- RIGHT(subdia, fun = {
  plot.RIGHT(subdia, "carat", price, color, "topright")
  hist.RIGHT(subida, "cut")
  hist.RIGHT(subdia, color)}, file = "testR.html")

print(obj)
