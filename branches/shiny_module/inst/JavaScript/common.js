var plotWidth = 300;  //default value for plot width
var plotHeight = 300; //default value for plot height  
var plotRadius = 2;

function getNodeinfo(dataObj, id)
{
	var cnt = 0;
	for(var name in dataObj){
		if(cnt == 0){
			if(!(name == 'optionObj' || name == '_reCalculate' || name == 'labels' || name == 'parent' || name == 'child' || name == 'refreshTable' || name == 'labelArr' || name == '_type' || name == 'refreshArr' || name == '$id' || name == '$isSelected' || name == '$isHidden' || name == 'parentTOchild' || name == 'childTOparent' || name == 'updateArr' || name == 'refreshArr')){
				if(dataObj[name].isDiscrete == true){
					var info =  name + ': ' + dataObj[name].index[dataObj[name][id]];
				}else{
					var info =  name + ': ' + dataObj[name][id];
				}
			}
				
			cnt ++;
		}else{
			if(!(name == 'optionObj' || name == '_reCalculate' || name == 'labels' || name == 'parent' || name == 'child' || name == 'refreshTable' || name == 'labelArr' || name == '_type' || name == 'refreshArr' || name == '$id' || name == '$isSelected' || name == '$isHidden' || name == 'parentTOchild' || name == 'childTOparent' || name == 'updateArr' || name == 'refreshArr')){
				if(dataObj[name].isDiscrete == true){
					info = info + "\r\n" + name + ': ' + dataObj[name].index[dataObj[name][id]];
				}else{
					info = info + "\r\n" + name + ': ' + dataObj[name][id];
				}
			}
		}
	}
	return info;
}

function getFields(dataObj)
{
	var temp = new Array();
	for(var name in dataObj){
		if(!(name == 'optionObj' || name == '_reCalculate' || name == 'labels' || name == 'parent' || name == 'child' || name == 'refreshTable' || name == 'labelArr' || name == '_type' || name == 'refreshArr' || name == '$id' || name == '$isSelected' || name == '$isHidden' || name == 'parentTOchild' || name == 'childTOparent' || name == 'updateArr' || name == 'refreshArr')){
			temp.push(name);
		}
	}
	return temp;
}

