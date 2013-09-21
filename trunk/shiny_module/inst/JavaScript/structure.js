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
	xmlhttp.open("GET", filePath, false);
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
function createMainStructure(fileName)
{	
	var tmpArr = getData(fileName);	
	var dataArr = tmpArr.dataArr;	
	var labelArr = tmpArr.labelArr;
	var mainArr = new Object();
	var cntArr = new Array();
	var isNumArr = new Array();
	var isSelected = make2DArr(dataArr.length);
	// initialization.
	for(var i = 0 ; i < labelArr.length ; i ++){
		cntArr[i] = 0;
		isNumArr[i] = true;
		mainArr[labelArr[i]] = new Array();
		mainArr[labelArr[i]].isDiscrete = true;
		mainArr[labelArr[i]].index = new Array();
		mainArr[labelArr[i]].$Original = new Array();
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
				mainArr[labelArr[j]].$Original[i] = tmpArr[j];
			}else{
				mainArr[labelArr[j]][i] = parseFloat(tmpArr[j]);
				mainArr[labelArr[j]].$Original[i] = parseFloat(tmpArr[j]);
			}
		}
		isSelected[i][0] = 0;
	}
	// event components
	mainArr._type = 'rootObj';
	mainArr.labelArr = labelArr; // for table.
	mainArr.parent = null;
	mainArr.child = null;
	mainArr.$isSelected = isSelected;
	mainArr.$ans = "undefined";
	for(var i = 0 ; i < mainArr.$isHidden ; i ++){
		mainArr.$isHidden[i] = false;
	}
	mainArr.$id = 1;
	mainArr.refreshArr = new Array();
	mainArr.refreshArr[0] = null;
	// factoring of discrete data.
	for(var i = 0 ; i < labelArr.length ; i ++){
		delete mainArr[labelArr[i]]["tempField"];
		if(mainArr[labelArr[i]].isDiscrete == true){
			for(var j = 0 ; j < mainArr[labelArr[i]].index.length ; j ++){
				if(!isNaN(mainArr[labelArr[i]].index[j])){
					mainArr[labelArr[i]].index[j] = parseFloat(mainArr[labelArr[i]].index[j]);
				}
			}
			mainArr[labelArr[i]].index.sort(function(a,b){return a-b});
			for(var j = 0 ; j < mainArr[labelArr[i]].length ; j ++){
				mainArr[labelArr[i]][j] = mainArr[labelArr[i]].index.indexOf(mainArr[labelArr[i]][j]);
				
			}
		}else{
			delete mainArr[labelArr[i]].isDiscrete;
		}
	}
	// for hidden function.
	mainArr.$dataNumArr = new Array();
	mainArr.$isHidden = new Array();
	for(var i = 0 ; i < mainArr[labelArr[0]].length ; i ++){
		mainArr.$dataNumArr[i] = i;
		mainArr.$isHidden[i] = false;
	}

	return mainArr;
}
function createOffloadStructure()
{
	var mainArr = new Object();
	mainArr._type = 'offloadObj';
	mainArr.parent = null;
	mainArr.child = null;
	mainArr.$id = 1;
	mainArr.$readyState = false;
	mainArr.$isSelected = new Array();
	return mainArr;
	
}
/**  create main structure of data End  **/

/**  binning  **/
//only for continuous object.
function binning(labelObj, bin)
{
	// only work for continuous object.
	if(labelObj.isDiscrete == undefined){
		var temp = findMaxMinValue(labelObj);
		var tempMax = temp.max;
		var tempMin = temp.min;
		//alert(tempMax + ", " + tempMin);
		if(bin == undefined){
			var tickRange = (tempMax - tempMin) / 5;
			var tmp = Math.ceil(Math.log(tickRange) / Math.log(10));
			bin = setTickRange(tmp, tickRange);
		}
		//check the fixpoint.
		var fixPoint = 0;
		if(bin.toString().indexOf('.') != -1){
			fixPoint = bin.toString().substring(bin.toString().indexOf('.')+1, bin.toString().length).length;
		}
		if(tempMax > 0){
			var max = parseFloat((Math.ceil(tempMax / bin) * bin).toFixed(fixPoint));
		}else{
			var max = parseFloat((Math.ceil(tempMax / bin) * bin + bin).toFixed(fixPoint));
		}
		if(tempMax == max){
			max = max + bin;
		}
		var min = parseFloat((Math.floor(tempMin / bin) * bin).toFixed(fixPoint));
		var indexArr = new Array();
		// set index
		for(var i = 0 ; ; i ++){
			indexArr[i] =  parseFloat(min + i * bin).toFixed(fixPoint);
			if(indexArr[i] == max)
				break;
			if(indexArr[i] > max){
				alert("Error in \"binning\": javascript calculation error!");
				break;
			}
		}
		var factoredArr = new Array();
		for(var i = 0 ; i < labelObj.length ; i ++){
			var cnt = parseInt((labelObj[i] - min) / bin);
			factoredArr[i] = cnt;
		}
		return {
			'max': max,
			'min': min,
			'tempMax': tempMax,
			'tempMin': tempMin,
			'indexArr': indexArr,
			'factoredArr': factoredArr
		};
	}else{
		alert("The input of the binning should be continuous.");
		return;
	}
}
/**  binning End  **/

