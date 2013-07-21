var Hist = {};		

(function() {	
	
	Hist = function(id, dataArr, optionObj) {
		this._initHist(id, dataArr, optionObj);		
		this._type = 'hist';
		this._id = id;
		objArr.push(this);
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
    };
	Hist.prototype = {
			
			_initHist: function(id, dataArr, optionObj){

				////////// Make essential variables ////////
				//this.xMax = findMaxValue(dataArr[this.x]);
				for(var i = 0 ; i < labelArr.length ; i ++)
	            {
	            	if(labelArr[i].toLowerCase()==optionObj.x.toLowerCase()){	            		
	            		 this.x =  i;
	            		 break;
	            	}
	            	if(i==labelArr.length-1){
	            		alert('retype x label');
	            	}
	            }	
				this.bin = (optionObj.bin==undefined)?(parseInt(findMaxValue(dataArr[this.x])/10)):(optionObj.bin);
				this.fixPoint = 0;
			//	alert(this.bin.toString().indexOf('.'));
				if(this.bin.toString().indexOf('.') != -1)
				{
					//alert(this.bin.toString().substring(this.bin.toString().indexOf('.')+1, this.bin.toString().length).length);
					this.fixPoint = this.bin.toString().substring(this.bin.toString().indexOf('.')+1, this.bin.toString().length).length;
				}
	            this.width = optionObj.width || plotWidth; //plot width
	            this.height = optionObj.height || plotHeight; //plot height
	            this.plotXMargin=this.width*0.2; //canvas left, right margin
	            this.plotYMargin=this.height*0.2; //canvas top, bottom margin
	            this.plotLength=this.width*0.02; //margin from plot box

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
	            				//isSelected[i].push(histUpdate(this, j));
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
	            			//isSelected[i].push(histUpdate(this , j));
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
 	            	var firstcnt = 0;
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
	            	
	            //	alert(freqTmp.length);
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
            //			if(i == 121)
            	//			alert(upTmp[i]);
	            		isSelected[i][id] = histUpdate(this , upTmp[i]-firstcnt);
	            		//isSelected[i].push(histUpdate(this , upTmp[i]-firstcnt));
	            	}
            		var barWidth = this.width /(lastcnt-firstcnt + 3);	
	            	this.xPlotArr = make2DArr(lastcnt-firstcnt + 4); 
	           // 	alert(firstcnt);
	           // 	alert(lastcnt);
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
	              //  alert(this.maxNode);
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
            	//	alert(freqTmp[cnt]);
            		this.node[cnt] = new Kinetic.Rect({
            			//id : cnt,
            			name : cnt,
						freq: freqTmp[cnt],
						x: this.plotXMargin + nodeX[cnt] + barWidth/2, 
						y: this.plotYMargin + this.height - freqTmp[cnt]*this.height/this.yMax/2, 
						
						width: barWidth,
						height: freqTmp[cnt]*this.height/this.yMax,
						fill: 'green',
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
	            
	        },				
			doIt: function() { 
				alert('do it'); 
			},
			draw: function(id){						
				
				document.getElementById('histContainer'+id).onmousemove =getCoords;
				document.getElementById('histContainer'+id).onclick = function() {
			        document.getElementById('regcoords');
			    };
				//draw plot
                this.stage = new Kinetic.Stage({            
                    container: 'histContainer'+id,            
                    width: this.width+this.plotXMargin*2,
                    height: this.height+this.plotYMargin*2 
                });
                this.plotLayer = new Kinetic.Layer();
                this.plotRect = new Kinetic.Rect({
                    name : "baseRect",
                    x: this.plotXMargin-this.plotLength,
                    y: this.plotYMargin-this.plotLength,
                    width: this.width+2*this.plotLength,
                    height: this.height+2*this.plotLength,
                    stroke: '#fff',
                    strokeWidth: 2
                });                
                this.plotLayer.add(this.plotRect);    
                
                this.xAxis = new Kinetic.Line({
                    name: 'xAxis',
                    points: [  this.plotXMargin+this.firstX, 
                                 this.plotYMargin+this.height+this.plotLength, 
                                 this.plotXMargin+this.lastX, 
                                 this.plotYMargin+this.height+this.plotLength],
                    stroke: 'black',
                    strokeWidth: 2             
                });
                
               
                this.plotLayer.add(this.xAxis);
                this.yAxis = new Kinetic.Line({
                    points: [    this.plotXMargin-this.plotLength, 
                                 this.plotYMargin+this.height-this.yPlotArr[this.yPlotArr.length-1][0],
                                 this.plotXMargin-this.plotLength,  
                                 this.plotYMargin+this.height],
                    stroke: 'black',
                    strokeWidth: 2             
                });                                
                this.plotLayer.add(this.yAxis);        
                this.xLine = new Array();
                this.xText = new Array();
                var tmp = 0;
                for(var i = 0 ; i < this.xPlotArr.length ; i ++)
                {
                	if((this.node.length < 10) || (this.node.length>=10)&&( i%(parseInt(this.node.length/5))==0) )
                    {
	                	this.xLine[tmp] = new Kinetic.Line({
	                        name : "xLine"+tmp,
	                        points: [   this.plotXMargin + this.xPlotArr[i][0],
	                                     this.plotYMargin+this.height+this.plotLength,
	                                     this.plotXMargin + this.xPlotArr[i][0],
	                                     this.plotYMargin+this.height+2*this.plotLength],
	                        stroke: 'black',
	                        strokeWidth: 2,             
	                    });
	                    this.plotLayer.add(this.xLine[tmp]);                	
	                	this.xText[tmp] = new Kinetic.Text({
	                        name : "xText"+tmp,
	                        x: this.plotXMargin + this.xPlotArr[i][0]-30,
	                        y: this.plotYMargin+this.height+this.plotLength*2,
	                        text: this.xPlotArr[i][1], ///////////////////////////////////////////
	                        fontSize: this.width/40,
	                        fontFamily: 'Calibri',
	                        fill: 'black',
	                        width: 60,
	                        align: 'center'    
	                    });          
	                    this.plotLayer.add(this.xText[tmp]);
	                    tmp++;
                    }
                }
                
                this.yLine = new Array();
                this.yText = new Array();
                for(var i=0; i< this.yPlotArr.length ; i++)
                {

                    this.yLine[i] = new Kinetic.Line({
                        points: [	this.plotXMargin-this.plotLength, 
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
                    offset : {x: 'Frequency'.length/2 * 10},
                    text: 'Frequency',
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
                    offset : {x: ('Histogram of ' + labelArr[this.x]).length/2 * 10, y:0},
                    text: 'Histogram of ' + labelArr[this.x],
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
					this.dataLayer.add(this.node[i]);
				} 
				this.stage.add(this.dataLayer);
				//alert(this.node[0].getHasArr());
				//////////////////////////////Tooltip Setting////////////////////////////////////////
				//new kenetic version -> tooltip setting change using tag
				this.tooltipLayer = new Kinetic.Layer();			 
			    this.tooltip = new Kinetic.Label({
			        opacity: 0.75,
			        visible: false,
			        listening: false
			      });
			      
			     this.tooltip.add(new Kinetic.Tag({
			        fill: 'black',
			     //   pointerDirection: 'down',
			        pointerWidth: 10,
			        pointerHeight: 10,
			        lineJoin: 'round',
			        shadowColor: 'black',
			        shadowBlur: 10,
			        shadowOffset: 10,
			        shadowOpacity: 0.2
			      }));
			      
			      this.tooltip.add(new Kinetic.Text({
			        text: '',
			        fontFamily: 'Calibri',
			        fontSize: 15,
			        padding: 5,
			        fill: 'white'
			      }));			      
			      this.tooltipLayer.add(this.tooltip);			      
			      this.stage.add(this.tooltipLayer);                
                ///////////////////////////////////////////////////////////////////////////////////
			},
			
			update: function(){
				alert('hist is updated');				
			}
	};
})();

/////////////////////////////////////////update function //////////////////////////////
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
							//obj.node[id].setScaleX(1);
							obj.node[id].setSelected(0);
						}
					}else if(selectOn == 1){		// select
						obj.node[id].setSelectCnt(obj.node[id].getSelectCnt() + 1);						
						if(obj.node[id].getSelected() == 0)
						{
							obj.node[id].setOpacity(1);
							//obj.node[id].setScaleX(1.05);
							obj.node[id].setSelected(1);
						}				
					}/*else if(selectOn == 2){ // hide
						obj.node[id].setFreq(obj.node[id].getFreq()- obj.node[id].getSelectCnt());
						obj.node[id].setInfo("Node : "+id+"\r\n"+"Frequency : "+(obj.node[id].getFreq()- obj.node[id].getSelectCnt()));
						obj.node[id].setOffset({ y :  (obj.node[id].getHeight() - (obj.node[id].getSelectCnt())*obj.height/obj.yMax)/2});
						obj.node[id].setY(obj.node[id].getY() + (obj.node[id].getSelectCnt())*obj.height/obj.yMax/2);
						obj.node[id].setHeight(obj.node[id].getHeight() - (obj.node[id].getSelectCnt())*obj.height/obj.yMax);
						obj.node[id].setOpacity(0.5);
						obj.node[id].setScaleX(1);
						obj.node[id].setSelected(0);
						obj.node[id].setSelectCnt(0);
					}else if(selectOn == 3){		// reset
						obj.node[id].setFreq(obj.node[id].getHasArr().length);
						obj.node[id].setInfo("Node : "+id+"\r\n"+"Frequency : "+ obj.node[id].getHasArr().length);
						obj.node[id].setOffset({ y :  (obj.node[id].getFreq()*obj.height/obj.yMax)/2});
						obj.node[id].setY(obj.plotYMargin + obj.height - obj.node[id].getFreq()*obj.height/obj.yMax/2);
						obj.node[id].setHeight(obj.node[id].getFreq()*obj.height/obj.yMax);
						obj.node[id].setSelected(0);
						obj.node[id].setSelectCnt(0);
					} */
				};
}
////////////////////////////////////////////////////////////////////////////////////////
