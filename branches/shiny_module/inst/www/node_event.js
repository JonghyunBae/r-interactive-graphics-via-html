

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
//      alert(e.keyCode);
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
function eventTrigger(NameArr)
{
	for(var i = 0 ; i < NameArr.length ; i ++){
		hover(NameArr[i]);
		select(NameArr[i]);
		drag(NameArr[i]);
		menu(NameArr[i]);
	}      
}


var dragOn = false;
function drag(Name)
{
    var preDragMousePos;
    var aftDragMousePos;
    
    var moving = false;
    var touch = false;
    var divid;
    Name.stage.on('mousedown touchstart', function(evt){
        if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
        	var node = evt.targetNode;
        	if(node.getName() == 'legend'){
        		return;
        	}
            divid = mouseName;
            preDragMousePos={x: (evt.pageX-divOffsetX), y: (evt.pageY-divOffsetY)};
         //   if(touch == true){
          //  	touch = false;
           //     Name.rangeBoxLayer.draw();
           // }else{
                var mousePos = Name.stage.getMousePosition();
                Name.rangeBox.setX(mousePos.x);
                Name.rangeBox.setY(mousePos.y);
                Name.rangeBox.setWidth(0);
                Name.rangeBox.setHeight(0);
                Name.touch = true;
             //   moving = true;
                Name.rangeBoxLayer.drawScene();
           // }
        }
    }); 
    var tmpx, tmpy, tmpName;
    Name.stage.on("mousemove", function (evt){
    	if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click                            
		    if(Name.touch == true){
		    	//alert(Name.containerId);
		    	Name.moving = true;
	            dragOn = true;
	            if(divid == mouseName){
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
	            Name.rangeBox.setWidth(x- Name.rangeBox.getX());
	            Name.rangeBox.setHeight(y- Name.rangeBox.getY());
	            Name.rangeBoxLayer.moveToTop();
	            Name.rangeBoxLayer.drawScene();
		    }
    	}
            
    }, true);
    
    Name.stage.on("mouseup", function (evt){
    	if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
            if(Name.moving == true){
                aftDragMousePos = {x: (evt.pageX-tmpx), y: (evt.pageY-tmpy)};
                Name.rangeBox.setWidth(0);
                Name.rangeBox.setHeight(0);
                Name.rangeBoxLayer.drawScene();
                if(ctrlPressed == false){
                	for(var j = 0 ; j < Name.graphObjArr.length ; j ++){
						allDeselect(Name.graphObjArr[j]);
					}
                }
                // find small x,y and big x,y
                var smallX, bigX;
    			var smallY, bigY;
    			if(preDragMousePos.x >= aftDragMousePos.x){
    				smallX = aftDragMousePos.x;
    				bigX = preDragMousePos.x;
    			}else if(preDragMousePos.x < aftDragMousePos.x){
    		        smallX = preDragMousePos.x;
    		        bigX = aftDragMousePos.x;
    			}
    			if(preDragMousePos.y >= aftDragMousePos.y){
    		        smallY = aftDragMousePos.y;
    		        bigY = preDragMousePos.y;
    			}else if(preDragMousePos.y < aftDragMousePos.y){
    		        smallY = preDragMousePos.y;
    		        bigY = aftDragMousePos.y;
    			}
    			// box search
                for(var i = 0 ; i < Name.boxSearchArr.length ; i ++){
                	Name.boxSearchArr[i](smallX, smallY, bigX, bigY);
                }
                Name.moving = false;
                Name.touch = false;
            //    dragOn = false;
            }
        }
    }, true);
}

function select(Name)
{
	var tmpNodeArr = new Array();
	// temporary method for unselecting nodes.
	Name.stage.on('click', function(evt){
		if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
			if(!(ctrlPressed || shiftPressed || aPressed || gPressed)){
				var node = evt.targetNode;
				if(isNaN(node.getName())){
					if(dragOn == true){
			            dragOn = false;
			            return;
			        }
					Name.touch = false;
					for(var i = 0 ; i < Name.graphObjArr.length ; i ++){
						allDeselect(Name.graphObjArr[i]);
					}					
				}
			}
		}		
	});
	for(var i = 0 ; i < Name.dataLayerArr.length ; i ++){
		(function (i) {
			Name.dataLayerArr[i].on('click', function(evt){
				var node = evt.targetNode;
				if(dragOn == true){
					dragOn = false;
		            return;
		        }
				Name.touch = false;
				if(!isNaN(node.getName())){
					if(aPressed){
						for(var j = 0 ; j < Name.graphObjArr.length ; j ++){
							allSelect(Name.graphObjArr[j]);
						}	            		
	            	}else if(ctrlPressed){
	            		if(node.getSelected() == 0){
	                		allGraphUpdate(Name.graphObjArr[i], node.getName(), 1);
	                	}else if(node.getSelected() == 1){
	                		allGraphUpdate(Name.graphObjArr[i], node.getName(), 0);
	                	}
	            	}else{
	            		for(var j = 0 ; j < Name.graphObjArr.length ; j ++){
							allDeselect(Name.graphObjArr[j]);
						}
						allGraphUpdate(Name.graphObjArr[i], node.getName(), 1);
	            	}					
				}
			});
		})(i);
	}
}


