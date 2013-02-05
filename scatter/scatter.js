$(document).ready(function()
{	

	var xMax=findMaxValue(theophArr.time,0); //나중에 max함수 추가해서 5단위로 잡게 만들기.
	var yMax=findMaxValue(theophArr.conc,0);
	var xDiff=parseInt(xMax/5);//나중에 자동으로 잡아주기.
	var yDiff=parseInt(yMax/6);
	
	var j = 1;
	var canvas = document.getElementById("canvas1");
	var context = canvas.getContext("2d");	
    canvas.addEventListener("mousemove", function(evt) {
      var mousePos = getMousePos(xMax, yMax, canvas, evt);
      var message = 'Mouse position: ' + parseFloat(mousePos.x).toFixed(3) + ',' + parseFloat(mousePos.y).toFixed(3);
      writeMessage(canvas, message,1);
      var search_result = search_range(mousePos.x,mousePos.y);
      if(search_result.y == true ){
        	  popup('Subject : ' + theophArr.subject[search_result.x] + "<br>" + 'Wt : ' + theophArr.wt[search_result.x] + "<br>" + 'Dose : ' + theophArr.dose[search_result.x] + "<br>" + 'Conc : ' + theophArr.conc[search_result.x] + "<br>" + 'Time : ' + theophArr.time[search_result.x], 'lightyellow');
       }
      else{
    	  kill();
      }      
    }, false);
    drawAxisScatter(xMax, yMax, xDiff, yDiff, plotXmargin-10,plotYmargin-30,plotWidth+plotXmargin+50,plotHeight+plotYmargin+10,'Theoph','Time','conc', 0,1); //바깥 쪽 사각형; (나중에 지워도 무방, 색을 흰 색으로 바꿔도 되고..
	drawLegend('topright',theophArr.subject,1);	
//	drawLegend('topleft',theophArr.subject,1);
//	drawLegend('bottomright',theophArr.subject,1);
//	drawLegend('bottomleft',theophArr.subject,1);
	context.save();	
	context.translate(0 , canvas.height );
	context.scale(1, -1); //reverse했으니, 나중에 하버링 시  좌 표 주 의!
	drawDataScatter(xMax, yMax, theophArr.time, theophArr.conc,1);	 
	context.restore();	
});



////////////////Specific function for scatter.js///////////////
function drawDataScatter(xMax, yMax,xData,yData,name)
{
	var canvas = document.getElementById("canvas" + name);
	var context = canvas.getContext("2d");
	
	var xCanvasWidth = plotXmargin;
	var yCanvasHeight = canvas.height-plotYmargin-plotHeight; 
	var xScale=plotWidth/xMax;
	var yScale=plotHeight/yMax;
	for( var i = 0 ; i < xData.length; i++)
	{	
		drawDot(xData[i]*xScale+xCanvasWidth,yData[i]*yScale+yCanvasHeight,theophArr.subject[i],1); //canvas 크기에 따라 
	}		
}


function drawAxisScatter(xMax, yMax, xDiff, yDiff, x1,y1,x2,y2,main,xLable,yLable,c,name) //( x1, y1 )= left top, ( x2, y2 ) = right bottom
{
			var canvas = document.getElementById("canvas" + name);
			var context = canvas.getContext("2d");
			color(c,name);
			context.strokeRect(x1,y1,x2-x1,y2-y1);

			var length=20;
			for(var i=0; i<parseInt(yMax/yDiff)+1; i++){
				drawLine(plotXmargin-length/2, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-length,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) ,0,1);				
				context.strokeStyle = "#000000";	
			 	context.fillStyle = "#000000"; 				
				context.font="bold 15px verdana, sans-serif";
				context.fillText( i*yDiff  ,plotXmargin-length*2 ,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff));
			}
			for(var i=0; i<parseInt(xMax/xDiff)+1; i++)
			{
				drawLine(plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+length/2, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+length ,0,1);			
				context.strokeStyle = "#000000";	
			 	context.fillStyle = "#000000"; 				
				context.font="bold 15px verdana, sans-serif";
				context.fillText(i*xDiff,plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+length*2);
			}			
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



