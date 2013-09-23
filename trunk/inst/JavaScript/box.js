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
			var boxNumDataNumArr = make2DArr(boxNum);
			// push elements into each box.
			for(var i = 0 ; i < dataObj[xLabel].length ; i ++){
				boxNumDataArr[dataObj[xLabel][i]].push(dataObj[yLabel][i]);
				boxNumDataNumArr[dataObj[xLabel][i]].push(i);
			}			
		}else{
			var isDiscrete = false;
			var boxNum = 1;
			var boxNumDataArr = new Array();
			var boxNumDataNumArr = new Array();
			boxNumDataArr[0] = dataObj[yLabel];
			boxNumDataNumArr[0] = new Array();
			for(var i = 0 ; i < dataObj[yLabel].length ; i ++){
				boxNumDataNumArr[0][i] = i;
			}
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
				tempDataNumberArr[j] = boxNumDataNumArr[i][tempArr[j].b];
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
			//alert(hasArr[nodeCnt]);
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
				hasArr[nodeCnt] = outliersDataNumber[j];
				nodeCnt ++;
			}
		}
		// event set
		var p2cArr = new Array(dataObj[xLabel].length);
		var isSelected = make2DArr(nodeCnt);
		for(var i = 0 ; i < nodeCnt ; i ++){
			isSelected[i][0] = 0;
			if(hasArr[i].length == undefined){
				p2cArr[hasArr[i]] = i;
			}else{
				for(var j = 0 ; j < hasArr[i].length ; j ++){
					p2cArr[hasArr[i][j]] = i;
				}
			}			
		}
		//alert(p2cArr[10]);
		this.$id = 1;
		this._type = 'boxObj';		
		this.$isSelected = isSelected;
		birthReport(dataObj, this, p2cArr, hasArr);
	};
	MakeBoxObj.prototype = {
		_reCalculate: function() {
			// reload data.
			var dataObj = this.parent;
			var xLabel = this.xLabel;
			var yLabel = this.yLabel;
			var optionObj = this.optionObj;
			
			if(dataObj[xLabel].isDiscrete == true){
				// discrete.
				var isDiscrete = true;
				var boxNum = dataObj[xLabel].index.length;
				var boxNumDataArr = make2DArr(boxNum);
				var boxNumDataNumArr = make2DArr(boxNum);
				// push elements into each box.
				for(var i = 0 ; i < dataObj[xLabel].length ; i ++){
					if(dataObj[xLabel][i] == undefined){
						alert(i + ", " + dataObj[xLabel][i]);
					}
					
					boxNumDataArr[dataObj[xLabel][i]].push(dataObj[yLabel][i]);
					boxNumDataNumArr[dataObj[xLabel][i]].push(i);
				}			
			}else{
				var isDiscrete = false;
				var boxNum = 1;
				var boxNumDataArr = new Array();
				var boxNumDataNumArr = new Array();
				boxNumDataArr[0] = dataObj[yLabel];
				boxNumDataNumArr[0] = new Array();
				for(var i = 0 ; i < dataObj[yLabel].length ; i ++){
					boxNumDataNumArr[0][i] = i;
				}
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
					tempDataNumberArr[j] = boxNumDataNumArr[i][tempArr[j].b];
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
				//alert(hasArr[nodeCnt]);
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
					hasArr[nodeCnt] = outliersDataNumber[j];
					nodeCnt ++;
				}
			}
			// event set
			var p2cArr = new Array(dataObj[xLabel].length);
			var isSelected = make2DArr(nodeCnt);
			for(var i = 0 ; i < nodeCnt ; i ++){
				isSelected[i][0] = 0;
				if(hasArr[i].length == undefined){
					p2cArr[hasArr[i]] = i;
				}else{
					for(var j = 0 ; j < hasArr[i].length ; j ++){
						p2cArr[hasArr[i][j]] = i;
					}
				}			
			}	
			this.$isSelected = isSelected;
			ModifyBirth(dataObj, this, p2cArr, hasArr);
		}
	};
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
			this.optionObj = optionObj;
			this.dataId = dataObj.$id;
			this.graphId = axisObj.numberOfGraph;
			this.radius = (optionObj.radius == undefined) ? (2) : (optionObj.radius); // default radius is 2
			// set the base color.
			if(optionObj.baseColor != undefined && optionObj.baseColor != 'n'){
				this.baseColor = optionObj.baseColor;
			}else{
				this.baseColor = 'green';
			}
		},
		_draw: function(axisObj, dataObj, optionObj) {
			//alert(dataObj.median[0] + ", " + dataObj.q1[0] + ", " +dataObj.q3[0] + ", " +dataObj.upperFence[0] + ", " +dataObj.lowerFence[0]  );
			var median = axisObj._getPixelY(dataObj.median);
			var isOutlier = dataObj.isOutlier;
			var q1 = axisObj._getPixelY(dataObj.q1);
			//alert(dataObj.q3);
			var q3 = axisObj._getPixelY(dataObj.q3);
			var upperFence = axisObj._getPixelY(dataObj.upperFence);
			var lowerFence = axisObj._getPixelY(dataObj.lowerFence);
			var x = axisObj._getPixelX(dataObj.x);
			var y = axisObj._getPixelY(dataObj.y);
			//alert(median[0] + ", " + q1[0] + ", " +q3[0] + ", " +upperFence[0] + ", " +lowerFence[0]  );
			var width = (axisObj.isXDiscrete == true) ? axisObj.xbarWidth : axisObj.width - 20;
			this.node = new Array();
			var cnt = 0;
			for(var i = 0 ; i < median.length ; i ++){
				if(!(y[i] == -1)){
					if(isOutlier[i] == false){
						var IQR = q1[i] - q3[i];
						var upFence = upperFence[i];
						var loFence = lowerFence[i];
						var med = median[i];
						this.node[cnt] =  new Kinetic.BoxWhisker({
							name: i,
							x: (axisObj.isXDiscrete == true) ?  x[i] : axisObj._getPixelX((axisObj.xMax + axisObj.xMin)/2),
							y:  y[i],
							strokeWidth: 2,
							width: width,
							height: IQR,
							upFence: upFence - q3[i],
							loFence: loFence - q1[i],
							med: med - q3[i],
							fill: this.baseColor,
							opacity: 0.5,
							selected: 0,
							selectCnt : 0,
							isOutlier: false,
							info: "Node: " + i + "\r\n" + "UpFence: " + dataObj.upperFence[i] + "\r\n" + "LoFence: " + dataObj.lowerFence[i] + "\r\n" + "q3: " + dataObj.q3[i] + "\r\n" + "q1: " + dataObj.q1[i] + "\r\n" + "Median: " + dataObj.median[i], 
							offset: {x: width/2, y:0}
						});
						dataObj.$isSelected[i][this.dataId] = boxUpdate(this.node[cnt]);
						cnt ++;
					}else{
						this.node[cnt] = new Kinetic.Circle({
							name: i,
							x: (axisObj.isXDiscrete == true) ?  x[i] : axisObj._getPixelX((axisObj.xMax - axisObj.xMin)/2),
							y: y[i],
							radius: this.radius,
							stroke: this.baseColor,
							fill: this.baseColor,
							selected: 0,
							selectCnt : 0,
							opacity: 0.5,
							isOutlier: true,
							info: "Node: " + i + "\r\n" + "X: " + dataObj.x[i] + "\r\n" +"Y: : " + dataObj.y[i]
						});
						dataObj.$isSelected[i][this.dataId] = boxUpdate(this.node[cnt]);
						cnt ++;
					}
				}else{
					dataObj.$isSelected[i][this.dataId] = nullUpdate(0);
				}
			}
			this.dataLayer = new Kinetic.Layer();	
        	for(var i = 0 ; i < this.node.length ; i ++){
				this.dataLayer.add(this.node[i]);
			}
        	// event add
			dataObj.refreshArr[this.dataId] = makeRefresh(axisObj.stage);
			//scatterObj.refreshArr[this.id] = makeRefresh(this.stage);
			//scatterObj.updateArr[this.id] = scatterUpdate(this.node);
        	this.firstUpdate = firstUpdate(this.dataObj);
        	this.dataLayer = new Kinetic.Layer();	
        	for(var i = 0 ; i < this.node.length ; i ++){
				this.dataLayer.add(this.node[i]);
			}
        	axisObj.graphObjArr[this.graphId] = this;
        	axisObj.dataLayerArr[this.graphId] = this.dataLayer;
			axisObj.hoverArr[this.graphId] = boxHover();
			axisObj.boxSearchArr[this.graphId] = boxBoxSearch(this);
			//add layer
			axisObj.stage.add(this.dataLayer);
		},
		_reDraw: function(axisObj) {
			var dataObj = this.dataObj;
			var optionObj = this.optionObj;
			this._draw(axisObj, dataObj, optionObj);
		}
	};
})();

