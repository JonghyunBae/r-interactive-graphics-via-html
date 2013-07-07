var Box = {};    

(function() {    
    
    Box = function(dataArr, optionObj) {
        this._initBox(dataArr, optionObj);        
        this._type = 'box';
        objArr.push(this);
		this.tmpShift = false;
		this.preId = {x : -1, y : -1};
        
    };
    Box.prototype = {
            
            _initBox: function(dataArr, optionObj){
                ////////// Make essential variables ////////                
                this.width = optionObj.width || plotWidth; //plot width
                this.height = optionObj.height || plotHeight; //plot height
                this.plotXMargin=this.width*0.2; //canvas left, right margin
                this.plotYMargin=this.height*0.2; //canvas top, bottom margin
                this.plotLength= (optionObj.plotLength==undefined)?(this.width*0.02):(optionObj.plotLength); //margin from plot box
                this.radius= (optionObj.radius==undefined)?(2):(optionObj.radius); //default radius is 2
                
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
                for(var i = 0 ; i < labelArr.length ; i ++)
                {
                    if(labelArr[i].toLowerCase()==optionObj.y.toLowerCase()){                        
                         this.y =  i;
                         break;
                    }
                    if(i==labelArr.length-1){
                        alert('retype y label');
                    }
                }
                
                if(isDiscrete[this.y] == true)
                {
                	alert('y axis should be continuous');
                }

                var nodeX = new Array(dataArr[this.x].length);
                this.xTick= (optionObj.xTick==undefined)?(5):(optionObj.xTick);
                var xTmp = boxMakeAxisArr(dataArr, this.width, this.x, this.xTick); // node가 찍혀야할 nodeX array에 저장. x좌표가 찍혀야할 좌표 위치와 이름이 xPlotArr에 저장된다. 
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
							isSelected[outliersArr[i][j]].push(boxUpdate(this, xMainValueArr.length+j+cnt1)); //update "outliers" into isSelected 
					    }
					    cnt1=cnt1+outliersArr[i].length;	  
						for(var j=0; j<boxHasArr[i].length; j++) //update "boxHasArr without outliers" into isSelected 
						{
						    isSelected[boxHasArr[i][j]].push(boxUpdate(this, i));
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
				//alert(mainValueArrLength);
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
	                
	         //       
	        //        alert(medianXPos+','+q3[i]+','+median[i]+','+this.boxWidth+', boxHasArr : '+boxHasArr[i].length); 
	         //   	alert('rec');
	                this.node[i] = new Kinetic.Rect({  	
	                    //id: i,
	                    name : i,
	                    freq: boxHasArr[i].length,
	                    x: medianXPos, //////////////////////////////////???????????????????????????
	                    y: medianYPos-(q3[i]-median[i])*this.height/(yMax - yMin), //this.median[i],
	                    stroke : 'black',
	                    fill : 'green',
	                    radius : this.radius,
	                    width:  this.boxWidth[0],
	                    height: (q3[i]-q1[i])*this.height/(yMax - yMin),
	                //    strokeWidth : 0.01,
	                    opacity : 0.5,
	                    offset : {x: this.boxWidth[0]/2},
	                //    draggable : false,
	                    hidden : 0,
	                    selected : 0,
	                    selectCnt : 0,
	                    info :  "boxNode : "+i+"\r\n"+"Frequency : "+boxHasArr[i].length,
	                    hasArr : boxHasArr[i]
	                });         
	                for(var j = 0; j < outliersArr[i].length ; j++) //for discontinuous data, this.xPlotArr.length is used, for continuous data, it should be just 1.
	                {
	                	//outlierHasArr.push(outliersArr[i][j]);
	                //	alert('out '+(mainValueArrLength+j+cnt));
	                    this.node[mainValueArrLength+j+cnt] = new Kinetic.Circle({
	                        name : mainValueArrLength+j+cnt,
	                        isOutlier : true,
	                        x: this.plotXMargin + (i+1) * (this.width) / (mainValueArrLength+1), //////////////////////////////////???????????????????????????
	                        y: this.height +this.plotYMargin - (dataArr[this.y][outliersArr[i][j]]-yMin)*this.height/(yMax - yMin), //this.median[i],
							radius: this.radius,
							stroke: 'green',
							strokeWidth: 1,
							opacity : 0.5,
	                        fill : 'green',
	                        hidden : 0,
	                        selected : 0,
	                        info : "Node : "+outliersArr[i][j]+"\r\nboxNode : "+(mainValueArrLength+j+cnt)+"\r\n"+tooltipTextGetInfo[outliersArr[i][j]]+"\r\n",
	                        hasArr : outliersArr[i][j]
	                    });                  
	                   
	        //            document.writeln("<br>"+outliersArr[i][j]);
	                } 
	                cnt=cnt+outliersArr[i].length;	      
	                
	            //    alert('line1 '+(mainValueArrLength+outliersArrLength+i*3));
	           //     alert('line2 '+(mainValueArrLength+outliersArrLength+i*3+1));
	            //    alert('line3 '+(mainValueArrLength+outliersArrLength+i*3+2));
	             //  alert(outliersArrLength);
	                 this.node[mainValueArrLength+outliersArrLength+i*3]= new Kinetic.Line({
	               //     name : i,
	                    x: medianXPos,
	                    y: medianYPos,
	                    points: [0, 0, this.boxWidth[0], 0],
	                    opacity : 0.5,
	                    offset : {x: this.boxWidth[0]/2},
	                    stroke: 'black',
	                //    info: "Node : "+i+"\r\n"+"Frequency : "+boxHasArr[i].length,
	                    strokeWidth: '4'
	                });        
	                this.node[mainValueArrLength+outliersArrLength+i*3+1]= new Kinetic.Line({
	                 //   name : i,
	                    x: medianXPos,
	                    y: medianYPos,
	                    points: [    0,  (median[i]-maxBelowFence[i])*this.height/(yMax - yMin),
	                                 0, (median[i]-q3[i])*this.height/(yMax - yMin)],
	                    opacity : 0.5,
	              //      info: "Node : "+i+"\r\n"+"Frequency : "+boxHasArr[i].length,
	                    stroke: 'black'
	                });    
	                this.node[mainValueArrLength+outliersArrLength+i*3+2]= new Kinetic.Line({
	             //       name : i,
	                    x: medianXPos,
	                    y: medianYPos,
	                    points: [    0, (median[i]-q1[i])*this.height/(yMax - yMin),
	                                 0, (median[i]-minAboveFence[i])*this.height/(yMax - yMin)],
	                    opacity : 0.5,
	             //       info: "Node : "+i+"\r\n"+"Frequency : "+boxHasArr[i].length,
	                    stroke: 'black'
	                });    
	             //   alert('end');
	               
	                          
	              //  document.write("out+ <br>");                
	             //   document.writeln("@@boxHasArr : "+boxHasArr[i]);
	            }    
	           
	            
				
            },
            doIt: function() { 
                alert('do it'); 
            },
            draw: function(id){    
            	
            	document.getElementById('boxContainer'+id).onmousemove =getCoords;
				document.getElementById('boxContainer'+id).onclick = function() {
			        document.getElementById('regcoords').value = divX+ ' , ' +divY;
			    };
                //draw plot
                this.stage = new Kinetic.Stage({            
                    container: 'boxContainer'+id,            
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
                    if(i % parseInt(this.node.length/20) == 0)
                    {
                        this.stage.add(this.dataLayer);
                        this.dataLayer = new Kinetic.Layer();
                    }
                    this.dataLayer.add(this.node[i]);
                    
                } 
                this.stage.add(this.dataLayer);
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
			        //pointerDirection: 'down',
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
function findQuartile(Data, _th)//_th =1, return Q1
{     
    var p=_th/4;
    var n=Data.length;
    var j=parseInt(n*p);
    var g=n*p-j;
   
    if(g==0){
        return (Data[j-1]+Data[j])/2;
    }else{ //g>0
        return Data[j];
    }
    
}

function findMaxBelowFence(Data, index, q1, q3)
{
    var iqr = q3-q1;    
    var fence = q3 + 1.5*iqr;
    var outliers = new Array();
    var j=0;
    var maxValue=q3;
    for(var i=0; i<Data.length; i++)
    {    
        if(i==index[j])
        {  
            if(Data[i] > maxValue && Data[i] <= fence){
                maxValue=Data[i];            
            }else if(Data[i] > fence){
                outliers.push(i);               
            }            
            j++;
        }
    }    
    return {max : maxValue, outliers : outliers};    
}
function findMinAboveFence(Data, index, q1, q3)
{
    var iqr = q3-q1;    
    var fence = q1 - 1.5*iqr;
    var outliers = new Array();
    var j=0;    
    var minValue=q1;
    
    for(var i=0; i<Data.length; i++)
    {    
        if(i==index[j])
        {   
            if(Data[i] < minValue && Data[i] >= fence){
                minValue=Data[i];    
            }else if(Data[i] < fence){
                outliers.push(i);                
            }            
            j++;
        }    
    }
    //outliers.push('NaN');
    return {min : minValue, outliers : outliers};    
}
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

// 중앙값 계산 함수
// 크기 순으로 이미 정렬된 배열을 입력해야만 합니다
// 범용성을 위해서 이 함수 자체에는 정렬 기능 미포함
function findMedianValue(array) {
      if (array.length == 0) return NaN; // 빈 배열은 에러 반환(NaN은 숫자가 아니라는 의미임)
      var center = parseInt(array.length / 2); // 요소 개수의 절반값 구하기
    
      if (array.length % 2 == 1) { // 요소 개수가 홀수면
        return array[center]; // 홀수 개수인 배열에서는 중간 요소를 그대로 반환
      } else {
        return (array[center - 1] + array[center]) / 2.0; // 짝수 개 요소는, 중간 두 수의 평균 반환
      }
}
*/
function boxMakeAxisArr(dataArr, length, axis, tick)     //from scatter.js, so this function can be put into common.js later
{                                                        // return은 x좌표와 x좌표 이름이 찍혀있는 plotArr와 node가 찍혀야할 좌표가 node에 저장되어 return된다. 
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
        tmp.sort();//only difference with scatter!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111
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
                plotArr[i][1] = (min+i*tickRange).toFixed(tickRange.toString().substring(tickRange.toString().indexOf('.')+1,tickRange.toString().length).length);
            }
        }        
        //alert(obj.plotXMargin);
        for(var i = 0 ; i < node.length ; i ++)
        {
            node[i] = length* ((dataArr[axis][i]-min)) /((max - min));
        }
    //    alert(node);
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
					}else if(selectOn == 2){ // hide
						if(obj.node[id].getIsOutlier()){//if isOutlier ==true
							obj.node[id].setStroke(obj.node[id].getFill());
							obj.node[id].setScaleX(1);
							obj.node[id].setScaleY(1);
							obj.node[id].setSelected(2);
							obj.node[id].hide();
						}else{
							obj.node[id].setFreq(obj.node[id].getFreq()- obj.node[id].getSelectCnt());
							obj.node[id].setInfo("boxNode : "+id+"\r\n"+"Frequency : "+(obj.node[id].getFreq())); // dependancy with previous line.
							obj.node[id].setOpacity(0.5);
							obj.node[id].setSelected(0);
							obj.node[id].setSelectCnt(0);
						}
					}else if(selectOn == 3){		// reset
						if(obj.node[id].getIsOutlier()){//if isOutlier ==true
							obj.node[id].setSelected(0);
							obj.node[id].show();	
						}else{
							obj.node[id].setFreq(obj.node[id].getHasArr().length);
							obj.node[id].setInfo("boxNode : "+id+"\r\n"+"Frequency : "+ obj.node[id].getHasArr().length);
							obj.node[id].setSelectCnt(0);
						}
					}
				};
}
////////////////////////////////////////////////////////////////////////////////////////
