function allGraphUpdate(id , select, name) // update 되야하는 node id와 select 여부, 주체가 누군지를 받는다. 
{
	//가장 먼저 주체 여부를 확인한다. 
	if(name._type == "scatter")
	{
		for(var i =1 ; i < isSelected[id].length ; i ++)
		{
			isSelected[id][i](select);
		}
		isSelected[id][0] = select;
	}else if(name._type == "hist"){	//histogram인 경우 id값이 node의 번호이므로 hasArr를 구해야 한다. 
		var tmp = name.node[id].getHasArr();
	//	alert(tmp);
		for(var j = 0 ; j < tmp.length ; j ++)
		{
		//	alert(j);
			for(var i =1 ; i < isSelected[tmp[j]].length ; i ++)
			{
			//	alert(isSelected[tmp[j]][i]);
				
				if(j == tmp.length-1 && i == isSelected[tmp[j]].length-1)
				{
			//		alert(j + " ,1   " + i);
			//		alert(isSelected[tmp[j]][i]);
				}
				isSelected[tmp[j]][i](select);
				//alert(j + " ,2  " + i);
			}			
		//	alert(j);
			isSelected[tmp[j]][0] = select;
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
