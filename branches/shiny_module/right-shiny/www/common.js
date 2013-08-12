var plotWidth = 300;  //default value for plot width
var plotHeight = 300; //default value for plot height  
var plotRadius = 2;

/**  set tooltip  **/
//new kenetic version -> tooltip setting change using tag
function setTooltip(obj)
{
	obj.tooltipLayer = new Kinetic.Layer();			 
	obj.tooltip = new Kinetic.Label({
	    opacity: 0.75,
	    visible: false,
	    listening: false
	  });
	obj.tooltip.add(new Kinetic.Tag({
	    fill: 'black',
	    //pointerDirection: 'down',
	    pointerWidth: 10,  
	    pointerHeight: 10, 
	    lineJoin: 'round',
	    shadowColor: 'black',
	    shadowBlur: 10,
	    shadowOffset: 10,
	    shadowOpacity: 0.2
	  }));
	obj.tooltip.add(new Kinetic.Text({
	    text: '',
	    fontFamily: 'Calibri',
	    fontSize: 15,
	    padding: 5,
	    fill: 'white'
	  }));
	obj.tooltipLayer.add(obj.tooltip);
}
/**  set tooltip end  **/ 




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
function refreshTable(tableID, mainArr){
	return function() {
		deleteRow(tableID); //delete all Row first.
	    var table = document.getElementById(tableID);
	    var rowCount = table.rows.length;
	    var row = table.insertRow(rowCount);
	    var colCount = table.rows[0].cells.length;
	    var colWidth=100;
	    for(var i=0; i < mainArr.selectTable.length ; i++)
		{
			if(mainArr.selectTable[i] == 1)
			{
				//alert('1');
				rowCount = table.rows.length;
				row = table.insertRow(rowCount);
				var newcell = row.insertCell(0);
				newcell.align = 'center';			
				newcell.style.backgroundColor = '#cfe444';
				newcell.style.color = 'black';
				newcell.innerHTML = i;
				newcell.width = colWidth;
				
				for(var j=1; j<colCount; j++) {
					var newcell = row.insertCell(j);			
					newcell.align = 'center';
					newcell.style.color = 'black';
					newcell.width = colWidth;
					newcell.innerHTML = mainArr[mainArr.labelArr[j-1]][i];
				}
			}
		}	
	};
}

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
function allGraphUpdate(Name, nodes, select) 
{	
	Name.firstUpdate(nodes, select);
}

function firstUpdate(obj)
{
	return function(nodes, select)
		{
			var object = obj;
			var temp = nodes;
			// find root
			var cnt = 0;
			while(object.parent != null){				
				temp = object.childTOparent(temp);
				object = object.parent;
			}
			// selectTable update & call refreshTable.
			if(temp.length == undefined){
				object.selectTable[temp] = select;
			}else{
				for(var i = 0 ; i < temp.length ; i ++){
					object.selectTable[temp[i]] = select;
				}
			}
			object.refreshTable();
			// children update
			if(object.child != null){
				for(var i = 0 ; i < object.child.length ; i ++){
					var temp2 = object.parentTOchild[i](temp);
					childUpdate(object.child[i], temp2, select);
				}
			}
		};
}

function childUpdate(obj, nodes, select)
{
	// my update
	for(var i = 0 ; i < obj.updateArr.length ; i ++){
		obj.updateArr[i](nodes, select);
		obj.refreshArr[i]();
	}
	//child update
	if(obj.child != null){
		for(var i = 0 ; i < obj.child.length ; i ++){
			var temp = parent.parentTOchild[i](nodes);
			childUpdate(obj.child[i], temp, select);
		}
	}
}
function makeRefresh(stage){
	return function()
		{
			stage.draw();
		}
}

function allSelect(Name)
{
	var tmpNodeArr = new Array();
	for(var i = 0 ; i < Name.node.length ; i ++)
	{
		tmpNodeArr.push(i);
	}
	allGraphUpdate(Name, tmpNodeArr, 1);	
}
function allDeselect(Name)
{
	var tmpNodeArr = new Array();
	for(var i = 0 ; i < Name.node.length ; i ++)
	{
		tmpNodeArr.push(i);
	}
	allGraphUpdate(Name, tmpNodeArr, 0);

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
