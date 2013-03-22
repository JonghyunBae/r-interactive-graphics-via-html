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
	menu(Name);
	drag(Name);
	
}

function menu(Name)
{	
	//////////////////////////////////////Menu Start//////////////////////////////////////
	var menuOn = false;
	var menuLayer = new Kinetic.Layer();
	var menu = new Kinetic.Group({
		opacity: 0.95,
		visible: false
	});
	var menuTextHide = new Kinetic.Text({
		text: '',
		fontFamily: 'Calibri',
		fontSize: 15,
		padding: 5,
		fill: 'white'
	});	  
	/*var menuTextDelete = new Kinetic.Text({
	y:50,
	text: '',
	fontFamily: 'Calibri',
	fontSize: 15,
	padding: 5,
	fill: 'white'
	});	  */
	var menuTextReset = new Kinetic.Text({
		y:25,
		text: '',
		fontFamily: 'Calibri',
		fontSize: 15,
		padding: 5,
		fill: 'white'
	});	  
	var menuRectHide = new Kinetic.Rect({
		width: 100,
		height: 25,
		fill: '#6b6164'
	});
	/*var menuRectDelete = new Kinetic.Rect({
	y:50,
	width: 100,
	height: 25,
	fill: '#6b6164'
	});*/
	var menuRectReset = new Kinetic.Rect({
		y:25,
		width: 100,
		height: 25,
		fill: '#6b6164'
	});
	
	menu.add(menuRectHide).add(menuTextHide);
	//menu.add(menuRectDelete).add(menuTextDelete);
	menu.add(menuRectReset).add(menuTextReset);
	menuLayer.add(menu);
	Name.stage.add(menuLayer);
	
	menuTextHide.setText(" Hide"); 
	//menuTextDelete.setText(" Delete"); 
	menuTextReset.setText(" Reset"); 
	
	menuTextHide.on('click', function(evt){
		hideSelected();
		menuOn=false;
		menu.hide();
		menuLayer.draw();	
	});
	menuRectHide.on('click', function(evt){
		hideSelected();	
		menuOn=false;
		menu.hide();
		menuLayer.draw();	
	});
	menuTextHide.on('mouseover', function(evt){
		menuRectHide.setFill('#d8c7a9');
		menuTextHide.setFill('#black');
		menuLayer.draw();
	});
	menuRectHide.on('mouseover', function(evt){
		menuRectHide.setFill('#d8c7a9');
		menuTextHide.setFill('#black');
		menuLayer.draw();
	});
	menuTextHide.on('mouseout', function(evt){
		menuRectHide.setFill('#6b6164');
		menuTextHide.setFill('white');
		menuLayer.draw();
	});
	menuRectHide.on('mouseout', function(evt){
		menuRectHide.setFill('#6b6164');
		menuTextHide.setFill('white');
		menuLayer.draw();
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
	menuRectDelete.setFill('#d8c7a9');
	menuTextDelete.setFill('#black');
	menuLayer.draw();
	});
	menuRectDelete.on('mouseover', function(evt){
	menuRectDelete.setFill('#d8c7a9');
	menuTextDelete.setFill('#black');
	menuLayer.draw();
	});
	menuTextDelete.on('mouseout', function(evt){
	menuRectDelete.setFill('#6b6164');
	menuTextDelete.setFill('white');
	menuLayer.draw();
	});
	menuRectDelete.on('mouseout', function(evt){
	menuRectDelete.setFill('#6b6164');
	menuTextDelete.setFill('white');
	menuLayer.draw();
	});
	*/
	
	menuTextReset.on('click', function(evt){
		resetSelected();
		menuOn=false;
		menu.hide();
		menuLayer.draw();	
	});
	menuRectReset.on('click', function(evt){
		resetSelected();
		menuOn=false;
		menu.hide();
		menuLayer.draw();	
	});
	menuTextReset.on('mouseover', function(evt){
		menuRectReset.setFill('#d8c7a9');
		menuTextReset.setFill('#black');
		menuLayer.draw();
	});
	menuRectReset.on('mouseover', function(evt){
		menuRectReset.setFill('#d8c7a9');
		menuTextReset.setFill('#black');
		menuLayer.draw();
	});
	menuTextReset.on('mouseout', function(evt){
		menuRectReset.setFill('#6b6164');
		menuTextReset.setFill('white');
		menuLayer.draw();
	});
	menuRectReset.on('mouseout', function(evt){
		menuRectReset.setFill('#6b6164');
		menuTextReset.setFill('white');
		menuLayer.draw();
	});
	
	
	
	Name.plotLayer.on('click', function(evt){ // mouse drag�섍퀬�섏꽌 �곗냽�대┃�섏뼱 留앹튂��寃�諛⑹�.
		if((evt.which && evt.which == 3) || (evt.button && evt.button == 2)){ //right click
			if(menuOn==false){
				menuOn=true;
				//alert('right clicked');
				var node = evt.shape;
				//update menu
				var menuHeight = 40;
				var menuWidth = 100;
				var mousePos = node.getStage().getMousePosition();
				if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){//set menu box position
					menu.setPosition(mousePos.x + 8, mousePos.y + 2);
				}else if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y > Name.plotYMargin + Name.height/2){
					menu.setPosition(mousePos.x + 2, mousePos.y - 2 - menuHeight);
				}else if(mousePos.x > Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){
					menu.setPosition(mousePos.x - 2 - menuWidth, mousePos.y + 2);
				}else{
					menu.setPosition(mousePos.x - 2 - menuWidth , mousePos.y - 2 - menuHeight);
				}				
				menu.show();
				menuLayer.draw();
			}else{//menuOn==true
				menuOn=false;
				menu.hide();
				menuLayer.draw();			
			}
		}else if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
			if(menuOn==true){
				menuOn=false;
				menu.hide();
				menuLayer.draw();
			}		
		}	
	});
	
	//////////////////////////////////////Menu End//////////////////////////////////////
}
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
	var downOn = false;
	var div_num;

	Name.plotLayer.on('mousedown touchstart', function(evt){
		if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click

			downOn = true; 
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
	window.addEventListener ("mousemove", function (evt){
		if(div_num == divNumber)
		{
			if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
				
				if(moving == true)
				{

					var mousePos = {x: (evt.pageX-divOffsetX), y: (evt.pageY-divOffsetY)};
					var x, y;
					x = mousePos.x;// + plotXmargin;
					y = mousePos.y; //+ plotYmargin + plotHeight;
					rangeBox.setWidth(x- rangeBox.getX());
					rangeBox.setHeight(y- rangeBox.getY());
					rangeBoxLayer.drawScene();
				}
			}
		}
		
	}, true);
	
	window.addEventListener ("mouseup", function (evt){
		if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
			if(moving == true)
			{
				aftDragMousePos={x: (evt.pageX-divOffsetX), y: (evt.pageY-divOffsetY)};	
				rangeBox.setWidth(0);
				rangeBox.setHeight(0);
				rangeBoxLayer.drawScene();
				moving = false;
				//alert(aftDragMousePos.x);
		//		scatterRectRange(aftDragMousePos);
			}
		}
	}, true);
}

