var MakeBoxObj = {};
(function() {
	
	MakeBoxObj = function(dataObj, xLabel, yLabel, optionObj) {
		
		// check y is continuous.
		if(dataObj[yLabel].isDiscrete == true){
			alert("y should be continuous. cannot be drawn box graph!");
			return;
		}
		
		// check whether x is continuous or not, and collect elements. 
		
		if(dataObj[xLabel].isDiscrete == true){
			// discrete.
			var isDiscrete = true;
			var boxNum = dataObj[xLabel].index.length;
			var boxNumDataArr = make2DArr(boxNum);
			// push elements into each box.
			for(var i = 0 ; i < dataObj[xLabel].length ; i ++){
				boxNumDataArr[dataObj[xLabel][i]].push(dataObj[yLabel][i]);
			}			
		}else{
			var isDiscrete = false;
			var boxNum = 1;
			var boxNumDataArr = new Array()
			boxNumDataArr[0] = dataObj[yLabel];
		}
		this.xLabel = xLabel;
		this.yLabel = yLabel;
		this[xLabel] = dataObj[xLabel];
		this[yLabel] = dataObj[yLabel];
		// make tags.
		this.x = new Array();
		this.y = new Array();

		this.median = new Array();
		this.q1 = new Array();
		this.q3 = new Array();
		this.upperFence = new Array();
		this.lowerFence = new Array();
		this.isOutlier = new Array();
		var hasArr = new Array();
		var stableSort = function(dataA, dataB){
		    if (dataA.a == dataB.a) return dataA.b > dataB.b ? 1 : -1;
		    if (dataA.a > dataB.a) return 1;
		    return -1;
		};		
		// calculate tags.
		var nodeCnt = 0;
		for(var i = 0 ; i < boxNum ; i ++){
			// copy value of array.
			var tempArr = boxNumDataArr[i].slice(0);
			var tempDataNumberArr = new Array();
			var outliers = new Array();
			var outliersDataNumber = new Array();			
			
			for(j = 0 ; j < tempArr.length; j ++){
				tempArr[j] = {a: tempArr[j], b: j};
			}
			// sort data
			tempArr.sort(stableSort);		
			
			for(var j = 0 ; j < tempArr.length ; j ++){
				tempDataNumberArr[j] = tempArr[j].b;
				tempArr[j] = tempArr[j].a;
			}
			
			// get values which are needed to draw box.
			var q3 = findQuartile(tempArr, 3);
			var median = findQuartile(tempArr, 2);
			var q1 = findQuartile(tempArr, 1);
			// calculate upper fence.
			var tmpUpFence = findMaxBelowFence(tempArr, q1, q3);
			var upperFence = tmpUpFence.fence;
			var upperFenceNumber = tmpUpFence.fenceNumber;
			// extract upper outliers.
			for(var j = upperFenceNumber + 1 ; j < tempArr.length ; j ++){
				outliers.push(tempArr[j]);
				outliersDataNumber.push(tempDataNumberArr[j]);
			}
			// calculate below fence.
			var tmpDownFence = findMinAboveFence(tempArr, q1, q3);
			var lowerFence = tmpDownFence.fence;
			var lowerFenceNumber = tmpDownFence.fenceNumber;
			// extract upper outliers.
			for(var j = 0 ; j < lowerFenceNumber ; j ++){
				outliers.push(tempArr[j]);
				outliersDataNumber.push(tempDataNumberArr[j]);
			}
			
			//set tag and hasArr with box data.
			this.median[nodeCnt] = median;
			this.isOutlier[nodeCnt] = false;
			this.q1[nodeCnt] = q1;
			this.q3[nodeCnt] = q3;
			this.upperFence[nodeCnt] = upperFence;
			this.lowerFence[nodeCnt] = lowerFence;
			this.x[nodeCnt] = i;
			this.y[nodeCnt] = q3;
			// save hasArr.
			hasArr[nodeCnt] = new Array();
			for(var j = lowerFenceNumber ; j < upperFenceNumber + 1 ; j ++){
				hasArr[nodeCnt].push(tempDataNumberArr[j]);
			}
			nodeCnt ++;
			//set tag and hasArr with outlier data.
			for(var j = 0 ; j < outliers.length ; j ++){
				this.median[nodeCnt] = 0;
				this.isOutlier[nodeCnt] = true;
				this.q1[nodeCnt] = 0;
				this.q3[nodeCnt] = 0;
				this.upperFence[nodeCnt] = 0;
				this.lowerFence[nodeCnt] = 0;
				this.x[nodeCnt] = i;
				this.y[nodeCnt] = outliers[j];
				hasArr[nodeCnt] = new Array();
				hasArr[nodeCnt] = outliersDataNumber[j];
				nodeCnt ++;
			}
		}
		
		// event set
		var p2cArr = new Array(dataObj[xLabel].length);
		var isSelected = make2DArr(nodeCnt.length);
		for(var i = 0 ; i < nodeCnt.length ; i ++){
			isSelected[i][0] = 0;
			for(var j = 0 ; j < hasArr[i].length ; j ++){
				p2cArr[hasArr[i][j]] = i;
			}
		}
		this.$id = 1;
		this._type = 'boxObj';
		this.$isSelected = isSelected;
		birthReport(dataObj, this, p2cArr, hasArr);
	}
})();
// find fence.
function findMaxBelowFence(Data, q1, q3)
{
    var iqr = q3 - q1;    
    var fence = q3 + 1.5*iqr;
    var fenceNumber;
    var outliers = new Array();
    var cnt = 0;
    var maxValue = q3;
    for(var i = 0 ; i < Data.length ; i ++){
    	if(Data[i] > maxValue && Data[i] <= fence){
    		maxValue = Data[i];
    		fenceNumber = i;
    	}
	}
	return {fence : maxValue, fenceNumber: fenceNumber};
}
function findMinAboveFence(Data, q1, q3)
{
    var iqr = q3 - q1;    
    var fence = q1 - 1.5*iqr;
    var fenceNumber;
    var outliers = new Array();
    var cnt = 0;
    var minValue = q1;
    for(var i = 0 ; i < Data.length ; i ++){
    	if(Data[i] < minValue && Data[i] >= fence){
    		minValue = Data[i];
    		fenceNumber = i;
    	}
	}
    return {fence : minValue, fenceNumber: fenceNumber};
}
/**  find q1, q2, median  **/
// _th = 1 -> q1.
// _th = 2 -> median.
// _th = 3 -> q3.
function findQuartile(Data, _th)
{     
    var p = _th/4;
    var n = Data.length;
    var j = parseInt(n*p);
    var g = n*p - j;
    if(g == 0){
        return (Data[j-1] + Data[j]) / 2;
    }else{ //g > 0
        return Data[j];
    }
    
}
/**  find q1, q2, median end  **/
var Box = {};
(function() {
	
	Box = function(axisObj, dataObj, optionObj) {
		this._init(axisObj, dataObj, optionObj);
		this._draw(axisObj, dataObj, optionObj);
	};
	Box.prototype = {
		_init: function(axisObj, dataObj, optionObj) {
			this.dataObj = dataObj;
			this.dataId = dataObj.$id;
			this.graphId = axisObj.numberOfGraph;
			this.radius = (optionObj.radius == undefined) ? (2) : (optionObj.radius); // default radius is 2
			// set the base color.
			if(optionObj.baseColor != undefined){
				this.baseColor = optionObj.baseColor;
			}else{
				this.baseColor = 'green';
			}
		},
		_draw: function(axisObj, dataObj, optionObj) {
			var median = axisObj._getPixelY(dataObj.median);
			var isOutlier = dataObj.isOutlier;
			var q1 = axisObj._getPixelY(dataObj.q1);
			alert(q1);
			var q3 = axisObj._getPixelY(dataObj.q3);
			var upperFence = axisObj._getPixelY(dataObj.upperFence);
			var lowerFence = axisObj._getPixelY(dataObj.lowerFence);
			var x = axisObj._getPixelX(dataObj.x);
			var y = axisObj._getPixelY(dataObj.y);
			var width = (axisObj.isXDiscrete == true) ? axisObj.xbarWidth : axisObj.width - 20;
			this.node = new Array();
			for(var i = 0 ; i < median.length ; i ++){
				if(isOutlier[i] == false){
					var IQR = q1[i] - q3[i];
					var upFence = IQR + upperFence[i] - q3[i];
					var loFence = IQR + lowerFence[i] - q1[i];
					var med = median[i] - q3[i];
					this.node[i] =  new Kinetic.Shape({
				        x: (axisObj.isXDiscrete == true) ?  x[i] : axisObj._getPixelX((axisObj.xMax - axisObj.xMin)/2),
				        y: axisObj.height + axisObj.plotYMargin - IQR,
				        fill: this.baseColor,
				        strokeWidth: 2,
				        // a Kinetic.Canvas renderer is passed into the drawFunc function
				        drawFunc: function(canvas) {
				          var context = canvas.getContext();
				          context.beginPath();
				          context.rect(0, 0, width, IQR); // (0, 0, width, q3 - q1)
				          context.moveTo(width/2, 0); // (width/2, 0)
				          context.lineTo(width/2, upFence);  // (width/2, upperFence)
				          context.moveTo(width/2, IQR); // (width/2, q3 - q1)
				          context.lineTo(width/2, loFence);  // (width/2, lowerFence)
				          context.moveTo(0, med);	// (0, median)
				          context.lineTo(width, med); // (width, median)
				          context.closePath();
				          canvas.fillStroke(this);
				        },
				        offset:{x: width/2, y:0}
				     });
				}else{
					this.node[i] = new Kinetic.Circle({
						name: i,
						x: (axisObj.isXDiscrete == true) ?  x[i] : axisObj._getPixelX((axisObj.xMax - axisObj.xMin)/2),
						y: y[i],
						radius: this.radius,
						stroke: this.baseColor,
						fill: this.baseColor,
						selected: 0,
						opacity: 0.5,
						info: "Node: " + i + "\r\n" + getNodeinfo(dataObj, i)
					});
				}
				
			}
			this.dataLayer = new Kinetic.Layer();	
        	for(var i = 0 ; i < this.node.length ; i ++){
				this.dataLayer.add(this.node[i]);
			}
        	//add layer
			axisObj.stage.add(this.dataLayer);
		}
	};
})();


