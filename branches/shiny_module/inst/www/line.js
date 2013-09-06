/**  draw line graph  **/
// not event handle yet.
var Line = {};
(function() {	
	Line = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._draw(axisObj, dataObj, xLabel, yLabel);
	};
	Line.prototype = {
			_draw: function(axisObj, dataObj, xLabel, yLabel) {
				// get pixel values from axis
				var temp = axisObj._getPixel(dataObj[xLabel], dataObj[yLabel]);
				var xArr = temp.xArr;
				var yArr = temp.yArr;
				var cnt = 0;
				this.node = new Array();
				for(var i = 0 ; i < xArr.length ; i ++){
					if(!(xArr[i] == -1 || yArr[i] == -1)){
						this.node[cnt] = new Kinetic.Line({
							name: cnt,
							points: [ 
							         xArr[i],
							         yArr[i],
							         xArr[i+1],
							         yArr[i+1]							        
							        ],
							stroke: 'black',
							strokeWdith: 1,
							opacity: 0.5,
							info: "Node: " + cnt 
						});
						//dataObj.$isSelected[i][this.id] = dotUpdate(this.node[cnt]);
						cnt ++;
					}else{
						//dataObj.$isSelected[i][this.id] = nullUpdate(0);
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
				//axisObj.hoverArr.push(dotHover());
				//add layer
				axisObj.stage.add(this.dataLayer);
			}
	};
})();
function lineHover()
{
	return function(node, overOff) // over: 1 , off: 0
		{
			if(overOff == 1){
				node.setOpacity(1);
				node.setStroke('red');
				node.draw();
			}else if(overOff == 0){
				var tween = new Kinetic.Tween({
		        	node: node, 
		        	duration: 0.01,
		        	stroke: 'black',
		        	opacity: 0.5
		        }).play();
			}			
		};
}