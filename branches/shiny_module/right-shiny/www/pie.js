var Pie = {};

(function() {
	
	Pie = function(axisObj, pieObj, xArr, yArr, colorArr, optionObj) {
		this._type = 'pie';
		this.id = pieObj.id;
		this.preId = {x : -1, y : -1};
		this.stage = axisObj.stage;
		this._draw(axisObj, pieObj, xArr, yArr, colorArr, optionObj);
		pieObj.id ++;
	};
	Pie.prototype = {
		_draw: function(axisObj, pieObj, xArr, yArr, colorArr, optionObj) {

			this.node = new Array();
			var cnt = 0;
			var degree = 0;
			// calculate total frequency.
			var totalFreq = 0;
			for(var i = 0 ; i < xArr.length ; i ++){
				totalFreq = totalFreq + yArr[i];
			}
			if(axisObj.isXDiscrete == true){
				for(var i = 0; i < xArr.length ; i ++){
        			this.node[i] = new Kinetic.Wedge({						
            			name : i,
    					freq: yArr[i],
    					x: axisObj.plotXMargin + axisObj.width/2,
    					y: axisObj.plotYMargin + axisObj.height/2,
    					radius: 100,
    					rotationDeg: -90 + degree,	
    					angleDeg: yArr[i]/totalFreq * 360,
    					fill: colorArr[i],
    					stroke: 'black',
    					strokeWidth: 0.2,
    					opacity : 0.5,
    					selected : 0,
    					selectCnt : 0,
    					info : "Node : " + i + "\r\n" + "Frequency : " + yArr[i] + "\r\n" + "Range : ",
    				});
        			degree = degree + yArr[i]/totalFreq * 360;
	        	}
			}else{
				for(var i = 0; i < xArr.length - 1 ; i ++){
					this.node[i] = new Kinetic.Wedge({						
            			name : i,
    					freq: yArr[i],
    					x: axisObj.plotXMargin + axisObj.width/2,
    					y: axisObj.plotYMargin + axisObj.height/2,
    					radius: 100,
    					rotationDeg: -90 + degree,	
    					angleDeg: yArr[i]/totalFreq * 360,
    					fill: colorArr[i],
    					stroke: 'black',
    					strokeWidth: 0.2,
    					opacity : 0.5,
    					selected : 0,
    					selectCnt : 0,
    					info : "Node : " + i + "\r\n" + "Frequency : " + yArr[i] + "\r\n" + "Range : ",
    				});
        			degree = degree + yArr[i]/totalFreq * 360;
	        	}
			}
        	// event add
			pieObj.refreshArr[this.id] = makeRefresh(this.stage);
			pieObj.updateArr[this.id] = pieUpdate(this.node);
        	this.firstUpdate = firstUpdate(pieObj);        	
        	this.dataLayer = new Kinetic.Layer();	
			for(var i = 0 ; i < this.node.length ; i ++){
				this.dataLayer.add(this.node[i]);
			}
			axisObj.dataLayerArr.push(this.dataLayer);
			axisObj.hoverArr.push(pieHover());
			//add layers
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
				node.setStroke('black');
				node.draw();
			}else if(overOff == 0){
				var tween = new Kinetic.Tween({
		        	node: node, 
		        	duration: 0.01,
		        	stroke: node.getFill(),
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