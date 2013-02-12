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
	
	
	

	  var stage1 = new Kinetic.Stage({
	    container: 'container',
	    width: 800,
	    height: 800
	  });

	function addNode(obj, layer) {
		        var node = new Kinetic.Rect({
		          x: obj.x,
		          y: obj.y, 
		          width: obj.width,
		          height: obj.height,
		          stroke: obj.stroke,
		          fill: obj.color,
		          name: obj.name,
		          id: obj.id,
		          draggable: true
		        });
		
		        layer1.add(node);
	  }
	
	  var tooltipLayer1 = new Kinetic.Layer();
	  var tooltip1 = new Kinetic.Group({
	  	opacity: 0.75,
	    visible: false
	  });
	  var tooltipText1 = new Kinetic.Text({
		text: '',
		fontFamily: 'Calibri',
		fontSize: 18,
		padding: 5,
		fill: 'white'
	  });	  
	  var tooltipRect1 = new Kinetic.Rect({
	    fill: 'black'
	  });
	  
	  tooltip1.add(tooltipRect1).add(tooltipText1);
	  tooltipLayer1.add(tooltip1);
	  
	  // build data
	  var xCanvasWidth = plotXmargin;//added by us
	  var yCanvasHeight = stage1.height-plotYmargin-plotHeight; //added by us
	  var xScale=plotWidth/xMax;//added by us
	  var yScale=plotHeight/yMax; //added by us
	  
	  //a=(theophArr.time[n]*xScale+xCanvasWidth-plotYmargin);
	  
	  var dataHist = [];
//	  var width = stage1.getWidth();
//	  var height = stage1.getHeight();
//	  var colors = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];
	      for(var n = 0; n <histArr.length ; n++)
	      {
	    	  
	   // 	  context.strokeRect(plotXmargin +  i * plotWidth / parseInt(xMax/diff)  , canvas.height-plotYmargin-plotHeight  ,  plotWidth / parseInt(xMax/diff) , tmpHistArr[i] * plotHeight / yMax );
	  		
	        
	        var width = plotWidth / parseInt(xMax/diff); 
	        var height = histArr[n] * plotHeight / yMax;
	        var x = plotXmargin +  n * plotWidth / parseInt(xMax/diff);
	        var y = plotYmargin + plotHeight - height;
	     //   var tmp=plotHeight/2+plotYmargin-y; 	        
	    //    y=y+2*tmp; //since (0,0) of canvas is top-left, so we need to change it into bottom-left.
	        dataHist.push({
	          x: x,
	          y: y,
	          width: width,
	          height: height,	        
	          id: n,
	          name: histArr[n] ,//does not work yet..
	       //   'Subject : ' + theophArr.subject[search_result.x] + "<br>" + 'Wt : ' + theophArr.wt[search_result.x] + "<br>" + 'Dose : ' + theophArr.dose[search_result.x] + "<br>" + 'Conc : ' + theophArr.conc[search_result.x] + "<br>" + 'Time : ' + theophArr.time[search_result.x], 'lightyellow'
	          stroke: 'black',
	          color: 'white'
	        });
	      }
	    

	  // render data
	  var nodeCount = 0;
	  var layer1 = new Kinetic.Layer();
	  for(var n = 0; n < dataHist.length; n++) 
	  {
	    addNode(dataHist[n], layer1);
	    nodeCount++;
	    if(nodeCount >= 1)// IMPORTANT
	    {
	      nodeCount = 0;
	      stage1.add(layer1);
	      layer1 = new Kinetic.Layer();
	    }
	  }
	
	  stage1.add(tooltipLayer1);
	
	  stage1.on('mouseover mousemove dragmove', function(evt){
		var node = evt.shape;
		// update tooltip
		var mousePos = node.getStage().getMousePosition();
		tooltip1.setPosition(mousePos.x + 8, mousePos.y + 8);
		tooltipText1.setText("node: " + node.getId() + ", Frequency: " + node.getName()); //Name split?
		tooltipRect1.setAttrs({
	    	width: tooltipText1.getWidth(),
	    	height: tooltipText1.getHeight()
	    });
	    tooltip1.show();
	    tooltipLayer1.draw();
	  }); 
	
	  stage1.on('mouseout', function(evt) {
	    tooltip1.hide();
	    tooltipLayer1.draw();
	  });	 
	  
	  var layer1 = new Kinetic.Layer();
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
	     layer1.add(rect);
	     layer1.add(rect1);
		
		for(var i=0; i<parseInt(xMax/xDiff)+1; i++){
			var xLine = new Kinetic.Line({
		        points: [plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+plotLength, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+2*plotLength],
		        stroke: 'black',
		        strokeWidth: 2,		     
		      });
			layer1.add(xLine);	   		
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
		   layer1.add(xText);			
		}
		for(var i=0; i<parseInt(yMax/yDiff)+1; i++){
			var yLine = new Kinetic.Line({
		        points: [plotXmargin-plotLength, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-2*plotLength,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff)],
		        stroke: 'black',
		        strokeWidth: 2,		     
		      });
			layer1.add(yLine);	   
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
		   layer1.add(yText);		
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
	   layer1.add(xLabel);		
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
	   layer1.add(yLabel);	
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
	   layer1.add(main);
	   stage1.add(layer1);
