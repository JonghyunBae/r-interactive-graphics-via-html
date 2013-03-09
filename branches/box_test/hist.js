var Hist = {};		

(function() {	
	
	Hist = function(mainArr, optionObj) {
		this._initHist(optionObj);		
    };
	Hist.prototype = {
			_initHist: function(optionObj) {
				this.bin = optionObj.bin || 1;
	            this.width = optionObj.width || plotWidth; //plot width
	            this.height = optionObj.height || plotHeight; //plot height
	            this.plotXMargin=this.width*0.1; //canvas left, right margin
	            this.plotYMargin=this.height*0.1; //canvas top, bottom margin
	            this.plotLength=this.width*0.02; //margin from plot box
	            for(var i = 0 ; i < labelArr.length ; i ++)
	            {
	            	if(labelArr[i].toLowerCase()==optionObj.x.toLowerCase()){	            		
	            		 this.x =  i;
	            		 break;
	            	}
	            	if(i==labelArr.length-1){
	            		alert('retype x label');
	            	}
	            }
	           
	            this.xMax = findMaxValue(mainArr[this.x],this.bin);	            
	            this.yMax= histFindMaxValue(this.xMax,mainArr[this.x],this.bin);
	        	this.xDiff=parseInt(this.xMax/5);//5 should be selected automatically later
	    		this.yDiff=parseInt(this.yMax/5); //5 should be selected automatically later
				this.barWidth = optionObj.barWidth || ( this.width /parseInt(this.xMax/this.bin));
				
				this.histArr =  new function(){			
					this.freq = new Array();
				    this.height = new Array();		
					this.midPoint= new Array();
				    this.selected = new Array();
				    this.hidden = new Array();
				    this.hasArr ='';				    
				};
				this.histArr.hasArr= make2DArr(parseInt(this.xMax/this.bin +1)); 
			
				var cnt=0;
				var col = 0;
				for (var i=0; i<parseInt(this.xMax/this.bin); i++)//tmpHistArr initialization
				{
					this.histArr.freq[i]=0;
				}		
				for(cnt=0; cnt< parseInt(this.xMax/this.bin ); cnt++)//count how many data in certain range and save the value into freq array
				{
					for( var i = 0 ; i < mainArr[this.x].length; i++)
					{
						if(mainArr[this.x][i]>=cnt*this.bin && mainArr[this.x][i]<(cnt+1)*this.bin)
						{	
							this.histArr.freq[cnt]++;
							this.histArr.hasArr[cnt][col] = i; 
							col++;
						}
					}
					col = 0;
				}	
				for (var i=0; i<parseInt(this.xMax/this.bin ); i++)//height array set
				{	
				//	var width= this.width / parseInt(this.xMax/this.bin); 
					this.histArr.height[i]=this.histArr.freq[i]*this.height/this.yMax;		
					this.histArr.midPoint[i]={
							x: this.plotXMargin +  i * this.width / parseInt(this.xMax/this.bin) + (this.width / parseInt(this.xMax/this.bin))/2, 
							y: this.plotYMargin + this.height - this.histArr.height[i]/2 
					};
					this.histArr.selected[i]=0;
					this.histArr.hidden[i]=false;	
				}
				
				 
	        },				
			doIt: function() { 
				alert('do it'); 
			},
			draw: function(){		
				
				
	           //draw plot
				var histStage = new Kinetic.Stage({			
					container: 'histContainer',			
					width: this.width+this.plotXMargin*2,
					height: this.height+this.plotYMargin*2 
				});
				var histPlotLayer = new Kinetic.Layer();
				var plotRect = new Kinetic.Rect({
					name : "baseRect",
					x: this.plotXMargin-this.plotLength,
					y: this.plotYMargin-this.plotLength,
					width: this.width+2*this.plotLength,
					height: this.height+2*this.plotLength,
					stroke: 'white',
					strokeWidth: 2
				});
				histPlotLayer.add(plotRect);				
				var histXAxis = new Kinetic.Line({
					name: 'histXAxis',
					points: [	this.plotXMargin, 
					         	this.plotYMargin+this.height+this.plotLength, 
					         	this.plotXMargin+parseInt(this.xMax/this.xDiff)*this.width/(this.xMax/this.xDiff), 
					         	this.plotYMargin+this.height+this.plotLength],
					stroke: 'black',
					strokeWidth: 2		     
				});
				histPlotLayer.add(histXAxis);
				var histYAxis = new Kinetic.Line({
					points: [	this.plotXMargin-this.plotLength, 
					         	this.plotYMargin+this.height-parseInt(this.yMax/this.yDiff)*this.height/(this.yMax/this.yDiff),
					         	this.plotXMargin-this.plotLength,  
					         	this.plotYMargin+this.height],
					stroke: 'black',
					strokeWidth: 2		     
				});				
				histPlotLayer.add(histYAxis);				
				histStage.add(histPlotLayer);
				histPlotLayer.on('mouseover mousemove dragmove', function(evt){  
					document.body.style.cursor = "default";
				});
				//add node function.
				
				var histDataLayer = new Kinetic.Layer();
				
	/*			var node = new Array();
				
				for(var i = 0 ; i < this.histArr.freq.length ; i ++)
				{
					var temp = this.histArr.freq[i];
					node[i] = new Kinetic.Rect({
						name : '3'
					});				
					histDataLayer.add(node[i]);		
				}
				alert(node[0].getName());*/
				this.node = new Array();
				for(var i = 0 ; i < this.histArr.freq.length ; i ++)
				{
					this.node = new Kinetic.Rect({
						name: this.histArr.freq[i],
						x: this.histArr.midPoint[i].x,
						y: this.histArr.midPoint[i].y, 
						width: this.barWidth,
						height: this.histArr.height,
						fill: 'green',
						stroke: 'black',						
						opacity : 0.5,
						draggable: false,
						selected : 0,
						offset: this.histArr.selected
					});
				}
				for(var i = 0 ; i < this.histArr.freq.length ; i ++)
				{
					alert("dddd");
					this.node[i].setName = this.histArr.freq[i];
					alert("dddd");
					this.node[i].x = this.histArr.midPoint[i].x;					
					this.node[i].y = this.histArr.midPoint[i].y;
					this.node[i].width = this.barWidth;
					this.node[i].height = this.histArr.height;
					this.node[i].fill = 'green';
					this.node[i].stroke = 'black';
					this.node[i].opacity = 0.5;
					this.node[i].draggable = false;
					this.node[i].selected = this.histArr.selected;
					histDataLayer.add(this.node[i]);
				}
					

	//			}
				histStage.add(histDataLayer);
				
				
				
	/*			function histAddNode(obj, layer) 
				{
					var node = new Kinetic.Rect({
						//id: obj.id,
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
					//	offset: obj.offset
					});
					alert(obj.name+"," + node.x+"," + node.y+"," + node.width+","  + node.height+"," +  node.stroke+"," + node.color);
					layer.add(node);
				}*/

				// build data				
				//var xScale=this.width/this.xMax;//added by us
				//var yScale=this.height/this.yMax; //added by us
		/*		var histData = [];
				
				for(var i = 0; i <parseInt(this.xMax/this.bin ) ; i++)
				{	//alert('1');
				 //alert(this.histArr.freq[i]);
					//var width = plotWidth / parseInt(histXMax/diffHist); 
					//var height = histArr[n] * plotHeight / histYMax;
					//var x = plotXmargin +  n * plotWidth / parseInt(histXMax/diffHist) + width/2;
					//var y = plotYmargin + plotHeight - height + height/2;
					histData.push({
						//id: idCounter,
						name: this.histArr.freq[i] , //frequency
						x: this.histArr.midPoint[i].x,
						y: this.histArr.midPoint[i].y,
						width: this.barWidth,
						height: this.histArr.height,	        
						stroke: 'black',
						color: 'green',
						//offset: {x: width/2, y: height/2},
						selected : 0 // 0 means : unselected ,  0 < means : selected
					});
					
				}
			//	histIdEnd = idCounter - 1;
			
				  // render data
				//  var histNodeCount = 0;
				  var histDataLayer = new Kinetic.Layer();
				  for(var n = 0; n < histData.length; n++) 
				  {
				
				    histAddNode(histData[n], histDataLayer);
				  }
				  alert("ddd");
				  histStage.add(histDataLayer);  
				*/
				
				
			},
			update: function(){
				alert('hist is updated');				
			}
	};
})();


function findMaxValue(Data,bin)
{
	var maxValue=Data[0];

	var returnValue;
	for(var i=1; i<Data.length; i++)
	{
	//	document.write(maxValue + ", " +  Data[i] + "<br>");
		if(Data[i]>maxValue)
		{
//					document.write("dddddddddddddd");
			maxValue=Data[i];					
		}
//				document.write(maxValue + ", " +  Data[i] + "<br>");
	}
	returnValue=parseInt(maxValue+1);	
	for(var i=0; i<bin; i++) //until mod ==0
	{
		returnValue=returnValue+i;
		if((returnValue% bin) == 0)
		{
			break;
		}				
	}	
	return returnValue;
}
function histFindMaxValue(xMaxHist, xData,bin)
{
	var maxValue=0;
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMaxHist/bin +1); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMaxHist/bin +1); cnt++)
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*bin && xData[i]<(cnt+1)*bin)
			{
				tmpHistArr[cnt]++;
			}
		}
	}
	for(var i=0; i<parseInt(xMaxHist/bin +1); i++)
	{
		if(tmpHistArr[i]>maxValue)
		{
			maxValue=tmpHistArr[i];					
		}
	}	
	return maxValue;
}