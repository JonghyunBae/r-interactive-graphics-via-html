
//////////////////Common variables///////////////////////////
var asideWidth = 300;
var headerHeight = 200;
var scatterStageX = asideWidth;
var scatterStageY =200;
var histStageX =200;
var histStageY =200;
var idCounter = 0;
var plotXmargin=100;
var plotYmargin=100;
var plotLength=15;
var plotWidth=(window.innerWidth-asideWidth)*0.35-2*plotXmargin;
var plotHeight=400;

var scatterIdStart = idCounter;
var scatterIdEnd;
//var scatterX;
//var scatterY;

var histHasArr;
var histIdStart = idCounter;
var histIdEnd;

var mainArr; // array for all data.
var labelArr; // character array for the column names.
//var msgShow=true;

function createMainStructure(fileName)
{
	var tmpArr = getData(fileName);		
	var dataArr=tmpArr.dataArr;
	labelArr=tmpArr.labelArr;	
	mainArr = make2DArr(labelArr.length);	
	for(var j=0; j<dataArr.length; j++)
	{
		var tmpArr = dataArr[j].toString().split(',');	
		for(var i = 0 ; i < labelArr.length ; i ++)
		{
			mainArr[i][j] = parseFloat(tmpArr[i]);
		}	
	}
}
function getData(fileName)
{
	var filePath = fileName;	
	xmlhttp = new XMLHttpRequest();	
	xmlhttp.open("GET",filePath,false);
	xmlhttp.send(null);
	var fileContent = xmlhttp.responseText;
	var tempArr = csv2Arr(fileContent);
	var returnLabelArr = tempArr[0].toString().split(',');	
	tempArr.shift();
	var returnDataArr = tempArr;
	return { 'dataArr' : returnDataArr, 'labelArr' : returnLabelArr };	
}

function csv2Arr(data, liveChar)
 {	
 	var i = 0;
 	var eof = '';
 	var cursor = data.charAt(i);
 	var result_array = new Array();
 	var result_row = "";
 	var line = 0;
 	while(cursor != eof)
 	{
 		if((cursor == '\"') || (cursor == '\r') || (cursor == '\t') || (cursor == ' ')){
 		}else if( cursor == "\n" ){
 			if (result_array.length <= line)
 			{
 				result_array.push(new Array());
 				result_array[line].push(result_row);
 				result_row = "";
 				line++;
 			}
 		}else{
 			result_row += cursor;
 		}
 		cursor = data.charAt(i++);
 	}
 	return result_array;
 }
//////////////////////////////////////Chk key event Start//////////////////////////////////////   

window.addEventListener('keydown',this.checkKeyDown,false);	
window.addEventListener('keyup',this.checkKeyUp,false);	
var ctrlPressed = false;
var shiftPressed = false;
var aPressed = false;
var zPressed = false;
var gPressed = false;
var tmpShift = false;

function checkKeyDown(e) 
{
	//alert(e.keyCode);
	//17 || 25 = ctrl, shift = 16, a=65, g= 71
	if(e.keyCode == 17 || e.keyCode == 25)
	{
		ctrlPressed = true;
	}
	if(e.keyCode == 16)
	{
		shiftPressed = true;
	}
	if(e.keyCode == 65)
	{
		aPressed = true;
	}
	if(e.keyCode == 71)
	{
		gPressed = true;
	}
	if(e.keyCode == 90)
	{
		zPressed = true;
	}
	if(ctrlPressed == true && zPressed == true)
	{
		fetchWork();
	}
//	alert("11111" + ctrlPressed + "," + zPressed);
	
}	
function checkKeyUp(e) 
{
//	alert(e.keyCode);
	//17 || 25 = ctrl, shift = 16
	if(ctrlPressed == true && zPressed != true)
	{
		ctrlPressed = false;
	}
	if(shiftPressed == true)
	{
		shiftPressed = false;
	}
	if(aPressed == true)
	{
		aPressed = false;
	}
	if(gPressed == true)
	{
		gPressed = false;
	}
	if(zPressed == true)
	{
		zPressed = false;
	}
//	alert("22222" + ctrlPressed + "," + zPressed);
}	
//////////////////////////////////////Chk key event End//////////////////////////////////////

