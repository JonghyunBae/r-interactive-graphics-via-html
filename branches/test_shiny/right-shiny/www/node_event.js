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
function eventTrigger(Name)
{
        hover(Name);
        select(Name);
        menu(Name);
        drag(Name);
        
}
var menuOn = false;
var tableVisible=false;
function menu(Name)
{       
//////////////////////////////////////Menu Start//////////////////////////////////////
        Name.menuLayer = new Kinetic.Layer();
        Name.menu = new Kinetic.Group({
                opacity: 0.95,
                visible: false
        });
        Name.menuText = new Array();
        Name.menuRect = new Array();    
       
        var menuName = new Array("Hide", "Reset", "Table", "X Axis	��", "Y Axis	��", "Color		��",  "Legend	��", "Width	��", "Height	��", "Bin		��"); //add element you want.
        var menuNameRev = new Array("Hide", "Reset", "Table", "�� X Axis", "�� Y Axis", "�� Color",  "�� Legend", "�� Width", "�� Height", "�� Bin"); 
        var optionName = ['xAxis', 'yAxis', 'color', 'legend', 'width', 'height', 'bin'];
        //var menuFunction = [hideSelected, resetSelected, showTable];
        
        for(var i=0; i < menuName.length; i++){
                Name.menuText[i] = new Kinetic.Text({
                        y: 25 * i,
                        text: '',
                        fontFamily: 'Calibri',
                        fontSize: 15,
                        padding: 5,
                        fill: 'white'
                })      
                Name.menuRect[i] = new Kinetic.Rect({
                        y: 25 * i,
                        width: 90,
                        height: 25,
                        fill: '#93b21a'
                });
                Name.menu.add(Name.menuRect[i]).add(Name.menuText[i]);
                Name.menuText[i].setText(' '+menuName[i]);                              
                (function (i) { 
                        Name.menuText[i].on('mouseover', function(evt){
                        	for(var k=0; k<menuName.length; k++){
                        		Name.menuRect[k].setFill('#93b21a');
                                Name.menuText[k].setFill('white');
                        	}
                                Name.menuRect[i].setFill('#cfe444');
                                Name.menuText[i].setFill('black');
                                Name.menuLayer.draw();
                                if(i==0 || i==1 || i==2){ //if "Hide", "Reset", "Show Table", no sub menu       
                                        for(var j=0; j<optionName.length; j++){
                                                Name.subMenu[j].hide();
                                                Name.subMenuLayer[j].draw();    
                                        }                               
                                }else{
                                        for(var j=0; j<optionName.length; j++){
                                                Name.subMenu[j].hide();
                                                Name.subMenuLayer[j].draw();    
                                        }
                                        Name.subMenu[i-(menuName.length-optionName.length)].show();
                                        Name.subMenuLayer[i-(menuName.length-optionName.length)].draw();
                                }
                        });
                        Name.menuRect[i].on('mouseover', function(evt){
	                        	for(var k=0; k<menuName.length; k++){
	                        		Name.menuRect[k].setFill('#93b21a');
	                                Name.menuText[k].setFill('white');
	                        	}                        	
                                Name.menuRect[i].setFill('#cfe444');
                                Name.menuText[i].setFill('black');
                                Name.menuLayer.draw();
                                if(i==0 || i==1 || i==2){ //if "Hide", "Reset", "Show Table", no sub menu
                                        for(var j=0; j<optionName.length; j++){
                                                Name.subMenu[j].hide();
                                                Name.subMenuLayer[j].draw();    
                                        }
                                }else{
                                        for(var j=0; j<optionName.length; j++){
                                                Name.subMenu[j].hide();
                                                Name.subMenuLayer[j].draw();    
                                        }
                                        Name.subMenu[i-(menuName.length-optionName.length)].show();
                                        Name.subMenuLayer[i-(menuName.length-optionName.length)].draw();
                                }
                        });
                        Name.menuText[i].on('mouseout', function(evt){
                                Name.menuRect[i].setFill('#93b21a');
                                Name.menuText[i].setFill('white');
                                Name.menuLayer.draw();
                        });
                        Name.menuRect[i].on('mouseout', function(evt){
                                Name.menuRect[i].setFill('#93b21a');
                                Name.menuText[i].setFill('white');
                                Name.menuLayer.draw();
                        });     
                })(i);
        }
        Name.menuLayer.add(Name.menu);
        Name.stage.add(Name.menuLayer);
        
        Name.menuText[0].on('click', function(evt){
                hideSelected();
                Name.menu.hide();
                Name.menuLayer.draw();  
        });
        Name.menuRect[0].on('click', function(evt){
                hideSelected();
                Name.menu.hide();
                Name.menuLayer.draw();  
        });
        Name.menuText[1].on('click', function(evt){
        		sendArr(Name)
                //resetSelected();
                Name.menu.hide();
                Name.menuLayer.draw();  
        });
        Name.menuRect[1].on('click', function(evt){
        		sendArr(Name)
        		//resetSelected();
                Name.menu.hide();
                Name.menuLayer.draw();                  
        });
                
        Name.menuText[2].on('click', function(evt){
                if(tableVisible == false){
                        document.getElementById('dataTable').style.display = 'block';
                        document.getElementById('tableScrollableContainer').style.display = 'block';
                //      Name.menuText[2].setText(" Hide Table");                
                        tableVisible=true;
                }else{
                        document.getElementById('dataTable').style.display = 'none';
                        document.getElementById('tableScrollableContainer').style.display = 'none';
                //      Name.menuText[2].setText(" Show Table");                
                        tableVisible=false;
                }               
                Name.menu.hide();
                Name.menuLayer.draw();  
        });
        Name.menuRect[2].on('click', function(evt){
                if(tableVisible == false){
                        document.getElementById('dataTable').style.display = 'block';
                        document.getElementById('tableScrollableContainer').style.display = 'block';
                //      Name.menuText[2].setText(" Hide Table");                
                        tableVisible=true;
                }else{
                        document.getElementById('dataTable').style.display = 'none';
                        document.getElementById('tableScrollableContainer').style.display = 'none';
                //      Name.menuText[2].setText(" Show Table");                
                        tableVisible=false;
                }                
                Name.menu.hide();
                Name.menuLayer.draw();  
        });
        

        Name.subMenuLayer = new Array(optionName.length);
        Name.subMenu = new Array(optionName.length);
        for(var i=0; i< optionName.length ; i++){
                Name.subMenuLayer[i] = new Kinetic.Layer();
                Name.subMenu[i] = new Kinetic.Group({
                        opacity: 0.95,
                        visible: false
                });
        }
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Name.subMenuText = make2DArr(optionName.length);
        Name.subMenuRect = make2DArr(optionName.length);
        var subMenuName =  make2DArr(optionName.length);
        for(j=0; j< optionName.length; j++){
        		switch(j){
	        		case 0 : 
	        		case 1 :
	        		case 2 :
	                    subMenuName[j]=labelArr;
	                    break;
	        		case 3 :
	        			subMenuName[j]=['right', 'left', 'topright', 'topleft', 'default'];
	                    break; 
	        		case 4 :
	        		case 5 :
	        			subMenuName[j]=['-100px', '-10px', '-1px', '+1px', '+10px', '+100px'];
	                    break;
	        		case 6 :
	        			subMenuName[j]=['-1', '+1'];
	                    break;
                    default :
                    	break;
        		}
                (function (j) { 
                        for(var i=0; i < subMenuName[j].length; i++){
                                Name.subMenuText[j][i] = new Kinetic.Text({
                                        x: 90,
                                  //      y: 25 * i,
                                        y: (menuName.length-optionName.length)*25+25 * i + 25 * j,
                                        text: '',
                                        fontFamily: 'Calibri',
                                        fontSize: 15,
                                        padding: 5,
                                        fill: 'white'
                                })      
                                Name.subMenuRect[j][i] = new Kinetic.Rect({
                                        x: 95,     
                                  //      y: 25 * i,
                                        y: (menuName.length-optionName.length)*25+25 * i + 25 * j,
                                        width: 90,
                                        height: 25,
                                        fill: '#93b21a'
                                });     
                                Name.subMenu[j].add(Name.subMenuRect[j][i]).add(Name.subMenuText[j][i]);
                                Name.subMenuText[j][i].setText(' '+subMenuName[j][i]);  
                                (function (i) { 
                                        Name.subMenuText[j][i].on('click', function(evt){
                                                window.Shiny.onInputChange("graphName", Name._id);
                                                window.Shiny.onInputChange("whichOption", j);
                                                window.Shiny.onInputChange("changeOption", i);
                                        });
                                        Name.subMenuRect[j][i].on('click', function(evt){
                                                window.Shiny.onInputChange("graphName", Name._id);
                                                window.Shiny.onInputChange("whichOption", j);
                                                window.Shiny.onInputChange("changeOption", i);
                                        });
                                        Name.subMenuText[j][i].on('mouseover', function(evt){
                                                Name.subMenuRect[j][i].setFill('#cfe444');
                                                Name.subMenuText[j][i].setFill('black');                                    
                                                Name.subMenu[j].show();
                                                Name.subMenuLayer[j].draw();                                                
                                                Name.menuRect[j+(menuName.length-optionName.length)].setFill('#cfe444');
                                                Name.menuText[j+(menuName.length-optionName.length)].setFill('#black');
                                                Name.menuLayer.draw();
                                        });
                                        Name.subMenuRect[j][i].on('mouseover', function(evt){
                                                Name.subMenuRect[j][i].setFill('#cfe444');
                                                Name.subMenuText[j][i].setFill('black');
                                                Name.subMenu[j].show();
                                                Name.subMenuLayer[j].draw();
                                                Name.menuRect[j+(menuName.length-optionName.length)].setFill('#cfe444');
                                                Name.menuText[j+(menuName.length-optionName.length)].setFill('#black');
                                                Name.menuLayer.draw();
                                        });
                                        Name.subMenuText[j][i].on('mouseout', function(evt){
                                                Name.subMenuRect[j][i].setFill('#93b21a');
                                                Name.subMenuText[j][i].setFill('white');                                                
                                        //      Name.menuLayer.draw();
                                        });
                                        Name.subMenuRect[j][i].on('mouseout', function(evt){
                                                Name.subMenuRect[j][i].setFill('#93b21a');
                                                Name.subMenuText[j][i].setFill('white');
                                        //      Name.menuLayer.draw();
                                        });     
                                }) (i); 
                        }
                }) (j); 
        }
//      alert(subMenuName); //add labelArr
//      alert(subMenuName);
        
        
        

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        for(var j=0; j<optionName.length; j++){
                Name.subMenuLayer[j].add(Name.subMenu[j]);
                Name.stage.add(Name.subMenuLayer[j]);
        }
        
        
        Name.stage.on('click', function(evt){ // mouse drag
                for(var i = 0 ; i < objArr.length ; i ++)
                {
                        objArr[i].menu.hide();
                        objArr[i].menuLayer.draw();
                        for(var j=0; j<optionName.length; j++){
                                objArr[i].subMenu[j].hide();
                                objArr[i].subMenuLayer[j].draw();       
                        }
                }
                if((evt.which && evt.which == 3) || (evt.button && evt.button == 2)){ //right click                     
                        for(var j=0; j<optionName.length; j++){
                                Name.subMenu[j].hide();
                                Name.subMenuLayer[j].draw();    
                        }
                        menuOn=true;
                        //alert('right clicked');
                        var node = evt.targetNode;
                        //update menu
                        var menuHeight = 25*menuName.length;
                        var menuWidth = 90;
                        var mousePos = node.getStage().getMousePosition();
                        /*******************/
                        /*			2		|		1			*/
                        /*------------------------------------------------*/
                        /*			3		|		4			*/
                        /*******************/                        
                       if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){//2nd quadrant
                                Name.menu.setPosition(mousePos.x + 2, mousePos.y + 2);
                                for(var j=0; j<optionName.length; j++){
                                        Name.subMenu[j].setPosition(mousePos.x -2 , mousePos.y + 2);
                                }
                                for(var i=0; i < menuName.length; i++){                                 
                                	Name.menuText[i].setText(' '+menuName[i]);   
                                }
                        }else if(mousePos.x < Name.plotXMargin + Name.width/2 && mousePos.y > Name.plotYMargin + Name.height/2){//3rd quadrant
                                Name.menu.setPosition(mousePos.x + 2, mousePos.y - 2 - menuHeight);
                                for(var j=0; j<optionName.length; j++){
                                        Name.subMenu[j].setPosition(mousePos.x - 2 , mousePos.y - 2 - 25*subMenuName[0].length - 25*(subMenuName[j].length-1));
                                }
                                for(var i=0; i < menuName.length; i++){                                 
                                	Name.menuText[i].setText(' '+menuName[i]);   
                                }
                        }else if(mousePos.x > Name.plotXMargin + Name.width/2 && mousePos.y < Name.plotYMargin + Name.height/2){//1st quadrant
                                Name.menu.setPosition(mousePos.x - 2 - menuWidth, mousePos.y + 2);
                                for(var j=0; j<optionName.length; j++){
                                        Name.subMenu[j].setPosition(mousePos.x - 8 - 3*menuWidth, mousePos.y + 2);
                                }
                                for(var i=0; i < menuName.length; i++){                                 
                                	Name.menuText[i].setText(' '+menuNameRev[i]);   
                                }
                        }else{//4th quadrant
                                Name.menu.setPosition(mousePos.x - 2 - menuWidth , mousePos.y - 2 - menuHeight);
                                for(var j=0; j<optionName.length; j++){
                                        Name.subMenu[j].setPosition(mousePos.x - 8 - 3*menuWidth, mousePos.y - 2 - 25*subMenuName[0].length  - 25*(subMenuName[j].length-1));
                                }
                                for(var i=0; i < menuName.length; i++){                                 
                                	Name.menuText[i].setText(' '+menuNameRev[i]);   
                                }
                        }                               
                        Name.menu.show();
                        Name.menuLayer.draw();
                }else if((evt.which && evt.which == 1) || (evt.button && evt.button == 0)){ //left click
                        if(menuOn==true){
                                Name.menu.hide();
                                Name.menuLayer.draw();
                                for(var j=0; j<optionName.length; j++){
                                        Name.subMenu[j].hide();
                                        Name.subMenuLayer[j].draw();    
                                }
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
                        //alert(preDragMousePos.x);
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
                        //      alert(tmpName);
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
                if(ctrlPressed == true) {
                        for(var i = 0 ; i < Name.node.length ; i ++)
                        {
                                if(smallX <= Name.node[i].getX() && Name.node[i].getX() <= bigX && smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY)
                                {
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
                if(ctrlPressed == true) {
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
        }else if(Name._type == "box"){
                if(ctrlPressed == true) {
                        for(var i = 0 ; i < Name.node.length ; i ++)
                        {
                                if(Name.node[i].getIsOutlier()){
                                        if(smallX <= Name.node[i].getX() && Name.node[i].getX() <= bigX && smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY)
                                        {
                                                        allGraphUpdate(i ,(Name.node[i].getSelected()+1)%2, Name);                      
                                        }
                                }else{
                                        if((smallX <= Name.node[i].getX()+Name.node[i].getWidth()/2 && Name.node[i].getX()-Name.node[i].getWidth()/2 <= bigX) && (smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY))
                                        {
                                                        allGraphUpdate(i ,(Name.node[i].getSelected()+1)%2, Name);                      
                                        }
                                }                               
                        }
                }else{
                        for(var i = 0 ; i < Name.node.length ; i ++)
                        {
                                if(Name.node[i].getIsOutlier()){
                                        if(smallX <= Name.node[i].getX() && Name.node[i].getX() <= bigX && smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY)
                                        {
                                                allGraphUpdate(i ,1, Name);
                                        }
                                }else{
                                        if((smallX <= Name.node[i].getX()+Name.node[i].getWidth()/2 && Name.node[i].getX()-Name.node[i].getWidth()/2 <= bigX) && (smallY <= Name.node[i].getY() && Name.node[i].getY() <= bigY))
                                        {
                                                allGraphUpdate(i ,1, Name);     
                                        }
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
       //       node.moveToTop();
                document.body.style.cursor = "pointer";         
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
                Name.tooltip.show();
                Name.tooltipLayer.draw();               
                if(node.getSelected() == 0)
                {
                        switch(Name._type)
                        {
                                        case 'scatter' : 
                                                node.setScaleX(1.5);
                                                node.setScaleY(1.5);
                                                node.draw();
                                        break;
                                        case 'hist' : 
                                        node.setOpacity(1);
                                        node.setScaleX(1.2);
                                        node.draw();
                                        break;
                                case 'box' : 
                                        if(node.getIsOutlier()){
                                                node.setScaleX(1.5);
                                                        node.setScaleY(1.5);
                                                        node.draw();
                                        }else{
                                                node.setOpacity(1);
                                                //node.setScaleX(1.2);
                                                node.draw();
                                        }
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
                        //new kinetic version using tween for animation.
                        switch(Name._type)
                        {                                       
                                        case 'scatter' : 
                                                var tween = new Kinetic.Tween({
                                        node: node, 
                                        duration: 0.01,
                                        scaleX: 1,
                                        scaleY: 1
                                      }).play(); 
                                        break;                                          
                                case 'hist' : 
                                        var tween = new Kinetic.Tween({
                                        node: node, 
                                        duration: 0.01,
                                        opacity: 0.5,
                                        scaleX: 1
                                      }).play(); 
                                        break;                  
                                case 'box' : 
                                        if(node.getIsOutlier()){
                                                var tween = new Kinetic.Tween({
                                                node: node, 
                                                duration: 0.01,
                                                scaleX: 1,
                                                scaleY: 1
                                              }).play(); 
                                        }else{
                                                var tween = new Kinetic.Tween({
                                                node: node, 
                                                duration: 0.01,
                                                opacity: 0.5
                                           //     scaleX: 1
                                              }).play(); 
                                        }
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
                                var tmpX = Name.node[node.getName()].getX(); 
                                var tmpY = Name.height +Name.plotYMargin - Name.node[node.getName()].getY(); 
                        //      alert(tmpX + " , " + tmpY);
                                if(aPressed){   //select ALL
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
                                                
                                        }else if(Name._type == "hist" || Name._type == "box"){
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
                                }else{  // just one click
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
