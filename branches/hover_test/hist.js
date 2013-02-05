$(document).ready(function()
{	
	var canvas = document.getElementById("canvasHist");
	var context = canvas.getContext("2d");

	var diff =2;
	var xMax=findMaxValue(theophArr.time); //나중에 max함수 추가해서 5단위로 잡게 만들기.
	var yMax=findMaxValueHist(theophArr.time,diff);
	var xDiff=parseInt(xMax/5);//나중에 자동으로 잡아주기.
	var yDiff=parseInt(yMax/5);
	var plotWidth=500;
	var plotHeight=500;
	var plotXmargin=150;
	var plotYmargin=90; 
 //document.write(xMax+' '+yMax);
    canvas.addEventListener('mousemove', function(evt) {
      var mousePos = getMousePos(canvas, evt);
      var message = 'Mouse position: ' + parseFloat(mousePos.x).toFixed(3) + ',' + parseFloat(mousePos.y).toFixed(3);
      writeMessage(canvas, message);
      var search_result = search_range(mousePos.x,mousePos.y);
      if(search_result.y == true ){
        	  popup('Subject : ' + theophArr.subject[search_result.x] + "<br>" + 'Wt : ' + theophArr.wt[search_result.x] + "<br>" + 'Dose : ' + theophArr.dose[search_result.x] + "<br>" + 'Conc : ' + theophArr.conc[search_result.x] + "<br>" + 'Time : ' + theophArr.time[search_result.x], 'lightyellow');
       }
      else{
    	  kill();
      }      
    }, false);

	drawPlot(plotXmargin-10,plotYmargin-30,plotWidth+plotXmargin+50,plotHeight+plotYmargin+10,'Histogram of Thoph$Time','Theoph$Time','Frequency', 0); 

//	drawLegend('topright',theophArr.subject);	
//	drawLegend('topleft',theophArr.subject);
//	drawLegend('bottomright',theophArr.subject);
//	drawLegend('bottomleft',theophArr.subject);

	context.save();	
	context.translate(0 , canvas.height );
	context.scale(1, -1); //reverse했으니, 나중에 하버링 시  좌 표 주 의!
	histPlot(theophArr.time, diff);
	 
	context.restore();
	
//	plot(theophArr.time, theophArr.conc);
 
	//plot(theophArr.wt, theophArr.conc);
	
		function findMaxValue(Data)
		{
			var maxValue=Data[1];
			var returnValue;
			for(var i=2; i<Data.length; i++){
				if(Data[i]>maxValue){
					maxValue=Data[i];					
				}
				//document.write('max: ' + maxValue+'  data[i]: '+Data[i]+'  data[i-1]: '+ Data[i-1]+'<br>');
			}
			returnValue=parseInt(maxValue+1);
			
			for(var i=0; i<diff; i++){
				returnValue=returnValue+i;
				if( ( returnValue% diff ) == 0 )
				{
					break;
				}				
			}
			
			return returnValue;
		}
		function findMaxValueHist(xData,xDiff)
		{
			var maxValue=0;
			var tmpHistArr = new Array();
			var cnt=0;
			for (var i=0; i<parseInt(xMax/xDiff +1); i++)//tmpHistArr initialization
			{
				tmpHistArr[i]=0;
			}			
			for(cnt=0; cnt< parseInt(xMax/xDiff +1); cnt++)
			{
				for( var i = 0 ; i < xData.length; i++)
				{	
					if(xData[i]>=cnt*xDiff && xData[i]<(cnt+1)*xDiff)
					{
						tmpHistArr[cnt]++;
					}
				}
			}
			for(var i=0; i<parseInt(xMax/xDiff +1); i++)
			{
				if(tmpHistArr[i]>maxValue)
				{
					maxValue=tmpHistArr[i];					
				}
			}	
			return maxValue;
		}
		    
		function histPlot(xData,xDiff)
		{
		
		//	document.write('max: ' + xMax+'<br>');
			var tmpHistArr = new Array();
			var cnt=0;
			for (var i=0; i<parseInt(xMax/xDiff ); i++)//tmpHistArr initialization
			{
				tmpHistArr[i]=0;
			}			
			for(cnt=0; cnt< parseInt(xMax/xDiff ); cnt++)//count how many data in certain range and save the value into tmpHistArr.
			{
				for( var i = 0 ; i < xData.length; i++)
				{	
					if(xData[i]>=cnt*diff && xData[i]<(cnt+1)*xDiff)
					{
						tmpHistArr[cnt]++;
					}
				}
			}			
			for(var i=0; i< parseInt(xMax/xDiff ) ; i++)//draw rectangular 
			{
				context.beginPath();
				context.strokeRect(plotXmargin +  i * plotWidth / parseInt(xMax/xDiff)  , canvas.height-plotYmargin-plotHeight  ,  plotWidth / parseInt(xMax/xDiff) , tmpHistArr[i] * plotHeight / yMax );
				context.stroke();
				context.closePath();
			}
			//document.write('max: ' + yMax+'<br>');
		
	/*	for (var i=0; i<parseInt(xMax/diff +1); i++)//tmpHistArr initialization
			{
				document.write('tmpHistArr['+i+']: ' + tmpHistArr[i]+'<br>');
			}	*/
		   
		
			/*
			var xCanvasWidth = plotXmargin;
			var yCanvasHeight = canvas.height-plotYmargin-plotHeight; 
			var xScale=plotWidth/xMax;
			var yScale=plotHeight/yMax;
			var cnt=0;
			
			for( var i = 0 ; i < xData.length; i++)
			{	
				if(xData[i]>=cnt*diff && xData[i]<(cnt+1)*diff){
					cnt=1;
				}
				drawDot(xData[i]*xScale+xCanvasWidth,yData[i]*yScale+yCanvasHeight,theophArr.subject[i]); //canvas 크기에 따라 
			}
			*/
		}
		function drawDot(x,y,c)
		{
			context.beginPath();
			context.arc(x,y, radius_scale, (Math.PI/180)*0, (Math.PI/180)*360, false);
			color(c);
			context.stroke(); 
			context.fill();
			context.closePath();
		}
		
		
		function drawLine(x1,y1,x2,y2,c)
		{
			context.beginPath();
			context.moveTo(x1,y1);			
			context.lineTo(x2,y2);
			color(c);
			context.stroke(); 
		}
		function drawPlot(x1,y1,x2,y2,main,xLable,yLable,c) //( x1, y1 )= left top, ( x2, y2 ) = right bottom
		{
			color(c);
			var length=20;
			for(var i=0; i<parseInt(yMax/yDiff)+1; i++){
				drawLine(plotXmargin-length/2, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-length,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) ,0);				
				context.strokeStyle = "#000000";	
			 	context.fillStyle = "#000000"; 				
				context.font="bold 15px verdana, sans-serif";
				context.fillText( i*yDiff  ,plotXmargin-length*2 ,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff));
				
			}
			for(var i=0; i<parseInt(xMax/xDiff)+1; i++)
			{
				drawLine(plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+length/2, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+length ,0);			
				context.strokeStyle = "#000000";	
			 	context.fillStyle = "#000000"; 				
				context.font="bold 15px verdana, sans-serif";
				context.fillText(i*xDiff,plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+length*2);
			}			

			drawLine(x1,  plotYmargin+plotHeight-parseInt(yMax/yDiff)*plotHeight/(yMax/yDiff) , x1,  plotYmargin+plotHeight  );
			drawLine(plotXmargin , y2 ,plotXmargin+parseInt(xMax/xDiff)*plotWidth/(xMax/xDiff), y2 );
			
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
		
		
		function color(c)
		{
			switch(c)
			{
		        case 0 : //Black
		        	context.strokeStyle = "#000000";	
		        	context.fillStyle = "#000000"; 
		        	break;
		        case 1 : //Green
		        	context.strokeStyle = "#008000";	
		        	context.fillStyle = "#008000"; 
		        	break;
		        case 2 : //Silver
		        	context.strokeStyle = "#C0C0C0";	
		        	context.fillStyle = "#C0C0C0"; 
		        	break;
		        case 3 : //Lime
		        	context.strokeStyle = "#00FF00";	
		        	context.fillStyle = "#00FF00"; 
		        	break;
		        case 4 : //Gray
		        	context.strokeStyle = "#808080";	
		        	context.fillStyle = "#808080"; 
		        	break;
		        case 5 : //Olive
		          	context.strokeStyle = "#808000";	
		        	context.fillStyle = "#808000"; 
		        	break;
		        case 6 : //Yellow
		        	context.strokeStyle = "#FFFF00";	
		        	context.fillStyle = "#FFFF00"; 
		        	break;
		        case 7 : //Maroon
		        	context.strokeStyle = "#800000";	
		        	context.fillStyle = "#800000"; 
		        	break;
		        case 8 : //Navy
		        	context.strokeStyle = "#000080";	
		        	context.fillStyle = "#000080"; 
		        	break;
		        case 9 : //Red
		        	context.strokeStyle = "#FF0000";	
		        	context.fillStyle = "#FF0000"; 
		        	break;
		        case 10 : //Blue
		        	context.strokeStyle = "#0000FF";	
		        	context.fillStyle = "#0000FF"; 
		        	break;
		        case 11 : //Purple
		        	context.strokeStyle = "#800080";	
		        	context.fillStyle = "#800080"; 
		        	break;
		        case 12 : //Teal
		        	context.strokeStyle = "#008080";	
		        	context.fillStyle = "#008080"; 
		        	break;
		        case 13 : //Fuchsia
		        	context.strokeStyle = "#FF00FF";	
		        	context.fillStyle = "#FF00FF"; 
		        	break;
		        case 14 : //Aqua
		        	context.strokeStyle = "#00FFFF";	
		        	context.fillStyle = "#00FFFF"; 
		        	break;
		        default : //Black
		        	context.strokeStyle = "#000000";	
		        	context.fillStyle = "#000000"; 
			}
		}
		
		 function writeMessage(canvas, message) {
		     //   var context = canvas.getContext('2d');
		        context.clearRect(plotXmargin + 20, 700, 800, 150);
		        context.font = '18pt Calibri';
		        context.fillStyle = 'black';
		        context.fillText(message, plotXmargin + 30, 750);
		        
		 }
		      function getMousePos(canvas, evt) {
		        var rect = canvas.getBoundingClientRect();
		        return {
		          x: xMax/plotWidth*(evt.clientX - rect.left - plotXmargin),
		          y: -yMax/plotHeight*(  evt.clientY - rect.top - (plotYmargin+plotHeight))
		        };
		      }
		  function search_range(x, y){
			  var offset_scale = radius_scale/20;
			  for( var i = 1 ; i < array.length; i++){ 
				  if((theophArr.conc[i] - offset_scale < y) && (theophArr.conc[i] + offset_scale > y) && (theophArr.time[i] - offset_scale < x) && (theophArr.time[i] + offset_scale >x)  ){
					  return{
						  x: i,
						  y: true
					  };
				  }	
			}	  
			  return{
				  x: i,
				  y: false
			  };
		  }
		 //     var canvas = document.getElementById('myCanvas');
		   //   var context = canvas.getContext('2d');

}
)