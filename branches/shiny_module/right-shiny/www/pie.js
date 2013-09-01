/**  Draw Pie graph  **/
var Pie = {};
(function() {	
	Pie = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._init(axisObj, dataObj, optionObj);
		this._checkStacking(axisObj, dataObj, xLabel, yLabel);
		this._draw(axisObj, dataObj, xLabel, yLabel);
		dataObj.$id ++;
	};
	Pie.prototype = {
			_init: function(axisObj, dataObj, optionObj) {
				this.id = dataObj.$id;
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
						if(yLabel == 'freqeuncy'){
							axisObj._setYContinuous(max, 0);
						}else{
							axisObj._setYContinuous(max, min);
						}
						axisObj._draw();
					}
					delete temp;
					//this.xFreq = temp;
					//alert(this.xFreq[0.6]);
				}
			},
			_draw: function(axisObj, dataObj, xLabel, yLabel) {
				this.node = new Array();
				var cnt = 0;
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
	    					fill: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
	    					stroke: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
	    					strokeWidth: 0.2,
	    					opacity : 0.5,
	    					selected : 0,
	    					selectCnt : 0,
	    					info : "Node : " + i
	    				});
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
	    					info : "Node : " + i
	    				});
	        			degree = degree + dataObj[yLabel][i]/totalFreq * 360;
					}
				}
				this.dataLayer = new Kinetic.Layer();	
	        	for(var i = 0 ; i < this.node.length ; i ++){
					this.dataLayer.add(this.node[i]);
				}
				axisObj.dataLayerArr.push(this.dataLayer);
				axisObj.hoverArr.push(pieHover());
				//add layer
				axisObj.stage.add(this.dataLayer);
			}
	};
})();
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
/**  update function  **/
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function pieUpdate(node)
{
	return	function(ids, selectOn)
				{
					if(ids.length == undefined){
						if(node[ids].getSelected() == 1 && selectOn == 0){		//unselect
							node[ids].setSelectCnt(obj.node[ids].getSelectCnt() - 1);
							if(node[ids].getSelectCnt() == 0){
								node[ids].setOpacity(0.5);
								node[ids].setSelected(0);
							}
						}else if(selectOn == 1){		// select
							if(node[ids].getSelected() == 0){
								node[ids].setOpacity(1);
								node[ids].setSelected(1);
							}
							node[ids].setSelectCnt(node[ids].getSelectCnt() + 1);
						}
					}else{
						for(var i = 0 ; i < ids.length ; i ++){
							if(node[ids[i]].getSelected() == 1 && selectOn == 0){		//unselect
								node[ids[i]].setSelectCnt(obj.node[ids[i]].getSelectCnt() - 1);
								if(node[ids[i]].getSelectCnt() == 0){
									node[ids[i]].setOpacity(0.5);
									node[ids[i]].setSelected(0);
								}
							}else if(selectOn == 1){		// select
								if(node[ids[i]].getSelected() == 0){
									node[ids[i]].setOpacity(1);
									node[ids[i]].setSelected(1);
								}
								node[ids[i]].setSelectCnt(node[ids[i]].getSelectCnt() + 1);
							}
						}
					}
					
				};
}
/**  update function end  **/