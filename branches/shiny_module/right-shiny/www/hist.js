/**  make hist object  **/
// optionObj can be bin, color(double).
// return : id, bin, xArr, yArr, freqArr, hasArr, isDiscrete, double.
var MakeHistObj = {};

(function() {
	
	MakeHistObj = function(mainArr, xLabel, optionObj) {
		
		this.bin = (optionObj.bin == undefined) ? (2) : (optionObj.bin); // default bin is 2
		this.id = 0;
		this.double = false;
		if(mainArr.isDiscrete[xLabel] == true){
			this.isDiscrete = true;
			var cnt = 0;
			var xArr = new Array();
			var freqArr = new Array();
			var hasArr = make2DArr(mainArr[xLabel].length);
			freqArr[cnt] = 1;
			hasArr[cnt][0] = 0;
			xArr[cnt++] = mainArr[xLabel][0];
			for(i = 1 ; i < mainArr[xLabel].length ; i++)
        	{
        		for(j = 0 ; j < xArr.length ; j ++)
        		{
        			if(xArr[j] == mainArr[xLabel][i])
        			{
        				hasArr[j].push(i);
        				//isSelected[i][id] = histUpdate(this, j);
        				freqArr[j] ++; 
        				break;
        			}
        		}        		
        		if(j == xArr.length)
        		{
        			freqArr[j] = 1;
        			hasArr[j].push(i);
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
			 //check the fixpoint.
			this.fixPoint = 0;
			if(this.bin.toString().indexOf('.') != -1)
			{
				this.fixPoint = this.bin.toString().substring(this.bin.toString().indexOf('.')+1, this.bin.toString().length).length;
			}
			
			var temp = findMaxMinValue(mainArr[xLabel]);
			var max = temp.max;
			var min = temp.min;
			var freqTmp = (min > 0 ) ? new Array(parseInt((max)/this.bin)+1) :  new Array(parseInt((max - min)/this.bin)+1); 
        	var hasTmp = (min > 0 ) ? make2DArr(parseInt((max)/this.bin)+1) : make2DArr(parseInt((max - min)/this.bin)+1);             	
        	var upTmp = new Array(mainArr[xLabel].length);
        	var cnt = 0;
        	for(var i = 0 ; i < freqTmp.length ; i ++ )
        	{
        		freqTmp[i] = 0; 
        	}
        	
        	for(var i = 0 ; i < mainArr[xLabel].length ; i++){
        		if(min < 0)
        		{
        			cnt = parseInt((mainArr[xLabel][i]+Math.abs(min))/this.bin);
        		}else{
        			cnt = parseInt(mainArr[xLabel][i]/this.bin);
        		}
        		freqTmp[cnt] ++ ;
        		hasTmp[cnt].push(i);
        		upTmp[i] = cnt;
        	}
        	for(var firstcnt = 0 ; firstcnt < freqTmp.length ; firstcnt++) 	            	
        	{	            		
        		if(freqTmp[firstcnt] != 0)
        		{
        			break;
        		}
        	}
        	for(var lastcnt = freqTmp.length-1 ; lastcnt > -1  ;lastcnt--)            	
        	{
        		if(freqTmp[lastcnt] != 0)
        		{
        			break;
        		}
        	}
        	var cnt = 0;
        	var freqArr = new Array(lastcnt-firstcnt+1);
        	var hasArr = make2DArr(lastcnt-firstcnt+1);
        	for(var i = firstcnt ; i < lastcnt + 1 ; i ++){
        		freqArr[cnt] = freqTmp[i];
        		hasArr[cnt] = hasTmp[i];
        		cnt ++;
        	}
        	this.freqArr = freqArr;
        	var temp1 = (min > 0 ) ? ((-1)*this.bin + firstcnt*this.bin).toFixed(this.fixPoint) : ((1)*this.bin + firstcnt*this.bin -Math.abs(min)).toFixed(this.fixPoint);
        	var temp2 = (min > 0 ) ? ((lastcnt-firstcnt + 2)*this.bin).toFixed(this.fixPoint) : ((lastcnt-firstcnt + 3 - 1)*this.bin + firstcnt*this.bin -Math.abs(min)).toFixed(this.fixPoint); 
        	this.xArr = [temp1, temp2];
        	alert(max);
        	var temp = findMaxMinValue(freqArr);
			this.yArr = [0, temp.max];
			this.hasArr = hasArr;
		}
	}
})();

function histObjUpdate(obj)
{
	return function(select, id){
				// if node is not hidden.
				if(obj.isSelected[id][0] != 2){
					if(select == 0 && obj.isSelected[id][0] == 1) // unselect
					for(var i = 0 ; i < obj.isSelected[id].length ; i ++){
						obj.isSelected[id][i](select);
					}
				}
				
	};
}

var Hist = {};
(function() {	
	Hist = function(plotObject, histArr) {
		this._type = 'hist';
		this.id = histArr.id;
		//this._labelArr = mainArr.labelArr; //localize later
		//objArr[mainArr.id-1] = this;
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
		this.stage = plotObject.stage;
		this.draw(plotObject, histArr);
		histArr.id ++;
    };
	Hist.prototype = {
			draw : function(plotObject, histArr) {
				this.color = -1;
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
								fill: 'green',
								stroke: 'black',						
								opacity : 0.5,
								selected : 0,
								selectCnt : 0,
								info : "Node : "+cnt+"\r\n"+"Frequency : " + histArr.freqArr[cnt],
								hasArr : histArr.hasArr[cnt],
								offset: {x: this.barWidth/2, y: histArr.freqArr[cnt]*plotObject.height/plotObject.yMax/2},
							});
		            	}
				}
				setTooltip(this);
				MakeMainLabel(this, plotObject, "ddd", "ddd");
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

