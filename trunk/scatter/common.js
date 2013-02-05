//////////////// Get Data from csv File ////////////
var filePath = "Theoph-from-R.csv";
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET",filePath,false);
xmlhttp.send(null);
var fileContent = xmlhttp.responseText;
var array = csv2array(fileContent);
/*for(var i=0; i<array.length; i++){
	document.write("a("+i+") is : "+array[i]+"<br>");
}*/

//var array = fileContent.split(',');
//////////////// Common Data Structure //////////////
function ObjTemp()
{
	this.subject='';
    this.wt = '';
    this.dose = '';
    this.time = '';
    this.conc = '';
};

 ///////////////////  Common Array  ///////////////
var theophArr = new ObjTemp();
theophArr.subject = new Array();
theophArr.wt = new Array();
theophArr.dose = new Array();
theophArr.time = new Array();
theophArr.conc = new Array();

///////////////// Get Data Name /////////////////
var tmp_array0 = array[0].toString().split(',');	
theophArr.subject[0]=tmp_array0[0];
theophArr.wt[0]=tmp_array0[1];
theophArr.dose[0]=tmp_array0[2];
theophArr.time[0]=tmp_array0[3];
theophArr.conc[0]=tmp_array0[4];

////////////////  Split & Save Data //////////////////
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

////////////////////Common Using Variable //////////////
var radius_scale = 3; /// Dot radius
var plotWidth=500;
var plotHeight=500;
var plotXmargin=150;
var plotYmargin=90; 


//////////////////Common Using Functions ////////////////
// Each description of function yet.
///////////////////////////////////////////////////////


function csv2array(data, liveChar)
{	
	var i = 0;
	var eof = '';
	var cursor = data.charAt(i);
	var result_array = new Array();
	var result_row = "";
	var line = 0;
	while(cursor != eof)
	{
		if((cursor == '\"') || (cursor == '\r') || (cursor == '\t') || (cursor == ' ') ){
//			document.write("ddddddddddddddddddd" + "<br>");
		}else if( cursor == "\n" ){
//			document.write("dttttttt" + "<br>");
			result_row += cursor;
			if (result_array.length <= line)
			{
				result_array.push(new Array());
				result_array[line].push(result_row);
				result_row = "";
				line++;
			}
		}else{
//			document.write("a("+i+") is : "+ cursor+"<br>");
			result_row += cursor;
		}
			
		cursor = data.charAt(i++);
	}
	return result_array;
}

function getMousePos(xMax, yMax, canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: xMax/plotWidth*(evt.clientX - rect.left - plotXmargin),
      y: -yMax/plotHeight*(  evt.clientY - rect.top - (plotYmargin+plotHeight))
    };
  }

function drawDot(x,y,c,name)
{
	var canvas = document.getElementById("canvas" + name);
	var context = canvas.getContext("2d");
	context.beginPath();
	context.arc(x,y, radius_scale, (Math.PI/180)*0, (Math.PI/180)*360, false);
	color(c,1);
	context.stroke(); 
	context.fill();
	context.closePath();
}

function writeMessage(canvas, message, name)
{
	var canvas = document.getElementById("canvas" + name);
	var context = canvas.getContext("2d");
	context.clearRect(plotXmargin + 20, 700, 800, 150);
	context.font = '18pt Calibri';
	context.fillStyle = 'black';
	context.fillText(message, plotXmargin + 30, 750);
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

function drawLine(x1,y1,x2,y2,c,name)
{
	var canvas = document.getElementById("canvas" + name);
	var context = canvas.getContext("2d");
	context.beginPath();
	context.moveTo(x1,y1);			
	context.lineTo(x2,y2);
	color(c,name);
	context.stroke(); 
}




function findMaxValue(Data,diff)
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

function color(c, name)
{
	var canvas = document.getElementById("canvas" + name);
	var context = canvas.getContext("2d");
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

function drawLegend(Location,Data,name)
{
	var canvas = document.getElementById("canvas" + name);
	var context = canvas.getContext("2d");
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