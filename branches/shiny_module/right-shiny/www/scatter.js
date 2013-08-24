var Scatter = {};

(function() {
	Scatter = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._init(axisObj, dataObj, optionObj);
		this._draw(axisObj, dataObj, xLabel, yLabel);
	};
	Scatter.prototype = {
			_init: function(axisObj, dataObj, optionObj) {
				this.radius = (optionObj.radius == undefined) ? (2) : (optionObj.radius); // default radius is 2
				// check color
				if(axisObj.legendLabel != undefined){
					var legendLabel = axisObj.legendLabel;
					if(dataObj[legendLabel].isDiscrete != true && dataObj[legendLabel].colorIndex == undefined){
						addColorField(dataObj[legendLabel]);
					}else if(dataObj[legendLabel].isDiscrete == undefined && dataObj[legendLabel].color == undefined){
						addColorField(dataObj[legendLabel]);
					}
					this.colorOn = true;
				}else{
					this.colorOn = false;
				}
				this.colorLabel = legendLabel;
			},
			_draw: function(axisObj, dataObj, xLabel, yLabel) {
				// get pixel values from axis
				var temp = axisObj._getPixel(dataObj[xLabel], dataObj[yLabel]);
				var xArr = temp.xArr;
				var yArr = temp.yArr;
				var cnt = 0;
				this.node = new Array();
				if(this.colorOn == true){
					for(var i = 0 ; i < xArr.length ; i ++){
						if(!(xArr[i] == -1 || yArr[i] == -1)){
							this.node[cnt] = new Kinetic.Circle({
								name: cnt,
								x: xArr[i],
								y: yArr[i],
								radius: this.radius,
								stroke: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								fill: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								selected: 0,
								info: "Node: " + cnt 
							});
							cnt ++;
						}
					}
				}else{
					for(var i = 0 ; i < xArr.length ; i ++){
						if(!(xArr[i] == -1 || yArr[i] == -1)){
							this.node[cnt] = new Kinetic.Circle({
								name: cnt,
								x: xArr[i],
								y: yArr[i],
								radius: this.radius,
								stroke: 'green',
								fill: 'green',
								selected: 0,
								info: "Node: " + cnt 
							});
							cnt ++;
						}
					}
				}
	        	// event add
				//scatterObj.refreshArr[this.id] = makeRefresh(this.stage);
				//scatterObj.updateArr[this.id] = scatterUpdate(this.node);
	        	//this.firstUpdate = firstUpdate(scatterObj);
	        	
	        	this.dataLayer = new Kinetic.Layer();	
	        	for(var i = 0 ; i < this.node.length ; i ++){
					this.dataLayer.add(this.node[i]);
				}
				//axisObj.dataLayerArr.push(this.dataLayer);
				//axisObj.hoverArr.push(scatterHover());
				//alert(axisObj.hoverArr[1]);
				//add layers
			//	axisObj.stage.add(this.tooltipLayer);
				axisObj.stage.add(this.dataLayer);
			}
	}
})();