var beforeInnerWidth = window.innerWidth; //window.innerWidth..., Does this variable respond when event occur?........
containerSizeInit();
function containerSizeInit()
{
	document.getElementById("scatterContainer").style.top = headerHeight+"px";
	document.getElementById("scatterContainer").style.left = scatterStageX+"px";

	document.getElementById("histContainer").style.top = headerHeight+"px";
	document.getElementById("histContainer").style.left = asideWidth+(window.innerWidth-asideWidth)*0.35 +"px";
	//scatterStage.setWidth(window.innerWidth*0.35);
	//scatterStage.setHeight(window.innerWidth*0.2);
}



window.onresize = function(evt) {
	   containerResize();
	// window.innerWidth;
} 

function containerResize()
{
//	document.getElementById("scatterContainer").style.left = window.innerWidth*0.2+"px";
	document.getElementById("histContainer").style.left = asideWidth+(window.innerWidth-asideWidth)*0.35 +"px";
	scatterStage.setWidth((window.innerWidth-asideWidth)*0.35);
	histStage.setWidth((window.innerWidth-asideWidth)*0.35);
	plotWidth=(window.innerWidth-asideWidth)*0.35-2*plotXmargin;
	
	redrawStage(scatterStage, scatterXMax, scatterXDiff);
	redrawStage(histStage, histXMax, histXDiff);
	
	
	
	
}

function redrawStage(stage, xMax, xDiff){
	var node = stage.get(".legendLayer");
	node.apply('setAttrs', {
		x : (window.innerWidth-asideWidth)*0.35 -  (beforeInnerWidth-asideWidth)*0.35
	});	
	node.apply('transitionTo', {
		rotation:0,
		duration:0.01
	});
	//redraw border
	var node= stage.get(".rectBorder");
	node.apply('setAttrs', {
		width: stage.getWidth(),
	});
	node.apply('transitionTo', {
		rotation:0,
		duration:0.01
	});
	
	
	//redraw base rectangle
	var node= stage.get(".baseRect");
	node.apply('setAttrs', {
		width: plotWidth+2*plotLength
	});
	node.apply('transitionTo', {
		rotation:0,
		duration:0.01
	});
	
	for(var i=0; i<parseInt(xMax/xDiff)+1; i++)
	{
		var node= stage.get(".xLine"+i);
		node.apply('setAttrs', {
			points: [plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+plotLength, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+2*plotLength]
		});
		node.apply('transitionTo', {
			rotation:0,
			duration:0.01
		});
		var node= stage.get(".xText"+i);
		node.apply('setAttrs', {
			x: plotXmargin+i*plotWidth/(xMax/xDiff)-15,		
		});
		node.apply('transitionTo', {
			rotation:0,
			duration:0.01
		});
	}
	var node= stage.get(".xLabel");
	node.apply('setAttrs', {
		x: plotXmargin+plotWidth/2
	});
	node.apply('transitionTo', {
		rotation:0,
		duration:0.01
	});
	var node= stage.get(".mainLabel");
	node.apply('setAttrs', {
		x: plotXmargin+plotWidth/2
	});
	node.apply('transitionTo', {
		rotation:0,
		duration:0.01
	});
	if(stage==scatterStage){
		for(var i = 0; i < scatterXMain.length ; i++)
		{
			var node = stage.get("#"+ (i + scatterIdStart));
			node.apply('setAttrs', {
				x : scatterXMain[i]*plotWidth/xMax+plotXmargin
			});	
		}
	}
	if(stage==histStage){
		for(var i = 0; i < histXMain.length ; i++)
		{
			var node = stage.get("#"+ (i + histIdStart));
			node.apply('setAttrs', {
				x : plotXmargin +  i * plotWidth / parseInt(xMax/diffHist) + width/2,
				width : plotWidth / parseInt(xMax/diffHist)
			});	
		}
		var node= stage.get(".histXAxis");
		node.apply('setAttrs', {
			points: [plotXmargin, plotYmargin+plotHeight+plotLength, plotXmargin+parseInt(xMax/xDiff)*plotWidth/(xMax/xDiff),  plotYmargin+plotHeight+plotLength],
		});
		node.apply('transitionTo', {
			rotation:0,
			duration:0.01
		});
	}
	
	doRefresh();
}

function findMaxValue(Data,diff) // if diff =0, for scatter.
{
	var maxValue=Data[0];

	var returnValue;
	for(var i=1; i<Data.length; i++)
	{
	//	document.write(maxValue + ", " +  Data[i] + "<br>");
		if(Data[i]>maxValue)
		{
//			document.write("dddddddddddddd");
			maxValue=Data[i];					
		}
//		document.write(maxValue + ", " +  Data[i] + "<br>");
	}
	returnValue=parseInt(maxValue+1);	
	for(var i=0; i<diff; i++) //until mod ==0
	{
		returnValue=returnValue+i;
		if((returnValue% diff) == 0)
		{
			break;
		}				
	}	
	return returnValue;
}

