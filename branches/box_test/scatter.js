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
	            	setColor(mainArr[this.color]);
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
						fill: (this.color==-1)?('green'):getColor(i),
						stroke : 'black',
						strokeWidth : 0.01,
						opacity : 1,
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


var Quicksort = (function() {
	 
	/**
	* Swaps two values in the heap
	*
	* @param {int} indexA Index of the first item to be swapped
	* @param {int} indexB Index of the second item to be swapped
	*/
	function swap(array, indexA, indexB) {
	var temp = array[indexA];
	array[indexA] = array[indexB];
	array[indexB] = temp;
	}
	 
	/**
	* Partitions the (sub)array into values less than and greater
	* than the pivot value
	*
	* @param {Array} array The target array
	* @param {int} pivot The index of the pivot
	* @param {int} left The index of the leftmost element
	* @param {int} left The index of the rightmost element
	*/
	function partition(array, pivot, left, right) {
	 
	var storeIndex = left,
	pivotValue = array[pivot];
	 
	// put the pivot on the right
	swap(array, pivot, right);
	 
	// go through the rest
	for(var v = left; v < right; v++) {
	 
	// if the value is less than the pivot's
	// value put it to the left of the pivot
	// point and move the pivot point along one
	if(array[v] < pivotValue) {
	swap(array, v, storeIndex);
	storeIndex++;
	}
	}
	 
	// finally put the pivot in the correct place
	swap(array, right, storeIndex);
	 
	return storeIndex;
	}
	 
	/**
	* Sorts the (sub-)array
	*
	* @param {Array} array The target array
	* @param {int} left The index of the leftmost element, defaults 0
	* @param {int} left The index of the rightmost element,
	defaults array.length-1
	*/
	function sort(array, left, right) {
	 
	var pivot = null;
	 
	if(typeof left !== 'number') {
	left = 0;
	}
	 
	if(typeof right !== 'number') {
	right = array.length - 1;
	}
	 
	// effectively set our base
	// case here. When left == right
	// we'll stop
	if(left < right) {
	 
	// pick a pivot between left and right
	// and update it once we've partitioned
	// the array to values < than or > than
	// the pivot value
	pivot = left + Math.ceil((right - left) * 0.5);
	newPivot = partition(array, pivot, left, right);
	 
	// recursively sort to the left and right
	sort(array, left, newPivot - 1);
	sort(array, newPivot + 1, right);
	}
	 
	}
	 
	return {
	sort: sort
	};
	 
	})();

