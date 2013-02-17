
var histHasArr;
var histIdStart = idCounter;
var histIdEnd;
var histArr = new Array();
//document.write(histIdStart);
histArr = drawDataHist(xMaxHist,yMaxHist,theophArr.time, diffHist);	 

function drawDataHist(xMaxHist,yMaxHist,xData,a)
{
	var tmpHistArr = new Array();
	var cnt=0;
	var col = 0;
	histHasArr=make2DArr(parseInt(xMaxHist/a +1) );
	
	for (var i=0; i<parseInt(xMaxHist/a ); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	
	for(cnt=0; cnt< parseInt(xMaxHist/a ); cnt++)//count how many data in certain range and save the value into tmpHistArr.
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

//////////////////////////////////////Stage1(hist) Start//////////////////////////////////////
  var stage1 = new Kinetic.Stage({
    container: 'container',
    width: 800,
    height: 800
  });
  
//////////////////////////////////////Drawing histPlot Start//////////////////////////////////////
var histPlotLayer = new Kinetic.Layer();

//Draw Rectangle
var histplotRect = new Kinetic.Rect({
	x: plotXmargin-plotLength,
	y: plotYmargin-plotLength,
	width: plotWidth+2*plotLength,
	height: plotHeight+2*plotLength,
	stroke: 'white',
	strokeWidth: 2
}); 
histPlotLayer.add(histplotRect);

var rect = new Kinetic.Line({
	points: [plotXmargin-plotLength, plotYmargin+plotHeight-parseInt(yMaxHist/yDiffHist)*plotHeight/(yMaxHist/yDiffHist) ,plotXmargin-plotLength,  plotYmargin+plotHeight],
	stroke: 'black',
	strokeWidth: 2,		     
});
var rect1 = new Kinetic.Line({
	points: [plotXmargin, plotYmargin+plotHeight+plotLength, plotXmargin+parseInt(xMaxHist/xDiffHist)*plotWidth/(xMaxHist/xDiffHist),  plotYmargin+plotHeight+plotLength],
	stroke: 'black',
	strokeWidth: 2,		     
});
histPlotLayer.add(rect);
histPlotLayer.add(rect1);

for(var i=0; i<parseInt(xMaxHist/xDiffHist)+1; i++)
{
	var xLine = new Kinetic.Line({
	points: [plotXmargin+i*plotWidth/(xMaxHist/xDiffHist) ,plotYmargin+plotHeight+plotLength, plotXmargin+i*plotWidth/(xMaxHist/xDiffHist),plotYmargin+plotHeight+2*plotLength],
	stroke: 'black',
	strokeWidth: 2,		     
	});
	histPlotLayer.add(xLine);	   		
	var xText = new Kinetic.Text({
		x: plotXmargin+i*plotWidth/(xMaxHist/xDiffHist)-10,
		y: plotYmargin+plotHeight+plotLength*2,
		text: i*xDiffHist,
		fontSize: 15,
		fontFamily: 'Calibri',
		fill: 'black',
		width: 20,
		align: 'center'	
	});		   
	histPlotLayer.add(xText);			
}

for(var i=0; i<parseInt(yMaxHist/yDiffHist)+1; i++)
{
	var yLine = new Kinetic.Line({
		points: [plotXmargin-plotLength, plotYmargin+plotHeight-i*plotHeight/(yMaxHist/yDiffHist) , plotXmargin-2*plotLength,plotYmargin+plotHeight-i*plotHeight/(yMaxHist/yDiffHist)],
		stroke: 'black',
		strokeWidth: 2,		     
	});
	histPlotLayer.add(yLine);	   
	yText = new Kinetic.Text({
		x: plotXmargin-plotLength*2-15,
		y: plotYmargin+plotHeight-i*plotHeight/(yMaxHist/yDiffHist)+10,
		text: i*yDiffHist,
		fontSize: 15,
		fontFamily: 'Calibri',
		fill: 'black',
		width: 20,
		align: 'center',
		rotation: (Math.PI)*3/2
	});		   
	histPlotLayer.add(yText);		
}		

xLabel = new Kinetic.Text({
	x: plotXmargin+plotWidth/2-40,
	y: plotYmargin+plotHeight+4*plotLength,
	text: 'Theoph$Time',
	fontSize: 15,
	fontFamily: 'Calibri',
	fill: 'black',
	//    width: 100,
	align: 'center'
});		   
histPlotLayer.add(xLabel);		

	
yLabel = new Kinetic.Text({
	x: plotXmargin-5*plotLength,
	y: plotYmargin+plotHeight/2,
	text: 'Frequency',
	fontSize: 15,
	fontFamily: 'Calibri',
	fill: 'black',
	//   width: plotHeight*0.8,
	align: 'center',
	rotation: (Math.PI)*3/2
});		   
histPlotLayer.add(yLabel);	

//Draw main
main = new Kinetic.Text({
	x: plotXmargin+plotWidth/2-120, 
	y: plotYmargin *0.5 ,
	text: 'Histogram of Theoph$Time',
	fontSize: 20,
	fontStyle: 'bold',
	fontFamily: 'Calibri',
	fill: 'black',
	//  width: plotWidth*0.8,
	align: 'center'
});		   
histPlotLayer.add(main);
stage1.add(histPlotLayer);


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
var yCanvasHeight = stage1.height-plotYmargin-plotHeight; //added by us
var xScale=plotWidth/xMaxHist;//added by us
var yScale=plotHeight/yMaxHist; //added by us
var histData = [];

for(var n = 0; n <histArr.length ; n++)
{
	var width = plotWidth / parseInt(xMaxHist/diffHist); 
	var height = histArr[n] * plotHeight / yMaxHist;
	var x = plotXmargin +  n * plotWidth / parseInt(xMaxHist/diffHist) + width/2;
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
  stage1.add(histDataLayer);  
  
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
stage1.add(histTooltipLayer);
  
 

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
	//	var node = evt.shape;
	node.moveUp();
	var shapes = stage1.get('#'+node.getId());
	shapes.apply('transitionTo', {
		opacity: 1,
		scale: {	x : 1.15, y : 1.01 },
		duration: 1,
		easing: 'elastic-ease-out'
	});    
}); 	    

histDataLayer.on('mouseout', function(evt) {
	var node = evt.shape;
	node.moveDown();
	document.body.style.cursor = "default";
	histTooltip.hide();
	histTooltipLayer.draw();
	var shapes = stage1.get('#'+node.getId());  
	//	document.write(node.getName() + " ,"+2 );	
	if(histData[node.getId() - histIdStart].selected > 0){//selected
		shapes.apply('transitionTo', {
			opacity: 1,
			scale:{ x : 1, y : 1 },
			duration: 1,
			easing: 'elastic-ease-out'
		});
	}else{		  //unselected
		shapes.apply('transitionTo', {
			opacity: 0.5,
			scale:{ x : 1, y : 1 },
			duration: 1,
			easing: 'elastic-ease-out'
		});
	}
	writeMessage(messageLayer);
	writeMessage1(messageLayer1);
});	 
//////////////////////////////////////hist Tooltip End//////////////////////////////////////
  
//////////////////////////////////////Selection Start//////////////////////////////////////
var preId;
histPlotLayer.on('click', function(evt){
	scatterAllDeselect();
	histAllDeselect();
	writeMessage(messageLayer);
	writeMessage1(messageLayer1);
});
histDataLayer.on('click', function(evt){
  	var node = evt.shape;
  	var shapes = stage1.get('#'+node.getId());
  	var semiNode;
  	if(aPressed){	//select ALL
  		histAllSelect();
  		scatterAllSelect();
  		tmpShift = false;
  	}else if(ctrlPressed){ //select mutiple node one by one.
  		if(histData[node.getId() - histIdStart].selected > 0){ // pre pressed state -> deselect rect & scatter
  			histData[node.getId() - histIdStart].selected = 0;
  			scatterUpdate(node.getId() - histIdStart, 1);
  			histSingleDeselect(shapes);
  		}else if(histData[node.getId() - histIdStart].selected == 0){ // unselected -> selected
  			histData[node.getId() - histIdStart].selected=histArr[node.getId() - histIdStart];
  			scatterUpdate(node.getId() - histIdStart, 0);
  			histSingleSelect(shapes);
  		}
  		tmpShift = false;
  	}else if(shiftPressed){
  		tmpShift = true;
  		scatterAllDeselect();
		histAllDeselect();
		if(preId > node.getId()){
			for(var i = node.getId() - histIdStart ; i < preId + 1 - histIdStart ; i++)
			{
				semiNode = stage1.get("#"+ (i + histIdStart));
				histSingleSelect(semiNode);
				histData[i].selected = histArr[i];
				scatterUpdate(i, 0);
			}
		}else if(preId < node.getId()){
			for(var i = preId - histIdStart  ; i < node.getId() + 1 - histIdStart ; i++)
			{
				semiNode = stage1.get("#"+ (i + histIdStart));
				histSingleSelect(semiNode);
				histData[i].selected =histArr[i];
				scatterUpdate(i, 0);
			}
		} 
	}else{ 	// just one click
		tmpShift = false;
  		histAllDeselect();
  		scatterAllDeselect();
  		histData[node.getId() - histIdStart].selected=histArr[node.getId() - histIdStart];
  		histSingleSelect(shapes);
		scatterUpdate(node.getId() - histIdStart, 0);		
  	}
  	
  	if(tmpShift == false)
	{
		preId = node.getId();
	}
  	writeMessage(messageLayer);
  	writeMessage1(messageLayer1);
}); 

function histUpdate(xData, eraseOn)
{
	var id = parseInt(xData/diffHist);
//	document.write(id + histIdStart);
	var node = stage1.get("#"+ (id + histIdStart));
	
	if(eraseOn == 0)	{		
		histData[id].selected = histData[id].selected + 1;
		histSingleSelect(node);
	}else if(eraseOn == 1){  // ctrl press - erase
		histData[id].selected = histData[id].selected - 1;
		if(histData[id].selected == 0)
		{
			histSingleDeselect(node);
		}
	}
}
function histSingleSelect(node)
{
	//document.write("sdddddddd");
	node.apply('transitionTo', {
		opacity: 1,
		duration: 1,
		easing: 'elastic-ease-out'
	});
}
function histSingleDeselect(node)
{
	node.apply('transitionTo', {
		opacity: 0.5,
		duration: 1,
		easing: 'elastic-ease-out'
	});
}
function histAllSelect()
{
	var node;
	for(var i = 0; i <histArr.length ; i ++)
	{
		node = stage1.get("#"+ (i + histIdStart));
		histData[i].selected=histArr[i]; // should be number of scatters
		histSingleSelect(node);		
	}
}

function histAllDeselect()
{
	var node;
	for(var i = 0; i <histArr.length ; i ++)
	{
		node = stage1.get("#"+ (i + histIdStart));
		histData[i].selected=0;
		histSingleDeselect(node);
	}
}
  //////////////////////////////////////Selection End//////////////////////////////////////
 

//////////////////////////////////////Chk Start//////////////////////////////////////   
var messageLayer1 = new Kinetic.Layer();
stage1.add(messageLayer1);
function writeMessage1(messageLayer){
	var context = messageLayer1.getContext();
	messageLayer.clear();
	
	context.font = "12pt Calibri";
	context.fillStyle = "black";	    
	context.fillText("# of Selected", 10, 15);
	var cnt=0;
	
	for(var i=0; i<histData.length; i++){
		
		context.font = "10pt Calibri";
		context.fillText( i+' : '+histData[i].selected, 10, 13*cnt+30);
		//document.write("selected("+i+") is : "+theophArr.selected[i]+"<br>");
		cnt++;
		
	}

}
//////////////////////////////////////Chk End//////////////////////////////////////   
  
  
