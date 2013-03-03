boxIdStart = idCounter;

//////////////////////////////////////boxStage Start//////////////////////////////////////
var boxStage = new Kinetic.Stage({
	container: 'boxContainer',
	
	width:   plotWidth+plotXmargin*2,
	height: plotHeight+plotYmargin*2
});

//////////////////////////////////////Drawing Plot Start//////////////////////////////////////
var boxPlotLayer= new Kinetic.Layer();  
drawBaseRect('black', boxPlotLayer);
drawScale(boxXMax, boxXDiff, boxYMax, boxYDiff, boxPlotLayer);
drawLabel(boxXLabel, boxYLabel, boxPlotLayer);
drawMainLabel('Box-and-Whisker of '+boxXLabel+'&'+boxYLabel, boxPlotLayer);
boxStage.add(boxPlotLayer);
//////////////////////////////////////Drawing Plot End//////////////////////////////////////