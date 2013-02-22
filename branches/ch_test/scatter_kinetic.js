var scatterIdStart = idCounter;
var scatterIdEnd;

//////////////////////////////////////Stage Start//////////////////////////////////////
  var stage = new Kinetic.Stage({
    container: 'container',
    width: plotWidth+plotXmargin*2,
    height: plotHeight+plotYmargin*2
  });
//////////////////////////////////////Drawing Plot Start//////////////////////////////////////
var scatterPlotLayer= new Kinetic.Layer();  
drawBaseRect('black', scatterPlotLayer);
drawScale(scatterXMax, scatterXDiff, scatterYMax, scatterYDiff, scatterPlotLayer);
drawLabel(scatterXLabel, scatterYLabel, scatterPlotLayer);
drawMainLabel('Scatter of '+scatterXLabel+'&'+scatterYLabel, scatterPlotLayer);
stage.add(scatterPlotLayer);
//////////////////////////////////////Drawing Plot End//////////////////////////////////////

//add node function.
function scatterAddNode(obj, layer) 
{
	var node = new Kinetic.Circle({
		id: obj.id,
		name: obj.name,
		x: obj.x,
		y: obj.y,
		radius: radius_scale,
		fill: obj.color,
		stroke : obj.stroke,
		strokeWidth : 0.01,
		opacity : 0.75,		
		draggable: false,
		selected : obj.selected
	});		
	layer.add(node);
}
//build data
var xScale=plotWidth/scatterXMax;//added by us
var yScale=plotHeight/scatterYMax; //added by us
var scatterData = [];

for(var n = 0; n < scatterXMain.length ; n++)
{
	var x = scatterXMain[n]*xScale+plotXmargin;
	var y = scatterYMain[n]*yScale+plotYmargin;
	var tmp=plotHeight/2+plotYmargin-y; 
	y=y+2*tmp; //since (0,0) of canvas is top-left, so we need to change it into bottom-left.
	scatterData.push({
		id: idCounter,
		name: dataGetName(n), //modify it using by for loop later.
		x: x,
		y: y,		
		color: setColor(scatterColor,n), 
		stroke : 'black',
		selected : 0 // 0 means : unselected ,  1 means : selected
	});
	idCounter++;
}
scatterIdEnd = idCounter - 1;
//render data
var scatterDataLayer= new Kinetic.Layer();
for(var n = 0; n < scatterData.length; n++) 
{
	scatterAddNode(scatterData[n], scatterDataLayer);
}
stage.add(scatterDataLayer);

//////////////////////////////////////Tooltip Start//////////////////////////////////////
var scatterTooltipLayer = new Kinetic.Layer();
var scatterTooltip = new Kinetic.Group({
	id : -1,
	opacity: 0.75,
	visible: false
});
var scatterTooltipText = new Kinetic.Text({
	id : -1,
	text: '',
	fontFamily: 'Calibri',
	fontSize: 18,
	padding: 5,
	fill: 'white',
	align:'center'
});	  
var scatterTooltipRect = new Kinetic.Rect({
	id : -1,
	fill: 'black'
});  

scatterTooltip.add(scatterTooltipRect).add(scatterTooltipText);
scatterTooltipLayer.add(scatterTooltip);	  
stage.add(scatterTooltipLayer);


function tooltipTextGetName(arr){	//"Subject: " + nameArr[0] +"\r\n"+ "Wt: " + nameArr[1] + "\r\n"+"Does: " + nameArr[2] +"\r\n"+ "Time: " + nameArr[3] + "\r\n"+"conc: " + nameArr[4] +"\r\n"
	var name=labelArr[0]+" : " + arr[0]+ "\r\n" ;
	for(var i=1; i< labelArr.length ; i++){
		name=name+ labelArr[i].split('\n')[0]+" : " + arr[i]+ "\r\n" ; //-------------------------csv2Arr(data, liveChar) has bug.....last column data includes "\n", should be removed...!!!!!!!!!!!!
	}//labelArr[i].split('\n')[0] is temp solution.
	return name;	

}

