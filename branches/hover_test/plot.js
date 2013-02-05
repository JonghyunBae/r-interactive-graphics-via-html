var filePath = "Theoph-from-R.csv";
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET",filePath,false);
xmlhttp.send(null);
var fileContent = xmlhttp.responseText;
var radius_scale = 3;
//var fileArray = fileContent.split('\n');
/*
for(var i=0; i<fileArray.length; i++){
	document.write("a("+i+") is : "+fileArray[i]+"<br>");
}
*/
var array = csv2array(fileContent);
//document.write("array Length = "+array.length+"<br>");
/*
 for(var i=0; i<array.length; i++){
	document.write("a("+i+") is : "+array[i]+"<br>");
}
*/
//document.write("array("+0+") is : "+array[0]+"<br>");


function ObjTemp()
{
	this.subject='';
    this.wt = '';
    this.dose = '';
    this.time = '';
    this.conc = '';
};

var theophArr = new ObjTemp();

theophArr.subject = new Array();
theophArr.wt = new Array();
theophArr.dose = new Array();
theophArr.time = new Array();
theophArr.conc = new Array();


    var tmp_array0 = array[0].toString().split(',');	
	theophArr.subject[0]=tmp_array0[0];
	theophArr.wt[0]=tmp_array0[1];
	theophArr.dose[0]=tmp_array0[2];
	theophArr.time[0]=tmp_array0[3];
	theophArr.conc[0]=tmp_array0[4];

for(var j=1; j<array.length; j++) //1부터 시작할지 0부터 시직할지는 나중에 결정 
{	
	var tmp_array = array[j].toString().split(',');	
/*	document.write("tmp Array Length = "+tmp_array.length+"<br>");
	for(var i=0; i<tmp_array.length; i++){
		document.write("temp_a("+i+") is : "+tmp_array[i]+"<br>");
	}
	*/	
	theophArr.subject[j]=parseFloat(tmp_array[0]);
	theophArr.wt[j]=parseFloat(tmp_array[1]);
	theophArr.dose[j]=parseFloat(tmp_array[2]);
	theophArr.time[j]=parseFloat(tmp_array[3]);
	theophArr.conc[j]=parseFloat(tmp_array[4]);
}

//for(var i=0; i<theophArr.subject.length; i++){ //just print for test
//	document.write("theophArr.subject["+i+"] is : "+theophArr.subject[i]+"<br>");
//	document.write("theophArr.wt["+i+"] is : "+theophArr.wt[i]+"<br>");
//	document.write("theophArr.dose["+i+"] is : "+theophArr.dose[i]+"<br>");
//	document.write("TimetArr["+i+"] is : "+theophArr.time[i]+"<br>");
//	document.write("theophArr.conc["+i+"] is : "+theophArr.conc[i]+"<br>");
//}

function csv2array(data, delimeter) {

	  // Retrieve the delimeter
	  if (delimeter == undefined) 
	    delimeter = ',';
	  if (delimeter && delimeter.length > 1)
	    delimeter = ',';

	  // initialize variables
	  var newline = '\n';
	  var eof = '';
	  var i = 0;
	  var c = data.charAt(i);
	  var row = 0;
	  var col = 0;
	  var array = new Array();

	  while (c != eof) {
	    // skip whitespaces
	    while (c == ' ' || c == '\t' || c == '\r') {
	      c = data.charAt(++i); // read next char
	    }
	    
	    // get value
	    var value = "";
	    if (c == '\"') {
	      // value enclosed by double-quotes
	      c = data.charAt(++i);
	      
	      do {
	        if (c != '\"') {
	          // read a regular character and go to the next character
	          value += c;
	          c = data.charAt(++i);
	        }
	        
	        if (c == '\"') {
	          // check for escaped double-quote
	          var cnext = data.charAt(i+1);
	          if (cnext == '\"') {
	            // this is an escaped double-quote. 
	            // Add a double-quote to the value, and move two characters ahead.
	            value += '\"';
	            i += 2;
	            c = data.charAt(i);
	          }
	        }
	      }
	      while (c != eof && c != '\"');
	      
	      if (c == eof) {
	        throw "Unexpected end of data, double-quote expected";
	      }

	      c = data.charAt(++i);
	    }
	    else {
	      // value without quotes
	      while (c != eof && c != delimeter && c!= newline && c != ' ' && c != '\t' && c != '\r') {
	        value += c;
	        c = data.charAt(++i);
	      }
	    }

	    // add the value to the array
	    if (array.length <= row) 
	      array.push(new Array());
	    array[row].push(value);
	    
	    // skip whitespaces
	    while (c == ' ' || c == '\t' || c == '\r') {
	      c = data.charAt(++i);
	    }

	    // go to the next row or column
	    if (c == delimeter) {
	      // to the next column
	      col++;
	    }
	    else if (c == newline) {
	      // to the next row
	      col = 0;
	      row++;
	    }
	    else if (c != eof) {
	      // unexpected character
	      throw "Delimiter expected after character " + i;
	    }
	    
	    // go to the next character
	    c = data.charAt(++i);
	  }  
	  
	  return array;
	}


var canvas, context;
var xMax=findMaxValue(theophArr.time); //나중에 max함수 추가해서 5단위로 잡게 만들기.
var yMax=findMaxValue(theophArr.conc);
var xDiff=parseInt(xMax/5);//나중에 자동으로 잡아주기.
var yDiff=parseInt(yMax/6);
var plotWidth=500;
var plotHeight=500;
var plotXmargin=150;
var plotYmargin=90; 

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

$(document).ready(function()
{	
	canvas = document.getElementById("canvasPlot");
	context = canvas.getContext("2d");	
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
			color(c,1);
			context.stroke(); 
			context.fill();
			context.closePath();
		}
		
		
		function drawLine(x1,y1,x2,y2,c)
		{
			context.beginPath();
			context.moveTo(x1,y1);			
			context.lineTo(x2,y2);
			color(c,1);
			context.stroke(); 
		}
		function drawPlot(x1,y1,x2,y2,main,xLable,yLable,c) //( x1, y1 )= left top, ( x2, y2 ) = right bottom
		{
			color(c,1);
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
					color(Data[i], 1);					
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



