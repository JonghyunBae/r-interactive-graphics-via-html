var filePath = "file:///home/paplp11/r-interactive/trunk/scatter/Theoph-from-R.csv";
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET",filePath,false);
xmlhttp.send(null);
var fileContent = xmlhttp.responseText;
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

var SubjectArr = new Array();
var WtArr = new Array();
var DoseArr = new Array();
var TimeArr = new Array();
var concArr = new Array();


	var tmp_array0 = array[0].toString().split(',');	
	SubjectArr[0]=tmp_array0[0];
	WtArr[0]=tmp_array0[1];
	DoseArr[0]=tmp_array0[2];
	TimeArr[0]=tmp_array0[3];
	concArr[0]=tmp_array0[4];

for(var j=1; j<array.length; j++) //1부터 시작할지 0부터 시직할지는 나중에 결
{	
	var tmp_array = array[j].toString().split(',');	
/*	document.write("tmp Array Length = "+tmp_array.length+"<br>");
	for(var i=0; i<tmp_array.length; i++){
		document.write("temp_a("+i+") is : "+tmp_array[i]+"<br>");
	}
	*/	
	SubjectArr[j]=parseFloat(tmp_array[0]);
	WtArr[j]=parseFloat(tmp_array[1]);
	DoseArr[j]=parseFloat(tmp_array[2]);
	TimeArr[j]=parseFloat(tmp_array[3]);
	concArr[j]=parseFloat(tmp_array[4]);
}

//for(var i=0; i<SubjectArr.length; i++){ //just print for test
//	document.write("SubjectArr["+i+"] is : "+SubjectArr[i]+"<br>");
//	document.write("WtArr["+i+"] is : "+WtArr[i]+"<br>");
//	document.write("DoseArr["+i+"] is : "+DoseArr[i]+"<br>");
//	document.write("TimetArr["+i+"] is : "+TimeArr[i]+"<br>");
//	document.write("concArr["+i+"] is : "+concArr[i]+"<br>");
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

window.onload = function ()
{	
	var canvas = document.getElementById("cvs");
	var context = canvas.getContext("2d");

	
	var xMax=findMaxValue(TimeArr); //나중에 max함수 추가해서 5단위로 잡게 만들기.
	var yMax=findMaxValue(concArr);
	var xDiff=parseInt(xMax/5);//나중에 자동으로 잡아주기.
	var yDiff=parseInt(yMax/6);
	var plotWidth=500;
	var plotHeight=500;
	var plotXmargin=150;
	var plotYmargin=50;
 //document.write(xMax+' '+yMax);
    canvas.addEventListener('mousemove', function(evt) {
      var mousePos = getMousePos(canvas, evt);
      var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      writeMessage(canvas, message);
    }, false);

   
//	drawPlot(150,50,650,550,13); //안쪽 사각형;
	drawPlot(plotXmargin-10,plotYmargin-30,plotWidth+plotXmargin+50,plotHeight+plotYmargin+10,TimeArr,concArr, 0); //바깥 쪽 사각형; (나중에 지워도 무방, 색을 흰 색으로 바꿔도 되고..
	drawLegend(SubjectArr);
	
	context.save();
	
	context.translate(0 , canvas.height );
	context.scale(1, -1); //reverse했으니, 나중에 하버링 시  좌 표 주 의!
	plot(TimeArr, concArr);
	 
	context.restore();
	
//	plot(TimeArr, concArr);
 
	//plot(WtArr, concArr);
	
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
				drawDot(xData[i]*xScale+xCanvasWidth,yData[i]*yScale+yCanvasHeight,SubjectArr[i]); //canvas 크기에 따라 
			}
			
		}
		function drawDot(x,y,c)
		{
			var scale=3;
			context.beginPath();
			context.arc(x,y, scale, (Math.PI/180)*0, (Math.PI/180)*360, false);
//			context.moveTo(x,y);			
//			context.lineTo(x,y+1);
			color(c);
			
	//		if(c==1){
	//			context.strokeStyle = "#ff0000";	
		//		context.fillStyle = "#ff0000";
	//		}else{
	//			context.strokeStyle = "#000000";	
	//			context.fillStyle = "#000000";
	//		}			
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
		function drawPlot(x1,y1,x2,y2,xData,yData,c) //( x1, y1 )= left top, ( x2, y2 ) = right bottom
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
			for(var i=0; i<(xMax/xDiff)+1; i++){
				drawLine(plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+length/2, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+length ,0);			
				context.strokeStyle = "#000000";	
			 	context.fillStyle = "#000000"; 				
				context.font="bold 15px verdana, sans-serif";
				context.fillText(i*xDiff,plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+length*2);
			}
			
			context.fillText(xData[0],400,620);//xLabel
			context.fillText(yData[0],70,300);//yLabel
			
		}
		function drawLegend(Data)
		{
			var scale=3;
			var cnt=1;
			for( var i = 1 ; i < Data.length; i++)
			{	
				if(i==1 ||  ( (i!=1) && (Data[i] != Data[i-1]) ) ){		//subject 체크 한 후에 같은 거면 index추가 안함.		
					
					context.save();				
					context.beginPath();
					context.arc(plotXmargin+plotWidth+20,cnt*13+30, scale, (Math.PI/180)*0, (Math.PI/180)*360, false);
					color(Data[i]);					
					context.fill();
					context.stroke(); 
					context.closePath();				
					context.restore();
					
					context.strokeStyle = "#000000";	
				 	context.fillStyle = "#000000"; 				
					context.font="bold 11px verdana, sans-serif";
					context.fillText(Data[i],plotXmargin+plotWidth+30,cnt*13+35);
					
				
					
					cnt++;
				}
			}
			context.strokeRect(plotXmargin+plotWidth+10 ,20, 700-660 , (cnt*13+35) - 20);
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
		        context.clearRect(0, 650, 800, 100);
		        context.font = '18pt Calibri';
		        context.fillStyle = 'black';
		        context.fillText(message, 10, 700);
		        
		 }
		      function getMousePos(canvas, evt) {
		        var rect = canvas.getBoundingClientRect();
		        return {
		          x: xMax/plotWidth*(evt.clientX - rect.left - plotXmargin),
		          y: -yMax/plotHeight*(  evt.clientY - rect.top - (plotYmargin+plotHeight))
		        };
		      }
		 //     var canvas = document.getElementById('myCanvas');
		   //   var context = canvas.getContext('2d');

}





