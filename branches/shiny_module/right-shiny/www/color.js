function setColor(dataArr, isDiscrete)
{
	if(isDiscrete == true){
		var temp = this.calcXArr(dataArr);
		return makeColor_discrete(temp.xArr, temp.index);
	}else{
		var temp = this.calcXArr(dataArr);
		return makeColor_continuous(dataArr); // under construction.
	}
}
function makeColor_continuous(array) // under construction.
{

	var ret = new Object(); //return object
	ret.isDiscrete = false;
	
	var colors = new Array();	
	var mainValueArr = new Array();
    var tmpColorArr = new Array();
	var reTmpColorArr = new Array();
	var cnt=0;
	var j = 0;
	var sortedColorArr = new Array();	
	for(var i = 0; i < array.length ; i ++){
		sortedColorArr[j] = {
				a : array[i],
				b : j
		};
		j ++;
	}
	var stableSort = function(a,b) { //stable sort is needed because Chrome does not support stable sort.
	    if (a.a === b.a) return a.stableSortKey > b.stableSortKey ? 1 : -1;
	    if (a.a > b.a) return 1;
	    return -1;
	};
	for (i = 0; i < sortedColorArr.length; i++) {
		sortedColorArr[i].stableSortKey = i;
	}
	sortedColorArr.sort(stableSort); //sort stably colorArr (temporarily saved in sortedColorArr)
	for(var i=0; i<sortedColorArr.length; i++){		
		if(i==0){
			mainValueArr[cnt]=sortedColorArr[0].a;
			tmpColorArr[0]=0;
		}else{
			if(sortedColorArr[i].a==sortedColorArr[i-1].a){
				
				tmpColorArr[i]=cnt;
			}else{
				cnt++;
				mainValueArr[cnt]=sortedColorArr[i].a;
				tmpColorArr[i]=cnt;
			}
		}
	}
	for(var i=0; i<sortedColorArr.length; i++){		// re assign
		reTmpColorArr[sortedColorArr[i].b]=tmpColorArr[ i ]; 
	}
	for(var i=0; i<sortedColorArr.length; i++){		//re re assign
		tmpColorArr[i]=reTmpColorArr[i];	
	}
	var rgb = {R: new Array(), G: new Array(), B: new Array()};
	var start = {R:0, G:128, B: 0};
	var end = {R:0, G:255, B: 0};
	for(i = 0; i < mainValueArr.length; i++)
	{
		rgb.R[i] =parseInt( start.R + (i * (end.R - start.R)) / (mainValueArr.length-1) );
		rgb.G[i] =parseInt( start.G + (i * (end.G - start.G)) / (mainValueArr.length-1) );
		rgb.B[i] =parseInt( start.B + (i * (end.B - start.B)) / (mainValueArr.length-1) ); 
		colors[i] = 'rgb('+rgb.R[i]+','+rgb.G[i]+','+ rgb.B[i]+')';
	}
	var indexArr = new Array(array.length);
	for(i = 0 ; i < array.length; i++){
		indexArr[i]=colors[tmpColorArr[i]]
	}
	ret.mainValueArr = mainValueArr;
 	ret.colors = colors;
	ret.indexArr = indexArr;
 	return ret;
}
function makeColor_discrete(array)
{
	var ret = new Object();
	ret.isDiscrete = true;
	ret.label = new Array();
	var colors = new Array();
	var indexArr = new Array(array.length);
	var rgb = {R: new Array(), G: new Array(), B: new Array()};
 	var rgbFreq = 4.8 / array.length;
 	var rgbCenter = 128;
 	var rgbWidth = 127;
 	for(var i = 0 ; i < array.length ; ++ i)
 	{
 		rgb.R[i]  = parseInt( Math.sin(rgbFreq*i + 0) * rgbWidth + rgbCenter );
 		rgb.G[i] = parseInt( Math.sin(rgbFreq*i + 2) * rgbWidth + rgbCenter );
 		rgb.B[i]  = parseInt( Math.sin(rgbFreq*i + 4) * rgbWidth + rgbCenter );
 		colors[i] = 'rgb('+rgb.R[i]+','+rgb.G[i]+','+ rgb.B[i]+')';
 		ret[array[i]] = colors[i];
 		ret.label[i] = array[i];
 	}
 	ret.colors = colors;
 	return ret;
}
function calcXArr(dataArr)
{
	var cnt = 0;
	var xArr = new Array();
	var index = new Array();
	xArr[cnt] = dataArr[0];
	index[cnt] = 0;
	cnt ++;
	for(i = 1 ; i < dataArr.length ; i++)
	{
		for(j = 0 ; j < xArr.length ; j ++)
		{
			if(xArr[j] == dataArr[i]){
				index[cnt++] = j;
				break;
			}
		}
		if(j == xArr.length)
		{
			xArr.push(dataArr[i]);
			index[cnt ++] = j;
		}
	}
	return {
		'xArr' : xArr,
		'index': index
	};
}
/**  legend set functions  **/
//legend position setting.
function setLegendPosition(obj, plotObject)
{	
      obj.legendX = 0;
      obj.legendY = 0;
      if (obj.legend == 'topright' || obj.legend == 'right')  {
              obj.legendX = plotObject.plotXMargin+plotObject.width+plotObject.plotLength*5;
              obj.legendY = plotObject.plotYMargin-plotObject.plotLength;
      }else if(obj.legend == 'topleft' ||obj.legend == 'left'){
              obj.legendX = plotObject.plotLength*5;
              obj.legendY = plotObject.plotYMargin-plotObject.plotLength;                           
      }
}
/**  legend set functions  **/
//making legend setting.
function MakeLegend(obj, color, colorArr, legendX, legendY, mainValueArr)
{
	var myLegend = setLegend(obj, color, colorArr, legendX, legendY, mainValueArr);					
	obj.legendGroup = new Kinetic.Group({
		width: myLegend.getWidth(),
		height : myLegend.getHeight()
	});
	obj.legendGroup.add(myLegend);
	obj.legendLayer = new Kinetic.Layer({name:'legendLayer', draggable:true});
	obj.legendLayer.on('mouseover', function(evt){  
		document.body.style.cursor = "pointer";
	}); 
	obj.legendLayer.on('mouseout', function(evt){  
		document.body.style.cursor = "default";
	}); 
	obj.legendLayer.add(obj.legendGroup);
	
}
/**  legend set functions end  **/



