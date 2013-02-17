var scatterIdStart = idCounter;
var scatterIdEnd;

//////////////////////////////////////Stage Start//////////////////////////////////////
  var stage = new Kinetic.Stage({
    container: 'container',
    width: 800,
    height: 800
  });
//////////////////////////////////////Drawing Plot Start//////////////////////////////////////
var scatterPlotLayer= new Kinetic.Layer();  

//Draw Rectangle
var plotRect = new Kinetic.Rect({
	x: plotXmargin-plotLength,
	y: plotYmargin-plotLength,
	width: plotWidth+2*plotLength,
	height: plotHeight+2*plotLength,
	//     fill: 'green',
	stroke: 'black',
	strokeWidth: 2
});
scatterPlotLayer.add(plotRect);

//Draw xText
for(var i=0; i<parseInt(xMax/xDiff)+1; i++)
{
	var xLine = new Kinetic.Line({
		points: [plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+plotLength, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+2*plotLength],
		stroke: 'black',
		strokeWidth: 2,		     
	});
	scatterPlotLayer.add(xLine);	   		
	var xText = new Kinetic.Text({
		x: plotXmargin+i*plotWidth/(xMax/xDiff)-10,
		y: plotYmargin+plotHeight+plotLength*2,
		text: i*xDiff,
		fontSize: 15,
		fontFamily: 'Calibri',
		fill: 'black',
		width: 20,
		align: 'center'	
	});		   
	scatterPlotLayer.add(xText);			
}

//Draw yText
for(var i=0; i<parseInt(yMax/yDiff)+1; i++)
{
	var yLine = new Kinetic.Line({
		points: [plotXmargin-plotLength, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-2*plotLength,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff)],
		stroke: 'black',
		strokeWidth: 2,		     
	});
	scatterPlotLayer.add(yLine);	   
	yText = new Kinetic.Text({
		x: plotXmargin-plotLength*2-15,
		y: plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff)+10,
		text: i*yDiff,
		fontSize: 15,
		fontFamily: 'Calibri',
		fill: 'black',
		width: 20,
		align: 'center',
		rotation: (Math.PI)*3/2
	});		   
	scatterPlotLayer.add(yText);		
}		

//Draw xLabel
xLabel = new Kinetic.Text({
	x: plotXmargin+plotWidth/2,
	y: plotYmargin+plotHeight+4*plotLength,
	text: 'Time',
	fontSize: 15,
	fontFamily: 'Calibri',
	fill: 'black',
	//      width: plotWidth*0.8,
	align: 'center'
});		   
scatterPlotLayer.add(xLabel);		

//Draw yLabel
yLabel = new Kinetic.Text({
	x: plotXmargin-5*plotLength,
	y: plotYmargin+plotHeight/2,
	text: 'conc',
	fontSize: 15,
	fontFamily: 'Calibri',
	fill: 'black',
	//   width: plotHeight*0.8,
	align: 'center',
	rotation: (Math.PI)*3/2
});		   
scatterPlotLayer.add(yLabel);	

//Draw main
main = new Kinetic.Text({
	x: plotXmargin+plotWidth/2-60, 
	y: plotYmargin *0.5 ,
	text: 'Theoph Scatter',
	fontSize: 20,
	fontStyle: 'bold',
	fontFamily: 'Calibri',
	fill: 'black',
	//  width: plotWidth*0.8,
	align: 'center'
});		   
scatterPlotLayer.add(main);
stage.add(scatterPlotLayer);

//////////////////////////////////////Drawing Plot End//////////////////////////////////////
//add node function.
function scatterAddNode(obj, layer) 
{
	var node = new Kinetic.Circle({
		id: obj.id,
		name: obj.name,
		x: obj.x,
		y: obj.y,
		radius: radius_scale,
		fill: obj.color,
		stroke : obj.stroke,
		strokeWidth : 0.1,
		opacity : 1,		
		draggable: false,
		selected : obj.selected
	});		
	layer.add(node);
}
//build data
var xScale=plotWidth/xMax;//added by us
var yScale=plotHeight/yMax; //added by us
var scatterData = [];
var colors = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];     

