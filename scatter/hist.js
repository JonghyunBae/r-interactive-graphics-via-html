$(document).ready(function()
{	
	var canvas = document.getElementById("canvas2");
	var context = canvas.getContext("2d");

	var diff =3;
	var xMax=findMaxValue(theophArr.time,diff); //나중에 max함수 추가해서 5단위로 잡게 만들기.
	var yMax=findMaxValueHist(xMax,theophArr.time,diff);
	var xDiff=parseInt(xMax/5);//나중에 자동으로 잡아주기.
	var yDiff=parseInt(yMax/5);
 //document.write(xMax+' '+yMax);
    canvas.addEventListener('mousemove', function(evt) {
      var mousePos = getMousePos(xMax, yMax,canvas, evt);
      var message = 'Mouse position: ' + parseFloat(mousePos.x).toFixed(3) + ',' + parseFloat(mousePos.y).toFixed(3);
      writeMessage(canvas, message,2);      
    }, false);

    drawAxisHist(xMax, yMax, xDiff, yDiff, plotXmargin-10,plotYmargin-30,plotWidth+plotXmargin+50,plotHeight+plotYmargin+10,'Histogram of Thoph$Time','Theoph$Time','Frequency', 0,2); 
    context.save();	
	context.translate(0 , canvas.height );
	context.scale(1, -1); //reverse했으니, 나중에 하버링 시  좌 표 주 의!
	drawDataHist(xMax,yMax,theophArr.time, diff,2);	 
	context.restore();

});

//////////////// Specific function for hist.js///////////////
function drawDataHist(xMax,yMax,xData,diff,name)
{
	var canvas = document.getElementById("canvas" + name);
	var context = canvas.getContext("2d");
	
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMax/diff ); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMax/diff ); cnt++)//count how many data in certain range and save the value into tmpHistArr.
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*diff && xData[i]<(cnt+1)*diff)
			{
				tmpHistArr[cnt]++;
			}
		}
	}			
	for(var i=0; i< parseInt(xMax/diff ) ; i++)//draw rectangular 
	{
		context.beginPath();
		context.strokeRect(plotXmargin +  i * plotWidth / parseInt(xMax/diff)  , canvas.height-plotYmargin-plotHeight  ,  plotWidth / parseInt(xMax/diff) , tmpHistArr[i] * plotHeight / yMax );
		context.stroke();
		context.closePath();
	}
}

function drawAxisHist(xMax, yMax, xDiff, yDiff, x1,y1,x2,y2,main,xLable,yLable,c,name) //( x1, y1 )= left top, ( x2, y2 ) = right bottom
{
	var canvas = document.getElementById("canvas" + name);
	var context = canvas.getContext("2d");
	color(c,2);
	var length=20;
	for(var i=0; i<parseInt(yMax/yDiff)+1; i++){
		drawLine(plotXmargin-length/2, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-length,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) ,0,2);				
		context.strokeStyle = "#000000";	
	 	context.fillStyle = "#000000"; 				
		context.font="bold 15px verdana, sans-serif";
		context.fillText( i*yDiff  ,plotXmargin-length*2 ,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff));
		
	}
	for(var i=0; i<parseInt(xMax/xDiff)+1; i++)
	{
		drawLine(plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+length/2, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+length ,0,2);			
		context.strokeStyle = "#000000";	
	 	context.fillStyle = "#000000"; 				
		context.font="bold 15px verdana, sans-serif";
		context.fillText(i*xDiff,plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+length*2);
	}			

	drawLine(x1,  plotYmargin+plotHeight-parseInt(yMax/yDiff)*plotHeight/(yMax/yDiff) , x1,  plotYmargin+plotHeight,0,2);
	drawLine(plotXmargin , y2 ,plotXmargin+parseInt(xMax/xDiff)*plotWidth/(xMax/xDiff), y2 ,0,2);
	
	context.save();
	context.textAlign = "center";
	context.fillText(xLable,plotXmargin+plotWidth/2,plotYmargin+plotHeight+80);//xLabel
	context.fillText(yLable,plotXmargin-100,plotYmargin+plotHeight/2);//yLabel		
	if(main != undefined)
	{
		context.font="bold 30px verdana, sans-serif";
		context.fillText(main, plotXmargin+plotWidth/2, plotYmargin - 50);				
	}
	context.restore();
}

function findMaxValueHist(xMax, xData,diff)
{
	var maxValue=0;
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMax/diff +1); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMax/diff +1); cnt++)
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*diff && xData[i]<(cnt+1)*diff)
			{
				tmpHistArr[cnt]++;
			}
		}
	}
	for(var i=0; i<parseInt(xMax/diff +1); i++)
	{
		if(tmpHistArr[i]>maxValue)
		{
			maxValue=tmpHistArr[i];					
		}
	}	
	return maxValue;
}