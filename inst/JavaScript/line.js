/**  Draw Line graph  **/
var Line = {};
(function () {	
	Line = function (axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj) {
			this.axisObj = axisObj;
			this.dataObj = dataObj;
			this.xLabel1 = xLabel1;
			this.xLabel2 = xLabel2;
			this.yLabel1 = yLabel1;
			this.yLabel2 = yLabel2;
			this.optionObj = optionObj;
			this.dataId = dataObj.$id++;
			this.graphId = axisObj.numberOfGraph++;
			this.firstDraw = true;
			this._type = "lineGraph";
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
				dataObj.$isSelected[this.dataId] = lineUpdate();
				dataObj.refreshArr[this.dataId] = makeRefresh(axisObj.stage);
				this.firstUpdate = firstUpdate(dataObj);
	        	axisObj.hoverArr[this.graphId] = lineHover();
				axisObj.boxSearchArr[this.graphId] = lineBoxSearch(this);
			}
	};
	Line.prototype = {
			_draw: function () {
				if (this.firstDraw) {
					this._init(this.axisObj, this.dataObj, this.xLabel1, this.xLabel2, this.yLabel1, this.yLabel2, this.optionObj);
					this.firstDraw = false;
				}
				this._drawSet(this.axisObj, this.dataObj, this.xLabel1, this.xLabel2, this.yLabel1, this.yLabel2, this.optionObj);
			},
			_reDraw: function () {
				this.dataObj.refreshArr[this.dataId] = makeRefresh(this.axisObj.stage);
				this.axisObj.boxSearchArr[this.graphId] = lineBoxSearch(this);
				this._drawSet(this.axisObj, this.dataObj, this.xLabel1, this.xLabel2, this.yLabel1, this.yLabel2, this.optionObj);
			},
			_init: function (axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj) {
				// check color
				if (axisObj.legendLabel != undefined && dataObj[axisObj.legendLabel] != undefined) {
					var legendLabel = axisObj.legendLabel;					
					if (dataObj[legendLabel].isDiscrete != true && dataObj[legendLabel].colorIndex == undefined) {
						addColorField(dataObj[legendLabel]);
					} else if (dataObj[legendLabel].isDiscrete == undefined && dataObj[legendLabel].color == undefined) {
						addColorField(dataObj[legendLabel]);
					}
					this.colorOn = true;
				} else {
					this.colorOn = false;
				}
				this.colorLabel = legendLabel;
				// set the base color.
				if (optionObj.baseColor != undefined && optionObj.baseColor != 'n') {
					this.baseColor = optionObj.baseColor;
				} else {
					this.baseColor = 'black';
				}
			},
			_drawSet: function (axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj) {
				// get pixel values from axis
				var temp = axisObj._getPixelXY(dataObj[xLabel1], dataObj[yLabel1]);
				var xArr1 = temp.xArr;
				var yArr1 = temp.yArr;
				var temp = axisObj._getPixelXY(dataObj[xLabel2], dataObj[yLabel2]);
				var xArr2 = temp.xArr;
				var yArr2 = temp.yArr;
				this.node = new Array();
				if (this.colorOn == true) {
					for (var i=0; i<xArr1.length; i++) {
						if (!(xArr1[i] == -1 || yArr1[i] == -1 || xArr2[i] == -1 || yArr2[i] == -1)) {
							this.node[i] = new Kinetic.Line({
								name: i,
								x: [xArr1[i], xArr2[i]],
								y: [yArr1[i], yArr2[i]],
								points: [ 
								         xArr1[i],
								         yArr1[i],
								         xArr2[i],
								         yArr2[i]
								        ],
								stroke: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								fill: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								selected: 0,
								selectCnt: 0,
								strokeWdith: 1,
								opacity: 0.5,
								info: (dataObj[this.colorLabel].isDiscrete == undefined) ? "Node: " + i : "Node: " + i + "\nGroup: " + dataObj[this.colorLabel].index[dataObj[this.colorLabel][i]]
							});
						} else {
							this.node[i] = null;
						}
					}
				} else {
					//get group Name.
					var groupName;
					for (var name in dataObj) {
						if (!(name == 'x1' || name == 'x2' || name == 'y1' || name == 'y2' ||name == 'offloadObjArr' ||name == '$dataNumArr' || name == '$ans' || name == 'optionObj' || name == '_reCalculate' || name == 'labels' || name == 'parent' || name == 'child' || name == 'refreshTable' || name == 'labelArr' || name == '_type' || name == 'refreshArr' || name == '$id' || name == '$isSelected' || name == '$isHidden' || name == 'updateArr' || name == 'refreshArr' || name == 'mergeArr' )) {
							groupName = name;
						}
					}
					for (var i=0; i<xArr1.length; i++) {
						if (!(xArr1[i] == -1 || yArr1[i] == -1 || xArr2[i] == -1 || yArr2[i] == -1)) {
							this.node[i] = new Kinetic.Line({
								name: i,
								x: [xArr1[i], xArr2[i]],
								y: [yArr1[i], yArr2[i]],
								points: [ 
								         xArr1[i],
								         yArr1[i],
								         xArr2[i],
								         yArr2[i]
								        ],
								stroke: this.baseColor,
								fill: this.baseColor,
								selected: 0,
								selectCnt: 0,
								strokeWdith: 1,
								opacity: 0.5,
								info: (dataObj[groupName].isDiscrete == undefined) ? "Node: " + i : "Node: " + i + "\nGroup: " + dataObj[groupName].index[dataObj[groupName][i]]
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
	        	// TODO: should check the old dataLayer is removed when add function runs again.
				axisObj.stage.add(this.dataLayer);
				// event add
	        	axisObj.dataLayerArr[this.graphId] = this.dataLayer;
			}
	};
})();

function lineBoxSearch (graphObj) {
	return function (smallX, smallY, bigX, bigY) {	
			var tmpNodeArr = new Array();
			var tmpNodeArr1 = new Array();
			if (ctrlPressed == true) {
				for (var i=0; i<graphObj.node.length; i++) {
					if (((smallX <= graphObj.node[i].getX()[0] && graphObj.node[i].getX()[0] <= bigX) && (smallY <= graphObj.node[i].getY()[0] && graphObj.node[i].getY()[0] <= bigY)) || ((smallX <= graphObj.node[i].getX()[1] && graphObj.node[i].getX()[1] <= bigX) && (smallY <= graphObj.node[i].getY()[1] && graphObj.node[i].getY()[1] <= bigY))) {
						tmpNodeArr.push(graphObj.node[i].getName());					
					}
				}
				allGraphUpdate(graphObj, tmpNodeArr, null, 'ctrl');
			} else {
				for (var i=0; i<graphObj.node.length; i++) {
					if (((smallX <= graphObj.node[i].getX()[0] && graphObj.node[i].getX()[0] <= bigX) && (smallY <= graphObj.node[i].getY()[0] && graphObj.node[i].getY()[0] <= bigY)) || ((smallX <= graphObj.node[i].getX()[1] && graphObj.node[i].getX()[1] <= bigX) && (smallY <= graphObj.node[i].getY()[1] && graphObj.node[i].getY()[1] <= bigY))) {
						tmpNodeArr.push(graphObj.node[i].getName());
	                }
	           	}
				allGraphUpdate(graphObj, tmpNodeArr, 1, null);
	        }
		};
}

function lineUpdate () {
	return	function (node, selectOn) {
			if (node.getSelected() == 1 && selectOn < 0) {		//unselect
				node.setSelectCnt(node.getSelectCnt() + selectOn);
				if (node.getSelectCnt() == 0) {
					node.setStroke(node.getFill());
					node.setOpacity(0.5);
					node.setSelected(0);
				}
			} else if (selectOn > 0) {	//select
				node.setSelectCnt(node.getSelectCnt() + selectOn);
				if (node.getSelected() == 0) {
					node.setStroke('red');
					node.setOpacity(1);
					node.setSelected(1);
					node.moveToTop();
				}
			}
			node.draw();
		};
}

function lineHover () {
	return function (node, overOff) { // over: 1 , off: 0
			if (overOff == 1) {
				node.setOpacity(1);
			//	node.setStroke('red');
				node.draw();
			} else if (overOff == 0) {
				var tween = new Kinetic.Tween({
		        	node: node, 
		        	duration: 0.01,
		   //     	stroke: node.getFill(),
		  //      	fill: node.getFill(),
		   //     	strokeWdith: 1,
		        	opacity: 0.5
		        }).play(); 
			}			
		};
}
