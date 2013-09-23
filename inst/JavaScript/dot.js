/**  Draw Dot graph(scatter)  **/
var Dot = {};
(function() {
	Dot = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._init(axisObj, dataObj, xLabel, yLabel, optionObj);
		this._draw(axisObj, dataObj, xLabel, yLabel, optionObj);
		axisObj.numberOfGraph ++;
		dataObj.$id ++;
	};
	Dot.prototype = {
			_init: function(axisObj, dataObj, xLabel, yLabel, optionObj) {
				this.xLabel = xLabel;
				this.yLabel = yLabel;
				this.dataObj = dataObj;
				this.optionObj = optionObj;
				this.dataId = dataObj.$id;
				this.graphId = axisObj.numberOfGraph;
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
			_draw: function(axisObj, dataObj, xLabel, yLabel, optionObj) {
				// get pixel values from axis
				var temp = axisObj._getPixelXY(dataObj[xLabel], dataObj[yLabel]);
				var xArr = temp.xArr;
				var yArr = temp.yArr;
				var labelArr = getFields(dataObj);				
				var cnt = 0;
				var subSet = this.subSet;
				this.node = new Array();
				if(this.colorOn == true){
					for(var i = 0 ; i < xArr.length ; i ++){						
						if(!(xArr[i] == -1 || yArr[i] == -1) && (subSet == -1 || eval(subSet))){
							this.node[cnt] = new Kinetic.Circle({
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
							dataObj.$isSelected[i][this.dataId] = dotUpdate(this.node[cnt]);
							cnt ++;
						}else{
							dataObj.$isSelected[i][this.dataId] = nullUpdate(0);
						}
					}
				}else{
					for(var i = 0 ; i < xArr.length ; i ++){
						if(!(xArr[i] == -1 || yArr[i] == -1) && (subSet == -1 || eval(subSet))){
							this.node[cnt] = new Kinetic.Circle({
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
							dataObj.$isSelected[i][this.dataId] = dotUpdate(this.node[cnt]);
							cnt ++;
						}else{
							dataObj.$isSelected[i][this.dataId] = nullUpdate(0);
						}
					}
				}
	        	// event add
				dataObj.refreshArr[this.dataId] = makeRefresh(axisObj.stage);
				//scatterObj.refreshArr[this.id] = makeRefresh(this.stage);
				//scatterObj.updateArr[this.id] = scatterUpdate(this.node);
	        	this.firstUpdate = firstUpdate(dataObj);
	        	this.dataLayer = new Kinetic.Layer();	
	        	for(var i = 0 ; i < this.node.length ; i ++){
					this.dataLayer.add(this.node[i]);
				}
	        	axisObj.graphObjArr[this.graphId] = this;
	        	axisObj.dataLayerArr[this.graphId] = this.dataLayer;
				axisObj.hoverArr[this.graphId] = dotHover();
				axisObj.boxSearchArr[this.graphId] = dotBoxSearch(this);
				//add layer
				axisObj.stage.add(this.dataLayer);
			},
			_reDraw: function(axisObj) {
				// get pixel values from axis
				var dataObj = this.dataObj;
				var xLabel = this.xLabel;
				var yLabel = this.yLabel;
				var optionObj = this.optionObj;
				this._draw(axisObj, dataObj, xLabel, yLabel, optionObj);
			}
	}
})();
/**  Draw Dot graph(scatter) End  **/
function dotBoxSearch(graphObj)
{
	return function(smallX, smallY, bigX, bigY)
		{
			var tmpNodeArr = new Array();
			var tmpNodeArr1 = new Array();
			if(ctrlPressed == true) {
				for(var i = 0 ; i < graphObj.node.length ; i ++){
					if(smallX <= graphObj.node[i].getX() && graphObj.node[i].getX() <= bigX && smallY <= graphObj.node[i].getY() && graphObj.node[i].getY() <= bigY){
						if(graphObj.node[i].getSelected()==1){
							tmpNodeArr.push(graphObj.node[i].getName());
						}else{
							tmpNodeArr1.push(graphObj.node[i].getName());
						}					                   
	                }
				}
				allGraphUpdate(graphObj, tmpNodeArr, 0);
				allGraphUpdate(graphObj, tmpNodeArr1, 1);
			}else{
				for(var i = 0 ; i < graphObj.node.length ; i ++){
					if(smallX <= graphObj.node[i].getX() && graphObj.node[i].getX() <= bigX && smallY <= graphObj.node[i].getY() && graphObj.node[i].getY() <= bigY){
						tmpNodeArr.push(graphObj.node[i].getName());              
	                }                        
				}
				allGraphUpdate(graphObj, tmpNodeArr, 1);
			}
		};
}
/**  update function  **/
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function dotUpdate(node)
{
	return	function(selectOn)
		{
			if(node.getSelected() == 1 && selectOn == 0){		//unselect
				node.setStroke(node.getFill());
				node.setScaleX(1);
				node.setScaleY(1);
				node.setOpacity(0.5);
				node.setSelected(0);
			}else if(node.getSelected() == 0 && selectOn == 1){	//select
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
function dotHover()
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


/**  Regression functions for scatter  **/
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
/**  Regression functions for scatter end  **/




