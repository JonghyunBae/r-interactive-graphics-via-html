var legendArr = ['right', 'left', 'topright', 'topleft', 'default'];
var widthArr = [-100, -10, -1, 1, 10, 100];
var heightArr = [-100, -10, -1, 1, 10, 100];
var binArr = [-1, 1];
var array_of_functions = [
                          function(Name, i) { changeXAxis(Name, i) },
                          function(Name, i) { changeYAxis(Name, i) },
                          function(Name, i) { changeColor(Name, i) },
                          function(Name, i) { changeLegend(Name, i) },
                          function(Name, i) { changeWidth(Name, i) },
                          function(Name, i) { changeHeight(Name, i) },
                          function(Name, i) { changeBin(Name, i) }
                      ]
var changeXAxis = function (Name, i){
	Name.changeX(Name._id, tempData, {x: Name._labelArr[i]});
	eventTrigger(Name);		
}
var changeYAxis = function (Name, i){
	Name.changeY(Name._id, tempData, {y: Name._labelArr[i]});
	eventTrigger(Name);			
}
var changeColor = function (Name, i){
	Name.changeColor(Name._id, tempData, {color: Name._labelArr[i]});
	//Name.draw(Name._id);
	eventTrigger(Name);
}
var changeLegend = function (Name, i){
	Name._init(Name._id, tempData, {legend: legendArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);
}
var changeWidth = function (Name, i){
	Name._init(Name._id, tempData, {width: Name.width + widthArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);
}
var changeHeight = function (Name, i){
	Name._init(Name._id, tempData, {height: Name.height + heightArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);
}
var changeBin = function (Name, i){
	Name._init(Name._id, tempData, {bin: Name.bin + binArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);
}

//these variables are used for only hideSelected and resetSelected.
var hideCnt = 0; 
var tempHidden = new Array();	// collect total hidden nodes.
function hideSelected()
{
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
	for(var i = 0 ; i < objArr.length ; i ++)
	{
		objArr[i]._init(objArr[i]._id, tempData, {});
		objArr[i].draw(objArr[i]._id);
		eventTrigger(objArr[i]);
	}
}

function resetSelected()
{
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

}