/**  setNode  **/
//set the fields of the root object recursively. 
function setNode(myNumber, endNumber, labels, indexArr, temp, root){
	if(endNumber > 1){
		var cnt1 = 0;
		var cnt2 = 0;
		for(var i = 0 ; i < indexArr[myNumber].length ; i ++){
			// for debugging
			// document.write(indexArr[myNumber][i] + " ");
			if(temp[indexArr[myNumber][i]] != undefined){
				cnt1 = setNode(myNumber + 1, endNumber - 1, labels, indexArr, temp[indexArr[myNumber][i]], root);
				for(t = 0 ; t < cnt1 ; t ++){
					root[labels[myNumber]].push(parseFloat(indexArr[myNumber][i]));
				}
				cnt2 = cnt2 + cnt1;
			}
		}
		return cnt2;
	}else{
		var cnt = 0;
		for(var i = 0 ; i < indexArr[myNumber].length ; i ++){
			// for debugging
			// document.write(indexArr[myNumber][i] + " ");
			if(temp[indexArr[myNumber][i]] != undefined){
				var frequency = temp[indexArr[myNumber][i]].frequency;
				cnt ++;
				root[labels[myNumber]].push(parseFloat(indexArr[myNumber][i]));
				root['frequency'].push(frequency);
				root['hasArr'].push(temp[indexArr[myNumber][i]].hasArr);
			}
		}
		return cnt;
	}
}
/**  setNode End  **/

/**  addField  **/
//add new field and return added field.
function addField(obj, fieldName){
	// for debugging
	// document.write(fieldName + " ");
	if(obj[fieldName] == undefined){
		obj[fieldName] = new Object();
	}
	return obj[fieldName];
}
/**  addField End  **/