for(var n = 0; n < theophArr.time.length ; n++)
{
	var x = theophArr.time[n]*xScale+plotXmargin;
	var y = theophArr.conc[n]*yScale+plotYmargin;
	var tmp=plotHeight/2+plotYmargin-y; 
	y=y+2*tmp; //since (0,0) of canvas is top-left, so we need to change it into bottom-left.
	scatterData.push({
		id: idCounter,
		name: theophArr.subject[n]+','+theophArr.wt[n]+','+theophArr.dose[n]+','+theophArr.time[n]+','+theophArr.conc[n], //does not work yet..
		x: x,
		y: y,		
		color: colors[theophArr.subject[n]-1],
		stroke : 'black',
		selected : 0 // 0 means : unselected ,  1 means : selected
	});
	idCounter++;
}
scatterIdEnd = idCounter - 1;
//render data
var scatterDataLayer= new Kinetic.Layer();
for(var n = 0; n < scatterData.length; n++) 
{
	scatterAddNode(scatterData[n], scatterDataLayer);
}
stage.add(scatterDataLayer);

//////////////////////////////////////Tooltip Start//////////////////////////////////////
var scatterTooltipLayer = new Kinetic.Layer();
var scatterTooltip = new Kinetic.Group({
	id : -1,
	opacity: 0.75,
	visible: false
});
var scatterTooltipText = new Kinetic.Text({
	id : -1,
	text: '',
	fontFamily: 'Calibri',
	fontSize: 18,
	padding: 5,
	fill: 'white',
	align:'center'
});	  
var scatterTooltipRect = new Kinetic.Rect({
	id : -1,
	fill: 'black'
});  

scatterTooltip.add(scatterTooltipRect).add(scatterTooltipText);
scatterTooltipLayer.add(scatterTooltip);	  
stage.add(scatterTooltipLayer);

scatterDataLayer.on('mouseover', function(evt){
	document.body.style.cursor = "pointer";
	var node = evt.shape;
	var mousePos = node.getStage().getMousePosition();
	scatterTooltip.setPosition(mousePos.x + 8, mousePos.y + 8);
	var nameArr = new Array();
	nameArr = node.getName().split(',');		
	scatterTooltipText.setText("node: " + (node.getId() - scatterIdStart) +"\r\n"+"Subject: " + nameArr[0] +"\r\n"+ "Wt: " + nameArr[1] + "\r\n"+"Does: " + nameArr[2] +"\r\n"+ "Time: " + nameArr[3] + "\r\n"+"conc: " + nameArr[4] +"\r\n"+ "color: " + node.getFill()); //naem split?
	scatterTooltipRect.setAttrs({
		width: scatterTooltipText.getWidth(),
		height: scatterTooltipText.getHeight()
	});
	scatterTooltip.show();
	scatterTooltipLayer.draw();
	node.moveToTop();
	var shapes = stage.get('#'+node.getId());
	shapes.apply('transitionTo', {
		scale: { x : 1.5, y : 1.5 },
		duration: 1,
		easing: 'elastic-ease-out'
	});	
});

scatterDataLayer.on('mouseout', function(evt) {
	var node = evt.shape;
	document.body.style.cursor = "default";
	scatterTooltip.hide();
	scatterTooltipLayer.draw();	 
	var shapes = stage.get('#'+node.getId());
	if(scatterData[node.getId() - scatterIdStart].selected > 0){//selected
		shapes.apply('transitionTo', {
			opacity: 1,
			scale: { x : 1.3, y : 1.3 },
			duration: 1,
			easing: 'elastic-ease-out'
		});
	}else{		  //unselected
		shapes.apply('transitionTo', {
			opacity: 1,
			scale:{ x : 1, y : 1 },
			duration: 1,
			easing: 'elastic-ease-out'
		});
	}
});	  
//////////////////////////////////////Tooltip End//////////////////////////////////////

//////////////////////////////////////Selection Start//////////////////////////////////////
var preMousePos;


scatterPlotLayer.on('click', function(evt){
	scatterAllDeselect();
	histAllDeselect();
//	writeMessage1(messageLayer1);
	 writeMessage(messageLayer);
	 tmpShift = false;
});

