## Script to test funRight.R:

source("funRIGHT.R")

sub.diamonds <- diamonds[sample(1:nrow(diamonds), 1000, F), ]

obj <- RIGHT(sub.diamonds, fun = {
  plot.RIGHT(sub.diamonds, "x", price, color, "left")
  plot.RIGHT(sub.diamonds, "clarity", depth, depth, "right")
  plot.RIGHT(sub.diamonds, "table", cut, cut)
  hist.RIGHT(sub.diamonds, "color")
  hist.RIGHT(sub.diamonds, x)
  hist.RIGHT(sub.diamonds, cut)})

print(obj)