/**  MakeAxis draws an axis  **/
// id should be matched with container id.
// xArr, yArr should be array.
// xDiscrete, yDiscrete should be true or false.
// optionObj can be width, height, xTick, yTick, xLabel, yLabel, bin.

var MakeAxis = {};

(function() {

	MakeAxis = function(id, xArr, yArr, xDiscrete, yDiscrete, optionObj) {

		this.id = id;
		this.width = (optionObj.width == undefined) ? (300) : (optionObj.width); // default width is 300
		this.height = (optionObj.height == undefined) ? (300) : (optionObj.height); // default height is 300
		this.xTick = (optionObj.xTick == undefined) ? (5) : (optionObj.xTick); //default x tick is 5
        this.yTick = (optionObj.yTick == undefined) ? (5) : (optionObj.yTick); //default y tick is 5
		this.plotXMargin = this.width*0.2; //canvas left, right margin
		this.plotYMargin = this.height*0.2; //canvas top, bottom margin
		this.plotLength = this.width*0.02; //margin from plot box
		
		document.getElementById('container'+ id).onmousemove = getCoords;
		document.getElementById('container'+ id).onclick = function() {
	        document.getElementById('regcoords');
	    };

		this._build(xArr, yArr, xDiscrete, yDiscrete, optionObj);
		this._draw();
	}

	MakeAxis.prototype = {
			
		_build: function(xArr, yArr, xDiscrete, yDiscrete, optionObj) {			
			
			// check if continuous or discrete.
			if(xDiscrete == true){
				this.xDiscrete = true;
				var tmp = setAxis_discrete(xArr, this.width);
				this.xMax = -1;
				this.xMin = -1;
				this.xdiff = tmp.diff;
				this.xPlotArr = tmp.array;
			}else{
				this.xDiscrete = false;

				var temp = findMaxMinValue(xArr);
				this.xMax = temp.max;
	            this.xMin = temp.min;
				if(optionObj.xbin != undefined){
					this.xbin = optionObj.xbin;
					this.xTick = Math.round((this.xMax - this.xMin) / this.xbin);
				}
				var tmp = setAxis_continue(this.xMax, this.xMin, this.xTick, this.width);
				this.xMax = tmp.max;
				this.xMin = tmp.min;
				this.xdiff = -1;
				this.xPlotArr= tmp.array;		
			}
			if(yDiscrete == true){
				this.yDiscrete = true;
				var tmp = setAxis_discrete(yArr, this.height);
				this.yMax = -1;
				this.yMin = -1;
				this.ydiff = tmp.diff;
				this.yPlotArr = tmp.array;
			}else{
				this.yDiscrete = false;
				var temp = findMaxMinValue(yArr);
				this.yMax = temp.max;
	            this.yMin = temp.min;
				var tmp = setAxis_continue(this.yMax, this.yMin, this.yTick, this.height);
				this.yMax = tmp.max;
				this.yMin = tmp.min;
				this.ydiff = -1;
				this.yPlotArr= tmp.array;				
			}
			// make stage.
			makeStageLayer(this);
			// make plotRect.
			makePlotRectLayer(this);
			// make axis layers.
			makeXAxisLayer(this);
			makeYAxisLayer(this);
			// make label layers.
			if(optionObj.xLabel != undefined){
				makeXLabelLayer(this, optionObj.xLabel);
			}
			if(optionObj.yLabel != undefined){
				makeYLabelLayer(this, optionObj.yLabel);
			}
		},
		
		_draw: function() {
			
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
			// add x, y label.
			if(this.xLabel != undefined){
				this.plotLayer.add(this.xLabel);
			}
			if(this.yLabel != undefined){
				this.plotLayer.add(this.yLabel);
			}
			this.stage.add(this.plotLayer);
		}
	}
})();

/**  set axis  **/
// set axis with continuous data.
function setAxis_continue(max, min, tick, length)
{
	var tickRange = (max - min) / tick;
	var tmp = Math.ceil(Math.log(tickRange) / Math.log(10));
	tickRange = setTickRange(tmp, tickRange);
	max = tickRange * Math.ceil(max/tickRange);		      
	min = tickRange * Math.floor(min/tickRange);
	var diff = length * tickRange / (max - min);
	var plotArr = make2DArr(  Math.round ((max - min)/tickRange + 1 ));
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
	return {
		'max'	: max,
		'min'	: min,
		'array'	: plotArr
	};
}
// set axis with discrete data.
function setAxis_discrete(array, length)
{
	var plotArr = make2DArr(array.length);
	var diff = length / (array.length + 1);
	
	for(var i = 1 ; i < plotArr.length+1 ; i ++)
	{
		plotArr[i-1][0] = i*diff;
		plotArr[i-1][1] = array[i-1];
	}
	
	return {
		'diff'	: diff,
		'array' : plotArr
	};	
}
/**  set axis end  **/
/**  make stage  **/
function makeStageLayer(obj)
{
	obj.stage = new Kinetic.Stage({
		container: 'container'+ obj.id,
		width : obj.width+obj.plotXMargin*2,
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
		        fontSize: 15,
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

for(var i = 0; i < obj.yPlotArr.length ; i ++)
{
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
       fontSize: 15,
       fontFamily: 'Calibri',
       fill: 'black',
       width: 60,
       align: 'center',
       rotation: (Math.PI)*3/2
   });        
}
}
/**  make axis layers end  **/