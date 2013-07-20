library(shiny)

includeJS <- function(fileName) {
  tagList(
    singleton(tags$head(tags$script(src = fileName)))    
  )
}
includeCSS <- function() {
  tagList(
    singleton(tags$head(helpText(HTML("<link rel=\"stylesheet\" href=\"css/right.css\"/>"))))    
    )
}
createDiv <- function(inputId) {
  tagList(
    tags$div(id = inputId,
                class = "right-output",
             oncontextmenu="return false;")
  )
}

#d3IO <- function(inputoutputID) {
#  div(id=inputoutputID,class="timeseries-output",tag("svg",""));
#}
# Define UI for dataset viewer application
shinyUI(pageWithSidebar(
  
  # Application title
  headerPanel("Shiny - RIGHT"),
  
  # Sidebar with controls to select a dataset and specify the number
  # of observations to view
  sidebarPanel(
 
    selectInput("xAxis", "Choose x axis", 
                choices = c("price","carat", "cut", "color", "clarity", "depth")),
    selectInput("yAxis", "Choose y axis", 
               choices = c("price", "carat", "cut", "color", "clarity", "depth")),  
    selectInput("color", "Choose color", 
                choices = c("price","carat", "cut", "color", "clarity", "depth")),
    selectInput("legend", "Choose legend", 
                choices = c("right", "topright", "left", "topleft", "default")),
    numericInput("width", "width", 300),
    numericInput("height", "height", 300),
    numericInput("bin", "bin", 2)
  ),
  # Show a summary of the dataset and an HTML table with the requested
  # number of observations
  #<script>
  #$(function() {
  #    setTimeout(function() {
  #  	  window.Shiny.onInputChange(\"TestEntry\", {a:[1, 2], b:[3, 4]});
  #	  }, 10);
  #	});
  #</script>
  mainPanel(
    textOutput("TestEntry"),
    ###########################################################################
    ###########################################################################
    helpText(HTML("<script src=\"kinetic-v4.5.4.js\"></script>

  <script src=\"structure.js\"></script>
  <script src=\"common.js\"></script>
  <script src=\"scatter.js\"></script>
  <script src=\"hist.js\"></script>
  <script src=\"box.js\"></script>
  <script src=\"node_event.js\"></script>
  <script>
  createMainStructure('_sub.diamonds.csv');
//  createMainStructure('Theoph-from-R.csv');
  </script>
  <div id=\"layout\">
   <div id=\"header\">
    <h1 id=\"logo\">
     <a id=\"home.html\" title=\"Home\"><span>The</span> RIGHT</a>
    </h1>
    <div id=\"navigation\">
     <ul>
      <li id=\"first\">
       <a href=\"home.html\" title=\"Home\">Home</a>
      </li>
      <li>
       <a href=\"index.html\" title=\"Start\">Start</a>
      </li>
      <li>
       <a href=\"pages/tutorial/tutorial.html\" title=\"Tutorial\">Tutorial</a>
      </li>
      <li>
       <a href=\"pages/contact/contact.html\" title=\"Contact\">Contact</a>
      </li>
     </ul>
    </div>
   </div>")),
    ###########################################################################
    ###########################################################################
   # includeCSS(),
    includeJS("shiny-right.js"),
    createDiv("scatterContainer1"),
    createDiv("histContainer2"),
    createDiv("boxContainer3"),
    
    ###########################################################################
    ###########################################################################
    helpText(HTML("
   <div id=\"main-box-index\">
    <div id=\"quote\">
                  <m1>Search Box</m1>
                  <script src=\"search.js\"></script>
                  <form id=\"searchForm1\">
                  <input type=\"text\" id=\"searchBox\" name=\"searchId\" placeholder=\"Please input boolean statement...\" onkeydown=\"if (event.which || event.keyCode){if ((event.which == 13) || (event.keyCode == 13)) {booleanSearch(searchForm1);  printAns(); return false;}};\"></input>
                  <a id=\"searchBtn\" href=\"#\" class=\"myButton\" onClick=\"booleanSearch(searchForm1); printAns(); return false;\">Search</a>
                  <a id=\"clearBtn\" href=\"#\" class=\"myButton\" onClick=\"clearSearchBox(); return false;\">Clear</a>
                    <br><br><m1>Table Button</m1><br>
                    <p>
                    <a id=\"showTable\" href=\"#\" class=\"myButton\" onClick=\"return false;\">Show Table</a>
                    <a id=\"hideTable\" href=\"#\" class=\"myButton\" onClick=\"return false;\">Hide Table</a>
                    </p>
                    </form>
                    
                    </div>
                    </div>
                    <script>
                    var scatter1 = new Scatter(1, mainArr, {x: 'carat', y: 'price', color: 'price', legend: 'right', width: 300, height: 300});
                  scatter1.draw(1);
                  eventTrigger(scatter1);
                  var hist2 = new Hist(2, mainArr, {bin: 2, x: 'cut', width: 300, height: 300});
                  hist2.draw(2);
                  eventTrigger(hist2);
                  var box3 = new Box(3, mainArr, {x: 'cut', y: 'price', width: 300, height: 300});
                  box3.draw(3);
                  eventTrigger(box3);
                  </script>
                    <script src=\"button_event.js\"></script>
                    <script src=\"table.js\"></script>
                    <div id=\"footer\">
                    <p id=\"copyright\">&copy; 2013 - <a href=\"pages/contact/contact.html\">The RIGHT team</a></p>
                    <p id=\"dont-delete-this\">E-mail : <a href=\"mailto:teamrightjs@gmail.com\">team.right.js@gmail.com</a></p>
                    </div>
                    </div>
                    "))
    ###########################################################################
    ###########################################################################
    
    
  )
  
  
))
