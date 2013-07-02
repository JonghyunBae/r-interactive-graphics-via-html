//////////////////////////////////////Chk key event Start//////////////////////////////////////   

window.addEventListener('keydown',checkKeyDown,false);	
window.addEventListener('keyup',checkKeyUp,false);	
var ctrlPressed = false;
var shiftPressed = false;
var aPressed = false;
var zPressed = false;
var gPressed = false;
var tmpShift = false;

function checkKeyDown(e) 
{		
//	alert(e.keyCode);
	if(e.keyCode == 17 || e.keyCode == 25)//ctrl key pressed
	{
		ctrlPressed = true;
	}
	if(e.keyCode == 16)//shift key pressed
	{
		shiftPressed = true;
	}
	if(e.keyCode == 65)//a key pressed
	{
		aPressed = true;
	}
	if(e.keyCode == 71)//g key pressed
	{
		gPressed = true;
	}
	if(e.keyCode == 90)//z key pressed
	{
		zPressed = true;
	}
	if(ctrlPressed == true && e.keyCode == 46)//del key pressed
	{
		hideSelected();
	}
	if(ctrlPressed == true && e.keyCode == 45)//insert key pressed
	{
		resetSelected();
	}
	if(ctrlPressed == true &&  e.keyCode == 36)//ctrl key and home key pressed at the same time
	{
		if(tPressed == true){
			tPressed = false;
			document.getElementById('dataTable').style.display = 'none';
			document.getElementById('tableScrollableContainer').style.display = 'none';			
		}else{
			tPressed = true;
			document.getElementById('dataTable').style.display = 'block';
			document.getElementById('tableScrollableContainer').style.display = 'block';		
		}			
	}
	if(ctrlPressed == true && zPressed == true)//ctrl key and z key pressed at the same time
	{
	}
}	
function checkKeyUp(e) 
{
	if(ctrlPressed == true && zPressed != true)
	{
		ctrlPressed = false;
	}
	if(shiftPressed == true)
	{
		shiftPressed = false;
	}
	if(aPressed == true)
	{
		aPressed = false;
	}
	if(gPressed == true)
	{
		gPressed = false;
	}
	if(zPressed == true)
	{
		zPressed = false;
	}
}	
//////////////////////////////////////Chk key event End//////////////////////////////////////
function eventTrigger(Name)
{
	hover(Name);
	select(Name);
//	menu(Name);
//	drag(Name);
	
}
var menuOn = false;
function menu(Name)
{	
//////////////////////////////////////Menu Start//////////////////////////////////////
	Name.menuLayer = new Kinetic.Layer();
	Name.menu = new Kinetic.Group({
		opacity: 0.95,
		visible: false
	});
	Name.menuTextHide = new Kinetic.Text({
		text: '',
		fontFamily: 'Calibri',
		fontSize: 15,
		padding: 5,
		fill: 'white'
	});	  
	Name.menuTextReset = new Kinetic.Text({
		y:25,
		text: '',
		fontFamily: 'Calibri',
		fontSize: 15,
		padding: 5,
		fill: 'white'
	});	  
	Name.menuRectHide = new Kinetic.Rect({
		width: 100,
		height: 25,
		fill: '#93b21a'
	});
	Name.menuRectReset = new Kinetic.Rect({
		y:25,
		width: 100,
		height: 25,
		fill: '#93b21a'
	});
	
	Name.menu.add(Name.menuRectHide).add(Name.menuTextHide);
	Name.menu.add(Name.menuRectReset).add(Name.menuTextReset);
	Name.menuLayer.add(Name.menu);
	Name.stage.add(Name.menuLayer);
	
	Name.menuTextHide.setText(" Hide"); 
	//menuTextDelete.setText(" Delete"); 
	Name.menuTextReset.setText(" Reset"); 
	
	Name.menuTextHide.on('click', function(evt){
		hideSelected();
		Name.menu.hide();
		Name.menuLayer.draw();	
	});
	Name.menuRectHide.on('click', function(evt){
		hideSelected();	
		Name.menu.hide();
		Name.menuLayer.draw();	
	});
	Name.menuTextHide.on('mouseover', function(evt){
		Name.menuRectHide.setFill('#cfe444');
		Name.menuTextHide.setFill('#black');
		Name.menuLayer.draw();
	});
	Name.menuRectHide.on('mouseover', function(evt){
		Name.menuRectHide.setFill('#cfe444');
		Name.menuTextHide.setFill('#black');
		Name.menuLayer.draw();
	});
	Name.menuTextHide.on('mouseout', function(evt){
		Name.menuRectHide.setFill('#93b21a');
		Name.menuTextHide.setFill('white');
		Name.menuLayer.draw();
	});
	Name.menuRectHide.on('mouseout', function(evt){
		Name.menuRectHide.setFill('#93b21a');
		Name.menuTextHide.setFill('white');
		Name.menuLayer.draw();
	});
	/*
	menuTextDelete.on('click', function(evt){
	deleteSelected();
	menuOn=false;
	menu.hide();
	menuLayer.draw();	
	});
	menuRectDelete.on('click', function(evt){
	deleteSelected();
	menuOn=false;
	menu.hide();
	menuLayer.draw();	
	});
	menuTextDelete.on('mouseover', function(evt){
	menuRectDelete.setFill('#cfe444');
	menuTextDelete.setFill('#black');
	menuLayer.draw();
	});
	menuRectDelete.on('mouseover', function(evt){
	menuRectDelete.setFill('#cfe444');
	menuTextDelete.setFill('#black');
	menuLayer.draw();
	});
	menuTextDelete.on('mouseout', function(evt){
	menuRectDelete.setFill('#93b21a');
	menuTextDelete.setFill('white');
	menuLayer.draw();
	});
	menuRectDelete.on('mouseout', function(evt){
	menuRectDelete.setFill('#93b21a');
	menuTextDelete.setFill('white');
	menuLayer.draw();
	});
	*/
	
	Name.menuTextReset.on('click', function(evt){
		resetSelected();
		Name.menu.hide();
		Name.menuLayer.draw();	
	});
	Name.menuRectReset.on('click', function(evt){
		resetSelected();
		Name.menu.hide();
		Name.menuLayer.draw();	
	});
	Name.menuTextReset.on('mouseover', function(evt){
		Name.menuRectReset.setFill('#cfe444');
		Name.menuTextReset.setFill('#black');
		Name.menuLayer.draw();
	});
	Name.menuRectReset.on('mouseover', function(evt){
		Name.menuRectReset.setFill('#cfe444');
		Name.menuTextReset.setFill('#black');
		Name.menuLayer.draw();
	});
	Name.menuTextReset.on('mouseout', function(evt){
		Name.menuRectReset.setFill('#93b21a');
		Name.menuTextReset.setFill('white');
		Name.menuLayer.draw();
	});
	Name.menuRectReset.on('mouseout', function(evt){
		Name.menuRectReset.setFill('#93b21a');
		Name.menuTextReset.setFill('white');
		Name.menuLayer.draw();
	});
	
	
	
	
	Name.stage.on('click', function(evt){ // mouse drag
		for(var i = 0 ; i < objArr.length ; i ++)
		{
			objArr[i].menu.hide();
			objArr[i].menuLayer.draw();
		}
		if((evt.which && evt.which == 3) || (evt.button && evt.button == 2)){ //right click			

				
				menuOn=true;
				//alert('right clicked');
				var node = evt.targetNode;
				//update menu
				var menuHeight = 40;
				var menuWidth = 100;
				var mousePos = node.getStage().getMousePosition();
				if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){//set menu box position
					Name.menu.setPosition(mousePos.x + 8, mousePos.y + 2);
				}else if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y > Name.plotYMargin + Name.height/2){
					Name.menu.setPosition(mousePos.x + 2, mousePos.y - 2 - menuHeight);
				}else if(mousePos.x > Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){
					Name.menu.setPosition(mousePos.x - 2 - menuWidth, mousePos.y + 2);
				}else{
					Name.menu.setPosition(mousePos.x - 2 - menuWidth , mousePos.y - 2 - menuHeight);
				}				
				Name.menu.show();
				Name.menuLayer.draw();

		}else if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
			if(menuOn==true){
				Name.menu.hide();
				Name.menuLayer.draw();
			}		
		}	
	});
	
	//////////////////////////////////////Menu End//////////////////////////////////////
}

