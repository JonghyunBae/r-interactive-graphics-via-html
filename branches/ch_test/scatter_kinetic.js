scatterIdStart = idCounter;
//var scatterIdEnd;
//var scatterX;
//var scatterY;


//////////////////////////////////////scatterStage Start//////////////////////////////////////
var scatterStage = new Kinetic.Stage({
	container: 'scatterContainer',
	
	width:   plotWidth+plotXmargin*2,
	height: plotHeight+plotYmargin*2
});

//////////////////////////////////////scatterStage Border Start//////////////////////////////////////
var scatterBorderLayer = new Kinetic.Layer();
var scatterRectBorder = new Kinetic.Rect({
	name: 'rectBorder',
	x: 0,
	y: 0,
	width: scatterStage.getWidth(),
	height: scatterStage.getHeight(),
	strokeWidth : 2
});
scatterBorderLayer.add(scatterRectBorder);
scatterStage.add(scatterBorderLayer);
//////////////////////////////////////scatterStage Border End//////////////////////////////////////  

//////////////////////////////////////Drawing Plot Start//////////////////////////////////////
var scatterPlotLayer= new Kinetic.Layer();  
drawBaseRect('black', scatterPlotLayer);
drawScale(scatterXMax, scatterXDiff, scatterYMax, scatterYDiff, scatterPlotLayer);
drawLabel(scatterXLabel, scatterYLabel, scatterPlotLayer);
drawMainLabel('Scatter of '+scatterXLabel+'&'+scatterYLabel, scatterPlotLayer);
scatterStage.add(scatterPlotLayer);
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
		strokeWidth : 0.01,
		opacity : 0.75,		
		draggable: false,
		selected : obj.selected
	});		
	layer.add(node);
}
//build data
var xScale=plotWidth/scatterXMax;//added by us
var yScale=plotHeight/scatterYMax; //added by us
var scatterData = [];

