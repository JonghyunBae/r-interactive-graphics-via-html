var mainArr; // array for all data.
var labelArr; // character array for the column names.
var msgShow=true;

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
 			result_row += cursor;
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
var gPressed = false;
var tmpShift = false;
function checkKeyDown(e) {
	//alert(e.keyCode);
	//17 || 25 = ctrl, shift = 16, a=65, g= 71
	if(e.keyCode == 17 || e.keyCode == 25){
		ctrlPressed = true;
	}
	if(e.keyCode == 16){
		shiftPressed = true;
	}
	if(e.keyCode == 65){
		aPressed = true;
	}
	if(e.keyCode == 71){
		gPressed = true;
	}
}	
function checkKeyUp(e) {
//	alert(e.keyCode);
	//17 || 25 = ctrl, shift = 16
	if(ctrlPressed = true){
		ctrlPressed = false;
	}
	if(shiftPressed = true){
		shiftPressed = false;
	}
	if(aPressed = true){
		aPressed = false;
	}
	if(gPressed == true){
		gPressed = false;
	}
}	
/*
function check(e) {
var code = e.keyCode;
switch (code) {
case 37: alert("Left"); break; //Left key
case 38: alert("Up"); break; //Up key
case 39: alert("Right"); break; //Right key
case 40: alert("Down"); break; //Down key
default: alert(code); //Everything else
}
}*/
//////////////////////////////////////Chk key event End//////////////////////////////////////

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
		points: [plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+plotLength, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+2*plotLength],
		stroke: 'black',
		strokeWidth: 2,		     
		});
		layer.add(xLine);	   		
		var xText = new Kinetic.Text({
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
		yText = new Kinetic.Text({
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
	xLabel = new Kinetic.Text({
		x: plotXmargin+plotWidth/2,
		y: plotYmargin+plotHeight+4*plotLength,
		offset : {x: xLabelText.length/2 * 10, y:0},
		text: xLabelText,
		fontSize: 15,
		fontFamily: 'Calibri',
		fill: 'black',
	});				
	yLabel = new Kinetic.Text({
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
	if(colorArr == 'default' ){//undefined로 수정 가능 ???
		tmpColor='green';
	}else{
		tmpColor= colors[colorArr[n]-1];
	}
	return tmpColor;
}

function drawLegend(location, legendArr, stage){

	var legendLayer = new Kinetic.Layer({draggable:true});

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

function doRefresh(){
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
}





