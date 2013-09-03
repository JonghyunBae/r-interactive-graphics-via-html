/**  Axis draws an axis  **/
var Axis = {};

(function() {
	
	Axis = function(containerId, dataObj, xLabel, yLabel, optionObj) {
		this._init(containerId, optionObj);
		this._addLegend(dataObj, optionObj);
		this._build(dataObj, xLabel, yLabel, optionObj);
		this._draw();
	};
	
	Axis.prototype = {
			
			_init: function(containerId, optionObj) {
				this.numberOfGraph = 0;
				this.containerId = containerId;
				this.width = (optionObj.width == undefined) ? (300) : (optionObj.width); // default width is 300
				this.height = (optionObj.height == undefined) ? (300) : (optionObj.height); // default height is 300
				this.xTick = (optionObj.xTick == undefined) ? (5) : (optionObj.xTick); //default x tick is 5
		        this.yTick = (optionObj.yTick == undefined) ? (5) : (optionObj.yTick); //default y tick is 5
				this.plotXMargin = this.width*0.2; //canvas left, right margin
				this.plotYMargin = this.height*0.2; //canvas top, bottom margin
				this.plotLength = this.width*0.02; //margin from plot box
				
				document.getElementById('container'+ containerId).onmousemove = getCoords;
				document.getElementById('container'+ containerId).onclick = function() {
			        document.getElementById('regcoords');
			    };
			    this.graphObjArr = new Array();
			    this.dataLayerArr = new Array();
			    this.hoverArr = new Array();
			    this.boxSearchArr = new Array();
			},
			
			_addLegend: function(dataObj, optionObj) {
				if(optionObj.legend != undefined && dataObj[optionObj.legend] != undefined){
					var check = makeLegendLayer(this, dataObj[optionObj.legend], optionObj.position, optionObj.legend);
					if(check == 1){ // if makeLegendLayer is done right, set the legend for grpahs(scatter, bar, ...)
						this.legendLabel = optionObj.legend;
					}else{
						alert("makeLegendLayer isn't done right");
					}					
				}else{
					// don't draw legend.	
				}
			},
			
			_build: function(dataObj, xLabel, yLabel, optionObj) {
				// check if continuous or discrete.
				// xAxis
				if(dataObj[xLabel].isDiscrete == undefined){ // continuous
					this.isXDiscrete = false;
					var temp = findMaxMinValue(dataObj[xLabel]);
					this.xMax = temp.max;
		            this.xMin = temp.min;
		            // frequency's min value should be 0
		            if(xLabel == 'frequency'){
		            	this.yMin = 0;
		            }
					if(optionObj.xbin != undefined){
						this.xbin = optionObj.xbin;
						this.xTick = Math.round((this.xMax - this.xMin) / this.xbin);
					}
					var tmp = setAxis_continue(this.xMax, this.xMin, this.xTick, this.width);
					this.xMax = tmp.max;
					this.xMin = tmp.min;
					this.xDiff = -1;
					this.xPlotArr= tmp.plotArr;
				}else{ // discrete
					this.isXDiscrete = true;
					var tmp = setAxis_discrete(dataObj[xLabel].index, this.width);
					this.xMax = -1;
					this.xMin = -1;
					this.xDiff = tmp.diff;
					this.xPlotArr = tmp.plotArr;
				}
				// yAxis
				if(dataObj[yLabel].isDiscrete == undefined){ // continuous
					this.isYDiscrete = false;
					var temp = findMaxMinValue(dataObj[yLabel]);
					this.yMax = temp.max;
		            this.yMin = temp.min;
		            // frequency's min value should be 0
		            if(yLabel == 'frequency'){
		            	this.yMin = 0;
		            }
					if(optionObj.ybin != undefined){
						this.ybin = optionObj.ybin;
						this.yTick = Math.round((this.yMax - this.yMin) / this.ybin);
					}
					this._setYContinuous(this.yMax, this.yMin);
				}else{ // discrete
					this.isYDiscrete = true;
					this._setYDiscrete(dataObj[yLabel].index);
				}
				// set barWidth.
				if(this.isXDiscrete == true){
					this.xbarWidth = this.xDiff/2;
				}else{
					this.xbarWidth = (this.xPlotArr[1][0] - this.xPlotArr[0][0]) - 3;
				}
				
				// make axis layers.
				makeXAxisLayer(this);
				
				// make tooltip layer.
				setTooltip(this);
				// make label layers.
				if(optionObj.mainLabel != undefined){
					MakeMainLabelLayer(this, optionObj.mainLabel);
				}
				makeXLabelLayer(this, xLabel);
				makeYLabelLayer(this, yLabel);
				// make rangeBoxLayer.
				makeRangeBoxLayer(this);
			},
			
			_setYContinuous: function(max, min) {
				var tmp = setAxis_continue(max, min, this.yTick, this.height);
				this.yMax = tmp.max;
				this.yMin = tmp.min;
				this.yDiff = -1;
				this.yPlotArr= tmp.plotArr;
				makeYAxisLayer(this);
			},
			
			_setYDiscrete: function(index) {
				var tmp = setAxis_discrete(index, this.height);
				this.yMax = -1;
				this.yMin = -1;
				this.yDiff = tmp.diff;
				this.yPlotArr = tmp.plotArr;
				makeYAxisLayer(this);
			},
			
			_draw: function() {
				// make stage.
				makeStageLayer(this);
				this.refresh = makeRefresh(this.stage);
				// make plotRect.
				makePlotRectLayer(this);
				
				this.plotLayer = new Kinetic.Layer();
				// add base rectangular.
				this.plotLayer.add(this.plotRect);				
				// add x axis layer.
				for(var i = 0 ; i < this.xLine.length ; i ++){
					this.plotLayer.add(this.xLine[i]); 
				    this.plotLayer.add(this.xText[i]);
				}
				// add y axis layer.				
				for(var i = 0 ; i < this.yLine.length ; i ++){
					this.plotLayer.add(this.yLine[i]);
			        this.plotLayer.add(this.yText[i]);
				}
				// add main, x, y label.
				if(this.mainLabel != undefined){
					this.plotLayer.add(this.mainLabel);
				}
				this.plotLayer.add(this.xLabel);
				this.plotLayer.add(this.yLabel);
				
				this.stage.add(this.plotLayer);
				// add legend layer.
				if(this.legendLayer != undefined){
					this.stage.add(this.legendLayer);
				}
				// add rangeBox layer.
				this.stage.add(this.rangeBoxLayer);
				// add tooltip layer.
				this.stage.add(this.tooltipLayer);
			},
			
			_getPixel: function(xArr, yArr) {
				var xPixelArr = new Array();
				var yPixelArr = new Array();
				var outNumber = new Array();
				if(this.isXDiscrete == true){
					var temp;
					for(var i = 0 ; i < xArr.length ; i ++){
						if(xArr[i] < 0 || xArr[i] > xArr.index.length){
							temp = -1;
						}else{
							temp = (xArr[i]+1)*this.xDiff + this.plotXMargin;
						}
						xPixelArr[i] = temp;
					}
				}else{
					var temp;
					for(var i = 0 ; i < xArr.length ; i ++){
						if(xArr[i] < this.xMin || xArr[i] > this.xMax){
							temp = -1;
						}else{
							temp = (xArr[i]-this.xMin)*this.width/(this.xMax - this.xMin) + this.plotXMargin;
						}
						xPixelArr[i] = temp;
					}
				}
				if(this.isYDiscrete == true){
					var temp;
					for(var i = 0 ; i < yArr.length ; i ++){
						if(yArr[i] < 0 || yArr[i] > yArr.index.length || xPixelArr[i] == -1){
							temp = -1;
						}else{
							temp = this.plotYMargin + this.height - yArr[i]*this.yDiff;
						}
						yPixelArr[i] = temp;
					}
				}else{
					var temp;
					for(var i = 0 ; i < yArr.length ; i ++){
						if(yArr[i] < this.yMin || yArr[i] > this.yMax || xPixelArr[i] == -1){
							temp = -1;
						}else{
							temp = this.plotYMargin + this.height - (yArr[i] - this.yMin)*this.height/(this.yMax - this.yMin);
						}
						yPixelArr[i] = temp;
					}
				}
				return {
					'xArr': xPixelArr,
					'yArr': yPixelArr
				};
			}
	}
})();