scatterDataLayer.on('click', function(evt){
  	var node = evt.shape;
  	var shapes = stage.get('#'+node.getId());
  	var semiNode;
  	var mousePos = {x: node.getX(), y:node.getY()};
  	var tmpNode;
  	
  	if(aPressed){	//select ALL
  		histAllSelect();
  		scatterAllSelect();
  		tmpShift = false;
  	}else if(ctrlPressed){ //select mutiple node one by one.
  		if(scatterData[node.getId() - scatterIdStart].selected > 0){ // pre pressed state -> deselect rect & scatter
  			scatterSingleDeselect(shapes, node.getId() - scatterIdStart);
  			histUpdate(theophArr.time[node.getId() - scatterIdStart],1);
   		}else if(scatterData[node.getId() - scatterIdStart].selected == 0){ // unselected -> selected
  			scatterSingleSelect(shapes, node.getId() - scatterIdStart);
  			histUpdate(theophArr.time[node.getId() - scatterIdStart],0);
  		}
  		tmpShift = false;
  	}else if(gPressed){ //select by Group, (select every node whose subject is the same)
  		nameArr = node.getName().split(',');	
  		for(var i = 0 ; i < scatterData.length ; i++){
			var tmpNameArr = new Array();
			tmpNameArr = scatterData[i].name.split(',');	
			if(nameArr[0] == tmpNameArr[0])
			{
				tmpNode = stage.get("#"+ (i + scatterIdStart));
				scatterSingleSelect(tmpNode, i);
				histUpdate(theophArr.time[i], 0);  //과부하로 인한 보류
			}
		}
		tmpShift = false;
	}else if(shiftPressed){
		scatterAllDeselect();
		tmpShift = true;
		if(preMousePos.x < mousePos.x)
		{
			if(preMousePos.y < mousePos.y)	{
				for(var i = 0 ; i < scatterData.length ; i++){
					if(preMousePos.x <= scatterData[i].x && scatterData[i].x <= mousePos.x && preMousePos.y <= scatterData[i].y && scatterData[i].y <= mousePos.y )
					{
						tmpNode = stage.get("#"+ (i + scatterIdStart));
						scatterSingleSelect(tmpNode, i);
						histUpdate(theophArr.time[i], 0);
					}
				}
			}else if(mousePos.y < preMousePos.y){
				for(var i = 0 ; i < scatterData.length ; i++){
					if(preMousePos.x <= scatterData[i].x && scatterData[i].x <= mousePos.x && mousePos.y <= scatterData[i].y && scatterData[i].y <= preMousePos.y )
					{
						tmpNode = stage.get("#"+ (i + scatterIdStart));
						scatterSingleSelect(tmpNode, i);
						histUpdate(theophArr.time[i], 0);
					}
				}
			}
		}else if(preMousePos.x > mousePos.x)
		{
			if(preMousePos.y < mousePos.y)	{
				for(var i = 0 ; i < scatterData.length ; i++){
					if(mousePos.x <= scatterData[i].x && scatterData[i].x <= preMousePos.x  && preMousePos.y <= scatterData[i].y && scatterData[i].y <= mousePos.y )
					{
						tmpNode = stage.get("#"+ (i + scatterIdStart));
						scatterSingleSelect(tmpNode, i);
						histUpdate(theophArr.time[i], 0);
					}
				}
			}else if(mousePos.y < preMousePos.y){
				for(var i = 0 ; i < scatterData.length ; i++){
					if(mousePos.x <= scatterData[i].x && scatterData[i].x <= preMousePos.x && mousePos.y  <= scatterData[i].y && scatterData[i].y <= preMousePos.y  )
					{
						tmpNode = stage.get("#"+ (i + scatterIdStart));
						scatterSingleSelect(tmpNode, i);
						histUpdate(theophArr.time[i], 0);
					}
				}
			}
		}	
	}else{
		tmpShift = false;
  		scatterAllDeselect();
  		histAllDeselect();
  		scatterSingleSelect(shapes, node.getId() - scatterIdStart);
  		//document.write(theophArr.time[node.getId() - scatterIdStart]);
  		histUpdate(theophArr.time[node.getId() - scatterIdStart],0);
  	}  	
  	if(tmpShift == false)
	{
		preMousePos = mousePos;
	}  	
  	 writeMessage(messageLayer);
  	writeMessage1(messageLayer1);
}); 

