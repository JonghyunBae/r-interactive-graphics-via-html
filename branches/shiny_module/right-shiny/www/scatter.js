var MakeScatterObj = {};

(function () {
	
	MakeScatterObj = function(mainArr, xLabel, yLabel, optionObj) {
		this.xLabel = xLabel;
		this.yLabel = yLabel;
		this.mainLabel = "scatter of " + xLabel + " & " + yLabel;
		this.id = 0;
		this.double = false;
		this.legend = false;
		
		// basic calculation.
		if(mainArr.isDiscrete[xLabel] == true){
			this.isXDiscrete = true;
			var temp = findDiscreteNum(mainArr[xLabel]);
			var xArr = new Array();
			xArr[0] = temp.discreteArr;
			xArr[1] = temp.mapping;
			var hasArr = new Array();
			for(var i = 0 ; i < mainArr[xLabel].length ; i ++ ){
				hasArr[i] = i;
			}			
			this.xArr = xArr;
		}else{
			this.isXDiscrete = false;
			this.xArr = new Array();
			this.xArr[0] = mainArr[xLabel];
			this.xArr[1] = mainArr[xLabel];
			var hasArr = new Array();
			for(var i = 0 ; i < mainArr[xLabel].length ; i ++ ){
				hasArr[i] = i;
			}
		}
		
		if(mainArr.isDiscrete[yLabel] == true){
			this.isYDiscrete = true;
			var temp = findDiscreteNum(mainArr[yLabel]);
			var yArr = new Array();
			yArr[0] = temp.discreteArr;
			yArr[1] = temp.mapping;
			this.yArr = yArr;
		}else{
			this.isYDiscrete = false;
			this.yArr = new Array();
			this.yArr[0] = mainArr[yLabel];
			this.yArr[1] = mainArr[yLabel];
		}
		
		// check color.
		if(optionObj.color != undefined){
			this.colorLabel = optionObj.color;
			// set legend.
			this.legend = new Object();
			// set color.
			// making color part.
			if(this.colorLabel != this.xLabel && this.colorLabel != this.yLabel && mainArr.isDiscrete[this.colorLabel] == true){ // another color axis.
				// find number of colors.
				var temp = findDiscreteNum(mainArr[this.colorLabel]);
				var tempColorArr = temp.discreteArr;
				var numberIndex = temp.mapping;
				// get colorObj according to tempColorArr.
				this.colorObj = makeColor_discrete(tempColorArr);
				// make colorArr
				var colorArr = new Array();
				for(var i = 0 ; i < numberIndex.length ; i ++){
					colorArr[i] = this.colorObj.colors[numberIndex[i]];
				}				
				this.colorArr = colorArr;
				// for legend(colorArr and each label of each color needed).
				var legend_colorArr = this.colorObj.colors;
				var legend_labels = tempColorArr;
				var legend_isDiscrete = true;
			}else if(this.colorLabel == this.xLabel && mainArr.isDiscrete[this.colorLabel] == true){ // matches with xAxis.
				// get colorObj according to tempColorArr.
				this.colorObj = makeColor_discrete(xArr[0]);
				// make colorArr
				var colorArr = new Array();
				for(var i = 0 ; i < xArr[1].length ; i ++){
					colorArr[i] = this.colorObj.colors[xArr[1][i]];
				}				
				this.colorArr = colorArr;
				// for legend(colorArr and each label of each color needed).
				var legend_colorArr = this.colorObj.colors;
				var legend_labels = xArr[0];
				var legend_isDiscrete = true;
			}else if(this.colorLabel == this.yLabel && mainArr.isDiscrete[this.colorLabel] == true){ // matches with yAxis.
				// get colorObj according to tempColorArr.
				this.colorObj = makeColor_discrete(yArr[0]);
				// make colorArr
				var colorArr = new Array();
				for(var i = 0 ; i < yArr[1].length ; i ++){
					colorArr[i] = this.colorObj.colors[yArr[1][i]];
				}				
				this.colorArr = colorArr;
				// for legend(colorArr and each label of each color needed).
				var legend_colorArr = this.colorObj.colors;
				var legend_labels = yArr[0];
				var legend_isDiscrete = true;
			}else if(mainArr.isDiscrete[this.colorLabel] == false){ // continuous color.
				this.colorObj = makeColor_continuous(mainArr[this.colorLabel]);
				this.colorArr = this.colorObj.indexArr;
				// for legend(colorArr and each range label in continuous legend).
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
		}else{ // no color.
			this.colorArr = new Array();
			for(var i = 0 ; i < this.xArr[0].length ; i ++){
				this.colorArr[i] = 'green';
			}
		}
		
		// set mapping for event handler.
		birthReport(mainArr, this, hasArr, hasArr);
	}
})();





var Scatter = {};

(function() {
	
	Scatter = function(axisObj, scatterObj, xArr, yArr, colorArr,  optionObj) {
		this._type = 'scatter';
		this.id = scatterObj.id;
		this.preId = {x : -1, y : -1};
		this.stage = axisObj.stage;
		this._draw(axisObj, scatterObj, xArr, yArr, colorArr, optionObj);
		scatterObj.id ++;
	};
	Scatter.prototype = {
		_draw: function(axisObj, scatterObj, xArr, yArr, colorArr, optionObj) {
			this.radius = (optionObj.radius == undefined) ? (2) : (optionObj.radius); // default radius is 2
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
					this.node[i] = new Kinetic.Circle({
						name : i,
						x: x,
		    			y: y,
						radius: this.radius,
						stroke: colorArr[i],
						strokeWidth: 1,
						fill: colorArr[i],
						selected : 0,
						info :  "Node : " + i + "\r\n"
					});
					if(i < yArr.length){
        				y = y - yArr[i+1]*axisObj.height/axisObj.yMax;
        			}
        			tempData = this.node[i].getX();
	        	}
			}else{
				this.node = new Array();
				for(var i = 0; i < xArr.length ; i ++){
					this.node[i] = new Kinetic.Circle({
						name : i,
						x: (axisObj.isXDiscrete == true) ? (xArr[i]+1)*axisObj.xDiff + axisObj.plotXMargin : (xArr[i] - axisObj.xMin)*axisObj.width/(axisObj.xMax - axisObj.xMin) + axisObj.plotXMargin,
		    			y: (axisObj.isYDiscrete == true) ? axisObj.plotYMargin + axisObj.height - (yArr[i]+1)*axisObj.yDiff  : axisObj.plotYMargin + axisObj.height - (yArr[i] - axisObj.yMin)*axisObj.height/(axisObj.yMax - axisObj.yMin),
						radius: this.radius,
						stroke: colorArr[i],
						strokeWidth: 1,
						fill: colorArr[i],
						selected : 0,
						info :  "Node : " + i + "\r\n"
					});
	        	}
			}
			
        	// event add
			scatterObj.refreshArr[this.id] = makeRefresh(this.stage);
			scatterObj.updateArr[this.id] = scatterUpdate(this.node);
        	this.firstUpdate = firstUpdate(scatterObj);
        	
        	
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

/**  draw sactter  **/
/*
// label array is used for tooltipgetinfo and color setting. --> should be refined!
var Scatter = {};

(function() {

	Scatter = function(mainArr, plotObject, xLabel, yLabel, optionObj) {
		this._type = 'scatter';
		this.id = mainArr.id;
		this.stage = plotObject.stage;
		this.labelArr = mainArr.labelArr; // this is for legend make.
		this._init(mainArr, optionObj);			
		//execute build
		var returnValue = this._build(mainArr, plotObject, xLabel, yLabel, optionObj);		
		if(returnValue == 1){
			//only when excuting build is success, execute draw
			this._draw(plotObject);
			mainArr.id ++;
			mainArr.refreshArr[this.id] = makeRefresh(this.stage);
		}
		//objArr[mainArr.id-1] = this;
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};				
    };
    Scatter.prototype = {
    		
		_init: function(mainArr, optionObj) {
			
			this.radius = (optionObj.radius == undefined) ? (2) : (optionObj.radius); // default radius is 2
			// set the color type
            if(optionObj.color == undefined){
                this.color = -1; //default color                  
            }else{
            	this.color = optionObj.color;
                this.colorArr = setColor(mainArr[optionObj.color], mainArr.isDiscrete[optionObj.color]);
            }                  
		},
		
		_build: function(mainArr, plotObject, xLabel, yLabel, optionObj) {
			//check whether each axis is the same type of plotObject.
			
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
            //if color exists, legend should be created.
            if(this.color != -1){
            	//set legend position.
        		setLegendPosition(this, plotObject);    
        		//make legend.
        		MakeLegend(this, this.color, this.colorArr, this.legendX, this.legendY, this.mainValueArr);	
         		//resize plotObject's width. It depends on legendGroup's width.
        		plotObject.stage.setWidth(plotObject.stage.getWidth()+ this.legendGroup.getWidth());        		
        		//When legend is right or left, move legend layer to center. 			        		
        		if(this.legend == 'right' || this.legend == 'left'){
        			this.legendLayer.setY((plotObject.height-this.legendGroup.getHeight())/2);
        		}        		
        		//move plotObject left.
        		if(this.legend == 'left' || this.legend == 'topleft'){
        			plotObject.plotLayer.setX(plotObject.plotLayer.getX() + this.legendGroup.getWidth() + plotObject.plotLength*5 );
            		plotObject.plotLayer.draw();            		
        		}       	
            }
               
            
            
            var nodeX = new Array();
			var nodeY = new Array();
			//nodeX set.
			if(mainArr.isDiscrete[xLabel] == true){	// x - discrete
				for(var i = 0 ; i < mainArr[xLabel].length ; i ++){
					nodeX[i] = plotObject.xPlotArr[plotObject.xNode[i]][0] + plotObject.plotXMargin;    					
				}
			}else{  // x - continuous
				for(var i = 0 ; i < mainArr[xLabel].length ; i ++){
					if(mainArr[xLabel][i] > plotObject.xMax || mainArr[xLabel][i] < plotObject.xMin){
						nodeX[i] = -1;
					}else{
						nodeX[i] = plotObject.width * (mainArr[xLabel][i] - plotObject.xMin) / (plotObject.xMax - plotObject.xMin) + plotObject.plotXMargin;
					}
				}
			}
			//nodeY set.
			if(mainArr.isDiscrete[yLabel] == true){	// y - discrete
				for(var i = 0 ; i < mainArr[yLabel].length ; i ++){
					if(nodeX[i] == -1){
						nodeY[i] = -1;
					}else{
						nodeY[i] = plotObject.height + plotObject.plotYMargin - plotObject.yPlotArr[plotObject.yNode[i]][0];
					}    					
				}
			}else{  // y - continuous
				for(var i = 0 ; i < mainArr[yLabel].length ; i ++){
					if(nodeX[i] == -1){
						nodeY[i] = -1;
					}else if(mainArr[yLabel][i] > plotObject.yMax || mainArr[yLabel][i] < plotObject.yMin){
						//alert(plotObject.yMax + "m" + mainArr.dataArr[this.y][i]);
						nodeX[i] = -1;
						nodeY[i] = -1;
					}else{
						nodeY[i] = plotObject.height + plotObject.plotYMargin - plotObject.height * (mainArr[yLabel][i] - plotObject.yMin) / (plotObject.yMax - plotObject.yMin);
					}
				}
			}
			var tooltipTextGetInfo = new Array();
			for(var i = 0; i < mainArr[yLabel].length ; i++)
			{
				tooltipTextGetInfo[i] =  mainArr.labelArr[0] + " : " + mainArr[mainArr.labelArr[0]][i]+ "\r\n" ;
				if(mainArr.labelArr.length>1){
					for(var j = 1; j < mainArr.labelArr.length-1 ; j ++){
						tooltipTextGetInfo[i] = tooltipTextGetInfo[i] + mainArr.labelArr[j] + " : " + mainArr[mainArr.labelArr[j]][i]+ "\r\n" ;
					}
					tooltipTextGetInfo[i] = tooltipTextGetInfo[i] + mainArr.labelArr[mainArr.labelArr.length-1] + " : " + mainArr[mainArr.labelArr[0]][j];
				}
			}
			//set dots.
			this.node = new Array();
			var cnt = 0;
			var overCnt = 0;
			for(var i = 0; i < nodeX.length ; i++)
			{
				if(nodeX[i] != -1){
					this.node[cnt] = new Kinetic.Circle({
						name : cnt,
						x: (this.legend == "topleft" || this.legend =="left") ? nodeX[i] + this.legendGroup.getWidth() + plotObject.plotLength*5 : nodeX[i],
						y: nodeY[i],
						radius: this.radius,
						stroke: (this.color == -1) ? 'green': this.colorArr.indexArr[i],
						strokeWidth: 1,
						fill: (this.color == -1) ? 'green': this.colorArr.indexArr[i],
						selected : 0,
						info :  "Node : " + cnt + "\r\n" + tooltipTextGetInfo[i]
					});
					mainArr.isSelected[i][this.id] = scatterUpdate(this, cnt);	//save event handler
					cnt ++;
				}else{
					overCnt ++;
				}
			}
			if(overCnt > 0){
				alert(overCnt + " nodes can't be draw in this plot range.");
			}
			this.firstUpdate = firstUpdate(mainArr, null);
			// make main labels.
			MakeMainLabel(this, plotObject, xLabel, yLabel);
			setTooltip(this);
			mainArr
			return 1;
		},
		
		_draw : function(plotObject) {
			
			// make dataLayer.
			this.dataLayer = new Kinetic.Layer();	
			for(var i = 0 ; i < this.node.length ; i ++)
			{
				if(i % parseInt(this.node.length/20) == 0)
				{
					plotObject.stage.add(this.dataLayer);
					this.dataLayer = new Kinetic.Layer();
				}
				this.dataLayer.add(this.node[i]);
			}			

			//Total layers added to plot stage.
			addLayer(this, plotObject.stage);
		}
    }
})();
*/
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




