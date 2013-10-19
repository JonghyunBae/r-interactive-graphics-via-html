#' @title Add a Search Box
#'
#' @description search_RIGHT adds a search box for a \code{data.frame} object.
#' 
#' @param data a data.frame object.
#' @param isString a character is expected for \code{data} if \code{TRUE}. It is useful for programming.
#' 
#' @export
#' 
#' @examples
#' \donttest{
#' obj <- RIGHT({plot(conc ~ Time, Theoph, type = "p", color = Subject)
#'               search(Theoph)})
#' print(obj)
#' }
search_RIGHT <- function(data, isString = FALSE) {
  
  ## ---
  ## Take strings if asked:
  ## ---
  
  # Make sure that data exists:
  argArray <- as.list(match.call())
  
  if (!isString) {
    
    data <- if (is.null(argArray$data)) NULL else as.character(argArray$data)
    
  } # if
  
  ## ---
  ## Check input arguments:
  ## ---
  
  # get is necessary in case a character string is given for data:
  if (!exists(data, envir = parent.frame())) {
    stop(data, " does not exist.")
  } # if
  
  ## ---
  ## Create a search box:
  ## ---
  
  # Keep name of the data object:
  .RIGHT$nameArray <- append(.RIGHT$nameArray, data)
  
  # Increment the number of search boxes:
  .RIGHT$numSearch <- .RIGHT$numSearch + 1
  
  # Add div in body: note that <script> is inserted under <div>.
  # CHECK (junghoon): this has to be improved such that the layout is controlled in <div> and the
  #                   actual JavaScript code appears in <script>.
  .RIGHT$scriptArray <- append(.RIGHT$scriptArray, 
                               paste0('makeSearchButton("searchBox', .RIGHT$numSearch,
                                      '", ', data, ');'))
  
  # Source dot.js in head:
  addSource(file.path(.RIGHT$libDir_RIGHT, "search.js"))
  
  invisible()
  
} # function search_RIGHT
