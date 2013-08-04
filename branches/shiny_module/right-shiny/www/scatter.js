/**  draw sactter  **/
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
			if(!(plotObject.isXDiscrete == mainArr.isDiscrete[xLabel] && plotObject.isYDiscrete == mainArr.isDiscrete[yLabel])){
				alert("Can't draw scatter!");
				return -1;
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
						tooltipTextGetInfo[i] = tooltipTextGetInfo[i] + mainArr.labelArr[j] + " : " + mainArr[mainArr.labelArr[0]][j]+ "\r\n" ;
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

/**  update function  **/
//Kinetic version update
//just remove transitient, and change it with "set" syntax.
//"set" syntax has not changed during many versions.
function scatterUpdate(obj, id)
{
	return	function(selectOn)
				{
					if(selectOn == 0 && obj.node[id].getSelected() == 1)		//unselect
					{	
						obj.node[id].setStroke(obj.node[id].getFill());
						obj.node[id].setScaleX(1);
						obj.node[id].setScaleY(1);
						obj.node[id].setSelected(0);
					}else if(selectOn == 1 && obj.node[id].getSelected() == 0){	//select
						obj.node[id].setStroke('black');
						obj.node[id].setScaleX(2);
						obj.node[id].setScaleY(2);
						obj.node[id].setSelected(1);
						obj.node[id].moveToTop();
					}
				};
}
/**  update function end  **/



//////////////////////////////////// common used for graph /////////////////////////////////

/**  add layers  **/
// plotLayer(legend, mainLabel), tooltip, data
function addLayer(obj, stage)
{
	obj.plotLayer = new Kinetic.Layer();
	obj.plotLayer.add(obj.mainLabel);
	stage.add(obj.tooltipLayer);
	stage.add(obj.dataLayer);
	stage.add(obj.plotLayer);
	if(obj.color != -1){
		stage.add(obj.legendLayer);
	}
	
}
/**  add layers end  **/
/**  make Main Label  **/
function MakeMainLabel(obj, plot, xLabel, yLabel)
{

	obj.mainLabel = new Kinetic.Text({
	   name : 'mainLabel',
	   x: plot.plotXMargin + plot.width/2, 
	   y: plot.plotYMargin * 0.3,
	   offset : {x: (obj._type + ' of ' + xLabel + ' & ' + yLabel).length/2 * 10, y:0},
	   text: obj._type + ' of ' + xLabel + ' & ' + yLabel,
	   fontSize: 20,
	   fontStyle: 'bold',
	   fontFamily: 'Calibri',
	   fill: 'black',
	});
}
/**  make Main Label end  **/

