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


//////////////////////////////////////Drawing Plot Start//////////////////////////////////////
var scatterPlotLayer= new Kinetic.Layer();  
drawBaseRect('black', scatterPlotLayer);
drawScale(scatterXMax, scatterXDiff, scatterYMax, scatterYDiff, scatterPlotLayer);
drawLabel(scatterXLabel, scatterYLabel, scatterPlotLayer);
drawMainLabel('Scatter of '+scatterXLabel+'&'+scatterYLabel, scatterPlotLayer);
scatterStage.add(scatterPlotLayer);
//////////////////////////////////////Drawing Plot End//////////////////////////////////////

//////////////////////////////////////Legend Start//////////////////////////////////////
if(legend ==true)
{
drawLegend("topright",scatterColor, scatterStage);
}
//////////////////////////////////////Legend End//////////////////////////////////////

//add node function.

var scatterNode = new Array(mainArr[0].length);
function scatterAddNode(number, obj, layer) 
{
	scatterNode[number] = new Kinetic.Circle({
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
	layer.add(scatterNode[number] );
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
	scatterAddNode(n, scatterData[n], scatterDataLayer);
}
scatterStage.add(scatterDataLayer);
alert(scatterNode[0].x);
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

//////////////////////////////////////Menu Start//////////////////////////////////////
var scatterMenuOn = false;
var scatterMenuLayer = new Kinetic.Layer();
var scatterMenu = new Kinetic.Group({
	opacity: 0.95,
	visible: false
});
var scatterMenuTextHide = new Kinetic.Text({
	text: '',
	fontFamily: 'Calibri',
	fontSize: 15,
	padding: 5,
	fill: 'white'
});	  
/*var scatterMenuTextDelete = new Kinetic.Text({
	y:50,
	text: '',
	fontFamily: 'Calibri',
	fontSize: 15,
	padding: 5,
	fill: 'white'
});	  */
var scatterMenuTextReset = new Kinetic.Text({
	y:25,
	text: '',
	fontFamily: 'Calibri',
	fontSize: 15,
	padding: 5,
	fill: 'white'
});	  
var scatterMenuRectHide = new Kinetic.Rect({
	width: 100,
	height: 25,
	fill: '#6b6164'
});
/*var scatterMenuRectDelete = new Kinetic.Rect({
	y:50,
	width: 100,
	height: 25,
	fill: '#6b6164'
});*/
var scatterMenuRectReset = new Kinetic.Rect({
	y:25,
	width: 100,
	height: 25,
	fill: '#6b6164'
});

scatterMenu.add(scatterMenuRectHide).add(scatterMenuTextHide);
//scatterMenu.add(scatterMenuRectDelete).add(scatterMenuTextDelete);
scatterMenu.add(scatterMenuRectReset).add(scatterMenuTextReset);
scatterMenuLayer.add(scatterMenu);
scatterStage.add(scatterMenuLayer);

scatterMenuTextHide.setText(" Hide"); 
//scatterMenuTextDelete.setText(" Delete"); 
scatterMenuTextReset.setText(" Reset"); 

scatterMenuTextHide.on('click', function(evt){
	hideSelected();
	scatterMenuOn=false;
	scatterMenu.hide();
	scatterMenuLayer.draw();	
});
scatterMenuRectHide.on('click', function(evt){
	hideSelected();	
	scatterMenuOn=false;
	scatterMenu.hide();
	scatterMenuLayer.draw();	
});
scatterMenuTextHide.on('mouseover', function(evt){
	scatterMenuRectHide.setFill('#d8c7a9');
	scatterMenuTextHide.setFill('#black');
    scatterMenuLayer.draw();
});
scatterMenuRectHide.on('mouseover', function(evt){
	scatterMenuRectHide.setFill('#d8c7a9');
	scatterMenuTextHide.setFill('#black');
    scatterMenuLayer.draw();
});
scatterMenuTextHide.on('mouseout', function(evt){
 	scatterMenuRectHide.setFill('#6b6164');
 	scatterMenuTextHide.setFill('white');
    scatterMenuLayer.draw();
});
scatterMenuRectHide.on('mouseout', function(evt){
	scatterMenuRectHide.setFill('#6b6164');
	scatterMenuTextHide.setFill('white');
     scatterMenuLayer.draw();
});
/*
 scatterMenuTextDelete.on('click', function(evt){
	deleteSelected();
	scatterMenuOn=false;
	scatterMenu.hide();
	scatterMenuLayer.draw();	
});
scatterMenuRectDelete.on('click', function(evt){
	deleteSelected();
	scatterMenuOn=false;
	scatterMenu.hide();
	scatterMenuLayer.draw();	
});
scatterMenuTextDelete.on('mouseover', function(evt){
	scatterMenuRectDelete.setFill('#d8c7a9');
	scatterMenuTextDelete.setFill('#black');
    scatterMenuLayer.draw();
});
scatterMenuRectDelete.on('mouseover', function(evt){
	scatterMenuRectDelete.setFill('#d8c7a9');
	scatterMenuTextDelete.setFill('#black');
     scatterMenuLayer.draw();
});
scatterMenuTextDelete.on('mouseout', function(evt){
	scatterMenuRectDelete.setFill('#6b6164');
	scatterMenuTextDelete.setFill('white');
    scatterMenuLayer.draw();
});
scatterMenuRectDelete.on('mouseout', function(evt){
	scatterMenuRectDelete.setFill('#6b6164');
	scatterMenuTextDelete.setFill('white');
    scatterMenuLayer.draw();
});
*/

scatterMenuTextReset.on('click', function(evt){
	resetSelected();
	scatterMenuOn=false;
	scatterMenu.hide();
	scatterMenuLayer.draw();	
});
scatterMenuRectReset.on('click', function(evt){
	resetSelected();
	scatterMenuOn=false;
	scatterMenu.hide();
	scatterMenuLayer.draw();	
});
scatterMenuTextReset.on('mouseover', function(evt){
	scatterMenuRectReset.setFill('#d8c7a9');
	scatterMenuTextReset.setFill('#black');
    scatterMenuLayer.draw();
});
scatterMenuRectReset.on('mouseover', function(evt){
	scatterMenuRectReset.setFill('#d8c7a9');
	scatterMenuTextReset.setFill('#black');
     scatterMenuLayer.draw();
});
scatterMenuTextReset.on('mouseout', function(evt){
	scatterMenuRectReset.setFill('#6b6164');
	scatterMenuTextReset.setFill('white');
    scatterMenuLayer.draw();
});
scatterMenuRectReset.on('mouseout', function(evt){
	scatterMenuRectReset.setFill('#6b6164');
	scatterMenuTextReset.setFill('white');
    scatterMenuLayer.draw();
});



scatterPlotLayer.on('click', function(evt){ // mouse drag하고나서 연속클릭되어 망치는 것 방지.
	if ((evt.which && evt.which == 3) || (evt.button && evt.button == 2)){ //right click
		if(scatterMenuOn==false){
			scatterMenuOn=true;
			//alert('right clicked');
			var node = evt.shape;
			// update menu
			var mousePos = node.getStage().getMousePosition();
			scatterMenu.setPosition(mousePos.x + 8, mousePos.y + 8);
			scatterMenu.show();
			scatterMenuLayer.draw();
		}else{//scatterMenuOn==true
			scatterMenuOn=false;
			scatterMenu.hide();
			scatterMenuLayer.draw();			
		}
	}else if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
		if(scatterMenuOn==true){
			scatterMenuOn=false;
			scatterMenu.hide();
			scatterMenuLayer.draw();
		}		
	}	
});

//////////////////////////////////////Menu End//////////////////////////////////////

//////////////////////////////////////Selection Start//////////////////////////////////////
/*
scatterPlotLayer.on('click', function(evt){
	//allDeselect();
	writeMsg(msgLayer);
	doRefresh();	 
	saveWork();
});
*/
var preMousePos = {x: -1, y:-1};
scatterPlotLayer.on('click', function(evt){ // mouse drag하고나서 연속클릭되어 망치는 것 방지.
	if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click		
		if(downOn == true)								// 그리고 연속클릭 가능하게 함.
		{  		
	  		downOn = false;
		  	return; //????????????
		}
	}	
});

