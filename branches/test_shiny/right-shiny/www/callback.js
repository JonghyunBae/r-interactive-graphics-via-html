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
	Name._init(Name._id, tempData, {x: Name._labelArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);		
}
var changeYAxis = function (Name, i){
	Name._init(Name._id, tempData, {y: Name._labelArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);			
}
var changeColor = function (Name, i){
	Name._init(Name._id, tempData, {color: Name._labelArr[i]});
	Name.draw(Name._id);
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

var hidcnt = 0;
var tempHidden = new Array();
function hideSelected()
{
//	alert("a");
	var hiddenArr = new Array();
	for(var i = 0 ; i < isSelected.length ; i ++)
	{
		if(isSelected[i][0] == 1)
		{
			hiddenArr.push(i);
			hidcnt ++;
		}		
	}
//	alert("gggg");
	if(hiddenArr.length == undefined){
		isHidden[tempData[tempData.length-1][hiddenArr]] = true;
		tempHidden.push(tempData[tempData.length-1][hiddenArr]);
	}else{
		for(var i = 0 ; i < hiddenArr.length ; i ++){
			isHidden[tempData[tempData.length-1][hiddenArr[i]]] = true;
			tempHidden.push(tempData[tempData.length-1][hiddenArr[i]]);
		}
	}				
	//alert("gggg");
	tempData = make2DArr(mainArr.length);
	var h = 0;
	var p = 0;
	for(var i = 0 ; i < mainArr[0].length ; i ++){
		if(isHidden[i]){
			continue;
		}							
		for(var j = 0 ; j < mainArr.length ; j ++){
			tempData[j][h] = mainArr[j][i];
		}				
		h++;
	}
//	for(var i = 0 ; i < mainArr.length ; i ++){
//		document.write(mainArr[0] + "<br>");
//	}
//	document.write("<br>");
	//for(var i = 0 ; i < mainArr.length ; i ++){
	//	document.write(tempData[0] + "<br>");
	//}
	
	
	//tempData = mainArr;
	for(var i = 0 ; i < objArr.length ; i ++)
	{
	//	alert(objArr[i]._type);
		objArr[i]._init(objArr[i]._id, tempData, {});
		objArr[i].draw(objArr[i]._id);
		eventTrigger(objArr[i]);
		//alert("dddd");
	}
	//alert(hiddenArr.length);
	
	//window.Shiny.onInputChange("hide", "hide"); // telling receive message completely.
	
	//alert("ggghhgggg");
	
}

function resetSelected()
{
	hidcnt = 0;
	for(var i = 0 ; i < tempHidden.length ; i ++){
		isHidden[tempHidden[i]] = false;
	}
	tempHidden = new Array();
	tempData = mainArr; 
	
	for(var i = 0 ; i < objArr.length ; i ++)
	{
		objArr[i]._init(objArr[i]._id, tempData, {});
		objArr[i].draw(objArr[i]._id);
		eventTrigger(objArr[i]);
	}

}







