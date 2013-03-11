var Hist = {};		

(function() {	
	
	Hist = function(mainArr, optionObj) {
		this._initHist(optionObj);		
    };
	Hist.prototype = {
			
			_initHist: function(optionObj){

				////////// Make essential variables ////////
				this.bin = optionObj.bin || 1;
	            this.width = optionObj.width || plotWidth; //plot width
	            this.height = optionObj.height || plotHeight; //plot height
	            this.plotXMargin=this.width*0.2; //canvas left, right margin
	            this.plotYMargin=this.height*0.2; //canvas top, bottom margin
	            this.plotLength=this.width*0.02; //margin from plot box
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
	            
	            if(isDiscrete[this.x] == true)
	            {
	            	var cnt = 0;
	            	var xTmp = new Array();
	            	var freqTmp = new Array();
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
	            	this.yMax = findMaxValue(freqTmp,0);
	            	this.xDiff = parseInt(this.xMax/2);
	            	this.yDiff = parseInt(this.yMax/2);
	           // 	alert("yMax " + this.yMax);	            	
	            	//////////Make Data Structure of nodes and essential arrays////////
	            	this.node = new Array();
	            	for(var cnt = 0; cnt< xTmp.length ; cnt++)
	            	{
	            		this.node[cnt] = new Kinetic.Rect({
							name: freqTmp[cnt],
							label : xTmp[cnt],
							x: this.plotXMargin +  cnt*(this.barGap+this.barWidth) + (this.barGap+this.barWidth)/2,
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
	            }else{
	            	this.xMax = findMaxValue(mainArr[this.x],0);			// xMax를 먼저 구해야 barwidth를 구해줄 수 있다. 
	            	this.barWidth = this.width /parseInt(this.xMax/this.bin); // 일단 barGap은 여기엔 넣지 않음. .
	            	this.barGap = optionObj.barGap || 0;
	            	var xTmp = new Array(parseInt(this.xMax/this.bin));  // 수직선에 찍히는 이름 저장할 꺼 -> 여기서는 bin
	            	var freqTmp = new Array(parseInt(this.xMax/this.bin)); // frequency 저장 
	            	var hasTmp = make2DArr(mainArr[this.x].length);  // has array초기화는 일단 최악의 경우인 mainArray[this.x].length로 해준다. 
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
	            	
	            	this.yMax = findMaxValue(freqTmp,0); // 얘는 freqTmp 개수가 몇개인지 나와야 구할 수 있으므로 뒤에서 구한다.
	            	this.xDiff = parseInt(this.xMax/3);
	            	this.yDiff = parseInt(this.yMax/5);	        	
	   
					//////////Make Data Structure of nodes and essential arrays////////
	            	this.node = new Array();
	            	for(var cnt = 0; cnt< xTmp.length ; cnt++)
	            	{
	            		this.node[cnt] = new Kinetic.Rect({
							name: freqTmp[cnt],
							label : xTmp[cnt],
							x: this.plotXMargin +  cnt*(this.barGap+this.barWidth) + (this.barGap+this.barWidth)/2,
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
	            }            				
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
                    points: [    this.plotXMargin, 
                                 this.plotYMargin+this.height+this.plotLength, 
                                 this.plotXMargin+parseInt(this.xMax/this.xDiff)*this.width/(this.xMax/this.xDiff), 
                                 this.plotYMargin+this.height+this.plotLength],
                    stroke: 'black',
                    strokeWidth: 2             
                });
                this.plotLayer.add(this.xAxis);
                this.yAxis = new Kinetic.Line({
                    points: [    this.plotXMargin-this.plotLength, 
                                 this.plotYMargin+this.height-parseInt(this.yMax/this.yDiff)*this.height/(this.yMax/this.yDiff),
                                 this.plotXMargin-this.plotLength,  
                                 this.plotYMargin+this.height],
                    stroke: 'black',
                    strokeWidth: 2             
                });                                
                this.plotLayer.add(this.yAxis);        
                this.xLine = new Array();
                this.xText = new Array();
                for(var i=0; i<parseInt(this.xMax/this.xDiff)+1; i++)
                {
                    this.xLine[i] = new Kinetic.Line({
                        name : "xLine"+i,
                        points: [    this.plotXMargin+i*this.width/(this.xMax/this.xDiff),
                                     this.plotYMargin+this.height+this.plotLength,
                                     this.plotXMargin+i*this.width/(this.xMax/this.xDiff),
                                     this.plotYMargin+this.height+2*this.plotLength],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
                    this.plotLayer.add(this.xLine[i]);               
                    this.xText[i] = new Kinetic.Text({
                        name : "xText"+i,
                        x: this.plotXMargin+i*this.width/(this.xMax/this.xDiff)-30,
                        y: this.plotYMargin+this.height+this.plotLength*2,
                        text: i*this.xDiff,
                        fontSize: 15,
                        fontFamily: 'Calibri',
                        fill: 'black',
                        width: 60,
                        align: 'center'    
                    });          
                    this.plotLayer.add(this.xText[i]);            
                }
                this.yLine = new Array();
                this.yText = new Array();
                for(var i=0; i<parseInt(this.yMax/this.yDiff)+1; i++)
                {
                    this.yLine[i] = new Kinetic.Line({
                        points: [    this.plotXMargin-this.plotLength, 
                                     this.plotYMargin+this.height-i*this.height/(this.yMax/this.yDiff) , 
                                     this.plotXMargin-2*this.plotLength,
                                     this.plotYMargin+this.height-i*this.height/(this.yMax/this.yDiff)],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
                    this.plotLayer.add(this.yLine[i]);       
                    this.yText[i] = new Kinetic.Text({
                        x: this.plotXMargin-this.plotLength*2-15,
                        y: this.plotYMargin+this.height-i*this.height/(this.yMax/this.yDiff)+30,
                        text: i*this.yDiff,
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


function findMaxValue(Data,bin)
{
	var maxValue=Data[0];

	var returnValue;
	for(var i=1; i<Data.length; i++)
	{
	//	document.write(maxValue + ", " +  Data[i] + "<br>");
		if(Data[i]>maxValue)
		{
//					document.write("dddddddddddddd");
			maxValue=Data[i];					
		}
//				document.write(maxValue + ", " +  Data[i] + "<br>");
	}
	returnValue=parseInt(maxValue+1);	
	for(var i=0; i<bin; i++) //until mod ==0
	{
		returnValue=returnValue+i;
		if((returnValue% bin) == 0)
		{
			break;
		}				
	}	
	return returnValue;
}
function histFindMaxValue(xMaxHist, xData,bin)
{
	var maxValue=0;
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMaxHist/bin +1); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMaxHist/bin +1); cnt++)
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*bin && xData[i]<(cnt+1)*bin)
			{
				tmpHistArr[cnt]++;
			}
		}
	}
	for(var i=0; i<parseInt(xMaxHist/bin +1); i++)
	{
		if(tmpHistArr[i]>maxValue)
		{
			maxValue=tmpHistArr[i];					
		}
	}	
	return maxValue;
}