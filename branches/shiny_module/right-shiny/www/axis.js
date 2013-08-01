var MakeAxis = {};
(function() {
	 MakeAxis = function(id, mainArr, optionObj) {
		this._id = id;
		this._buildAxis(id, mainArr, optionObj);
		this._drawAxis(id, mainArr, optionObj);
	}
	MakeAxis.prototype = {
		_buildAxis: function(id, mainArr, optionObj) {
			this.xTick= (optionObj.xTick==undefined)?(5):(optionObj.xTick);	//default x tick is 5
            this.yTick= (optionObj.yTick==undefined)?(5):(optionObj.yTick); //default y tick is 5
			//set width.
			if(optionObj.width != undefined){
				this.width = optionObj.width;
			}else{
				if(optionObj.width == undefined){
					this.width = 300;
				}
			}
			//set height.
			if(optionObj.height != undefined){
				this.height = optionObj.height;
			}else{
				if(optionObj.height == undefined){
					this.height = 300;
				}
			}
			this.plotXMargin=this.width*0.2; //canvas left, right margin
			this.plotYMargin=this.height*0.2; //canvas top, bottom margin
			this.plotLength=this.width*0.02; //margin from plot box
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
			//check if continuous or discrete.
			if(mainArr.isDiscrete[this.x] == true){
				this.xDiscrete = true;
				var tmp = setAxis_discrete(mainArr.dataArr, this.x, this.width);
				this.xMax = -1;
				this.xMin = -1;
				this.xNode = tmp.node;
				this.xdiff = tmp.diff;
				this.xPlotArr = tmp.array;
			}else{
				this.xDiscrete = false;
				this.xMax = findMaxValue(mainArr.dataArr[this.x]);
	            this.xMin = findMinValue(mainArr.dataArr[this.x]);	            
				var tmp = setAxis_continue(this.xMax, this.xMin, this.xTick, this.width);
				this.xMax = tmp.max;
				this.xMin = tmp.min;
				this.xdiff = -1;
				this.xPlotArr= tmp.array;		
			}
			if(mainArr.isDiscrete[this.y] == true){
				this.yDiscrete = true;
				var tmp = setAxis_discrete(mainArr.dataArr, this.y, this.height);
				this.yMax = -1;
				this.yMin = -1;
				this.yNode = tmp.node;
				this.ydiff = tmp.diff;
				this.yPlotArr = tmp.array;
			}else{
				this.yDiscrete = false;
				this.yMax = findMaxValue(mainArr.dataArr[this.y]);
	            this.yMin = findMinValue(mainArr.dataArr[this.y]);
				var tmp = setAxis_continue(this.yMax, this.yMin, this.yTick, this.height);
				this.yMax = tmp.max;
				this.yMin = tmp.min;
				this.ydiff = -1;
				this.yPlotArr= tmp.array;				
			}
			//set plotRect.
			setPlotRect(this);
			//set axis variables.
			setXAxis(this);
			setYAxis(this);
		},
		changeY: function() {
			setYAxis(this);
			this._drawAxis(this._id);
		},
		_drawAxis: function(id) {
			document.getElementById('container'+id).onmousemove =getCoords;
			document.getElementById('container'+id).onclick = function() {
		        document.getElementById('regcoords');
		    };
			this.stage = new Kinetic.Stage({            
				container: 'container'+id,            
				width : this.width+this.plotXMargin*2,						
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
			this.stage.add(this.plotLayer);
		}
	}
})();

//set axis with continuous data.
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
//set axis with discrete data.
function setAxis_discrete(dataArr, axis, length)
{
	var node = new Array();
	node[0] = 0;
	var tmp = new Array();  //the names of each content below
	tmp[0] = dataArr[axis][0];
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
	
	return {
		'diff'	: diff,
		'node'	: node,
		'array' : plotArr
	};	
}


/**  set axis  **/
//set x axis variables.
//xPlotArr should be needed.
function setXAxis(obj)
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
function setYAxis(obj)
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