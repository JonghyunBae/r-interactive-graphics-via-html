var plotWidth=500;  //default value for plot width
var plotHeight=500; //default value for plot height   

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
		

	document.getElementById('coords').innerHTML = 'X= '+ (divX)+ ' ,Y= ' +(divY);
}
//Get X, Y coords, and displays Mouse coordinates
function getXYpos(elm) {
	X = elm.offsetLeft;        // set x to elm’s offsetLeft
	Y = elm.offsetTop;         // set y to elm’s offsetTop
	
	elm = elm.offsetParent;    // set elm to its offsetParent
	
	 //use while loop to check if elm is null
	 // if not then add current elm’s offsetLeft to x
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

function resetSelected()
{
	for(var i = 0 ; i < isSelected.length ; i ++)
	{
		if(isSelected[i][0] == 2)
		{
			for(var j = 1 ; j < isSelected[i].length ; j++)
			{
				isSelected[i][j](3);
			}
			isSelected[i][0] = 0;
		}		
	}
	addRow('dataTable');
	refresh();
}
function hideSelected()
{
	for(var i = 0 ; i < isSelected.length ; i ++)
	{
		if(isSelected[i][0] == 1)
		{
			for(var j = 1 ; j < isSelected[i].length ; j++)
			{
				isSelected[i][j](2);
			}
			isSelected[i][0] = 2;
		}		
	}
	addRow('dataTable');
	refresh();
}
//allGraphUpdate is used for only select & unselect
function allGraphUpdate(id , select, name) // update 되야하는 node id와 select 여부, 주체가 누군지를 받는다. 
{
	//가장 먼저 주체 여부를 확인한다. 
	if(name._type == "scatter")
	{
		if(isSelected[id][0] != 2)
		{
			for(var i =1 ; i < isSelected[id].length ; i ++)
			{
				isSelected[id][i](select);
			}
			isSelected[id][0] = select;
		}		
	}else if(name._type == "hist"){	//histogram인 경우 id값이 node의 번호이므로 hasArr를 구해야 한다. 
		var tmp = name.node[id].getHasArr();
	//	alert(tmp);
		for(var j = 0 ; j < tmp.length ; j ++)
		{
		//	alert(j);
			if(isSelected[tmp[j]][0] != 2)
			{
				for(var i =1 ; i < isSelected[tmp[j]].length ; i ++)
				{
					isSelected[tmp[j]][i](select);
				}			
				isSelected[tmp[j]][0] = select;
			}			
		}		
	}
	
}

function refresh()
{
//	alert("ddd");
//	alert(objArr.length);
	for(var i = 0 ; i < objArr.length ; i ++)
	{
		var shapes = objArr[i].stage.get('.' + 0);
		shapes.apply('transitionTo', {    		
    	    rotation : 0,
    	    duration: 0.01
    	});
		objArr[i].stage.draw();
	}
}

function allSelect()
{
	for(var i = 0 ; i < isSelected.length ; i ++)
	{
	//	document.write("isselectlength11  " + isSelected.length + "<br>");
		if(isSelected[i][0] == 0)
		{
			for(var j = 1 ; j < isSelected[i].length ; j++)
			{
	//			document.write("isselectlength22  " + isSelected[i].length + "<br>");
				isSelected[i][j](1);
			//	document.write(i + " , " + j + "<br>");
			}
			isSelected[i][0] = 1;
		}		
	}
	//alert("ddd");

}
function allDeselect()
{
	for(var i = 0 ; i < isSelected.length ; i ++)
	{
		if(isSelected[i][0] == 1)
		{
			for(var j = 1 ; j < isSelected[i].length ; j++)
			{
				isSelected[i][j](0);
			}
			isSelected[i][0] = 0;
		}		
	}

}
function findMaxValue(Data)
{
	var maxValue=Data[0];
	for(var i=1; i<Data.length; i++)
	{
		if(Data[i]>maxValue)
		{
			maxValue=Data[i];					
		}
	}
	return maxValue;
}
function findMinValue(Data)
{
	var minValue=Data[0];
	for(var i=1; i<Data.length; i++)
	{
		if(Data[i]<minValue)
		{
			minValue=Data[i];					
		}
	}
	return minValue;
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
