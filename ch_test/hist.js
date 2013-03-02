
var histHasArr;
histIdStart = idCounter;
//var histIdEnd;

var histArr = new Array();
histArr = drawDataHist(histXMax,histYMax,histXMain, diffHist);	 

function drawDataHist(histXMax,histYMax,xData,a)
{
	var tmpHistArr = new Array();
	var cnt=0;
	var col = 0;
	histHasArr=make2DArr(parseInt(histXMax/a +1) );
	
	for (var i=0; i<parseInt(histXMax/a ); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	
	for(cnt=0; cnt< parseInt(histXMax/a ); cnt++)//count how many data in certain range and save the value into tmpHistArr.
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*a && xData[i]<(cnt+1)*a)
			{
				tmpHistArr[cnt]++;
				histHasArr[cnt][col] = i;
				col++;
			}
		}
		col = 0;
	}			
	return tmpHistArr;
}

//////////////////////////////////////histStage Start//////////////////////////////////////
  var histStage = new Kinetic.Stage({
    container: 'histContainer',

    width: plotWidth+plotXmargin*2 ,
    height: plotHeight+plotYmargin*2 
  });
 //histStage.setAbsolutePosition(200,200);
  
//////////////////////////////////////Drawing histPlot Start//////////////////////////////////////
var histPlotLayer = new Kinetic.Layer();
drawBaseRect('white', histPlotLayer);
var histXAxis = new Kinetic.Line({
	name: 'histXAxis',
	points: [plotXmargin, plotYmargin+plotHeight+plotLength, plotXmargin+parseInt(histXMax/histXDiff)*plotWidth/(histXMax/histXDiff),  plotYmargin+plotHeight+plotLength],
	stroke: 'black',
	strokeWidth: 2,		     
});
var histYAxis = new Kinetic.Line({
	points: [plotXmargin-plotLength, plotYmargin+plotHeight-parseInt(histYMax/histYDiff)*plotHeight/(histYMax/histYDiff) ,plotXmargin-plotLength,  plotYmargin+plotHeight],
	stroke: 'black',
	strokeWidth: 2,		     
});
histPlotLayer.add(histXAxis);
histPlotLayer.add(histYAxis);
drawScale(histXMax, histXDiff, histYMax, histYDiff, histPlotLayer);
drawLabel(histXLabel, 'Frequency', histPlotLayer);
drawMainLabel('Histogram of ' + histXLabel, histPlotLayer);
histStage.add(histPlotLayer);
histPlotLayer.on('mouseover mousemove dragmove', function(evt){  
	document.body.style.cursor = "default";
});

//////////////////////////////////////Drawing histPlot End//////////////////////////////////////
 
//add node function.
function histAddNode(obj, layer) 
{
	var node = new Kinetic.Rect({
		id: obj.id,
		name: obj.name,
		x: obj.x,
		y: obj.y, 
		width: obj.width,
		height: obj.height,
		fill: obj.color,
		stroke: obj.stroke,						
		opacity : 0.5,
		draggable: false,
		selected : 0,
		offset: obj.offset
	});
	layer.add(node);
  }

  // build data
var xCanvasWidth = plotXmargin;//added by us
var yCanvasHeight = histStage.height-plotYmargin-plotHeight; //added by us
var xScale=plotWidth/histXMax;//added by us
var yScale=plotHeight/histYMax; //added by us
var histData = [];

for(var n = 0; n <histArr.length ; n++)
{
	var width = plotWidth / parseInt(histXMax/diffHist); 
	var height = histArr[n] * plotHeight / histYMax;
	var x = plotXmargin +  n * plotWidth / parseInt(histXMax/diffHist) + width/2;
	var y = plotYmargin + plotHeight - height + height/2;
	histData.push({
		id: idCounter,
		name: histArr[n] , //frequency
		x: x,
		y: y,
		width: width,
		height: height,	        
		stroke: 'black',
		color: 'green',
		offset: {x: width/2, y: height/2},
		selected : 0 // 0 means : unselected ,  0 < means : selected
	});
	idCounter ++;
}
histIdEnd = idCounter - 1;

  // render data
//  var histNodeCount = 0;
  var histDataLayer = new Kinetic.Layer();
  for(var n = 0; n < histData.length; n++) 
  {
    histAddNode(histData[n], histDataLayer);
  }
  histStage.add(histDataLayer);  
  
//////////////////////////////////////hist Tooltip Start//////////////////////////////////////

var histTooltipLayer = new Kinetic.Layer();
var histTooltip = new Kinetic.Group({
	opacity: 0.75,
	visible: false
});
var histTooltipText = new Kinetic.Text({
	text: '',
	fontFamily: 'Calibri',
	fontSize: 18,
	padding: 5,
	fill: 'white'
});	  
var histTooltipRect = new Kinetic.Rect({
	fill: 'black'
});
  
histTooltip.add(histTooltipRect).add(histTooltipText);
histTooltipLayer.add(histTooltip);
histStage.add(histTooltipLayer);
  
 

