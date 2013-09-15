/**  addColorField  **/
// ex) mainArr1.carat.color 
//     mainArr1.cut.colorIndex
function addColorField(labelObj)
{
	if(labelObj.isDiscrete == undefined){
		// continuous
		labelObj['color'] = makeColor_continuous(labelObj);
	}else{
		// discrete
		labelObj['colorIndex'] = makeColor_discrete(labelObj.index);
	}
}
/**  addColorField End  **/

/**  return color part  **/
// TJ designed core.
function makeColor_continuous(array) // under construction.
{
	var colors = new Array();
	var mainValueArr = new Array();
    var tmpColorArr = new Array();
	var reTmpColorArr = new Array();
	var cnt = 0;
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
	for(var i = 0 ; i < sortedColorArr.length ; i ++){		
		if(i == 0){
			mainValueArr[cnt] = sortedColorArr[0].a;
			tmpColorArr[0] = 0;
		}else{
			if(sortedColorArr[i].a == sortedColorArr[i-1].a){
				
				tmpColorArr[i]=cnt;
			}else{
				cnt ++;
				mainValueArr[cnt] = sortedColorArr[i].a;
				tmpColorArr[i] = cnt;
			}
		}
	}
	for(var i = 0; i < sortedColorArr.length ; i ++){		// re assign
		reTmpColorArr[sortedColorArr[i].b] = tmpColorArr[ i ]; 
	}
	for(var i = 0; i < sortedColorArr.length ; i ++){		//re re assign
		tmpColorArr[i] = reTmpColorArr[i];
	}
	var rgb = {R: new Array(), G: new Array(), B: new Array()};
	var start = {R: 0, G: 128, B: 0};
	var end = {R: 0, G: 255, B: 0};
	for(i = 0 ; i < mainValueArr.length ; i ++){
		rgb.R[i] = parseInt( start.R + (i * (end.R - start.R)) / (mainValueArr.length - 1) );
		rgb.G[i] = parseInt( start.G + (i * (end.G - start.G)) / (mainValueArr.length - 1) );
		rgb.B[i] = parseInt( start.B + (i * (end.B - start.B)) / (mainValueArr.length - 1) ); 
		colors[i] = 'rgb('+rgb.R[i]+','+rgb.G[i]+','+ rgb.B[i]+')';
	}
	var indexArr = new Array(array.length);
	for(i = 0 ; i < array.length ; i ++){
		indexArr[i] = colors[tmpColorArr[i]]
	}
 	return indexArr;
}
function makeColor_discrete(array)
{
	var colors = new Array();
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
 	}
 	return colors;
}
/**  return color part End  **/

