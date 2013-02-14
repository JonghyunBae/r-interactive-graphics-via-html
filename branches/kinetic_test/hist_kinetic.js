var diff = 2;
var xMax=findMaxValue(theophArr.time,diff); //나중에 max함수 추가해서 5단위로 잡게 만들기.
var yMax=findMaxValueHist(xMax,theophArr.time,diff);
var xDiff=parseInt(xMax/5);//나중에 자동으로 잡아주기.
var yDiff=parseInt(yMax/5);

function drawDataHist(xMax,yMax,xData,diff,name)
{
	var canvas = document.getElementById("canvas" + name);
	var context = canvas.getContext("2d");
	
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMax/diff ); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMax/diff ); cnt++)//count how many data in certain range and save the value into tmpHistArr.
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*diff && xData[i]<(cnt+1)*diff)
			{
				tmpHistArr[cnt]++;
			}
		}
	}			
	for(var i=0; i< parseInt(xMax/diff ) ; i++)//draw rectangular 
	{
		context.beginPath();
		context.strokeRect(plotXmargin +  i * plotWidth / parseInt(xMax/diff)  , canvas.height-plotYmargin-plotHeight  ,  plotWidth / parseInt(xMax/diff) , tmpHistArr[i] * plotHeight / yMax );
		context.stroke();
		context.closePath();
	}
}
function findMaxValueHist(xMax, xData,diff)
{
	var maxValue=0;
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMax/diff +1); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMax/diff +1); cnt++)
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*diff && xData[i]<(cnt+1)*diff)
			{
				tmpHistArr[cnt]++;
			}
		}
	}
	for(var i=0; i<parseInt(xMax/diff +1); i++)
	{
		if(tmpHistArr[i]>maxValue)
		{
			maxValue=tmpHistArr[i];					
		}
	}	
	return maxValue;
}

var histArr = new Array();
histArr = drawDataHist(xMax,yMax,theophArr.time, diff);	 

//for(var i=0; i<histArr.length; i++){ document.write("histArr("+i+") is : "+histArr[i]+"<br>"); }
function addRectSelect()
{
	
}
function drawDataHist(xMax,yMax,xData,diff)
{
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMax/diff ); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMax/diff ); cnt++)//count how many data in certain range and save the value into tmpHistArr.
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*diff && xData[i]<(cnt+1)*diff)
			{
				tmpHistArr[cnt]++;
			}
		}
	}			
	return tmpHistArr;
/*	for(var i=0; i< parseInt(xMax/diff ) ; i++)//draw rectangular 
	{
		context.beginPath();
		context.strokeRect(plotXmargin +  i * plotWidth / parseInt(xMax/diff)  , canvas.height-plotYmargin-plotHeight  ,  plotWidth / parseInt(xMax/diff) , tmpHistArr[i] * plotHeight / yMax );
		context.stroke();
		context.closePath();
	}*/
}

//////////////////////////////////////Stage1(hist) Start//////////////////////////////////////
  var stage1 = new Kinetic.Stage({
    container: 'container',
    width: 800,
    height: 800
  });
  

//////////////////////////////////////Drawing histPlot Start//////////////////////////////////////

var histPlotLayer = new Kinetic.Layer();
// dashed line
/*
var rect = new Kinetic.Rect({
x: plotXmargin-plotLength,
y: plotYmargin-plotLength,
width: plotWidth+2*plotLength,
height: plotHeight+2*plotLength,
//     fill: 'green',
stroke: 'black',
strokeWidth: 2
});
*/
var rect = new Kinetic.Line({
	points: [plotXmargin-plotLength, plotYmargin+plotHeight-parseInt(yMax/yDiff)*plotHeight/(yMax/yDiff) ,plotXmargin-plotLength,  plotYmargin+plotHeight],
	stroke: 'black',
	strokeWidth: 2,		     
});
var rect1 = new Kinetic.Line({
	points: [plotXmargin, plotYmargin+plotHeight+plotLength, plotXmargin+parseInt(xMax/xDiff)*plotWidth/(xMax/xDiff),  plotYmargin+plotHeight+plotLength],
	stroke: 'black',
	strokeWidth: 2,		     
});
histPlotLayer.add(rect);
histPlotLayer.add(rect1);

