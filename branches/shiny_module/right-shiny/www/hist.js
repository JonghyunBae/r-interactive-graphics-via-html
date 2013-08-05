/**  make hist object  **/
// optionObj can be bin, color(double).
// return : xLabel, yLebel, id, bin, xArr, yArr, freqArr, hasArr, isDiscrete, double.
var MakeHistObj = {};
function setMapping(index)
{
	return function(nodes)
		{
			var returnArr = new Array();
			if(nodes.length == undefined){
				returnArr = index[nodes];
			}else{
				for(var i = 0 ; i < nodes.length ; i ++){
					returnArr = returnArr.concat(index[nodes[i]]);
				}
				returnArr = returnArr.reduce(function(a,b){
					if(a.indexOf(b) < 0) a.push(b);
					return a;
				},[]);
			}
			return returnArr;
		};
}

(function() {
	
	MakeHistObj = function(mainArr, xLabel, optionObj) {
		this.xLabel = xLabel;
		this.yLabel = "frequency";
		this.id = 1;
		this.double = false;
		
		
		if(mainArr.isDiscrete[xLabel] == true){
			this.isDiscrete = true;
			var cnt = 0;
			var xArr = new Array();
			var freqArr = new Array();
			var index = new Array();
			var hasArr = make2DArr(mainArr[xLabel].length);
			freqArr[cnt] = 1;
			index[cnt] = 0;
			hasArr[cnt][0] = 0;
			xArr[cnt++] = mainArr[xLabel][0];
			for(i = 1 ; i < mainArr[xLabel].length ; i++)
        	{
        		for(j = 0 ; j < xArr.length ; j ++)
        		{
        			if(xArr[j] == mainArr[xLabel][i])
        			{
        				hasArr[j].push(i);
        				index[i] = j;
        				//isSelected[i][id] = histUpdate(this, j);
        				freqArr[j] ++; 
        				break;
        			}
        		}        		
        		if(j == xArr.length)
        		{
        			freqArr[j] = 1;
        			hasArr[j].push(i);
        			index[i] = j;
        			xArr.push(mainArr[xLabel][i]);
        			//isSelected[i][id] = histUpdate(this, j);
        		}
        	}
			
			this.freqArr = freqArr;
			this.xArr = xArr;
			var temp = findMaxMinValue(freqArr);
			this.yArr = [0, temp.max];
			this.hasArr = hasArr;
		}else{
			this.isDiscrete = false;
			
			var temp = findMaxMinValue(mainArr[xLabel]);
			var tempMax = temp.max;
			var tempMin = temp.min;
			if(optionObj.bin == undefined){
				var tickRange = (tempMax - tempMin) / 5;
				var tmp = Math.ceil(Math.log(tickRange) / Math.log(10));
				this.bin = setTickRange(tmp, tickRange);
			}else{
				this.bin = optionObj.bin;
			}
			 //check the fixpoint.
			this.fixPoint = 0;			
			if(this.bin.toString().indexOf('.') != -1)
			{
				this.fixPoint = this.bin.toString().substring(this.bin.toString().indexOf('.')+1, this.bin.toString().length).length;
			}
			
			if(tempMax > 0){
				var max = parseFloat((Math.ceil(tempMax / this.bin) * this.bin).toFixed(this.fixPoint));
			}else{
				var max = parseFloat((Math.ceil(tempMax / this.bin) * this.bin + this.bin).toFixed(this.fixPoint));
			}
			if(max == tempMax){
				max = max + this.bin;
			}				
			var min = parseFloat((Math.floor(tempMin / this.bin) * this.bin).toFixed(this.fixPoint));
			var freqArr = new Array(parseInt((max - min)/this.bin)); 
        	var hasArr = make2DArr(parseInt((max - min)/this.bin));             	
        	var index = new Array(mainArr[xLabel].length);
        	var cnt = 0;
        	for(var i = 0 ; i < freqArr.length ; i ++ )
        	{
        		freqArr[i] = 0; 
        	}
        	for(var i = 0 ; i < mainArr[xLabel].length ; i++){
       			cnt = parseInt((mainArr[xLabel][i] - min)/ this.bin);
        		freqArr[cnt] ++ ;
        		hasArr[cnt].push(i);
        		index[i] = cnt;
        	}
        	this.freqArr = freqArr;
        	this.xArr = [min - this.bin, max + this.bin];
        	var temp = findMaxMinValue(freqArr);
			this.yArr = [0, temp.max];
			this.hasArr = hasArr;
		}
		this.isSelected = make2DArr(this.freqArr.length);
		// check double
		if(optionObj.color == undefined){
	         this.color = -1; //default color
	    }else{
	    	this.color = optionObj.color;
	    	if(xLabel == this.color && mainArr.isDiscrete[this.color] == true){
	    		this.colorArr =  makeColor_discrete(this.xArr, index);
	    	}else if(mainArr.isDiscrete[this.color] == true){
				//under construction.
			}			
		}
		//check option color is assigned if option legend is assined.
	    if(this.color == -1 && optionObj.legend != undefined){
	    	alert("Can't draw legend without color!");
			return -1;                    
	    }
    	//check option legend name is appropriate
	    if(optionObj.legend !=undefined){
	    	var legendChk = optionObj.legend.toLowerCase();
	    	if( legendChk == 'right' || legendChk == 'left' || legendChk == 'topright' || legendChk == 'topleft'){                           
	    		this.legend = optionObj.legend;
	    	}else{
	    		alert("Legend should be \"right\", \"left\", \"topright\" or \"topleft\"!");
    			return -1;
	    	}
	    }else{
	    	this.legend = "right"; //if color is set, but legend is not, just set default legend as right
	    }
	    
		// set mapping
		this.parent = mainArr;
		if(mainArr.child == null){
			mainArr.child = new Array();
			mainArr.parentTOchild = new Array();
		}
		mainArr.child.push(this);
		this.child = null;
		this.parentTOchild = null;
		this.childTOparent = setMapping(hasArr);
		this.refreshArr = new Array();
		mainArr.parentTOchild.push(setMapping(index));
	}
})();