var dragOn = false;
function drag(Name)
{
	var preDragMousePos;
	var aftDragMousePos;
	
	var rangeBox = new Kinetic.Rect({
		x: 0,
		y: 0, 
		width : 0,
		height : 0,
		fill: "blue",
		stroke: "blue",						
		opacity : 0.3
	});
	var rangeBoxLayer = new Kinetic.Layer();
	Name.stage.add(rangeBoxLayer);
	rangeBoxLayer.add(rangeBox);
	
	var moving = false;
	var divid;
	Name.plotLayer.on('mousedown touchstart', function(evt){
		if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
			divid = mouseName;
			preDragMousePos={x: (evt.pageX-divOffsetX), y: (evt.pageY-divOffsetY)};
			if(moving == true){
				moving = false;
				rangeBoxLayer.draw();
			}else{
				var mousePos = Name.stage.getMousePosition();		
				rangeBox.setX(mousePos.x);
				rangeBox.setY(mousePos.y);
				rangeBox.setWidth(0);
				rangeBox.setHeight(0);
				moving = true;
				rangeBoxLayer.drawScene();
			}
		}
	}); 
	Name.dataLayer.on('mousedown touchstart', function(evt){
		if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
			divid = mouseName;
			preDragMousePos={x: (evt.pageX-divOffsetX), y: (evt.pageY-divOffsetY)};
			if(moving == true){
				moving = false;
				rangeBoxLayer.draw();
			}else{
				var mousePos = Name.stage.getMousePosition();		
				rangeBox.setX(mousePos.x);
				rangeBox.setY(mousePos.y);
				rangeBox.setWidth(0);
				rangeBox.setHeight(0);
				moving = true;
				rangeBoxLayer.drawScene();
			}
		}
	}); 
	var tmpx, tmpy, tmpName;
	window.addEventListener ("mousemove", function (evt){
			if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
				
				if(moving == true)
				{
					dragOn = true;
					if(divid == mouseName)
					{
						var mousePos = {x: (evt.pageX-divOffsetX), y: (evt.pageY-divOffsetY)};
						tmpx = divOffsetX;
						tmpy = divOffsetY;
						tmpName = Name;
					}else{
						var mousePos = {x: (evt.pageX-tmpx), y: (evt.pageY-tmpy)};
					}
					var x, y;
					x = mousePos.x;// + plotXmargin;
					y = mousePos.y; //+ plotYmargin + plotHeight;
					rangeBox.setWidth(x- rangeBox.getX());
					rangeBox.setHeight(y- rangeBox.getY());
					rangeBoxLayer.drawScene();
				}
			}
		
	}, true);
	
	window.addEventListener ("mouseup", function (evt){
		if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
			if(moving == true)
			{
				aftDragMousePos = {x: (evt.pageX-tmpx), y: (evt.pageY-tmpy)};
				rangeBox.setWidth(0);
				rangeBox.setHeight(0);
				rangeBoxLayer.drawScene();
				moving = false;
			//	alert(tmpName);
				RectRangeSelect(tmpName, preDragMousePos, aftDragMousePos);
				
			}
		}
	}, true);
}
function RectRangeSelect(Name, pre, aft)
{
	
	var smallX, bigX;
	var smallY, bigY;
	if(pre.x >= aft.x){
		smallX = aft.x;
		bigX = pre.x;
	}else if(pre.x < aft.x){
		smallX = pre.x;
		bigX = aft.x;
	}
	if(pre.y >= aft.y){
		smallY = aft.y;
		bigY = pre.y;
	}else if(pre.y < aft.y){
		smallY = pre.y;
		bigY = aft.y;
	}
	
	if(ctrlPressed == false)
	{
		allDeselect();
	}	
	//alert(Name._type);
	
	if(Name._type == "scatter"){
		if(ctrlPressed == true)	{
			for(var i = 0 ; i < Name.node.length ; i ++)
			{
				if(smallX <= Name.node[i].getX() && Name.node[i].getX() <= bigX && smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY)
				{
				//		alert((Name.node[i].getSelected()+1)%2);
						allGraphUpdate(i ,(Name.node[i].getSelected()+1)%2, Name);			
				}
			}
		}else{
			for(var i = 0 ; i < Name.node.length ; i ++)
			{
				if(smallX <= Name.node[i].getX() && Name.node[i].getX() <= bigX && smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY)
				{
						allGraphUpdate(i ,1, Name);			
				}
			}
		}
			
	}else if(Name._type == "hist"){
		if(ctrlPressed == true)	{
			for(var i = 0 ; i < Name.node.length ; i ++)
			{
				if((smallX <= Name.node[i].getX()+Name.node[i].getWidth()/2 && Name.node[i].getX()-Name.node[i].getWidth()/2 <= bigX) && (smallY <= Name.node[i].getY()+Name.node[i].getHeight()/2 && Name.node[i].getY()-Name.node[i].getHeight()/2 <= bigY))
				{
						allGraphUpdate(i ,(Name.node[i].getSelected()+1)%2, Name);			
				}
			}
		}else{
			for(var i = 0 ; i < Name.node.length ; i ++)
			{
				if((smallX <= Name.node[i].getX()+Name.node[i].getWidth()/2 && Name.node[i].getX()-Name.node[i].getWidth()/2 <= bigX) && (smallY <= Name.node[i].getY()+Name.node[i].getHeight()/2 && Name.node[i].getY()-Name.node[i].getHeight()/2 <= bigY))
				{
						allGraphUpdate(i ,1, Name);			
				}
			}
		}
	}
	refresh();
	addRow('dataTable');
	
}