scatterDataLayer.on('mouseover', function(evt){
	document.body.style.cursor = "pointer";
	var node = evt.shape;
	var mousePos = node.getStage().getMousePosition();
	scatterTooltip.setPosition(mousePos.x + 8, mousePos.y + 8);
	var nameArr = new Array();
	nameArr = node.getName().split(',');		

	
	scatterTooltipText.setText("node : " + (node.getId() - scatterIdStart) +"\r\n"+ tooltipTextGetName(nameArr)+"color : " + node.getFill()); //naem split?
	scatterTooltipRect.setAttrs({
		width: scatterTooltipText.getWidth(),
		height: scatterTooltipText.getHeight()
	});

	scatterTooltip.show();
	scatterTooltipLayer.draw();
	node.moveToTop();
	var shapes = stage.get('#'+node.getId());
	shapes.apply('transitionTo', {
		scale: { x : 1.5, y : 1.5 },
		duration: 0.1
		//	easing: 'elastic-ease-out'
	});	
});

scatterDataLayer.on('mouseout', function(evt) {
	var node = evt.shape;
	document.body.style.cursor = "default";
	scatterTooltip.hide();
	scatterTooltipLayer.draw();	 
	var shapes = stage.get('#'+node.getId());
	if(scatterData[node.getId() - scatterIdStart].selected > 0){//selected
		shapes.apply('transitionTo', {
			opacity: 1,
			scale: { x : 1.3, y : 1.3 },
			duration: 0.1
			//	easing: 'elastic-ease-out'
		});
	}else{		  //unselected
		shapes.apply('transitionTo', {
			opacity: 0.75,
			scale:{ x : 1, y : 1 },
			duration: 0.1
			//	easing: 'elastic-ease-out'
		});
	}
});	  
//////////////////////////////////////Tooltip End//////////////////////////////////////

//////////////////////////////////////Selection Start//////////////////////////////////////
var preMousePos;


scatterPlotLayer.on('click', function(evt){
	//var node = evt.shape;
	scatterAllDeselect();
	histAllDeselect();
	if(msgShow==true){
		writeMsg(msgLayer);
	}
	 tmpShift = false;
	 var tmpNode = stage.get("#"+ (scatterIdStart));
	 tmpNode.apply('transitionTo', {
		 rotation : 0,
	//	scale: { x : 1.3, y : 1.3 },
		duration: 0.1
		//	easing: 'elastic-ease-out'
	});
	 var tmpNode1 = stage1.get("#"+ (histIdStart));
	 tmpNode1.apply('transitionTo', {
		 rotation : 0,
	//	stroke:'black',
	//	scale: { x : 1.3, y : 1.3 },
		duration: 0.1
		//	easing: 'elastic-ease-out'
	});
});