scatterDataLayer.on('click', function(evt){
	if ((evt.which && evt.which == 3) || (evt.button && evt.button == 2)){ //right click
		//add menu for (de)selection, group selection, delete, hide, ...
	
	}else if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
		var node = evt.shape;
		
	  	var shapes = scatterStage.get('#'+node.getId());
	  	
	  	var semiNode;
	  	
	  	var mousePos = {x: node.getX(), y:node.getY()};
	  	var tmpNode;

	  	if(downOn == true)
		{  		
	  		downOn = false;
		  	return;
		}
	  	if(scatterMenuOn==true){
			scatterMenuOn=false;
			scatterMenu.hide();
			scatterMenuLayer.draw();
		}
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
					allUpdate("scatter", tmpNode, i, 0);
				}
			}
			tmpShift = false;
		}else if(shiftPressed && preMousePos.x != -1 && preMousePos.y != -1){
			allDeselect();
			tmpShift = true;
			if(preMousePos.x < mousePos.x)
			{
				if(preMousePos.y < mousePos.y)	{
					for(var i = 0 ; i < scatterData.length ; i++){
						if(preMousePos.x <= scatterData[i].x && scatterData[i].x <= mousePos.x && preMousePos.y <= scatterData[i].y && scatterData[i].y <= mousePos.y )
						{
							if(scatterData[i].selected == 0)
							{
								tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
								allUpdate("scatter", tmpNode, i, 0);
							}						
						}
					}
				}else if(mousePos.y < preMousePos.y){
					for(var i = 0 ; i < scatterData.length ; i++){
						if(preMousePos.x <= scatterData[i].x && scatterData[i].x <= mousePos.x && mousePos.y <= scatterData[i].y && scatterData[i].y <= preMousePos.y )
						{
							if(scatterData[i].selected == 0)
							{
								tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
								allUpdate("scatter", tmpNode, i, 0);
							}
						}
					}
				}
			}else if(preMousePos.x > mousePos.x)
			{
				if(preMousePos.y < mousePos.y)	{
					for(var i = 0 ; i < scatterData.length ; i++){
						if(mousePos.x <= scatterData[i].x && scatterData[i].x <= preMousePos.x  && preMousePos.y <= scatterData[i].y && scatterData[i].y <= mousePos.y )
						{
							if(scatterData[i].selected == 0)
							{
								tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
								allUpdate("scatter", tmpNode, i, 0);
							}
						}
					}
				}else if(mousePos.y < preMousePos.y){
					for(var i = 0 ; i < scatterData.length ; i++){
						if(mousePos.x <= scatterData[i].x && scatterData[i].x <= preMousePos.x && mousePos.y  <= scatterData[i].y && scatterData[i].y <= preMousePos.y  )
						{
							if(scatterData[i].selected == 0)
							{
								tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
								allUpdate("scatter", tmpNode, i, 0);
							}
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
			//alert("dddd");
			allUpdate("scatter", shapes, (node.getId() - scatterIdStart), 0); 	
	  	}  	
	  	if(tmpShift == false)
		{
			preMousePos = mousePos;
		}
	  	saveWork();
		//writeMsg(msgLayer);
		addRow('dataTable');
	  	doRefresh();  	

		
	}
	
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
			if(scatterData[histHasArr[rectId][i]].selected == 0)
			{
				node = scatterStage.get("#" + scatterData[histHasArr[rectId][i]].id);
				scatterSingleSelect(node, histHasArr[rectId][i]);
			}			
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

//////////////////////////////////////Drag Selection Start//////////////////////////////////////

var preDragMousePos;
var aftDragMousePos;

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
var moving = false;
var downOn = false;


scatterPlotLayer.on('mousedown touchstart', function(evt){
	if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
		downOn = true; 
		preDragMousePos={x: (evt.pageX-divOffsetX), y: (evt.pageY-divOffsetY)};
		if(moving == true){
			moving = false;
			rangeBoxLayer.draw();
		}else{
			var mousePos = scatterStage.getMousePosition();		
			rangeBox.setX(mousePos.x);
			rangeBox.setY(mousePos.y);
			rangeBox.setWidth(0);
			rangeBox.setHeight(0);
			moving = true;
			rangeBoxLayer.drawScene();
		}
	}
}); 


/*
scatterStage.on('mousemove touchmove', function(evt){
	if(moving == true){
		var mousePos = scatterStage.getMousePosition();
		var x = mousePos.x;
		var y = mousePos.y;
		rangeBox.setWidth(mousePos.x - rangeBox.getX());
		rangeBox.setHeight(mousePos.y - rangeBox.getY());
		moving = true;
		rangeBoxLayer.drawScene();
	}
});

scatterPlotLayer.on('mouseup touchend', function(evt){
	aftDragMousePos={x: (evt.pageX-plotXmargin-scatterStageX)*scatterXMax/plotWidth, y: -(evt.pageY-plotYmargin-plotHeight-scatterStageY)*scatterYMax/plotHeight};	//	alert("dddddddd");
	scatterRectRange(aftDragMousePos);			
	//alert(preDragMousePos.x+', '+preDragMousePos.y+', '+aftDragMousePos.x+', '+aftDragMousePos.y);	
});
*/
window.addEventListener ("mousemove", function (evt){
	if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
		
		if(moving == true)
		{
			//alert("dddd");
			var mousePos = {x: (evt.pageX-divOffsetX), y: (evt.pageY-divOffsetY)};
				//	var mousePos2 = scatterStage.getMousePosition();
		//	mousePos.x = mousePos.x + 
		//	mousePos.x = mousePos.x*(plotWidth/scatterXMax);
		//	var mousePos = scatterStage.getMousePosition(); // px 단위
			var x, y;
			x = mousePos.x;// + plotXmargin;
			y = mousePos.y; //+ plotYmargin + plotHeight;
		//	alert(mousePos.x +","+ mousePos2.x +","+ rangeBox.getY() );
			
		//	var x = mousePos.x;
		//	var y = mousePos.y;
	/*	if(x > plotWidth + plotXmargin + plotLength)
			{
				x = plotWidth + plotXmargin + plotLength;
			}else if(x < plotXmargin - plotLength)
			{
				x = plotXmargin - plotLength;
			}		
			if(y > plotHeight + plotYmargin + plotLength)
			{
				y = plotHeight + plotYmargin + plotLength;
			}else if(y < plotYmargin - plotLength)
			{
				y = plotYmargin - plotLength;
			}*/
			//aftDragMousePos = {x: mousePos.x*scatterXMax/plotWidth, y:mousePos.y*scatterYMax/plotHeight};
	
			rangeBox.setWidth(x- rangeBox.getX());
			rangeBox.setHeight(y- rangeBox.getY());
			rangeBoxLayer.drawScene();
		}
	}
}, true);

window.addEventListener ("mouseup", function (evt){
	if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
		if(moving == true)
		{
			aftDragMousePos={x: (evt.pageX-divOffsetX), y: (evt.pageY-divOffsetY)};	
			//alert(aftDragMousePos.x);
			scatterRectRange(aftDragMousePos);
		}
	}
}, true);

