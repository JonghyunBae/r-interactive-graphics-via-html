/**  make hist object  **/
// optionObj can be bin, color(double).
// return : xLabel, yLebel, id, bin, xArr, yArr, freqArr, hasArr, isDiscrete, double.
var MakeHistObj = {};

(function() {
	
	MakeHistObj = function(mainArr, xLabel, optionObj) {
		this.xLabel = xLabel;
		this.yLabel = "frequency";
		this.mainLabel = "histogram of " + xLabel;
		this.id = 0;
		this.double = false;
		
		if(mainArr.isDiscrete[xLabel] == true){
			this.isDiscrete = true;
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
			this.freqArr = freqArr;
			this.xArr = xArr;
			freqArr[freqArr.length] = 0;
			this.yArr = freqArr;
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
        	this.freqArr = freqArr;
        	this.xArr = xArr;
        	freqArr[freqArr.length] = 0;
			this.yArr = freqArr;
			this.hasArr = hasArr;
		}
		/*// check double
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
	    */
		
		// set mapping for event handler.
		birthReport(mainArr, this, index, hasArr);		
	}
})();


var Hist = {};

(function() {
	
	Hist = function(axisObj, histObj, xArr, yArr, colorArr,  optionObj) {
		this._type = 'hist';
		this.id = histObj.id;
		this.preId = {x : -1, y : -1};
		this.stage = axisObj.stage;
		this._draw(axisObj, histObj, xArr, yArr, optionObj);
		histObj.id ++;
	};
	Hist.prototype = {
		_draw: function(axisObj, histObj, xArr, yArr, optionObj) {
			if(axisObj.isXDiscrete == true){
				this.barWidth = axisObj.width / xArr.length /2;
			}else{
				this.barWidth = (xArr[1] - xArr[0])*axisObj.width/axisObj.xMax;
			}
			//this.color = colorArr;
			this.node = new Array();
			var cnt = 0;
			if(axisObj.isXDiscrete == true){
				for(var i = 0; i < xArr.length ; i ++)
	        	{
        			this.node[i] = new Kinetic.Rect({
            			name : i,
    					freq: yArr[i],
    					x: (axisObj.isXDiscrete == true) ? (xArr[i]+1)*axisObj.xDiff + axisObj.plotXMargin : (xArr[i]-axisObj.xMin)*axisObj.width/(axisObj.xMax - axisObj.xMin) + axisObj.plotXMargin,
    					y: (axisObj.isYDiscrete == true) ? axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.yDiff : axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.height/axisObj.yMax,  
    					width: this.barWidth,
    					height: yArr[i]*axisObj.height/axisObj.yMax,
    					fill: 'green',
    					stroke: 'black',						
    					opacity : 0.5,
    					selected : 0,
    					selectCnt : 0,
    					info : "Node : " + i + "\r\n" + "Frequency : " + yArr[i] + "\r\n" + "Range : ",
    					offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
    				});
	        	}
			}else{
				for(var i = 0; i < xArr.length - 1 ; i ++)
	        	{
        			this.node[i] = new Kinetic.Rect({
            			name : i,
    					freq: yArr[i],
    					x: (axisObj.isXDiscrete == true) ? (xArr[i]+1)*axisObj.xDiff + axisObj.plotXMargin : (xArr[i]-axisObj.xMin)*axisObj.width/(axisObj.xMax - axisObj.xMin) + axisObj.plotXMargin,
    					y: (axisObj.isYDiscrete == true) ? axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.yDiff : axisObj.plotYMargin + axisObj.height - yArr[i]*axisObj.height/axisObj.yMax,  
    					width: this.barWidth,
    					height: yArr[i]*axisObj.height/axisObj.yMax,
    					fill: 'green',
    					stroke: 'black',						
    					opacity : 0.5,
    					selected : 0,
    					selectCnt : 0,
    					info : "Node : " + i + "\r\n" + "Frequency : " + yArr[i] + "\r\n" + "Range : ",
    					offset: {x:(axisObj.isXDiscrete == true)? this.barWidth/2 : 0},
    				});
	        	}
			}
        	// event add
			histObj.refreshArr[this.id] = makeRefresh(this.stage);
			histObj.updateArr[this.id] = histUpdate(this.node);
        	this.firstUpdate = firstUpdate(histObj);
        	
        	
        	setTooltip(this);
        	
        	this.dataLayer = new Kinetic.Layer();	
			for(var i = 0 ; i < this.node.length ; i ++)
			{
				this.dataLayer.add(this.node[i]);
			}
			
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
				}else if(node[ids].getSelected() == 0 && selectOn == 1){		// select
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
			}
		};
}
/**  update function end  **/