/**  legend part  **/
function makeLegendLayer(axisObj, legendObj, legendPosition, legendName)
{
	// get values from legend object.
	var position = (legendPosition == undefined) ? 'right' : legendPosition;
	var legendX = 0;
	var legendY = 0;
	// set legend position.
	if(position == 'topright' || position == 'right' || position == 'bottomright'){
        legendX = axisObj.plotXMargin + axisObj.width + axisObj.plotLength*5;
        if(position == 'topright'){
        	legendY = axisObj.plotYMargin - axisObj.plotLength;
        }else if(position == 'bottomright'){
        	legendY = axisObj.plotYMargin - axisObj.plotLength + axisObj.height/2;
        }else{
        	legendY = axisObj.plotYMargin - axisObj.plotLength + axisObj.height/4;
        }        
	}else if(position == 'topleft' || position == 'left' || position == 'bottomleft'){
        legendX = axisObj.plotLength*5;
        if(position == 'topleft'){
        	legendY = axisObj.plotYMargin - axisObj.plotLength;
        }else if(position == 'bottomleft'){
        	legendY = axisObj.plotYMargin - axisObj.plotLength + axisObj.height/2;
        }else{
        	legendY = axisObj.plotYMargin - axisObj.plotLength + axisObj.height/4;
        }                         
	}else{ // if other words -> just set position as right.
		position = 'right';
		legendX = axisObj.plotXMargin+axisObj.width+axisObj.plotLength*5;
        legendY = axisObj.plotYMargin-axisObj.plotLength;
	}
	
	// set legend layers.
	var legendNode = new Array();	
	var legendText = new Array();
	if(legendObj.isDiscrete == true){ // discrete
		if(legendObj.colorIndex == undefined){
			addColorField(legendObj);
			//alert("addColorField should be called before drawing legend");
			//return -1;
		}		
		for(var i = 0 ; i < legendObj.index.length ; i ++)
		{						
			legendNode[i] = new Kinetic.Circle({
				name: 'legend',
				x: legendX + 15,
				y: legendY + 15*i + 11 + 20,
				radius: 5,
				opacity: 0.7,
				fill: legendObj.colorIndex[i]
			});			
			legendText[i] = new Kinetic.Text({
				name: 'legend',
				x: legendX + 20,
		        y: legendY + 15*i + 20,
				text: legendObj.index[i],
				fontFamily: 'Calibri',
				fontSize: 13,
				padding: 5,
				fill: 'black',
				align:'center'
			});
		}
	}else{ // continuous.
		if(legendObj.color == undefined){
			addColorField(legendObj);
			//alert("addColorField should be called before drawing legend");
			//return -1;
		}
		var temp = findMaxMinValue(legendObj);
		var max = temp.max;
		var min = temp.min;
		var tick = 5; //default legend ticks is 5  
		var tickRange = (max - min) / tick;
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
    	for(var i = 0; i < plotArr.length ; i++)
		{
			legendText[i] = new Kinetic.Text({
				name: 'legend',
				x: legendX + 30,
		        y: legendY + 20*i + 15,
				text: '-  ' + plotArr[(plotArr.length-1)-i],
				fontFamily: 'Calibri',
				fontSize: 13,
				padding: 5,
				fill: (i == 0 || i == plotArr.length - 1) ? '#fff' : 'black',
				align:'center'
			});
		}    	
    	legendNode[0] = new Kinetic.Rect({
    		name: 'legend',
			x: legendX+15,
			y: legendY + 47 + 20*((newMax-newMin)/tickRange-1) - 20*(max - min )/tickRange - 20*(min -newMin)/tickRange,
			width :20,
			height :  20*(max - min)/tickRange,
			opacity: 0.7,
			fillLinearGradientStartPoint: [0, 0],
	        fillLinearGradientEndPoint: [0, 20*(max - min)/tickRange],
	        fillLinearGradientColorStops: [0, 'rgb(0,255,0)', 1, 'rgb(0,128,0)'],
		});
	}
	
	// find maximum length of legendText. -> it will set legend width.
	var maxLengthLegendText = legendText[0].getWidth();
	for(var i = 0; i < legendText.length; i ++)
	{
		if(legendText[i].getWidth() > maxLengthLegendText)
		{
			maxLengthLegendText = legendText[i].getWidth();
		}
	}
	
	// legend Main Label.
	var legendMain= new Kinetic.Text({
		name: 'legend',
		x: legendX,
        y: legendY + 5,
		text: legendName,
		fontFamily: 'Calibri',
		fontSize: 15,
		fill: 'black',
		fontStyle: 'bold',
		align:'center'
	});		
	if(legendMain.getWidth() > maxLengthLegendText ){
		maxLengthLegendText = legendMain.getWidth();
	}
	
	var legendRect= new Kinetic.Rect({
		name: 'legend',
		x: legendX,
		y: legendY,
		width: maxLengthLegendText + 30,
		height: legendText[i-1].getY() - legendY + 30, //i is set by (mainValueArr.length) or  (plotArr.length)
		stroke: 'black',
		fill: '#fff'
	});
	legendMain.setWidth(legendRect.getWidth());
	
	// combine components into one group.
	var group = new Kinetic.Group();	
	group.add(legendRect);
	group.add(legendMain);
	for(var i = 0; i < legendNode.length; i++){
		group.add(legendNode[i]);
	}
	for(var i = 0; i < legendText.length; i++){
		group.add(legendText[i]);
	}
	
	var layerWidth = legendRect.getWidth() + 20;
	// set axis plotMargin.
	if(position == 'left' || position == 'topleft'){
		
		axisObj.plotXMargin = axisObj.plotXMargin + layerWidth;
		layerWidth = layerWidth - axisObj.plotXMargin;
	}
	// make legendLayer.
	axisObj.legendLayer = new Kinetic.Layer({
		name: 'legend',
		width: layerWidth,
		height: legendRect.getHeight(),
		draggable:true
	});
	axisObj.legendLayer.on('mouseover', function(evt){  
		document.body.style.cursor = "pointer";
	}); 
	axisObj.legendLayer.on('mouseout', function(evt){  
		document.body.style.cursor = "default";
	});
	axisObj.legendLayer.add(group);
	return 1;	
}