function hover(Name)
{
	Name.stage.on('mouseover mousemove', function(evt){  
		var node = evt.shape;
	//	alert(node.getName());
		if(isNaN(node.getName()) == false)
		{
			document.body.style.cursor = "pointer";
	        
	        node.moveToTop();
	        var mousePos = node.getStage().getMousePosition();
	    	Name.tooltipText.setText(node.getInfo()); 
	    	Name.tooltipRect.setAttrs({
	    		width: Name.tooltipText.getWidth(),
	    		height: Name.tooltipText.getHeight()
	    	});
	    	if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){//set tooltip box position
				Name.tooltip.setPosition(mousePos.x + 8, mousePos.y + 2);
			}else if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y > Name.plotYMargin + Name.height/2){
				Name.tooltip.setPosition(mousePos.x + 2, mousePos.y - 2 - Name.tooltipText.getHeight());
			}else if(mousePos.x > Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){
				Name.tooltip.setPosition(mousePos.x - 2 - Name.tooltipText.getWidth(), mousePos.y + 2);
			}else{
				Name.tooltip.setPosition(mousePos.x - 2 - Name.tooltipText.getWidth() , mousePos.y - 2 - Name.tooltipText.getHeight());
			}
	    	Name.tooltipLayer.moveUp();
	    	Name.tooltip.show();
	    	Name.tooltipLayer.draw();
	    	if(node.getSelected() == 0)
	    	{
		    	var shapes = Name.stage.get('.'+node.getName());
		    	switch(Name._type)
		    	{
			    	case 'hist' : 
						shapes.apply('setAttrs', {
			    		opacity: 1,
			    		scale : {x:1.2, y:1}
						});    	
						break;
					case 'scatter' : 
		    			shapes.apply('setAttrs', {
		            		opacity: 1,
		            		scale : {x:1.5, y:1.5}
		        			});    	
		    			break;
					case 'box' : 
					//	alert(shapes.getInfo());
					//	if(shapes.getRadius() != undefined){
							shapes.apply('setAttrs', {
			            		opacity: 1,
			            		scale : {x:1.2, y:1}
			        			});    	
					//	}
						break;
		        	default:
		        		break;
		    	}
		    	shapes.apply('transitionTo', {    		
		    	    rotation : 0,
		    	    duration: 0.01
		    	});  
	    	}
		}
	});	
		
        	
	Name.stage.on('mouseout', function(evt){  
		var node = evt.shape;
		if(isNaN(node.getName()) == false)
		{
			document.body.style.cursor = "default";  // 占쎌꼷夷뤄옙占쏙쭪占쎌뜖占쏙옙占쎌꼶�쀯쭪占쏙옙類ㅼ뵥占쏙옙野껓옙
			Name.tooltip.hide();
	    	Name.tooltipLayer.draw();
	    	
	    	if(node.getSelected() == 0)
	    	{
	    		var shapes = Name.stage.get('.'+node.getName());
		    	switch(Name._type)
		    	{
			    	case 'hist' : 
						shapes.apply('setAttrs', {
			    		opacity: 0.5,
			    		scale : {x:1, y:1}
						});    	
						break;
					case 'scatter' : 
		    			shapes.apply('setAttrs', {
		            		opacity: 0.7,
		            		scale : {x:1, y:1}
		        			});    	
		    			break;
					case 'box' : 
		    			shapes.apply('setAttrs', {
		            		opacity: 0.7,
		            		scale : {x:1, y:1}
		        			});    	
		    			break;
		        	default:
		        		break;
		    	}
		    	shapes.apply('transitionTo', {    		
		    	    rotation : 0,
		    	    duration: 0.01
		    	});  
	    	}
		}
	});
}




function select(Name)
{
	
	Name.stage.on('click', function(evt){
		if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
			var node = evt.shape;

			if(isNaN(node.getName()) == false)
			{
				var tmpX = Name.node[node.getName()].getX(); // 占쎈���占쎈콅釉�占쎈챶諭띰옙占퐔, y �ル슦紐당몴占썼쳸�녿툡 占쎈낄�쀯옙占�
				var tmpY = Name.height +Name.plotYMargin - Name.node[node.getName()].getY(); // Y�ル슦紐닷첎占쏙옙�쇱춿占쎈똻占�占쎈뜆�앲첋占쎌쨮 占썬끉��占쎌뮇苑뚳옙占쎌쨮 占썬끉彛쏉옙遺얜뼄. 
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