/**  set tooltip  **/
//new kenetic version -> tooltip setting change using tag
function setTooltip(obj)
{
	obj.tooltipLayer = new Kinetic.Layer();			 
	obj.tooltip = new Kinetic.Label({
	    opacity: 0.75,
	    visible: false,
	    listening: false
	  });
	obj.tooltip.add(new Kinetic.Tag({
	    fill: 'black',
	    //pointerDirection: 'down',
	    pointerWidth: 10,  
	    pointerHeight: 10, 
	    lineJoin: 'round',
	    shadowColor: 'black',
	    shadowBlur: 10,
	    shadowOffset: 10,
	    shadowOpacity: 0.2
	  }));
	obj.tooltip.add(new Kinetic.Text({
	    text: '',
	    fontFamily: 'Calibri',
	    fontSize: 15,
	    padding: 5,
	    fill: 'white'
	  }));
	obj.tooltipLayer.add(obj.tooltip);
}
/**  set tooltip end  **/ 

/**  set axis  **/
// set axis with continuous data.
function setAxis_continue(tempMax, tempMin, tick, length)
{
	var tickRange = (tempMax - tempMin) / tick;
	var tmp = Math.ceil(Math.log(tickRange) / Math.log(10));
	var bin = setTickRange(tmp, tickRange);
	//check the fixpoint.
	var fixPoint = 0;
	if(bin.toString().indexOf('.') != -1){
		fixPoint = bin.toString().substring(bin.toString().indexOf('.')+1, bin.toString().length).length;
	}
	if(tempMax > 0){
		var max = parseFloat((Math.ceil(tempMax / bin) * bin).toFixed(fixPoint));
	}else{
		var max = parseFloat((Math.ceil(tempMax / bin) * bin + bin).toFixed(fixPoint));
	}
	if(tempMax == max){
		max = max + bin;
	}
	var min = parseFloat((Math.floor(tempMin / bin) * bin).toFixed(fixPoint));
	var diff = length * bin / (max - min);
	var plotArr = make2DArr(parseInt(Math.round((max - min)/bin) + 1));
	for(var i = 0 ; i < plotArr.length ; i ++){
			plotArr[i][0] = i*diff;
			plotArr[i][1] = (min + bin*i).toFixed(fixPoint);
	}
	return {
		'max'	: max,
		'min'	: min,
		'plotArr'	: plotArr
	};
}
// set axis with discrete data.
function setAxis_discrete(index, plotLength)
{
	var plotArr = make2DArr(index.length);
	var diff = plotLength / (index.length + 1);
	
	for(var i = 0 ; i < plotArr.length ; i ++){
		plotArr[i][0] = (i + 1)*diff;
		plotArr[i][1] = index[i];
	}
	return {
			'diff' : diff,
			'plotArr' : plotArr
	};
}
/**  set axis end  **/
/**  make rangeBox(drag box)  **/
function makeRangeBoxLayer(obj)
{
	obj.rangeBox = new Kinetic.Rect({
        x: 0,
        y: 0, 
        width : 0,
        height : 0,
        fill: "blue",
        stroke: "blue",                                         
        opacity : 0.3
	});
	obj.rangeBoxLayer = new Kinetic.Layer();
	obj.rangeBoxLayer.add(obj.rangeBox);
}
/**  make rangeBox(drag box) end  **/
/**  make stage  **/
function makeStageLayer(obj)
{
	var addtionalMargin = 0;
	if(obj.legendLayer != undefined){
		addtionalMargin = obj.legendLayer.getWidth();
	}
	
	obj.stage = new Kinetic.Stage({
		name: 'stage',
		container: 'container'+ obj.containerId,
		width : obj.width + obj.plotXMargin*2 + addtionalMargin,
		height: obj.height+obj.plotYMargin*2
	});
}
/**  make stage end  **/
/**  make plotRect  **/
function makePlotRectLayer(obj)
{
	obj.plotRect = new Kinetic.Rect({
		name : "baseRect",
		x: obj.plotXMargin - obj.plotLength,
		y: obj.plotYMargin - obj.plotLength,
		width: obj.width + 2*obj.plotLength,
		height: obj.height + 2*obj.plotLength,
		stroke: 'black',
		strokeWidth: 2
	});
}
/**  make plotRect end **/
/**  make Main Label layer  **/
function MakeMainLabelLayer(obj, label)
{

	obj.mainLabel = new Kinetic.Text({
	   name : 'mainLabel',
	   x: obj.plotXMargin + obj.width/2, 
	   y: obj.plotYMargin * 0.3,
	   offset : {x: label.length/2 * 10, y:0},
	   text: label,
	   fontSize: 20,
	   fontStyle: 'bold',
	   fontFamily: 'Calibri',
	   fill: 'black',
	});
}
/**  make Main Label end  **/
/**  make x, y label layers  **/
// set xLabel
function makeXLabelLayer(obj, label)
{
	obj.xLabel = new Kinetic.Text({
	   name : 'xLabel',
	   x: obj.plotXMargin + obj.width / 2,
	   y: obj.plotYMargin + obj.height + 5*obj.plotLength,
	   offset : {x: label.length/2 * 10, y:0},
	   text: label,
	   fontSize: 15,
	   fontStyle: 'bold',
	   fontFamily: 'Calibri',
	   fill: 'black',
	});
}
// set yLabel
function makeYLabelLayer(obj, label)
{
	obj.yLabel = new Kinetic.Text({
		name : 'yLabel',
		x: obj.plotXMargin - obj.plotLength - 40,
		y: obj.plotYMargin + obj.height/2  - 15,
		offset : {x: label.length/2 * 10},
		text: label,
		fontSize: 15,
		fontStyle: 'bold',
		fontFamily: 'Calibri',
		fill: 'black',
		rotation: (Math.PI)*3/2
	});
}
/**  make x, y label layers end  **/

