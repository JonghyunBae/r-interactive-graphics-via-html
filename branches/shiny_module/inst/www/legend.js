/**  basic legend function  **/
function legend(legendName, axisObj, position, nameArr, colorArr)
{
	var legendX = 0;
	var legendY = 0;
	
	if(position == null){
		position = 'right'; // default value of legend postion.
	}
	
	// set the legendX and legendY.
	if(position == 'topright' || position == 'right' || position == 'bottomright'){
        //legendX = axisObj.plotXMargin + axisObj.width + axisObj.plotLength*5;
		legendX = axisObj.plotXMargin + axisObj.width - axisObj.plotLength*5;
        if(position == 'topright'){
        	legendY = axisObj.plotYMargin - axisObj.plotLength;
        }else if(position == 'bottomright'){
        	legendY = axisObj.plotYMargin - axisObj.plotLength + axisObj.height/2;
        }else{
        	legendY = axisObj.plotYMargin - axisObj.plotLength + axisObj.height/4;
        }
	}else if(position == 'topleft' || position == 'left' || position == 'bottomleft'){
        legendX = axisObj.plotLength * 5;
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
	var legendNode = new Array(nameArr.length);
	var legendText = new Array(nameArr.length);
	
//	if(nameArr.length > 24){ // continuous
//		alert('continuous is yet builded.');
//		return 0;
//	}else{ // discrete
		for(var i = 0 ; i < nameArr.length ; i ++){
			legendNode[i] = new Kinetic.Circle({
				name: 'legend',
				x: legendX + 15,
				y: legendY + 15*i + 11 + 20,
				radius: 5,
				opacity: 0.7,
				fill: colorArr[i]
			});			
			legendText[i] = new Kinetic.Text({
				name: 'legend',
				x: legendX + 20,
		        y: legendY + 15*i + 20,
				text: nameArr[i],
				fontFamily: 'Calibri',
				fontSize: 13,
				padding: 5,
				fill: 'black',
				align:'center'
			});
		}
//	}
	
	// find maximum length of legendText. -> it will set legend width.
	var maxLengthLegendText = legendText[0].getWidth();
	for(var i = 0; i < legendText.length; i ++){
		if(legendText[i].getWidth() > maxLengthLegendText){
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
	// change axisObj
	axisObj.xLabel.setX(axisObj.plotXMargin + axisObj.width/2);
	axisObj.yLabel.setX(axisObj.plotXMargin - axisObj.plotLength - 40);
	makeXAxisLayer(axisObj);
	makeYAxisLayer(axisObj);
	axisObj._draw();
	

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
	//axisObj.stage.setWidth(axisObj.stage.getWidth() + axisObj.legendLayer.getWidth());
	
	// add
	axisObj.stage.add(axisObj.legendLayer);
	return 1;
}