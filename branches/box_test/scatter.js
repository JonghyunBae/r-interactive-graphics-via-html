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
	            this.radius= (optionObj.radius==undefined)?(3):(optionObj.radius);
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
	            }
	            this.xMax = scatterFindMaxValue(mainArr[this.x]);	            
	            this.yMax = scatterFindMaxValue(mainArr[this.y]);
	        	this.xDiff = parseInt(this.xMax/5);//5 should be selected automatically later
	    		this.yDiff = parseInt(this.yMax/5); //5 should be selected automatically later
	    		//////////Make Data Structure of nodes and essential arrays////////
				this.node = new Array();			
				for(var i = 0; i < mainArr[this.x].length ; i++)
				{
					this.node[i] = new Kinetic.Circle({
						//id: i,
						name: 'a', //dataGetName(i),
						x: mainArr[this.x][i]*(this.width/this.xMax)+this.plotXMargin,
						y: mainArr[this.y][i]*(this.height/this.yMax)+this.plotYMargin + 2*( this.height/2+this.plotYMargin-(mainArr[this.y][i]*(this.height/this.yMax)+this.plotYMargin) ),
						radius: this.radius,
						fill: (this.color==-1)?('green'):setColor(mainArr[this.color],i),
						stroke : 'black',
						strokeWidth : 0.01,
						opacity : 0.5,
						draggable : false,
						hidden : false,
						selected : 0
					});				
				}
				/*
	    		
	    		var scatterColor = mainArr[0];
	    		var legend = true;
//	    		var scatterColor = 'default';
//	    		var legend = false;
    			*/
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
				for(var i=0; i<parseInt(this.xMax/this.xDiff)+1; i++)
				{
				    this.xLine[i] = new Kinetic.Line({
				        name : "xLine"+i,
				        points: [	this.plotXMargin+i*this.width/(this.xMax/this.xDiff),
				                     this.plotYMargin+this.height+this.plotLength,
				                     this.plotXMargin+i*this.width/(this.xMax/this.xDiff),
				                     this.plotYMargin+this.height+2*this.plotLength],
				        stroke: 'black',
				        strokeWidth: 2,             
				    });
				    this.plotLayer.add(this.xLine[i]);               
				    this.xText[i] = new Kinetic.Text({
				        name : "xText"+i,
				        x: this.plotXMargin+i*this.width/(this.xMax/this.xDiff)-15,
				        y: this.plotYMargin+this.height+this.plotLength*2,
				        text: i*this.xDiff,
				        fontSize: 15,
				        fontFamily: 'Calibri',
				        fill: 'black',
				        width: 30,
				        align: 'center'    
				    });          
				    this.plotLayer.add(this.xText[i]);            
				} 
				this.yLine = new Array();
                this.yText = new Array();
                for(var i=0; i<parseInt(this.yMax/this.yDiff)+1; i++)
                {
                    this.yLine[i] = new Kinetic.Line({
                        points: [	this.plotXMargin-this.plotLength, 
                                     this.plotYMargin+this.height-i*this.height/(this.yMax/this.yDiff) , 
                                     this.plotXMargin-2*this.plotLength,
                                     this.plotYMargin+this.height-i*this.height/(this.yMax/this.yDiff)],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
                    this.plotLayer.add(this.yLine[i]);       
                    this.yText[i] = new Kinetic.Text({
                        x: this.plotXMargin-this.plotLength*2-15,
                        y: this.plotYMargin+this.height-i*this.height/(this.yMax/this.yDiff)+15,
                        text: i*this.yDiff,
                        fontSize: 15,
                        fontFamily: 'Calibri',
                        fill: 'black',
                        width: 30,
                        align: 'center',
                        rotation: (Math.PI)*3/2
                    });           
                    this.plotLayer.add(this.yText[i]);        
                }    
                this.xLabel = new Kinetic.Text({
                    name : 'xLabel',
                    x: this.plotXMargin+this.width/2,
                    y: this.plotYMargin+this.height+4*this.plotLength,
                    offset : {x: labelArr[this.x].length/2 * 10, y:0},
                    text: labelArr[this.x],
                    fontSize: 15,
                    fontFamily: 'Calibri',
                    fill: 'black',
                });                                   
                this.plotLayer.add(this.xLabel);
                this.yLabel = new Kinetic.Text({
                    x: this.plotXMargin-5*this.plotLength,
                    y: this.plotYMargin+this.height/2  - labelArr[this.y].length/2 * 5,
                    offset : {x: labelArr[this.y].length/2 * 10},
                    text: labelArr[this.y],
                    fontSize: 15,
                    fontFamily: 'Calibri',
                    fill: 'black',
                    rotation: (Math.PI)*3/2
                });    
                this.plotLayer.add(this.yLabel);    
                this.mainLabel = new Kinetic.Text({
                    name : 'mainLabel',
                    x: this.plotXMargin+this.width/2, 
                    y: this.plotYMargin *0.5 ,
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

function scatterFindMaxValue(Data)
{
	var maxValue=Data[0];
	for(var i=1; i<Data.length; i++)
	{
		if(Data[i]>maxValue)
		{
			maxValue=Data[i];					
		}
	}
	return parseInt(maxValue+1);
}
function setColor(colorArr,n){
	
	
	/*  if(isDiscrete[this.x] == true)
      {
      	var cnt = 0;
      	var xTmp = new Array();
      	var freqTmp = new Array();
      	this.node = new Array();
      	freqTmp[cnt] = 1;
      	xTmp[cnt++] = mainArr[this.x][0];
      	for(i = 1 ; i < mainArr[this.x].length ; i++)
      	{
	      	for(j = 0 ; j < xTmp.length ; j ++)
	      	{
		      	if(xTmp[j] == mainArr[this.x][i])
		      	{
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
      }*/
	
	//setColor(mainArr[this.color],i),
	var cnt=0;
	var mainValueArr = new Array();
	var tmpColorArr = new Array();
	for(var i=0; i<colorArr.length; i++){		
		if(i==0){
			mainValueArr[cnt]=colorArr[0];
			tmpColorArr[0]=0;
			cnt++;
		}
		for(var j=0; j<cnt; j++){
			if(colorArr[i]==mainValueArr[j]){
				break;
			}
		}		
		if(j==cnt){
			mainValueArr[cnt]=colorArr[i];				
			cnt++;
			tmpColorArr[i]=cnt;
		}else{
			tmpColorArr[i]=cnt;
		}
	}
//alert(mainValueArr.length);
	
	if(mainValueArr.length<60){
		var tmpColor='green';
		var colors = [	'#FF0000', '#FF7F00','#FEFF00', '#7FFF00','#00FF00'	,'#00FF7F','#00FFFE', '#007FFF', '#0000FF', '#7F00FF', '#FF00FE', '#FF007F',
		              		'#ED7763', '#EDBC62', '#D8ED62', '#93ED62','#62ED76', '#62EDBB' ,'#62D8ED', '#6293ED', '#7762ED', '#BC62ED','#ED62D8', '#ED6293',
		              		'#BD6B70','#BD8F6B','#BDB86B','#98BD6B','#70BD6B','#6BBD8F','#6BBDB8','#6B99BD','#6B70BD','#8F6BBD','#B86BBD','#BD6B98',
		              		'#FE5078','#FE7F50','#FED650','#CEFE50','#78FE50','#50FE7E','#50FED5','#50CFFE','#5078FE','#7F50FE','#D550FE','#FE50CE',
		              		'#8B0000','#8B4500','#8A8B00','#458B00','#008B00','#008B45','#008B8A','#00458B','#00008B','#45008B','#8B008A','#8B0045'	];     
		tmpColor= colors[tmpColorArr[n]];	
		return tmpColor;
		
	}else{
		var colors = new Array();
		var R=0;
		var G=128;
		var B=0;
		for(var i=0; i<mainValueArr.length; i++){
			R=R+i;
			G=G+i;
			B=B+i;
			colors[i] = 'rgb('+R+','+G+','+ B+')';
		}				
		tmpColor= colors[tmpColorArr[n]];	
		return tmpColor;
		
	}
	
	
}
