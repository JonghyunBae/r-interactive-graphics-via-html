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
	//alert(e.keyCode);
	//17 || 25 = ctrl, shift = 16, a=65, g= 71
	if(e.keyCode == 17 || e.keyCode == 25)
	{
		ctrlPressed = true;
	}
	if(e.keyCode == 16)
	{
		shiftPressed = true;
	}
	if(e.keyCode == 65)
	{
		aPressed = true;
	}
	if(e.keyCode == 71)
	{
		gPressed = true;
	}
	if(e.keyCode == 90)
	{
		zPressed = true;
	}
	if(ctrlPressed == true && zPressed == true)
	{
		fetchWork();
	}
//	alert("11111" + ctrlPressed + "," + zPressed);
	
}	
function checkKeyUp(e) 
{
//	alert(e.keyCode);
	//17 || 25 = ctrl, shift = 16
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
//	alert("22222" + ctrlPressed + "," + zPressed);
}	
//////////////////////////////////////Chk key event End//////////////////////////////////////

function hover(Name)
{
	Name.dataLayer.on('mouseover mousemove', function(evt){  
        document.body.style.cursor = "pointer";
        var node = evt.shape;
        var mousePos = node.getStage().getMousePosition();
        Name.tooltip.setPosition(mousePos.x + 8, mousePos.y + 8);
    	Name.tooltipText.setText("Frequency \n     " + node.getFreq()); //Name split?
    	Name.tooltipRect.setAttrs({
    		width: Name.tooltipText.getWidth(),
    		height: Name.tooltipText.getHeight()
    	});
    	Name.tooltipLayer.moveUp();
    	Name.tooltip.show();
    	Name.tooltipLayer.draw();

    	var shapes = Name.stage.get('#'+node.getId());
    	Name.node[node.getId()].setOpacity(1);    	
    	shapes.apply('transitionTo', {
    	    rotation : 0,
    	    duration: 0.1
    	});    	
    });		
	Name.dataLayer.on('mouseout', function(evt){  
		document.body.style.cursor = "default";  // 나중에 지워도 되는지 확인할 것 
		Name.tooltip.hide();
    	Name.tooltipLayer.draw();
    	var node = evt.shape;
    	if(node.getSelected() == 0)
    	{
    		var shapes = Name.stage.get('#'+node.getId());
        	Name.node[node.getId()].setOpacity(0.5);    	
        	shapes.apply('transitionTo', {
        	    rotation : 0,
        	    duration: 0.1
        	});
    	}    	    	
	});
}
var tmpShift = false;
function select(Name)
{
	Name.dataLayer.on('click', function(evt){
		var node = evt.shape;
		var shapes = Name.stage.get('#'+node.getId());
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