function scatterRectRange(afterPosition)
{		
	var tmpNode;	
	var prePosition;
	rangeBox.setWidth(0);
	rangeBox.setHeight(0);
	rangeBoxLayer.drawScene();
	prePosition = preDragMousePos;	
	moving = false;

	if(ctrlPressed == false)
	{
		allDeselect();
	}
	if(prePosition.x < afterPosition.x)
	{
		if(prePosition.y < afterPosition.y)	{
			for(var i = 0 ; i < scatterData.length ; i++){
				if(prePosition.x <= scatterData[i].x && scatterData[i].x <= afterPosition.x && prePosition.y <= scatterData[i].y && scatterData[i].y <= afterPosition.y )
				{
					if(ctrlPressed == false)
					{
						if(scatterData[i].selected == 0)
						{
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 0);
						}
					}else{
						if(scatterData[i].selected == 0)
						{
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 0);
						}else if(scatterData[i].selected == 1){
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 1);
						}						
					}
				}
			}
		}else if(afterPosition.y < prePosition.y){
			for(var i = 0 ; i < scatterData.length ; i++){
				if(prePosition.x <= scatterData[i].x && scatterData[i].x <= afterPosition.x && afterPosition.y <= scatterData[i].y && scatterData[i].y <= prePosition.y )
				{
					if(ctrlPressed == false)
					{
						if(scatterData[i].selected == 0)
						{
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 0);
						}
					}else{
						if(scatterData[i].selected == 0)
						{
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 0);
						}else if(scatterData[i].selected == 1){
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 1);
						}						
					}
				}
			}
		}
	}else if(prePosition.x > afterPosition.x)
	{
		if(prePosition.y < afterPosition.y)	{
			for(var i = 0 ; i < scatterData.length ; i++){
				if(afterPosition.x <= scatterData[i].x && scatterData[i].x <= prePosition.x  && prePosition.y <= scatterData[i].y && scatterData[i].y <= afterPosition.y )
				{
					if(ctrlPressed == false)
					{
						if(scatterData[i].selected == 0)
						{
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 0);
						}
					}else{
						if(scatterData[i].selected == 0)
						{
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 0);
						}else if(scatterData[i].selected == 1){
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 1);
						}						
					}
				}
			}
		}else if(afterPosition.y < prePosition.y){
			for(var i = 0 ; i < scatterData.length ; i++){
				if(afterPosition.x <= scatterData[i].x && scatterData[i].x <= prePosition.x && afterPosition.y  <= scatterData[i].y && scatterData[i].y <= prePosition.y  )
				{
					if(ctrlPressed == false)
					{
						if(scatterData[i].selected == 0)
						{
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 0);
						}
					}else{
						if(scatterData[i].selected == 0)
						{
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 0);
						}else if(scatterData[i].selected == 1){
							tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
			    			allUpdate("scatter", tmpNode, i, 1);
						}						
					}
				}
			}
		}
	}
