/**  make hist object  **/
// optionObj can be bin, color(double).
// return : xLabel, yLebel, id, bin, xArr, yArr, freqArr, hasArr, isDiscrete, double.
var MakeHistObj = {};
function setMapping(index)
{
	return function(nodes)
		{
			var returnArr;
			if(nodes.length == undefined){
				returnArr = index[nodes];
			}else{
				for(var i = 0 ; i < nodes.length ; i ++){
					returnArr.push(index[nodes[i]]);
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
		this.bin = (optionObj.bin == undefined) ? (2) : (optionObj.bin); // default bin is 2
		this.id = 0;
		this.double = false;
		this.parent = mainArr;
		if(mainArr.child == null){
			mainArr.child = new Array();
		}
		mainArr.child.push(this);
		this.child = null;
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
        	var temp = findMaxMinValue(freqArr);
			this.yArr = [0, temp.max];
			this.hasArr = hasArr;
		}
		// check double
		if(optionObj.color != undefined){
			this.color = optionObj.color;
			if(xLabel == this.color && mainArr.isDiscrete[this.color] == true){
				this.colorArr =  makeColor_discrete(this.xArr, index);
				//var colorArr = tmp.indexArr;
				
			}else if(mainArr.isDiscrete[this.color] == true){
				//under construction.
				var tmp = setColor(mainArr[this.color], true);
				var colorArr = tmp.indexArr;
				
			}
			
			//this.colorArr = colorArr;
		}else{
			this.color = -1;
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
		
		//excute draw
		this._draw(plotObject, histArr);
		
		histArr.id ++;
    };
	Hist.prototype = {
			_draw : function(plotObject, histArr) {
				
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
		            	}
				}
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

