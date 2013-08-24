/**  Draw Bar graph(histogram)  **/
var Bar = {};
(function() {
	Bar = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._init(axisObj, dataObj, optionObj);
		this._draw(axisObj, dataObj, xLabel, yLabel);
	};
	Bar.prototype = {
			_init: function(axisObj, dataObj, optionObj) {
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
							cnt ++;
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
/**  Draw Bar graph(histogram) End  **/

/**  update function  **/
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function histUpdate(node)
{
	return	function(ids, selectOn)
		{
			// if just one node.
			if(ids.length == undefined){
				if(node[ids].getSelected() == 1 && selectOn == 0){		//unselect
					node[ids].setSelectCnt(node[ids].getSelectCnt() - 1);
					if(node[ids].getSelectCnt() == 0){
						node[ids].setOpacity(0.5);
						node[ids].setSelected(0);
					}
				}else if(selectOn == 1){		// select
					node[ids].setSelectCnt(node[ids].getSelectCnt() + 1);						
					if(node[ids].getSelected() == 0){
						node[ids].setOpacity(1);
						node[ids].setSelected(1);
					}
				}
			}else{
				for(var i = 0 ; i < ids.length ; i ++){
					if(node[ids[i]].getSelected() == 1 && selectOn == 0){		//unselect
						node[ids[i]].setSelectCnt(node[ids[i]].getSelectCnt() - 1);
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
			//	alert(node[2].getSelectCnt());
			}
		};
}
/**  update function end  **/

