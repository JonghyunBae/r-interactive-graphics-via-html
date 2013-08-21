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
 		if((cursor == '\"') || (cursor == '\r') ||(cursor == '\t')||(cursor == ';')){
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

/**  create main structure of data  **/
// TODO: should add event handle part(e.g. isSelected, isHidden..).
// TODO: table relative part should be needed.
function createMainStructure(id, fileName)
{	
	var tmpArr = getData(fileName);	
	var dataArr = tmpArr.dataArr;	
	var labelArr = tmpArr.labelArr;
	var mainArr = new Object();
	var cntArr = new Array();
	var isNumArr = new Array();
	// initialization.
	for(var i = 0 ; i < labelArr.length ; i ++){
		cntArr[i] = 0;
		isNumArr[i] = true;
		mainArr[labelArr[i]] = new Array();
		mainArr[labelArr[i]].isDiscrete = true;
		mainArr[labelArr[i]].index = new Array();
		mainArr[labelArr[i]]["tempField"] = new Object();
	}
	// extract data from dataArr into mainArr.
	for(var i = 0 ; i < dataArr.length ; i ++){
		var tmpArr = dataArr[i].toString().split(',');
		for(var j = 0 ; j < labelArr.length ; j ++){
			if(mainArr[labelArr[j]].isDiscrete == true && mainArr[labelArr[j]]["tempField"][tmpArr[j]] == undefined){
				mainArr[labelArr[j]]["tempField"][tmpArr[j]] = j;
				mainArr[labelArr[j]].index.push(tmpArr[j]);
				cntArr[j] ++;
				if(cntArr[j] > 25 && isNumArr[j] == true){ // if continuous data -> delete redundant field.
					mainArr[labelArr[j]].isDiscrete = false;
					delete mainArr[labelArr[j]].index;
				}
				
			}
			if(isNaN((tmpArr[j]))){
				isNumArr[j] = false;
				mainArr[labelArr[j]][i] = tmpArr[j];
			}else{
				mainArr[labelArr[j]][i] = parseFloat(tmpArr[j]);
			}
		}
	}
	// factoring of discrete data.
	for(var i = 0 ; i < labelArr.length ; i ++){
		delete mainArr[labelArr[i]]["tempField"];
		if(mainArr[labelArr[i]].isDiscrete == true){
			mainArr[labelArr[i]].index.sort();
			for(var j = 0 ; j < mainArr[labelArr[i]].length ; j ++){
				mainArr[labelArr[i]][j] = mainArr[labelArr[i]].index.indexOf(mainArr[labelArr[i]][j]);
			}
		}else{
			delete mainArr[labelArr[i]].isDiscrete;
		}
	}
	return mainArr;
}