var Hist = {};		

(function() {	
	
	Hist = function(dataArr, optionObj) {
		this._initHist(dataArr, optionObj);		
		this._type = 'hist';
		objArr.push(this);
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
    };
	Hist.prototype = {
			
			_initHist: function(dataArr, optionObj){

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
	            	var xTmp = new Array();  // 獄쏅쵐��揶쏉옙占쏙옙��占쎈�已ワ옙占�	            	
	            	var freqTmp = new Array();  //frequency�쒙옙占쏙옙��
	            	var hasTmp = make2DArr(dataArr[this.x].length);
	            	freqTmp[cnt] = 1;
	            	hasTmp[cnt][0] = 0;
	            	xTmp[cnt++] = dataArr[this.x][0];
	            	isSelected[0].push(histUpdate(this, 0));
	            	for(i = 1 ; i < dataArr[this.x].length ; i++)
	            	{
	            		for(j = 0 ; j < xTmp.length ; j ++)
	            		{
	            			if(xTmp[j] == dataArr[this.x][i])
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
	            			xTmp.push(dataArr[this.x][i]);
	            			isSelected[i].push(histUpdate(this , j));
	            		}
	            	}
	            	var barWidth = this.width/freqTmp.length/2;
	            	var barGap = barWidth;
	            	this.xMax = parseInt(this.width/barWidth);
	            	
	            	var freqRank =make2DArr(freqTmp.length); 			// 占쎈뜆�わ옙醫됰젃占썩뫁��占썬끇已ワ㎕�λ떄占쏙옙占쎈베�곻옙�띾┛ 占쎄쑵釉��⑥눘��
	            	for(var i  = 0 ; i < freqRank.length ; i ++)
	            	{
	            		freqRank[i][0] = freqTmp[i];
	            		freqRank[i][1] = i;
	            	}
	            	freqRank.sort(function(a,b){return a[0] - b[0];});
	            	var nodeX = new Array(freqTmp.length);
	            	this.maxNode =freqRank[freqRank.length-1][1]; // Y Axis�쒙옙域밸챶�ワ옙占쏙옙�뽰뵬占쎄쑴肉됪틦��옙 域밸챶�곫묾怨쀬맄占쏙옙野껓옙
	            	this.xPlotArr = make2DArr(freqTmp.length);
 	            	for(var i  = 0 ; i < freqRank.length ; i ++)
	            	{
 	            	//	nodeX[freqRank[i][1]] = i;				// 占쏙옙cntTmp array�쒙옙占쎈챶諭띰옙占퐔揶쏅�諭억옙占쏙옙節뚮선餓ο옙�� 筌앾옙x 占쎄쑴�귨쭕占썼쳸遺쏀벊占쏙옙占쏙퐢�쀯옙占�
 	            		this.xPlotArr[i][0] = i*(barWidth+barWidth) + (barWidth+barWidth)/2;
 	            		this.xPlotArr[i][1] = xTmp[freqRank[i][1]];
	            		nodeX[freqRank[i][1]] = i*(barWidth+barWidth) + (barWidth)/2;
	            	}	            	
 	            	this.firstX = this.xPlotArr[0][0]-barWidth/2;  // x Axis�쒙옙域밸챶�ワ옙占쏙㎗�륁벉�븝옙苑�占쎌빓�댐쭪占썸뉩紐껋젻雅뚯눊由�占쎄쑵鍮�占쎌꼶��野껓옙 
	            	this.lastX = this.xPlotArr[this.xPlotArr.length-1][0]+barWidth/2; // x Axis�쒙옙域밸챶�ワ옙占쏙㎗�륁벉�븝옙苑�占쎌빓�댐쭪占썸뉩紐껋젻雅뚯눊由�占쎄쑵鍮�占쎌꼶��野껓옙 
 	            	var firstcnt = 0;
	            }else{
	            	
	            	var xMax = findMaxValue(dataArr[this.x]);			// xMax�쒙옙�믪눘占��닌뗫퉸占쏙옙barwidth�쒙옙�닌뗫퉸餓ο옙占쏙옙占쎈뜄�� 
	            	var xMin = findMinValue(dataArr[this.x]);
	            	var freqTmp = (xMin > 0 ) ? new Array(parseInt((xMax)/this.bin)+1) :  new Array(parseInt((xMax - xMin)/this.bin)+1); // frequency 占쎄쑴�녷에占쏙옙占쎌삢 
	            	var hasTmp = (xMin > 0 ) ? make2DArr(parseInt((xMax)/this.bin)+1) : make2DArr(parseInt((xMax -xMin)/this.bin)+1);  // has array�λ뜃由곤옙遺얜뮉 占쎌눖��筌ㅼ뮇釉숋옙占썲칰�뚯뒭占쏙옙dataArray[this.x].length嚥∽옙占쎈똻占쏙옙占�
	            	var upTmp = new Array(dataArr[this.x].length);
	            	var cnt = 0;
	            	for(var i = 0 ; i < freqTmp.length ; i ++ )
	            	{
	            		freqTmp[i] = 0;  // frequency 占쏙옙�ｏ옙醫됰낵 �λ뜃由곤옙占�	            		
	            	}
	            	
	            	for(var i = 0 ; i < dataArr[this.x].length ; i++)
	            	{
	            		if(xMin < 0)
	            		{
	            			cnt = parseInt((dataArr[this.x][i]+Math.abs(xMin))/this.bin);  // 占쎈���獄쏄퀣肉댐옙袁⑺뒄占쏙옙占썬끉堉긷첎�됵옙 野껉퀣��
	            		}else{
	            			cnt = parseInt(dataArr[this.x][i]/this.bin);
	            		}	            		
	            		freqTmp[cnt] ++ ; // 占쎈���쳸怨쀫였 frequency 占쎌꼶援뱄옙占쏙옙�롮젻雅뚯눊��
	            		hasTmp[cnt].push(i); // hasarray占쏙옙占쏙옙�ｏ옙�곻옙占쏙옙
	            		upTmp[i] = cnt;
	            		
	            	}
	            	
	            //	alert(freqTmp.length);
	            	for(var firstcnt = 0 ; firstcnt < freqTmp.length ; firstcnt++) // 筌ｌ꼷�ч겫占쎄숲 占쎈�逾믤틦��옙 0占쏙옙占쎌꼷�ㅿ옙遺울옙 占쏙옙�� 筌앾옙 frequency揶쏉옙0占쏙옙占쎄쑬��筌ｏ옙占쎈챶諭�野껓옙沅�
	            	{	            		
	            		if(freqTmp[firstcnt] != 0)
	            		{
	            			break;
	            		}
	            	}
	            	for(var lastcnt = freqTmp.length-1 ; lastcnt > -1  ;lastcnt--) // 占쎄쑴占�獄쏆꼶占썸에占쏙옙�밸퓠占쎌뮆占쏙옙占퐀requency揶쏉옙0占쏙옙占쎄쑬��筌ｏ옙占쎈챶諭�野껓옙沅�
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
	            		isSelected[i].push(histUpdate(this , upTmp[i]-firstcnt));
	            	}
            		var barWidth = this.width /(lastcnt-firstcnt + 3);	// 占쎈쵐�앾옙占�燁삳챷逾�占싼딆��븝옙占쎄퀡�わ옙占�3
	            	this.xPlotArr = make2DArr(lastcnt-firstcnt + 4); // �ο옙筌〓씮堉깍옙占쏙옙�롫뮉 x�곤옙scale占쏙옙4揶쏉옙占쏙옙占쎈�鍮먲옙占쏙쭕�뚮뼄. 
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
	            	this.firstX = this.xPlotArr[0][0];  // x Axis�쒙옙域밸챶�ワ옙占쏙㎗�륁벉�븝옙苑�占쎌빓�댐쭪占썸뉩紐껋젻雅뚯눊由�占쎄쑵鍮�占쎌꼶��野껓옙 
	            	this.lastX = this.xPlotArr[this.xPlotArr.length-1][0]; // x Axis�쒙옙域밸챶�ワ옙占쏙㎗�륁벉�븝옙苑�占쎌빓�댐쭪占썸뉩紐껋젻雅뚯눊由�占쎄쑵鍮�占쎌꼶��野껓옙 
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
	           
	            this.yMax = max; // 占쎌꼶��freqTmp 揶쏆뮇�붷첎占쏙쭗�뺤뻣占쎈챷占�占쎌꼷占쏙옙占썸뤃�釉�占쏙옙占쎈뜆�앲첋占쎌쨮 占썬끉肉됵옙占썸뤃�釉놂옙占�	            this.yMin = 0;	          
	            
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
			        document.getElementById('regcoords').value = divX+ ' , ' +divY;
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
					
					if(obj.node[id].getSelected() == 1 && selectOn == 0)		//unselect
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
					}else if(selectOn == 1){		// select
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
					}else if(selectOn == 2){ // hide
						var shapes = obj.stage.get('.' + id);
						shapes.apply('setAttrs', {
							x : obj.node[id].getX(),
							y : obj.node[id].getY() + (obj.node[id].getSelectCnt())*obj.height/obj.yMax/2,
							freq : (obj.node[id].getFreq()- obj.node[id].getSelectCnt()),
							height: obj.node[id].getHeight() - (obj.node[id].getSelectCnt())*obj.height/obj.yMax,
				    		opacity: 0.5,
				    		scale : {x:1, y:1},
				    		info : "Node : "+id+"\r\n"+"Frequency : "+(obj.node[id].getFreq()- obj.node[id].getSelectCnt()),
							offset : { y :  (obj.node[id].getHeight() - (obj.node[id].getSelectCnt())*obj.height/obj.yMax)/2}
						});
						obj.node[id].setSelected(0);
						obj.node[id].setSelectCnt(0);
					//	obj.node[id].hide();
					}else if(selectOn == 3){		// reset
						var shapes = obj.stage.get('.' + id);
						shapes.apply('setAttrs', {
							x : obj.node[id].getX(),
							y : obj.plotYMargin + obj.height - obj.node[id].getFreq()*obj.height/obj.yMax/2, 
							freq : obj.node[id].getHasArr().length,
							height: obj.node[id].getFreq()*obj.height/obj.yMax, 
				    		info : "Node : "+id+"\r\n"+"Frequency : "+ obj.node[id].getHasArr().length,
							offset : { y :  (obj.node[id].getFreq()*obj.height/obj.yMax)/2}
						});
						obj.node[id].setSelected(0);
						obj.node[id].setSelectCnt(0);
					}
				};
}
////////////////////////////////////////////////////////////////////////////////////////
