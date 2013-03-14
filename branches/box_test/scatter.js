var Scatter = {};	

(function() {	
	
	Scatter = function(mainArr, optionObj) {
		this._initScatter(optionObj);		
		this._type = 'scatter';
		
		
    };
    Scatter.prototype = {
    		
    		_initScatter: function(optionObj){
    			
    		
    				
    			////////// Make essential variables ////////				
	            this.width = optionObj.width || plotWidth; //plot width
	            this.height = optionObj.height || plotHeight; //plot height
	            this.plotXMargin=this.width*0.2; //canvas left, right margin
	            this.plotYMargin=this.height*0.2; //canvas top, bottom margin
	            this.plotLength= (optionObj.plotLength==undefined)?(this.width*0.02):(optionObj.plotLength); //margin from plot box
	            this.radius= (optionObj.radius==undefined)?(3):(optionObj.radius); //default radius is 3
	            
	           
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
	            for(var i = 0 ; i < labelArr.length ; i ++)
	            {
	            	if(labelArr[i].toLowerCase()==optionObj.y.toLowerCase()){	            		
	            		 this.y =  i;
	            		 break;
	            	}
	            	if(i==labelArr.length-1){
	            		alert('retype y label');
	            	}
	            }
	            
	          
	            if(optionObj.color==undefined){
	            	this.color=-1; //default color
	            }else{
            		for(var i = 0 ; i < labelArr.length ; i ++)
	  	            {
	  	            	if(labelArr[i].toLowerCase()==optionObj.color.toLowerCase()){	            		
	  	            		 this.color =  i;
	  	            		 break;
	  	            	}
	  	            	if(i==labelArr.length-1){
	  	            		alert('retype colors label');
	  	            	}
	  	            }	
        			var tmpSetColor =  setColor(mainArr[this.color]);
    				var colors = tmpSetColor.colors;
					var mainValueArr = tmpSetColor.mainValueArr;
					var tmpColorArr = tmpSetColor.tmpColorArr;
	            }

	    		
	            ////////////////////////////////////////////////Make Legend Start////////////////////////////////////////////
	            if(optionObj.legend!=undefined){
	            	var legendChk = optionObj.legend.toLowerCase();
	  	            if( legendChk == 'right' || legendChk == 'left' || legendChk == 'topright' || legendChk == 'topleft' || legendChk == 'default' ){	            		
	  	            		 this.legend = optionObj.legend;
	  	            }else{
	  	            	alert('retype legend! (right, left, topright, topleft, or default)');	            		
	  	            }
	            }
	            if(this.legend!=undefined){	            	
	            	var legendX = 0;
					var legendY = 0;
	            	if (this.legend == 'topright' || this.legend == 'right')	{
	            		legendX = this.plotXMargin+this.width+this.plotLength*5;
	            		legendY = this.plotYMargin-this.plotLength;
	            	}else if(this.legend == 'topleft' ||this.legend == 'left'){
	            		legendX = this.plotLength*5;
	            		legendY = this.plotYMargin-this.plotLength;	            		
	            	}else{// default is center right
	            		legendX = this.plotXMargin+this.width+this.plotLength*5;
	            		legendY = this.plotYMargin-this.plotLength;
	            	}	            		            	
					var myLegend = makeLegend(legendX, legendY, mainValueArr, this.color, colors);					
					this.legendGroup = new Kinetic.Group({
						width: myLegend.getWidth(),
						height : myLegend.getHeight()
					});			
					this.legendGroup.add(myLegend);
					if(this.legend == 'topleft' ||this.legend == 'left'){
	            		this.plotXMargin = this.plotXMargin + myLegend.getWidth() + this.plotLength * 4;
					}
	            }
	            ////////////////////////////////////////////////Make Legend End////////////////////////////////////////////

	        	
	        	
	        	
	            var nodeX = new Array(mainArr[this.x].length);
	            this.xTick= (optionObj.xTick==undefined)?(5	):(optionObj.xTick);
	            var xTmp = makeAxisArr(this.width, this.x, this.xTick); // node가 찍혀야할 nodeX array에 저장. x좌표가 찍혀야할 좌표 위치와 이름이 xPlotArr에 저장된다. 
	            nodeX = xTmp.node;
	            this.xPlotArr = xTmp.plotArr;
	            
	            var nodeY = new Array(mainArr[this.y].length);
	            this.yTick= (optionObj.yTick==undefined)?(5):(optionObj.yTick); //default y ticks is 5 
	            
	            var yTmp = makeAxisArr(this.height, this.y, this.yTick);
	            
	            nodeY = yTmp.node;
	            this.yPlotArr = yTmp.plotArr;
	            
	    	
	            
	    		//////////Make Data Structure of nodes and essential arrays////////
	    		this.yMax = findMaxValue(mainArr[this.y]);
	    		
				this.node = new Array();			
				
				var tooltipTextGetInfo = new Array();
				for(var i = 0; i < mainArr[this.x].length ; i++)
				{
					tooltipTextGetInfo[i]=labelArr[0]+" : " + mainArr[0][i]+ "\r\n" ;
					for(var j=1; j< labelArr.length ; j++){
						tooltipTextGetInfo[i]=tooltipTextGetInfo[i]+ labelArr[j]+" : " + mainArr[j][i]+ "\r\n" ;
					}
				}				
				if(this.color==-1 ){
					for(var i = 0; i < mainArr[this.x].length ; i++)
					{
						this.node[i] = new Kinetic.Circle({
							//id: i,
							name : i,
							x: nodeX[i] + this.plotXMargin,
							y: this.height +this.plotYMargin - nodeY[i],
							radius: this.radius,
							fill: 'green',
						//	stroke : 'black',
						//	strokeWidth : 0.01,
						//	opacity : 0.7,
						//	draggable : false,
							hidden : 0,
							selected : 0,
							info :  "Node : "+i+"\r\n"+tooltipTextGetInfo[i]
						});							
					}
				}else{
					for(var i = 0; i < mainArr[this.x].length ; i++)
					{
						this.node[i] = new Kinetic.Circle({
							//id: i,
							name : i,
							x: nodeX[i] + this.plotXMargin,
							y: this.height +this.plotYMargin - nodeY[i],
							radius: this.radius,
							fill: getColor(i,colors, mainValueArr, tmpColorArr),
						//	stroke : 'black',
						//	strokeWidth : 0.01,
						//	opacity : 0.7,
						//	draggable : false,
							hidden : 0,
							selected : 0,
							info :  "Node : "+i+"\r\n"+tooltipTextGetInfo[i]
						});							
					}
				}
				
				
    		},
			doIt: function() { 
				alert('do it'); 
			},
			draw: function(id){	
				//draw plot
				var tmpWidth=0;
				if(this.legend=='left' || this.legend=='topleft'){
					tmpWidth =  this.width+this.plotXMargin+this.legendGroup.getWidth();
				}else if(this.legend=='right' || this.legend=='topright' || this.legend){
					tmpWidth =  this.width+this.plotXMargin*2+this.legendGroup.getWidth();
				}else{
					tmpWidth =  this.width+this.plotXMargin*2;
				}				
				this.stage = new Kinetic.Stage({            
					container: 'scatterContainer'+id,            
					width : tmpWidth,							
					height: this.height+this.plotYMargin*2 
				});		
				
				this.plotLayer = new Kinetic.Layer();
				this.plotRect = new Kinetic.Rect({
					name : "baseRect",
					x: this.plotXMargin-this.plotLength,
					y: this.plotYMargin-this.plotLength,
					width: this.width+2*this.plotLength,
					height: this.height+2*this.plotLength,
					stroke: 'black',
					strokeWidth: 2
				});       
				this.plotLayer.add(this.plotRect);   
				this.xLine = new Array();
				this.xText = new Array();
				for(var i=0; i<this.xPlotArr.length; i++)
				{
				    this.xLine[i] = new Kinetic.Line({
				        name : "xLine"+i,
				        points: [	this.plotXMargin+this.xPlotArr[i][0],
				                     this.plotYMargin+this.height+this.plotLength,
				                     this.plotXMargin+this.xPlotArr[i][0],
				                     this.plotYMargin+this.height+2*this.plotLength],
				        stroke: 'black',
				        strokeWidth: 2,             
				    });
				    this.plotLayer.add(this.xLine[i]);               
				    this.xText[i] = new Kinetic.Text({
				        name : "xText"+i,
				        x: this.plotXMargin+this.xPlotArr[i][0]-30,
				        y: this.plotYMargin+this.height+this.plotLength*2,
				        text: this.xPlotArr[i][1],
				        fontSize: 15,
				        fontFamily: 'Calibri',
				        fill: 'black',
				        width: 60,
				        align: 'center'    
				    });          
				    this.plotLayer.add(this.xText[i]);            
				} 
				this.yLine = new Array();
                this.yText = new Array();
               
                for(var i=0; i< this.yPlotArr.length ; i++)
                {
                    this.yLine[i] = new Kinetic.Line({
                        points: [	this.plotXMargin-this.plotLength, 
                                     this.plotYMargin+this.height-this.yPlotArr[i][0], 
                                     this.plotXMargin-2*this.plotLength,
                                     this.plotYMargin+this.height-this.yPlotArr[i][0]],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
                    this.plotLayer.add(this.yLine[i]);       
                    this.yText[i] = new Kinetic.Text({
                        x: this.plotXMargin-this.plotLength*2-15,
                        y: this.plotYMargin+this.height-this.yPlotArr[i][0]+30,
                        text: this.yPlotArr[i][1],
                        fontSize: 15,
                        fontFamily: 'Calibri',
                        fill: 'black',
                        width: 60,
                        align: 'center',
                        rotation: (Math.PI)*3/2
                    });           
                    this.plotLayer.add(this.yText[i]);        
                }    
                this.xLabel = new Kinetic.Text({
                    name : 'xLabel',
                    x: this.plotXMargin+this.width/2,
                    y: this.plotYMargin+this.height+5*this.plotLength,
                    offset : {x: labelArr[this.x].length/2 * 10, y:0},
                    text: labelArr[this.x],
                    fontSize: 15,
                    fontStyle: 'bold',
                    fontFamily: 'Calibri',
                    fill: 'black',
                });                                   
                this.plotLayer.add(this.xLabel);
                this.yLabel = new Kinetic.Text({
                    x: this.plotXMargin-this.plotLength - 40,
                    y: this.plotYMargin+this.height/2  - 15,
                    offset : {x: labelArr[this.y].length/2 * 10},
                    text: labelArr[this.y],
                    fontSize: 15,
                    fontStyle: 'bold',
                    fontFamily: 'Calibri',
                    fill: 'black',
                    rotation: (Math.PI)*3/2
                });    
                this.plotLayer.add(this.yLabel);    
                this.mainLabel = new Kinetic.Text({
                    name : 'mainLabel',
                    x: this.plotXMargin+this.width/2, 
                    y: this.plotYMargin *0.3 ,
                    offset : {x: ('Scatter of ' + labelArr[this.x] + ' & ' + labelArr[this.y]).length/2 * 10, y:0},
                    text: 'Scatter of ' + labelArr[this.x] + ' & ' + labelArr[this.y],
                    fontSize: 20,
                    fontStyle: 'bold',
                    fontFamily: 'Calibri',
                    fill: 'black',
                });           
                this.plotLayer.add(this.mainLabel);
				 
				this.stage.add(this.plotLayer);
				this.plotLayer.on('mouseover mousemove dragmove', function(evt){  
					document.body.style.cursor = "default";
				});   
				 
				
				//draw node
				this.dataLayer = new Kinetic.Layer();	
				for(var i = 0 ; i < this.node.length ; i ++)
				{
					if(i % parseInt(this.node.length/20) == 0)
					{
						this.stage.add(this.dataLayer);
						this.dataLayer = new Kinetic.Layer();
					}
					this.dataLayer.add(this.node[i]);
				} 
				this.stage.add(this.dataLayer);
				//alert(this.node[0].getHasArr());
				 //////////////////////////////Tooltip Setting////////////////////////////////////////
                this.tooltipLayer = new Kinetic.Layer();
                this.tooltip = new Kinetic.Group({
                	opacity: 0.75,
                	visible: false
                });
                this.tooltipText = new Kinetic.Text({
                	text: '',
                	fontFamily: 'Calibri',
                	fontSize: 15,
                	padding: 5,
                	fill: 'white'
                });	  
                this.tooltipRect = new Kinetic.Rect({
                	fill: 'black'
                });
                
                this.tooltip.add(this.tooltipRect).add(this.tooltipText);
                this.tooltipLayer.add(this.tooltip);
                this.stage.add(this.tooltipLayer);
                ///////////////////////////////////////////////////////////////////////////////////
				
				//draw legend
				if(this.legend!=undefined){
					this.legendLayer = new Kinetic.Layer({name:'legendLayer', draggable:true});
					this.legendLayer.on('mouseover', function(evt){  
						document.body.style.cursor = "pointer";
					}); 
					this.legendLayer.add(this.legendGroup);					
					this.stage.add(this.legendLayer);				
					if(this.legend != 'topleft' && this.legend != 'topright'){
						this.legendLayer.setY((this.height-this.legendGroup.getHeight())/2); //move legend layer to center.
				        this.legendLayer.draw();
					}
				}
				
			},			
			update: function(){
				alert('scatter is updated');				
			}
	};
    
})();

/*
function tooltipTextGetInfo(n){
	var info=labelArr[0]+" : " + mainArr[0][n]+ "\r\n" ;
	for(var i=1; i< labelArr.length ; i++){
		info=info+ labelArr[i]+" : " + mainArr[i][n]+ "\r\n" ;
	}
	return info;	
}	     
*/


function setColor(colorArr) //set color
{
	var colors = new Array();
	var mainValueArr = new Array();
    var tmpColorArr = new Array();
    
   
	var cnt=0;
	var sortedColorArr = new Array();	
	for(var i=0; i<colorArr.length; i++){		
		sortedColorArr[i] = {
				a : colorArr[i],
				b : i
		};		
	}	 
	var stableSort = function(a,b) { //stable sort is needed because Chrome does not support stable sort.
	    if (a.a === b.a) return a.stableSortKey > b.stableSortKey ? 1 : -1; 
	    if (a.a > b.a) return 1;
	    return -1;
	};
	for (i = 0; i < sortedColorArr.length; i++) {                     
		sortedColorArr[i].stableSortKey = i;                           
	}                                   
	
		
	sortedColorArr.sort(stableSort); //sort stably colorArr (temporarily saved in sortedColorArr)
	
	 for(var i=0; i<sortedColorArr.length; i++){		
		if(i==0){
			mainValueArr[cnt]=sortedColorArr[0].a;
			tmpColorArr[0]=0;
		}else{
			if(sortedColorArr[i].a==sortedColorArr[i-1].a){
				
				tmpColorArr[i]=cnt;
			}else{
				cnt++;
				mainValueArr[cnt]=sortedColorArr[i].a;
				tmpColorArr[i]=cnt;
			}
		}
	}
	var reTmpColorArr = new Array(); // re assign
	for(var i=0; i<sortedColorArr.length; i++){		// re assign
		reTmpColorArr[sortedColorArr[i].b]=tmpColorArr[ i ]; 
	}
	for(var i=0; i<sortedColorArr.length; i++){		//re re assign
		tmpColorArr[i]=reTmpColorArr[i];	
	}

	
	if(mainValueArr.length<24){		
		var rgb = {R: new Array(), G: new Array(), B: new Array()};
	 	var rgbFreq = 4.8 / mainValueArr.length ;
	 	var rgbCenter = 128;
	 	var rgbWidth = 127;
	 	for (var i = 0; i <24; ++i)
	 	{
	 		rgb.R[i]  = parseInt( Math.sin(rgbFreq*i + 0) * rgbWidth + rgbCenter );
	 		rgb.G[i] = parseInt( Math.sin(rgbFreq*i + 2) * rgbWidth + rgbCenter );
	 		rgb.B[i]  = parseInt( Math.sin(rgbFreq*i + 4) * rgbWidth + rgbCenter );
	 	  colors[i] = 'rgb('+rgb.R[i]+','+rgb.G[i]+','+ rgb.B[i]+')';
	 	}
		
	}else{
		
	
		var rgb = {R: new Array(), G: new Array(), B: new Array()};
		var start = {R:0, G:128, B: 0};
		var end = {R:0, G:255, B: 0};
		for(i = 0; i < mainValueArr.length; i++)
		{
			rgb.R[i] =parseInt( start.R + (i * (end.R - start.R)) / (mainValueArr.length-1) );
			rgb.G[i] =parseInt( start.G + (i * (end.G - start.G)) / (mainValueArr.length-1) );
			rgb.B[i] =parseInt( start.B + (i * (end.B - start.B)) / (mainValueArr.length-1) ); 
			colors[i] = 'rgb('+rgb.R[i]+','+rgb.G[i]+','+ rgb.B[i]+')';
		}
	}	
	return {colors: colors, mainValueArr: mainValueArr, tmpColorArr: tmpColorArr};
}

function getColor(n, colors, mainValueArr, tmpColorArr)
{
	if(mainValueArr.length<24){
		var tmpColor='green';
		tmpColor= colors[tmpColorArr[n]];	
		return tmpColor;		
	}else{
		var tmpColor='green';
		tmpColor= colors[tmpColorArr[n]];	
		return tmpColor;		
	}	
}
function getLegendColor(n, colors, mainValueArr)
{
	if(mainValueArr.length<24){
		var tmpColor='green';
		tmpColor= colors[n];	
		return tmpColor;		
	}else{
		var tmpColor='green';
		tmpColor= colors[n];	
		return tmpColor;		
	}	
}

function makeAxisArr(length, axis, tick)	 //width나 height을 받고 this.x 나 this.y를 받고 xtick이나 ytick을 받는다. 
{														// return은 x좌표와 x좌표 이름이 찍혀있는 plotArr와 node가 찍혀야할 좌표가 node에 저장되어 return된다. 
	var node = new Array(mainArr[axis].length);
	if(isDiscrete[axis] == true)
	{		
		
		var tmp = new Array();  //the names of each content below
		tmp[0] = mainArr[axis][0];
		node[0] = 0;
		for(var i = 1 ; i < mainArr[axis].length ; i++)
    	{
    		for(j = 0 ; j < tmp.length ; j ++)
    		{
    			if(tmp[j] == mainArr[axis][i])
    			{
    				node[i] = j;
    				break;
    			}	            				
    		}
    		if(j == tmp.length)
    		{
    			node[i] = j;
    			tmp.push(mainArr[axis][i]);
    		}
    	}	
		var plotArr = make2DArr(tmp.length);
		var diff = length / (tmp.length+1);
		for(var i = 1 ; i < plotArr.length+1 ; i ++)
		{
			plotArr[i-1][0] = i*diff;
			plotArr[i-1][1] = tmp[i-1];
		}	
		for(var i = 0 ; i < node.length ; i++)
		{
			node[i] = (node[i]+1)*diff;
		}
	}else{	    	
		
		var max = findMaxValue(mainArr[axis]);
		var min = findMinValue(mainArr[axis]);
		var tickRange = (max-min )/tick;	    		
		var tmp = Math.ceil( Math.log(tickRange) / Math.log(10));
		tickRange = setTickRange(tmp, tickRange);
        max = tickRange * Math.ceil(max/tickRange);		      
        min = tickRange * Math.floor(min/tickRange);
    	var diff = length * tickRange   / (max - min);
    	plotArr = make2DArr(  Math.round ((max - min)/tickRange + 1 ));
    	
		for(var i = 0 ; i < plotArr.length ; i ++)
		{
			plotArr[i][0] = i*diff;
			if (tickRange.toString().indexOf('.') == -1){
				plotArr[i][1] = min+i*tickRange;
			}else{
				plotArr[i][1] = (min+i*tickRange).toFixed(tickRange.toString().substring(tickRange.toString().indexOf('.')+1,tickRange.toString().length).length);
			}
		}	    
		//alert(obj.plotXMargin);
		for(var i = 0 ; i < node.length ; i ++)
		{
			node[i] = length* ((mainArr[axis][i]-min)) /((max - min));
		}
	//	alert(node);
	}
	return { plotArr : plotArr, node : node};
}



function makeLegend(legendX, legendY, mainValueArr, color, colors){
	if(mainValueArr.length<24){
    	var legendNode = new Array();	
    	var legendText = new Array();	
		for(var i = 0; i < mainValueArr.length ; i++)
		{						
			legendNode[i] = new Kinetic.Circle({
				x: legendX+15,
				y: legendY+15*i+11+20,
				radius: 5,
				opacity: 0.7,
				fill: (color==-1)?('green'):getLegendColor(i, colors, mainValueArr)
			});			
			legendText[i] = new Kinetic.Text({
				x: legendX+20,
		        y: legendY+15*i+20,
				text: (color==-1)?('green'):mainValueArr[i],
				fontFamily: 'Calibri',
				fontSize: 13,
				padding: 5,
				fill: 'black',
				align:'center'
			});				
		}	
		var maxLengthLegendText = legendText[0].getWidth();
		for(var i=0; i<mainValueArr.length; i++)
		{
			if(legendText[i].getWidth()>maxLengthLegendText)
			{
				maxLengthLegendText=legendText[i].getWidth();
			}						
		}		
	}else{
		var tick= 5; //default legend ticks is 5        	            
        var max = findMaxValue(mainArr[color]);		
        var min = findMinValue(mainArr[color]);	
        var tickRange = (max - min)/tick;
        tickRange = setTickRange( Math.ceil( Math.log(tickRange) / Math.log(10)) , tickRange);
        var newMax = tickRange * Math.ceil(max/tickRange);     		
        var newMin= tickRange * Math.floor(min/tickRange);     	
    	var plotArr = new Array((newMax-newMin)/tickRange+1);		        	
		for(var i = 0 ; i < plotArr.length ; i ++)
		{
			if((tickRange.toString().indexOf('.') == -1)){
				plotArr[i] = newMin + i*tickRange;
			}else{
				plotArr[i] = (newMin + i*tickRange).toFixed(tickRange.toString().substring(tickRange.toString().indexOf('.')+1,tickRange.toString().length).length);
			}
		}	
		var legendNode = new Array();	
    	var legendText = new Array();	
    	for(var i = 0; i < plotArr.length ; i++)
		{										
			legendText[i] = new Kinetic.Text({
				x: legendX+30,
		        y: legendY+20*i+15,
				text: '-  '+plotArr[ (plotArr.length-1)-i ],
				fontFamily: 'Calibri',
				fontSize: 13,
				padding: 5,
				fill: (i==0 || i==plotArr.length-1 )?'#eeeeee':'black',
				align:'center'
			});						
		}		    	
    		
    	legendNode[0] = new Kinetic.Rect({
			x: legendX+15,
			y:  legendY + 47 + 20*((newMax-newMin)/tickRange-1) - 20*(max - min )/tickRange - 20*(min -newMin)/tickRange,
			width :20,
			height :  20*(max - min)/tickRange,
			opacity: 0.7,
			fillLinearGradientStartPoint: [0, 0],
	        fillLinearGradientEndPoint: [0, 20*(max - min)/tickRange],
	        fillLinearGradientColorStops: [0, 'rgb(0,255,0)', 1, 'rgb(0,128,0)'],								
		});				
		var maxLengthLegendText = legendText[0].getWidth();		
		for(var i=0; i<plotArr.length; i++)
		{
			if(legendText[i].getWidth()>maxLengthLegendText)
			{
				maxLengthLegendText=legendText[i].getWidth();
			}						
		}		
	}	
	var legendMain= new Kinetic.Text({
		x: legendX,
        y: legendY+5,
		text: labelArr[color],
		fontFamily: 'Calibri',
		fontSize: 15,
		fill: 'black',
		fontStyle: 'bold',
		align:'center'
	});		
	if(legendMain.getWidth() > maxLengthLegendText ){
		maxLengthLegendText=legendMain.getWidth();
	}		
	 var legendRect= new Kinetic.Rect({
		x:legendX,
		y:legendY,
		width: maxLengthLegendText + 30,
		height: legendText[i-1].getY()-legendY + 30, //i is set by (mainValueArr.length) or  (plotArr.length)
		stroke: 'black',
		fill: '#eeeeee'
	});			
	legendMain.setWidth(legendRect.getWidth());
	var group = new Kinetic.Group({
		width:  legendRect.getWidth(),
		height:  legendRect.getHeight()
	});	
	group.add(legendRect);
	group.add(legendMain);
	for(var i = 0; i < legendNode.length; i++){
		group.add(legendNode[i]);
	}
	for(var i = 0; i < legendText.length; i++){
		group.add(legendText[i]);
	}
	return group;
}