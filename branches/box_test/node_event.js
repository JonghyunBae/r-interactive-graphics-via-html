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
			document.body.style.cursor = "default";  // �섏쨷��吏�썙���섎뒗吏��뺤씤��寃�
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
		var node = evt.shape;
		if(isNaN(node.getName()) == false)
		{
			var tmpX = Name.node[node.getName()].getX(); // �대┃ �뱁븳 �몃뱶��x, y 醫뚰몴瑜�諛쏆븘 �볥뒗�� 
			var tmpY = Name.height +Name.plotYMargin - Name.node[node.getName()].getY(); // Y醫뚰몴媛��ㅼ쭛�댁� �덉쑝誘�줈 �ㅼ떆 �쒖꽌��줈 �ㅼ쭛�붾떎. 
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
			allDeselect();
			Name.preId = {x : -1 , y : -1};
		}
		
		refresh();
		addRow('dataTable');
		
	});
	
}



