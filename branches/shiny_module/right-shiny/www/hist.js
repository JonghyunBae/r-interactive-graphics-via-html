var Hist = {};
(function() {	
	Hist = function(plotObject, mainArr, optionObj) {
		this._type = 'hist';
		this._id = mainArr.id;
		this._labelArr = mainArr.labelArr; //localize later
		objArr[mainArr.id-1] = this;
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
		this.stage = plotObject.stage;
		this.draw(plotObject, mainArr, optionObj);
		mainArr.id ++;
    };
	Hist.prototype = {
			draw : function(plotObject, mainArr, optionObj) {
				//check the x label
    			if(optionObj.x != undefined){
    			 	for(var i = 0 ; i < mainArr.labelArr.length ; i ++)	
    			     {
    			     	if(mainArr.labelArr[i].toLowerCase()==optionObj.x.toLowerCase()){	            		
    			     		this.x =  i;
    			     		 break;
    			     	}
    			     	if(i == mainArr.labelArr.length - 1){
    			     		alert('retype x label');
    			     		this.x = 0;
    			     	}
    			     }
    			}else{
    				alert('x should be defined!');
    				this.x = 0;
    			}
    			
    			//calculate frequency.
    			if(mainArr.isDiscrete[this.x] == true){	// discrete
    				if(this.x != plotObject.x){
    					alert('histogram cannot be drawn!');
    					return;
    				}
    				var tmp = freqCalc_discrete(mainArr.dataArr, plotObject.xPlotArr, plotObject.xNode, this.x);
    				this.freqArr = tmp.freqArr;
    				this.hasDataArr = tmp.hasDataArr;
    				this.hasNumberArr = tmp.hasNumberArr;
    				alert(plotObject.xdiff);
    				this.barWidth = plotObject.xdiff/2;
    				
    			}else{	// continuous
    				var tmp = freqCalc_continuous(mainArr.dataArr, plotObject.xPlotArr, plotObject.xMax, plotObject.xMin, this.x);
    				this.freqArr = tmp.freqArr;
    				this.hasDataArr = tmp.hasDataArr;
    				this.hasNumberArr = tmp.hasNumberArr;
    				this.barWidth = plotObject.xPlotArr[1][0] - plotObject.xPlotArr[0][0];
    			}
    			// set the color type
	            if(optionObj.color==undefined){
	            	if(this.color == undefined){
	            		this.color=-1; //default color
	            	}else{
	            		var tmpSetColor =  setColor(dataArr[this.color]);
	    				var colors = tmpSetColor.colors;
						var mainValueArr = tmpSetColor.mainValueArr;
						var tmpColorArr = tmpSetColor.tmpColorArr;
	            	}	            		
	            }else{
            		for(var i = 0 ; i < mainArr.labelArr.length ; i ++)
	  	            {
	  	            	if(this._labelArr[i].toLowerCase()==optionObj.color.toLowerCase()){	            		
	  	            		 this.color =  i;
	  	            		 break;
	  	            	}
	  	            	if(i == mainArr.labelArr.length - 1){
	  	            		alert('retype colors label');
	  	            		this.color = 0;
	  	            	}
	  	            }	
            		var tmpSetColor =  setColor(mainArr.dataArr[this.color]);
    				var colors = tmpSetColor.colors;
					var mainValueArr = tmpSetColor.mainValueArr;
					var tmpColorArr = tmpSetColor.tmpColorArr;
	            }
	            //set the legend text.
	            if(this.color != -1){
	            	this.lengend = "right";
	            	this.legendX = plotObject.plotXMargin + plotObject.width + plotObject.plotLength*5;
	        		this.legendY = plotObject.plotYMargin - plotObject.plotLength;
	            	// making legend.
	            	setLegendMake(this, mainValueArr, colors);	            	
	            }
	            if(this.color != plotObject.x && mainArr.isDiscrete[this.color] == true){
	            	for(var i = 0 ; i < this.freqArr.length ; i ++){
	            		var cnt = 0;
	            		var xTmp = new Array();
		            	var freqTmp = new Array();
		            	var hasTmp = make2DArr(dataArr[this.x].length);
		            	freqTmp[cnt] = 1;
		            	hasTmp[cnt][0] = 0;
		            	xTmp[cnt++] = dataArr[this.x][0];
	            		for(var j = 0 ; j < this.freqArr[i].length ; j ++){
	            			
	            		}
	            		var tmp = freqCalc_discrete(this.hasDataArr, plotObject.xPlotArr, plotObject.xNode, this.x);
	    				this.freqArr = tmp.freqArr;
	    				this.hasDataArr = tmp.hasDataArr;
	    				this.hasNumberArr = tmp.hasNumberArr;
	    				alert(plotObject.xdiff);
	            	}
	            }
	            
	            if(this.color == plotObject.x){
	            	 // redraw y axis.
	    			plotObject.yMax = findMaxValue(this.freqArr);
	    			plotObject.yMin = 0;
	    			var tmp = setAxis_continue(plotObject.yMax, plotObject.yMin, plotObject.yTick, plotObject.height);
	    			plotObject.yMax = tmp.max;
	    			plotObject.yMin = tmp.min;
	    			plotObject.diff = -1;
	    			plotObject.yPlotArr = tmp.array;	
	    			plotObject.changeY();
	    			this.stage = plotObject.stage;
		            this.node = new Array();
	            	for(var cnt = 0; cnt < this.freqArr.length ; cnt++)
	            	{
	            		this.node[cnt] = new Kinetic.Rect({
	            			name : cnt,
							freq: this.freqArr[cnt],
							x: (mainArr.isDiscrete[this.x] == true) ? plotObject.plotXMargin + plotObject.xPlotArr[cnt][0]  : plotObject.plotXMargin + plotObject.xPlotArr[cnt][0] + this.barWidth/2, 
							y: plotObject.plotYMargin + plotObject.height - this.freqArr[cnt]*plotObject.height/plotObject.yMax/2, 
							width: this.barWidth,
							height: this.freqArr[cnt]*plotObject.height/plotObject.yMax,
							fill: getColor(this.hasNumberArr[cnt][0] ,colors, mainValueArr, tmpColorArr),
							stroke: 'black',						
							opacity : 0.5,
							selected : 0,
							selectCnt : 0,
							info : "Node : "+cnt+"\r\n"+"Frequency : " + this.freqArr[cnt],
							hasArr : this.hasNumberArr[cnt],
							offset: {x: this.barWidth/2, y: this.freqArr[cnt]*plotObject.height/plotObject.yMax/2},
						});
	            	}
	            }
	            
	           
            	// set labels.
    			setXLabel(this, plotObject);
				setYLabel(this, plotObject);
				setMainLabel(this, plotObject);
				setTooltip(this);
				
            	//draw node
				this.dataLayer = new Kinetic.Layer();	
				for(var i = 0 ; i < this.node.length ; i ++)
				{
					this.dataLayer.add(this.node[i]);
				} 
				//Total layers added to plot stage.
				addLayer(this, plotObject.stage);
    			
			}
	};
})();