scatterDataLayer.on('click', function(evt){
  	var node = evt.shape;
  	var shapes = stage.get('#'+node.getId());
  	var semiNode;
  	var mousePos = {x: node.getX(), y:node.getY()};
  	var tmpNode;
  	
  	if(aPressed){	//select ALL
  		histAllSelect();
  		scatterAllSelect();
  		tmpShift = false;
  	}else if(gPressed){ //select by Group, (select every node whose subject is the same)
  		nameArr = node.getName().split(',');	
  		for(var i = 0 ; i < scatterData.length ; i++){
			var tmpNameArr = new Array();
			tmpNameArr = scatterData[i].name.split(',');	
			if(nameArr[0] == tmpNameArr[0]) //[0]안의 0값을 유듕적으로 바꿀 수 있게, idea는 key1누루면 1로 key2누르면 2로 바꾸면 될 듯...
			{
				tmpNode = stage.get("#"+ (i + scatterIdStart));
				scatterSingleSelect(tmpNode, i);
				histUpdate(scatterXMain[i], 0);  //과부하로 인한 보류
			}
		}
		tmpShift = false;
	}else if(shiftPressed){
		scatterAllDeselect();
		histAllDeselect();
		tmpShift = true;
		if(preMousePos.x < mousePos.x)
		{
			if(preMousePos.y < mousePos.y)	{
				for(var i = 0 ; i < scatterData.length ; i++){
					if(preMousePos.x <= scatterData[i].x && scatterData[i].x <= mousePos.x && preMousePos.y <= scatterData[i].y && scatterData[i].y <= mousePos.y )
					{
						tmpNode = stage.get("#"+ (i + scatterIdStart));
						scatterSingleSelect(tmpNode, i);
						histUpdate(scatterXMain[i], 0);
					}
				}
			}else if(mousePos.y < preMousePos.y){
				for(var i = 0 ; i < scatterData.length ; i++){
					if(preMousePos.x <= scatterData[i].x && scatterData[i].x <= mousePos.x && mousePos.y <= scatterData[i].y && scatterData[i].y <= preMousePos.y )
					{
						tmpNode = stage.get("#"+ (i + scatterIdStart));
						scatterSingleSelect(tmpNode, i);
						histUpdate(scatterXMain[i], 0);
					}
				}
			}
		}else if(preMousePos.x > mousePos.x)
		{
			if(preMousePos.y < mousePos.y)	{
				for(var i = 0 ; i < scatterData.length ; i++){
					if(mousePos.x <= scatterData[i].x && scatterData[i].x <= preMousePos.x  && preMousePos.y <= scatterData[i].y && scatterData[i].y <= mousePos.y )
					{
						tmpNode = stage.get("#"+ (i + scatterIdStart));
						scatterSingleSelect(tmpNode, i);
						histUpdate(scatterXMain[i], 0);
					}
				}
			}else if(mousePos.y < preMousePos.y){
				for(var i = 0 ; i < scatterData.length ; i++){
					if(mousePos.x <= scatterData[i].x && scatterData[i].x <= preMousePos.x && mousePos.y  <= scatterData[i].y && scatterData[i].y <= preMousePos.y  )
					{
						tmpNode = stage.get("#"+ (i + scatterIdStart));
						scatterSingleSelect(tmpNode, i);
						histUpdate(scatterXMain[i], 0);
					}
				}
			}
		}	
	}else if(ctrlPressed){ //select mutiple node one by one.
  		if(scatterData[node.getId() - scatterIdStart].selected > 0){ // pre pressed state -> deselect rect & scatter
  			scatterSingleDeselect(shapes, node.getId() - scatterIdStart);
  			histUpdate(scatterXMain[node.getId() - scatterIdStart],1);
   		}else if(scatterData[node.getId() - scatterIdStart].selected == 0){ // unselected -> selected
  			scatterSingleSelect(shapes, node.getId() - scatterIdStart);
  			histUpdate(scatterXMain[node.getId() - scatterIdStart],0);
  		}
  		tmpShift = false;
  	}else{
		tmpShift = false;
  		scatterAllDeselect();
  		histAllDeselect();
  		scatterSingleSelect(shapes, node.getId() - scatterIdStart);
  		//document.write(scatterXMain[node.getId() - scatterIdStart]);
  		histUpdate(scatterXMain[node.getId() - scatterIdStart],0);
  	}  	
  	if(tmpShift == false)
	{
		preMousePos = mousePos;
	}  	
  	if(msgShow==true){
		writeMsg(msgLayer);
	}
  	
  	 var tmpNode = stage.get("#"+ (scatterIdStart));
	 tmpNode.apply('transitionTo', {
		rotation : 0,
	//	scale: { x : 1.3, y : 1.3 },
		duration: 0.1
		//	easing: 'elastic-ease-out'
	});
	var tmpNode1 = stage1.get("#"+ (histIdStart));
	 tmpNode1.apply('transitionTo', {
		 rotation : 0,
	//	stroke:'black',
	//	scale: { x : 1.3, y : 1.3 },
		duration: 0.1
		//	easing: 'elastic-ease-out'
	});
  	
}); 

function scatterUpdate(rectId, eraseOn)
{
	var node;
	if(eraseOn == 0)	{
		for(var i = 0 ; i< histHasArr[rectId].length ; i ++)
		{	
			node = stage.get("#" + scatterData[histHasArr[rectId][i]].id);
			scatterSingleSelect(node, histHasArr[rectId][i]);
		}
	}else if(eraseOn == 1){ 
		for(var i = 0 ; i< histHasArr[rectId].length ; i ++)
		{
			node = stage.get("#" + scatterData[histHasArr[rectId][i]].id);
			if(scatterData[histHasArr[rectId][i]].selected  == 1)
			{
				scatterSingleDeselect(node, histHasArr[rectId][i]);
			}			
		}
	}
}