function histFindMaxValue(xMaxHist, xData,diff)
{
	var maxValue=0;
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMaxHist/diff +1); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMaxHist/diff +1); cnt++)
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*diff && xData[i]<(cnt+1)*diff)
			{
				tmpHistArr[cnt]++;
			}
		}
	}
	for(var i=0; i<parseInt(xMaxHist/diff +1); i++)
	{
		if(tmpHistArr[i]>maxValue)
		{
			maxValue=tmpHistArr[i];					
		}
	}	
	return maxValue;
}

function drawBaseRect(color, layer)//Put base layer
{
	var plotRect = new Kinetic.Rect({
		name : "baseRect",
		x: plotXmargin-plotLength,
		y: plotYmargin-plotLength,
		width: plotWidth+2*plotLength,
		height: plotHeight+2*plotLength,
		stroke: color,
		strokeWidth: 2
	});
	layer.add(plotRect);
}


function drawScale(xMax, xDiff, yMax, yDiff, layer){

	for(var i=0; i<parseInt(xMax/xDiff)+1; i++)
	{
		var xLine = new Kinetic.Line({
			name : "xLine"+i,
			points: [plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+plotLength, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+2*plotLength],
			stroke: 'black',
			strokeWidth: 2,		     
		});
		layer.add(xLine);	   		
		var xText = new Kinetic.Text({
			name : "xText"+i,
			x: plotXmargin+i*plotWidth/(xMax/xDiff)-15,
			y: plotYmargin+plotHeight+plotLength*2,
			text: i*xDiff,
			fontSize: 15,
			fontFamily: 'Calibri',
			fill: 'black',
			width: 30,
			align: 'center'	
		});		   
		layer.add(xText);			
	}
	for(var i=0; i<parseInt(yMax/yDiff)+1; i++)
	{
		var yLine = new Kinetic.Line({
			points: [plotXmargin-plotLength, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-2*plotLength,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff)],
			stroke: 'black',
			strokeWidth: 2,		     
		});
		layer.add(yLine);	   
		var yText = new Kinetic.Text({
			x: plotXmargin-plotLength*2-15,
			y: plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff)+15,
			text: i*yDiff,
			fontSize: 15,
			fontFamily: 'Calibri',
			fill: 'black',
			width: 30,
			align: 'center',
			rotation: (Math.PI)*3/2
		});		   
		layer.add(yText);		
	}			
}
function drawLabel(xLabelText, yLabelText, layer)//Draw xLabel, yLebel
{
	var xLabel = new Kinetic.Text({
		name : 'xLabel',
		x: plotXmargin+plotWidth/2,
		y: plotYmargin+plotHeight+4*plotLength,
		offset : {x: xLabelText.length/2 * 10, y:0},
		text: xLabelText,
		fontSize: 15,
		fontFamily: 'Calibri',
		fill: 'black',
	});				
	var yLabel = new Kinetic.Text({
		x: plotXmargin-5*plotLength,
		y: plotYmargin+plotHeight/2  - yLabelText.length/2 * 5,
		offset : {x: yLabelText.length/2 * 10},
		text: yLabelText,
		fontSize: 15,
		fontFamily: 'Calibri',
		fill: 'black',
		rotation: (Math.PI)*3/2
	});		   
	layer.add(xLabel);
	layer.add(yLabel);	
}

function drawMainLabel(mainText, layer)//Draw main
{	
	main = new Kinetic.Text({
		name : 'mainLabel',
		x: plotXmargin+plotWidth/2, 
		y: plotYmargin *0.5 ,
		offset : {x: mainText.length/2 * 10, y:0},
		text: mainText,
		fontSize: 20,
		fontStyle: 'bold',
		fontFamily: 'Calibri',
		fill: 'black',
	});		   
	layer.add(main);
	
}
function dataGetName(n){
	var name=mainArr[0][n];
	for(var i=1; i<mainArr.length; i++){
		name= name +','+ mainArr[i][n];
	}
	return name;	
}

function make2DArr(rows) {
	  var Arr = [];
	  for (var i=0;i<rows;i++) {
		  Arr[i] = [];
	  }
	  return Arr;
}



