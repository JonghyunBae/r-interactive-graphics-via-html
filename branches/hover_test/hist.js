$(document).ready(function()
{	
	var canvas = document.getElementById("canvasHist");
	var context = canvas.getContext("2d");

	
	var xMax=findMaxValue(theophArr.time); //나중에 max함수 추가해서 5단위로 잡게 만들기.
	var yMax=findMaxValue(theophArr.conc);
	var xDiff=parseInt(xMax/5);//나중에 자동으로 잡아주기.
	var yDiff=parseInt(yMax/6);
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

   
//	drawPlot(150,50,650,550,13); //안쪽 사각형;
	drawPlot(plotXmargin-10,plotYmargin-30,plotWidth+plotXmargin+50,plotHeight+plotYmargin+10,'Theoph','Time','conc', 0); //바깥 쪽 사각형; (나중에 지워도 무방, 색을 흰 색으로 바꿔도 되고..

	drawLegend('topright',theophArr.subject);	
//	drawLegend('topleft',theophArr.subject);
//	drawLegend('bottomright',theophArr.subject);
//	drawLegend('bottomleft',theophArr.subject);

	context.save();	
	context.translate(0 , canvas.height );
	context.scale(1, -1); //reverse했으니, 나중에 하버링 시  좌 표 주 의!
	plot(theophArr.time, theophArr.conc);
	 
	context.restore();
	
//	plot(theophArr.time, theophArr.conc);
 
	//plot(theophArr.wt, theophArr.conc);
	
		function findMaxValue(Data)
		{
			var maxValue=Data[1];
			for(var i=2; i<Data.length; i++){
				if(Data[i]>maxValue){
					maxValue=Data[i];					
				}
				//document.write('max: ' + maxValue+'  data[i]: '+Data[i]+'  data[i-1]: '+ Data[i-1]+'<br>');
			}
			return parseInt(maxValue+1);
		}
		    
		function plot(xData,yData)
		{
			var xCanvasWidth = plotXmargin;
			var yCanvasHeight = canvas.height-plotYmargin-plotHeight; 
			var xScale=plotWidth/xMax;
			var yScale=plotHeight/yMax;

			
			for( var i = 0 ; i < xData.length; i++)
			{	
				drawDot(xData[i]*xScale+xCanvasWidth,yData[i]*yScale+yCanvasHeight,theophArr.subject[i]); //canvas 크기에 따라 
			}
			
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
			context.strokeRect(x1,y1,x2-x1,y2-y1);

			var length=20;
			for(var i=0; i<parseInt(yMax/yDiff)+1; i++){
				drawLine(plotXmargin-length/2, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-length,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) ,0);				
				context.strokeStyle = "#000000";	
			 	context.fillStyle = "#000000"; 				
				context.font="bold 15px verdana, sans-serif";
				context.fillText( i*yDiff  ,plotXmargin-length*2 ,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff));
			}
			for(var i=0; i<(xMax/xDiff)+1; i++)
			{
				drawLine(plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+length/2, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+length ,0);			
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
		function drawLegend(Location,Data)
		{
			var scale=3;
			var cnt=1;
			var x1,y1,x2,y2;   // if data is not sorted, this code can't work. data should be sorted (from R or top of the code)
			cnt = Data[Data.length-1];
			if (Location == 'topright' || Location == undefined)	{
				x1 = plotXmargin+plotWidth+10;
				y1 = plotYmargin-30;
				x2 = x1+40;
				y2 = (cnt*13+35);
			}else if(Location == 'topleft'){
				x1 = plotXmargin-10;
				y1 = plotYmargin-30;
				x2 = x1 + 40;
				y2 = (cnt*13+35);
			}else if(Location == 'bottomright'){
				x1 = plotXmargin+plotWidth+10;
				x2 = x1 +40;
				y2 = (cnt*13+35);
				y1 = plotYmargin + plotHeight - y2 + 10;
			}else if(Location == 'bottomleft'){
				x1 = plotXmargin-10;
				x2 = x1 + 40;
				y2 = (cnt*13+35);
				y1 =plotYmargin + plotHeight - y2 + 10;
			}else{						// default is topright
				x1 = plotXmargin+plotWidth+10;
				y1 = plotYmargin-30;
				x2 = x1+40;
				y2 = (cnt*13+35);
			}
			cnt = 1;
			for( var i = 1 ; i < Data.length; i++)
			{	
				if(i==1 ||  ( (i!=1) && (Data[i] != Data[i-1]) ) )  //subject 체크 한 후에 같은 거면 index추가 안함.		
				{		
					
					context.save();				
					context.beginPath();
					context.arc(x1+10,cnt*13 + y1 + 10, scale, (Math.PI/180)*0, (Math.PI/180)*360, false);
					color(Data[i]);					
					context.fill();
					context.stroke(); 
					context.closePath();				
					context.restore();
					
					context.strokeStyle = "#000000";	
				 	context.fillStyle = "#000000"; 				
					context.font="bold 11px verdana, sans-serif";
					context.fillText(Data[i],x1+20,cnt*13 + y1 + 15);
					cnt++;
				}
			}
			context.strokeRect(x1 ,y1, x2-x1 , y2);
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