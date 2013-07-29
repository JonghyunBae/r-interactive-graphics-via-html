var Hist = {};
(function() {	
	Hist = function(id, dataArr, optionObj) {
		this._type = 'hist';
		this._id = id;
		this._labelArr = labelArr; //localize later
		objArr[id-1] = this;
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
		this._init(id, dataArr, optionObj);	
    };
	Hist.prototype = {
			
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
    			
    			//check the bin.
	            if(optionObj.bin != undefined){
	            	this.bin = optionObj.bin;
	        	}else{
	        		if(this.bin == undefined){
	        			this.bin = parseInt(findMaxValue(dataArr[this.x])/10);
	        		}
	        	}
	            //check the fixpoint.
				this.fixPoint = 0;
				if(this.bin.toString().indexOf('.') != -1)
				{
					this.fixPoint = this.bin.toString().substring(this.bin.toString().indexOf('.')+1, this.bin.toString().length).length;
				}
				
	            if(isDiscrete[this.x] == true)
	            {	            	
	            	var cnt = 0;
	            	var xTmp = new Array();
	            	var freqTmp = new Array(); 
	            	var hasTmp = make2DArr(dataArr[this.x].length);
	            	freqTmp[cnt] = 1;
	            	hasTmp[cnt][0] = 0;
	            	xTmp[cnt++] = dataArr[this.x][0];
	            	isSelected[0][id] = histUpdate(this, 0);
	            	//isSelected[0].push(histUpdate(this, 0));
	            	for(i = 1 ; i < dataArr[this.x].length ; i++)
	            	{
	            		for(j = 0 ; j < xTmp.length ; j ++)
	            		{
	            			if(xTmp[j] == dataArr[this.x][i])
	            			{
	            				hasTmp[j].push(i);
	            				isSelected[i][id] = histUpdate(this, j);
	            				freqTmp[j] ++; 
	            				break;
	            			}
	            		}
	            		
	            		if(j == xTmp.length)
	            		{
	            			freqTmp[j] = 1;
	            			hasTmp[j].push(i);
	            			xTmp.push(dataArr[this.x][i]);
	            			isSelected[i][id] = histUpdate(this, j);
	            		}
	            	}
	            	var barWidth = this.width/freqTmp.length/2;
	            	var barGap = barWidth;
	            	this.xMax = parseInt(this.width/barWidth);
	            	
	            	var freqRank =make2DArr(freqTmp.length); 			
	            	for(var i  = 0 ; i < freqRank.length ; i ++)
	            	{
	            		freqRank[i][0] = freqTmp[i];
	            		freqRank[i][1] = i;
	            	}
	            	freqRank.sort(function(a,b){return a[0] - b[0];});
	            	var nodeX = new Array(freqTmp.length);
	            	this.maxNode =freqRank[freqRank.length-1][1];             	
	            	this.xPlotArr = make2DArr(freqTmp.length);
 	            	for(var i  = 0 ; i < freqRank.length ; i ++)
	            	{
 	            	//	nodeX[freqRank[i][1]] = i;				 	            		
 	            		this.xPlotArr[i][0] = i*(barWidth+barWidth) + (barWidth+barWidth)/2;
 	            		this.xPlotArr[i][1] = xTmp[freqRank[i][1]];
	            		nodeX[freqRank[i][1]] = i*(barWidth+barWidth) + (barWidth)/2;
	            	}	            	
 	            	this.firstX = this.xPlotArr[0][0]-barWidth/2;  
	            	this.lastX = this.xPlotArr[this.xPlotArr.length-1][0]+barWidth/2; 
	            }else{
	            	var xMax = findMaxValue(dataArr[this.x]);			
	            	var xMin = findMinValue(dataArr[this.x]);
	            	var freqTmp = (xMin > 0 ) ? new Array(parseInt((xMax)/this.bin)+1) :  new Array(parseInt((xMax - xMin)/this.bin)+1); 
	            	var hasTmp = (xMin > 0 ) ? make2DArr(parseInt((xMax)/this.bin)+1) : make2DArr(parseInt((xMax -xMin)/this.bin)+1);             	
	            	var upTmp = new Array(dataArr[this.x].length);
	            	var cnt = 0;
	            	for(var i = 0 ; i < freqTmp.length ; i ++ )
	            	{
	            		freqTmp[i] = 0; 
	            	}
	            	
	            	for(var i = 0 ; i < dataArr[this.x].length ; i++){
	            		if(xMin < 0)
	            		{
	            			cnt = parseInt((dataArr[this.x][i]+Math.abs(xMin))/this.bin);     		
	            		}else{
	            			cnt = parseInt(dataArr[this.x][i]/this.bin);
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
	            	
	            	for(var i = 0 ; i < firstcnt ; i ++)
	            	{
	            		freqTmp.shift();
	            		hasTmp.shift();
	            	}

	            	for(var i = 0 ; i < dataArr[this.x].length ; i++)
	            	{
	            		isSelected[i][id] = histUpdate(this , upTmp[i]-firstcnt);
	            	}
            		var barWidth = this.width /(lastcnt-firstcnt + 3);	
	            	this.xPlotArr = make2DArr(lastcnt-firstcnt + 4); 
	            	cnt = 0;
	            	var nodeX = new Array(lastcnt-firstcnt+1);
	            	
	            	for(var i = 0 ; i < this.xPlotArr.length ; i++)
	            	{
	            		this.xPlotArr[i][0] = (i)*barWidth;
	            		this.xPlotArr[i][1] = (xMin > 0 ) ? ((i-1)*this.bin + firstcnt*this.bin).toFixed(this.fixPoint) : ((i-1)*this.bin + firstcnt*this.bin -Math.abs(xMin)).toFixed(this.fixPoint);
	            		if(0 < i && i < this.xPlotArr.length-2 )
	            		{	            			
	            			nodeX[cnt++] =  i*(barWidth);	            			
	            		}
	            	}	 
	            	this.firstX = this.xPlotArr[0][0];  
	            	this.lastX = this.xPlotArr[this.xPlotArr.length-1][0]; 
	            	var maxFreq = findMaxValue(freqTmp);
	            	this.maxNode =0;
	                for(var i = 0; i<  freqTmp.length ; i++)
	             	{
	                 	if(freqTmp[i] == maxFreq){
	                 		this.maxNode=i;
	                 		break;
	                 	}
	             	}
	            }
	            //////////////////////////// y Axis ///////////////////////////////////////////////////
	            var max = findMaxValue(freqTmp);
	            var min = 0;
	            this.yTick= (optionObj.yTick==undefined)?(5):(optionObj.yTick); //default y ticks is 5 
	            var tickRange = (max - min)/ this.yTick;	    		
	    		var tmp = Math.ceil( Math.log(tickRange) / Math.log(10));
	    		tickRange = setTickRange(tmp, tickRange);
	            max = tickRange * Math.ceil(max/tickRange);		      
	            min = tickRange * Math.floor(min/tickRange);
	        	var diff = this.height * tickRange   / (max - min);
	        	
	        	this.yPlotArr = make2DArr(  Math.round ((max - min)/tickRange + 1 ));
	        	
	    		for(var i = 0 ; i < this.yPlotArr.length ; i ++)
	    		{
	    			this.yPlotArr[i][0] = i*diff;
	    			if (tickRange.toString().indexOf('.') == -1){
	    				this.yPlotArr[i][1] = min+i*tickRange;
	    			}else{
	    				this.yPlotArr[i][1] = (min+i*tickRange).toFixed(tickRange.toString().substring(tickRange.toString().indexOf('.')+1,tickRange.toString().length).length);
	    			}
	    		}	    
	    		/////////////////////////////////// ////////////////////////////////////////
	           
	            this.yMax = max;
	            this.yMin = 0;	          
	            
            	 //////////Make Data Structure of nodes and essential arrays////////            	
            	this.node = new Array();            	
            	for(var cnt = 0; cnt< nodeX.length ; cnt++)
            	{
            		//alert(colors);
            		//alert(freqRank[cnt][1]);
            		this.node[cnt] = new Kinetic.Rect({
            			//id : cnt,
            			name : cnt,
						freq: freqTmp[cnt],
						x: this.plotXMargin + nodeX[cnt] + barWidth/2, 
						y: this.plotYMargin + this.height - freqTmp[cnt]*this.height/this.yMax/2, 
						
						width: barWidth,
						height: freqTmp[cnt]*this.height/this.yMax,
						fill: (isDiscrete[this.x] == true)?getColor(hasTmp[cnt][0] ,colors, mainValueArr, tmpColorArr):'green',
						stroke: 'black',						
						opacity : 0.5,
						draggable : false,
				//		hidden : false,
						selected : 0,
						selectCnt : 0,
						info : "Node : "+cnt+"\r\n"+"Frequency : "+freqTmp[cnt],
						hasArr : hasTmp[cnt],
						offset: {x: barWidth/2, y: freqTmp[cnt]*this.height/this.yMax/2},
					});
            		
            	}
            	
            	//set plotRect.
				setPlotRect(this);
            	// set line variables.
            	//histSetXLine(this);
            	//histSetYLine(this);            	
            	// set axis variables.
            	histSetXAxis(this);
            	histSetYAxis(this);
            	//set label variables.
				histSetXLabel(this);
				histSetYLabel(this);
				histSetMainLabel(this);
				//set tooltip.
            	setTooltip(this);
            	
	            
	        },				
			doIt: function() { 
				alert('do it'); 
			},
			draw: function(id){						
				
				document.getElementById('histContainer'+id).onmousemove =getCoords;
				document.getElementById('histContainer'+id).onclick = function() {
			        document.getElementById('regcoords');
			    };
			    var tmpWidth=0;
				if(this.legend=='left' || this.legend=='topleft'){
					tmpWidth =  this.width+this.plotXMargin+this.legendGroup.getWidth();
				}else if(this.legend=='right' || this.legend=='topright' || this.legend){
					tmpWidth =  this.width+this.plotXMargin*2+this.legendGroup.getWidth();
				}else{
					tmpWidth =  this.width+this.plotXMargin*2;
				}				
				this.stage = new Kinetic.Stage({            
					container: 'histContainer'+id,            
					width : tmpWidth,							
					height: this.height+this.plotYMargin*2 
				});

                this.plotLayer = new Kinetic.Layer();
                //add base rectangular.
                this.plotLayer.add(this.plotRect);              
                //add x, y line
                //this.plotLayer.add(this.xAxis);
                //this.plotLayer.add(this.yAxis);              
                //add x axis layer.
                for(var i = 0; i < this.xLine.length ; i++){
                	this.plotLayer.add(this.xLine[i]);
                    this.plotLayer.add(this.xText[i]);
                }                
                //add y axis layer.
                for(var i = 0; i < this.yLine.length ; i++){
                	this.plotLayer.add(this.yLine[i]);
            	    this.plotLayer.add(this.yText[i]);
                }    	      
                //add label layers.
                this.plotLayer.add(this.xLabel);
                this.plotLayer.add(this.yLabel);
                this.plotLayer.add(this.mainLabel);            
                
                //add plot layer.
                this.stage.add(this.plotLayer);
                
                this.plotLayer.on('mouseover mousemove dragmove', function(evt){  
                    document.body.style.cursor = "default";
                });				
                //draw node
				this.dataLayer = new Kinetic.Layer();	
				for(var i = 0 ; i < this.node.length ; i ++)
				{
					this.dataLayer.add(this.node[i]);
				} 
				this.stage.add(this.dataLayer);			
				
				// add tooltip
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
						// do nothing.
			},
			changeColor: function(id, dataArr, optionObj){
							// do nothing.
			},
			update: function(){
				alert('hist is updated');
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

/**  set labels **/
//set xLabel
function histSetXLabel(obj)
{
	obj.xLabel = new Kinetic.Text({
	    name : 'xLabel',
	    x: obj.plotXMargin+obj.width/2,
	    y: obj.plotYMargin+obj.height+5*obj.plotLength,
	    offset : {x: labelArr[obj.x].length/2 * 10, y:0},
	    text: labelArr[obj.x],
	    fontSize: 15,
	    fontStyle: 'bold',
	    fontFamily: 'Calibri',
	    fill: 'black',
	});                       
}
//set yLabel
function histSetYLabel(obj)
{
	obj.yLabel = new Kinetic.Text({
	    x: obj.plotXMargin-obj.plotLength - 40,
	    y: obj.plotYMargin+obj.height/2  - 15,
	    offset : {x: 'Frequency'.length/2 * 10},
	    text: 'Frequency',
	    fontSize: 15,
	    fontStyle: 'bold',
	    fontFamily: 'Calibri',
	    fill: 'black',
	    rotation: (Math.PI)*3/2
	});  
}
//set Main Label
function histSetMainLabel(obj)
{
	obj.mainLabel = new Kinetic.Text({
	    name : 'mainLabel',
	    x: obj.plotXMargin+obj.width/2, 
	    y: obj.plotYMargin *0.3 ,
	    offset : {x: ('Histogram of ' + labelArr[obj.x]).length/2 * 10, y:0},
	    text: 'Histogram of ' + labelArr[obj.x],
	    fontSize: 20,
	    fontStyle: 'bold',
	    fontFamily: 'Calibri',
	    fill: 'black',
	});
}
/**  set labels end **/

/**  set axis  **/
//set xLine
function histSetXLine(obj)
{
	obj.xAxis = new Kinetic.Line({
        name: 'xAxis',
        points: [  obj.plotXMargin+obj.firstX, 
                   obj.plotYMargin+obj.height+obj.plotLength, 
                   obj.plotXMargin+obj.lastX, 
                   obj.plotYMargin+obj.height+obj.plotLength],
        stroke: 'black',
        strokeWidth: 2             
    });
}
//set yLine
function histSetYLine(obj)
{
	obj.yAxis = new Kinetic.Line({
		name: 'yAxis',
        points: [    obj.plotXMargin-obj.plotLength, 
                     obj.plotYMargin+obj.height-obj.yPlotArr[obj.yPlotArr.length-1][0],
                     obj.plotXMargin-obj.plotLength,  
                     obj.plotYMargin+obj.height],
        stroke: 'black',
        strokeWidth: 2             
    });
}
//set x axis variables.
//xPlotArr should be needed.
function histSetXAxis(obj)
{
	obj.xLine = new Array();
	obj.xText = new Array();
	var tmp = 0;
	for(var i = 0 ; i < obj.xPlotArr.length ; i ++)
	{
		if((obj.node.length < 10) || (obj.node.length>=10)&&( i%(parseInt(obj.node.length/5))==0) )
	    {
			obj.xLine[tmp] = new Kinetic.Line({
	            name : "xLine"+tmp,
	            points: [   obj.plotXMargin + obj.xPlotArr[i][0],
	                        obj.plotYMargin+obj.height+obj.plotLength,
	                        obj.plotXMargin + obj.xPlotArr[i][0],
	                        obj.plotYMargin+obj.height+2*obj.plotLength],
	            stroke: 'black',
	            strokeWidth: 2,             
	        });	                        	
	        obj.xText[tmp] = new Kinetic.Text({
	            name : "xText"+tmp,
	            x: obj.plotXMargin + obj.xPlotArr[i][0]-30,
	            y: obj.plotYMargin+obj.height+obj.plotLength*2,
	            text: obj.xPlotArr[i][1], ///////////////////////////////////////////
	            fontSize: obj.width/40,
	            fontFamily: 'Calibri',
	            fill: 'black',
	            width: 60,
	            align: 'center'    
	        });
	        tmp++;
	    }
	}
}
//set y axis variables.
//yPlotArr should be needed.
function histSetYAxis(obj)
{
	obj.yLine = new Array();
	obj.yText = new Array();
	for(var i=0; i< obj.yPlotArr.length ; i++)
	{
		obj.yLine[i] = new Kinetic.Line({
	        points: [	obj.plotXMargin-obj.plotLength, 
	                 	obj.plotYMargin+obj.height-obj.yPlotArr[i][0], 
	                 	obj.plotXMargin-2*obj.plotLength,
	                 	obj.plotYMargin+obj.height-obj.yPlotArr[i][0]],
	        stroke: 'black',
	        strokeWidth: 2,             
	    });	           
	    obj.yText[i] = new Kinetic.Text({
	        x: obj.plotXMargin-obj.plotLength*2-15,
	        y: obj.plotYMargin+obj.height-obj.yPlotArr[i][0]+30,
	        text: obj.yPlotArr[i][1],
	        fontSize: 15,
	        fontFamily: 'Calibri',
	        fill: 'black',
	        width: 60,
	        align: 'center',
	        rotation: (Math.PI)*3/2
	    });     
	} 
}
/**  set axis end  **/