//	writeMsg(msgLayer);
	addRow('dataTable');
  	doRefresh();  	
  	saveWork();
 // 	downOn = false;
	
}

//////////////////////////////////////Drag Selection End//////////////////////////////////////



////////////////////////////Hide Start ///////////////////////////////////
function hideSelected()
{
	
	for(var i = 0 ; i < mainArr[0].length ; i ++)
	{
		if(scatterData[i].selected == 1)
		{
			var node = scatterStage.get("#"+ (i + scatterIdStart));
			scatterSingleDeselect(node, i);
			scatterData[i].selected = 3;
			scatterNode[i].hide();
			histHide(scatterXMain[i]);
		}
	}
	scatterDataLayer.draw();	
	doRefresh();
	//writeMsg(msgLayer);
	addRow('dataTable');
}
function histHide(xData)
{
	var id = parseInt(xData/diffHist);
	var node = histStage.get("#"+ (id + histIdStart));
	histData[id].selected = histData[id].selected - 1;
	histArr[id] = histArr[id] - 1;
	var tmp = histArr[id] * plotHeight / histYMax;
	if(histData[id].selected == 0)
	{
		histSingleDeselect(node, id);
	}
	node.apply('setAttrs', {
		height : tmp,
		y : plotYmargin + plotHeight - tmp + tmp/2,
		offset: {x: width/2, y: tmp/2},
		name: histArr[id] 		
	});	
}
////////////////////////////Hide End//////////////////////////////////
///////////////////////////Reset Start ////////////////////////////////
function resetSelected()
{
	
	for(var i = 0 ; i < mainArr[0].length ; i ++)
	{
		if(scatterData[i].selected == 3)
		{
			scatterData[i].selected = 0;
			scatterNode[i].show();
			histReset(scatterXMain[i]);
		}
	}
	scatterDataLayer.draw();	
	doRefresh();
//	writeMsg(msgLayer);
	addRow('dataTable');
}
function histReset(xData)
{
	var id = parseInt(xData/diffHist);
	var node = histStage.get("#"+ (id + histIdStart));
	histData[id].selected = histData[id].selected + 1;
	histArr[id] = histArr[id] + 1;
	var tmp = histArr[id] * plotHeight / histYMax;
	if(histData[id].selected == 0)
	{
		histSingleDeselect(node, id);
	}
	node.apply('setAttrs', {
		height : tmp,
		y : plotYmargin + plotHeight - tmp + tmp/2,
		offset: {x: width/2, y: tmp/2},
		name: histArr[id] 		
	});	
}
///////////////////////////Reset End ////////////////////////////////

/*
///////////////////////////Delete Start ////////////////////////////////
function deleteSelected()
{
	
	for(var i = 0 ; i < mainArr[0].length ; i ++)
	{
		if(scatterData[i].selected == 1)
		{
			var node = scatterStage.get("#"+ (i + scatterIdStart));
			scatterSingleDeselect(node, i);
			scatterData[i].selected = 4;
			scatterNode[i].hide();
			histHide(scatterXMain[i]);
		}
	}
	scatterDataLayer.draw();	
	doRefresh();
//	writeMsg(msgLayer);
	addRow('dataTable');
}
/////////////////////////Delete End ////////////////////////////////

*/