var colors = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];     //-------------------------------------------should be flexible----------------------------------------------------!!

function setColor(colorArr,n){
	var tmpColor='green';
	
//	if (scatterColor == undefined) {
	if(colorArr == 'default' ){//undefined로 수정 가능 ???
		tmpColor='green';
	}else{
		tmpColor= colors[colorArr[n]-1];
	}
	return tmpColor;
}

function drawLegend(location, legendArr, stage){

	var legendLayer = new Kinetic.Layer({name:'legendLayer', draggable:true});

	function addNodeLegend(obj, layer) {
		var node = new Kinetic.Circle({
			x: obj.x,
			y: obj.y,
			radius: 3,
			fill: obj.color,
		//	opacity : 1,
			id: obj.id
		});		
		layer.add(node);
		//     return node;
	}

	var legendText = new Kinetic.Text({
		text: '',
		fontFamily: 'Calibri',
		fontSize: 13,
		padding: 5,
		fill: 'black',
		align:'center'
	});

	var legendRect= new Kinetic.Rect({
		stroke: 'black',
		fill: 'white'
	});
	

	var myLegend= getMyLegend(location ,  legendArr); /////////------------------------------should be flexible..not just mainArr[0]

	legendRect.setPosition(myLegend.x, myLegend.y);
	legendText.setPosition(myLegend.x, myLegend.y);
	legendText.setText(myLegend.text); 
	legendRect.setAttrs({
		width: legendText.getWidth(),
		height: legendText.getHeight()
	});
	legendLayer.add(legendRect);
	legendLayer.add(legendText);

	var legendData = [];
//	var colors = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];//---------should be able to get more color flexible.

	for(var n = 1; n < mainArr[0].length ; n++)
	{
		if(n==1 ||  ( (n!=1) && (mainArr[0][n] != mainArr[0][n-1]) ) ) {
			var x = myLegend.x+10;
			var y = myLegend.y+plotLength+1.18*n-5;
			
			legendData.push({
				x: x,
				y: y,
				id: -1,
				color: setColor(scatterColor,n)
			//	color : 'black'
			});
		}
	}
	for(var n = 0; n < legendData.length; n++) 
	{
		addNodeLegend(legendData[n], legendLayer);	
	}
	stage.add(legendLayer);
} 

function getMyLegend(Location, Data){//only works for pre-sorted array....
	var tmpText='';	 
	
	for( var i = 1 ; i < Data.length; i++)
	{	
		if(i==1 ||  ( (i!=1) && (Data[i] != Data[i-1]) ) )  //after cheking subject, if it is the same, there is no index addition.
		{		
			tmpText=tmpText + '     '+ Data[i] +"\r\n";
		}
	}
	
	if (Location == 'topright' || Location == undefined)	{
		x = plotXmargin+plotWidth-27;
		y = plotYmargin-plotLength;
	}else if(Location == 'topleft'){
		x = plotXmargin-plotLength;
		y = plotYmargin-plotLength;
	}else if(Location == 'bottomright'){
		x = plotXmargin+plotWidth-27;
		y = plotYmargin+plotHeight-tmpText.length*1.53; //check later
	}else if(Location == 'bottomleft'){
		x = plotXmargin-plotLength;
		y = plotYmargin+plotHeight-tmpText.length*1.53;//check later
	}else{						// default is topright
		x = plotXmargin+plotWidth-27;
		y = plotYmargin-plotLength;
		}
	
	return {
		'x': x,
		'y': y,
		'text': tmpText
	};
}

function doRefresh()
{
	var tmpNode = scatterStage.get("#"+ (scatterIdStart));
	tmpNode.apply('transitionTo', {
	    rotation : 0,
	//    scale: { x : 1.3, y : 1.3 },
	   duration: 0.1
	   //    easing: 'elastic-ease-out'
	});
	var tmpNode1 = histStage.get("#"+ (histIdStart));
	tmpNode1.apply('transitionTo', {
	    rotation : 0,
	//    stroke:'black',
	//    scale: { x : 1.3, y : 1.3 },
	   duration: 0.1
	   //    easing: 'elastic-ease-out'
	}); 
//	scatterPlotLayer.drawScene();
//	histPlotLayer.drawScene();
}
////////////////////////////////Undo Start////////////////////////////

