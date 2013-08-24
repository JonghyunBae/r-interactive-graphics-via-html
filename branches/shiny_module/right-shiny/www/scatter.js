/**  Draw Dot graph(scatter)  **/
var Dot = {};
(function() {
	Dot = function(axisObj, dataObj, xLabel, yLabel, optionObj) {
		this._init(axisObj, dataObj, optionObj);
		this._draw(axisObj, dataObj, xLabel, yLabel);
	};
	Dot.prototype = {
			_init: function(axisObj, dataObj, optionObj) {
				this.radius = (optionObj.radius == undefined) ? (2) : (optionObj.radius); // default radius is 2
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
							this.node[cnt] = new Kinetic.Circle({
								name: cnt,
								x: xArr[i],
								y: yArr[i],
								radius: this.radius,
								stroke: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								fill: (dataObj[this.colorLabel].isDiscrete == undefined) ? dataObj[this.colorLabel].color[i] : dataObj[this.colorLabel].colorIndex[dataObj[this.colorLabel][i]],
								selected: 0,
								opacity: 0.5,
								info: "Node: " + cnt 
							});
							cnt ++;
						}
					}
				}else{
					for(var i = 0 ; i < xArr.length ; i ++){
						if(!(xArr[i] == -1 || yArr[i] == -1)){
							this.node[cnt] = new Kinetic.Circle({
								name: cnt,
								x: xArr[i],
								y: yArr[i],
								radius: this.radius,
								stroke: 'green',
								fill: 'green',
								selected: 0,
								opacity: 0.5,
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
/**  Draw Dot graph(scatter) End  **/




function scatterHover()
{
	return function(node, overOff) // over: 1 , off: 0
		{
			if(overOff == 1){
				node.setScaleX(1.5);
                node.setScaleY(1.5);
                node.draw();
			}else if(overOff == 0){
				var tween = new Kinetic.Tween({
        			node: node, 
			        duration: 0.01,
			        scaleX: 1,
			        scaleY: 1
        		}).play(); 
			}
		};
}
/**  update function  **/
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function scatterUpdate(node)
{
	return	function(ids, selectOn)
		{
			if(ids.length == undefined){
				if(node[ids].getSelected() == 1 && selectOn == 0){		//unselect
					node[ids].setStroke(node[ids].getFill());
					node[ids].setScaleX(1);
					node[ids].setScaleY(1);
					node[ids].setSelected(0);
				}else if(node[ids].getSelected() == 0 && selectOn == 1){	//select
					node[ids].setStroke('black');
					node[ids].setScaleX(2);
					node[ids].setScaleY(2);
					node[ids].setSelected(1);
					node[ids].moveToTop();
				}
			}else{
				for(var i = 0 ; i < ids.length ; i ++){
					if(node[ids[i]].getSelected() == 1 && selectOn == 0){		//unselect
						node[ids[i]].setStroke(node[ids[i]].getFill());
						node[ids[i]].setScaleX(1);
						node[ids[i]].setScaleY(1);
						node[ids[i]].setSelected(0);
					}else if(node[ids[i]].getSelected() == 0 && selectOn == 1){	//select
						node[ids[i]].setStroke('black');
						node[ids[i]].setScaleX(2);
						node[ids[i]].setScaleY(2);
						node[ids[i]].setSelected(1);
						node[ids[i]].moveToTop();
					}
				}
			}
			
		};
}
/**  update function end  **/


/**  Regression functions for scatter  **/
//linear regression.
function linearSendArr(Name)
{
	if(Name._type == "scatter"){	// only for scatter.
		if(isDiscrete[Name.x] == false && isDiscrete[Name.y] == false){		// only for continuous data.
			if(Name.linear == true){
				Name.linear = false;
				Name.draw(Name._id);
				eventTrigger(Name);
			}else{		
				Name.linear = true;		
				window.Shiny.onInputChange("id", Name._id);
				window.Shiny.onInputChange("type", Name._type);
				window.Shiny.onInputChange("graph", "linear");
				window.Shiny.onInputChange("xx", tempData[Name.x]);
				window.Shiny.onInputChange("yy", tempData[Name.y]);
			}
		}
	}

}
//loess regression.
function loessSendArr(Name)
{
	if(Name._type == "scatter"){	// only for scatter.
		if(isDiscrete[Name.x] == false && isDiscrete[Name.y] == false){		// only for continuous data.
			if(Name.loess == true){
				Name.loess = false;
				Name.draw(Name._id);
				eventTrigger(Name);
			}else{		
				Name.loess = true;		
				window.Shiny.onInputChange("id1", Name._id);
				window.Shiny.onInputChange("type1", Name._type);
				window.Shiny.onInputChange("graph1", "loess");
				window.Shiny.onInputChange("xx1", tempData[Name.x]);
				window.Shiny.onInputChange("yy1", tempData[Name.y]);
			}
		}
	}
}
/**  Regression functions for scatter end  **/




