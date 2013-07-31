/**  draw sactter  **/
var Scatter = {};    
(function() {
	Scatter = function(id, plotObject, mainArr, optionObj) {			
		this._type = 'scatter';		
		this._id = id;
		this._labelArr = mainArr.labelArr; //localize later
		//objArr[id-1] = this;
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
		this.stage = plotObject.stage;
		this.draw(id, plotObject, mainArr, optionObj);
    };
    Scatter.prototype = {
    		draw : function(id, plotObject, mainArr, optionObj) {
    			//check radius.
    			if(optionObj.radius != undefined){
    				this.radius = optionObj.radius;
    			}else{
    				this.radius = 2;
    			}
    			//check the x label
    			if(optionObj.x != undefined){
    			 	for(var i = 0 ; i < mainArr.labelArr.length ; i ++)	
    			     {
    			     	if(mainArr.labelArr[i].toLowerCase()==optionObj.x.toLowerCase()){	            		
    			     		this.x =  i;
    			     		 break;
    			     	}
    			     	if(i == mainArr.labelArr.length - 1){
    			     		alert('retype x label');
    			     		this.x = 0;
    			     	}
    			     }
    			}else{
    				alert('x should be defined!');
    				this.x = 0;
    			}
    			//check the y label
    			if(optionObj.y != undefined){
    				 for(var i = 0 ; i < mainArr.labelArr.length ; i ++)	
    			     {
    			     	if(mainArr.labelArr[i].toLowerCase()==optionObj.y.toLowerCase()){	            		
    			     		this.y =  i;
    			     		 break;
    			     	}
    			     	if(i == mainArr.labelArr.length - 1){
    			     		alert('retype y label');
    			     		this.y = 0;
    			     	}
    			     }
    			}else{
    				alert('y should be defined!');
    				this.y = 0;
    			}
    			//check whether each axis is the same type of plotObject.
    			if(!(plotObject.xDiscrete == mainArr.isDiscrete[this.x] && plotObject.yDiscrete == mainArr.isDiscrete[this.y])){
    				alert("Can't draw scatter!");
    				return;
    			}
    			
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
            		for(var i = 0 ; i < mainArr.labelArr.length ; i ++)
	  	            {
	  	            	if(this._labelArr[i].toLowerCase()==optionObj.color.toLowerCase()){	            		
	  	            		 this.color =  i;
	  	            		 break;
	  	            	}
	  	            	if(i == mainArr.labelArr.length - 1){
	  	            		alert('retype colors label');
	  	            		this.color = 0;
	  	            	}
	  	            }	
            		var tmpSetColor =  setColor(mainArr.dataArr[this.color]);
    				var colors = tmpSetColor.colors;
					var mainValueArr = tmpSetColor.mainValueArr;
					var tmpColorArr = tmpSetColor.tmpColorArr;
	            }
	            //set the legend text.
	            if(this.color != -1){
	            	this.lengend = "right";
	            	this.legendX = plotObject.plotXMargin + plotObject.width + plotObject.plotLength*5;
	        		this.legendY = plotObject.plotYMargin - plotObject.plotLength;
	            	// making legend.
	            	setLegendMake(this, mainValueArr, colors);	            	
	            }
    			var nodeX = new Array();
    			var nodeY = new Array();
    			//nodeX set.
    			if(mainArr.isDiscrete[this.x] == true){	// x - discrete
    				if(this.x != plotObject.x){
    					alert("x axis is different from plot");
    					return;
    				}
    				for(var i = 0 ; i < mainArr.dataArr[this.x].length ; i ++){
    					nodeX[i] = plotObject.xPlotArr[plotObject.xNode[i]][0] + plotObject.plotXMargin;    					
    				}
    			}else{  // x - continuous
    				for(var i = 0 ; i < mainArr.dataArr[this.x].length ; i ++){
    					if(mainArr.dataArr[this.x][i] > plotObject.xMax || mainArr.dataArr[this.x][i] < plotObject.xMin){
    						nodeX[i] = -1;
    					}else{
    						nodeX[i] = plotObject.width * (mainArr.dataArr[this.x][i] - plotObject.xMin) / (plotObject.xMax - plotObject.xMin) + plotObject.plotXMargin;
    					}
    				}
    			}
    			//nodeY set.
    			if(mainArr.isDiscrete[this.y] == true){	// y - discrete
    				if(this.y != plotObject.y){
    					alert("y axis is different from plot");
    					return;
    				}
    				for(var i = 0 ; i < mainArr.dataArr[this.y].length ; i ++){
    					if(nodeX[i] == -1){
    						nodeY[i] = -1;
    					}else{
    						nodeY[i] = plotObject.height + plotObject.plotYMargin - plotObject.yPlotArr[plotObject.yNode[i]][0];
    					}    					
    				}
    			}else{  // y - continuous
    				for(var i = 0 ; i < mainArr.dataArr[this.y].length ; i ++){
    					if(nodeX[i] == -1){
    						nodeY[i] = -1;
    					}else if(mainArr.dataArr[this.y][i] > plotObject.yMax || mainArr.dataArr[this.y][i] < plotObject.yMin){
    						//alert(plotObject.yMax + "m" + mainArr.dataArr[this.y][i]);
    						nodeX[i] = -1;
    						nodeY[i] = -1;
    					}else{
    						nodeY[i] = plotObject.height + plotObject.plotYMargin - plotObject.height * (mainArr.dataArr[this.y][i] - plotObject.yMin) / (plotObject.yMax - plotObject.yMin);
    					}
    				}
    			}
    			var tooltipTextGetInfo = new Array();
				for(var i = 0; i < mainArr.dataArr[this.y].length ; i++)
				{
					tooltipTextGetInfo[i] = this._labelArr[0]+" : " + mainArr.dataArr[0][i]+ "\r\n" ;
					for(var j=1; j< this._labelArr.length ; j++){
						tooltipTextGetInfo[i]=tooltipTextGetInfo[i]+ this._labelArr[j]+" : " + mainArr.dataArr[j][i]+ "\r\n" ;
					}
				}
    			//set dots.
    			this.node = new Array();
    			var cnt = 0;
    			var overCnt = 0;
    			for(var i = 0; i < nodeX.length ; i++)
				{
    				if(nodeX[i] != -1){
    					this.node[cnt] = new Kinetic.Circle({
    						name : cnt,
    						x: nodeX[i],
    						y: nodeY[i],
    						radius: this.radius,
    						stroke: (this.color == -1) ? 'green': getColor(i,colors, mainValueArr, tmpColorArr),
    						strokeWidth: 1,
    						fill: (this.color == -1) ? 'green': getColor(i,colors, mainValueArr, tmpColorArr),
    						selected : 0,
    						info :  "Node : " + cnt + "\r\n" + tooltipTextGetInfo[i]
    					});
    					mainArr.isSelected[i][id] = scatterUpdate(this, cnt);	//save event handler
    					cnt ++;
    				}else{
    					overCnt ++;
    				}
				}
    			if(overCnt > 0){
    				alert(overCnt + " nodes can't be draw in this plot range.");
    			}
    			// set labels.
    			setXLabel(this, plotObject);
				setYLabel(this, plotObject);
				setMainLabel(this, plotObject);
				setTooltip(this);
				
				// make dataLayer.
    			this.dataLayer = new Kinetic.Layer();	
				for(var i = 0 ; i < this.node.length ; i ++)
				{
					if(i % parseInt(this.node.length/20) == 0)
					{
						plotObject.stage.add(this.dataLayer);
						this.dataLayer = new Kinetic.Layer();
					}
					this.dataLayer.add(this.node[i]);
				}				
				//Total layers added to plot stage.
				addLayer(this, plotObject.stage);
		}
    }
})();
function addLayer(obj, stage)
{
	obj.plotLayer = new Kinetic.Layer();
	if(obj.color != -1){
		stage.setWidth(stage.getWidth() + obj.legendGroup.getWidth());
		obj.plotLayer.add(obj.legendLayer);
	}	
	obj.plotLayer.add(obj.xLabel);    
	obj.plotLayer.add(obj.yLabel);    
	obj.plotLayer.add(obj.mainLabel);
	stage.add(obj.tooltipLayer);
	stage.add(obj.dataLayer);
	stage.add(obj.plotLayer);
	
	
}
/**  set labels **/
//set xLabel
function setXLabel(obj, plot)
{
	obj.xLabel = new Kinetic.Text({
   name : 'xLabel',
   x: plot.plotXMargin + plot.width / 2,
   y: plot.plotYMargin + plot.height + 5 * plot.plotLength,
   offset : {x: obj._labelArr[obj.x].length/2 * 10, y:0},
   text: obj._labelArr[obj.x],
   fontSize: 15,
   fontStyle: 'bold',
   fontFamily: 'Calibri',
   fill: 'black',
});
}
//set yLabel
function setYLabel(obj, plot)
{
	obj.yLabel = new Kinetic.Text({
	 name : 'yLabel',
   x: plot.plotXMargin - plot.plotLength - 40,
   y: plot.plotYMargin + plot.height/2  - 15,
   offset : {x: obj._labelArr[obj.y].length/2 * 10},
   text: obj._labelArr[obj.y],
   fontSize: 15,
   fontStyle: 'bold',
   fontFamily: 'Calibri',
   fill: 'black',
   rotation: (Math.PI)*3/2
});
}
//set Main Label
function setMainLabel(obj, plot)
{
	obj.mainLabel = new Kinetic.Text({
   name : 'mainLabel',
   x: plot.plotXMargin + plot.width/2, 
   y: plot.plotYMargin * 0.3,
   offset : {x: (obj._type + ' of ' + obj._labelArr[obj.x] + ' & ' + obj._labelArr[obj.y]).length/2 * 10, y:0},
   text: obj._type + ' of ' + obj._labelArr[obj.x] + ' & ' + obj._labelArr[obj.y],
   fontSize: 20,
   fontStyle: 'bold',
   fontFamily: 'Calibri',
   fill: 'black',
});
}
/**  set labels end **/


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