var Box2 = {};    

(function() {    
    
    Box2 = function(id, dataArr, optionObj) {
        this._type = 'box';
        this._id = id;
        this._labelArr = labelArr; //localize later
        objArr[id-1] = this;
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};        
		this._init(id, dataArr, optionObj); 
    };
    Box2.prototype = {
            
            _init: function(id, dataArr, optionObj){
            	//set plot variables.
    			setPlotVariable(this, optionObj);
    			
    			//alert(this.x);
        		this.color = this.x;
        		var tmpSetColor =  setColor(dataArr[this.color]);
				var colors = tmpSetColor.colors;
				var mainValueArr = tmpSetColor.mainValueArr;
				var tmpColorArr = tmpSetColor.tmpColorArr;

	            //set the legend text.
	            if(optionObj.legend !=undefined){
	            	var legendChk = optionObj.legend.toLowerCase();
	  	            if( legendChk == 'right' || legendChk == 'left' || legendChk == 'topright' || legendChk == 'topleft' || legendChk == 'default' ){	            		
	  	            		 this.legend = optionObj.legend;
	  	            }
	            }
	            if(this.legend != undefined){
	            	// legend position set is just for once.
	            	setLegendPosition(this);
	            	// making legend.
	            	setLegendMake(this, mainValueArr, colors);
					// plotXMargin change. This is just for once.
					if(this.legend == 'topleft' ||this.legend == 'left'){
						this.plotXMargin = this.plotXMargin + this.legendGroup.getWidth() + this.plotLength * 4;
					}
	            }
    			
    			
    			
                var nodeX = new Array(dataArr[this.x].length);
                this.xTick= (optionObj.xTick==undefined)?(5):(optionObj.xTick);
                var xTmp = boxMakeAxisArr(dataArr, this.width, this.x, this.xTick);  
                nodeX = xTmp.node;
                this.xPlotArr = xTmp.plotArr;
                
                var nodeY = new Array(dataArr[this.y].length);
                this.yTick= (optionObj.yTick==undefined)?(5):(optionObj.yTick); //default y ticks is 5                 
                var yTmp = boxMakeAxisArr(dataArr, this.height, this.y, this.yTick);                
                nodeY = yTmp.node;
                this.yPlotArr = yTmp.plotArr;
            
                var outliersArrLength = 0;
                
                if(isDiscrete[this.x] == true || isDiscrete[this.y] == true)//when xMain or yMain is discrete, xMain and yMain sort and assign what is what/////////////////////////////////////////////////
                {
                	var stableSort = function(a,b) { //stable sort is needed because Chrome does not support stable sort.
  	                    if (a.a === b.a) return a.stableSortKey > b.stableSortKey ? 1 : -1; 
  	                    if (a.a > b.a) return 1;
  	                    return -1;
  	                };
  	                
	                var xMainValueArr = new Array(); //mainValueArr>>> name change to 
	                var cnt=0;
	                var sortedXMainArr = new Array();                    
	                for(var i=0; i<dataArr[this.x].length; i++){        
	                    sortedXMainArr[i] = { //b is for saving original index.
	                            a : dataArr[this.x][i],
	                            b : i
	                    };        
	                }     	              
	                for (i = 0; i < sortedXMainArr.length; i++) {                     
	                    sortedXMainArr[i].stableSortKey = i;                           
	                }       
	                sortedXMainArr.sort(stableSort); //sort stably xMainArr	
	                for(var i=0; i<sortedXMainArr.length; i++){        
	                    if(i==0){
	                        xMainValueArr[cnt]=sortedXMainArr[0].a;	                      
	                    }else{
	                        if(sortedXMainArr[i].a==sortedXMainArr[i-1].a){
	                        }else{
	                            cnt++;
	                            xMainValueArr[cnt]=sortedXMainArr[i].a;
	                        }
	                    }
	                }
	                 
	                var yMainValueArr = new Array(); //mainValueArr>>> name change to 
	             	var cnt=0;
	             	var sortedYMainArr = new Array();                    
	             	for(var i=0; i<dataArr[this.y].length; i++){        
	             	    sortedYMainArr[i] = {
	             	            a : dataArr[this.y][i],
	             	            b : i
	             	    };        
	             	}     
	             	for (i = 0; i < sortedYMainArr.length; i++) {                     
	             	    sortedYMainArr[i].stableSortKey = i;                           
	             	}       
	             	sortedYMainArr.sort(stableSort); //sort stably colorArr (temporarily saved in sortedColorArr)	             	
	             	 for(var i=0; i<sortedYMainArr.length; i++){        
	             	    if(i==0){
	             	        yMainValueArr[cnt]=sortedYMainArr[0].a;
	             	    }else{
	             	        if(sortedYMainArr[i].a==sortedYMainArr[i-1].a){	  
	             	        }else{
	             	            cnt++;
	             	            yMainValueArr[cnt]=sortedYMainArr[i].a;
	             	        }
	             	    }
	             	} 
	                
	            }
                
                if(isDiscrete[this.y] == false)//////////y con/////////
                { 
                	if(isDiscrete[this.x] == true)//////////x discon,
                	{ 
                	    var boxHasArr = make2DArr(xMainValueArr.length);
                	    
                	    var j=0;
                	    boxHasArr[0][0] = sortedXMainArr[0].b;
                	    for(var i=1; i<sortedXMainArr.length; i++){
                	        if(sortedXMainArr[i].a != sortedXMainArr[i-1].a){
                	            j++;
                	        }
                	        boxHasArr[j].push(sortedXMainArr[i].b);
                	  //      isSelected[sortedXMainArr[i].b].push(boxUpdate(this, j));
                	    }
                	    //boxHasArr has node number, valueOfHasArr has node value itself
                	    var valueOfHasArr = make2DArr(boxHasArr.length);
                	    for(var k=0; k<boxHasArr.length; k++){
                	         var j=0;
                	         
                	         for(var i=0; i<dataArr[this.y].length; i++)
                	         {    
                	             if(i==boxHasArr[k][j] )
                	             {   
                	                 valueOfHasArr[k].push(dataArr[this.y][i]);
                	                 j++;
                	             }
                	         }
                	         valueOfHasArr[k].sort(function (a, b){ return (a-b);});                
                	    }
                	}else{    //////////x con,
                		
                	    var xMainValueArr = new Array();
                		xMainValueArr[0] = 'ThisIsContinuousXData';
                		var boxHasArr = make2DArr(xMainValueArr.length);
                		for(var i=0; i<dataArr[this.y].length; i++){
                			boxHasArr[0][i] = i;
                		}
                		//	alert('boxHasArr : '+boxHasArr[0] );
                	    var sortedYMainArr = new Array();                    
                	    for(var i=0; i<dataArr[this.y].length; i++){        
                	        sortedYMainArr[i]=dataArr[this.y][i]
                	    }  
                	    sortedYMainArr.sort(function (a, b){ return (a-b);});        
                	}
                    
                    var max = new Array();
                    var min = new Array();
                    var median = new Array();
                    var q3 = new Array();
                    var q1 = new Array();
                    var iqr = new Array();
                    var maxBelowFence = new Array();
                    var minAboveFence = new Array();
                    var maxOutliersArr = new Array();
                    var minOutliersArr = new Array();
                    var outliersArr = new Array();
                    var cnt1 = 0;
                    this.boxWidth = new Array();
                    
                    for(var i=0; i<xMainValueArr.length; i++){
                    	if(isDiscrete[this.x] == true)
				 	    {
                    		max[i] = findMaxValue(valueOfHasArr[i]);
                    		min[i] = findMinValue(valueOfHasArr[i]);
                    		q3[i] = findQuartile(valueOfHasArr[i], 3);
                    		median[i] = findQuartile(valueOfHasArr[i], 2);
                    		q1[i] = findQuartile(valueOfHasArr[i], 1);
                    	}else{
                    		max[i] = findMaxValue(sortedYMainArr);
                    		min[i] = findMinValue(sortedYMainArr);
                    		q3[i] = findQuartile(sortedYMainArr, 3);
                    		median[i] = findQuartile(sortedYMainArr, 2);
                    		q1[i] = findQuartile(sortedYMainArr, 1);
                    	}
                    	iqr[i] = q3[i] - q1[i];
                    	var tmpFindMaxBelowFence = findMaxBelowFence(dataArr[this.y], boxHasArr[i], q1[i], q3[i]);
						var tmpFindMinAboveFence = findMinAboveFence(dataArr[this.y], boxHasArr[i], q1[i], q3[i]);
						maxBelowFence[i] = tmpFindMaxBelowFence.max;
						minAboveFence[i] = tmpFindMinAboveFence.min;
						maxOutliersArr[i] = tmpFindMaxBelowFence.outliers;
						minOutliersArr[i] = tmpFindMinAboveFence.outliers;
						outliersArr[i] = maxOutliersArr[i].concat(minOutliersArr[i]);
						for(j=0; j<outliersArr[i].length; j++) //original boxHasArr contains all nodes, we need to remove outliers from it
						{
							boxHasArr[i].splice(boxHasArr[i].indexOf(outliersArr[i][j]),1); //indexOf doesn't work IE8 or below.
							//isSelected[outliersArr[i][j]].push(boxUpdate(this, xMainValueArr.length+j+cnt1)); //update "outliers" into isSelected 
							isSelected[outliersArr[i][j]][id] = boxUpdate(this, xMainValueArr.length+j+cnt1);
						}
					    cnt1=cnt1+outliersArr[i].length;	  
						for(var j=0; j<boxHasArr[i].length; j++) //update "boxHasArr without outliers" into isSelected 
						{
						    //isSelected[boxHasArr[i][j]].push(boxUpdate(this, i));
							isSelected[boxHasArr[i][j]][id] = boxUpdate(this, i);
						}	                    
                    }  
                    outliersArrLength = cnt1; //count total number of outliers for numbering node later
                   
                    if(isDiscrete[this.x] == true)//x discon > fixed size barWidth
                    { 	                    
	            	    this.boxWidth[0] = (optionObj.boxWidth==undefined)?(this.width/xMainValueArr.length*0.7):(optionObj.boxWidth); 
                    }else//x con > barWidth is equal to the range of x value
                    { 
                        var xMax = findMaxValue(dataArr[this.x]);
                        var xMin = findMinValue(dataArr[this.x]);
                        var xTick = 5;
                        var xTickRange = (xMax-xMin )/xTick;                
                        var xTmp = Math.ceil( Math.log(xTickRange) / Math.log(10));
                        xTickRange = setTickRange(xTmp, xTickRange);
                        xMax = xTickRange * Math.ceil(xMax/xTickRange);              
                        xMin = xTickRange * Math.floor(xMin/xTickRange);
                        this.boxWidth[0] = this.width*(findMaxValue(dataArr[this.x])-findMinValue(dataArr[this.x]))/(xMax-xMin);
                	 }
                
                }
                
                if(isDiscrete[this.x] == true)//////////x discon, y con/////////
	            { 
	               
	            }//discrete//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                else{//from here, cont X ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                	
                	 if(isDiscrete[this.y]==false){//////////x con. y con/////////
                	
                	
                	 }
                	/* else if(isDiscrete[this.y]==true){//con x, y discrete//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	                	
                		
	                  var boxHasArr = make2DArr(yMainValueArr.length);
		                
		                var j=0;
		                boxHasArr[0][0] = sortedYMainArr[0].b;
		                for(var i=1; i<sortedYMainArr.length; i++){
		                    if(sortedYMainArr[i].a != sortedYMainArr[i-1].a){
		                        j++;
		                    }
		                    boxHasArr[j].push(sortedYMainArr[i].b);
		                }		   
		                //boxHasArr has node number, valueOfHasArr has node value itself
		                var valueOfHasArr = make2DArr(boxHasArr.length);
		                for(var k=0; k<boxHasArr.length; k++){
		                     var j=0;
		                     
		                     for(var i=0; i<dataArr[this.x].length; i++)
		                     {    
		                         if(i==boxHasArr[k][j] )
		                         {   
		                             valueOfHasArr[k].push(dataArr[this.x][i]);
		                             j++;
		                         }
		                     }
		                     valueOfHasArr[k].sort(function (a, b){ return (a-b);});                
		                }
		                
		                var max = new Array();
		                var min = new Array();
		                var median = new Array();
		                var q3 = new Array();
		                var q1 = new Array();
		                var iqr = new Array();
		                var maxBelowFence = new Array();
		                var minAboveFence = new Array();
		                var maxOutliersArr = new Array();
		                var minOutliersArr = new Array();
		                var outliersArr = new Array();
		                for(var i=0; i<yMainValueArr.length; i++){
		                    max[i] = findMaxValue(valueOfHasArr[i]);
		                    min[i] = findMinValue(valueOfHasArr[i]);
		                    q3[i] = findQuartile(valueOfHasArr[i], 3);
		                    median[i] = findQuartile(valueOfHasArr[i], 2);
		                    q1[i] = findQuartile(valueOfHasArr[i], 1);
		                    iqr[i] = q3[i] - q1[i];
		                    var tmpFindMaxBelowFence = findMaxBelowFence(dataArr[this.x], boxHasArr[i], q1[i], q3[i]);
		                    var tmpFindMinAboveFence = findMinAboveFence(dataArr[this.x], boxHasArr[i], q1[i], q3[i]);
		                    maxBelowFence[i] = tmpFindMaxBelowFence.max;
		                    minAboveFence[i] = tmpFindMinAboveFence.min;
		                    maxOutliersArr[i] = tmpFindMaxBelowFence.outliers;
		                    minOutliersArr[i] = tmpFindMinAboveFence.outliers;
		                    outliersArr[i] = maxOutliersArr[i].concat(minOutliersArr[i]);
		                }

		                var xMax = findMaxValue(dataArr[this.x]);
		                var xMin = findMinValue(dataArr[this.x]);
		                var xTick = 5;
		                var xTickRange = (xMax-xMin )/xTick;                
		                var xTmp = Math.ceil( Math.log(xTickRange) / Math.log(10));
		                xTickRange = setTickRange(xTmp, xTickRange);
		                xMax = xTickRange * Math.ceil(xMax/xTickRange);              
		                xMin = xTickRange * Math.floor(xMin/xTickRange);
		                this.boxWidth = new Array();
		                for(var i=0; i<yMainValueArr.length; i++){
		                	this.boxWidth[i] = this.width*(findMaxValue(valueOfHasArr[i])-findMinValue(valueOfHasArr[i]))/(xMax-xMin);
		                }
	                }//conx , y discrete//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	              */
                }//from here, cont X end///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            	
	            var tooltipTextGetInfo = new Array();
				for(var i = 0; i < dataArr[this.x].length ; i++)
				{
					tooltipTextGetInfo[i]=labelArr[0]+" : " + dataArr[0][i]+ "\r\n" ;
					for(var j=1; j< labelArr.length ; j++){
						tooltipTextGetInfo[i]=tooltipTextGetInfo[i]+ labelArr[j]+" : " + dataArr[j][i]+ "\r\n" ;
					}
				}				   
				
				///////////////////////////////////////////////////////////////////////////////////////////////////////
	            ///////////////////////////////////Make Data Structure of nodes and essential arrays//////////////////////////
				///////////////////////////////////////////////////////////////////////////////////////////////////////
				this.node = new Array();
	            this.outlierNode = new Array();
	            var yMax = findMaxValue(dataArr[this.y]);
	            var yMin = findMinValue(dataArr[this.y]);
	            var tickRange = (yMax-yMin )/this.yTick;                
	            var tmp = Math.ceil( Math.log(tickRange) / Math.log(10));
	            var outlierHasArr = new Array();
	            tickRange = setTickRange(tmp, tickRange);
	            yMax = tickRange * Math.ceil(yMax/tickRange);              
	            yMin = tickRange * Math.floor(yMin/tickRange);
	            var cnt=0;
	            var medianXPos =0;
	            var medianYpos =0;
	            
				if(isDiscrete[this.y] ==false){
					var mainValueArrLength = xMainValueArr.length;					
				}else{
					var mainValueArrLength = yMainValueArr.length;
				}
	            for(var i = 0; i < mainValueArrLength ; i++) //for discontinuous data, this.xPlotArr.length is used, for continuous data, it should be just 1.
	            {
	            	if(isDiscrete[this.y] ==false){   
		                medianXPos = this.plotXMargin + (i+1) * (this.width) / (mainValueArrLength+1);
		                medianYPos = this.height +this.plotYMargin - (median[i]-yMin)*this.height/(yMax - yMin);  
	            	}else{    
		                if(isDiscrete[this.x] == false){//  x con y discon
		        			medianXPos = this.plotXMargin + (min[i]-xMin)*this.width/(xMax - xMin)+this.boxWidth[i]/2;  
		        			//outliersArr ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
		        		}else{	            		//x discon y discon //>>bug
		        			medianXPos = this.plotXMargin + (i+1) * (this.width) / (xMainValueArr.length+1);//this.plotXMargin +12;// + this.width*(findMaxValue(dataArr[this.x])-findMinValue(dataArr[this.x]))/(xMax-xMin);   
		        	    		this.boxWidth[i]=this.boxWidth[0];
		        	    		
	        	    	}
	        	    	medianYPos = this.height +this.plotYMargin - (i+1) * (this.height) / (yMainValueArr.length+1);
	            	}	                
	         
	                this.node[i] = new Kinetic.Rect({  	
	                    name : i,
	                    freq: boxHasArr[i].length,
	                    x: medianXPos,
	                    y: medianYPos-(q3[i]-median[i])*this.height/(yMax - yMin), 
	                    stroke : 'black',
	                    fill : (isDiscrete[this.x] == true)?getLegendColor(i ,colors, mainValueArr):'green',
	                    radius : this.radius,
	                    width:  this.boxWidth[0],
	                    height: (q3[i]-q1[i])*this.height/(yMax - yMin),
	                    opacity : 0.5,
	                    offset : {x: this.boxWidth[0]/2},
	                    hidden : 0,
	                    selected : 0,
	                    selectCnt : 0,
	                    info :  "boxNode : "+i+"\r\n"+"Frequency : "+boxHasArr[i].length,
	                    hasArr : boxHasArr[i]
	                });         
	                for(var j = 0; j < outliersArr[i].length ; j++) //for discontinuous data, this.xPlotArr.length is used, for continuous data, it should be just 1.
	                {
	                    this.node[mainValueArrLength+j+cnt] = new Kinetic.Circle({
	                        name : mainValueArrLength+j+cnt,
	                        isOutlier : true,
	                        x: this.plotXMargin + (i+1) * (this.width) / (mainValueArrLength+1), //////////////////////////////////???????????????????????????
	                        y: this.height +this.plotYMargin - (dataArr[this.y][outliersArr[i][j]]-yMin)*this.height/(yMax - yMin), //this.median[i],
							radius: this.radius,
							stroke: (isDiscrete[this.x] == true)?getLegendColor(i ,colors, mainValueArr):'green',
							strokeWidth: 1,
							opacity : 0.5,
	                        fill : (isDiscrete[this.x] == true)?getLegendColor(i ,colors, mainValueArr):'green',
	                        hidden : 0,
	                        selected : 0,
	                        info : "Node : "+outliersArr[i][j]+"\r\nboxNode : "+(mainValueArrLength+j+cnt)+"\r\n"+tooltipTextGetInfo[outliersArr[i][j]]+"\r\n",
	                        hasArr : outliersArr[i][j]
	                    });   
	                } 
	                cnt=cnt+outliersArr[i].length;	
	                 this.node[mainValueArrLength+outliersArrLength+i*3]= new Kinetic.Line({
	                    x: medianXPos,
	                    y: medianYPos,
	                    points: [0, 0, this.boxWidth[0], 0],
	                    opacity : 0.5,
	                    offset : {x: this.boxWidth[0]/2},
	                    stroke: 'black',
	                    strokeWidth: '4'
	                });        
	             //    this.node[mainValueArrLength+outliersArrLength+i*3].moveToBottom();
	                this.node[mainValueArrLength+outliersArrLength+i*3+1]= new Kinetic.Line({
	                    x: medianXPos,
	                    y: medianYPos,
	                    points: [    0,  (median[i]-maxBelowFence[i])*this.height/(yMax - yMin),
	                                 0, (median[i]-q3[i])*this.height/(yMax - yMin)],
	                    opacity : 0.5,
	                    stroke: 'black'
	                });    
	                this.node[mainValueArrLength+outliersArrLength+i*3+2]= new Kinetic.Line({
	                    x: medianXPos,
	                    y: medianYPos,
	                    points: [    0, (median[i]-q1[i])*this.height/(yMax - yMin),
	                                 0, (median[i]-minAboveFence[i])*this.height/(yMax - yMin)],
	                    opacity : 0.5,
	                    stroke: 'black'
	                });    
	            } 
            },
            doIt: function() { 
                alert('do it'); 
            },
            draw: function(id){    
            	
            	document.getElementById('boxContainer'+id).onmousemove =getCoords;
				document.getElementById('boxContainer'+id).onclick = function() {
			        document.getElementById('regcoords');
			    };
                //draw plot
			    var tmpWidth=0;
				if(this.legend=='left' || this.legend=='topleft'){
					tmpWidth =  this.width+this.plotXMargin+this.legendGroup.getWidth();
				}else if(this.legend=='right' || this.legend=='topright' || this.legend){
					tmpWidth =  this.width+this.plotXMargin*2+this.legendGroup.getWidth();
				}else{
					tmpWidth =  this.width+this.plotXMargin*2;
				}				
				this.stage = new Kinetic.Stage({            
					container: 'boxContainer'+id,            
					width : tmpWidth,							
					height: this.height+this.plotYMargin*2 
				});
                this.plotLayer = new Kinetic.Layer();
                this.plotRect = new Kinetic.Rect({
                    name : "baseRect",
                    x: this.plotXMargin-this.plotLength,
                    y: this.plotYMargin-this.plotLength,
                    width: this.width+2*this.plotLength,
                    height: this.height+2*this.plotLength,
                    stroke: 'black',
                    strokeWidth: 2
                });       
                this.plotLayer.add(this.plotRect);   
                this.xLine = new Array();
                this.xText = new Array();
                for(var i=0; i<this.xPlotArr.length; i++)
                {
                    this.xLine[i] = new Kinetic.Line({
                        name : "xLine"+i,
                        points: [    this.plotXMargin+this.xPlotArr[i][0],
                                     this.plotYMargin+this.height+this.plotLength,
                                     this.plotXMargin+this.xPlotArr[i][0],
                                     this.plotYMargin+this.height+2*this.plotLength],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
                    this.plotLayer.add(this.xLine[i]);               
                    this.xText[i] = new Kinetic.Text({
                        name : "xText"+i,
                        x: this.plotXMargin+this.xPlotArr[i][0]-30,
                        y: this.plotYMargin+this.height+this.plotLength*2,
                        text: this.xPlotArr[i][1],
                        fontSize: this.width/40,
                        fontFamily: 'Calibri',
                        fill: 'black',
                        width: 60,
                        align: 'center'    
                    });          
                    this.plotLayer.add(this.xText[i]);            
                } 
                this.yLine = new Array();
                this.yText = new Array();
               
                for(var i=0; i< this.yPlotArr.length ; i++)
                {
                    this.yLine[i] = new Kinetic.Line({
                        points: [    this.plotXMargin-this.plotLength, 
                                     this.plotYMargin+this.height-this.yPlotArr[i][0], 
                                     this.plotXMargin-2*this.plotLength,
                                     this.plotYMargin+this.height-this.yPlotArr[i][0]],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
                    this.plotLayer.add(this.yLine[i]);       
                    this.yText[i] = new Kinetic.Text({
                        x: this.plotXMargin-this.plotLength*2-15,
                        y: this.plotYMargin+this.height-this.yPlotArr[i][0]+30,
                        text: this.yPlotArr[i][1],
                        fontSize: 15,
                        fontFamily: 'Calibri',
                        fill: 'black',
                        width: 60,
                        align: 'center',
                        rotation: (Math.PI)*3/2
                    });           
                    this.plotLayer.add(this.yText[i]);        
                }    
                this.xLabel = new Kinetic.Text({
                    name : 'xLabel',
                    x: this.plotXMargin+this.width/2,
                    y: this.plotYMargin+this.height+5*this.plotLength,
                    offset : {x: labelArr[this.x].length/2 * 10, y:0},
                    text: labelArr[this.x],
                    fontSize: 15,
                    fontStyle: 'bold',
                    fontFamily: 'Calibri',
                    fill: 'black',
                });                                   
                this.plotLayer.add(this.xLabel);
                this.yLabel = new Kinetic.Text({
                    x: this.plotXMargin-this.plotLength - 40,
                    y: this.plotYMargin+this.height/2  - 15,
                    offset : {x: labelArr[this.y].length/2 * 10},
                    text: labelArr[this.y],
                    fontSize: 15,
                    fontStyle: 'bold',
                    fontFamily: 'Calibri',
                    fill: 'black',
                    rotation: (Math.PI)*3/2
                });    
                this.plotLayer.add(this.yLabel);    
                this.mainLabel = new Kinetic.Text({
                    name : 'mainLabel',
                    x: this.plotXMargin+this.width/2, 
                    y: this.plotYMargin *0.3 ,
                    offset : {x: ('Box-and-Whisker of ' + labelArr[this.x] + ' & ' + labelArr[this.y]).length/2 * 10, y:0},
                    text: 'Box-and-Whisker of ' + labelArr[this.x] + ' & ' + labelArr[this.y],
                    fontSize: 20,
                    fontStyle: 'bold',
                    fontFamily: 'Calibri',
                    fill: 'black',
                });           
                this.plotLayer.add(this.mainLabel);
                 
                this.stage.add(this.plotLayer);
                this.plotLayer.on('mouseover mousemove dragmove', function(evt){  
                    document.body.style.cursor = "default";
                });   
                //draw node
                this.dataLayer = new Kinetic.Layer();    
                for(var i = 0 ; i < this.node.length ; i ++)
                {
                	
                    if(i % (parseInt(this.node.length/20)+1) == 0)
                    {
                        this.stage.add(this.dataLayer);
                        this.dataLayer = new Kinetic.Layer();
                    }
                    this.dataLayer.add(this.node[i]);
                    
                } 
                this.stage.add(this.dataLayer);
                
                // add tooltip
				setTooltip(this);			      
			    this.stage.add(this.tooltipLayer);   

			    //draw legend
				if(this.legend != undefined)
					this.stage.add(this.legendLayer);
            },   
            changeX: function(id, dataArr, optionObj){
				this._init(id, dataArr, optionObj);
				this.draw(id);
			},
			changeY: function(id, dataArr, optionObj){
				this._init(id, dataArr, optionObj);
				this.draw(id);
			},
            update: function(){
                alert('scatter is updated');                
            }
    };
    
})();

/*
function boxFindMaxValue(Data , index)
{
    var j=0;
    var maxValue=Data[ index[j++] ];
    for(var i=1; i<Data.length; i++)
    {    
        if(i==index[j] )
        {   
            if(Data[i] > maxValue){
                maxValue=Data[i];            
            }
            j++;
        }
    }
    return maxValue;
}
function boxFindMinValue(Data , index)
{
    var j=0;
    var minValue=Data[ index[j++] ];
    for(var i=1; i<Data.length; i++)
    {    
        if(i==index[j] )
        {   
            if(Data[i] < minValue){
                minValue=Data[i];            
            }
            j++;
        }
    }
    return minValue;
}*/



/*
function findOutliers(Data, maxBelowFence, minAboveFence)
{
    var outliersArr = new Array();    
    for(var i=1; i<Data.length; i++)
    {              
        if(Data[i] < minAboveFence || Data[i] > maxBelowFence){
            outliersArr.push(i);
        }        
    }
    return outliersArr;
}
*/
/*

function findMedianValue(array) {
      if (array.length == 0) return NaN; 
      var center = parseInt(array.length / 2); 
      if (array.length % 2 == 1) { 
        return array[center]; 
      } else {
        return (array[center - 1] + array[center]) / 2.0; 
      }
}
*/
function boxMakeAxisArr(dataArr, length, axis, tick)     //from scatter.js, so this function can be put into common.js later
{                                                        
    var node = new Array(dataArr[axis].length);
    if(isDiscrete[axis] == true)
    {        
        
        var tmp = new Array();  //the names of each content belowtmp[0] = dataArr[axis][0];
        node[0] = 0;
        for(var i = 1 ; i < dataArr[axis].length ; i++)
        {
            for(j = 0 ; j < tmp.length ; j ++)
            {
                if(tmp[j] == dataArr[axis][i])
                {
                    node[i] = j;
                    break;
                }                                
            }
            if(j == tmp.length)
            {
                node[i] = j;
                tmp.push(dataArr[axis][i]);
            }
        }    
        var plotArr = make2DArr(tmp.length);
        var diff = length / (tmp.length+1);
        tmp.sort();//only difference with scatter!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        for(var i = 1 ; i < plotArr.length+1 ; i ++)
        {
            plotArr[i-1][0] = i*diff;
            plotArr[i-1][1] = tmp[i-1];
        }    
        for(var i = 0 ; i < node.length ; i++)
        {
            node[i] = (node[i]+1)*diff;
        }
    }else{            
        
        var max = findMaxValue(dataArr[axis]);
        var min = findMinValue(dataArr[axis]);
        var tickRange = (max-min )/tick;                
        var tmp = Math.ceil( Math.log(tickRange) / Math.log(10));
        tickRange = setTickRange(tmp, tickRange);
        max = tickRange * Math.ceil(max/tickRange);              
        min = tickRange * Math.floor(min/tickRange);
        var diff = length * tickRange   / (max - min);
        plotArr = make2DArr(  Math.round ((max - min)/tickRange + 1 ));
        
        for(var i = 0 ; i < plotArr.length ; i ++)
        {
        	plotArr[i][0] = i*diff;
			if (tickRange.toString().indexOf('.') == -1){
				plotArr[i][1] = min+i*tickRange;
			}else{
				var point = tickRange.toString().substring(tickRange.toString().indexOf('.')+1,tickRange.toString().length).length;
				if(point > 3){	// for setting the resonable point
					point = 3;
				}
				plotArr[i][1] = (min+i*tickRange).toFixed(point);
			}
        }        
        for(var i = 0 ; i < node.length ; i ++)
        {
            node[i] = length* ((dataArr[axis][i]-min)) /((max - min));
        }
    }
    return { plotArr : plotArr, node : node};
}

/////////////////////////////////////////update function //////////////////////////////
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function boxUpdate(obj, id)
{
	return	function(selectOn)
				{
					//box
					if(obj.node[id].getSelected() == 1 && selectOn == 0)		//unselect
					{					
						if(obj.node[id].getIsOutlier()){//if isOutlier ==true
							obj.node[id].setStroke(obj.node[id].getFill());
							obj.node[id].setOpacity(0.5);
							obj.node[id].setScaleX(1);
							obj.node[id].setScaleY(1);
							obj.node[id].setSelected(0);
						}else{
							obj.node[id].setSelectCnt(obj.node[id].getSelectCnt() - 1);
							if(obj.node[id].getSelectCnt() == 0)
							{
								obj.node[id].setOpacity(0.5);
							//	obj.node[id].setScaleX(1);
								obj.node[id].setSelected(0);
							}
						}
					}else if(selectOn == 1){		// select							
						if(obj.node[id].getIsOutlier()){//if isOutlier ==true
							obj.node[id].setStroke('black');
							obj.node[id].setOpacity(1);
							obj.node[id].setScaleX(2);
							obj.node[id].setScaleY(2);
							obj.node[id].setSelected(1);
							obj.node[id].moveToTop();
						}else{
							obj.node[id].setSelectCnt(obj.node[id].getSelectCnt() + 1);
							//alert(obj.node[id].getSelectCnt());
							if(obj.node[id].getSelected() == 0)
							{
								obj.node[id].setOpacity(1);
							//	obj.node[id].setScaleX(1.05);
								obj.node[id].setSelected(1);
							}
						}				
					}
				};
}
////////////////////////////////////////////////////////////////////////////////////////
