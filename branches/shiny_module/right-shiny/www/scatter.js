/**  draw sactter  **/
// label array is used for tooltipgetinfo and color setting. --> should be refined!

var Scatter = {};

(function() {

	Scatter = function(mainArr, plotObject, xLabel, yLabel, optionObj) {
		this._type = 'scatter';
		this.id = mainArr.id;
		this.labelArr = mainArr.labelArr; // this is for legend make.
		this._init(mainArr, optionObj);
		
		//execute build
		var returnValue = this._build(mainArr, plotObject, xLabel, yLabel, optionObj);
		
		if(returnValue == 1){
			//only when excuting build is success, execute draw
			this._draw(plotObject);
			mainArr.id ++;
		}
		//objArr[mainArr.id-1] = this;
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
		this.stage = plotObject.stage;
    };
    Scatter.prototype = {
    		
		_init: function(mainArr, optionObj) {
			
			this.radius = (optionObj.radius == undefined) ? (2) : (optionObj.radius); // default radius is 2
			// set the color type
            if(optionObj.color == undefined){
                this.color = -1; //default color                  
            }else{
            	this.color = optionObj.color;
                this.colorArr = setColor(mainArr[optionObj.color], mainArr.isDiscrete[optionObj.color]);
                //this.colorArr = tmpColorArr.indexArr;
            }                  
		},
		
		_build: function(mainArr, plotObject, xLabel, yLabel, optionObj) {
			//check whether each axis is the same type of plotObject.
			if(!(plotObject.isXDiscrete == mainArr.isDiscrete[xLabel] && plotObject.isYDiscrete == mainArr.isDiscrete[yLabel])){
				alert("Can't draw scatter!");
				return -1;
			}
			//check option color is assigned if option legend is assined.
            if(this.color == -1 && optionObj.legend != undefined){
            	alert("Can't draw legend without color!");
				return -1;                    
            }
            //check option legend name is appropriate
            if(optionObj.legend !=undefined){
                var legendChk = optionObj.legend.toLowerCase();
                if( legendChk == 'right' || legendChk == 'left' || legendChk == 'topright' || legendChk == 'topleft'){                           
                     this.legend = optionObj.legend;
                }else{
                	alert("Legend should be \"right\", \"left\", \"topright\" or \"topleft\"!");
                	return -1;
                }
            }      
			//set the legend text.
            if(this.color != -1){
            	//this.legendX = plotObject.plotXMargin + plotObject.width + plotObject.plotLength*5;
        		//this.legendY = plotObject.plotYMargin - plotObject.plotLength;
        		setLegendPosition(this, plotObject);
        		
        		alert(this.legendX + " "+this.legendY);
        		// making legend.
            	MakeLegend(this, this.colorArr);	     
            	
            	
        		//resize plotObject's width. It depends on legendGroup's width.
        		plotObject.stage.setWidth(plotObject.stage.getWidth()+ this.legendGroup.getWidth());
        		
        		//When legend is right or left, move legend layer to center. 			        		
        		if(this.legend == 'right' || this.legend == 'left'){
        			this.legendLayer.setY((plotObject.height-this.legendGroup.getHeight())/2);
        		}
        		
        		//move plotObject left.
        		if(this.legend == 'left' || this.legend == 'topleft'){
        			plotObject.plotLayer.setX(plotObject.plotLayer.getX() + this.legendGroup.getWidth() + plotObject.plotLength*5 );
            		plotObject.plotLayer.draw();            		
        		}

        	//	this.dataLayer.setX(this.dataLayer.getX() + 100);
        	//	this.dataLayer.draw();
            	// making legend.
            	//setLegendMake(this, this.mainValueArr, this.colors);	            	
            }
               
            
            
            var nodeX = new Array();
			var nodeY = new Array();
			//nodeX set.
			if(mainArr.isDiscrete[xLabel] == true){	// x - discrete
				for(var i = 0 ; i < mainArr[xLabel].length ; i ++){
					nodeX[i] = plotObject.xPlotArr[plotObject.xNode[i]][0] + plotObject.plotXMargin;    					
				}
			}else{  // x - continuous
				for(var i = 0 ; i < mainArr[xLabel].length ; i ++){
					if(mainArr[xLabel][i] > plotObject.xMax || mainArr[xLabel][i] < plotObject.xMin){
						nodeX[i] = -1;
					}else{
						nodeX[i] = plotObject.width * (mainArr[xLabel][i] - plotObject.xMin) / (plotObject.xMax - plotObject.xMin) + plotObject.plotXMargin;
					}
				}
			}
			//nodeY set.
			if(mainArr.isDiscrete[yLabel] == true){	// y - discrete
				for(var i = 0 ; i < mainArr[yLabel].length ; i ++){
					if(nodeX[i] == -1){
						nodeY[i] = -1;
					}else{
						nodeY[i] = plotObject.height + plotObject.plotYMargin - plotObject.yPlotArr[plotObject.yNode[i]][0];
					}    					
				}
			}else{  // y - continuous
				for(var i = 0 ; i < mainArr[yLabel].length ; i ++){
					if(nodeX[i] == -1){
						nodeY[i] = -1;
					}else if(mainArr[yLabel][i] > plotObject.yMax || mainArr[yLabel][i] < plotObject.yMin){
						//alert(plotObject.yMax + "m" + mainArr.dataArr[this.y][i]);
						nodeX[i] = -1;
						nodeY[i] = -1;
					}else{
						nodeY[i] = plotObject.height + plotObject.plotYMargin - plotObject.height * (mainArr[yLabel][i] - plotObject.yMin) / (plotObject.yMax - plotObject.yMin);
					}
				}
			}
			var tooltipTextGetInfo = new Array();
			for(var i = 0; i < mainArr[yLabel].length ; i++)
			{
				tooltipTextGetInfo[i] =  mainArr.labelArr[0] + " : " + mainArr[mainArr.labelArr[0]][i]+ "\r\n" ;
				for(var j = 1; j < mainArr.labelArr.length ; j ++){
					tooltipTextGetInfo[i] = tooltipTextGetInfo[i] + mainArr.labelArr[0] + " : " + mainArr[mainArr.labelArr[0]][i]+ "\r\n" ;
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
						x: (this.legend == "topleft" || this.legend =="left") ? nodeX[i] + this.legendGroup.getWidth() + plotObject.plotLength*5 : nodeX[i],
						y: nodeY[i],
						radius: this.radius,
						stroke: (this.color == -1) ? 'green': this.colorArr.indexArr[i],
						strokeWidth: 1,
						fill: (this.color == -1) ? 'green': this.colorArr.indexArr[i],
						selected : 0,
						info :  "Node : " + cnt + "\r\n" + tooltipTextGetInfo[i]
					});
					mainArr.isSelected[i][this._id] = scatterUpdate(this, cnt);	//save event handler
					cnt ++;
				}else{
					overCnt ++;
				}
			}
			if(overCnt > 0){
				alert(overCnt + " nodes can't be draw in this plot range.");
			}
			// make main labels.
			MakeMainLabel(this, plotObject, xLabel, yLabel);
			setTooltip(this);
			return 1;
		},
		
		_draw : function(plotObject) {
			
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



//////////////////////////////////// common used for graph /////////////////////////////////

/**  add layers  **/
// plotLayer(legend, mainLabel), tooltip, data
function addLayer(obj, stage)
{
	obj.plotLayer = new Kinetic.Layer();
/*	if(obj.color != -1){
		stage.setWidth(stage.getWidth() + obj.legendGroup.getWidth());
		obj.plotLayer.add(obj.legendLayer);
	}	*/
	obj.plotLayer.add(obj.mainLabel);
	stage.add(obj.tooltipLayer);
	stage.add(obj.dataLayer);
	stage.add(obj.plotLayer);
	if(obj.color != -1){
		stage.add(obj.legendLayer);
	}
	
}
/**  add layers end  **/
/**  make Main Label  **/
function MakeMainLabel(obj, plot, xLabel, yLabel)
{

	obj.mainLabel = new Kinetic.Text({
	   name : 'mainLabel',
	   x: plot.plotXMargin + plot.width/2, 
	   y: plot.plotYMargin * 0.3,
	   offset : {x: (obj._type + ' of ' + xLabel + ' & ' + yLabel).length/2 * 10, y:0},
	   text: obj._type + ' of ' + xLabel + ' & ' + yLabel,
	   fontSize: 20,
	   fontStyle: 'bold',
	   fontFamily: 'Calibri',
	   fill: 'black',
	});
}
/**  make Main Label end  **/

function setColor(dataArr, isDiscrete)
{
	if(isDiscrete == true){
		var temp = this.calcXArr(dataArr);
		return makeColor_discrete(temp.xArr, temp.index);
	}else{
		var temp = this.calcXArr(dataArr);
		return makeColor_continuous(dataArr); // under construction.
	}
}
function makeColor_continuous(array) // under construction.
{

	var ret = new Object(); //return object
	ret.isDiscrete = false;
	
	var colors = new Array();	
	var mainValueArr = new Array();
    var tmpColorArr = new Array();
	var reTmpColorArr = new Array();
	var cnt=0;
	var j = 0;
	var sortedColorArr = new Array();	
	for(var i = 0; i < array.length ; i ++){
		sortedColorArr[j] = {
				a : array[i],
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
	for(var i=0; i<sortedColorArr.length; i++){		// re assign
		reTmpColorArr[sortedColorArr[i].b]=tmpColorArr[ i ]; 
	}
	for(var i=0; i<sortedColorArr.length; i++){		//re re assign
		tmpColorArr[i]=reTmpColorArr[i];	
	}
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
	var indexArr = new Array(array.length);
	for(i = 0 ; i < array.length; i++){
		indexArr[i]=colors[tmpColorArr[i]]
	}
 	ret.colors = colors;
	ret.indexArr = indexArr;
 	return ret;
}
function makeColor_discrete(array, index)
{
	var ret = new Object();
	ret.isDiscrete = true;
	ret.label = new Array();
	var colors = new Array();
	var indexArr = new Array(index.length);
	var rgb = {R: new Array(), G: new Array(), B: new Array()};
 	var rgbFreq = 4.8 / array.length;
 	var rgbCenter = 128;
 	var rgbWidth = 127;
 	for(var i = 0 ; i < array.length ; ++ i)
 	{
 		rgb.R[i]  = parseInt( Math.sin(rgbFreq*i + 0) * rgbWidth + rgbCenter );
 		rgb.G[i] = parseInt( Math.sin(rgbFreq*i + 2) * rgbWidth + rgbCenter );
 		rgb.B[i]  = parseInt( Math.sin(rgbFreq*i + 4) * rgbWidth + rgbCenter );
 		colors[i] = 'rgb('+rgb.R[i]+','+rgb.G[i]+','+ rgb.B[i]+')';
 		ret[array[i]] = colors[i];
 		ret.label[i] = array[i];
 	}
 	for(var i = 0 ; i < index.length ; i ++){ 		
 		indexArr[i] = ret[ret.label[index[i]]];
 	}
 	ret.colors = colors;
 	ret.indexArr = indexArr;
 	return ret;
}
function calcXArr(dataArr)
{
	var cnt = 0;
	var xArr = new Array();
	var index = new Array();
	xArr[cnt] = dataArr[0];
	index[cnt] = 0;
	cnt ++;
	for(i = 1 ; i < dataArr.length ; i++)
	{
		for(j = 0 ; j < xArr.length ; j ++)
		{
			if(xArr[j] == dataArr[i]){
				index[cnt++] = j;
				break;
			}
		}
		if(j == xArr.length)
		{
			xArr.push(dataArr[i]);
			index[cnt ++] = j;
		}
	}
	return {
		'xArr' : xArr,
		'index': index
	};
}

function sfetColor(colorArr) //set color
{
	var colors = new Array();
	var mainValueArr = new Array();
    var tmpColorArr = new Array();
	var cnt=0;
	var j = 0;
	var sortedColorArr = new Array();	
	for(var i = 0; i < colorArr.length ; i ++){
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
	
	var colArr = new Array();
	for( var i = 0 ; i < tmpColorArr.length ; i ++){
		colArr[i] = colors[tmpColorArr[i]];
	}
	return colArr;
}

function getColor(n, colors, mainValueArr, tmpColorArr)
{
	if(mainValueArr.length<24){
		var tmpColor='green';
		tmpColor = colors[tmpColorArr[n]];
		return tmpColor;
	}else{
		var tmpColor='green';
		tmpColor = colors[tmpColorArr[n]];
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
		var temp = findMaxMinValue(mainValueArr);
        var max = temp.max;		
        var min = temp.min;	
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
//legend position setting.
function setLegendPosition(obj, plotObject)
{	
      obj.legendX = 0;
      obj.legendY = 0;
      if (obj.legend == 'topright' || obj.legend == 'right')  {
              obj.legendX = plotObject.plotXMargin+plotObject.width+plotObject.plotLength*5;
              obj.legendY = plotObject.plotYMargin-plotObject.plotLength;
      }else if(obj.legend == 'topleft' ||obj.legend == 'left'){
              obj.legendX = plotObject.plotLength*5;
              obj.legendY = plotObject.plotYMargin-plotObject.plotLength;                           
      }
}
/**  legend set functions  **/
//making legend setting.
function setLegendMake(obj, mainValueArr, colors)
{
	var myLegend = makeLegend(obj.legendX, obj.legendY, mainValueArr, obj.color, colors, obj.labelArr);					
	obj.legendGroup = new Kinetic.Group({
		width: myLegend.getWidth(),
		height : myLegend.getHeight()
	});
	obj.legendGroup.add(myLegend);
	/*obj.legendLayer = new Kinetic.Layer({name:'legendLayer', draggable:true});
	obj.legendLayer.on('mouseover', function(evt){  
		document.body.style.cursor = "pointer";
	}); */
	obj.legendLayer.add(obj.legendGroup);
	if(obj.legend != 'topleft' && obj.legend != 'topright'){
		obj.legendLayer.setY((obj.height-obj.legendGroup.getHeight())/2); //move legend layer to center.
	}
}
/**  legend set functions end  **/
/**  legend set functions  **/
//making legend setting.
function MakeLegend(obj, colorArr)
{
	var myLegend = setLegend(obj, colorArr);					
	obj.legendGroup = new Kinetic.Group({
		width: myLegend.getWidth(),
		height : myLegend.getHeight()
	});
	obj.legendGroup.add(myLegend);
	obj.legendLayer = new Kinetic.Layer({name:'legendLayer', draggable:true});
	obj.legendLayer.on('mouseover', function(evt){  
		document.body.style.cursor = "pointer";
	}); 
	obj.legendLayer.on('mouseout', function(evt){  
		document.body.style.cursor = "default";
	}); 
	obj.legendLayer.add(obj.legendGroup);
	
}
/**  legend set functions end  **/



function setLegend(obj, colorArr){
	if(colorArr.isDiscrete == true){
    	var legendNode = new Array();	
    	var legendText = new Array();	
		for(var i = 0; i < colorArr.label.length ; i++)
		{						
			legendNode[i] = new Kinetic.Circle({
				x: obj.legendX+15,
				y: obj.legendY+15*i+11+20,
				radius: 5,
				opacity: 0.7,
				fill: colorArr.colors[i]
			});			
			legendText[i] = new Kinetic.Text({
				x: obj.legendX+20,
		        y: obj.legendY+15*i+20,
				text: colorArr.label[i],
				fontFamily: 'Calibri',
				fontSize: 13,
				padding: 5,
				fill: 'black',
				align:'center'
			});				
		}	
		var maxLengthLegendText = legendText[0].getWidth();
		for(var i=0; i<colorArr.label.length; i++)
		{
			if(legendText[i].getWidth()>maxLengthLegendText)
			{
				maxLengthLegendText=legendText[i].getWidth();
			}						
		}		
	}else{
		var tick= 5; //default legend ticks is 5  
		var temp = findMaxMinValue(mainValueArr);
        var max = temp.max;		
        var min = temp.min;	
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
		x: obj.legendX,
        y: obj.legendY+5,
		text: obj.color,
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
		x:obj.legendX,
		y:obj.legendY,
		width: maxLengthLegendText + 30,
		height: legendText[i-1].getY()-obj.legendY + 30, //i is set by (mainValueArr.length) or  (plotArr.length)
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