function makeLegend(legendX, legendY, mainValueArr, color, colors, labelArr){
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

/**  legend set functions  **/
//making legend setting.
function setLegendMake(obj, mainValueArr, colors)
{
	var myLegend = makeLegend(obj.legendX, obj.legendY, mainValueArr, obj.color, colors, obj._labelArr);					
	obj.legendGroup = new Kinetic.Group({
		width: myLegend.getWidth(),
		height : myLegend.getHeight()
	});
	obj.legendGroup.add(myLegend);
	obj.legendLayer = new Kinetic.Layer({name:'legendLayer', draggable:true});
	obj.legendLayer.on('mouseover', function(evt){  
		document.body.style.cursor = "pointer";
	}); 
	obj.legendLayer.add(obj.legendGroup);
	if(obj.legend != 'topleft' && obj.legend != 'topright'){
		obj.legendLayer.setY((obj.height-obj.legendGroup.getHeight())/2); //move legend layer to center.
	}
}
/**  legend set functions end  **/

/**  Regression functions for scatter  **/
//linear regression.
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
//loess regression.
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
				window.Shiny.onInputChange("id1", Name._id);
				window.Shiny.onInputChange("type1", Name._type);
				window.Shiny.onInputChange("graph1", "loess");
				window.Shiny.onInputChange("xx1", tempData[Name.x]);
				window.Shiny.onInputChange("yy1", tempData[Name.y]);
			}
		}
	}
}
/**  Regression functions for scatter end  **/

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