function hover(Name)
{
	for(var i = 0 ; i < Name.dataLayerArr.length ; i ++){
		(function (i) { 
		Name.dataLayerArr[i].on('mouseover mousemove dragmove', function(evt) {
			if(Name.moving == true){                       
	       //     dragOn = false;
	            return;
	        }
			var node = evt.targetNode;
			document.body.style.cursor = "pointer";
			var mousePos = node.getStage().getMousePosition();
			var mousePos = node.getStage().getMousePosition();
			if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){//set tooltip box position
	            Name.tooltip.setPosition(mousePos.x + 8, mousePos.y + 2);
		    }else if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y > Name.plotYMargin + Name.height/2){
		            Name.tooltip.setPosition(mousePos.x + 2, mousePos.y - 2 - Name.tooltip.getHeight());
		    }else if(mousePos.x > Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){
		            Name.tooltip.setPosition(mousePos.x - 2 - Name.tooltip.getWidth(), mousePos.y + 2);
		    }else{
		            Name.tooltip.setPosition(mousePos.x - 2 - Name.tooltip.getWidth(), mousePos.y - 2 - Name.tooltip.getHeight());
		    }
			Name.tooltip.getText().setText(node.getInfo());
			Name.tooltipLayer.moveToTop();
			Name.tooltip.show();
			Name.tooltipLayer.draw();
			if(node.getSelected() == 0){
				Name.hoverArr[i](node, 1);
	        }
		});
		Name.dataLayerArr[i].on('mouseout', function(evt) {
			if(dragOn == true){                       
	            dragOn = false;
	            return;
	        }
			var node = evt.targetNode;
			document.body.style.cursor = "default";
			Name.tooltip.hide();
			Name.tooltipLayer.draw();
			if(node.getSelected() == 0){
				Name.hoverArr[i](node, 0);
			}else{
				if(node.getOpacity() == 0.5){
					node.setOpacity(1);
					node.draw();
				}				
			}
		});
		})(i);
	}
}

//////////////////////// unused /////////////////////////////


function RectRangeSelect(Name, pre, aft)
{
	var tmpNodeArr = new Array();
	var tmpNodeArr1 = new Array();
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
       allDeselect(Name);
	}       
	if(Name._type == undefined)
		return;
	if(Name._type == "box"){
		if(ctrlPressed == true) {
			for(var i = 0 ; i < Name.node.length ; i ++)
			{
				if(Name.node[i].getIsOutlier()){
					if(smallX <= Name.node[i].getX() && Name.node[i].getX() <= bigX && smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY)
					{
						if(Name.node[i].getSelected()==1){
							tmpNodeArr.push(i);
						}else{
							tmpNodeArr1.push(i);
						}                      
					}
				}else{
					if((smallX <= Name.node[i].getX()+Name.node[i].getWidth()/2 && Name.node[i].getX()-Name.node[i].getWidth()/2 <= bigX) && (smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY))
					{
						if(Name.node[i].getSelected()==1){
							tmpNodeArr.push(i);
						}else{
							tmpNodeArr1.push(i);
						}                     
					}
				}                               
			}
			allGraphUpdate(Name, tmpNodeArr, 0);
			allGraphUpdate(Name, tmpNodeArr1, 1);
		}else{
			for(var i = 0 ; i < Name.node.length ; i ++)
			{
				if(Name.node[i].getIsOutlier()){
					if(smallX <= Name.node[i].getX() && Name.node[i].getX() <= bigX && smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY)
					{
						tmpNodeArr.push(i);
					}
				}else{
					if((smallX <= Name.node[i].getX()+Name.node[i].getWidth()/2 && Name.node[i].getX()-Name.node[i].getWidth()/2 <= bigX) && (smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY))
					{
						tmpNodeArr.push(i);     
					}
				}
			}
			allGraphUpdate(Name, tmpNodeArr, 1);
		}
	}
}

