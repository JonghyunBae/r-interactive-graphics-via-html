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
	var rootObjArr = new Array();
	var axisArr = new Array();
	// find all rootObj related with this Axis.
	for(var i = 0 ; i < Name.graphObjArr.length ; i ++){
		// get dataObj of each graph on the axis.
		var temp = Name.graphObjArr[i].dataObj;
		// find root.
		while(temp.parent != null){
			temp = temp.parent;
		}
		// save all rootObj in the rootObjArr.
		for(var j = 0 ; j < rootObjArr.length ; j ++){
			if(temp == rootObjArr[j]) // prevent duplicate.
				break;
		}
		if(j == rootObjArr.length){
			rootObjArr.push(temp);
		}
	}
	// update $isSelected and update dataField.
	for(var i = 0 ; i < rootObjArr.length ; i ++){
		var tempData = make2DArr(rootObjArr[i].labelArr.length);
		var labelArr = rootObjArr[i].labelArr;
		for(var j = 0 ; j < rootObjArr[i].$isSelected.length ; j ++){			
			if(rootObjArr[i].$isSelected[j][0] == 0){
				for(var t = 0 ; t < tempData.length ; t ++){
					tempData[t].push(rootObjArr[i][labelArr[t]][j]);
				}
			}
		}
		// update dataField.
		for(var j = 0 ; j < labelArr.length ; j ++){
			for(var t = 0 ; t < tempData[j].length ; t ++){
				rootObjArr[i][labelArr[j]][t] = tempData[j][t];
			}
			for(var k = t ; k < t + (rootObjArr[i][labelArr[j]].length - t) ; k ++){
				delete rootObjArr[i][labelArr[j]][k];
			}
			rootObjArr[i][labelArr[j]].splice(t, (rootObjArr[i][labelArr[j]].length - t));
		}
		//alert(rootObjArr[i].conc);

		// update $isSelected.
		rootObjArr[i].$isSelected = make2DArr(rootObjArr[i][labelArr[0]].length);
		for(var j = 0 ; j < rootObjArr[i].$isSelected.length ; j ++ ){
			rootObjArr[i].$isSelected[j][0] = 0;
		}
		
		// recalculate all children dataObj.
		if(rootObjArr[i].child != null){
			for(var j = 0 ; j < rootObjArr[i].child.length ; j ++){
				childReCalculate(rootObjArr[i].child[j]);
			}
		}
	}
	
	// redraw all axis.
	for(var i = 0 ; i < AllAxisObjArr.length ; i ++){
		AllAxisObjArr[i]._reDraw();
	}
	eventTrigger(AllAxisObjArr);
	// TODO: should call server offload!!
}
function childReCalculate(object)
{
	// my recalculate.
	object._reCalculate();	
	// child recalculate.
	if(object.child != null){
		for(var i = 0 ; i < object.child.length ; i ++){
			childReCalculate(object.child[i]);
		}
	}
}

function resetSelected(Name)
{
	// refresh page.
	window.top.location.reload();
}