histDataLayer.on('mouseover', function(evt){
	document.body.style.cursor = "pointer";
	var node = evt.shape;
// update tooltip
	var mousePos = node.getStage().getMousePosition();
	histTooltip.setPosition(mousePos.x + 8, mousePos.y + 8);
	histTooltipText.setText("node: " + (node.getId()-histIdStart) + ", Frequency: " + node.getName()); //Name split?
	histTooltipRect.setAttrs({
		width: histTooltipText.getWidth(),
		height: histTooltipText.getHeight()
	});
	histTooltip.show();
	histTooltipLayer.draw();
	node.moveUp();
	var shapes = histStage.get('#'+node.getId());
	shapes.apply('transitionTo', {
		opacity: 1,
		scale: {	x : 1.15, y : 1.01 },
		duration: 0.1,
		easing: 'elastic-ease-out'
	});    	
}); 	    

histDataLayer.on('mouseout', function(evt) {
	var node = evt.shape;
	node.moveDown();
	document.body.style.cursor = "default";
	histTooltip.hide();
	histTooltipLayer.draw();
	var shapes = histStage.get('#'+node.getId());  
	if(histData[node.getId() - histIdStart].selected > 0){//selected
		shapes.apply('transitionTo', {
			opacity: 1,
			scale:{ x : 1, y : 1 },
			duration: 0.1,
			easing: 'elastic-ease-out'
		});
	}else{		  //unselected
		shapes.apply('transitionTo', {
			opacity: 0.5,
			scale:{ x : 1, y : 1 },
			duration: 0.1,
			easing: 'elastic-ease-out'
		});
	}
   
	//if(msgShow==true){
	//	writeMsg(msgLayer);
		addRow('dataTable');
//	}
});	 
//////////////////////////////////////hist Tooltip End//////////////////////////////////////
  
//////////////////////////////////////Selection Start//////////////////////////////////////
var preId = -1;
histPlotLayer.on('click', function(evt){
	allDeselect();
//	writeMsg(msgLayer);
	addRow('dataTable');
	doRefresh();	 
});
histDataLayer.on('click', function(evt){
  	var node = evt.shape;
  	var shapes = histStage.get('#'+node.getId());
  	var tmpNode;
  	if(aPressed){	//select ALL
  		allSelect();
  		tmpShift = false;
  	}else if(shiftPressed && preId != -1){
  		tmpShift = true;
  		allDeselect();
		if(preId > node.getId()){
			for(var i = node.getId() - histIdStart ; i < preId + 1 - histIdStart ; i++)
			{
				tmpNode = histStage.get("#"+ (i + histIdStart));
				allUpdate("hist", tmpNode, i, 0);
			}
		}else if(preId < node.getId()){
			for(var i = preId - histIdStart  ; i < node.getId() + 1 - histIdStart ; i++)
			{
				tmpNode = histStage.get("#"+ (i + histIdStart));
				allUpdate("hist", tmpNode, i, 0);
			}
		} 
	}else if(ctrlPressed){ //select mutiple node one by one.
  		if(histData[node.getId() - histIdStart].selected > 0){ // pre pressed state -> deselect rect & scatter
  			allUpdate("hist", shapes, node.getId() - histIdStart, 1);
  		}else if(histData[node.getId() - histIdStart].selected == 0){ // unselected -> selected
  			allUpdate("hist", shapes, node.getId() - histIdStart, 0);
  		}
  		tmpShift = false;
  	}else{ 	// just one click
		tmpShift = false;
		allDeselect();
		allUpdate("hist", shapes, node.getId() - histIdStart, 0);
  	}  	
  	if(tmpShift == false)
	{
		preId = node.getId();
	}
  	saveWork();
  	doRefresh();
 //	writeMsg(msgLayer);
 	addRow('dataTable');
 	
}); 

function histUpdate(xData, eraseOn)
{
	var id = parseInt(xData/diffHist);
	var node = histStage.get("#"+ (id + histIdStart));
	
	if(eraseOn == 0)	{		
		histData[id].selected = histData[id].selected + 1;
		histSingleSelect(node, -1);
	}else if(eraseOn == 1){  // ctrl press - erase
		histData[id].selected = histData[id].selected - 1;
		if(histData[id].selected == 0)
		{
			histSingleDeselect(node, id);
		}
	}
}

function histSingleSelect(node, id)
{
	node.apply('setAttrs', {
		opacity: 1,
		scale: { x : 1.05, y : 1 }
	});
	if(id != -1)
	{
		histData[id].selected=histArr[id];
	}	
}

function histSingleDeselect(node, id)
{
	node.apply('setAttrs', {
		opacity: 0.5,
		scale: { x : 1, y : 1 }
	});
	histData[id].selected = 0;
}

function histAllSelect()
{
	var node;
	for(var i = 0; i <histArr.length ; i ++)
	{
		node = histStage.get("#"+ (i + histIdStart));
		histSingleSelect(node, i);		
	}
}

function histAllDeselect()
{
	var node;
	for(var i = 0; i <histArr.length ; i ++)
	{
		node = histStage.get("#"+ (i + histIdStart));
		histSingleDeselect(node, i);
	}
}
  //////////////////////////////////////Selection End//////////////////////////////////////
 