function hover(Name)
{
	Name.stage.on('mouseover mousemove dragmove', function(evt) {
        var node = evt.targetNode;        
        // update tooltip
        if(isNaN(node.getName()) == false)
		{
        	node.moveToTop();
        	document.body.style.cursor = "pointer";	        
	        var mousePos = node.getStage().getMousePosition();
	        Name.tooltip.setPosition(mousePos.x, mousePos.y - 5);
	        Name.tooltip.getText().setText(node.getInfo());
	        Name.tooltip.show();
	        Name.tooltipLayer.draw();	        
	        if(node.getSelected() == 0)
	    	{
		    	//var shapes = Name.stage.get('.'+node.getName());
		    	 
		    	switch(Name._type)
		    	{
			    	case 'hist' : 
						var tween = new Kinetic.Tween({
			    	        node: node, 
			    	        duration: 0.01,
			    	        opacity: 1,
			    	        scaleX: 1.2,
			    	        scaleY: 1
			    	      }).play();
		    			break;
					case 'scatter' : 
						var tween = new Kinetic.Tween({
			    	        node: node, 
			    	        duration: 0.01,
			    	        opacity: 1,
			    	        scaleX: 1.5,
			    	        scaleY: 1.5
			    	      }).play();

		    			break;
					case 'box' : 
						break;
		        	default:
		        		break;
		    	}
	    	}
		}
      }); 
	Name.stage.on('mouseout', function(evt) {
		var node = evt.targetNode;
    	  document.body.style.cursor = "default";
    	  Name.tooltip.hide();
    	  Name.tooltipLayer.draw();
    	  if(isNaN(node.getName()) == false)
  		{
            if(node.getSelected() == 0)
  	    	{
  		    //	var shapes = Name.stage.get('.'+node.getName());
  		    	 
  		    	switch(Name._type)
  		    	{
  			    	case 'hist' : 
  						var tween = new Kinetic.Tween({
  			    	        node: node, 
  			    	        duration: 0.01,
  			    	        opacity: 1,
  			    	        scaleX: 1,
  			    	        scaleY: 1
  			    	      }).play();
  		    			break;
  					case 'scatter' : 
  						var tween = new Kinetic.Tween({
  			    	        node: node, 
  			    	        duration: 0.01,
  			    	        opacity: 0.7,
  			    	        scaleX: 1,
  			    	        scaleY: 1
  			    	      }).play();
  		    			break;
  					case 'box' : 
  						break;
  		        	default:
  		        		break;
  		    	}
  	    	}
  		}
    	  
      });
	
}




