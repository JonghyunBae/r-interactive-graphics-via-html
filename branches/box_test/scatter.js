var Scatter = {};	

(function() {	
	
	Scatter = function(mainArr, optionObj) {
		this._initScatter(optionObj);		
		
    };
    Scatter.prototype = {
    		_initScatter: function(optionObj){
    			////////// Make essential variables ////////				
	            this.width = optionObj.width || plotWidth; //plot width
	            this.height = optionObj.height || plotHeight; //plot height
	            this.plotXMargin=this.width*0.2; //canvas left, right margin
	            this.plotYMargin=this.height*0.2; //canvas top, bottom margin
	            this.plotLength= (optionObj.plotLength==undefined)?(this.width*0.02):(optionObj.plotLength); //margin from plot box
	            this.radius= (optionObj.radius==undefined)?(3):(optionObj.radius); //default radius is 3
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
	           
	            if(optionObj.color==undefined){
	            	this.color=-1; //default color
	            }else{
            		for(var i = 0 ; i < labelArr.length ; i ++)
	  	            {
	  	            	if(labelArr[i].toLowerCase()==optionObj.color.toLowerCase()){	            		
	  	            		 this.color =  i;
	  	            		 break;
	  	            	}
	  	            	if(i==labelArr.length-1){
	  	            		alert('retype colors label');
	  	            	}
	  	            }	
        			var tmpSetColor =  setColor(mainArr[this.color]);
    				var colors = tmpSetColor.colors;
					var mainValueArrLength = tmpSetColor.mainValueArrLength;
					var tmpColorArr = tmpSetColor.tmpColorArr;
	            }	      
	           
	    		if(isDiscrete[this.x] == true)
	    		{
	    			var nodeX = new Array(mainArr[this.x].length); // discrete data일 경우 node 점의 좌표가 고정 되야 하므로 저장할 배열 선언 
	    			var xTmp = new Array();  // 밑의 각 항목 이름들 
	    			xTmp[0] = mainArr[this.x][0];
	    			nodeX[0] = 0;
	    			for(i = 1 ; i < mainArr[this.x].length ; i++)
	            	{
	            		for(j = 0 ; j < xTmp.length ; j ++)
	            		{
	            			if(xTmp[j] == mainArr[this.x][i])
	            			{
	            				nodeX[i] = j;
	            				break;
	            			}	            				
	            		}
	            		if(j == xTmp.length)
	            		{
	            			nodeX[i] = j;
	            			xTmp.push(mainArr[this.x][i]);
	            		}
	            	}
	    			this.xPlotArr = make2DArr(xTmp.length);
	    			var diff = this.width / (xTmp.length+1);
	    			for(var i = 1 ; i < this.xPlotArr.length+1 ; i ++)
	    			{
	    				this.xPlotArr[i-1][0] = i*diff;
	    				this.xPlotArr[i-1][1] = xTmp[i-1];
	    			}
	    			for(var i = 0 ; i < nodeX.length ; i++)
	    			{
	    				nodeX[i] = (nodeX[i]+1)*diff + this.plotXMargin;
	    			}
	    		}else{	    			
	    			this.xTick= (optionObj.xTick==undefined)?(5):(optionObj.xTick); //default x ticks is 5
	    			this.xMax = findMaxValue(mainArr[this.x]);
	    			var xMin = findMinValue(mainArr[this.x]);
	    			var xTickRange = (this.xMax - xMin)/this.xTick;
	    			var x = Math.ceil( Math.log(xTickRange) / Math.log(10));
	    			xTickRange = setTickRange(x, xTickRange);
		            this.xMax = xTickRange * Math.round(1+this.xMax/xTickRange);
		        	var xDiff = (parseInt(this.xMax/this.xTick)<1)?1:parseInt(this.xMax/this.xTick);//5 should be selected automatically later
		        	var diff = this.width / this.xTick;
		        	this.xPlotArr = make2DArr(this.xTick);		        	
	    			for(var i = 0 ; i < this.xPlotArr.length ; i ++)
	    			{
	    				this.xPlotArr[i][0] = i*diff;
	    				this.xPlotArr[i][1] = i*xDiff;
	    			}	    			
	    		}
	    		
	    		if(isDiscrete[this.y] == true)
	    		{
	    			var nodeY = new Array(mainArr[this.y].length);
	    			var yTmp = new Array();  // 밑의 각 항목 이름들 
	    			yTmp[0] = mainArr[this.y][0];
	    			nodeY[0] = 0;
	    			for(i = 1 ; i < mainArr[this.y].length ; i++)
	            	{
	            		for(j = 0 ; j < yTmp.length ; j ++)
	            		{
	            			if(yTmp[j] == mainArr[this.y][i])
	            			{
	            				nodeY[i] = j;
	            				break;
	            			}	            				
	            		}
	            		if(j == yTmp.length)
	            		{
	            			nodeY[i] = j;
	            			yTmp.push(mainArr[this.y][i]);
	            		}
	            	}
	    			this.yPlotArr = make2DArr(yTmp.length);
	    			var diff = this.height / (yTmp.length+1);
	    			for(var i = 1 ; i < yTmp.length+1 ; i ++)
	    			{
	    				this.yPlotArr[i-1][0] = i*diff;
	    				this.yPlotArr[i-1][1] = yTmp[i-1];
	    			}	    	
	    			for(var i = 0 ; i < nodeY.length ; i++)
	    			{
	    				nodeY[i] = this.plotYMargin + this.height -  (nodeY[i]+1)*diff ;
	    			}
	    		}else{
	    				var yTick= (optionObj.yTick==undefined)?(5):(optionObj.yTick); //default y ticks is 5        	            
			            this.yMax = findMaxValue(mainArr[this.y]);			            	            
			            var yMin = findMinValue(mainArr[this.y]);			           
			            var yTickRange = (this.yMax - yMin)/yTick;			            
			            var y = Math.ceil( Math.log(yTickRange) / Math.log(10));			            
			            yTickRange = setTickRange(y, yTickRange);			                        
			            this.yMax = yTickRange * Math.round(1+this.yMax/yTickRange);     			                       	                       
			    		var yDiff = (parseInt(this.yMax/yTick)<1)?1:parseInt(this.yMax/yTick); //5 should be selected automatically later
			        	var diff = this.height / yTick;
			        	this.yPlotArr = make2DArr(yTick);		        	
		    			for(var i = 0 ; i < this.yPlotArr.length ; i ++)
		    			{
		    				this.yPlotArr[i][0] = i*diff;
		    				this.yPlotArr[i][1] = i*yDiff;
		    			}
	    		}
	    		
	    		//결과적으로 discrete이던 아니든  yPlotArr와 xPlotArr에 각 점선표시(xLine, xText etc.) 좌표가들어 있다. 아래 draw에 있는  plot에서는 이 array들만 사용하여 그려주면 된다. 
	    		
	    		//////////Make Data Structure of nodes and essential arrays////////
				this.node = new Array();			
				for(var i = 0; i < mainArr[this.x].length ; i++)
				{
					this.node[i] = new Kinetic.Circle({
						//id: i,
						name: 'a', //dataGetName(i),
						x: (isDiscrete[this.x] == true) ?  nodeX[i] : mainArr[this.x][i]*(this.width/this.xMax)+this.plotXMargin,
						y: (isDiscrete[this.y] == true) ? nodeY[i] : mainArr[this.y][i]*(this.height/this.yMax)+this.plotYMargin + 2*( this.height/2+this.plotYMargin-(mainArr[this.y][i]*(this.height/this.yMax)+this.plotYMargin) ),
						radius: this.radius,
						fill: (this.color==-1)?('green'):getColor(i,colors, mainValueArrLength, tmpColorArr),
						stroke : 'black',
						strokeWidth : 0.01,
						opacity : 1,
						draggable : false,
						hidden : false,
						selected : 0
					});				
				}
	           
	            
    		},
			doIt: function() { 
				alert('do it'); 
			},
			draw: function(id){	
				//draw plot
				this.stage = new Kinetic.Stage({            
					container: 'scatterContainer'+id,            
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
				        points: [	this.plotXMargin+this.xPlotArr[i][0],
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
                    offset : {x: ('Scatter of ' + labelArr[this.x] + ' & ' + labelArr[this.y]).length/2 * 10, y:0},
                    text: 'Scatter of ' + labelArr[this.x] + ' & ' + labelArr[this.y],
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
				alert('scatter is updated');				
			}
	};
})();






function setColor(colorArr) //set color
{
	var colors = new Array();
	var mainValueArr = new Array();
    var tmpColorArr = new Array();
	
	var cnt=0;
	var sortedColorArr = make2DArr(colorArr.length);	
	for(var i=0; i<colorArr.length; i++){		
		sortedColorArr[i][0] = colorArr[i];
		sortedColorArr[i][1] = i;
	}
	sortedColorArr.sort(function(a,b){return a[0] - b[0];}); //sort colorArr and save into sortedColorArr	
	for(var i=0; i<sortedColorArr.length; i++){		
		if(i==0){
			mainValueArr[cnt]=sortedColorArr[0][0];
			tmpColorArr[0]=0;
		}else{
			for(var j=0; j<i ; j++){
				if(sortedColorArr[i][0]==sortedColorArr[j][0]){
					tmpColorArr[i]=tmpColorArr[j];
					break;
				}
			}	
			if(j==i){
				cnt++;
				mainValueArr[cnt]=sortedColorArr[i][0];
				tmpColorArr[i]=cnt;
			}
		}
	}
	if(mainValueArr.length<60){		
		colors = [	'#FF0000',  '#0000FF', '#FEFF00','#00FF00', '#FF7F00', '#7FFF00'	, '#FF00FE','#007FFF','#00FF7F','#00FFFE','#7F00FF',  '#FF007F',
	              		'#ED7763', '#7762ED', '#D8ED62','#62ED76', '#EDBC62',  '#93ED62','#ED62D8','#6293ED', '#62EDBB' ,'#62D8ED',  '#BC62ED', '#ED6293',
	              		'#BD6B70','#6B70BD','#BDB86B','#70BD6B','#BD8F6B','#98BD6B','#B86BBD','#6B99BD','#6BBD8F','#6BBDB8','#8F6BBD','#BD6B98',
	              		'#FE5078','#5078FE','#FED650','#78FE50','#FE7F50','#CEFE50','#D550FE','#50CFFE','#50FE7E','#50FED5','#7F50FE','#FE50CE',
	              		'#8B0000','#00008B','#8A8B00','#008B00','#8B4500','#458B00','#8B008A','#00458B','#008B45','#008B8A','#45008B','#8B0045'	];     
						//red, blue,  yellow, green, orange,yellow green,   pink, white blue, dark green, sky, purple, hot pink
	}else{
		var reTmpColorArr = new Array(); // re assign
		for(var i=0; i<sortedColorArr.length; i++){		// re assign
			reTmpColorArr[sortedColorArr[i][1]]=tmpColorArr[ i ]; 
		}
		for(var i=0; i<sortedColorArr.length; i++){		//re re assign
			tmpColorArr[i]=reTmpColorArr[i];	
		}
		
		var rgb = {R: new Array(), G: new Array(), B: new Array()}
		var start = {R:0, G:128, B: 0};
		var end = {R:0, G:255, B: 0};
		for(i = 0; i < mainValueArr.length; i++)
		{
			rgb.R[i] =parseInt( start.R + (i * (end.R - start.R)) / (mainValueArr.length-1) );
			rgb.G[i] =parseInt( start.G + (i * (end.G - start.G)) / (mainValueArr.length-1) );
			rgb.B[i] =parseInt( start.B + (i * (end.B - start.B)) / (mainValueArr.length-1) ); 
			colors[i] = 'rgb('+rgb.R[i]+','+rgb.G[i]+','+ rgb.B[i]+')';
		}
	}	
	return {colors: colors, mainValueArrLength: mainValueArr.length, tmpColorArr: tmpColorArr};
}

function getColor(n, colors, mainValueArrLength, tmpColorArr)
{
	if(mainValueArrLength<60){
		var tmpColor='green';
		tmpColor= colors[tmpColorArr[n]];	
		return tmpColor;		
	}else{
		var tmpColor='green';
		tmpColor= colors[tmpColorArr[n]];	
		return tmpColor;		
	}	
}