////////////////////////////////////mouse position of each graph////////////////////////////////////
var mouseName;
var divOffsetX, divOffsetY;
function getCoords(e) {
    // coursesweb.net/

		var divX, divY = 0; 
		mouseName = this.id;
		var xy_pos = getXYpos(this);
		
		 // if IE
		if(navigator.appVersion.indexOf("MSIE") != -1) {
		   // in IE scrolling page affects mouse coordinates into an element
		   // This gets the page element that will be used to add scrolling value to correct mouse coords
			var standardBody = (document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;
			
			divX = event.clientX + standardBody.scrollLeft;
			divY = event.clientY + standardBody.scrollTop;
		}
		else {
			divX = e.pageX;
			divY = e.pageY;
		}
		
		divX = divX - xy_pos['xp'];
		divY = divY - xy_pos['yp'];
		divOffsetX = xy_pos['xp'];
		divOffsetY = xy_pos['yp'];
		 // displays x and y coords in the #coords element
		

	document.getElementById('coords');
}
//Get X, Y coords, and displays Mouse coordinates
function getXYpos(elm) {
	X = elm.offsetLeft;       
	Y = elm.offsetTop;        
	
	elm = elm.offsetParent;    // set elm to its offsetParent
	
	 //use while loop to check if elm is null
	 // if not then add current 
	 //offsetTop to y and set elm to its offsetParent
	while(elm != null) {
		X = parseInt(X) + parseInt(elm.offsetLeft);
		Y = parseInt(Y) + parseInt(elm.offsetTop);
		elm = elm.offsetParent;
	}
    // returns an object with "divXp" (Left), "=yp" (Top) position
	return {'xp':X, 'yp':Y};
}
//////////////////////////////////////////////////////////////////////////////////////////////


function birthReport(parent, child, p2cArr, c2pArr){
	child.parent = parent;
	if(parent.child == null){
		parent.child = new Array();
		parent.parentTOchild = new Array();
	}
	parent.child.push(child);
	parent.parentTOchild.push(setMapping(p2cArr));
	child.child = null;
	child.parentTOchild = null;
	child.childTOparent = setMapping(c2pArr);
	child.updateArr = new Array();
	child.refreshArr = new Array();
}

function ModifyBirth(parent, child, p2cArr, c2pArr){
	for(var i = 0 ; i < parent.child.length ; i ++){
		if(parent.child[i] == child)
			break;
	}
	
	if(i == parent.child.length){
		// error check.
		alert('There is no child which matches it.');
	}
	
	parent.parentTOchild[i] = setMapping(p2cArr);
	child.childTOparent = setMapping(c2pArr);
}


function setMapping(index)
{
	return function(nodes)
		{
			var returnArr = new Array();
			if(nodes.length == undefined){
				returnArr = index[nodes];
			}else{
				for(var i = 0 ; i < nodes.length ; i ++){
					returnArr = returnArr.concat(index[nodes[i]]);
				}
			}
			return returnArr;
		};
}

//allGraphUpdate is used for only select & unselect
function allGraphUpdate(graphObj, nodes, selectOn) 
{	
//	alert('allupdate ' + nodes + ', ' + selectOn);
	graphObj.firstUpdate(nodes, selectOn);
}

function firstUpdate(firstObj)
{
	return function(nodes, selectOn)
		{
			var object = firstObj;
			var temp = nodes;
			
			// when lineObj.
			if(firstObj._type == 'lineObj'){
				// my update
				if(nodes.length == undefined){
					object.$isSelected[nodes][0] = selectOn;
					for(var i = 1 ; i < object.$isSelected[nodes].length ; i ++){
						object.$isSelected[nodes][i](selectOn);
						object.$isSelected[nodes][i](selectOn);
					}
				}else{
					for(var j = 0 ; j < nodes.length ; j ++){
						object.$isSelected[nodes[j]][0] = selectOn;
						for(var i = 1 ; i < object.$isSelected[nodes[j]].length ; i ++){
							object.$isSelected[nodes[j]][i](selectOn);
							object.$isSelected[nodes[j]][i](selectOn);
						}
					}
				}
				// refresh
				for(var i = 1 ; i < object.refreshArr.length ; i ++){
					object.refreshArr[i]();
				}
			}
			
			// find root
			while(object.parent != null){
				temp = object.childTOparent(temp);
				object = object.parent;
			}
			var refineArr = new Array();
			var cnt = 0;
			// if just one node.
			if(temp.length == undefined){
				if(object.$isSelected[temp][0] != selectOn){ // prevent duplicate 
					object.$isSelected[temp][0] = selectOn;
					for(var i = 1 ; i < object.$isSelected[temp].length ; i ++){
						object.$isSelected[temp][i](selectOn);
					}
					refineArr[cnt++] = temp;
				}
			}else{ // more than one node.
				for(var j = 0 ; j < temp.length ; j ++){
					if(object.$isSelected[temp[j]][0] != selectOn){ // prevent duplicate 
						object.$isSelected[temp[j]][0] = selectOn;
						for(var i = 1 ; i < object.$isSelected[temp[j]].length ; i ++){
							object.$isSelected[temp[j]][i](selectOn);
						}
						refineArr[cnt++] = temp[j];
					}
				}
			}
			if(object.refreshTable != undefined){
				object.refreshTable();
			}
			
			// refresh
			for(var i = 1 ; i < object.refreshArr.length ; i ++){
				object.refreshArr[i]();
			}
			
			// child update
			if(object.child != null && cnt > 0){
				for(var i = 0 ; i < object.child.length ; i ++){
					var temp2 = object.parentTOchild[i](refineArr);
					childUpdate(object.child[i], temp2, selectOn, firstObj);
				}
			}
		};
}

function childUpdate(object, nodes, selectOn, firstObj)
{
	// my update
	if(!(object == firstObj && object._type == 'lineObj')){
		if(nodes.length == undefined){
			object.$isSelected[nodes][0] = selectOn;
			for(var i = 1 ; i < object.$isSelected[nodes].length ; i ++){
				object.$isSelected[nodes][i](selectOn);
			}
		}else{
			for(var j = 0 ; j < nodes.length ; j ++){
				object.$isSelected[nodes[j]][0] = selectOn;
				for(var i = 1 ; i < object.$isSelected[nodes[j]].length ; i ++){
					object.$isSelected[nodes[j]][i](selectOn);
				}
			}
		}
		// refresh
		for(var i = 1 ; i < object.refreshArr.length ; i ++){
			object.refreshArr[i]();
		}
	}
	
	//child update
	if(object.child != null){
		for(var i = 0 ; i < object.child.length ; i ++){
			var temp = object.parentTOchild[i](nodes);
			childUpdate(object.child[i], temp, selectOn, firstObj);
		}
	}
}
function makeRefresh(stage){
	return function()
		{
			stage.draw();
		}
}

function nullUpdate(node)
{
	return function(temp)
		{
			return;
		};
}

function allSelect(graphObj)
{
	var tmpNodeArr = new Array();
	for(var i = 0 ; i < graphObj.node.length ; i ++){
		tmpNodeArr.push(graphObj.node[i].getName());
	}
	allGraphUpdate(graphObj, tmpNodeArr, 1);	
}
function allDeselect(graphObj)
{
	var tmpNodeArr = new Array();
//	alert("deselect");
	for(var i = 0 ; i < graphObj.node.length ; i ++){
		tmpNodeArr.push(graphObj.node[i].getName());
	}
	allGraphUpdate(graphObj, tmpNodeArr, 0);

}
function findMaxMinValue(Data)
{	
	if(Data.length != undefined){
		var maxValue = Data[0];
		var minValue = Data[0];
		for(var i = 1 ; i < Data.length ; i ++){
			if(Data[i]>maxValue)
			{
				maxValue=Data[i];					
			}
			if(Data[i]<minValue)
			{
				minValue=Data[i];					
			}
		}
	}else{
		var maxValue = Data;
		var minValue = Data;
	}
	return {
		'max' : maxValue,
		'min' : minValue
	};
}
function setTickRange(x, tickRange)
{
	if(tickRange/Math.pow(10,x) < 0.1){tickRange = 0.1 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.2){tickRange = 0.2 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.25){tickRange = 0.25 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.3){tickRange = 0.3 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.4){tickRange = 0.4 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.5){tickRange = 0.5 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.6){tickRange = 0.6 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.7){tickRange = 0.7 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.75){tickRange = 0.75 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.8){tickRange = 0.8 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 0.9){tickRange = 0.9 * Math.pow(10,x); }
	else if(tickRange/Math.pow(10,x) <= 1.0){tickRange = 1.0 * Math.pow(10,x); }

	return tickRange;
}
Array.prototype.remove = function(idx) {
    return (idx<0 || idx>this.length) ? this : this.slice(0, idx).concat(this.slice(idx+1, this.length));
};
