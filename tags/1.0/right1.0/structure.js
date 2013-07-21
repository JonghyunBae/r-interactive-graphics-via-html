/**
 * StructureJS JavaScript Library
 * 
 * Copyright 2013, The RIGHT team
 * Licensed under the MIT or GPL Version 2 licenses.
 *
 * Copyright (C) 2013 by The RIGHT team
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

//Once starting, belows will be set up right away.
var mainArr; // array for all data.
var labelArr; // character array for the column names.
var isDiscrete; // array for confirming discrete data
var isSelected; // array for selected node and save each update function
var objArr = new Array();
/*
function test(i)
{
	return function (tt)
	{
		alert(i + ", " + tt);
	};
}
*/
//b = a(1);
/*
var b = make2DArr(10);
for(var i = 0 ; i < 10 ; i++)
{
	b[i][0] = 1
}
alert(b);
b[0].push(a(3));
b[0].push(a(4));
b[0][1](2);
b[0][2](5);
*/



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

function createMainStructure(fileName)
{
	
	var tmpArr = getData(fileName);		
	var dataArr=tmpArr.dataArr;
	labelArr=tmpArr.labelArr;	 
	
	isSelected = make2DArr(dataArr.length);
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
		isSelected[j][0] = 0;	//selected 값 저장 . selected는 모두 0이므로 0으로 초기화 여기에 추가적으로 update function들 붙일 것.  
	}
	
//	isSelected[0].push(test(1));
//	alert(isSelected[0][1](3));
	
}		


		