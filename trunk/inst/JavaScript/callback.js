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
	//alert("callback_hideSelected");

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
		
		if(rootObjArr[i].$isOffload)
			continue;
		
		var tempData = make2DArr(rootObjArr[i].labelArr.length); //n by n
		var tempStatus = new Array();
		var tempSelect = new Array();
		var labelArr = rootObjArr[i].labelArr;
		var liveNumArr = new Array();
		var deadNumArr = new Array();
		
		//alert(rootObjArr[i].$isSelected.length);
		for(var j=0; j<rootObjArr[i].$isSelected.length; j++) {
			tempSelect.push(rootObjArr[i].$isSelected[j]);
			//alert(rootObjArr[i].$isSelected[j]);
		}
			
		for(var j = 0; j < rootObjArr[i].statusArr.length ; j ++){
			//if(rootObjArr[i].$isSelected[j][0] == 0){ // ?
			if(rootObjArr[i].statusArr[j] == 0) {
				for(var t = 0 ; t < tempData.length ; t ++){
					tempData[t].push(rootObjArr[i][labelArr[t]][j]);
				}	
				liveNumArr.push(j);
			}else{
				deadNumArr.push(j);
			}
		}
		// reset the isHiiden of mainArr. This calculation should be in front of resetting dataNumArr of mainArr.
		for(var j = 0 ; j < deadNumArr.length ; j ++){
			rootObjArr[i].$isHidden[rootObjArr[i].$dataNumArr[deadNumArr[j]]] = true;
		}
				
		// reset the dataNumArr of mainArr.
		var tmp = new Array();
		
		for(var j = 0 ; j < liveNumArr.length ; j ++){
			tmp.push(rootObjArr[i].$dataNumArr[liveNumArr[j]]);
		}
		rootObjArr[i].$dataNumArr = tmp;		
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

		// update $isSelected & statusArr.
		rootObjArr[i].$isSelected = make2DArr(rootObjArr[i][labelArr[0]].length);
		
		for(var j = 0 ; j < rootObjArr[i].$isSelected.length ; j ++ ){
			rootObjArr[i].$isSelected[j] = tempSelect[j];
		}
		
		rootObjArr[i].statusArr = new Array(liveNumArr.length);
		for(var j = 0; j < rootObjArr[i].statusArr.length; j++) {
			rootObjArr[i].statusArr[j] = 0;
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
	
	for(var i = 0 ; i < rootObjArr.length ; i ++){
		if(rootObjArr[i].offloadObjArr != null){
			for(var j = 0 ; j < rootObjArr[i].offloadObjArr.length ; j ++){
				rootObjArr[i].offloadObjArr[j].$sendData(rootObjArr[i].$isHidden);
			}
		}
	}
	
}
function childReCalculate(object)
{
	//alert("callback_childReCalculate");
	
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
	//alert("callback_resetSelected");
	window.top.location.reload();
}
