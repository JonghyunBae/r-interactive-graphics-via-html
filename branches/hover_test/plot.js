//var fileArray = fileContent.split('\n');
/*
for(var i=0; i<fileArray.length; i++){
	document.write("a("+i+") is : "+fileArray[i]+"<br>");
}
*/

//document.write("array Length = "+array.length+"<br>");
/*
 for(var i=0; i<array.length; i++){
	document.write("a("+i+") is : "+array[i]+"<br>");
}
*/
//document.write("array("+0+") is : "+array[0]+"<br>");
//for(var i=0; i<theophArr.subject.length; i++){ //just print for test
//	document.write("theophArr.subject["+i+"] is : "+theophArr.subject[i]+"<br>");
//	document.write("theophArr.wt["+i+"] is : "+theophArr.wt[i]+"<br>");
//	document.write("theophArr.dose["+i+"] is : "+theophArr.dose[i]+"<br>");
//	document.write("TimetArr["+i+"] is : "+theophArr.time[i]+"<br>");
//	document.write("theophArr.conc["+i+"] is : "+theophArr.conc[i]+"<br>");
//}
$(document).ready(function()
{	
	var j = 1;
	var canvas = document.getElementById("canvas1");
	var context = canvas.getContext("2d");	
    canvas.addEventListener('mousemove', function(evt) {
      var mousePos = getMousePos(canvas, evt);
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
//	drawPlot(150,50,650,550,13); //안쪽 사각형;
	drawPlot(plotXmargin-10,plotYmargin-30,plotWidth+plotXmargin+50,plotHeight+plotYmargin+10,'Theoph','Time','conc', 0,1); //바깥 쪽 사각형; (나중에 지워도 무방, 색을 흰 색으로 바꿔도 되고..
	drawLegend('topright',theophArr.subject,1);	
//	drawLegend('topleft',theophArr.subject,1);
//	drawLegend('bottomright',theophArr.subject,1);
//	drawLegend('bottomleft',theophArr.subject,1);
	context.save();	
	context.translate(0 , canvas.height );
	context.scale(1, -1); //reverse했으니, 나중에 하버링 시  좌 표 주 의!
	plot(theophArr.time, theophArr.conc,1);	 
	context.restore();	
}
)
 //// This function is only for scatter Plot, so didn't move to common_fs.js 
function drawPlot(x1,y1,x2,y2,main,xLable,yLable,c,name) //( x1, y1 )= left top, ( x2, y2 ) = right bottom
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
			for(var i=0; i<(xMax/xDiff)+1; i++)
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



