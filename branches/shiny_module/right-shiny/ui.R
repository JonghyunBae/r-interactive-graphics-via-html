library(shiny)
includeJS <- function(fileName) {
  tagList(
    singleton(tags$head(tags$script(src = fileName)))    
  )
}
includeCSS <- function() {
  tagList(
    singleton(tags$head(HTML("<link rel=\"stylesheet\" href=\"right.css\"/>
                             <title>RIGHT: R Interactive Graphics via HTml</title>"
    ))) 
    )
}
createDiv <- function(inputId) {
  tagList(
    tags$div(id = inputId,
             # class = "right-output",
             oncontextmenu="return false;")
  )
}

shinyUI(bootstrapPage(
  includeCSS(), 
  includeJS("shiny-right.js"),
  includeJS("callback.js"),
  includeJS("kinetic-v4.5.4.js"),
  includeJS("structure.js"),
  includeJS("common.js"),
  includeJS("axis.js"),
  includeJS("color.js"),
  includeJS("scatter.js"),
  includeJS("bar.js"),
  includeJS("box.js"),
  includeJS("pie.js"),
  includeJS("line.js"),
  includeJS("node_event.js"),
  includeJS("menu.js"),
  HTML("<script> var mainArr1 = createMainStructure(1, '_sub.diamonds.csv');</script>"), 
  HTML("<script>//var mainArr2 = createMainStructure(2, 'Theoph-from-R.csv');</script>"), 
  HTML("<div id=\"head\"> 
       <div class=\"wrap\">
       <form id=\"searchForm1\">
       <input type=\"text\" id=\"searchBox\" name=\"searchId\" placeholder=\"Please input boolean statement...\" onkeydown=\"if (event.which || event.keyCode){if ((event.which == 13) || (event.keyCode == 13)) {booleanSearch(searchForm1);  printAns(); return false;}};\"/>
       <a id=\"searchBtn\" href=\"#\" class=\"myButton\" onClick=\"booleanSearch(searchForm1); printAns(); return false;\">Search</a>
       <a id=\"clearBtn\" href=\"#\" class=\"myButton\" onClick=\"clearSearchBox(); return false;\">Clear</a>
       <a id=\"showTable\" href=\"#\" class=\"myButton\" onClick=\"return false;\">Hide Table</a>
       <a id=\"saveImg\" href=\"#\" class=\"myButton\" onClick=\"return false;\">Save Image</a>
       </form>
       </div>
       </div>
       <div id=\"content1\" class = \"right-output1\" >
       <div id=\"content\" class = \"right-output\" >"),
  createDiv("container1"),
  createDiv("container2"),
  createDiv("container3"),
  createDiv("container4"),
  createDiv("container5"),
  createDiv("container6"),
  HTML("
       </div>
       </div>
       
       <script>
       var axis1 = new Axis(1, mainArr1, 'cut', 'table', {legend: 'carat', position: 'topleft'});
       var s1 = new Bar(axis1, mainArr1, 'cut', 'depth',{});
        var s2 = new Dot(axis1, mainArr1, 'cut', 'table',{});
       var hobj1 = new ddply(mainArr1, ['price','cut', 'carat'], {});
        var axis2 = new Axis(2, hobj1, 'price', 'frequency', {legend:'price', position: 'left'});
       var s3 = new Dot(axis2, hobj1, 'price', 'frequency',{});
      var hobj2 = new ddply(mainArr1, ['cut','carat'] , {});
      var axis3 = new Axis(3, hobj2, 'carat', 'frequency', {legend:'cut', position: 'left'});
      var s4 = new Dot(axis3, hobj2, 'carat', 'frequency',{});

      var hobj3 = new ddply(mainArr1, ['cut'], {});
      var axis4 = new Axis(4, hobj3, 'cut', 'frequency', {legend:'cut', position: 'left'});
      var s5 = new Bar(axis4, hobj3, 'cut', 'frequency', {});
       // hist releated.
       /*  var hObj1= new MakeHistObj(mainArr1, 'cut', {color:'color', legend: 'left'});
       var axis1 = new MakeAxis(1, hObj1.xArr[0], hObj1.yArr[0], hObj1.isXDiscrete, hObj1.isYDiscrete, {mainLabel: hObj1.mainLabel, xLabel: hObj1.xLabel , yLabel: hObj1.yLabel, xbin: hObj1.bin, legend: hObj1.legend});
       var axis2 = new MakeAxis(2, hObj1.xArr[0], hObj1.yArr[0], hObj1.isXDiscrete, hObj1.isYDiscrete, {mainLabel: hObj1.mainLabel, xLabel: hObj1.xLabel , yLabel: hObj1.yLabel, xbin: hObj1.bin, legend: hObj1.legend});
       var scatter1 = new Scatter(axis1, hObj1, hObj1.xArr[1], hObj1.yArr[1], hObj1.colorArr, {double: hObj1.double});
       var hist1 = new Hist(axis2, hObj1, hObj1.xArr[1], hObj1.yArr[1], hObj1.colorArr, {double: hObj1.double});
       var line1 = new Line(axis2, hObj1, hObj1.xArr[1], hObj1.yArr[1], hObj1.colorArr, {double: hObj1.double});
       var hObj2= new MakeHistObj(mainArr1, 'cut', {color:'color', legend: 'left'});
       var axis3 = new MakeAxis(3, hObj2.xArr[0], hObj2.yArr[0], hObj2.isXDiscrete, hObj2.isYDiscrete, {mainLabel: hObj2.mainLabel, xLabel: hObj2.xLabel, yLabel: hObj2.yLabel, xbin: hObj2.bin, legend: hObj2.legend});
       var pie1 = new Pie(axis3, hObj2, hObj2.xArr[1], hObj2.yArr[1], hObj2.colorArr, {double: hObj2.double});
       //var hist2 = new Hist(axis3, hObj2, hObj2.xArr[1], hObj2.yArr[1], hObj2.colorArr, {double: hObj2.double});
       //var line3 = new Line(axis3, hObj2, hObj2.xArr[1], hObj2.yArr[1], hObj2.colorArr,{double: hObj2.double});
       // scatter related.
       var sobj1 = new MakeScatterObj(mainArr1, 'cut', 'depth', {color: 'depth', legend: 'topright'});
       //var axis3 = new MakeAxis(3, sobj1.xArr[0], sobj1.yArr[0], sobj1.isXDiscrete, sobj1.isYDiscrete, {mainLabel: sobj1.mainLabel, xLabel: sobj1.xLabel, yLabel: sobj1.yLabel, legend: sobj1.legend});
       // var scatter2 = new Scatter(axis3, sobj1, sobj1.xArr[1], sobj1.yArr[1], sobj1.colorArr, {double: sobj1.double});
       // var line2 = new Line(axis1, sobj1, sobj1.xArr[1], sobj1.yArr[1], sobj1.colorArr,{double: sobj1.double});
       var scatter3 = new Scatter(axis1, sobj1, sobj1.xArr[1], sobj1.yArr[1], sobj1.colorArr, {double: sobj1.double});
       
       eventTrigger([axis1,axis2, axis3]);
       */
       
       // var line1 = new Line(axis1, histArr1, histArr1.xArr[1], histArr1.yArr[1], histArr1.colorArr, {double: histArr1.double});
       //  eventTrigger(axis1);
       // eventTrigger([hist1, scatter2, line1]);
       
       //  var scatterArr1 = new MakeScatterObj(mainArr1, 'carat', 'price', {});
       //  var axis2 = new MakeAxis(2, scatterArr1.xArr[0], scatterArr1.yArr[0], scatterArr1.isXDiscrete, scatterArr1.isYDiscrete, {mainLabel: scatterArr1.mainLabel, xLabel : scatterArr1.xLabel, yLabel : scatterArr1.yLabel});
       //  var scatter1 = new Scatter(axis2, scatterArr1, scatterArr1.xArr[1], scatterArr1.yArr[1], null, {});
       // var line2 = new Line(axis2, scatterArr1, scatterArr1.xArr[1], scatterArr1.yArr[1], null, {});
       //eventTrigger([scatter1]);
       //  eventTrigger([line2]);
       // var hist2 = new Hist(axis2, scatterArr1,  scatterArr1.xArr[1], scatterArr1.yArr[1], null, {});
       
       /*     var axis2 = new MakeAxis(2, mainArr1['cut'], mainArr1['table'], mainArr1.isDiscrete['cut'], mainArr1.isDiscrete['table'], {xLabel : 'cut', yLabel : 'table'})
       var scatter1 = new Scatter(mainArr1, axis2, 'cut', 'table', {color: 'cut'});
       eventTrigger(scatter1, mainArr1);
       var axis3 = new MakeAxis(3, mainArr1['cut'], mainArr1['price'], mainArr1.isDiscrete['cut'], mainArr1.isDiscrete['price'], {xLabel : 'cut', yLabel : 'price'})
       var scatter2 = new Scatter(mainArr1, axis3, 'cut', 'price', {color: 'price', legend: 'topright'});
       eventTrigger(scatter2, mainArr1);
       
       var histArr2= new MakeHistObj(mainArr2, 'Subject', {bin:2});
       var axis4 = new MakeAxis(4, histArr2.xArr, histArr2.yArr, histArr2.isDiscrete, 'false', {xLabel : histArr2.xLabel , yLabel : histArr2.yLabel, xbin: histArr2.bin});
       var hist2 = new Hist(axis4, histArr2);
       eventTrigger(hist2, mainArr2);
       
       var axis5 = new MakeAxis(5, mainArr2['Time'], mainArr2['conc'], mainArr2.isDiscrete['Time'], mainArr2.isDiscrete['conc'], {xLabel : 'Time', yLabel : 'conc'})
       var scatter3 = new Scatter(mainArr2, axis5, 'Time', 'conc', {color: 'Time', legend: 'left'});
       eventTrigger(scatter3, mainArr2);
       var axis6 = new MakeAxis(6, mainArr2['Dose'], mainArr2['Subject'], mainArr2.isDiscrete['Dose'], mainArr2.isDiscrete['Subject'], {xLabel : 'Dose', yLabel : 'Subject'})
       var scatter4 = new Scatter(mainArr2, axis6, 'Dose', 'Subject', {color: 'Subject', legend: 'topright'});
       eventTrigger(scatter4, mainArr2); */
       </script>
       <script src=\"button_event.js\"></script>
      <script src=\"table.js\"></script>

       <script>//makeTable('table1', mainArr1, 200)</script>
       <script>//makeTable('table2', mainArr2, 300)</script>
       <div id=\"footer\">
       <p id=\"copyright\">&copy; 2013 - <a href=\"#\">The RIGHT team</a></p>
       <p id=\"dont-delete-this\">E-mail : <a href=\"mailto:teamrightjs@gmail.com\">team.right.js@gmail.com</a></p>
       </div>
       ")
))