function scatterUpdate(rectId, eraseOn)
{
	var node;
	if(eraseOn == 0)	{
		for(var i = 0 ; i< histHasArr[rectId].length ; i ++)
		{	
			node = stage.get("#" + scatterData[histHasArr[rectId][i]].id);
			scatterSingleSelect(node, histHasArr[rectId][i]);
		}
	}else if(eraseOn == 1){ 
		for(var i = 0 ; i< histHasArr[rectId].length ; i ++)
		{
			node = stage.get("#" + scatterData[histHasArr[rectId][i]].id);
			if(scatterData[histHasArr[rectId][i]].selected  == 1)
			{
				scatterSingleDeselect(node, histHasArr[rectId][i]);
			}			
		}
	}
}

function scatterSingleSelect(node, id)
{
//document.write(node + id);
//	node = stage.get("#"+ id );
	node.apply('transitionTo', {
		opacity: 1,
		//stroke : 'black',
		strokeWidth : 1,
		scale: { x : 1.3, y : 1.3 },
		duration: 1,
		easing: 'elastic-ease-out'
	});
	scatterData[id].selected=1;
}

function scatterSingleDeselect(node, id)
{
	node.apply('transitionTo', {
		opacity: 1,
		//stroke : 'black',
		strokeWidth : 0.1,
		scale: { x : 1, y : 1 },
		duration: 1,
		easing: 'elastic-ease-out'
	});
	scatterData[id].selected=0;
}

function scatterAllSelect()
{
	var node;
	for(var i = 0; i <scatterData.length ; i ++)
	{
		node = stage.get("#"+ (i + scatterIdStart));
		if(scatterData[i].selected == 0)
		{
			scatterSingleSelect(node, i);
		}
	}
}

function scatterAllDeselect()
{
	var node;
	for(var i = 0; i <scatterData.length ; i ++)
	{
		node = stage.get("#"+ (i + scatterIdStart));
		if(scatterData[i].selected == 1)
		{
		//	document.write(i +scatterIdStart );
			
			scatterSingleDeselect(node, i);
		}
	}
}

//////////////////////////////////////Selection End//////////////////////////////////////


//////////////////////////////////////Legend Start//////////////////////////////////////
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

function drawLegend(Location, Data){
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
var myLegend= drawLegend("topright",theophArr.subject);

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
//var colors = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];

for(var n = 1; n < theophArr.subject.length ; n++)
{
	if(n==1 ||  ( (n!=1) && (theophArr.subject[n] != theophArr.subject[n-1]) ) ) {
		var x = myLegend.x+10;
		var y = myLegend.y+plotLength+1.18*n-5;
		
		legendData.push({
			x: x,
			y: y,
			id: -1,
			color: colors[theophArr.subject[n]-1]
		});
	}
}
for(var n = 0; n < legendData.length; n++) 
{
	addNodeLegend(legendData[n], legendLayer);	
}
stage.add(legendLayer);
//////////////////////////////////////Legend End//////////////////////////////////////



//////////////////////////////////////Chk Start//////////////////////////////////////   
var messageLayer = new Kinetic.Layer();
stage.add(messageLayer);
function writeMessage(messageLayer){
	var context = messageLayer.getContext();
    messageLayer.clear();
    var colors2 = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];
	
	context.font = "12pt Calibri";
    context.fillStyle = "black";	    
    context.fillText("Selected Node", 10, 15);
    var cnt=0;
    var cnt2=0;
	for(var i=0; i<scatterData.length; i++){
		if(scatterData[i].selected==1){
			if(cnt>49){
				cnt=0;
				cnt2=cnt2+20;
			}
			cnt++;
			context.font = "8pt Calibri";
		    context.fillStyle = colors2[theophArr.subject[i]-1];	
		    context.fillText(i, 10+cnt2, 10*cnt+20);
	//	document.write("selected("+i+") is : "+scatterData.selected[i]+"<br>");
		}
	}
}
//////////////////////////////////////Chk End//////////////////////////////////////