/**  ddply  **/
//optionObj can be bin.
var ddply = {};
(function() {
	ddply = function(dataObj, labels, optionObj) {
		this.labels = labels;
		this.optionObj = optionObj;
		// make new fields of ddply object
		for(var i = 0 ; i < labels.length ; i ++){
			this[labels[i]] = new Array();
			if(dataObj[labels[i]].isDiscrete != undefined){
				this[labels[i]].isDiscrete = dataObj[labels[i]].isDiscrete;
				this[labels[i]].index = dataObj[labels[i]].index;
			}
		}
		this['frequency'] = new Array();
		this['hasArr'] = new Array();
		// binning continuous data.
		var binArr = new Array(labels.length);
		var indexArr = make2DArr(labels.length);
		var factoredArr = make2DArr(labels.length);
		for(var i = 0 ; i < labels.length ; i ++){
			if(dataObj[labels[i]].isDiscrete == undefined){
				// find indexArr, factoredArr of continuous labels.
				var temp = binning(dataObj[labels[i]], optionObj.bin);
				indexArr[i] = temp.indexArr;
				factoredArr[i] = temp.factoredArr;
				dataObj[labels[i]].max = temp.tempMax;
				dataObj[labels[i]].min = temp.tempMin;
			}else{
				// make indexArr of discrete label.
				for(var j = 0 ; j < dataObj[labels[i]].index.length ; j ++){
					indexArr[i][j] = j;
				}
			}
		}
		
		// calculate frequency
		var tmpObj = new Object();
		for(var i = 0 ; i < dataObj[labels[0]].length ; i ++){
			var temp = tmpObj;
			for(var j = 0 ; j < labels.length ; j ++){
				
				if(dataObj[labels[j]].isDiscrete == undefined){
					cnt = indexArr[j][factoredArr[j][i]];
				}else{
					cnt = dataObj[labels[j]][i];
				}
				temp = addField(temp, cnt);
			}
			// for debugging
			// document.write("<br>");
			if(temp['frequency']== undefined){
				temp['frequency'] = 1;
				temp['dataNumber'] = 
				temp['hasArr'] = new Array();
				temp['hasArr'].push(i);
			}else{
				temp['frequency'] ++;
				temp['hasArr'].push(i);
			}
		}
		
		
		// set the array of fields by using recursive function.
		setNode(0, labels.length, labels, indexArr, tmpObj, this);
		
		// copy max and min value for matching with axis binnig.
		for(var i = 0 ; i < labels.length ; i ++){
			if(dataObj[labels[i]].max != undefined){
				this[labels[i]].max = dataObj[labels[i]].max;
				this[labels[i]].min = dataObj[labels[i]].min;
			}
		}
		
		var hasArr = this['hasArr'];
		delete this['hasArr'];
		// make event handle part
		var p2cArr = new Array(dataObj[labels[0]].length);
		var isSelected = make2DArr(hasArr.length);
		for(var i = 0 ; i < hasArr.length ; i ++){
			isSelected[i][0] = 0;
			for(var j = 0 ; j < hasArr[i].length ; j ++){
				p2cArr[hasArr[i][j]] = i;
			}
		}
		this.$id = 1;
		this._type = 'histObj';
		this.$isSelected = isSelected;
		birthReport(dataObj, this, p2cArr, hasArr);

		// for debugging
		
	//	document.write("<br>");
		
		for(var j = 0 ; j < labels.length ; j ++){
	//		document.write(labels[j] + " ");
		}
	//	document.write("frequency <br>");
		var cnt = 0;
		for(var i = 0 ; i < this[labels[0]].length ; i ++){
			for(var j = 0 ; j < labels.length ; j ++){
	//			document.write(this[labels[j]][i] + " ,  ");
			}
	//		document.write(this.frequency[i] + "<br>");
			cnt = cnt + this.frequency[i];
		}
	//	document.write("Total frequency: " + cnt);
		
	
	};
	ddply.prototype = {
		_reCalculate: function() {	
			// reload data.
			var dataObj = this.parent;
			var labels = this.labels;
			var optionObj = this.optionObj;
			// make new fields of ddply object
			for(var i = 0 ; i < labels.length ; i ++){
				this[labels[i]] = new Array();
				if(dataObj[labels[i]].isDiscrete != undefined){
					this[labels[i]].isDiscrete = dataObj[labels[i]].isDiscrete;
					this[labels[i]].index = dataObj[labels[i]].index;
				}
			}
			
			this['frequency'] = new Array();
			this['hasArr'] = new Array();
			// binning continuous data.
			var binArr = new Array(labels.length);
			var indexArr = make2DArr(labels.length);
			var factoredArr = make2DArr(labels.length);
			for(var i = 0 ; i < labels.length ; i ++){
			//	alert(labels[i] + ", " + dataObj[labels[i]].isDiscrete);
				if(dataObj[labels[i]].isDiscrete == undefined){
					// find indexArr, factoredArr of continuous labels.
					var temp = binning(dataObj[labels[i]], optionObj.bin);
					indexArr[i] = temp.indexArr;
					factoredArr[i] = temp.factoredArr;
					dataObj[labels[i]].max = temp.tempMax;
					dataObj[labels[i]].min = temp.tempMin;
				}else{
					// make indexArr of discrete label.
					for(var j = 0 ; j < dataObj[labels[i]].index.length ; j ++){
						indexArr[i][j] = j;
					}
				}
			}
			// calculate frequency
			var tmpObj = new Object();
			for(var i = 0 ; i < dataObj[labels[0]].length ; i ++){
				var temp = tmpObj;
				for(var j = 0 ; j < labels.length ; j ++){
					
					if(dataObj[labels[j]].isDiscrete == undefined){
						cnt = indexArr[j][factoredArr[j][i]];
					}else{
						cnt = dataObj[labels[j]][i];
					}
					temp = addField(temp, cnt);
				}
				// for debugging
				// document.write("<br>");
				if(temp['frequency']== undefined){
					temp['frequency'] = 1;
					temp['dataNumber'] = 
					temp['hasArr'] = new Array();
					temp['hasArr'].push(i);
				}else{
					temp['frequency'] ++;
					temp['hasArr'].push(i);
				}
			}
			
			// set the array of fields by using recursive function.
			setNode(0, labels.length, labels, indexArr, tmpObj, this);
			// copy max and min value for matching with axis binnig.
			for(var i = 0 ; i < labels.length ; i ++){
				if(dataObj[labels[i]].max != undefined){
					this[labels[i]].max = dataObj[labels[i]].max;
					this[labels[i]].min = dataObj[labels[i]].min;
				}
			}
			var hasArr = this['hasArr'];
			delete this['hasArr'];
			// make event handle part
			var p2cArr = new Array(dataObj[labels[0]].length);
			var isSelected = make2DArr(hasArr.length);
			for(var i = 0 ; i < hasArr.length ; i ++){
				isSelected[i][0] = 0;
				for(var j = 0 ; j < hasArr[i].length ; j ++){
					p2cArr[hasArr[i][j]] = i;
				}
			}
			this.$isSelected = isSelected;
			ModifyBirth(dataObj, this, p2cArr, hasArr);
		}
	};
})();
/**  ddply End  **/



