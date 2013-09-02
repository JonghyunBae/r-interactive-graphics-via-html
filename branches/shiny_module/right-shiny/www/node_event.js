

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
	}	
	//select(Name);
   // menu(Name);
   // drag(Name);        
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
        rangeBoxLayer.add(rangeBox); 
        Name.stage.add(rangeBoxLayer);        
        var moving = false;
        var divid;
        Name.stage.on('mousedown touchstart', function(evt){
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
                                RectRangeSelect(tmpName, preDragMousePos, aftDragMousePos);
                                
                        }
                }
        }, true);
}
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
	if(Name._type == "scatter"  || Name._type == "pie" ){
		if(ctrlPressed == true) {
			for(var i = 0 ; i < Name.node.length ; i ++){
				if(smallX <= Name.node[i].getX() && Name.node[i].getX() <= bigX && smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY){
					if(Name.node[i].getSelected()==1){
						tmpNodeArr.push(i);
					}else{
						tmpNodeArr1.push(i);
					}					                   
                }
			}
			allGraphUpdate(Name, tmpNodeArr, 0);
			allGraphUpdate(Name, tmpNodeArr1, 1);
		}else{
			for(var i = 0 ; i < Name.node.length ; i ++){
				if(smallX <= Name.node[i].getX() && Name.node[i].getX() <= bigX && smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY){
					tmpNodeArr.push(i);              
                }                        
			}
			allGraphUpdate(Name, tmpNodeArr, 1);
		}
                
	}else if(Name._type == "hist"){
		if(ctrlPressed == true) {
			for(var i = 0 ; i < Name.node.length ; i ++){
				if((smallX <= Name.node[i].getX() + Name.node[i].getWidth() && Name.node[i].getX() <= bigX) && (smallY <= Name.node[i].getY() + Name.node[i].getHeight() && Name.node[i].getY() <= bigY)){
					if(Name.node[i].getSelected()==1){
						tmpNodeArr.push(i);
					}else{
						tmpNodeArr1.push(i);
					}                      
				}
			}
			allGraphUpdate(Name, tmpNodeArr, 0);
			allGraphUpdate(Name, tmpNodeArr1, 1);
		}else{
			for(var i = 0 ; i < Name.node.length ; i ++){
				if((smallX <= Name.node[i].getX() + Name.node[i].getWidth() && Name.node[i].getX() <= bigX) && (smallY <= Name.node[i].getY() + Name.node[i].getHeight() && Name.node[i].getY() <= bigY)){
					tmpNodeArr.push(i);
                }
           	}
			allGraphUpdate(Name, tmpNodeArr, 1);
        }
	}else if(Name._type == "box"){
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

function hover(Name)
{
	for(var i = 0 ; i < Name.dataLayerArr.length ; i ++){
		(function (i) { 
		Name.dataLayerArr[i].on('mouseover mousemove dragmove', function(evt) {
			var node = evt.targetNode;
			document.body.style.cursor = "pointer";
			var mousePos = node.getStage().getMousePosition();
			var mousePos = node.getStage().getMousePosition();
			// Name.tooltip.setPosition(mousePos.x+5, mousePos.y - 5);
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
				Name.hoverArr[i](node, 1)
	        }
		});
		Name.dataLayerArr[i].on('mouseout', function(evt) {
			var node = evt.targetNode;
			document.body.style.cursor = "default";
			Name.tooltip.hide();
			Name.tooltipLayer.draw();
			if(node.getSelected() == 0){
				Name.hoverArr[i](node, 0);
			}
		});
		})(i);
	}
}

function select(Name)
{
	var tmpNodeArr = new Array();
	// temporary method for unselecting nodes.
	Name.stage.on('click', function(evt){
		if(!(ctrlPressed || shiftPressed || aPressed || gPressed)){
			var node = evt.targetNode;
			if(isNaN(node.getName())){
				allDeselect(Name.graphObjArr[0]);
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
				if(!isNaN(node.getName())){
					if(aPressed){
	            		allSelect(Name.graphObjArr[0]);
	            	}else if(ctrlPressed){
	            		if(node.getSelected() == 0){
	                		allGraphUpdate(Name.graphObjArr[i], node.getName(), 1);
	                	}else if(node.getSelected() == 1){
	                		allGraphUpdate(Name.graphObjArr[i], node.getName(), 0);
	                	}
	            	}else{
	            		allDeselect(Name.graphObjArr[0]);
						allGraphUpdate(Name.graphObjArr[i], node.getName(), 1);
	            	}					
				}
			});
		})(i);
	}
	/*Name.stage.on('click', function(evt){
		if(dragOn == true){                       
            dragOn = false;
            return;
        }
		if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
            var node = evt.targetNode;
            if(isNaN(node.getName() == false)){
            	if(aPressed){
            		allSelect(Name.dataLayerArr[0])
            	}
            }
            var tmpX = Name.node[node.getName()].getX();
            var tmpY = Name.height +Name.plotYMargin - Name.node[node.getName()].getY();
            if(aPressed){   //select ALL
            	Name.tmpShift = false;
            	allSelect(Name);
            }else if(gPressed){
            	Name.tmpShift = false;
            }else if(shiftPressed && Name.preId.x != -1){
            	Name.tmpShift = true;
            	allDeselect(Name);
            	if(Name._type == "hist" || Name._type == "box" || Name._type == "pie"){
            		if(Name.preId.x >= tmpX){
            			for(var i = 0 ; i < Name.node.length ; i ++){
            				if(tmpX <= Name.node[i].getX() && Name.node[i].getX() <= Name.preId.x){
            					tmpNodeArr.push(i);
            				}
            			}
            			allGraphUpdate(Name, tmpNodeArr, 1);
            		}else if(Name.preId.x <= tmpX){
            			for(var i = 0 ; i < Name.node.length ; i ++){
            				if(tmpX >= Name.node[i].getX() && Name.node[i].getX() >= Name.preId.x){
            					tmpNodeArr.push(i);
            				}
            			}
            			allGraphUpdate(Name, tmpNodeArr, 1);
            		}
            	}
            }else if(ctrlPressed){ //select mutiple node one by one.
            	if(node.getSelected() == 0){
            		allGraphUpdate(Name, node.getName(), 1);
            	}else if(node.getSelected() == 1){
            		allGraphUpdate(Name, node.getName(), 0);
            	}
            	Name.tmpShift = false;
            }else{  // just one click
            	Name.tmpShift = false;
            	allDeselect(Name);
            	allGraphUpdate(Name, node.getName(), 1);
            }
        }else{
        	if(!(ctrlPressed || shiftPressed || aPressed || gPressed)){
        		allDeselect(Name);
        		Name.preId = {x : -1 , y : -1};
        	}
        }
	});*/
}
