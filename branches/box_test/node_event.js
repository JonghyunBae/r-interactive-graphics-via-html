//////////////////////////////////////Chk key event Start//////////////////////////////////////   

window.addEventListener('keydown',this.checkKeyDown,false);	
window.addEventListener('keyup',this.checkKeyUp,false);	
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
		fetchWork();
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
			document.body.style.cursor = "default";  // 나중에 지워도 되는지 확인할 것 
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
var tmpShift = false;



function select(Name)
{
	
	Name.stage.on('click', function(evt){
		var node = evt.shape;
	//	var shapes = Name.stage.get('#'+node.getId());
		var tmpNode;
		if(aPressed){	//select ALL
//	  		allSelect();
	  		tmpShift = false;
	  	}else if(shiftPressed && preId != -1){
	  		tmpShift = true;
	  /*		allDeselect();
			if(preId > node.getId()){
				for(var i = node.getId() - histIdStart ; i < preId + 1 - histIdStart ; i++)
				{
		//			tmpNode = histStage.get("#"+ (i + histIdStart));
		//			allUpdate("hist", tmpNode, i, 0);
				}
			}else if(preId < node.getId()){
		/*		for(var i = preId - histIdStart  ; i < node.getId() + 1 - histIdStart ; i++)
				{
		//			tmpNode = histStage.get("#"+ (i + histIdStart));
		//			allUpdate("hist", tmpNode, i, 0);
				}
			} */
		}else if(ctrlPressed){ //select mutiple node one by one.
/*	  		if(histData[node.getId() - histIdStart].selected > 0){ // pre pressed state -> deselect rect & scatter
	  			allUpdate("hist", shapes, node.getId() - histIdStart, 1);
	  		}else if(histData[node.getId() - histIdStart].selected == 0){ // unselected -> selected
	  			allUpdate("hist", shapes, node.getId() - histIdStart, 0);
	  		}*/
	  		tmpShift = false;
	  	}else{ 	// just one click
			tmpShift = false;
			allGraphUpdate(node.getName(), 1 , Name);
	//		allDeselect();
	//		allUpdate("hist", shapes, node.getId() - histIdStart, 0);
	  	}  	
	  	if(tmpShift == false)
		{
	//		preId = node.getId();
		}
	  	//saveWork();
	  	//doRefresh();
	 //	writeMsg(msgLayer);
	 //	addRow('dataTable');
	});
}

function allUpdate(hostName, node, id, eraseOn)
{
	//// eraseOn : 0 is add node , 1 is delete node //
	//// id is each relative id ///
	if(hostName == "scatter")
	{
		if(eraseOn == 0) // add node
		{
			if(scatterData[id].selected == 0)
			{
				scatterSingleSelect(node, id);
				histUpdate(histXMain[id],eraseOn);
			}
			
		}
		else{
			if(scatterData[id].selected == 1)
			{
				scatterSingleDeselect(node, id);
				histUpdate(histXMain[id],eraseOn);
			}
		}
	//	alert(eraseOn);
  		
	}else if(hostName == "hist"){
		if(eraseOn == 0) // add node
		{
			histSingleSelect(node, id);
		}
		else{
			histSingleDeselect(node, id);
		}
		scatterUpdate(id,eraseOn);
	}
}

function singleSelect(node, id)
{
	node.apply('setAttrs', {
		opacity: 1,
		scale: { x : 1.05, y : 1 }
	});
	if(id != -1)
	{
		histData[id].selected=histArr[id];
	}	
}

function singleDeselect(node, id)
{
	node.apply('setAttrs', {
		opacity: 0.5,
		scale: { x : 1, y : 1 }
	});
	histData[id].selected = 0;
}

function allSelect()
{
	var node;
	for(var i = 0; i <histArr.length ; i ++)
	{
		node = histStage.get("#"+ (i + histIdStart));
		histSingleSelect(node, i);		
	}
}

function histAllDeselect()
{
	var node;
	for(var i = 0; i <histArr.length ; i ++)
	{
		node = histStage.get("#"+ (i + histIdStart));
		histSingleDeselect(node, i);
	}
}


