var Hist = {};		

(function() {	
	
	Hist = function(mainArr, optionObj) {
		this._initHist(optionObj);		
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
	            
	            var xTmp = makeAxisArr(this.width, this.x, 5); // node가 찍혀야할 nodeX array에 저장. x좌표가 찍혀야할 좌표 위치와 이름이 xPlotArr에 저장된다. 
	            this.xPlotArr = xTmp.plotArr;	 
	            
	            if(isDiscrete[this.x] == true)
	            {
	            	var cnt = 0;
	            	var xTmp = new Array();  // 밑의 각 항목 이름들 
	            	var freqTmp = new Array();  //frequency를 저장 
	            	var hasTmp = make2DArr(mainArr[this.x].length);
	            	freqTmp[cnt] = 1;
	            	hasTmp[cnt][0] = 0;
	            	xTmp[cnt++] = mainArr[this.x][0];
	            	for(i = 1 ; i < mainArr[this.x].length ; i++)
	            	{
	            		for(j = 0 ; j < xTmp.length ; j ++)
	            		{
	            			if(xTmp[j] == mainArr[this.x][i])
	            			{
	            				hasTmp[j].push(i);
	            				freqTmp[j] ++; 
	            				break;
	            			}	            				
	            		}
	            		if(j == xTmp.length)
	            		{
	            			freqTmp[j] = 1;
	            			xTmp.push(mainArr[this.x][i]);
	            		}
	            	}
	            	this.barWidth = this.width/freqTmp.length/2;
	            	this.barGap = this.barWidth;
	            	this.xMax = parseInt(this.width/this.barWidth);
	            	
	            	var freqRank =make2DArr(freqTmp.length); 			// 히스토그램을 오름차순을 정리하기 위한 과정 
	            	for(var i  = 0 ; i < freqRank.length ; i ++)
	            	{
	            		freqRank[i][0] = freqTmp[i];
	            		freqRank[i][1] = i;
	            	}
	            	freqRank.sort(function(a,b){return a[0] - b[0];});
	            	var cntTmp = new Array(freqRank.length);
	            	this.firstNode = freqRank[0][1];  // x Axis를 그릴때 처음부터 끝까지 그려주기 위해 하는 것. 
	            	this.lastNode = freqRank[freqRank.length-1][1]; // x Axis를 그릴때 처음부터 끝까지 그려주기 위해 하는 것. 
	            	this.maxNode = this.lastNode; // Y Axis를 그릴때 제일위에까지 그리기위한 것 
 	            	for(var i  = 0 ; i < freqRank.length ; i ++)
	            	{
	            		cntTmp[freqRank[i][1]] = i;				// 이 cntTmp array를 노드의 x값들에 넣어준다. 즉 x 위치만 바꿔서 넣는다. 
	            	}
	            	
	            	
	            }else{
	            	
	            	this.xMax = findMaxValue(mainArr[this.x]);			// xMax를 먼저 구해야 barwidth를 구해줄 수 있다. 
	            	this.xMin = findMinValue(mainArr[this.x]);
	            	if(this.bin > this.xMax){ this.xMax = this.bin};
	            	this.barWidth = this.width /(parseInt(this.xMax/this.bin) + 1); // 일단 barGap은 여기엔 넣지 않음. .
	            	this.barGap = optionObj.barGap || 0;
	            	var xTmp = new Array(parseInt(this.xMax/this.bin)+1);  // 수직선에 찍히는 이름 저장할 꺼 -> 여기서는 bin
	            	var freqTmp = new Array(parseInt(this.xMax/this.bin)+1); // frequency 저장 
	            	var hasTmp = make2DArr(parseInt(this.xMax/this.bin)+1);  // has array초기화는 일단 최악의 경우인 mainArray[this.x].length로 해준다. 
	            	var countTmp = 0;	         
	            	var cnt = 0;	      
	            	for(var i = 0 ; i < freqTmp.length ; i ++ )
	            	{
	            		freqTmp[i] = 0;  // frequency 저장할꺼 초기화 
	            		xTmp[i] = this.bin * i ; // xTmp는 여기서 초기화 하면 아래에서는 건들필요 없다. 여기서는 숫자이기때문에 	            		
	            	}
	            	
	            	for(var i = 0 ; i < mainArr[this.x].length ; i++)
	            	{
	            		countTmp = parseInt(mainArr[this.x][i]/this.bin);  // 어느 배열위치에 들어갈지 결정.
	            		freqTmp[countTmp] ++ ; // 해당배열 frequency 하나씩 늘려주고 
	            		hasTmp[countTmp].push(i); // hasarray에 저장해준다.
	            	}	            		
	            	this.firstNode = 0;  // x Axis를 그릴때 처음부터 끝까지 그려주기 위해 하는 것. 
	            	this.lastNode = freqTmp.length-1; // x Axis를 그릴때 처음부터 끝까지 그려주기 위해 하는 것. 
	            	
	            		            	
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
	            this.yMax = findMaxValue(freqTmp); // 얘는 freqTmp 개수가 몇개인지 나와야 구할 수 있으므로 뒤에서 구한다.
	            this.yMin = 0;	              
	            
            	 //////////Make Data Structure of nodes and essential arrays////////            	
            	this.node = new Array();            	
            	for(var cnt = 0; cnt< xTmp.length ; cnt++)
            	{
            		this.node[cnt] = new Kinetic.Rect({
            			id : cnt,
						freq: freqTmp[cnt],
						label : (isDiscrete[this.x] == true) ? xTmp[cnt] : parseFloat(xTmp[cnt]).toFixed(this.fixPoint),
						x: (isDiscrete[this.x] == true) ? this.plotXMargin +  cntTmp[cnt] *(this.barGap+this.barWidth) + (this.barGap+this.barWidth)/2 : this.plotXMargin +  cnt*(this.barGap+this.barWidth) + (this.barGap+this.barWidth)/2,
						y: this.plotYMargin + this.height - freqTmp[cnt]*this.height/this.yMax/2, 
						width: this.barWidth,
						height: freqTmp[cnt]*this.height/this.yMax,
						fill: 'green',
						stroke: 'black',						
						opacity : 0.5,
						draggable : false,
						hidden : false,
						selected : 0,
						hasArr : hasTmp[cnt],
						offset: {x: this.barWidth/2, y: freqTmp[cnt]*this.height/this.yMax/2},
					});
            	}
            	
            	
            	
            	 this.xTmpLength=xTmp.length;	
           // 	this.xTick= (optionObj.xTick==undefined)?(5):(optionObj.xTick); //default x ticks is 5
 	            this.yTick= (optionObj.yTick==undefined)?(5):(optionObj.yTick); //default y ticks is 5
 	         	
 	     //       this.xTickRange = (this.xMax - this.xMin)/this.xTick;
 	            this.yTickRange = (this.yMax - this.yMin)/this.yTick;
 	           
 	    //       var x = Math.ceil( Math.log(this.xTickRange) / Math.log(10));
	            var y = Math.ceil( Math.log(this.yTickRange) / Math.log(10));
	    //        this.xTickRange = setTickRange(x, this.xTickRange);
	            this.yTickRange = setTickRange(y, this.yTickRange);
	    //        this.xMax = this.xTickRange * Math.round(1+this.xMax/this.xTickRange);            
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
                    points: [  this.node[this.firstNode].getX() - this.node[this.firstNode].getOffset().x, 
                                 this.plotYMargin+this.height+this.plotLength, 
                                 this.node[this.lastNode].getX() + this.node[this.lastNode].getOffset().x, 
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
                     	
                if(isDiscrete[this.x] == true)
                {
                	
                	for(var i = 0 ; i < this.node.length ; i ++)
                	{
                		this.xLine[i] = new Kinetic.Line({
                            name : "xLine"+i,
                            points: [    this.node[i].getX(),
                                         this.plotYMargin+this.height+this.plotLength,
                                         this.node[i].getX(),
                                         this.plotYMargin+this.height+2*this.plotLength],
                            stroke: 'black',
                            strokeWidth: 2,             
                        });
                        this.plotLayer.add(this.xLine[i]);                	

	                	this.xText[i] = new Kinetic.Text({
	                        name : "xText"+i,
	                        x: this.node[i].getX() - 30,
	                        y: this.plotYMargin+this.height+this.plotLength*2,
	                        text: this.node[i].getLabel(), ///////////////////////////////////////////
	                        fontSize: this.width/20,
	                        fontFamily: 'Calibri',
	                        fill: 'black',
	                        width: 60,
	                        align: 'center'    
	                    });          
	                    this.plotLayer.add(this.xText[i]);
                	}
                	
                }else{  
             
                	for(var i = 0 ; i < this.node.length ; i ++)
                    {
                		if( (this.node.length < 10) || (this.node.length>=10)&&( i%(parseInt(this.node.length/5))==0) )
                		{
                			this.xLine[i] = new Kinetic.Line({
                                name : "xLine"+i,
                                points: [    this.node[i].getX() - this.node[i].getOffset().x,
                                             this.plotYMargin+this.height+this.plotLength,
                                             this.node[i].getX() - this.node[i].getOffset().x,
                                             this.plotYMargin+this.height+2*this.plotLength],
                                stroke: 'black',
                                strokeWidth: 2,             
                            });
                            this.plotLayer.add(this.xLine[i]);               
                            this.xText[i] = new Kinetic.Text({
                                name : "xText"+i,
                                x: this.node[i].getX() - this.node[i].getOffset().x-30,
                                y: this.plotYMargin+this.height+this.plotLength*2,
                                text: this.node[i].getLabel(), ///////////////////////////////////////////
                                fontSize: 15,
                                fontFamily: 'Calibri',
                                fill: 'black',
                                width: 60,
                                align: 'center'    
                            });          
                            this.plotLayer.add(this.xText[i]);
                		}
                                    
                        
                    }
                	if( this.node.length < 10 )
            		{
	               	// 끝에 하나 더 그려주기 위해서 넣은 것 
	                	this.xLine[i] = new Kinetic.Line({
	                        name : "xLine"+i,
	                        points: [    this.node[i-1].getX() - this.node[i-1].getOffset().x + this.node[i-1].getWidth(),
	                                     this.plotYMargin+this.height+this.plotLength,
	                                     this.node[i-1].getX() - this.node[i-1].getOffset().x + this.node[i-1].getWidth(),
	                                     this.plotYMargin+this.height+2*this.plotLength],
	                        stroke: 'black',
	                        strokeWidth: 2,             
	                    });
	                    this.plotLayer.add(this.xLine[i]);               
	                    this.xText[i] = new Kinetic.Text({
	                        name : "xText"+i,
	                        x: this.node[i-1].getX() - this.node[i-1].getOffset().x-30 + this.node[i-1].getWidth(),
	                        y: this.plotYMargin+this.height+this.plotLength*2,
	                        text: parseFloat(this.node[i-1].getLabel())+this.bin , ///////////////////////////////////////////
	                        fontSize: 15,
	                        fontFamily: 'Calibri',
	                        fill: 'black',
	                        width: 60,
	                        align: 'center'    
	                    });          
	                    this.plotLayer.add(this.xText[i]);
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