function scatterSingleSelect(node, id)
{
//document.write(node + id);
//	node = stage.get("#"+ id );
	node.apply('setAttrs', {
		opacity: 1,
		//stroke : 'black',
		strokeWidth : 2,
		//fill : 'green',
		stroke : 'red',
		scale: { x : 1.3, y : 1.3 },
	//	duration: 0.1
		//	easing: 'elastic-ease-out'
	});
	scatterData[id].selected=1;
}

function scatterSingleDeselect(node, id)
{
	node.apply('setAttrs', {
		opacity: 0.75,
		//stroke : 'black',
		strokeWidth : 0.01,
	//	fill : 'green',
		stoke : 'green',
		scale: { x : 1, y : 1 },
	//	duration: 0.1
		//	easing: 'elastic-ease-out'
	});
	scatterData[id].selected=0;
}

function scatterAllSelect()
{
	var node;
	for(var i = 0; i <scatterData.length ; i ++)
	{
		node = stage.get("#"+ (i + scatterIdStart));
		if(scatterData[i].selected == 0)
		{
			scatterSingleSelect(node, i);
		}
	}
	//scatterPlotLayer.draw();
}

function scatterAllDeselect()
{
	var node;
	for(var i = 0; i <scatterData.length ; i ++)
	{
		node = stage.get("#"+ (i + scatterIdStart));
		if(scatterData[i].selected == 1)
		{
		//	document.write(i +scatterIdStart );
			
			scatterSingleDeselect(node, i);
		}
	}
	
	
	//scatterPlotLayer.draw();
}

//////////////////////////////////////Selection End//////////////////////////////////////


//////////////////////////////////////Legend Start//////////////////////////////////////
if(legend ==true)
{
	drawLegend("topright",scatterColor);
}
//////////////////////////////////////Legend End//////////////////////////////////////

/*
//////////////////////////////////////Chk Start//////////////////////////////////////   
var messageLayer = new Kinetic.Layer();
stage.add(messageLayer);
function writeMessage(messageLayer){

    
	var context = messageLayer.getContext();
    messageLayer.clear();
//    var colors2 = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];
  //  document.write('a');
	context.font = "12pt Calibri";
    context.fillStyle = "black";	    
    context.fillText("Selected Node", 10, 15);
   
    var cnt=0;
    var cnt2=0;
   // document.write('a');
	for(var i=0; i<scatterData.length; i++){
		if(scatterData[i].selected==1){
			if(cnt>49){
				cnt=0;
				cnt2=cnt2+20;
			}
			cnt++;
			context.font = "8pt Calibri";
	//	    context.fillStyle = colors2[mainArr[0][i]-1];	
			context.fillStyle = setColor(scatterColor,i);
		    context.fillText(i, 10+cnt2, 10*cnt+20);
	//	document.write("selected("+i+") is : "+scatterData.selected[i]+"<br>");
		}
	}
}
//////////////////////////////////////Chk End//////////////////////////////////////
*/

/*
////////////////Common Data Structure //////////////
function ObjTemp()
{
	this.subject='';
	this.wt = '';
	this.dose = '';
	this.time = '';
	this.conc = '';
};    
// ///////////////// Common Array ///////////////
var theophArr = new ObjTemp();
mainArr[0] = new Array();
mainArr[1] = new Array();
mainArr[2] = new Array();
scatterXMain = new Array();
scatterYMain = new Array();
theophArr.selected = new Array();    
////////////////Split & Save Data //////////////////
for(var j=0; j<dataArr.length; j++) // 1부터 시작할지 0부터 시직할지는 나중에 결정
{	
	var tmp_array = dataArr[j].toString().split(',');	
	mainArr[0][j]=parseFloat(tmp_array[0]);
	mainArr[1][j]=parseFloat(tmp_array[1]);
	mainArr[2][j]=parseFloat(tmp_array[2]);
	scatterXMain[j]=parseFloat(tmp_array[3]);
	scatterYMain[j]=parseFloat(tmp_array[4]);
}    
*/