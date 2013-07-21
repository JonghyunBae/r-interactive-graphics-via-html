## Script to test funRight.R:

source("testR.R")

sub.diamonds <- diamonds[sample(1:nrow(diamonds), 1000, F), ]

obj <- RIGHT(sub.diamonds, fun = {
  plot.RIGHT(sub.diamonds, carat, price, color, "right", 300, 300)
  hist.RIGHT(sub.diamonds, cut, 2, 300, 300)
  box.RIGHT(sub.diamonds, carat, price, 300, 300)
})

print(obj)