for(var n = 0; n < scatterXMain.length ; n++)
{
	var x = scatterXMain[n]*xScale+plotXmargin;
	var y = scatterYMain[n]*yScale+plotYmargin;
	var tmp=plotHeight/2+plotYmargin-y; 
	y=y+2*tmp; //since (0,0) of canvas is top-left, so we need to change it into bottom-left.
	scatterData.push({
		id: idCounter,
		name: dataGetName(n), //modify it using by for loop later.
		x: x,
		y: y,		
		color: setColor(scatterColor,n), 
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
scatterStage.add(scatterDataLayer);

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
scatterStage.add(scatterTooltipLayer);


function tooltipTextGetName(arr){	//"Subject: " + nameArr[0] +"\r\n"+ "Wt: " + nameArr[1] + "\r\n"+"Does: " + nameArr[2] +"\r\n"+ "Time: " + nameArr[3] + "\r\n"+"conc: " + nameArr[4] +"\r\n"
	var name=labelArr[0]+" : " + arr[0]+ "\r\n" ;
	for(var i=1; i< labelArr.length ; i++){
		name=name+ labelArr[i]+" : " + arr[i]+ "\r\n" ; //-------------------------csv2Arr(data, liveChar) has bug.....last column data includes "\n", should be removed...!!!!!!!!!!!!
	}
	return name;	
}

scatterDataLayer.on('mouseover', function(evt){
	document.body.style.cursor = "pointer";
	var node = evt.shape;
	var mousePos = node.getStage().getMousePosition();
	scatterTooltip.setPosition(mousePos.x + 8, mousePos.y + 8);
	var nameArr = new Array();
	nameArr = node.getName().split(',');		

	
	scatterTooltipText.setText("node : " + (node.getId() - scatterIdStart) +"\r\n"+ tooltipTextGetName(nameArr)+"color : " + node.getFill()); //naem split?
	scatterTooltipRect.setAttrs({
		width: scatterTooltipText.getWidth(),
		height: scatterTooltipText.getHeight()
	});

	scatterTooltip.show();
	scatterTooltipLayer.draw();
	node.moveToTop();
	var shapes = scatterStage.get('#'+node.getId());
	shapes.apply('transitionTo', {
		scale: { x : 1.5, y : 1.5 },
		duration: 0.1,
		easing: 'elastic-ease-out'
	});	
});

scatterDataLayer.on('mouseout', function(evt) {
	var node = evt.shape;
	document.body.style.cursor = "default";
	scatterTooltip.hide();
	scatterTooltipLayer.draw();	 
	var shapes = scatterStage.get('#'+node.getId());
	if(scatterData[node.getId() - scatterIdStart].selected > 0){//selected
		shapes.apply('transitionTo', {
			opacity: 1,
			scale: { x : 1.3, y : 1.3 },
			duration: 0.1,
			easing: 'elastic-ease-out'
		});
	}else{		  //unselected
		shapes.apply('transitionTo', {
			opacity: 0.75,
			scale:{ x : 1, y : 1 },
			duration: 0.1,
			easing: 'elastic-ease-out'
		});
	}
});	  
//////////////////////////////////////Tooltip End//////////////////////////////////////

//////////////////////////////////////Selection Start//////////////////////////////////////



scatterPlotLayer.on('click', function(evt){
	//var node = evt.shape;
//	alert(evt.button);
	if(evt.button == 0)
	{
		allDeselect();
		writeMsg(msgLayer);
		 tmpShift = false;
		 doRefresh();		
	}
	else if(evt.button == 2)
	{
		
	}
	
});
var preMousePos;
var aftMousePos;
var tmpMousePos;
var rangeBox = new Kinetic.Rect({
	x: 0,
	y: 0, 
	width : 0,
	height : 0,
	fill: "blue",
	stroke: "blue",						
	opacity : 0.3
});
var rangeBoxLayer = new Kinetic.Layer();
scatterStage.add(rangeBoxLayer);
rangeBoxLayer.add(rangeBox);
var tmptmp = 0;


scatterPlotLayer.on('mousedown touchstart', function(evt){
	if(tmptmp == 1){
		tmptmp = 0;
		rangeBoxLayer.draw();
	}else{
		var mousePos = scatterStage.getMousePosition();		
		rangeBox.setX(mousePos.x);
		rangeBox.setY(mousePos.y);
		rangeBox.setWidth(0);
		rangeBox.setHeight(0);
        tmptmp = 1;
        rangeBoxLayer.drawScene();
	}
}); 
scatterPlotLayer.on('mousemove touchmove', function(evt){
	if(tmptmp == 1){
		var mousePos = scatterStage.getMousePosition();
        var x = mousePos.x;
        var y = mousePos.y;
        rangeBox.setWidth(mousePos.x - rangeBox.getX());
        rangeBox.setHeight(mousePos.y - rangeBox.getY());
        tmptmp = true;
        rangeBoxLayer.drawScene();
	}
});
scatterPlotLayer.on('mouseup touchend', function(evt){
//	alert("dddddddd");
	rangeBox.setWidth(0);
	rangeBox.setHeight(0);
	tmptmp = 0;
	rangeBoxLayer.drawScene();	
	
});


scatterDataLayer.on('click', function(evt){
  	var node = evt.shape;
  	var shapes = scatterStage.get('#'+node.getId());
  	var semiNode;
  	var mousePos = {x: node.getX(), y:node.getY()};
  	var tmpNode;
  	
  	if(aPressed){	//select ALL
  		allSelect();
  		tmpShift = false;
  	}else if(gPressed){ //select by Group, (select every node whose subject is the same)
		allDeselect();
  		nameArr = node.getName().split(',');	
  		for(var i = 0 ; i < scatterData.length ; i++){
			var tmpNameArr = new Array();
			tmpNameArr = scatterData[i].name.split(',');	
			if(nameArr[0] == tmpNameArr[0]) //[0]안의 0값을 유듕적으로 바꿀 수 있게, idea는 key1누루면 1로 key2누르면 2로 바꾸면 될 듯...
			{
				tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
				allUpdate("scatter", tmpNode, i, 0)
			}
		}
		tmpShift = false;
	}else if(shiftPressed){
		allDeselect();
		tmpShift = true;
		if(preMousePos.x < mousePos.x)
		{
			if(preMousePos.y < mousePos.y)	{
				for(var i = 0 ; i < scatterData.length ; i++){
					if(preMousePos.x <= scatterData[i].x && scatterData[i].x <= mousePos.x && preMousePos.y <= scatterData[i].y && scatterData[i].y <= mousePos.y )
					{
						tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
						allUpdate("scatter", tmpNode, i, 0);
					}
				}
			}else if(mousePos.y < preMousePos.y){
				for(var i = 0 ; i < scatterData.length ; i++){
					if(preMousePos.x <= scatterData[i].x && scatterData[i].x <= mousePos.x && mousePos.y <= scatterData[i].y && scatterData[i].y <= preMousePos.y )
					{
						tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
						allUpdate("scatter", tmpNode, i, 0);
					}
				}
			}
		}else if(preMousePos.x > mousePos.x)
		{
			if(preMousePos.y < mousePos.y)	{
				for(var i = 0 ; i < scatterData.length ; i++){
					if(mousePos.x <= scatterData[i].x && scatterData[i].x <= preMousePos.x  && preMousePos.y <= scatterData[i].y && scatterData[i].y <= mousePos.y )
					{
						tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
						allUpdate("scatter", tmpNode, i, 0);
					}
				}
			}else if(mousePos.y < preMousePos.y){
				for(var i = 0 ; i < scatterData.length ; i++){
					if(mousePos.x <= scatterData[i].x && scatterData[i].x <= preMousePos.x && mousePos.y  <= scatterData[i].y && scatterData[i].y <= preMousePos.y  )
					{
						tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
						allUpdate("scatter", tmpNode, i, 0);
					}
				}
			}
		}	
	}else if(ctrlPressed){ //select mutiple node one by one.
  		if(scatterData[node.getId() - scatterIdStart].selected > 0){ // pre pressed state -> deselect rect & scatter
  			allUpdate("scatter", shapes, node.getId() - scatterIdStart, 1);
   		}else if(scatterData[node.getId() - scatterIdStart].selected == 0){ // unselected -> selected
   			allUpdate("scatter", shapes, node.getId() - scatterIdStart, 0);
  		}
  		tmpShift = false;
  	}else{
		tmpShift = false;
		allDeselect();
		allUpdate("scatter", shapes, node.getId() - scatterIdStart, 0);
  		
  	}  	
  	if(tmpShift == false)
	{
		preMousePos = mousePos;
	}  	
	writeMsg(msgLayer);
  	doRefresh();  	
}); 



function scatterSingleSelect(node, id)
{
	node.apply('setAttrs', {
		opacity: 1,
		strokeWidth : 2,
		stroke : 'red',
		scale: { x : 1.3, y : 1.3 }
	});
	scatterData[id].selected=1;
}

function scatterSingleDeselect(node, id)
{
	node.apply('setAttrs', {
		opacity: 0.75,
		strokeWidth : 0.01,
		stoke : 'green',
		scale: { x : 1, y : 1 }
	});
	scatterData[id].selected=0;
}

function scatterAllSelect()
{
	var node;
	for(var i = 0; i <scatterData.length ; i ++)
	{
		node = scatterStage.get("#"+ (i + scatterIdStart));
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
		node = scatterStage.get("#"+ (i + scatterIdStart));
		if(scatterData[i].selected == 1)
		{
			scatterSingleDeselect(node, i);
		}
	}
}

function scatterUpdate(rectId, eraseOn)
{
	var node;
	if(eraseOn == 0)	{
		for(var i = 0 ; i< histHasArr[rectId].length ; i ++)
		{	
			node = scatterStage.get("#" + scatterData[histHasArr[rectId][i]].id);
			scatterSingleSelect(node, histHasArr[rectId][i]);
		}
	}else if(eraseOn == 1){ 
		for(var i = 0 ; i< histHasArr[rectId].length ; i ++)
		{
			node = scatterStage.get("#" + scatterData[histHasArr[rectId][i]].id);
			if(scatterData[histHasArr[rectId][i]].selected  == 1)
			{
				scatterSingleDeselect(node, histHasArr[rectId][i]);
			}			
		}
	}
}

//////////////////////////////////////Selection End//////////////////////////////////////


//////////////////////////////////////Legend Start//////////////////////////////////////
if(legend ==true)
{
	drawLegend("topright",scatterColor, scatterStage);
}
//////////////////////////////////////Legend End//////////////////////////////////////

