/**  Draw Bar graph(histogram)  **/
var Bar = {};
(function() {
	Bar = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._init(axisObj, dataObj, optionObj);
		this._draw(axisObj, dataObj, xLabel, yLabel);
		dataObj.$id ++;
	};
	Bar.prototype = {
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
							this.node[cnt] = new Kinetic.Rect({
								name: cnt,
								freq: yArr[i],
								x: xArr[i],
								y: yArr[i],
								width: this.barWidth,
								height: axisObj.height + axisObj.plotYMargin - yArr[i],
								stroke: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								fill: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								selected: 0,
								selectCnt : 0,
								opacity: 0.5,
								offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
								info: "Node: " + cnt 
							});
							dataObj.$isSelected[i][this.id] = dotUpdate(this.node[cnt]);
							cnt ++;
						}else{
							dataObj.$isSelected[i][this.id] = nullUpdate(0);
						}
					}
				}else{
					for(var i = 0 ; i < xArr.length ; i ++){
						if(!(xArr[i] == -1 || yArr[i] == -1)){
							this.node[cnt] = new Kinetic.Rect({
								name: cnt,
								freq: yArr[i],
								x: xArr[i],
								y: yArr[i],
								width: this.barWidth,
								height: axisObj.height + axisObj.plotYMargin - yArr[i],
								stroke: 'green',
								fill: 'green',
								selected: 0,
								selectCnt : 0,
								opacity: 0.5,
								offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
								info: "Node: " + cnt 
							});
							dataObj.$isSelected[i][this.id] = dotUpdate(this.node[cnt]);
							cnt ++;
						}else{
							dataObj.$isSelected[i][this.id] = nullUpdate(0);
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
/**  Draw Bar graph(histogram) End  **/

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
					node.setSelected(0);
				}
			}else if(selectOn == 1){		// select
				node.setSelectCnt(node.getSelectCnt() + 1);						
				if(node.getSelected() == 0){
					node.setOpacity(1);
					node.setSelected(1);
				}
			}
		};
}
/**  update function end  **/

