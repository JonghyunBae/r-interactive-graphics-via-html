/**  Draw Dot graph(scatter)  **/
var Dot = {};
(function() {
	Dot = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this.axisObj = axisObj;
		this.dataObj = dataObj;
		this.xLabel = xLabel;
		this.yLabel = yLabel;
		this.optionObj = optionObj;
		this.dataId = dataObj.$id ++;
		this.graphId = axisObj.numberOfGraph ++;
		this.firstDraw = true;
		this._type = "dotGraph";
		// event add
		dataObj.graphObjArr[this.dataId] = this;
		axisObj.graphObjArr[this.graphId] = this;
		if (dataObj.$isOffload) {
			dataObj.$isSelected[this.dataId] = nullUpdate;
			dataObj.refreshArr[this.dataId] = nullUpdate;				
	    	this.firstUpdate = nullUpdate;
			axisObj.hoverArr[this.graphId] = nullUpdate;
			axisObj.boxSearchArr[this.graphId] = nullUpdate;
		} else {
			dataObj.$isSelected[this.dataId] = dotUpdate();
			dataObj.refreshArr[this.dataId] = makeRefresh(axisObj.stage);				
	    	this.firstUpdate = firstUpdate(dataObj);
			axisObj.hoverArr[this.graphId] = dotHover();
			axisObj.boxSearchArr[this.graphId] = dotBoxSearch(this);
		}
		
	};
	Dot.prototype = {
			_draw: function () {
				if (this.firstDraw) {
					this._init(this.axisObj, this.dataObj, this.xLabel, this.yLabel,this.optionObj);
					this.firstDraw = false;
				}
				this._drawSet(this.axisObj, this.dataObj, this.xLabel, this.yLabel, this.optionObj);
			},
			_init: function (axisObj, dataObj, xLabel, yLabel, optionObj) {
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
				// set the base color.
				if(optionObj.baseColor != undefined && optionObj.baseColor != 'n'){
					this.baseColor = optionObj.baseColor;
				}else{
					this.baseColor = 'green';
				}
				
				// find subSetting.				
				if(optionObj.subSet != undefined && optionObj.subSet != 'n'){
					var subSet = findSubSet(dataObj, dataObj.labelArr, optionObj.subSet);					
				}else{
					var subSet = -1;
				}
				this.subSet = subSet;
			},
			_drawSet: function(axisObj, dataObj, xLabel, yLabel, optionObj) {
				// get pixel values from axis
				var temp = axisObj._getPixelXY(dataObj[xLabel], dataObj[yLabel]);
				var xArr = temp.xArr;
				var yArr = temp.yArr;
				var labelArr = getFields(dataObj);				
				var subSet = this.subSet;
				this.node = new Array();
				if (this.colorOn == true) {
					for (var i=0; i<xArr.length; i++) {						
						if (!(xArr[i] == -1 || yArr[i] == -1) && (subSet == -1 || eval(subSet))) {
							this.node[i] = new Kinetic.Circle({
								name: i,
								x: xArr[i],
								y: yArr[i],
								radius: this.radius,
								stroke: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								fill: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								selected: 0,
								opacity: 0.5,
								info: "Node: " + i + "\r\n" + getNodeinfo(dataObj, i)
							});
						} else {
							this.node[i] = null;
						}
					}
				} else {
					for (var i=0; i<xArr.length; i++) {
						if (!(xArr[i] == -1 || yArr[i] == -1) && (subSet == -1 || eval(subSet))) {
							this.node[i] = new Kinetic.Circle({
								name: i,
								x: xArr[i],
								y: yArr[i],
								radius: this.radius,
								stroke: this.baseColor,
								fill: this.baseColor,
								selected: 0,
								opacity: 0.5,
								info: "Node: " + i + "\r\n" + getNodeinfo(dataObj, i)
							});
						} else {
							this.node[i] = null;
						}
					}
				}
				this.dataLayer = new Kinetic.Layer();	
				for (var i=0; i<this.node.length; i++) {
					if (this.node[i] != null) {
						this.dataLayer.add(this.node[i]);
					}
				}
				//add layer
				axisObj.stage.add(this.dataLayer);
				
	        	// event add
				axisObj.dataLayerArr[this.graphId] = this.dataLayer;
			}
	}
})();
/**  Draw Dot graph(scatter) End  **/