for(var i=0; i<parseInt(xMax/xDiff)+1; i++)
{
	var xLine = new Kinetic.Line({
	points: [plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+plotLength, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+2*plotLength],
	stroke: 'black',
	strokeWidth: 2,		     
	});
	histPlotLayer.add(xLine);	   		
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
	histPlotLayer.add(xText);			
}

for(var i=0; i<parseInt(yMax/yDiff)+1; i++)
{
	var yLine = new Kinetic.Line({
		points: [plotXmargin-plotLength, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-2*plotLength,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff)],
		stroke: 'black',
		strokeWidth: 2,		     
	});
	histPlotLayer.add(yLine);	   
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
function histAddNode(obj, layer) {
	        var node = new Kinetic.Rect({
	          x: obj.x,
	          y: obj.y, 
	          width: obj.width,
	          height: obj.height,
	          stroke: obj.stroke,
	          fill: obj.color,
	          name: obj.name,
	          id: obj.id,
	          opacity : 0.5,
	          draggable: false,
	          offset: obj.offset
	        });
	
	        layer.add(node);
  }

  // build data
  var xCanvasWidth = plotXmargin;//added by us
  var yCanvasHeight = stage1.height-plotYmargin-plotHeight; //added by us
  var xScale=plotWidth/xMax;//added by us
  var yScale=plotHeight/yMax; //added by us
  var histData = [];
      for(var n = 0; n <histArr.length ; n++)
      {
    	var width = plotWidth / parseInt(xMax/diff); 
        var height = histArr[n] * plotHeight / yMax;
        var x = plotXmargin +  n * plotWidth / parseInt(xMax/diff) + width/2;
        var y = plotYmargin + plotHeight - height + height/2;
        histData.push({
          x: x,
          y: y,
          width: width,
          height: height,	        
          id: n,
          name: histArr[n] ,//does not work yet..
       //   'Subject : ' + theophArr.subject[search_result.x] + "<br>" + 'Wt : ' + theophArr.wt[search_result.x] + "<br>" + 'Dose : ' + theophArr.dose[search_result.x] + "<br>" + 'Conc : ' + theophArr.conc[search_result.x] + "<br>" + 'Time : ' + theophArr.time[search_result.x], 'lightyellow'
          stroke: 'black',
          color: 'green',
          offset: {x: width/2, y: height/2}
        });
      }

  // render data
  var histNodeCount = 0;
  var histDataLayer = new Kinetic.Layer();
  for(var n = 0; n < histData.length; n++) 
  {
    histAddNode(histData[n], histDataLayer);
    histNodeCount++;
    if(histNodeCount >= 1)// IMPORTANT
    {
      histNodeCount = 0;
      stage1.add(histDataLayer);
     // histDataLayer = new Kinetic.Layer();
    }
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
	histTooltipText.setText("node: " + node.getId() + ", Frequency: " + node.getName()); //Name split?
	histTooltipRect.setAttrs({
    	width: histTooltipText.getWidth(),
    	height: histTooltipText.getHeight()
    });
    histTooltip.show();
    histTooltipLayer.draw();
	var node = evt.shape;
	node.moveUp();
	var shapes = stage1.get('#'+node.getId());
    shapes.apply('transitionTo', {
    //  stroke: 'green',
    	opacity: 1,
//    	rotation: Math.PI * 3/2,
    	
      scale: {
  	    x:  1.15,
  	    y:  1.01
  	  },
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
	    shapes.apply('transitionTo', {
	    //  stroke: 'green',
	    	opacity: 0.5,
	      scale: {
	  	    x:  1,
	  	    y:  1
	  	  },
	  	  duration: 1,
	  	  easing: 'elastic-ease-out'
	   });
  });	 
//////////////////////////////////////hist Tooltip End//////////////////////////////////////

 
  
  