function setLegend(obj, color, colorArr, legendX, legendY, mainValueArr){
	if(colorArr.isDiscrete == true){
    	var legendNode = new Array();	
    	var legendText = new Array();	
		for(var i = 0; i < colorArr.label.length ; i++)
		{						
			legendNode[i] = new Kinetic.Circle({
				x: legendX+15,
				y: legendY+15*i+11+20,
				radius: 5,
				opacity: 0.7,
				fill: colorArr.colors[i]
			});			
			legendText[i] = new Kinetic.Text({
				x: legendX+20,
		        y: legendY+15*i+20,
				text: colorArr.label[i],
				fontFamily: 'Calibri',
				fontSize: 13,
				padding: 5,
				fill: 'black',
				align:'center'
			});				
		}	
		var maxLengthLegendText = legendText[0].getWidth();
		for(var i=0; i<colorArr.label.length; i++)
		{
			if(legendText[i].getWidth()>maxLengthLegendText)
			{
				maxLengthLegendText=legendText[i].getWidth();
			}						
		}		
	}else{
		var tick= 5; //default legend ticks is 5  
		var temp = findMaxMinValue(colorArr.mainValueArr);
        var max = temp.max;		
        var min = temp.min;	
        var tickRange = (max - min)/tick;
        tickRange = setTickRange( Math.ceil( Math.log(tickRange) / Math.log(10)) , tickRange);
        var newMax = tickRange * Math.ceil(max/tickRange);     		
        var newMin= tickRange * Math.floor(min/tickRange);    
    	var plotArr = new Array(parseInt((newMax-newMin)/tickRange+1));		        	
		for(var i = 0 ; i < plotArr.length ; i ++)
		{
			if((tickRange.toString().indexOf('.') == -1)){
				plotArr[i] = newMin + i*tickRange;
			}else{
				plotArr[i] = (newMin + i*tickRange).toFixed(tickRange.toString().substring(tickRange.toString().indexOf('.')+1,tickRange.toString().length).length);
			}
		}	
		var legendNode = new Array();	
    	var legendText = new Array();	
    	for(var i = 0; i < plotArr.length ; i++)
		{										
			legendText[i] = new Kinetic.Text({
				x: legendX+30,
		        y: legendY+20*i+15,
				text: '-  '+plotArr[ (plotArr.length-1)-i ],
				fontFamily: 'Calibri',
				fontSize: 13,
				padding: 5,
				fill: (i==0 || i==plotArr.length-1 )?'#fff':'black',
				align:'center'
			});						
		}		    	
    		
    	legendNode[0] = new Kinetic.Rect({
			x: legendX+15,
			y: legendY + 47 + 20*((newMax-newMin)/tickRange-1) - 20*(max - min )/tickRange - 20*(min -newMin)/tickRange,
			width :20,
			height :  20*(max - min)/tickRange,
			opacity: 0.7,
			fillLinearGradientStartPoint: [0, 0],
	        fillLinearGradientEndPoint: [0, 20*(max - min)/tickRange],
	        fillLinearGradientColorStops: [0, 'rgb(0,255,0)', 1, 'rgb(0,128,0)'],								
		});				
		var maxLengthLegendText = legendText[0].getWidth();		
		for(var i=0; i<plotArr.length; i++)
		{
			if(legendText[i].getWidth()>maxLengthLegendText)
			{
				maxLengthLegendText=legendText[i].getWidth();
			}						
		}		
	}	
	
	var legendMain= new Kinetic.Text({
		x: legendX,
        y: legendY+5,
		text: color,
		fontFamily: 'Calibri',
		fontSize: 15,
		fill: 'black',
		fontStyle: 'bold',
		align:'center'
	});		
	if(legendMain.getWidth() > maxLengthLegendText ){
		maxLengthLegendText=legendMain.getWidth();
	}		
	 var legendRect= new Kinetic.Rect({
		x:legendX,
		y:legendY,
		width: maxLengthLegendText + 30,
		height: legendText[i-1].getY()-legendY + 30, //i is set by (mainValueArr.length) or  (plotArr.length)
		stroke: 'black',
		fill: '#fff'
	});			
	legendMain.setWidth(legendRect.getWidth());
	var group = new Kinetic.Group({
		width:  legendRect.getWidth(),
		height:  legendRect.getHeight()
	});	
	group.add(legendRect);
	group.add(legendMain);
	for(var i = 0; i < legendNode.length; i++){
		group.add(legendNode[i]);
	}
	for(var i = 0; i < legendText.length; i++){
		group.add(legendText[i]);
	}
	return group;
}