function dotBoxSearch (graphObj) {
	return function (smallX, smallY, bigX, bigY) {
			var tmpNodeArr = new Array();
			var tmpNodeArr1 = new Array();
			if (ctrlPressed == true) {
				for (var i=0; i<graphObj.node.length; i++) {
					if (smallX <= graphObj.node[i].getX() && graphObj.node[i].getX() <= bigX && smallY <= graphObj.node[i].getY() && graphObj.node[i].getY() <= bigY) {
						tmpNodeArr.push(graphObj.node[i].getName());
	                }
				}
				allGraphUpdate(graphObj, tmpNodeArr, null, 'ctrl');
			} else {
				for (var i=0; i<graphObj.node.length; i++) {
					if (smallX <= graphObj.node[i].getX() && graphObj.node[i].getX() <= bigX && smallY <= graphObj.node[i].getY() && graphObj.node[i].getY() <= bigY) {
						tmpNodeArr.push(graphObj.node[i].getName());
	                }
				}
				allGraphUpdate(graphObj, tmpNodeArr, 1, null);
			}
		};
}
/**  update function  **/
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function dotUpdate () {
	return	function (node, selectOn) {
			if (node.getSelected() == 1 && selectOn < 0) {		//unselect
				node.setStroke(node.getFill());
				node.setScaleX(1);
				node.setScaleY(1);
				node.setOpacity(0.5);
				node.setSelected(0);
			} else if (node.getSelected() == 0 && selectOn > 0) {	//select
				node.setStroke('black');
				node.setScaleX(2);
				node.setScaleY(2);
				node.setOpacity(1);
				node.setSelected(1);
				node.moveToTop();
			}
		};
}
/**  update function end  **/

function dotHover () {
	return function (node, overOff) {// over: 1 , off: 0
			if (overOff == 1) {
				node.setScaleX(1.5);
                node.setScaleY(1.5);
                node.draw();
			} else if (overOff == 0) {
				var tween = new Kinetic.Tween({
        			node: node, 
			        duration: 0.01,
			        scaleX: 1,
			        scaleY: 1
        		}).play(); 
			}
	};
}


/**  Regression functions for scatter  **/
/*
//linear regression.
function linearSendArr(Name)
{
	var dataObj = Name.graphObjArr[0].dataObj;
	var xLabel = Name.graphObjArr[0].xLabel;
	var yLabel = Name.graphObjArr[0].yLabel;
	var xArr = new Array();
	var yArr = new Array();
	
	// refine array by searching hidden nodes.
	for(var i = 0 ; i < dataObj.$isSelected.length ; i ++){
		if(dataObj.$isSelected[i][0] < 2){
			xArr.push(dataObj[xLabel][i]);
			yArr.push(dataObj[yLabel][i]);
		}
	}
	
	window.Shiny.onInputChange("containerId", Name.containerId);
	window.Shiny.onInputChange("xx", xArr);
	window.Shiny.onInputChange("yy", yArr);
	window.Shiny.onInputChange("graph", "linear");
	window.Shiny.onInputChange("start", 1);
}
//loess regression.
function loessSendArr(Name)
{
	var dataObj = Name.graphObjArr[0].dataObj;
	var xLabel = Name.graphObjArr[0].xLabel;
	var yLabel = Name.graphObjArr[0].yLabel;
	var xArr = new Array();
	var yArr = new Array();
	
	// refine array by searching hidden nodes.
	for(var i = 0 ; i < dataObj.$isSelected.length ; i ++){
		if(dataObj.$isSelected[i][0] < 2){
			xArr.push(dataObj[xLabel][i]);
			yArr.push(dataObj[yLabel][i]);
		}
	}
	
	window.Shiny.onInputChange("containerId", Name.containerId);
	window.Shiny.onInputChange("xx", xArr);
	window.Shiny.onInputChange("yy", yArr);
	window.Shiny.onInputChange("graph", "loess");
	window.Shiny.onInputChange("start", 1);
}
*/
/**  Regression functions for scatter end  **/