function setColor(colorArr){
	//setColor(mainArr[this.color],i),
	var cnt=0;
	  var sortedArr = make2DArr(colorArr.length);
	
	for(var i=0; i<colorArr.length; i++){		
	//	sortedArr[i] = colorArr[i];	
		sortedArr[i][0] = parseFloat(colorArr[i]); //colorArr[i] value is now string, for sorting, we need to change it to number
		sortedArr[i][1] = i;	
		
	}
	
	//alert('1');
	//Quicksort.sort(sortedArr);
//	alert(sortedArr);
//	Quicksort.sort(sortedArr);
	
	sortedArr.sort(
			function(a,b){return a[0] - b[0];}
	);	
	
	for(var i=0; i<colorArr.length; i++){	
			document.write(sortedArr[i][0]+','+ sortedArr[i][1]+'</br>');
			
	}
	
	
	//for(var i=0; i<colorArr.length; i++){		
	//	alert(sortedArr[i][1]);
	//}
	
	//sortedArr.sort();
	//colorArr=quickSort(colorArr);	
	//for(var i=0; i<colorArr.length; i++){	
	//	document.write(sortedArr[i]+'</br>');
//	}
	//alert(mainArr[3]);
	
	//alert(sortedArr[0]);
	//alert(sortedArr[1]);
	
	for(var i=0; i<sortedArr.length; i++){		
		if(i==0){
			mainValueArr[cnt]=sortedArr[0][0];
			tmpColorArr[0]=0;//////////////////////
			//cnt++;
			//alert('i==0');
		}else{
			for(var j=0; j<(i); j++){
				if(sortedArr[i][0]==sortedArr[j][0]){
			//		alert('j'+j);
				//	alert('j'+j+'tmp'+tmpColorArr[j]);
					tmpColorArr[i]=tmpColorArr[j];//////////////////////
					break;
				}
			}		
		//	alert('j is : '+j+'cnt is '+cnt);
			if(j==(i)){
				//alert('j==cnt');
				cnt++;
				mainValueArr[cnt]=sortedArr[i][0];
				tmpColorArr[i]=cnt;///////////////////////
				
			}else{
			//	tmpColorArr[i]=cnt;//////////////////////
			//	cnt++;
			}
		}
//	alert('i : '+i+', tmpColorArr : '+tmpColorArr[i]+', cnt : '+cnt+', main : '+mainValueArr[cnt]);
	}
//	alert(cnt);
//	alert(mainValueArr.length);
	var reTmpColorArr = new Array(); // re assign
	
	var cccnt=0;
	//alert(sortedArr[1][1]);
	for(var i=0; i<sortedArr.length; i++){		// re assign
		
		reTmpColorArr[sortedArr[i][1]]=tmpColorArr[ i ]; ////////i iiiiiiiiiiiiiii
		
		  
	}
	
	for(var i=0; i<sortedArr.length; i++){		// re assign
		
	//	alert(reTmpColorArr[i]);////////i iiiiiiiiiiiiiii
	}
//	alert(cccnt);
	/*
	reTmpColorArr[0]=tmpColorArr[0];
	reTmpColorArr[1]=tmpColorArr[12];
	reTmpColorArr[2]=tmpColorArr[30];
	reTmpColorArr[11]=tmpColorArr[1];
	reTmpColorArr[22]=tmpColorArr[2];
	reTmpColorArr[33]=tmpColorArr[3];
	*/
	
	
	for(var i=0; i<sortedArr.length; i++){		//re re assign
		tmpColorArr[i]=reTmpColorArr[i];		
	//	alert(i+','+ tmpColorArr[i]);
	}
	
	
	if(mainValueArr.length<60){
		colors = [	'#FF0000',  '#0000FF', '#FEFF00','#00FF00', '#FF7F00', '#7FFF00'	, '#FF00FE','#007FFF','#00FF7F','#00FFFE','#7F00FF',  '#FF007F',
	              		'#ED7763', '#7762ED', '#D8ED62','#62ED76', '#EDBC62',  '#93ED62','#ED62D8','#6293ED', '#62EDBB' ,'#62D8ED',  '#BC62ED', '#ED6293',
	              		'#BD6B70','#6B70BD','#BDB86B','#70BD6B','#BD8F6B','#98BD6B','#B86BBD','#6B99BD','#6BBD8F','#6BBDB8','#8F6BBD','#BD6B98',
	              		'#FE5078','#5078FE','#FED650','#78FE50','#FE7F50','#CEFE50','#D550FE','#50CFFE','#50FE7E','#50FED5','#7F50FE','#FE50CE',
	              		'#8B0000','#00008B','#8A8B00','#008B00','#8B4500','#458B00','#8B008A','#00458B','#008B45','#008B8A','#45008B','#8B0045'	];     
						//red, blue,  yellow, green, orange,yellow green,   pink, white blue, dark green, sky, purple, hot pink
	}else{
		var rgbR = new Array();
		var rgbG = new Array();
		var rgbB = new Array();
		
		var startR=0;
		var startG=128;
		var startB=0;
		var endR=0;
		var endG=255;
		var endB=0;
		for(i = 0; i < mainValueArr.length; i++)
		{
			rgbR[i] =parseInt( startR + (i * (endR - startR)) / (mainValueArr.length-1) );
			rgbG[i] =parseInt( startG + (i * (endG - startG)) / (mainValueArr.length-1) );
			rgbB[i] =parseInt( startB + (i * (endB - startB)) / (mainValueArr.length-1) ); 
			
		//	alert(rgbR[i]+','+rgbG[i]+','+rgbB[i]);
			//alert(colors);
			colors[i] = 'rgb('+rgbR[i]+','+rgbG[i]+','+ rgbB[i]+')';
	//	alert(colors[i]);
		}
	}
	
	//alert(mainValueArr.length);
}
function getColor(n){
	if(mainValueArr.length<60){
		var tmpColor='green';
		tmpColor= colors[tmpColorArr[n]];	
		//alert(tmpColorArr[n]);
		return tmpColor;
		
	}else{
		
		var tmpColor='green';
		//alert('1');
		/*for(var i=0; i<mainValueArr.length; i++){
			
			R=R+i;
			G=G+i;
			B=B+i;
			colors[i] = 'rgb('+R+','+G+','+ B+')';
		}				*/
	//	alert(tmpColor);
		
		tmpColor= colors[tmpColorArr[n]];	
		//tmpColor= 'rgb(0,128,0)';		
	//	alert(tmpColor);
	//	alert(tmpColor);
		return tmpColor;		
	}	
}

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
