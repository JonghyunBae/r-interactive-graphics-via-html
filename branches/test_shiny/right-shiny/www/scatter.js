var Scatter = {};    
(function() {
	
	Scatter = function(id, dataArr, optionObj) {			
		this._type = 'scatter';		
		this._id = id;
		this._labelArr = labelArr; //localize later
		objArr[id-1] = this;
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
		this._init(id, dataArr, optionObj);	
    };
    Scatter.prototype = {
    		
    		_init: function(id, dataArr, optionObj){
    			//make essential variables
    			if(optionObj.width != undefined){
    				this.width = optionObj.width;
    			}else{
    				if(this.width == undefined){
    					this.width = plotWidth;
    				}
    			}
    			if(optionObj.height != undefined){
    				this.height = optionObj.height;
    			}else{
    				if(this.height == undefined){
    					this.height = plotHeight;
    				}
    			}
	            this.plotXMargin=this.width*0.2; //canvas left, right margin
	            this.plotYMargin=this.height*0.2; //canvas top, bottom margin
	            this.plotLength=this.width*0.02; //margin from plot box
	            if(optionObj.radius != undefined){
	    				this.radius = optionObj.radius;
	    			}else{
	    				if(this.radius == undefined){
	    					this.radius = plotRadius;
	    				}
	    			}
	            //check the x label
	            if(optionObj.x != undefined){
	            	for(var i = 0 ; i < this._labelArr.length ; i ++)	
		            {
		            	if(this._labelArr[i].toLowerCase()==optionObj.x.toLowerCase()){	            		
		            		 this.x =  i;
		            		 break;
		            	}
		            	if(i == this._labelArr.length - 1){
		            		alert('retype x label');
		            	}
		            }
    			}else{
    				if(this.x == undefined){
    					alert('x should be defined!');
    					this.x = 0;
    				}
    			}
	          //check the y label
	            if(optionObj.y != undefined){
	            	for(var i = 0 ; i < this._labelArr.length ; i ++)
		            {
		            	if(this._labelArr[i].toLowerCase()==optionObj.y.toLowerCase()){	            		
		            		 this.y =  i;
		            		 break;
		            	}
		            	if(i==this._labelArr.length-1){
		            		alert('retype y label');
		            	}
		            }
    			}else{
    				if(this.y == undefined){
    					alert('y should be defined!');
    					this.y = 0;
    				}
    			}
	            this.xMax = findMaxValue(dataArr[this.x]);
	            this.xMin = findMinValue(dataArr[this.x]);
	            this.yMax = findMaxValue(dataArr[this.y]);
	            this.yMin = findMinValue(dataArr[this.y]);
	            this.xTick= (optionObj.xTick==undefined)?(5):(optionObj.xTick);	//default x tick is 5
	            this.yTick= (optionObj.yTick==undefined)?(5):(optionObj.yTick); //default y tick is 5
	            
	            // set the color type
	            if(optionObj.color==undefined){
	            	if(this.color == undefined){
	            		this.color=-1; //default color
	            	}else{
	            		var tmpSetColor =  setColor(dataArr[this.color]);
	    				var colors = tmpSetColor.colors;
						var mainValueArr = tmpSetColor.mainValueArr;
						var tmpColorArr = tmpSetColor.tmpColorArr;
	            	}	            		
	            }else{
            		for(var i = 0 ; i < this._labelArr.length ; i ++)
	  	            {
	  	            	if(this._labelArr[i].toLowerCase()==optionObj.color.toLowerCase()){	            		
	  	            		 this.color =  i;
	  	            		 break;
	  	            	}
	  	            	if(i==this._labelArr.length-1){
	  	            		alert('retype colors label');
	  	            	}
	  	            }	
            		var tmpSetColor =  setColor(dataArr[this.color]);
    				var colors = tmpSetColor.colors;
					var mainValueArr = tmpSetColor.mainValueArr;
					var tmpColorArr = tmpSetColor.tmpColorArr;
	            }
	    		
	            //make legend start
	            if(optionObj.legend !=undefined){
	            	var legendChk = optionObj.legend.toLowerCase();
	  	            if( legendChk == 'right' || legendChk == 'left' || legendChk == 'topright' || legendChk == 'topleft' || legendChk == 'default' ){	            		
	  	            		 this.legend = optionObj.legend;
	  	            }else{
	  	            	//alert('retype legend! (right, left, topright, topleft, or default)');	            		
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
	            //make legend end

	        	
	        	
	        	//nodeX and nodeY is for setting gap of each axis according to tick
	            var nodeX = new Array(dataArr[this.x].length);	            
	            var xTmp = makeAxisArr(dataArr, this.width, this.x, this.xTick, this.xMax, this.xMin);  
	            nodeX = xTmp.node;
	            this.xPlotArr = xTmp.plotArr;
	            
	            var nodeY = new Array(dataArr[this.y].length);	             	            
	            var yTmp = makeAxisArr(dataArr, this.height, this.y, this.yTick, this.yMax, this.yMin);	            
	            nodeY = yTmp.node;
	            this.yPlotArr = yTmp.plotArr;
	            
	            
	            
	    		//////////Make Data Structure of nodes and essential arrays////////

	    		
				this.node = new Array();			
				
				var tooltipTextGetInfo = new Array();
				for(var i = 0; i < dataArr[this.x].length ; i++)
				{
					tooltipTextGetInfo[i]=this._labelArr[0]+" : " + dataArr[0][i]+ "\r\n" ;
					for(var j=1; j< this._labelArr.length ; j++){
						tooltipTextGetInfo[i]=tooltipTextGetInfo[i]+ this._labelArr[j]+" : " + dataArr[j][i]+ "\r\n" ;
					}
				}
				// set and make information of nodes according to color
				//var idCnt = 0;
				if(this.color==-1 ){
					for(var i = 0; i < dataArr[this.x].length ; i++)
					{
					//	if(isHidden[i] == true)
					//		continue;
						this.node[i] = new Kinetic.Circle({
							name : i,
							x: nodeX[i] + this.plotXMargin,
							y: this.height +this.plotYMargin - nodeY[i],
							radius: this.radius,
							stroke: 'green',
							strokeWidth: 1,
							fill: 'green',	//different part
							selected : 0,
							info :  "Node : "+i+"\r\n"+tooltipTextGetInfo[i]
						});			
						isSelected[i][id] = scatterUpdate(this, i);	//save event handler
					}
				}else{
					
					for(var i = 0; i < dataArr[this.x].length ; i++)
					{
						this.node[i] = new Kinetic.Circle({
							name : i,
							x: nodeX[i] + this.plotXMargin,
							y: this.height +this.plotYMargin - nodeY[i],
							radius: this.radius,
							stroke: getColor(i,colors, mainValueArr, tmpColorArr),
							strokeWidth: 1,
							fill: getColor(i,colors, mainValueArr, tmpColorArr),	//different part
							selected : 0,
							info : "Node : "+i+"\r\n"+tooltipTextGetInfo[i]
						});			
						isSelected[i][id] = scatterUpdate(this,i);	//save event handler
					}					
				}
				
				//set plotRect.
				setPlotRect(this);
				//set axis variables.
				scatterSetXAxis(this);
				scatterSetYAxis(this);
				//set label variables.
				scatterSetXLabel(this);
				scatterSetYLabel(this);
				scatterSetMainLabel(this);
				//set tooltip.
				setTooltip(this); 
    		},
			doIt: function() { 
				alert('do it'); 
			},
			draw: function(id){	//draw plot part
				
				document.getElementById('scatterContainer'+id).onmousemove =getCoords;
				document.getElementById('scatterContainer'+id).onclick = function() {
			        document.getElementById('regcoords');
			    };
			    
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
				//add base rectangular.
				this.plotLayer.add(this.plotRect);				
				//add x axis layer.
				for(var i = 0 ; i < this.xLine.length ; i ++){
					this.plotLayer.add(this.xLine[i]); 
				    this.plotLayer.add(this.xText[i]);
				}			
				//add y axis layer.				
				for(var i = 0 ; i < this.yLine.length ; i ++){
					this.plotLayer.add(this.yLine[i]); 
			        this.plotLayer.add(this.yText[i]);
				}				
				//add labels layer.
                this.plotLayer.add(this.xLabel);    
                this.plotLayer.add(this.yLabel);    
                this.plotLayer.add(this.mainLabel);
				
                //add plot layer.
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
				// add tooltip
				this.stage.add(this.tooltipLayer);
				
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
				// check linear regression on/off
				if(this.linear == true){
					this.linear = false;
					linearSendArr(this);
				}
				if(this.loess == true){
					this.loess = false;
					loessSendArr(this);
				}
			},
			changeX: function(id, dataArr, optionObj){
		            	for(var i = 0 ; i < this._labelArr.length ; i ++)	
			            {
			            	if(this._labelArr[i].toLowerCase()==optionObj.x.toLowerCase()){	            		
			            		 this.x =  i;
			            		 break;
			            	}
			            }
		            	if(isDiscrete[this.x] == false){
		            		this.xMax = findMaxValue(dataArr[this.x]);
				            this.xMin = findMinValue(dataArr[this.x]);
		            	}						
			            var nodeX = new Array(dataArr[this.x].length);	            
			            var xTmp = makeAxisArr(dataArr, this.width, this.x, this.xTick, this.xMax, this.xMin);  
			            nodeX = xTmp.node;
			            this.xPlotArr = xTmp.plotArr;
			            for(var i = 0; i < dataArr[this.x].length ; i++)
						{
			            	this.node[i].setX(nodeX[i] + this.plotXMargin);
						}
						scatterSetXAxis(this);
						scatterSetXLabel(this);
						scatterSetMainLabel(this);
						this.draw(id);
			},
			changeY: function(id, dataArr, optionObj){				
		            	for(var i = 0 ; i < this._labelArr.length ; i ++)	
			            {
			            	if(this._labelArr[i].toLowerCase()==optionObj.y.toLowerCase()){	            		
			            		 this.y =  i;
			            		 break;
			            	}
			            }
		            	if(isDiscrete[this.x] == false){
							this.yMax = findMaxValue(dataArr[this.y]);
				            this.yMin = findMinValue(dataArr[this.y]);
		            	}
			            var nodeY = new Array(dataArr[this.y].length);	             	            
			            var yTmp = makeAxisArr(dataArr, this.height, this.y, this.yTick, this.yMax, this.yMin);	            
			            nodeY = yTmp.node;
			            this.yPlotArr = yTmp.plotArr;
			            for(var i = 0; i < dataArr[this.y].length ; i++)
						{
			            	this.node[i].setY(this.height +this.plotYMargin - nodeY[i]);
						}
						scatterSetYAxis(this);
						scatterSetYLabel(this);
						scatterSetMainLabel(this);
						this.draw(id);
			},
			update: function(){
				alert('scatter is updated');				
			},
			draw_regression: function(type, xArr, yArr){
				if(type == "linear")
					this.linear = true;
				if(type == "loess")
					this.loess = true;
				var tickRange = (this.xMax-this.xMin)/this.xTick;	
				var tmp = Math.ceil( Math.log(tickRange) / Math.log(10));
				tickRange = setTickRange(tmp, tickRange);
		        var max = tickRange * Math.ceil(this.xMax/tickRange);		      
		        var min = tickRange * Math.floor(this.xMin/tickRange);
		        var nodeX = new Array(xArr.length)	
				for(var i = 0 ; i < nodeX.length ; i ++)
				{
					nodeX[i] = this.width* ((xArr[i]-min)) /((max - min));
				} 		        
		        tickRange = (this.yMax-this.yMin)/this.yTick;	
				tmp = Math.ceil( Math.log(tickRange) / Math.log(10));
				tickRange = setTickRange(tmp, tickRange);
		        max = tickRange * Math.ceil(this.yMax/tickRange);		      
		        min = tickRange * Math.floor(this.yMin/tickRange);
		        var nodeY = new Array(yArr.length)	
				for(var i = 0 ; i < nodeY.length ; i ++)
				{
					nodeY[i] = this.height* ((yArr[i]-min)) /((max - min));
				}		        
				var node = new Array(xArr.length)
				var dataLayer = new Kinetic.Layer();
		        for(var i = 1; i < xArr.length ; i++)
				{
					node[i-1] = new Kinetic.Line({
                        points: [	nodeX[i-1] + this.plotXMargin, 
                                 	this.height +this.plotYMargin - nodeY[i-1], 
                                 	nodeX[i] + this.plotXMargin,
                                     this.height +this.plotYMargin - nodeY[i]],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
					dataLayer.add(node[i-1]);
				}
				this.stage.add(dataLayer);     	
			}
	};
    
})();
			      
  		      
                 


function setColor(colorArr) //set color
{
	var colors = new Array();
	var mainValueArr = new Array();
    var tmpColorArr = new Array();
    
   
	var cnt=0;
	var j = 0;
	var sortedColorArr = new Array();	
	for(var i=0; i<colorArr.length; i++){	
	//	if(isHidden[i] == true)
	//		continue;
		sortedColorArr[j] = {
				a : colorArr[i],
				b : j
		};
		j ++;
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
	//alert(sortedColorArr.length);
	//alert(colorArr.length);
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
	 	{isSelected
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

/**  Regression functions for scatter  **/
// linear regression.
function linearSendArr(Name)
{
	if(Name._type == "scatter"){	// only for scatter.
		if(isDiscrete[Name.x] == false && isDiscrete[Name.y] == false){		// only for continuous data.
			if(Name.linear == true){
				Name.linear = false;
				Name.draw(Name._id);
				eventTrigger(Name);
			}else{		
				Name.linear = true;		
				window.Shiny.onInputChange("id", Name._id);
				window.Shiny.onInputChange("type", Name._type);
				window.Shiny.onInputChange("graph", "linear");
				window.Shiny.onInputChange("xx", tempData[Name.x]);
				window.Shiny.onInputChange("yy", tempData[Name.y]);
			}
		}
	}

}
// loess regression.
function loessSendArr(Name)
{
	if(Name._type == "scatter"){	// only for scatter.
		if(isDiscrete[Name.x] == false && isDiscrete[Name.y] == false){		// only for continuous data.
			if(Name.loess == true){
				Name.loess = false;
				Name.draw(Name._id);
				eventTrigger(Name);
			}else{		
				Name.loess = true;		
				window.Shiny.onInputChange("id", Name._id);
				window.Shiny.onInputChange("type", Name._type);
				window.Shiny.onInputChange("graph", "loess");
				window.Shiny.onInputChange("xx", tempData[Name.x]);
				window.Shiny.onInputChange("yy", tempData[Name.y]);
			}
		}
	}
}
/**  Regression functions for scatter end  **/


function makeAxisArr(dataArr, length, axis, tick, max, min)	 
{														
	var node = new Array(dataArr[axis].length);
	if(isDiscrete[axis] == true)
	{		
		var tmp = new Array();  //the names of each content below
		tmp[0] = dataArr[axis][0];
		node[0] = 0;
		for(var i = 1 ; i < dataArr[axis].length ; i++)
    	{
    		for(j = 0 ; j < tmp.length ; j ++)
    		{
    			if(tmp[j] == dataArr[axis][i])
    			{
    				node[i] = j;
    				break;
    			}	            				
    		}
    		if(j == tmp.length)
    		{
    			node[i] = j;
    			tmp.push(dataArr[axis][i]);
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
				var point = tickRange.toString().substring(tickRange.toString().indexOf('.')+1,tickRange.toString().length).length;
				if(point > 3){ // for setting the resonable point
					point = 3;
				}
				plotArr[i][1] = (min+i*tickRange).toFixed(point);
			}
		}		
		for(var i = 0 ; i < node.length ; i ++)
		{
			node[i] = length* ((dataArr[axis][i]-min)) /((max - min));
		}
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
        var max = findMaxValue(mainValueArr);		
        var min = findMinValue(mainValueArr);	
        var tickRange = (max - min)/tick;
        tickRange = setTickRange( Math.ceil( Math.log(tickRange) / Math.log(10)) , tickRange);
        var newMax = tickRange * Math.ceil(max/tickRange);     		
        var newMin= tickRange * Math.floor(min/tickRange);    
    	var plotArr = new Array(parseInt((newMax-newMin)/tickRange+1));		        	
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
				fill: (i==0 || i==plotArr.length-1 )?'#fff':'black',
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
		fill: '#fff'
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

/**  update function  **/
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function scatterUpdate(obj, id)
{
	return	function(selectOn)
				{
					if(selectOn == 0 && obj.node[id].getSelected() == 1)		//unselect
					{	
						obj.node[id].setStroke(obj.node[id].getFill());
						obj.node[id].setScaleX(1);
						obj.node[id].setScaleY(1);
						obj.node[id].setSelected(0);
					}else if(selectOn == 1 && obj.node[id].getSelected() == 0){	//select
						obj.node[id].setStroke('black');
						obj.node[id].setScaleX(2);
						obj.node[id].setScaleY(2);
						obj.node[id].setSelected(1);
						obj.node[id].moveToTop();
					}
				};
}
/**  update function end  **/

/**  set labels **/
//set xLabel
function scatterSetXLabel(obj)
{
	obj.xLabel = new Kinetic.Text({
     name : 'xLabel',
     x: obj.plotXMargin+obj.width/2,
     y: obj.plotYMargin+obj.height+5*obj.plotLength,
     offset : {x: labelArr[obj.x].length/2 * 10, y:0},
     text: labelArr[obj.x],
     fontSize: 15,
     fontStyle: 'bold',
     fontFamily: 'Calibri',
     fill: 'black',
 });
}
//set yLabel
function scatterSetYLabel(obj)
{
	obj.yLabel = new Kinetic.Text({
     x: obj.plotXMargin-obj.plotLength - 40,
     y: obj.plotYMargin+obj.height/2  - 15,
     offset : {x: labelArr[obj.y].length/2 * 10},
     text: labelArr[obj.y],
     fontSize: 15,
     fontStyle: 'bold',
     fontFamily: 'Calibri',
     fill: 'black',
     rotation: (Math.PI)*3/2
 });
}
//set Main Label
function scatterSetMainLabel(obj)
{
	obj.mainLabel = new Kinetic.Text({
     name : 'mainLabel',
     x: obj.plotXMargin+obj.width/2, 
     y: obj.plotYMargin *0.3 ,
     offset : {x: ('Scatter of ' + labelArr[obj.x] + ' & ' + labelArr[obj.y]).length/2 * 10, y:0},
     text: 'Scatter of ' + labelArr[obj.x] + ' & ' + labelArr[obj.y],
     fontSize: 20,
     fontStyle: 'bold',
     fontFamily: 'Calibri',
     fill: 'black',
 });
}
/**  set labels end **/

/**  set axis  **/
//set x axis variables.
//xPlotArr should be needed.
function scatterSetXAxis(obj)
{
	obj.xLine = new Array();
	obj.xText = new Array();
	for(var i = 0; i < obj.xPlotArr.length; i++)
	{
		obj.xLine[i] = new Kinetic.Line({
	        name : "xLine"+i,
	        points: [	obj.plotXMargin+obj.xPlotArr[i][0],
	                 	obj.plotYMargin+obj.height+obj.plotLength,
	                 	obj.plotXMargin+obj.xPlotArr[i][0],
	                 	obj.plotYMargin+obj.height+2*obj.plotLength],
	        stroke: 'black',
	        strokeWidth: 2,             
	    });
	                  
	    obj.xText[i] = new Kinetic.Text({
	        name : "xText"+i,
	        x: obj.plotXMargin+obj.xPlotArr[i][0]-30,
	        y: obj.plotYMargin+obj.height+obj.plotLength*2,
	        text: obj.xPlotArr[i][1],
	        fontSize: 15,
	        fontFamily: 'Calibri',
	        fill: 'black',
	        width: 60,
	        align: 'center'    
	    });      
	} 
}
//set y axis variables.
//yPlotArr should be needed.
function scatterSetYAxis(obj)
{
	obj.yLine = new Array();
	obj.yText = new Array();

 for(var i = 0; i < obj.yPlotArr.length ; i++)
 {
 	obj.yLine[i] = new Kinetic.Line({
         points: [	obj.plotXMargin-obj.plotLength, 
                  	obj.plotYMargin+obj.height-obj.yPlotArr[i][0], 
                  	obj.plotXMargin-2*obj.plotLength,
                  	obj.plotYMargin+obj.height-obj.yPlotArr[i][0]],
         stroke: 'black',
         strokeWidth: 2,             
     });              
     obj.yText[i] = new Kinetic.Text({
         x: obj.plotXMargin-obj.plotLength*2-15,
         y: obj.plotYMargin+obj.height-obj.yPlotArr[i][0]+30,
         text: obj.yPlotArr[i][1],
         fontSize: 15,
         fontFamily: 'Calibri',
         fill: 'black',
         width: 60,
         align: 'center',
         rotation: (Math.PI)*3/2
     });        
 }
}
/**  set axis end  **/