function freqCalc_continuous(dataArr, plotArr, max, min, axis)
{
	var freqArr = new Array(plotArr.length - 1);
	var hasDataArr = make2DArr(plotArr.length - 1);
	var hasNumberArr = make2DArr(plotArr.length - 1);
	var bin = plotArr[1][1] - plotArr[0][1];
	var temp = new Array();
	for(var i = 0 ; i < freqArr.length ; i ++){
		freqArr[i] = 0;
	}
	for(var i = 0 ; i < dataArr[axis].length ; i ++){
		if(min < 0)
		{
			cnt = parseInt((dataArr[axis][i]+Math.abs(min))/bin);     		
		}else{
			cnt = parseInt(dataArr[axis][i]/bin);
		}	            		
		freqArr[cnt] ++ ;             		
		hasNumberArr[cnt].push(i);       		
		for(var j = 0 ; j < dataArr.length ; j ++){
			temp[j] = dataArr[j][i];
		}
		hasDataArr[cnt].push(temp);
	}
	return {
		'freqArr'		: freqArr,
		'hasDataArr'	: hasDataArr,
		'hasNumberArr'	: hasNumberArr
	};
}
function freqCalc_discrete(dataArr, plotArr, xNode, axis)
{
	var freqArr = new Array(plotArr.length);
	var hasDataArr = make2DArr(plotArr.length);
	var hasNumberArr = make2DArr(plotArr.length);
	var temp = new Array();
	for(var i = 0 ; i < freqArr.length ; i ++){
		freqArr[i] = 0;
	}
	for(var i = 0 ; i < dataArr[0].length ; i ++){
		freqArr[xNode[i]] ++ ;
		hasNumberArr[xNode[i]].push(i);
		for(var j = 0 ; j < dataArr.length ; j ++){
			temp[j] = dataArr[j][i];
		}
		hasDataArr[xNode[i]].push(temp);
	}
	return {
		'freqArr'		: freqArr,
		'hasDataArr'	: hasDataArr,
		'hasNumberArr'	: hasNumberArr
	};
}

/**  update function  **/
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function histUpdate(obj, id)
{
	return	function(selectOn)
				{
					
					if(obj.node[id].getSelected() == 1 && selectOn == 0)		//unselect
					{
						obj.node[id].setSelectCnt(obj.node[id].getSelectCnt() - 1);
						if(obj.node[id].getSelectCnt() == 0)
						{
							obj.node[id].setOpacity(0.5);
							obj.node[id].setSelected(0);
						}
					}else if(selectOn == 1){		// select
						obj.node[id].setSelectCnt(obj.node[id].getSelectCnt() + 1);						
						if(obj.node[id].getSelected() == 0)
						{
							obj.node[id].setOpacity(1);
							obj.node[id].setSelected(1);
						}				
					}
				};
}
/**  update function end  **/

