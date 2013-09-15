var legendArr = ['right', 'left', 'topright', 'topleft', 'default'];
var widthArr = [-100, -10, -1, 1, 10, 100];
var heightArr = [-100, -10, -1, 1, 10, 100];
var binArr = [-1, 1];
var array_of_functions = [
                          function(Name, label) { changeXAxis(Name, label) },
                          function(Name, label) { changeYAxis(Name, label) },
                          function(Name, label) { changeColor(Name, label) },
                          function(Name, label) { changeWidth(Name, label) },
                          function(Name, label) { changeHeight(Name, label) },
                          function(Name, label) { changeBin(Name, label) }
                      ];
// Name -> axisobj
var changeXAxis = function (Name, label){
	alert(label);
}
var changeYAxis = function (Name, label){
	alert(label);
}
var changeColor = function (Name, label){
	alert(label);
}
var changeWidth = function (Name, label){
	alert(label);
}
var changeHeight = function (Name, label){
	alert(label);
}
var changeBin = function (Name, label){
	alert(label);
}

//these variables are used for only hideSelected and resetSelected.
var hideCnt = 0; 
var tempHidden = new Array();	// collect total hidden nodes.
function hideSelected(Name)
{
	var dataObj = Name.graphObjArr[0].dataObj;
	
	// find root dataObj.
	while(dataObj.parent != null){
		dataObj = dataObj.parent;
	}
	
	// set the $isSelected -> 3
	var temp = new Array();
	for(var i = 0 ; i < dataObj.$isSelected.length ; i ++){
		if(dataObj.$isSelected[i][0] == 1){
			temp.push(i);
			dataObj.$isSelected[i][0] = 3; 
		}
	}
	
	if(dataObj.refreshTable != undefined){
		dataObj.refreshTable();
	}
	
	// $isSelecteds of children are updated.
	if(temp.length > 0 && dataObj.child != null){
		for(var i = 0 ; i < dataObj.child.length ; i ++){
			var temp2 = dataObj.parentTOchild[i](temp);
			childUpdate(dataObj.child[i], temp2, 3);
		}
	}
	
	// redraw
	
	alert('hide selected!');
	/*
	var hiddenArr = new Array();
	// collect nodes' numbers which will be hidden.
	for(var i = 0 ; i < isSelected.length ; i ++)
	{
		//find selected nodes.
		if(isSelected[i][0] == 1)
		{
			hiddenArr.push(i);
			hideCnt ++;
		}
		//check the end of the isSelected.
		if(isSelected[i][0] == 2){
			isSelected[i][0] = 0;	// delete last end check.
			break;
		}	
			
		isSelected[i][0] = 0;
	}
	if(hideCnt > 0)
		isSelected[isSelected.length - hideCnt][0] = 2; // check it as the end of the isSelected.
	
	//	set the tempData with non hidden nodes of mainArr.
	if(hiddenArr.length == undefined){
		isHidden[tempData[tempData.length-1][hiddenArr]] = true;
		tempHidden.push(tempData[tempData.length-1][hiddenArr]);
	}else{
		for(var i = 0 ; i < hiddenArr.length ; i ++){
			isHidden[tempData[tempData.length-1][hiddenArr[i]]] = true;
			tempHidden.push(tempData[tempData.length-1][hiddenArr[i]]);
		}
	}				
	tempData = make2DArr(mainArr.length);
	var h = 0;
	for(var i = 0 ; i < mainArr[0].length ; i ++){
		if(isHidden[i]){
			continue;
		}
		for(var j = 0 ; j < mainArr.length ; j ++){
			tempData[j][h] = mainArr[j][i];
		}
		h++;
	}
	
	// redraw graphs.
	for(var i = 0 ; i < objArr.length ; i ++){
		objArr[i]._init(objArr[i]._id, tempData, {});
		objArr[i].draw(objArr[i]._id);
		eventTrigger(objArr[i]);
	}
	*/
}

function resetSelected()
{
	alert('reset selected!');
	/*
	if(hideCnt > 0)
		isSelected[isSelected.length - hideCnt][0] = 0; // delete last end check.
	hideCnt = 0; // reset the hideCnt.
	for(var i = 0 ; i < tempHidden.length ; i ++){
		isHidden[tempHidden[i]] = false;	// make isHidden with false.
	}
	tempHidden = new Array();	// reset the tempHidden.
	tempData = mainArr; 	// reset the tempData.
	
	// redraw graphs.
	for(var i = 0 ; i < objArr.length ; i ++)
	{
		objArr[i]._init(objArr[i]._id, tempData, {});
		objArr[i].draw(objArr[i]._id);
		eventTrigger(objArr[i]);
	}
	*/
}