var workColCount = 0; // start with 1 because the [0] is for eraseOn.
var fetchCount = 1;
var limitSave = 10;
var saveWorkArr = make2DArr(limitSave+1);
var saveMousePosArr = new Array(limitSave+1);
var start = 0;
var workRowCount = 0;

function saveWork() // this is only for scatter relative id
{	// saving is for save or not
	
	if(start == 0)
	{
		saveWorkArr[0] =  new Array(mainArr[0].length + 1);
		saveWorkArr[9] =  new Array(mainArr[0].length + 1);
		saveWorkArr[0][0] = -2;
		saveWorkArr[9][0] = -2;
		start =1;
	}	
//	alert(start);
	if(workRowCount  != limitSave-1){
		workRowCount++;		
	}else if(workRowCount == limitSave-1){
		workRowCount = 0;
	}
	if(fetchCount != limitSave-1){
		fetchCount++;
	}
	saveWorkArr[workRowCount] = new Array(mainArr[0].length + 1);
	
	for(var i = 0 ; i < scatterData.length ; i ++)
	{
		if(scatterData[i].selected == 1)
		{
			saveWorkArr[workRowCount][workColCount++] = i;
	//		alert(i);
		}
	}
	
	if(workColCount == 0)
	{
		
		if((workRowCount > 0) && (saveWorkArr[workRowCount-1][0] == -2))
		{
		//	document.write("dddddddd");
			fetchCount = fetchCount-1;
			workRowCount = workRowCount-1;
			return;
		}
		saveWorkArr[workRowCount][workColCount++] = -2
	}else{
		saveWorkArr[workRowCount][workColCount++] = -1; // save finish sign
		
	}				
	workColCount = 0;		
	saveMousePosArr[workRowCount] = preMousePos;
	
	
//	alert(workColCount);
//	alert("111 "+ workRowCount + "  111   " +fetchCount );
	
}

function fetchWork()
{
	var node;		
	if(fetchCount != 0)
	{
		allDeselect();
		if(workRowCount  != 0){
			workRowCount--;		
		}else if(workRowCount == 0){
			workRowCount = limitSave-1;
		}
		
	//	alert(fetchCount);
		if(saveWorkArr[workRowCount][0] == -1) // Allselect
		{
	//		alert("111");
			allSelect();
		}else if(saveWorkArr[workRowCount][0] == -2){   //All Deselect
		//		alert("222");
			//alert(fetchCount);
		//	allDeselect();
		}else{
		//	alert(workRowCount);
		//	alert(fetchCount);
			for(var i = 0;  ; i ++)
			{
				
			//	alert("RowCount "+ workRowCount +","+ saveWorkArr[workRowCount][i]);
				if(saveWorkArr[workRowCount][i] == -1)
				{					
					break;
				}
				node = scatterStage.get("#"+ (saveWorkArr[workRowCount][i] + scatterIdStart));
				allUpdate("scatter", node, saveWorkArr[workRowCount][i], 0);
			}		
		}
		doRefresh();
		//alert("!!!!!!!!!!!");
//		alert(fetchCount);
		fetchCount = fetchCount-1;
		preMousePos  = saveMousePosArr[workRowCount];
		
	}
//	alert("222 "+ workRowCount + "  222   " +fetchCount );
}

for(var i = 0; i <scatterData.length ; i ++)
{
	node = scatterStage.get("#"+ (i + scatterIdStart));
	if(scatterData[i].selected == 0)
	{
		scatterSingleSelect(node, i);
	}
}
////////////////////////////////Undo End/////////////////////////////
///////////////////////////// Total Platform Start/////////////////////////
function allSelect()
{
	scatterAllSelect();
	histAllSelect();	
}

function allDeselect()
{
	scatterAllDeselect();
	histAllDeselect();
}

function allUpdate(hostName, node, id, eraseOn)
{
	//// eraseOn : 0 is add node , 1 is delete node //
	//// id is each relative id ///
	if(hostName == "scatter")
	{
		if(eraseOn == 0) // add node
		{
			scatterSingleSelect(node, id);
		}
		else{
			scatterSingleDeselect(node, id);
		}
	//	alert(eraseOn);
  		histUpdate(scatterXMain[id],eraseOn);
	}else if(hostName == "hist"){
		if(eraseOn == 0) // add node
		{
			histSingleSelect(node, id);
		}
		else{
			histSingleDeselect(node, id);
		}
		scatterUpdate(id,eraseOn);
	}
}
///////////////////////////// Total Platform End/////////////////////////
