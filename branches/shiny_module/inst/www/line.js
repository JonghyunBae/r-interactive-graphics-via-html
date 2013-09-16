var MakeLineObj = {};
(function() {
	MakeLineObj = function(dataObj) {
		var temp = getFields(dataObj);
		
		// copy data field.
		for(var i = 0 ; i < temp.length ; i ++){
			this[temp[i]] = dataObj[temp[i]];
		}
		this.labelArr = dataObj.labelArr;
		
		// make event handle part.
		this.$isSelected = make2DArr(dataObj.$isSelected.length - 1);
		var p2cArr = new Array(this.$isSelected.length + 1);
		var c2pArr = new Array(this.$isSelected.length);
		for(var i = 0 ; i < this.$isSelected.length ; i ++){
			this.$isSelected[i][0] = 0;
			p2cArr[i] = [i-1, i];
			c2pArr[i] = [i, i+1];
		}
		p2cArr[0] = 0;
		p2cArr[i] = i-1;		
		this.$id = 1;
		this._type = 'lineObj';
		birthReport(dataObj, this, p2cArr, c2pArr);		
	}
})();
/**  draw line graph  **/
// not event handle yet.
var Line = {};
(function() {	
	Line = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._init(axisObj, dataObj, optionObj);
		this._draw(axisObj, dataObj, xLabel, yLabel);
		axisObj.numberOfGraph ++;
		dataObj.$id ++;
	};
	Line.prototype = {
			_init: function(axisObj, dataObj, optionObj) {
				this.dataId = dataObj.$id;
				this.graphId = axisObj.numberOfGraph;
				// set the base color.
				if(optionObj.baseColor != undefined){
					this.baseColor = optionObj.baseColor;
				}else{
					this.baseColor = 'black';
				}
			},
			_draw: function(axisObj, dataObj, xLabel, yLabel) {
				// get pixel values from axis
				var temp = axisObj._getPixel(dataObj[xLabel], dataObj[yLabel]);
				var xArr = temp.xArr;
				var yArr = temp.yArr;
				var cnt = 0;
				this.node = new Array();
				for(var i = 0 ; i < xArr.length - 1 ; i ++){
					if(!(xArr[i] == -1 || yArr[i] == -1 || xArr[i+1] == -1 || yArr[i+1] == -1)){
						this.node[cnt] = new Kinetic.Line({
							name: i,
							x: [xArr[i], xArr[i+1]],
							y: [yArr[i], yArr[i+1]],
							points: [ 
							         xArr[i],
							         yArr[i],
							         xArr[i+1],
							         yArr[i+1]
							        ],
							stroke: this.baseColor,
							fill: this.baseColor,
							selected: 0,
							selectCnt: 0,
							strokeWdith: 1,
							opacity: 0.5,
							info: "Node: " + i
						});
						dataObj.$isSelected[i][this.dataId] = lineUpdate(this.node[cnt]);
						cnt ++;
					}else{
						dataObj.$isSelected[i][this.dataId] = nullUpdate(0);
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
				axisObj.hoverArr[this.graphId] = lineHover();
				axisObj.boxSearchArr[this.graphId] = lineBoxSearch(this);
				//add layer
				axisObj.stage.add(this.dataLayer);
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
function lineUpdate(node)
{
	return	function(selectOn)
		{
			if(node.getSelected() == 1 && selectOn == 0){		//unselect
				node.setSelectCnt(node.getSelectCnt() - 1);
				if(node.getSelectCnt() == 0){
					node.setStroke(node.getFill());
					node.setOpacity(0.5);
					node.setSelected(0);
				}
			}else if(selectOn == 1){	//select
				node.setSelectCnt(node.getSelectCnt() + 1);
				if(node.getSelected() == 0){
					node.setStroke('red');
					node.setOpacity(1);
					node.setSelected(1);
					node.moveToTop();
				}
			}
		};
}
function lineHover()
{
	return function(node, overOff) // over: 1 , off: 0
		{
			if(overOff == 1){
				node.setOpacity(1);
			//	node.setStroke('red');
				node.draw();
			}else if(overOff == 0){
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