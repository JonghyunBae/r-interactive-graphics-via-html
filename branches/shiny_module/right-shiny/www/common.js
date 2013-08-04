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



//allGraphUpdate is used for only select & unselect
function allGraphUpdate(Name, nodes, select) 
{	
	Name.firstUpdate(nodes, select);
}

function firstUpdate(obj, child)
{
	return function(nodes, select)
		{
			// parent update
			if(obj.parent != null){
				var parent = obj.parent;
				var temp = obj.childTOparent(nodes);
				allUpdate(parent, temp, obj, select);
			}
			// my update
			if(nodes.length == undefined){
				for(var j = 1 ; j < obj.isSelected[nodes].length ; j ++){
					obj.isSelected[nodes][j](select);
					obj.refreshArr[j]();
				}
			}else{
				for(var i = 0 ; i < nodes.length ; i ++){
					for(var j = 1 ; j < obj.isSelected[nodes[i]].length ; j ++){
						obj.isSelected[nodes[i]][j](select);
					}
				}
				for(var j = 1 ; j < obj.refreshArr.length ; j ++){
					obj.refreshArr[j]();
				}
			}
			// child update
			if(obj.child != null){
				for(var i = 0 ; i < obj.child.length ; i ++){
					if(obj.child[i] != child){	// prevent infinite loop.
						var temp = obj.parentTOchild[i](nodes);
						childUpdate(obj.child[i], temp, select);
					}
				}
			}
		};
}
function allUpdate(obj, nodes, child, select)
{
	// parent update
	if(obj.parent != null){
		var parent = obj.parent;
		var temp = obj.childTOparent(nodes);
		allUpdate(parent, temp, obj, select);
	}
	// my update
	if(nodes.length == undefined){
		for(var j = 1 ; j < obj.isSelected[nodes].length ; j ++){
			obj.isSelected[nodes][j](select);
			obj.refreshArr[j]();
		}
	}else{
		for(var i = 0 ; i < nodes.length ; i ++){			
			for(var j = 1 ; j < obj.isSelected[nodes[i]].length ; j ++){
				obj.isSelected[nodes[i]][j](select);
			}
		}
		for(var j = 1 ; j < obj.refreshArr.length ; j ++){
			obj.refreshArr[j]();
		}
	}
	// child update
	if(obj.child != null){
		for(var i = 0 ; i < obj.child.length ; i ++){
			if(obj.child[i] != child){	// prevent infinite loop.
				var temp = obj.parentTOchild[i](nodes);
				childUpdate(obj.child[i], temp, select);
			}
		}
	}
}
function childUpdate(obj, nodes, select)
{
	// my update
	if(nodes.length == undefined){
		for(var j = 1 ; j < obj.isSelected[nodes].length ; j ++){
			obj.isSelected[nodes][j](select);
			obj.refreshArr[j]();
		}
	}else{
		for(var i = 0 ; i < nodes.length ; i ++){
			for(var j = 1 ; j < obj.isSelected[nodes[i]].length ; j ++){
				obj.isSelected[nodes[i]][j](select);
			}
		}
		for(var j = 1 ; j < obj.refreshArr.length ; j ++){
			obj.refreshArr[j]();
		}
	}	
	//child update
	if(obj.child != null){
		for(var i = 0 ; i < obj.child.length ; i ++){
			if(obj.child[i] != child){	// prevent infinite loop.
				var temp = parent.parentTOchild[i](nodes);
				childUpdate(obj.child[i], temp, select);
			}
		}
	}
}
function makeRefresh(stage){
	return function()
		{
			stage.draw();
		}
}

function allSelect(obj)
{
	
	for(var i = 0 ; i < isSelected.length; i ++)
	{
		if(isSelected[i][0] == 0)
		{
			for(var j = 1 ; j < isSelected[i].length ; j++)
			{
				isSelected[i][j](1);
			}
			isSelected[i][0] = 1;
		}		
		if(isSelected[i][0] == 2)	//check the end of the isSelected.
			break;
	}
}
function allDeselect(isSelected)
{
	for(var i = 0 ; i < isSelected.length; i ++)
	{		
		if(isSelected[i][0] == 1)
		{
			for(var j = 1 ; j < isSelected[i].length ; j++)
			{
				isSelected[i][j](0);
			}
			isSelected[i][0] = 0;
		}	
		if(isSelected[i][0] == 2)	//check the end of the isSelected.
			break;
	}

}
function findMaxMinValue(Data)
{
	var maxValue = Data[0];
	var minValue = Data[0];
	for(var i = 1 ; i < Data.length ; i ++)
	{
		if(Data[i]>maxValue)
		{
			maxValue=Data[i];					
		}
		if(Data[i]<minValue)
		{
			minValue=Data[i];					
		}
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
