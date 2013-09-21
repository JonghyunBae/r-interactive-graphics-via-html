/**  Draw Bar graph(histogram)  **/
var Bar = {};
(function() {
	Bar = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._init(axisObj, dataObj, xLabel, yLabel, optionObj);
		this._checkStacking(axisObj, dataObj, xLabel, yLabel);
		this._draw(axisObj, dataObj, xLabel, yLabel);
		axisObj.numberOfGraph ++;
		dataObj.$id ++;
	};
	Bar.prototype = {
			_init: function(axisObj, dataObj, xLabel, yLabel, optionObj) {
				this.dataId = dataObj.$id;
				this.graphId = axisObj.numberOfGraph;
				this.barWidth = axisObj.xbarWidth;
				this.xLabel = xLabel;
				this.yLabel = yLabel;
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
			
			_checkStacking: function(axisObj, dataObj, xLabel, yLabel) {
				if(dataObj[yLabel].isDiscrete == undefined){
					var temp = new Object();
					var max = dataObj[yLabel][0];
					var min = dataObj[yLabel][0];
					for(var i = 0 ; i < dataObj[xLabel].length ; i ++){
						// frequency max count, stacking on...
						if(temp[dataObj[xLabel][i]] == undefined){
							temp[dataObj[xLabel][i]] = dataObj[yLabel][i];
						}else{
							temp[dataObj[xLabel][i]] = temp[dataObj[xLabel][i]] + dataObj[yLabel][i];
							if(temp[dataObj[xLabel][i]] > max){
								max = temp[dataObj[xLabel][i]];
							}else if(temp[dataObj[xLabel][i]] < min){
								min = temp[dataObj[xLabel][i]];
							}
							this.stacking = true;
						}
					}
					if(this.stacking == true){
						if(yLabel == 'frequency'){
							axisObj._setYContinuous(max, 0);
						}else{
							axisObj._setYContinuous(max, min);
						}
						axisObj._draw();
					}
					delete temp;
				}
			},
			
			_draw: function(axisObj, dataObj, xLabel, yLabel) {
				// get pixel values from axis
				var temp = axisObj._getPixelXY(dataObj[xLabel], dataObj[yLabel]);
				var xArr = temp.xArr;
				var yArr = temp.yArr;
				if(this.stacking == true){
					var cnt = 0;
					this.node = new Array();
					var tempHeight = new Object();
					if(this.colorOn == true){
						var x = 0;
						var y = 0;
						for(var i = 0 ; i < xArr.length ; i ++){
							if(!(xArr[i] == -1 || yArr[i] == -1)){
								if(tempHeight[xArr[i]] == undefined){
									tempHeight[xArr[i]] = axisObj.height + axisObj.plotYMargin - yArr[i];
									y = yArr[i];
								}else{
									y = yArr[i] - tempHeight[xArr[i]];
									tempHeight[xArr[i]] = axisObj.height + axisObj.plotYMargin - y;
								}
								if(axisObj.isXDiscrete){
									xArr[i] = xArr[i] - this.barWidth/2;
								}
								this.node[cnt] = new Kinetic.Rect({
									name: i,
									x: xArr[i],
									y: y,
									width: this.barWidth,
									height: axisObj.height + axisObj.plotYMargin - yArr[i],
									stroke: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
									fill: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
									selected: 0,
									selectCnt : 0,
									opacity: 0.5,
								//	offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
									info: "Node: " + i + "\r\n" + getNodeinfo(dataObj, i)
								});
								dataObj.$isSelected[i][this.dataId] = barUpdate(this.node[cnt]);
								cnt ++;
							}else{
								dataObj.$isSelected[i][this.dataId] = nullUpdate(0);
							}
						}
					}else{
						for(var i = 0 ; i < xArr.length ; i ++){
							if(!(xArr[i] == -1 || yArr[i] == -1)){
								if(axisObj.isXDiscrete){
									xArr[i] = xArr[i] - this.barWidth/2;
								}
								this.node[cnt] = new Kinetic.Rect({
									name: i,
									x: xArr[i],
									y: yArr[i],
									width: this.barWidth,
									height: axisObj.height + axisObj.plotYMargin - yArr[i],
									stroke: 'green',
									fill: 'green',
									selected: 0,
									selectCnt : 0,
									opacity: 0.5,
								//	offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
									info: "Node: " + i + "\r\n" + getNodeinfo(dataObj, i)
								});
								dataObj.$isSelected[i][this.dataId] = barUpdate(this.node[cnt]);
								cnt ++;
							}else{
								dataObj.$isSelected[i][this.dataId] = nullUpdate(0);
							}
						}
					}					
				}else{
					var cnt = 0;
					this.node = new Array();
					if(this.colorOn == true){
						for(var i = 0 ; i < xArr.length ; i ++){
							if(!(xArr[i] == -1 || yArr[i] == -1)){
								if(axisObj.isXDiscrete){
									xArr[i] = xArr[i] - this.barWidth/2;
								}
								this.node[cnt] = new Kinetic.Rect({
									name: i,
									x: xArr[i],
									y: yArr[i],
									width: this.barWidth,
									height: axisObj.height + axisObj.plotYMargin - yArr[i],
									stroke: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
									fill: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
									selected: 0,
									selectCnt : 0,
									opacity: 0.5,
									//offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
									info: "Node: " + i + "\r\n" + getNodeinfo(dataObj, i)
								});
								dataObj.$isSelected[i][this.dataId] = barUpdate(this.node[cnt]);
								cnt ++;
							}else{
								dataObj.$isSelected[i][this.dataId] = nullUpdate(0);
							}
						}
					}else{
						for(var i = 0 ; i < xArr.length ; i ++){
							if(!(xArr[i] == -1 || yArr[i] == -1)){
								if(axisObj.isXDiscrete){
									xArr[i] = xArr[i] - this.barWidth/2;
								}
								this.node[cnt] = new Kinetic.Rect({
									name: i,
									x: xArr[i],
									y: yArr[i],
									width: this.barWidth,
									height: axisObj.height + axisObj.plotYMargin - yArr[i],
									stroke: 'green',
									fill: 'green',
									selected: 0,
									selectCnt : 0,
									opacity: 0.5,
								//	offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
									info: "Node: " + i + "\r\n" + getNodeinfo(dataObj, i)
								});
								dataObj.$isSelected[i][this.dataId] = barUpdate(this.node[cnt]);
								cnt ++;
							}else{
								dataObj.$isSelected[i][this.dataId] = nullUpdate(0);
							}
						}
					}
				}				
	        	// event add
				dataObj.refreshArr[this.dataId] = makeRefresh(axisObj.stage);
				this.firstUpdate = firstUpdate(dataObj);
				this.dataObj = dataObj;
	        	this.dataLayer = new Kinetic.Layer();	
	        	for(var i = 0 ; i < this.node.length ; i ++){
					this.dataLayer.add(this.node[i]);
				}
	        	axisObj.graphObjArr[this.graphId] = this;
	        	axisObj.dataLayerArr[this.graphId] = this.dataLayer;
				axisObj.hoverArr[this.graphId] = barHover();
				axisObj.boxSearchArr[this.graphId] = barBoxSearch(this);
				//add layer
				axisObj.stage.add(this.dataLayer);
			},
			_reDraw: function(axisObj) {
				var dataObj = this.dataObj;
				var xLabel = this.xLabel;
				var yLabel = this.yLabel;
				if(this.colorOn == true){
					addColorField(dataObj[this.colorLabel]);
				}
				this.barWidth = axisObj.xbarWidth;
				this._checkStacking(axisObj, dataObj, xLabel, yLabel);
				this._draw(axisObj, dataObj, xLabel, yLabel);
			}
	};
})();
/**  Draw Bar graph(histogram) End  **/

