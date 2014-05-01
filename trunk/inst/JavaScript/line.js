var MakeLineObj = {};
(function() {
	MakeLineObj = function(dataObj, xLabel, yLabel, optionObj) {

		this.xLabel = xLabel;
		this.yLabel = yLabel;
		this.dataObj = dataObj;
		if (optionObj.group != undefined) {
			gLabel = optionObj.group;
		} else {
			gLabel = 'NULL';			
		}
		this.gLabel = gLabel;
		if (gLabel != 'NULL' && dataObj[gLabel].isDiscrete != undefined) {
			this.groupOn = true;
			this.labelArr = ['x1', 'y1', 'x2', 'y2', gLabel];
		} else {
			this.groupOn = false;
			this.labelArr = ['x1', 'y1', 'x2', 'y2'];
		}

		if (this.groupOn == true) { // draw line with group
			this.x1 = new Array();
			this.x2 = new Array();
			this.y1 = new Array();
			this.y2 = new Array();
			this[gLabel] = new Array();
			var p2cArr = new Array(dataObj[xLabel].length);
			var c2pArr = new Array();
			var lineCnt = -1;
			var newGroup = 1;
			for (var i=0; i<dataObj[gLabel].index.length; i++) { // for one sub group
				var groupTemp = new Array();
				for (var j=0; j<dataObj[gLabel].length; j++) { // search all data
					if (i == dataObj[gLabel][j]) { // save groupTemp
						groupTemp.push(j);
					}
				}
				if (groupTemp.length > 1) {
					if (groupTemp.length > 2) {
						for (var j=0; j<groupTemp.length-1; j++) {
							this.x1.push(dataObj[xLabel][groupTemp[j]]);
							this.x2.push(dataObj[xLabel][groupTemp[j+1]]);
							this.y1.push(dataObj[yLabel][groupTemp[j]]);
							this.y2.push(dataObj[yLabel][groupTemp[j+1]]);
							this[gLabel].push(i);
							if (lineCnt == -1) {
								lineCnt ++;
							}						
							if (newGroup == 1) {
								newGroup = 0;
								p2cArr[groupTemp[j]] = lineCnt;
							} else {
								p2cArr[groupTemp[j]] = [lineCnt, lineCnt+1];
								lineCnt ++;
							}						
							c2pArr[lineCnt] = [groupTemp[j], groupTemp[j+1]];
						}
						newGroup = 1;
						p2cArr[groupTemp[j]] = lineCnt;
						lineCnt ++;
					} else { // groupTemp.length == 2
						this.x1.push(dataObj[xLabel][groupTemp[0]]);
						this.x2.push(dataObj[xLabel][groupTemp[1]]);
						this.y1.push(dataObj[yLabel][groupTemp[0]]);
						this.y2.push(dataObj[yLabel][groupTemp[1]]);
						this[gLabel].push(i);
						if (lineCnt == -1) {
							lineCnt ++;
						}
						p2cArr[groupTemp[0]] = lineCnt;
						p2cArr[groupTemp[1]] = lineCnt;
						c2pArr[lineCnt] = [groupTemp[0], groupTemp[1]];
						lineCnt ++;
					}
				} else {
					p2cArr[groupTemp] = -1; // disconnected dot
				}
			}
			this[gLabel].isDiscrete = true;
			this[gLabel].colorIndex = dataObj[gLabel].colorIndex;
			this[gLabel].index = dataObj[gLabel].index;		
		} else {
			this.x1 = new Array(dataObj[xLabel].length - 1);
			this.x2 = new Array(dataObj[xLabel].length - 1);
			this.y1 = new Array(dataObj[xLabel].length - 1);
			this.y2 = new Array(dataObj[xLabel].length - 1);
			this[gLabel] = new Array();
			for (var i=0; i<this.x1.length; i++) {
				this.x1[i] = dataObj[xLabel][i];
				this.x2[i] = dataObj[xLabel][i+1];
				this.y1[i] = dataObj[yLabel][i];
				this.y2[i] = dataObj[yLabel][i+1];
				this[gLabel].push(i);
			}
			
			var p2cArr = new Array(dataObj[xLabel].length);
			var c2pArr = new Array(dataObj[xLabel].length - 1);
			for (var i=0; i<c2pArr.length; i++) {
				p2cArr[i] = [i-1, i];
				c2pArr[i] = [i, i+1];
			}
			p2cArr[0] = 0;
			p2cArr[i] = i-1;
		}
		this._type = 'lineObj';
		// make event handle part.
		makeEventComponent(this, c2pArr.length);
		var mergeArr = mergeParentChildArr(p2cArr, c2pArr);
		birthReport(dataObj, this, mergeArr);
	};
	MakeLineObj.prototype = {
		_reCalculate: function() {
			var xLabel = this.xLabel;
			var yLabel = this.yLabel;
			var gLabel = this.gLabel;
			var dataObj = this.dataObj;
			
			if(gLabel != 'NULL' && dataObj[gLabel].isDiscrete != undefined){
				this.groupOn = true;
				this.labelArr = ['x1', 'y1', 'x2', 'y2', gLabel];
			}else{
				this.groupOn = false;
				this.labelArr = ['x1', 'y1', 'x2', 'y2'];
			}

			if (gLabel != 'NULL' && dataObj[gLabel].isDiscrete != undefined) {
				this.groupOn = true;
				this.labelArr = ['x1', 'y1', 'x2', 'y2', gLabel];
			} else {
				this.groupOn = false;
				this.labelArr = ['x1', 'y1', 'x2', 'y2'];
			}

			if (this.groupOn == true) { // draw line with group
				this.x1 = new Array();
				this.x2 = new Array();
				this.y1 = new Array();
				this.y2 = new Array();
				this[gLabel] = new Array();
				var p2cArr = new Array(dataObj[xLabel].length);
				var c2pArr = new Array();
				var lineCnt = -1;
				var newGroup = 1;
				for (var i=0; i<dataObj[gLabel].index.length; i++) { // for one sub group
					var groupTemp = new Array();
					for (var j=0; j<dataObj[gLabel].length; j++) { // search all data
						if (i == dataObj[gLabel][j]) { // save groupTemp
							groupTemp.push(j);
						}
					}
					if (groupTemp.length > 1) {
						if (groupTemp.length > 2) {
							for (var j=0; j<groupTemp.length-1; j++) {
								this.x1.push(dataObj[xLabel][groupTemp[j]]);
								this.x2.push(dataObj[xLabel][groupTemp[j+1]]);
								this.y1.push(dataObj[yLabel][groupTemp[j]]);
								this.y2.push(dataObj[yLabel][groupTemp[j+1]]);
								this[gLabel].push(i);
								if (lineCnt == -1) {
									lineCnt ++;
								}						
								if (newGroup == 1) {
									newGroup = 0;
									p2cArr[groupTemp[j]] = lineCnt;
								} else {
									p2cArr[groupTemp[j]] = [lineCnt, lineCnt+1];
									lineCnt ++;
								}						
								c2pArr[lineCnt] = [groupTemp[j], groupTemp[j+1]];
							}
							newGroup = 1;
							p2cArr[groupTemp[j]] = lineCnt;
							lineCnt ++;
						} else { // groupTemp.length == 2
							this.x1.push(dataObj[xLabel][groupTemp[0]]);
							this.x2.push(dataObj[xLabel][groupTemp[1]]);
							this.y1.push(dataObj[yLabel][groupTemp[0]]);
							this.y2.push(dataObj[yLabel][groupTemp[1]]);
							this[gLabel].push(i);
							if (lineCnt == -1) {
								lineCnt ++;
							}
							p2cArr[groupTemp[0]] = lineCnt;
							p2cArr[groupTemp[1]] = lineCnt;
							c2pArr[lineCnt] = [groupTemp[0], groupTemp[1]];
							lineCnt ++;
						}
					} else {
						p2cArr[groupTemp] = -1; // disconnected dot
					}
				}
				this[gLabel].isDiscrete = true;
				this[gLabel].colorIndex = dataObj[gLabel].colorIndex;
				this[gLabel].index = dataObj[gLabel].index;		
			} else {
				this.x1 = new Array(dataObj[xLabel].length - 1);
				this.x2 = new Array(dataObj[xLabel].length - 1);
				this.y1 = new Array(dataObj[xLabel].length - 1);
				this.y2 = new Array(dataObj[xLabel].length - 1);
				this[gLabel] = new Array();
				for (var i=0; i<this.x1.length; i++) {
					this.x1[i] = dataObj[xLabel][i];
					this.x2[i] = dataObj[xLabel][i+1];
					this.y1[i] = dataObj[yLabel][i];
					this.y2[i] = dataObj[yLabel][i+1];
					this[gLabel].push(i);
				}
				
				var p2cArr = new Array(dataObj[xLabel].length);
				var c2pArr = new Array(dataObj[xLabel].length - 1);
				for (var i=0; i<c2pArr.length; i++) {
					p2cArr[i] = [i-1, i];
					c2pArr[i] = [i, i+1];
				}
				p2cArr[0] = 0;
				p2cArr[i] = i-1;
			}
			// make event handle part.
			makeEventComponent(this, c2pArr.length);
			var mergeArr = mergeParentChildArr(p2cArr, c2pArr);
			ModifyBirth(this, mergeArr);
		}
	};
})();

