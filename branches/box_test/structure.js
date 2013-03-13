//Once starting, belows will be set up right away.
var mainArr; // array for all data.
var labelArr; // character array for the column names.
var isDiscrete; // array for confirming discrete data

function csv2Arr(data, liveChar)
 {	
 	var i = 0;
 	var eof = '';
 	var cursor = data.charAt(i);
 	var result_array = new Array();
 	var result_row = "";
 	var line = 0;
 	while(cursor != eof)
 	{
 		if((cursor == '\"') || (cursor == '\r') ||(cursor == '\t')){
 		}else if( cursor == "\n" ){
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
function getData(fileName)
{
	var filePath = fileName;	
	xmlhttp = new XMLHttpRequest();	
	xmlhttp.open("GET",filePath,false);
	xmlhttp.send(null);
	var fileContent = xmlhttp.responseText;
	var tempArr = csv2Arr(fileContent);
	var returnLabelArr = tempArr[0].toString().split(',');	
	tempArr.shift();
	var returnDataArr = tempArr;
	return { 'dataArr' : returnDataArr, 'labelArr' : returnLabelArr };	
}

function make2DArr(rows) {
	  var arr = [];
	  for (var i=0;i<rows;i++) {
		  arr[i] = [];
	  }
	  return arr;
}

function createMainStructure(fileName)
{
	var tmpArr = getData(fileName);		
	var dataArr=tmpArr.dataArr;
	labelArr=tmpArr.labelArr;	 
	mainArr = make2DArr(labelArr.length);	
	isDiscrete = new Array(labelArr.length);
	
	for(var j=0; j<dataArr.length; j++)
	{
		var tmpArr = dataArr[j].toString().split(',');	
		
		for(var i = 0 ; i < labelArr.length ; i ++)
		{
			if(isNaN((tmpArr[i])))
			{
				mainArr[i][j] = tmpArr[i];
				isDiscrete[i] = true;					
			}else{				
				mainArr[i][j] = parseFloat(tmpArr[i]);
				if( j > 0 && isDiscrete[i] != true)
				{
					isDiscrete[i] = false;
				}
			}			
		}	
	}
	//alert(isDiscrete);
}		


		