function select(Name)
{
	
	Name.stage.on('click', function(evt){
		
		if(dragOn == true)
		{			
			dragOn = false;
			return;
		}
		if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
			var node = evt.targetNode;
			if(isNaN(node.getName()) == false)
			{
				var tmpX = Name.node[node.getName()].getX(); // �좎럥占쏙옙占썲뜝�덉퐛�됵옙�좎럥梨띈キ�곗삕�좏릶, y 占썬꺂��쭗�밸ご�좎띁爾몌옙�욱닡 �좎럥�꾬옙��삕�좑옙
				var tmpY = Name.height +Name.plotYMargin - Name.node[node.getName()].getY(); // Y占썬꺂��쭗�룹쾸�좎룞�숋옙�깆뗄�좎럥�삣뜝占썲뜝�덈쐠占쎌빍泥뗥뜝�뚯Ŧ �좎뜫�됵옙占썲뜝�뚮츋�묐슪�쇿뜝�뚯Ŧ �좎뜫�됧퐲�됱삕�븐뼔堉� 
			//	alert(tmpX + " , " + tmpY);
				if(aPressed){	//select ALL
					Name.tmpShift = false;
					allSelect();
			  	}else if(gPressed){
			  		Name.tmpShift = false;
			  	}else if(shiftPressed && Name.preId.x != -1){			 
			  		
			  		Name.tmpShift = true;
			  		allDeselect();
			  		if(Name._type == "scatter")
			  		{
			  			if(Name.preId.x >= tmpX){
			  				//alert(Name.preId.y + ", " + tmpY);
			  				if(Name.preId.y >= tmpY){
			  					for(var i = 0 ; i < Name.node.length ; i ++)
					  			{
					  				if(tmpX <= Name.node[i].getX() && Name.node[i].getX() <=Name.preId.x && (Name.preId.y >= (Name.height +Name.plotYMargin - Name.node[i].getY())&& (Name.height +Name.plotYMargin - Name.node[i].getY()) >=  tmpY))
					  				{				  					
					  					allGraphUpdate(i ,1, Name);
					  				}
					  			}
			  				}else if(Name.preId.y <= tmpY){
			  					for(var i = 0 ; i < Name.node.length ; i ++)
					  			{
					  				if(tmpX <= Name.node[i].getX() && Name.node[i].getX() <= Name.preId.x && (Name.preId.y <= (Name.height +Name.plotYMargin - Name.node[i].getY())&& (Name.height +Name.plotYMargin - Name.node[i].getY()) <=  tmpY))
					  				{				  					
					  					allGraphUpdate(i ,1, Name);
					  				}
					  			}
			  				}
			  			}else if(Name.preId.x <= tmpX){
			  			
			  				if(Name.preId.y >= tmpY){
			  					for(var i = 0 ; i < Name.node.length ; i ++)
					  			{
					  				if(Name.preId.x <= Name.node[i].getX() && Name.node[i].getX() <= tmpX  && (Name.preId.y >= (Name.height +Name.plotYMargin - Name.node[i].getY())&& (Name.height +Name.plotYMargin - Name.node[i].getY()) >=  tmpY))
					  				{				  					
					  					allGraphUpdate(i ,1, Name);
					  				}
					  			}
			  				}else if(Name.preId.y <= tmpY){
			  					for(var i = 0 ; i < Name.node.length ; i ++)
					  			{
					  				if((Name.preId.x <= Name.node[i].getX() && Name.node[i].getX() <= tmpX) && (Name.preId.y <= (Name.height +Name.plotYMargin - Name.node[i].getY())&& (Name.height +Name.plotYMargin - Name.node[i].getY()) <=  tmpY))
					  				{				
					  					allGraphUpdate(i ,1, Name);
					  				}
					  			}
			  				}
			  			}
			  			
			  		}else if(Name._type == "hist"){
			  			//alert(Name.preId.x + " , " + tmpX);
			  			if(Name.preId.x >= tmpX){
			  				for(var i = 0 ; i < Name.node.length ; i ++)
				  			{
				  				if(tmpX <= Name.node[i].getX() && Name.node[i].getX() <= Name.preId.x)
				  				{
				  					allGraphUpdate(i ,1, Name);
				  				}
				  			}
			  			}else if(Name.preId.x <= tmpX){
			  				for(var i = 0 ; i < Name.node.length ; i ++)
				  			{
				  				if(tmpX >= Name.node[i].getX() && Name.node[i].getX() >= Name.preId.x)
				  				{
				  					allGraphUpdate(i ,1, Name);
				  				}
				  			}
			  			}
			  			
			  		}
				}else if(ctrlPressed){ //select mutiple node one by one.
					if(node.getSelected() == 0)
					{
						allGraphUpdate(node.getName(), 1 , Name);
					}else if(node.getSelected() == 1){
						allGraphUpdate(node.getName(), 0 , Name);
					}
					Name.tmpShift = false;
			  	}else{ 	// just one click
			  		Name.tmpShift = false;
					allDeselect();
					allGraphUpdate(node.getName(), 1 , Name);
			  	}  	
			  	if(Name.tmpShift == false)
				{
			  		Name.preId = {x : tmpX , y : tmpY};
				}
			}else{
				if(!(ctrlPressed || shiftPressed || aPressed || gPressed))
				{
					allDeselect();
					Name.preId = {x : -1 , y : -1};
				}				
			}
			
			refresh();
			addRow('dataTable');
		}
	});
	
}