/**  draw line graph  **/
// not event handle yet.
var Line = {};
(function() {	
	Line = function(axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj) {
		this._init(axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj);
		this._draw(axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj);
		axisObj.numberOfGraph ++;
		dataObj.$id ++;
	};
	Line.prototype = {
			_init: function(axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj) {
				this.dataObj = dataObj;
				this.xLabel1 = xLabel1;
				this.xLabel2 = xLabel2;
				this.yLabel1 = yLabel1;
				this.yLabel2 = yLabel2;
				this.optionObj = optionObj;
				this.dataId = dataObj.$id;
				this.graphId = axisObj.numberOfGraph;
				
				// check color
				if(axisObj.legendLabel != undefined && dataObj[axisObj.legendLabel] != undefined){
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
					this.baseColor = 'black';
				}
			},
			_draw: function (axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj) {
				// get pixel values from axis
				var temp = axisObj._getPixelXY(dataObj[xLabel1], dataObj[yLabel1]);
				var xArr1 = temp.xArr;
				var yArr1 = temp.yArr;
				var temp = axisObj._getPixelXY(dataObj[xLabel2], dataObj[yLabel2]);
				var xArr2 = temp.xArr;
				var yArr2 = temp.yArr;
				this.node = new Array();
				if(this.colorOn == true){
					for(var i = 0 ; i < xArr1.length; i ++){
						if(!(xArr1[i] == -1 || yArr1[i] == -1 || xArr2[i] == -1 || yArr2[i] == -1)){
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
						}else{
							this.node[i] = null;
						}
					}
				}else{
					//get group Name.
					var groupName;
					for (var name in dataObj) {
						if (!(name == 'x1' || name == 'x2' || name == 'y1' || name == 'y2' ||name == 'offloadObjArr' ||name == '$dataNumArr' || name == '$ans' || name == 'optionObj' || name == '_reCalculate' || name == 'labels' || name == 'parent' || name == 'child' || name == 'refreshTable' || name == 'labelArr' || name == '_type' || name == 'refreshArr' || name == '$id' || name == '$isSelected' || name == '$isHidden' || name == 'updateArr' || name == 'refreshArr' || name == 'mergeArr' )) {
							groupName = name;
						}
					}
					for(var i = 0 ; i < xArr1.length; i ++){
						if(!(xArr1[i] == -1 || yArr1[i] == -1 || xArr2[i] == -1 || yArr2[i] == -1)){
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
						}else{
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
				dataObj.graphObjArr[this.dataId] = this;
				dataObj.$isSelected[this.dataId] = lineUpdate();
				dataObj.refreshArr[this.dataId] = makeRefresh(axisObj.stage);
				this.firstUpdate = firstUpdate(dataObj);
	        	axisObj.graphObjArr[this.graphId] = this;
	        	axisObj.dataLayerArr[this.graphId] = this.dataLayer;
				axisObj.hoverArr[this.graphId] = lineHover();
				axisObj.boxSearchArr[this.graphId] = lineBoxSearch(this);
			},
			_reDraw: function (axisObj) {
				var dataObj = this.dataObj;
				var xLabel1 = this.xLabel1;
				var xLabel2 = this.xLabel2;
				var yLabel1 = this.yLabel1;
				var yLabel2 = this.yLabel2;
				var optionObj = this.optionObj;
				this._draw(axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj);
			}
	};
})();
function lineBoxSearch(graphObj)
{
	return function(smallX, smallY, bigX, bigY)
		{	
			var tmpNodeArr = new Array();
			var tmpNodeArr1 = new Array();
			if(ctrlPressed == true) {
				for(var i = 0 ; i < graphObj.node.length ; i ++){
					if(((smallX <= graphObj.node[i].getX()[0] && graphObj.node[i].getX()[0] <= bigX) && (smallY <= graphObj.node[i].getY()[0] && graphObj.node[i].getY()[0] <= bigY)) || ((smallX <= graphObj.node[i].getX()[1] && graphObj.node[i].getX()[1] <= bigX) && (smallY <= graphObj.node[i].getY()[1] && graphObj.node[i].getY()[1] <= bigY))){
						if(graphObj.node[i].getSelected() == 1){
							tmpNodeArr.push(graphObj.node[i].getName());
						}else{
							tmpNodeArr1.push(graphObj.node[i].getName());
						}        
					}
				}
				if(tmpNodeArr.length != undefined){
					allGraphUpdate(graphObj, tmpNodeArr, 0);
				}
				if(tmpNodeArr1.length != undefined){
					allGraphUpdate(graphObj, tmpNodeArr1, 1);
				}				
			}else{
				for(var i = 0 ; i < graphObj.node.length ; i ++){
					if(((smallX <= graphObj.node[i].getX()[0] && graphObj.node[i].getX()[0] <= bigX) && (smallY <= graphObj.node[i].getY()[0] && graphObj.node[i].getY()[0] <= bigY)) || ((smallX <= graphObj.node[i].getX()[1] && graphObj.node[i].getX()[1] <= bigX) && (smallY <= graphObj.node[i].getY()[1] && graphObj.node[i].getY()[1] <= bigY))){
						tmpNodeArr.push(graphObj.node[i].getName());
	                }
	           	}
				allGraphUpdate(graphObj, tmpNodeArr, 1);
	        }
			
		};
}
function lineUpdate () {
	return	function (node, selectOn) {
			if (node.getSelected() == 1 && selectOn < 0) {		//unselect
				node.setSelectCnt(node.getSelectCnt() - 1);
				if (node.getSelectCnt() == 0) {
					node.setStroke(node.getFill());
					node.setOpacity(0.5);
					node.setSelected(0);
				}
			} else if (selectOn > 0) {	//select
				node.setSelectCnt(node.getSelectCnt() + 1);
				if (node.getSelectCnt() > 2) {
					node.setSelectCnt(2);
				}
				if (node.getSelected() == 0) {
					node.setStroke('red');
					node.setOpacity(1);
					node.setSelected(1);
					node.moveToTop();
				}
			}
		};
}
function lineHover() {
	return function(node, overOff) { // over: 1 , off: 0
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