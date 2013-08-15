/**  make hist object  **/
// optionObj can be bin, color(double).
// return : xLabel, yLebel, id, bin, xArr, yArr, freqArr, hasArr, isDiscrete, double.
var MakeHistObj = {};

(function() {
	
	MakeHistObj = function(mainArr, xLabel, optionObj) {
		this.xLabel = xLabel;
		this.yLabel = "Frequency";
		this.mainLabel = "histogram of " + xLabel;
		this.id = 0;
		this.isYDiscrete = false;
		this.double = false;
		this.legend = false;
		
		// basic calculation.
		if(mainArr.isDiscrete[xLabel] == true){
			this.isXDiscrete = true;
			var cnt = 0;
			var xArr = new Array();
			xArr[0] = new Array();
			xArr[1] = new Array();
			var freqArr = new Array();
			var index = new Array();
			var hasArr = make2DArr(mainArr[xLabel].length);
			freqArr[cnt] = 1;
			index[cnt] = 0;
			hasArr[cnt][0] = 0;
			xArr[1][cnt] = cnt;
			xArr[0][cnt++] = mainArr[xLabel][0];
			for(i = 1 ; i < mainArr[xLabel].length ; i++){
        		for(j = 0 ; j < xArr[0].length ; j ++){
        			if(xArr[0][j] == mainArr[xLabel][i]){
        				hasArr[j].push(i);
        				index[i] = j;
        				freqArr[j] ++; 
        				break;
        			}
        		}
        		if(j == xArr[0].length){
        			freqArr[j] = 1;
        			hasArr[j].push(i);
        			index[i] = j;
        			xArr[0].push(mainArr[xLabel][i]);
        			xArr[1].push(cnt ++);
        		}
        	}
			this.index = index;
			this.freqArr = freqArr;
			this.xArr = xArr;
			freqArr[freqArr.length] = 0;
			this.yArr = new Array();
			this.yArr[0] = freqArr;
			this.yArr[1] = freqArr;
			this.hasArr = hasArr;
		}else{
			this.isXDiscrete = false;			
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
			if(this.bin.toString().indexOf('.') != -1){
				this.fixPoint = this.bin.toString().substring(this.bin.toString().indexOf('.')+1, this.bin.toString().length).length;
			}
			if(tempMax > 0){
				var max = parseFloat((Math.ceil(tempMax / this.bin) * this.bin).toFixed(this.fixPoint));
			}else{
				var max = parseFloat((Math.ceil(tempMax / this.bin) * this.bin + this.bin).toFixed(this.fixPoint));
			}
			if(tempMax == max){
				max = max + this.bin;
			}
			var min = parseFloat((Math.floor(tempMin / this.bin) * this.bin).toFixed(this.fixPoint));
			var xArr = new Array();
			xArr[0] = new Array(parseInt(Math.round((max - min)/this.bin) + 1));
			xArr[1] = new Array(parseInt(Math.round((max - min)/this.bin) + 1));
			for(var i = 0 ; i < xArr[0].length ; i ++){
				xArr[0][i] = parseFloat((min + this.bin*i).toFixed(this.fixPoint));
				xArr[1][i] = parseFloat((min + this.bin*i).toFixed(this.fixPoint));
			}
			var freqArr = new Array(parseFloat(Math.ceil((max - min)/this.bin))); 
        	var hasArr = make2DArr(parseFloat(Math.ceil((max - min)/this.bin)));             	
        	var index = new Array(mainArr[xLabel].length);
        	var cnt = 0;
        	for(var i = 0 ; i < freqArr.length ; i ++ ){
        		freqArr[i] = 0; 
        	}
        	for(var i = 0 ; i < mainArr[xLabel].length ; i++){
       			cnt = parseInt((mainArr[xLabel][i] - min)/ this.bin);
        		freqArr[cnt] ++ ;
        		hasArr[cnt].push(i);
        		index[i] = cnt;
        	}
        	this.index = index;
        	this.freqArr = freqArr;
        	this.xArr = xArr;
        	freqArr[freqArr.length] = 0;
        	this.yArr = new Array();
			this.yArr[0] = freqArr;
			this.yArr[1] = freqArr;
			this.hasArr = hasArr;
		}
		
		// check color.
		if(optionObj.color != undefined){
			this.colorLabel = optionObj.color;
			// set legend.
			this.legend = new Object();
			// set color.
			if(this.colorLabel != this.xLabel && mainArr.isDiscrete[this.colorLabel] == true){ // double dimension.
				this.double = true;
				// find number of colors.
				var temp = findDiscreteNum(mainArr[this.colorLabel]);
				var tempColorArr = temp.discreteArr;
				var numberIndex = temp.mapping;
				// get colorObj according to tempColorArr.
				this.colorObj = makeColor_discrete(tempColorArr);
				var colorArr = new Array();
				var freqArr = new Array();
				var xArr = new Array();
				var hasArr = new Array();
				var hasColorArr = new Array();
				var index = new Array(mainArr[this.colorLabel].length);
				var cnt = 0;
				for(var i = 0 ; i < this.hasArr.length ; i ++){					
					var tempFreqArr = new Array(this.colorObj.colors.length);
					var tempHasArr = new Array(this.colorObj.colors.length);
					for(var j = 0 ; j < tempFreqArr.length ; j ++){
						tempFreqArr[j] = 0;
						tempHasArr[j] = new Array();
					}
					// parse the one bar.
					for(var j = 0 ; j < this.hasArr[i].length ; j ++){
						tempFreqArr[numberIndex[this.hasArr[i][j]]] ++;
						tempHasArr[numberIndex[this.hasArr[i][j]]].push(this.hasArr[i][j]);
					}
					// save values.
					for(var j = 0 ; j < tempFreqArr.length ; j ++){
						if(tempFreqArr[j] != 0){
							freqArr[cnt] = tempFreqArr[j];
							xArr[cnt] = this.xArr[1][i];
							hasArr[cnt] = tempHasArr[j];
							colorArr[cnt] = this.colorObj.colors[j];							
							for(var t = 0 ; t < tempHasArr[j].length ; t ++){
								index[tempHasArr[j][t]] = cnt;
							}
							cnt ++;
						}
					}
				}
				this.index = index;
				this.hasArr = hasArr;
				this.xArr[1] = xArr;
				this.yArr[1] = freqArr;
				this.colorArr = colorArr;
				// for legend(colorArr and each label of each color needed).
				var legend_isDiscrete = true;
				var legend_labels = tempColorArr;
				var legend_colorArr = this.colorObj.colors;
			}else if(this.xLabel == this.colorLabel && mainArr.isDiscrete[this.colorLabel] == true){ // just same color with xAxis.
				this.colorArr = makeColor_discrete(this.xArr[0]).colors;
				// for legend(colorArr and each label of each color needed).
				var legend_isDiscrete = true;
				var legend_labels = this.xArr[0];
				var legend_colorArr = this.colorArr;
			}else{ // color -> continuous , just draw a legend.
				this.colorArr = new Array();
				for(var i = 0 ; i < this.xArr[0].length ; i ++){
					this.colorArr[i] = 'green';
				}
				// for legend(colorArr and each label of each color needed).
				this.colorObj = makeColor_continuous(mainArr[this.colorLabel]);
				var legend_colorArr = this.colorObj.mainValueArr;
				var legend_isDiscrete = false;
				var temp = findMaxMinValue(mainArr[this.colorLabel]);
		        this.legend.max = temp.max;
		        this.legend.min = temp.min;
				var legend_labels = null;
			}
			// set legend.
			if(optionObj.legend != undefined){				
				this.legend.position = optionObj.legend;
			}else{
				this.legend.position = 'right';
			}
			this.legend.isDiscrete = legend_isDiscrete;
			this.legend.colorArr = legend_colorArr;
			this.legend.labels = legend_labels;
			this.legend.colorLabel = this.colorLabel;
			
		}else{ // just green color
			this.colorArr = new Array();
			for(var i = 0 ; i < this.xArr[0].length ; i ++){
				this.colorArr[i] = 'green';
			}
		}

		// set mapping for event handler.
		birthReport(mainArr, this, this.index, this.hasArr);
	}
})();


