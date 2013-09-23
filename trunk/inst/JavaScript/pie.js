/**  Draw Pie graph  **/
var Pie = {};
(function() {	
	Pie = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._init(axisObj, dataObj, xLabel, yLabel, optionObj);
		this._draw(axisObj, dataObj, xLabel, yLabel);
		axisObj.numberOfGraph ++;
		dataObj.$id ++;
	};
	Pie.prototype = {
			_init: function(axisObj, dataObj, xLabel, yLabel, optionObj) {
				this.dataObj = dataObj;
				this.xLabel = xLabel;
				this.yLabel = yLabel;
				this.dataId = dataObj.$id;
				this.graphId = axisObj.numberOfGraph;
				this.barWidth = axisObj.xbarWidth;
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
				this.node = new Array();
				var degree = 0;
				// calculate total frequency.
				var totalFreq = 0;
				for(var i = 0 ; i < dataObj[xLabel].length ; i ++){
					totalFreq = totalFreq + dataObj[yLabel][i];
				}
				if(this.colorOn == true){
					for(var i = 0 ; i < dataObj[xLabel].length ; i ++){
						this.node[i] = new Kinetic.Wedge({						
	            			name : i,
	    					freq: dataObj[yLabel][i],
	    					x: axisObj.plotXMargin + axisObj.width/2,
	    					y: axisObj.plotYMargin + axisObj.height/2,
	    					radius: 100,
	    					rotationDeg: -90 + degree,	
	    					angleDeg: dataObj[yLabel][i]/totalFreq * 360,
	    					stroke: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
	    					fill: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
	    					strokeWidth: 0.2,
	    					opacity : 0.5,
	    					selected : 0,
	    					selectCnt : 0,
	    					info: "Node: " + i + "\r\n" + getNodeinfo(dataObj, i)
	    				});
						dataObj.$isSelected[i][this.dataId] = pieUpdate(this.node[i]);
	        			degree = degree + dataObj[yLabel][i]/totalFreq * 360;
					}
				}else{
					for(var i = 0 ; i < dataObj[xLabel].length ; i ++){
						this.node[i] = new Kinetic.Wedge({						
	            			name : i,
	    					freq: dataObj[yLabel][i],
	    					x: axisObj.plotXMargin + axisObj.width/2,
	    					y: axisObj.plotYMargin + axisObj.height/2,
	    					radius: 100,
	    					rotationDeg: -90 + degree,	
	    					angleDeg: dataObj[yLabel][i]/totalFreq * 360,
	    					fill: 'green',
	    					stroke: 'green',
	    					strokeWidth: 0.2,
	    					opacity : 0.5,
	    					selected : 0,
	    					selectCnt : 0,
	    					info: "Node: " + i + "\r\n" + getNodeinfo(dataObj, i)
	    				});
						dataObj.$isSelected[i][this.dataId] = pieUpdate(this.node[i]);
	        			degree = degree + dataObj[yLabel][i]/totalFreq * 360;
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
				axisObj.hoverArr[this.graphId] = pieHover();
				axisObj.boxSearchArr[this.graphId] = pieBoxSearch(this);
				//add layer
				axisObj.stage.add(this.dataLayer);
			},
			_reDraw: function(axisObj){
				var dataObj = this.dataObj;
				var xLabel = this.xLabel;
				var yLabel = this.yLabel;
				if(this.colorOn == true){
					addColorField(dataObj[this.colorLabel]);
				}
				this._draw(axisObj, dataObj, xLabel, yLabel);
			}
	};
})();

function pieBoxSearch(graphObj)
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
function pieUpdate(node)
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
function pieHover()
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