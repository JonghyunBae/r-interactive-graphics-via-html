var Hist = {};		

(function() {	
	
	Hist = function(mainArr, optionObj) {
		this._initHist(optionObj);		
		this._type = 'hist';
		objArr.push(this);
    };
	Hist.prototype = {
			
			_initHist: function(optionObj){

				////////// Make essential variables ////////
				//this.xMax = findMaxValue(mainArr[this.x]);
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
				this.bin = (optionObj.bin==undefined)?(parseInt(findMaxValue(mainArr[this.x])/10)):(optionObj.bin);
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
	            	var xTmp = new Array();  // 밑의 각 항목 이름들 
	            	var freqTmp = new Array();  //frequency를 저장 
	            	var hasTmp = make2DArr(mainArr[this.x].length);
	            	freqTmp[cnt] = 1;
	            	hasTmp[cnt][0] = 0;
	            	xTmp[cnt++] = mainArr[this.x][0];
	            	isSelected[0].push(histUpdate(this, 0));
	            	for(i = 1 ; i < mainArr[this.x].length ; i++)
	            	{
	            		for(j = 0 ; j < xTmp.length ; j ++)
	            		{
	            			if(xTmp[j] == mainArr[this.x][i])
	            			{
	            				hasTmp[j].push(i);
	            				isSelected[i].push(histUpdate(this, j));
	            				freqTmp[j] ++; 
	            				break;
	            			}	            				
	            		}
	            		
	            		if(j == xTmp.length)
	            		{
	            			freqTmp[j] = 1;
	            			hasTmp[j].push(i);
	            			xTmp.push(mainArr[this.x][i]);
	            			isSelected[i].push(histUpdate(this , j));
	            		}
	            	}
	            	var barWidth = this.width/freqTmp.length/2;
	            	var barGap = barWidth;
	            	this.xMax = parseInt(this.width/barWidth);
	            	
	            	var freqRank =make2DArr(freqTmp.length); 			// 히스토그램을 오름차순을 정리하기 위한 과정 
	            	for(var i  = 0 ; i < freqRank.length ; i ++)
	            	{
	            		freqRank[i][0] = freqTmp[i];
	            		freqRank[i][1] = i;
	            	}
	            	freqRank.sort(function(a,b){return a[0] - b[0];});
	            	var nodeX = new Array(freqTmp.length);
	            	this.maxNode =freqRank[freqRank.length-1][1]; // Y Axis를 그릴때 제일위에까지 그리기위한 것 
	            	this.xPlotArr = make2DArr(freqTmp.length);
 	            	for(var i  = 0 ; i < freqRank.length ; i ++)
	            	{
 	            	//	nodeX[freqRank[i][1]] = i;				// 이 cntTmp array를 노드의 x값들에 넣어준다. 즉 x 위치만 바꿔서 넣는다. 
 	            		this.xPlotArr[i][0] = i*(barWidth+barWidth) + (barWidth+barWidth)/2;
 	            		this.xPlotArr[i][1] = xTmp[freqRank[i][1]];
	            		nodeX[freqRank[i][1]] = i*(barWidth+barWidth) + (barWidth)/2;
	            	}	            	
 	            	this.firstX = this.xPlotArr[0][0]-barWidth/2;  // x Axis를 그릴때 처음부터 끝까지 그려주기 위해 하는 것. 
	            	this.lastX = this.xPlotArr[this.xPlotArr.length-1][0]+barWidth/2; // x Axis를 그릴때 처음부터 끝까지 그려주기 위해 하는 것. 
 	            	var firstcnt = 0;
	            }else{
	            	
	            	var xMax = findMaxValue(mainArr[this.x]);			// xMax를 먼저 구해야 barwidth를 구해줄 수 있다. 
	            	var xMin = findMinValue(mainArr[this.x]);
	            	var freqTmp = (xMin > 0 ) ? new Array(parseInt((xMax)/this.bin)+1) :  new Array(parseInt((xMax - xMin)/this.bin)+1); // frequency 임시로 저장 
	            	var hasTmp = (xMin > 0 ) ? make2DArr(parseInt((xMax)/this.bin)+1) : make2DArr(parseInt((xMax -xMin)/this.bin)+1);  // has array초기화는 일단 최악의 경우인 mainArray[this.x].length로 해준다. 
	            	var upTmp = new Array(mainArr[this.x].length);
	            	var cnt = 0;
	            	for(var i = 0 ; i < freqTmp.length ; i ++ )
	            	{
	            		freqTmp[i] = 0;  // frequency 저장할꺼 초기화  	            		
	            	}
	            	
	            	for(var i = 0 ; i < mainArr[this.x].length ; i++)
	            	{
	            		if(xMin < 0)
	            		{
	            			cnt = parseInt((mainArr[this.x][i]+Math.abs(xMin))/this.bin);  // 어느 배열위치에 들어갈지 결정.
	            		}else{
	            			cnt = parseInt(mainArr[this.x][i]/this.bin);
	            		}	            		
	            		freqTmp[cnt] ++ ; // 해당배열 frequency 하나씩 늘려주고 
	            		hasTmp[cnt].push(i); // hasarray에 저장해준다.
	            		upTmp[i] = cnt;
	            		
	            	}
	            	
	            	for(var firstcnt = 0 ; firstcnt < freqTmp.length ; firstcnt++) // 처음부터 어디까지 0이 나오는지 저장. 즉, frequency가 0이 아닌 첫 노드 검사 
	            	{	            		
	            		if(freqTmp[firstcnt] != 0)
	            		{
	            			break;
	            		}
	            		freqTmp.shift();
	            		hasTmp.shift();
	            	}

            		for(var i = 0 ; i < mainArr[this.x].length ; i++)
	            	{
	            		isSelected[i].push(histUpdate(this , upTmp[i]-firstcnt));
	            	}

	            	
	            	
	            	for(var lastcnt = freqTmp.length-1 ; lastcnt > -1  ;lastcnt--) // 위와 반대로 끝에서부터 frequency가 0이 아닌 첫 노드 검사 
	            	{
	            		if(freqTmp[lastcnt] != 0)
	            		{
	            			break;
	            		}
	            	}
	            	if(lastcnt == firstcnt) // 1개있다는 뜻 
	            	{
	            		var barWidth = this.width /(3);	// 양쪽에 1칸씩 여유분	따라서 +2 
		            	this.xPlotArr = make2DArr(4); // 총 찍어야 하는 x축 scale이 4개 더 더해야 맞다. 
	            	}else{
	            		var barWidth = this.width /(lastcnt-firstcnt + 3);	// 양쪽에 1칸씩 여유분	따라서 +2 
		            	this.xPlotArr = make2DArr(lastcnt-firstcnt + 4); // 총 찍어야 하는 x축 scale이 4개 더 더해야 맞다. 
	            	}
	            	
	            	cnt = 0;
	            	var nodeX = new Array(lastcnt-firstcnt+1);
	            	
	            	for(var i = 0 ; i < this.xPlotArr.length ; i++)
	            	{
	            		this.xPlotArr[i][0] = (i)*barWidth;
	            		this.xPlotArr[i][1] = (xMin > 0 ) ? ((i-1)*this.bin + firstcnt*this.bin).toFixed(this.fixPoint) : ((i-1)*this.bin + firstcnt*this.bin -Math.abs(xMin)).toFixed(this.fixPoint);
	            		if(i !=0 && i < this.xPlotArr.length-2 )
	            		{	            			
	            			nodeX[cnt++] =  i*(barWidth);	            			
	            		}
	            	}	 
	            	this.firstX = this.xPlotArr[0][0];  // x Axis를 그릴때 처음부터 끝까지 그려주기 위해 하는 것. 
	            	this.lastX = this.xPlotArr[this.xPlotArr.length-1][0]; // x Axis를 그릴때 처음부터 끝까지 그려주기 위해 하는 것. 
	            	var maxFreq = findMaxValue(freqTmp);
	            	this.maxNode =0;
	                for(var i = 0; i<  freqTmp.length ; i++)
	             	{
	                 	if(freqTmp[i] == maxFreq){
	                 		this.maxNode=i-firstcnt;
	                 		break;
	                 	}                	
	             	}	            	
	            }            			
	            this.yMax = findMaxValue(freqTmp); // 얘는 freqTmp 개수가 몇개인지 나와야 구할 수 있으므로 뒤에서 구한다.
	            this.yMin = 0;	              
	            
            	 //////////Make Data Structure of nodes and essential arrays////////            	
            	this.node = new Array();            	
            	for(var cnt = 0; cnt< nodeX.length ; cnt++)
            	{
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
	            this.yTick= (optionObj.yTick==undefined)?(5):(optionObj.yTick); //default y ticks is 5
 	            this.yTickRange = (this.yMax - this.yMin)/this.yTick;
	            var y = Math.ceil( Math.log(this.yTickRange) / Math.log(10));
	            this.yTickRange = setTickRange(y, this.yTickRange);      
	            this.yMax = this.yTickRange * Math.round(this.yMax/this.yTickRange);           
	            this.yMin = this.yTickRange * Math.round(this.yMin/this.yTickRange);   
	            
	        },				
			doIt: function() { 
				alert('do it'); 
			},
			draw: function(id){						
				
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
                    stroke: '#eeeeee',
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
                                 this.plotYMargin+this.height-this.node[this.maxNode].getHeight(),
                                 this.plotXMargin-this.plotLength,  
                                 this.plotYMargin+this.height],
                    stroke: 'black',
                    strokeWidth: 2             
                });                                
                this.plotLayer.add(this.yAxis);
                //////////////////////////////Tooltip Setting////////////////////////////////////////
                this.tooltipLayer = new Kinetic.Layer();
                this.tooltip = new Kinetic.Group({
                	opacity: 0.75,
                	visible: false
                });
                this.tooltipText = new Kinetic.Text({
                	text: '',
                	fontFamily: 'Calibri',
                	fontSize: 15,
                	padding: 5,
                	fill: 'white'
                });	  
                this.tooltipRect = new Kinetic.Rect({
                	fill: 'black'
                });
                
                this.tooltip.add(this.tooltipRect).add(this.tooltipText);
                this.tooltipLayer.add(this.tooltip);
                this.stage.add(this.tooltipLayer);
                ///////////////////////////////////////////////////////////////////////////////////
                
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
                for(var i=0; i<parseInt(this.yTick); i++)
                {
                    this.yLine[i] = new Kinetic.Line({
                        points: [    this.plotXMargin-this.plotLength, 
                                     this.plotYMargin+this.height-i*(this.yTickRange*this.height)/this.yMax, 
                                     this.plotXMargin-2*this.plotLength,
                                     this.plotYMargin+this.height-i*(this.yTickRange*this.height)/this.yMax],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
                    this.plotLayer.add(this.yLine[i]);       
                    this.yText[i] = new Kinetic.Text({
                        x: this.plotXMargin-this.plotLength*2-15,
                        y: this.plotYMargin+this.height-i*(this.yTickRange*this.height)/this.yMax+30,
                        text: i*this.yTickRange,
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
			},
			
			update: function(){
				alert('hist is updated');				
			}
	};
})();

/////////////////////////////////////////update function //////////////////////////////
function histUpdate(obj, id)
{
	return	function(selectOn)
				{
					//alert(id);
					if(obj.node[id].getSelected() == 1 && selectOn == 0)
					{
						obj.node[id].setSelectCnt(obj.node[id].getSelectCnt() - 1);
						if(obj.node[id].getSelectCnt() == 0)
						{
							var shapes = obj.stage.get('.' + id);
							shapes.apply('setAttrs', {
					    		opacity: 0.5,
					    		scale : {x:1, y:1}
							});
							obj.node[id].setSelected(0);
						}
					}else if(selectOn == 1){
						obj.node[id].setSelectCnt(obj.node[id].getSelectCnt() + 1);
						if(obj.node[id].getSelected() == 0)
						{
							var shapes = obj.stage.get('.' + id);
							shapes.apply('setAttrs', {
					    		opacity: 1,
					    		scale : {x:1.05, y:1}
							});
							obj.node[id].setSelected(1);
						}
						
					}

				};
}
////////////////////////////////////////////////////////////////////////////////////////