var Hist = {};

(function() {
	
	Hist = function(axisObj, histObj, xArr, yArr, colorArr,  optionObj) {
		this._type = 'hist';
		this.id = histObj.id;
		this.preId = {x : -1, y : -1};
		this.stage = axisObj.stage;
		this._draw(axisObj, histObj, xArr, yArr, colorArr, optionObj);
		histObj.id ++;
	};
	Hist.prototype = {
		_draw: function(axisObj, histObj, xArr, yArr, colorArr, optionObj) {
			this.barWidth = axisObj.barWidth;
			if(optionObj.double == true){
				var x = 0;
				var y = 0;			
				var tempData = -1;
				this.node = new Array();				
				for(var i = 0; i < xArr.length ; i ++){
					x = (axisObj.isXDiscrete == true) ? (xArr[i]+1)*axisObj.xDiff + axisObj.plotXMargin : (xArr[i]-axisObj.xMin)*axisObj.width/(axisObj.xMax - axisObj.xMin) + axisObj.plotXMargin;
					if(x != tempData){
						y = (axisObj.isYDiscrete == true) ? axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.yDiff : axisObj.plotYMargin + axisObj.height - (yArr[i] - axisObj.yMin)*axisObj.height/(axisObj.yMax - axisObj.yMin);
					}
        			this.node[i] = new Kinetic.Rect({
            			name : i,
    					freq: yArr[i],
    					x: x,
    					y: y,  
    					width: this.barWidth,
    					height: yArr[i]*axisObj.height/axisObj.yMax,
    					fill: colorArr[i],
    					stroke: 'black',
    					strokeWidth: 0.2,
    					opacity : 0.5,
    					selected : 0,
    					selectCnt : 0,
    					info : "Node : " + i + "\r\n" + "Frequency : " + yArr[i] + "\r\n" + "Range : ",
    					offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
    				});
        			if(i < yArr.length){
        				y = y - yArr[i+1]*axisObj.height/axisObj.yMax;
        			}	        				
        			tempData = this.node[i].getX();
	        	}
			}else{
				this.node = new Array();
				if(axisObj.isXDiscrete == true){
					for(var i = 0; i < xArr.length ; i ++){
	        			this.node[i] = new Kinetic.Rect({
	            			name : i,
	    					freq: yArr[i],
	    					x: (axisObj.isXDiscrete == true) ? (xArr[i]+1)*axisObj.xDiff + axisObj.plotXMargin : (xArr[i]-axisObj.xMin)*axisObj.width/(axisObj.xMax - axisObj.xMin) + axisObj.plotXMargin,
	    					y: (axisObj.isYDiscrete == true) ? axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.yDiff : axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.height/axisObj.yMax,  
	    					width: this.barWidth,
	    					height: yArr[i]*axisObj.height/axisObj.yMax,
	    					fill: colorArr[i],
	    					stroke: colorArr[i],						
	    					opacity : 0.5,
	    					selected : 0,
	    					selectCnt : 0,
	    					info : "Node : " + i + "\r\n" + "Frequency : " + yArr[i] + "\r\n" + "Range : ",
	    					offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
	    				});
		        	}
				}else{
					for(var i = 0; i < xArr.length - 1 ; i ++){
	        			this.node[i] = new Kinetic.Rect({
	            			name : i,
	    					freq: yArr[i],
	    					x: (axisObj.isXDiscrete == true) ? (xArr[i]+1)*axisObj.xDiff + axisObj.plotXMargin : (xArr[i]-axisObj.xMin)*axisObj.width/(axisObj.xMax - axisObj.xMin) + axisObj.plotXMargin,
	    					y: (axisObj.isYDiscrete == true) ? axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.yDiff : axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.height/axisObj.yMax,  
	    					width: this.barWidth,
	    					height: yArr[i]*axisObj.height/axisObj.yMax,
	    					fill: colorArr[i],
	    					stroke: colorArr[i],						
	    					opacity : 0.5,
	    					selected : 0,
	    					selectCnt : 0,
	    					info : "Node : " + i + "\r\n" + "Frequency : " + yArr[i] + "\r\n" + "Range : ",
	    					offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
	    				});
		        	}
				}
			}
			
        	// event add
			histObj.refreshArr[this.id] = makeRefresh(this.stage);
			histObj.updateArr[this.id] = histUpdate(this.node);
        	this.firstUpdate = firstUpdate(histObj);
        	
        	
        	setTooltip(this);
        	
        	this.dataLayer = new Kinetic.Layer();	
			for(var i = 0 ; i < this.node.length ; i ++){
				this.dataLayer.add(this.node[i]);
			}
			axisObj.dataLayerArr.push(this.dataLayer);
			//add layers
			axisObj.stage.add(this.tooltipLayer);
			axisObj.stage.add(this.dataLayer);
		}
	};
})();

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
					if(node[ids[i]].getSelected() == 1 && selectOn == 0)		//unselect
					{
						node[ids[i]].setSelectCnt(node[ids[i]].getSelectCnt() - 1);
						if(node[ids[i]].getSelectCnt() == 0){
							node[ids[i]].setOpacity(0.5);
							node[ids[i]].setSelected(0);
						}
					}else if(selectOn == 1){		// select
						node[ids[i]].setSelectCnt(node[ids[i]].getSelectCnt() + 1);	
						if(node[ids[i]].getSelected() == 0){
							node[ids[i]].setOpacity(1);
							node[ids[i]].setSelected(1);
						}
					}
				}
			//	alert(node[2].getSelectCnt());
			}
		};
}
/**  update function end  **/