var Hist = {};
(function() {	
	Hist = function(plotObject, histArr) {
		this._type = 'hist';
		this.id = histArr.id;
		//this._labelArr = mainArr.labelArr; //localize later
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
		this.stage = plotObject.stage;
		//excute draw
		this._draw(plotObject, histArr);
		histArr.refreshArr[this.id] = makeRefresh(this.stage);
		histArr.id ++;
    };
	Hist.prototype = {
			_draw : function(plotObject, histArr) {
				//assign this.color as histArr.color because addLayer needs this.color.
				this.color = histArr.color;				
				//if color exists, legend should be created.
	            if(histArr.color != -1){
	            	//set legend position.
	        		setLegendPosition(histArr, plotObject);    
	        		//make legend.
	            	MakeLegend(this, histArr.color, histArr.colorArr, histArr.legendX, histArr.legendY, histArr.mainValueArr);	
	        		//resize plotObject's width. It depends on legendGroup's width.
	        		plotObject.stage.setWidth(plotObject.stage.getWidth()+ this.legendGroup.getWidth());        		
	        		//When legend is right or left, move legend layer to center. 			        		
	        		if(histArr.legend == 'right' || histArr.legend == 'left'){
	        			this.legendLayer.setY((plotObject.height-this.legendGroup.getHeight())/2);
	        		}        		
	        		//move plotObject left.
	        		if(this.legend == 'left' || this.legend == 'topleft'){
	        			plotObject.plotLayer.setX(plotObject.plotLayer.getX() + this.legendGroup.getWidth() + plotObject.plotLength*5 );
	            		plotObject.plotLayer.draw();            		
	        		}       	
	            }
				if(histArr.double == false){
					if(histArr.isDiscrete == true){
						this.barWidth = (plotObject.xPlotArr[2][0] - plotObject.xPlotArr[1][0])/2;
					}else{
						this.barWidth = (plotObject.xPlotArr[2][0] - plotObject.xPlotArr[1][0]);
					}
					this.node = new Array();
		            	for(var cnt = 0; cnt < histArr.freqArr.length ; cnt++)
		            	{
		            		//alert(plotObject.xPlotArr.length);
		            		//alert(histArr.freqArr.length);
		            		this.node[cnt] = new Kinetic.Rect({
		            			name : cnt,
								freq: histArr.freqArr[cnt],
								x: (histArr.isDiscrete == true) ? plotObject.plotXMargin + plotObject.xPlotArr[cnt][0]  : plotObject.plotXMargin + plotObject.xPlotArr[cnt+1][0] + this.barWidth/2, 
								y: plotObject.plotYMargin + plotObject.height - histArr.freqArr[cnt]*plotObject.height/plotObject.yMax/2, 
								width: this.barWidth,
								height: histArr.freqArr[cnt]*plotObject.height/plotObject.yMax,
								fill: (histArr.color == -1) ? 'green' : histArr.colorArr.indexArr[histArr.hasArr[cnt][0]],
								stroke: 'black',						
								opacity : 0.5,
								selected : 0,
								selectCnt : 0,
								info : "Node : " + cnt + "\r\n" + "Frequency : " + histArr.freqArr[cnt],
								hasArr : histArr.hasArr[cnt],
								offset: {x: this.barWidth/2, y: histArr.freqArr[cnt]*plotObject.height/plotObject.yMax/2},
							});
		            		histArr.isSelected[cnt][this.id] = histUpdate(this, cnt);
		            	}
				}
				this.firstUpdate = firstUpdate(histArr, null);
				//alert(this.allupdate);
				setTooltip(this);
				MakeMainLabel(this, plotObject, histArr.xLabel, "Frequency");
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

