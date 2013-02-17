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
 		}else if( cursor == "\n" ){
 			result_row += cursor;
 			if (result_array.length <= line)
 			{
 				result_array.push(new Array());
 				result_array[line].push(result_row);
 				result_row = "";
 				line++;
 			}
 		}else{
 			result_row += cursor;
 		}
 		cursor = data.charAt(i++);
 	}
 	return result_array;
 }
//////////////////////////////////////Chk key event Start//////////////////////////////////////   

window.addEventListener('keydown',this.checkKeyDown,false);	
window.addEventListener('keyup',this.checkKeyUp,false);	
var ctrlPressed = false;
var shiftPressed = false;
var aPressed = false;
var gPressed = false;
var tmpShift = false;
function checkKeyDown(e) {
	//alert(e.keyCode);
	//17 || 25 = ctrl, shift = 16, a=65, g= 71
	if(e.keyCode == 17 || e.keyCode == 25){
		ctrlPressed = true;
	}
	if(e.keyCode == 16){
		shiftPressed = true;
	}
	if(e.keyCode == 65){
		aPressed = true;
	}
	if(e.keyCode == 71){
		gPressed = true;
	}
}	
function checkKeyUp(e) {
//	alert(e.keyCode);
	//17 || 25 = ctrl, shift = 16
	if(ctrlPressed = true){
		ctrlPressed = false;
	}
	if(shiftPressed = true){
		shiftPressed = false;
	}
	if(aPressed = true){
		aPressed = false;
	}
	if(gPressed == true){
		gPressed = false;
	}
}	
/*
function check(e) {
var code = e.keyCode;
switch (code) {
case 37: alert("Left"); break; //Left key
case 38: alert("Up"); break; //Up key
case 39: alert("Right"); break; //Right key
case 40: alert("Down"); break; //Down key
default: alert(code); //Everything else
}
}*/
//////////////////////////////////////Chk key event End//////////////////////////////////////

function scatterFindMaxValue(Data,diff)
{
	var maxValue=Data[1];
	var returnValue;
	for(var i=2; i<Data.length; i++)
	{
		if(Data[i]>maxValue)
		{
			maxValue=Data[i];					
		}
	}
	returnValue=parseInt(maxValue+1);	
	for(var i=0; i<diff; i++)
	{
		returnValue=returnValue+i;
		if((returnValue% diff) == 0)
		{
			break;
		}				
	}	
	return returnValue;
}

function histFindMaxValue(xMaxHist, xData,diff)
{
	var maxValue=0;
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMaxHist/diff +1); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMaxHist/diff +1); cnt++)
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*diff && xData[i]<(cnt+1)*diff)
			{
				tmpHistArr[cnt]++;
			}
		}
	}
	for(var i=0; i<parseInt(xMaxHist/diff +1); i++)
	{
		if(tmpHistArr[i]>maxValue)
		{
			maxValue=tmpHistArr[i];					
		}
	}	
	return maxValue;
}


function make2DArr(rows) {
	  var Arr = [];
	  for (var i=0;i<rows;i++) {
		  Arr[i] = [];
	  }
	  return Arr;
}