/**  make axis layers  **/
// make x axis variables.
// xPlotArr should be needed.
function makeXAxisLayer(obj)
{
	obj.xLine = new Array();
	obj.xText = new Array();
	var cnt = 0;
	if(obj.xPlotArr.length > 10){
		var temp = Math.ceil(obj.xPlotArr.length / 10);
	}else{
		var temp = 1;
	}
	for(var i = 0; i < obj.xPlotArr.length ; i ++)
	{
		if(i % temp == 0){
			obj.xLine[cnt] = new Kinetic.Line({
		        name : "xLine"+i,
		        points: [
		                 	obj.plotXMargin + obj.xPlotArr[i][0],
		                 	obj.plotYMargin + obj.height + obj.plotLength,
		                 	obj.plotXMargin + obj.xPlotArr[i][0],
		                 	obj.plotYMargin + obj.height + 2*obj.plotLength
		                 ],
		        stroke: 'black',
		        strokeWidth: 2,             
		    });
		                  
		    obj.xText[cnt] = new Kinetic.Text({
		        name : "xText"+i,
		        x: obj.plotXMargin + obj.xPlotArr[i][0] - 30,
		        y: obj.plotYMargin + obj.height + 2*obj.plotLength,
		        text: obj.xPlotArr[i][1],
		        fontSize: 12,
		        fontFamily: 'Calibri',
		        fill: 'black',
		        width: 60,
		        align: 'center'    
		    });
		cnt ++;
		}
	}
}
// make y axis variables.
// yPlotArr should be needed.
function makeYAxisLayer(obj)
{
	obj.yLine = new Array();
	obj.yText = new Array();

	for(var i = 0; i < obj.yPlotArr.length ; i ++){
		obj.yLine[i] = new Kinetic.Line({
	       points: [
	                	obj.plotXMargin - obj.plotLength, 
	                	obj.plotYMargin + obj.height - obj.yPlotArr[i][0], 
	                	obj.plotXMargin - 2*obj.plotLength,
	                	obj.plotYMargin + obj.height - obj.yPlotArr[i][0]
	       			],
	       stroke: 'black',
	       strokeWidth: 2,             
	   });              
	   obj.yText[i] = new Kinetic.Text({
	       x: obj.plotXMargin - obj.plotLength*2-15,
	       y: obj.plotYMargin + obj.height- obj.yPlotArr[i][0] + 30,
	       text: obj.yPlotArr[i][1],
	       fontSize: 12,
	       fontFamily: 'Calibri',
	       fill: 'black',
	       width: 60,
	       align: 'center',
	       rotation: (Math.PI)*3/2
	   });
	}
}
/**  make axis layers end  **/