/*var MakeScatterObj = {};

(function () {
	
	MakeScatterObj = function(mainArr, xLabel, yLabel, optionObj) {
		this.xLabel = xLabel;
		this.yLabel = yLabel;
		this.mainLabel = "scatter of " + xLabel + " & " + yLabel;
		this.id = 0;
		this.double = false;
		this.legend = false;
		
		// basic calculation.
		if(mainArr.isDiscrete[xLabel] == true){
			this.isXDiscrete = true;
			var temp = findDiscreteNum(mainArr[xLabel]);
			var xArr = new Array();
			xArr[0] = temp.discreteArr;
			xArr[1] = temp.mapping;
			var hasArr = new Array();
			for(var i = 0 ; i < mainArr[xLabel].length ; i ++ ){
				hasArr[i] = i;
			}			
			this.xArr = xArr;
		}else{
			this.isXDiscrete = false;
			this.xArr = new Array();
			this.xArr[0] = mainArr[xLabel];
			this.xArr[1] = mainArr[xLabel];
			var hasArr = new Array();
			for(var i = 0 ; i < mainArr[xLabel].length ; i ++ ){
				hasArr[i] = i;
			}
		}
		
		if(mainArr.isDiscrete[yLabel] == true){
			this.isYDiscrete = true;
			var temp = findDiscreteNum(mainArr[yLabel]);
			var yArr = new Array();
			yArr[0] = temp.discreteArr;
			yArr[1] = temp.mapping;
			this.yArr = yArr;
		}else{
			this.isYDiscrete = false;
			this.yArr = new Array();
			this.yArr[0] = mainArr[yLabel];
			this.yArr[1] = mainArr[yLabel];
		}
		
		// check color.
		if(optionObj.color != undefined){
			this.colorLabel = optionObj.color;
			// set legend.
			this.legend = new Object();
			// set color.
			// making color part.
			if(this.colorLabel != this.xLabel && this.colorLabel != this.yLabel && mainArr.isDiscrete[this.colorLabel] == true){ // another color axis.
				// find number of colors.
				var temp = findDiscreteNum(mainArr[this.colorLabel]);
				var tempColorArr = temp.discreteArr;
				var numberIndex = temp.mapping;
				// get colorObj according to tempColorArr.
				this.colorObj = makeColor_discrete(tempColorArr);
				// make colorArr
				var colorArr = new Array();
				for(var i = 0 ; i < numberIndex.length ; i ++){
					colorArr[i] = this.colorObj.colors[numberIndex[i]];
				}				
				this.colorArr = colorArr;
				// for legend(colorArr and each label of each color needed).
				var legend_colorArr = this.colorObj.colors;
				var legend_labels = tempColorArr;
				var legend_isDiscrete = true;
			}else if(this.colorLabel == this.xLabel && mainArr.isDiscrete[this.colorLabel] == true){ // matches with xAxis.
				// get colorObj according to tempColorArr.
				this.colorObj = makeColor_discrete(xArr[0]);
				// make colorArr
				var colorArr = new Array();
				for(var i = 0 ; i < xArr[1].length ; i ++){
					colorArr[i] = this.colorObj.colors[xArr[1][i]];
				}				
				this.colorArr = colorArr;
				// for legend(colorArr and each label of each color needed).
				var legend_colorArr = this.colorObj.colors;
				var legend_labels = xArr[0];
				var legend_isDiscrete = true;
			}else if(this.colorLabel == this.yLabel && mainArr.isDiscrete[this.colorLabel] == true){ // matches with yAxis.
				// get colorObj according to tempColorArr.
				this.colorObj = makeColor_discrete(yArr[0]);
				// make colorArr
				var colorArr = new Array();
				for(var i = 0 ; i < yArr[1].length ; i ++){
					colorArr[i] = this.colorObj.colors[yArr[1][i]];
				}				
				this.colorArr = colorArr;
				// for legend(colorArr and each label of each color needed).
				var legend_colorArr = this.colorObj.colors;
				var legend_labels = yArr[0];
				var legend_isDiscrete = true;
			}else if(mainArr.isDiscrete[this.colorLabel] == false){ // continuous color.
				this.colorObj = makeColor_continuous(mainArr[this.colorLabel]);
				this.colorArr = this.colorObj.indexArr;
				// for legend(colorArr and each range label in continuous legend).
				var legend_colorArr = this.colorObj.mainValueArr;
				var legend_isDiscrete = false;
				var temp = findMaxMinValue(mainArr[this.colorLabel]);
		        this.legend.max = temp.max;
		        this.legend.min = temp.min;
				var legend_labels = null;
			}
			
			// set legend.
			if(optionObj.legend != undefined){				
				this.legend.position = optionObj.legend;
			}else{
				this.legend.position = 'right';
			}
			this.legend.isDiscrete = legend_isDiscrete;
			this.legend.colorArr = legend_colorArr;
			this.legend.labels = legend_labels;
			this.legend.colorLabel = this.colorLabel;
		}else{ // no color.
			this.colorArr = new Array();
			for(var i = 0 ; i < this.xArr[0].length ; i ++){
				this.colorArr[i] = 'green';
			}
		}
		
		// set mapping for event handler.
		birthReport(mainArr, this, hasArr, hasArr);
	}
})();





var Scatter = {};

(function() {
	Scatter = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		
	};
	Scatter.prototype = {
			
	}
})();


(function() {
	
	Scatter = function(axisObj, dataObj, xLabel, , colorArr,  optionObj) {
		this._type = 'scatter';
		this.id = scatterObj.id;
		this.preId = {x : -1, y : -1};
		this.stage = axisObj.stage;
		this._draw(axisObj, scatterObj, xArr, yArr, colorArr, optionObj);
		scatterObj.id ++;
	};
	Scatter.prototype = {
		_draw: function(axisObj, scatterObj, xArr, yArr, colorArr, optionObj) {
			this.radius = (optionObj.radius == undefined) ? (2) : (optionObj.radius); // default radius is 2
			if(optionObj.double == true){
				var x = 0;
				var y = 0;			
				var tempData = -1;
				this.node = new Array();
				for(var i = 0; i < xArr.length ; i ++){
					x = (axisObj.isXDiscrete == true) ? (xArr[i]+1)*axisObj.xDiff + axisObj.plotXMargin : (xArr[i]-axisObj.xMin)*axisObj.width/(axisObj.xMax - axisObj.xMin) + axisObj.plotXMargin;
					if(x != tempData){
						y = (axisObj.isYDiscrete == true) ? axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.yDiff : axisObj.plotYMargin + axisObj.height - (yArr[i] - axisObj.yMin)*axisObj.height/(axisObj.yMax - axisObj.yMin);
					}
					this.node[i] = new Kinetic.Circle({
						name : i,
						x: x,
		    			y: y,
						radius: this.radius,
						stroke: colorArr[i],
						strokeWidth: 1,
						fill: colorArr[i],
						selected : 0,
						info :  "Node : " + i + "\r\n"
					});
					if(i < yArr.length){
        				y = y - yArr[i+1]*axisObj.height/axisObj.yMax;
        			}
        			tempData = this.node[i].getX();
	        	}
			}else{
				this.node = new Array();
				for(var i = 0; i < xArr.length ; i ++){
					this.node[i] = new Kinetic.Circle({
						name : i,
						x: (axisObj.isXDiscrete == true) ? (xArr[i]+1)*axisObj.xDiff + axisObj.plotXMargin : (xArr[i] - axisObj.xMin)*axisObj.width/(axisObj.xMax - axisObj.xMin) + axisObj.plotXMargin,
		    			y: (axisObj.isYDiscrete == true) ? axisObj.plotYMargin + axisObj.height - (yArr[i]+1)*axisObj.yDiff  : axisObj.plotYMargin + axisObj.height - (yArr[i] - axisObj.yMin)*axisObj.height/(axisObj.yMax - axisObj.yMin),
						radius: this.radius,
						stroke: colorArr[i],
						strokeWidth: 1,
						fill: colorArr[i],
						selected : 0,
						info :  "Node : " + i + "\r\n"
					});
	        	}
			}
			
        	// event add
			scatterObj.refreshArr[this.id] = makeRefresh(this.stage);
			scatterObj.updateArr[this.id] = scatterUpdate(this.node);
        	this.firstUpdate = firstUpdate(scatterObj);
        	
        	
        	//setTooltip(this);
        	
        	this.dataLayer = new Kinetic.Layer();	
        	for(var i = 0 ; i < this.node.length ; i ++){
				this.dataLayer.add(this.node[i]);
			}
			axisObj.dataLayerArr.push(this.dataLayer);
			axisObj.hoverArr.push(scatterHover());
			//alert(axisObj.hoverArr[1]);
			//add layers
		//	axisObj.stage.add(this.tooltipLayer);
			axisObj.stage.add(this.dataLayer);
		}
	};
})();
*/
function scatterHover()
{
	return function(node, overOff) // over: 1 , off: 0
		{
			if(overOff == 1){
				node.setScaleX(1.5);
                node.setScaleY(1.5);
                node.draw();
			}else if(overOff == 0){
				var tween = new Kinetic.Tween({
        			node: node, 
			        duration: 0.01,
			        scaleX: 1,
			        scaleY: 1
        		}).play(); 
			}
		};
}
/**  update function  **/
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function scatterUpdate(node)
{
	return	function(ids, selectOn)
		{
			if(ids.length == undefined){
				if(node[ids].getSelected() == 1 && selectOn == 0){		//unselect
					node[ids].setStroke(node[ids].getFill());
					node[ids].setScaleX(1);
					node[ids].setScaleY(1);
					node[ids].setSelected(0);
				}else if(node[ids].getSelected() == 0 && selectOn == 1){	//select
					node[ids].setStroke('black');
					node[ids].setScaleX(2);
					node[ids].setScaleY(2);
					node[ids].setSelected(1);
					node[ids].moveToTop();
				}
			}else{
				for(var i = 0 ; i < ids.length ; i ++){
					if(node[ids[i]].getSelected() == 1 && selectOn == 0){		//unselect
						node[ids[i]].setStroke(node[ids[i]].getFill());
						node[ids[i]].setScaleX(1);
						node[ids[i]].setScaleY(1);
						node[ids[i]].setSelected(0);
					}else if(node[ids[i]].getSelected() == 0 && selectOn == 1){	//select
						node[ids[i]].setStroke('black');
						node[ids[i]].setScaleX(2);
						node[ids[i]].setScaleY(2);
						node[ids[i]].setSelected(1);
						node[ids[i]].moveToTop();
					}
				}
			}
			
		};
}
/**  update function end  **/


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