function barBoxSearch(graphObj)
{
	return function(smallX, smallY, bigX, bigY)
		{	
			var tmpNodeArr = new Array();
			var tmpNodeArr1 = new Array();
			if(ctrlPressed == true) {
				for(var i = 0 ; i < graphObj.node.length ; i ++){
					if((smallX <= graphObj.node[i].getX() + graphObj.node[i].getWidth() && graphObj.node[i].getX() <= bigX) && (smallY <= graphObj.node[i].getY() + graphObj.node[i].getHeight() && graphObj.node[i].getY() <= bigY)){
						if(graphObj.node[i].getSelected() == 1){
							tmpNodeArr.push(graphObj.node[i].getName());
						}else{
							tmpNodeArr1.push(graphObj.node[i].getName());
						}        
					}
				}
			//	alert("ddd");
				if(tmpNodeArr.length != undefined){
					allGraphUpdate(graphObj, tmpNodeArr, 0);
				}
				if(tmpNodeArr1.length != undefined){
					allGraphUpdate(graphObj, tmpNodeArr1, 1);
				}				
			}else{
				for(var i = 0 ; i < graphObj.node.length ; i ++){
					if((smallX <= graphObj.node[i].getX() + graphObj.node[i].getWidth() && graphObj.node[i].getX() <= bigX) && (smallY <= graphObj.node[i].getY() + graphObj.node[i].getHeight() && graphObj.node[i].getY() <= bigY)){
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
function barUpdate(node)
{
	return	function(selectOn)
		{
			if(node.getSelected() == 1 && selectOn == 0){		//unselect
				node.setSelectCnt(node.getSelectCnt() - 1);	
				if(node.getSelectCnt() == 0){
					node.setOpacity(0.5);
					node.setStroke(node.getFill());
					node.setSelected(0);
				}
			}else if(selectOn == 1){		// select
				node.setSelectCnt(node.getSelectCnt() + 1);
				if(node.getSelected() == 0){
					node.setStroke('black');
					node.setOpacity(1);
					node.setSelected(1);
				}
			}
		};
}
/**  update function end  **/
function barHover()
{
	return function(node, overOff) // over: 1 , off: 0
		{
			if(overOff == 1){
				node.setOpacity(1);
                node.draw();
			}else if(overOff == 0){
				var tween = new Kinetic.Tween({
        			node: node, 
			        duration: 0.01,
			        opacity: 0.5
        		}).play(); 
			}
		};
}
