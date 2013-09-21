var MakeLineObj_off = {};
(function() {
	MakeLineObj_off = function(dataObj, xLabel, yLabel) {
		if(dataObj.$readyState == false){
			this.xLabel = xLabel;			
			this.yLabel = yLabel;
			this.graphObjArr = new Array();
			dataObj.$isSelected.push(this._calculateLine(this));
		}
	};
	MakeLineObj_off.prototype = {
			_calculateLine: function(object){
				return function(dataObj) {
					var xLabel = object.xLabel;
					var yLabel = object.yLabel;
					object[xLabel] = dataObj[xLabel];
					object[yLabel] = dataObj[yLabel];
					object.x1 = new Array(dataObj[xLabel].length - 1);
					object.x2 = new Array(dataObj[xLabel].length - 1);
					object.y1 = new Array(dataObj[yLabel].length - 1);
					object.y2 = new Array(dataObj[yLabel].length - 1);
					for(var i = 0 ; i < object.x1.length ; i ++){
						object.x1[i] = dataObj[xLabel][i];
						object.x2[i] = dataObj[xLabel][i+1];
						object.y1[i] = dataObj[yLabel][i];
						object.y2[i] = dataObj[yLabel][i+1];
					}
					// draw graph.
					for(var i = 0 ; i < object.graphObjArr.length ; i ++){
						object.graphObjArr[i]();
					}
				};
			}
	};
})();
/*
function calculateLine(object)
{
	return function(dataObj) {
		var xLabel = object.xLabel;
		var yLabel = object.yLabel;
		object[xLabel] = dataObj[xLabel];
		object[yLabel] = dataObj[yLabel];
		object.x1 = new Array(dataObj[xLabel].length - 1);
		object.x2 = new Array(dataObj[xLabel].length - 1);
		object.y1 = new Array(dataObj[yLabel].length - 1);
		object.y2 = new Array(dataObj[yLabel].length - 1);
		for(var i = 0 ; i < object.x1.length ; i ++){
			object.x1[i] = dataObj[xLabel][i];
			object.x2[i] = dataObj[xLabel][i+1];
			object.y1[i] = dataObj[yLabel][i];
			object.y2[i] = dataObj[yLabel][i+1];
		}
		// draw graph.
		for(var i = 0 ; i < object.graphObjArr.length ; i ++){
			object.graphObjArr[i]();
		}
	};
}
*/
/**  draw line graph  **/
// not event handle yet.
var Line_off = {};
(function() {	
	Line_off = function(axisObj, dataObj, xLabel1, xLabel2, yLabel1, yLabel2, optionObj) {
			this.axisObj = axisObj;
			this.dataObj = dataObj;
			this.xLabel1 = xLabel1;
			this.xLabel2 = xLabel2;
			this.yLabel1 = yLabel1;
			this.yLabel2 = yLabel2;
			this.optionObj = optionObj;
			dataObj.graphObjArr.push(this.drawLine_off(this));
	};
	Line_off.prototype = {
			drawLine_off: function(object){
				return function() {
					var axisObj = object.axisObj;
					var dataObj = object.dataObj;
					var xLabel1 = object.xLabel1;
					var xLabel2 = object.xLabel2;
					var yLabel1 = object.yLabel1;
					var yLabel2 = object.yLabel2;
					var optionObj = object.optionObj;
					if(optionObj.baseColor != undefined){
						object.baseColor = optionObj.baseColor;
					}else{
						object.baseColor = 'black';
					}
					var temp = axisObj._getPixelXY(dataObj[xLabel1], dataObj[yLabel1]);
					var xArr1 = temp.xArr;
					var yArr1 = temp.yArr;
					var temp = axisObj._getPixelXY(dataObj[xLabel2], dataObj[yLabel2]);
					var xArr2 = temp.xArr;
					var yArr2 = temp.yArr;
					var cnt = 0;
					object.node = new Array();
					for(var i = 0 ; i < xArr1.length - 1 ; i ++){
						if(!(xArr1[i] == -1 || yArr1[i] == -1 || xArr2[i] == -1 || yArr2[i] == -1)){
							object.node[cnt] = new Kinetic.Line({
								name: i,
								x: [xArr1[i], xArr2[i]],
								y: [yArr1[i], yArr2[i]],
								points: [ 
								         xArr1[i],
								         yArr1[i],
								         xArr2[i],
								         yArr2[i]
								        ],
								stroke: object.baseColor,
								fill: object.baseColor,
								strokeWdith: 1,
								opacity: 1,
							});
							cnt ++;
						}
					}
					object.dataLayer = new Kinetic.Layer();	
			    	for(var i = 0 ; i < object.node.length ; i ++){
			    		object.dataLayer.add(object.node[i]);
					}
			    	//add layer
					axisObj.stage.add(object.dataLayer);
				};
			}
	};
})();
/*
function drawLine_off(object)
{
	return function() {
		var axisObj = object.axisObj;
		var dataObj = object.dataObj;
		var xLabel1 = object.xLabel1;
		var xLabel2 = object.xLabel2;
		var yLabel1 = object.yLabel1;
		var yLabel2 = object.yLabel2;
		var optionObj = object.optionObj;
		if(optionObj.baseColor != undefined){
			object.baseColor = optionObj.baseColor;
		}else{
			object.baseColor = 'black';
		}
		var temp = axisObj._getPixelXY(dataObj[xLabel1], dataObj[yLabel1]);
		var xArr1 = temp.xArr;
		var yArr1 = temp.yArr;
		var temp = axisObj._getPixelXY(dataObj[xLabel2], dataObj[yLabel2]);
		var xArr2 = temp.xArr;
		var yArr2 = temp.yArr;
		var cnt = 0;
		object.node = new Array();
		for(var i = 0 ; i < xArr1.length - 1 ; i ++){
			if(!(xArr1[i] == -1 || yArr1[i] == -1 || xArr2[i] == -1 || yArr2[i] == -1)){
				object.node[cnt] = new Kinetic.Line({
					name: i,
					x: [xArr1[i], xArr2[i]],
					y: [yArr1[i], yArr2[i]],
					points: [ 
					         xArr1[i],
					         yArr1[i],
					         xArr2[i],
					         yArr2[i]
					        ],
					stroke: object.baseColor,
					fill: object.baseColor,
					strokeWdith: 1,
					opacity: 1,
				});
				cnt ++;
			}
		}
		object.dataLayer = new Kinetic.Layer();	
    	for(var i = 0 ; i < object.node.length ; i ++){
    		object.dataLayer.add(object.node[i]);
		}
    	//add layer
		axisObj.stage.add(object.dataLayer);
	};
}
*/