//Kinetic add method with boxWhisker plot.
(function() {
	// MODIFIED
    Kinetic.BoxWhisker = function(config) {
        this.___init(config);
    };

    Kinetic.BoxWhisker.prototype = {
        ___init: function(config) {
            Kinetic.Shape.call(this, config);
            this.className = 'BoxWhisker';
        },
        drawFunc: function(context) {
            var width = this.getWidth(),
                height = this.getHeight(),
                upFence = this.getUpFence(),
                loFence = this.getLoFence(),
                med = this.getMed();
            context.beginPath();
            context.rect(0, 0, width, height);
            context.moveTo(width/2, 0); // (width/2, 0)
            context.lineTo(width/2, upFence);  // (width/2, relative upperFence)
            context.moveTo(width/2, height); // (width/2, height)
            context.lineTo(width/2, height + loFence);  // (width/2, relative lowerFence)
            context.moveTo(0, med);	// (0, relative median)
            context.lineTo(width, med); // (width, relative median)
            context.closePath();
            context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.BoxWhisker, Kinetic.Shape);    
    Kinetic.Factory.addGetterSetter(Kinetic.BoxWhisker, 'upFence', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.BoxWhisker, 'loFence', 0);
    Kinetic.Factory.addGetterSetter(Kinetic.BoxWhisker, 'med', 0);
    
 
})();

/////////////////////////////////////////update function //////////////////////////////
function boxBoxSearch(graphObj)
{
	return function(smallX, smallY, bigX, bigY)
		{
			var tmpNodeArr = new Array();
			var tmpNodeArr1 = new Array();
			if(ctrlPressed == true) {
				for(var i = 0 ; i < graphObj.node.length ; i ++){
					if(smallX <= graphObj.node[i].getX() && graphObj.node[i].getX() <= bigX && smallY <= graphObj.node[i].getY() && graphObj.node[i].getY() <= bigY){
						if(graphObj.node[i].getSelected()==1){
							tmpNodeArr.push(graphObj.node[i].getName());
						}else{
							tmpNodeArr1.push(graphObj.node[i].getName());
						}					                   
	                }
				}
				allGraphUpdate(graphObj, tmpNodeArr, 0);
				allGraphUpdate(graphObj, tmpNodeArr1, 1);
			}else{
				for(var i = 0 ; i < graphObj.node.length ; i ++){
					if(smallX <= graphObj.node[i].getX() && graphObj.node[i].getX() <= bigX && smallY <= graphObj.node[i].getY() && graphObj.node[i].getY() <= bigY){
						tmpNodeArr.push(graphObj.node[i].getName());              
	                }                        
				}
				allGraphUpdate(graphObj, tmpNodeArr, 1);
			}
		};
}
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function boxUpdate(node)
{
	return	function(selectOn)
		{
			//box
			if(node.getSelected() == 1 && selectOn == 0){		//unselect	
				if(node.getIsOutlier()){//if isOutlier == true
					node.setStroke(node.getFill());
					node.setScaleX(1);
					node.setScaleY(1);
					node.setOpacity(0.5);
					node.setSelected(0);
				}else{
					node.setSelectCnt(node.getSelectCnt() - 1);	
					if(node.getSelectCnt() == 0){
						node.setOpacity(0.5);
						node.setSelected(0);
					}
				}
			}else if(selectOn == 1){		// select
				if(node.getIsOutlier()){//if isOutlier == true
					node.setStroke('black');
					node.setScaleX(2);
					node.setScaleY(2);
					node.setOpacity(1);
					node.setSelected(1);
					node.moveToTop();
				}else{
					node.setSelectCnt(node.getSelectCnt() + 1);
					if(node.getSelected() == 0){
						node.setOpacity(1);
						node.setSelected(1);
					}
				}				
			}
		};
}
////////////////////////////////////////////////////////////////////////////////////////
function boxHover()
{
	return	function(node, overOff) // over: 1 , off: 0
		{
			//box
			if(overOff == 1){
				if(node.getIsOutlier()){//if isOutlier == true
					node.setScaleX(1.5);
	                node.setScaleY(1.5);
	                node.draw();
				}else{
					node.setOpacity(1);
	                node.draw();
				}
			}else if(overOff == 0){
				if(node.getIsOutlier()){//if isOutlier == true
					var tween = new Kinetic.Tween({
	        			node: node, 
				        duration: 0.01,
				        scaleX: 1,
				        scaleY: 1
	        		}).play();
				}else{
					var tween = new Kinetic.Tween({
	        			node: node, 
				        duration: 0.01,
				        opacity: 0.5
	        		}).play();
				}				
			}
		};
}
