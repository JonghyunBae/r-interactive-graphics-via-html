/////////////// Get Data from csv File ////////////
var filePath = "Theoph-from-R.csv";
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET",filePath,false);
xmlhttp.send(null);
var fileContent = xmlhttp.responseText;
var array = csv2array(fileContent);

// for(var i=0; i<array.length; i++){ document.write("a("+i+") is : "+array[i]+"<br>"); }
 

 function csv2array(data, liveChar)
 {	
 	var i = 0;
 	var eof = '';
 	var cursor = data.charAt(i);
 	var result_array = new Array();
 	var result_row = "";
 	var line = 0;
 	while(cursor != eof)
 	{
 		if((cursor == '\"') || (cursor == '\r') || (cursor == '\t') || (cursor == ' ') ){
 // document.write("ddddddddddddddddddd" + "<br>");
 		}else if( cursor == "\n" ){
 // document.write("dttttttt" + "<br>");
 			result_row += cursor;
 			if (result_array.length <= line)
 			{
 				result_array.push(new Array());
 				result_array[line].push(result_row);
 				result_row = "";
 				line++;
 			}
 		}else{
 // document.write("a("+i+") is : "+ cursor+"<br>");
 			result_row += cursor;
 		}
 			
 		cursor = data.charAt(i++);
 	}
 	return result_array;
 }

//////////////// Common Data Structure //////////////
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
theophArr.subject = new Array();
theophArr.wt = new Array();
theophArr.dose = new Array();
theophArr.time = new Array();
theophArr.conc = new Array();

///////////////// Get Data Name /////////////////
var tmp_array0 = array[0].toString().split(',');	
theophArr.subject[0]=tmp_array0[0];
theophArr.wt[0]=tmp_array0[1];
theophArr.dose[0]=tmp_array0[2];
theophArr.time[0]=tmp_array0[3];
theophArr.conc[0]=tmp_array0[4];

//////////////// Split & Save Data //////////////////
for(var j=1; j<array.length; j++) // 1부터 시작할지 0부터 시직할지는 나중에 결정
{	
	var tmp_array = array[j].toString().split(',');	
/*
* document.write("tmp Array Length = "+tmp_array.length+"<br>"); for(var i=0;
* i<tmp_array.length; i++){ document.write("temp_a("+i+") is :
* "+tmp_array[i]+"<br>"); }
*/	
	theophArr.subject[j]=parseFloat(tmp_array[0]);
	theophArr.wt[j]=parseFloat(tmp_array[1]);
	theophArr.dose[j]=parseFloat(tmp_array[2]);
	theophArr.time[j]=parseFloat(tmp_array[3]);
	theophArr.conc[j]=parseFloat(tmp_array[4]);
}
var radius_scale = 3; // / Dot radius
var plotWidth=500;
var plotHeight=500;
var plotXmargin=150;
var plotYmargin=90; 
var plotLength=15;
var xMax=findMaxValue(theophArr.time,0); //나중에 max함수 추가해서 5단위로 잡게 만들기.
var yMax=findMaxValue(theophArr.conc,0);
var xDiff=parseInt(xMax/5);//나중에 자동으로 잡아주기.
var yDiff=parseInt(yMax/6);

function findMaxValue(Data,diff)
{
	var maxValue=Data[1];
	var returnValue;
	for(var i=2; i<Data.length; i++){
		if(Data[i]>maxValue){
			maxValue=Data[i];					
		}
		// document.write('max: ' + maxValue+' data[i]: '+Data[i]+' data[i-1]:
		// '+ Data[i-1]+'<br>');
	}
	returnValue=parseInt(maxValue+1);
	
	for(var i=0; i<diff; i++){
		returnValue=returnValue+i;
		if( ( returnValue% diff ) == 0 )
		{
			break;
		}				
	}
	
	return returnValue;
}


//for(var i=0; i<theophArr.time.length; i++){ document.write("theophArr.time("+i+") is : "+theophArr.time[i]+"<br>"); }


//////////////////////////////////////Chk key evnet Start//////////////////////////////////////   

	window.addEventListener('keydown',this.checkKeyDown,false);	
	window.addEventListener('keyup',this.checkKeyUp,false);	
	var ctrlPressed = false;
	var shiftPressed = false;
	var aPressed = false;
	var gPressed = false;
	function checkKeyDown(e) {
		//alert(e.keyCode);
		//17 || 25 = ctrl, shift = 16, a=65, g= 71
		if(e.keyCode == 17 || e.keyCode == 25){
			ctrlPressed = true;
		}
		if(e.keyCode == 16){
			shiftPressed = true;
		}
		if(e.keyCode == 65){
			aPressed = true;
		}
		if(e.keyCode == 71){
			gPressed = true;
		}
	}	
	function checkKeyUp(e) {
	//	alert(e.keyCode);
		//17 || 25 = ctrl, shift = 16
		if(ctrlPressed = true){
			ctrlPressed = false;
		}
		if(shiftPressed = true){
			shiftPressed = false;
		}
		if(aPressed = true){
			aPressed = false;
		}
		if(gPressed == true){
			gPressed = false;
		}
	}	
	/*
	function check(e) {
	var code = e.keyCode;
	switch (code) {
	case 37: alert("Left"); break; //Left key
	case 38: alert("Up"); break; //Up key
	case 39: alert("Right"); break; //Right key
	case 40: alert("Down"); break; //Down key
	default: alert(code); //Everything else
	}
	}*/


//////////////////////////////////////Chk key evnet End//////////////////////////////////////   


//////////////////////////////////////Stage Start//////////////////////////////////////
	  var stage = new Kinetic.Stage({
	    container: 'container',
	    width: 800,
	    height: 800
	  });
	  

//////////////////////////////////////Drawing Plot Start//////////////////////////////////////

var plotLayer= new Kinetic.Layer();  
var plotRect = new Kinetic.Rect({
x: plotXmargin-plotLength,
y: plotYmargin-plotLength,
width: plotWidth+2*plotLength,
height: plotHeight+2*plotLength,
//     fill: 'green',
stroke: 'black',
strokeWidth: 2
});
/*
var plotRect = new Kinetic.Line({
points: [plotXmargin-plotLength, plotYmargin-plotLength,plotXmargin-plotLength, plotYmargin+plotHeight+plotLength, plotXmargin+plotWidth+plotLength, plotYmargin+plotHeight+plotLength, plotXmargin+plotWidth+plotLength, plotYmargin-plotLength,plotXmargin-plotLength, plotYmargin-plotLength],
stroke: 'black',
strokeWidth: 2,		     
});

*/	  
plotLayer.add(plotRect);

for(var i=0; i<parseInt(xMax/xDiff)+1; i++){
var xLine = new Kinetic.Line({
points: [plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+plotLength, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+2*plotLength],
stroke: 'black',
strokeWidth: 2,		     
});
plotLayer.add(xLine);	   		
var xText = new Kinetic.Text({
x: plotXmargin+i*plotWidth/(xMax/xDiff)-10,
y: plotYmargin+plotHeight+plotLength*2,
text: i*xDiff,
fontSize: 15,
fontFamily: 'Calibri',
fill: 'black',
width: 20,
align: 'center'	
});		   
plotLayer.add(xText);			
}
for(var i=0; i<parseInt(yMax/yDiff)+1; i++){
var yLine = new Kinetic.Line({
points: [plotXmargin-plotLength, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-2*plotLength,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff)],
stroke: 'black',
strokeWidth: 2,		     
});
plotLayer.add(yLine);	   
yText = new Kinetic.Text({
x: plotXmargin-plotLength*2-15,
y: plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff)+10,
text: i*yDiff,
fontSize: 15,
fontFamily: 'Calibri',
fill: 'black',
width: 20,
align: 'center',
rotation: (Math.PI)*3/2
});		   
plotLayer.add(yText);		
}		
xLabel = new Kinetic.Text({
x: plotXmargin+plotWidth/2,
y: plotYmargin+plotHeight+4*plotLength,
text: 'Time',
fontSize: 15,
fontFamily: 'Calibri',
fill: 'black',
//      width: plotWidth*0.8,
align: 'center'
});		   
plotLayer.add(xLabel);		
yLabel = new Kinetic.Text({
x: plotXmargin-5*plotLength,
y: plotYmargin+plotHeight/2,
text: 'conc',
fontSize: 15,
fontFamily: 'Calibri',
fill: 'black',
//   width: plotHeight*0.8,
align: 'center',
rotation: (Math.PI)*3/2
});		   
plotLayer.add(yLabel);	
main = new Kinetic.Text({
x: plotXmargin+plotWidth/2-60, 
y: plotYmargin *0.5 ,
text: 'Theoph Scatter',
fontSize: 20,
fontStyle: 'bold',
fontFamily: 'Calibri',
fill: 'black',
//  width: plotWidth*0.8,
align: 'center'
});		   
plotLayer.add(main);
stage.add(plotLayer);

//////////////////////////////////////Drawing Plot End//////////////////////////////////////
  
	  
	  
	function addNode(obj, layer) {
		        var node = new Kinetic.Circle({
		          x: obj.x,
		          y: obj.y,
		          radius: 3,
		          fill: obj.color,
		          name: obj.name,
		          id: obj.id,
		          draggable: false
		        });		
		        layer.add(node);
	  }
	  // build data
	  var xScale=plotWidth/xMax;//added by us
	  var yScale=plotHeight/yMax; //added by us
	  var data = [];
	  var colors = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];
	      for(var n = 1; n < theophArr.time.length ; n++)
	      {
	        var x = theophArr.time[n]*xScale+plotXmargin;
	        var y = theophArr.conc[n]*yScale+plotYmargin;
	        var tmp=plotHeight/2+plotYmargin-y; 
	        y=y+2*tmp; //since (0,0) of canvas is top-left, so we need to change it into bottom-left.
	        data.push({
	          x: x,
	          y: y,
	          id: n,
	          name: theophArr.subject[n]+','+theophArr.wt[n]+','+theophArr.dose[n]+','+theophArr.time[n]+','+theophArr.conc[n], //does not work yet..
	          color: colors[theophArr.subject[n]-1]
	        });
	   // document.write("n is : "+n+"<br>");
	      }
	   //   document.write("theophArr.time("+i+") is : "+theophArr.time.length+"<br>");

	      

	  // render data
	  var nodeCount = 0;
	  var dataLayer= new Kinetic.Layer();
	  for(var n = 0; n < data.length; n++) 
	  {
	    addNode(data[n], dataLayer);
	    nodeCount++;
	    if(nodeCount >= 100)// IMPORTANT
	    {
	      nodeCount = 0;
	    stage.add(dataLayer);
	   //  dataLayer = new Kinetic.Layer();
	    }
	  }
	  stage.add(dataLayer);

//////////////////////////////////////Tooltip Start//////////////////////////////////////
	  var tooltipLayer = new Kinetic.Layer();
	  var tooltip = new Kinetic.Group({
	  	opacity: 0.75,
	    visible: false
	  });
	  var tooltipText = new Kinetic.Text({
		text: '',
		fontFamily: 'Calibri',
		fontSize: 18,
		padding: 5,
		fill: 'white',
		align:'center'
	  });	  
	  var tooltipRect = new Kinetic.Rect({
	    fill: 'black'
	  });
	  

	  tooltip.add(tooltipRect).add(tooltipText);
	  tooltipLayer.add(tooltip);	  
	  stage.add(tooltipLayer);
	
	  dataLayer.on('mouseover', function(){
		  document.body.style.cursor = "pointer";
		  
		  
	  });
	  
	  dataLayer.on('mouseover mousemove dragmove', function(evt){
		  
		  
		var node = evt.shape;
		// update tooltip
		var mousePos = node.getStage().getMousePosition();
		var nameArr = new Array();
		nameArr = node.getName().split(',');		
		
		tooltip.setPosition(mousePos.x + 8, mousePos.y + 8);
		tooltipText.setText("node: " + node.getId() +"\r\n"+"Subject: " + nameArr[0] +"\r\n"+ "Wt: " + nameArr[1] + "\r\n"+"Does: " + nameArr[2] +"\r\n"+ "Time: " + nameArr[3] + "\r\n"+"conc: " + nameArr[4] +"\r\n"+ "color: " + node.getFill()); //naem split?
		tooltipRect.setAttrs({
	    	width: tooltipText.getWidth(),
	    	height: tooltipText.getHeight()
	    });
	    tooltip.show();
	    tooltipLayer.draw();
	    

		  var shapes = stage.get('#'+node.getId());
		  shapes.apply('transitionTo', {
	          scale: {
	            x:  1.5,
	            y:  1.5
	          },
	          duration: 1,
	          easing: 'elastic-ease-out'
	        });
		  
	    
	  }); 
	
	  dataLayer.on('mouseout', function(evt) {
		  var node = evt.shape;
		  document.body.style.cursor = "default";
		  
		    tooltip.hide();
		    tooltipLayer.draw();
		    
		    var shapes = stage.get('#'+node.getId());
			  shapes.apply('transitionTo', {
		          scale: {
		            x:  1,
		            y:  1
		          },
		          duration: 1,
		          easing: 'elastic-ease-out'
		        });
	  });	  
//////////////////////////////////////Tooltip End//////////////////////////////////////
 
//////////////////////////////////////Selection Start//////////////////////////////////////

	  var selectLayer = new Kinetic.Layer();

	  var selectedList = new LinkedList(); 
	  
	  
	  function addNodeSelect(obj, layer) {
	        var node = new Kinetic.Circle({
	          x: obj.x,
	          y: obj.y,
	          radius: 8,
	          stroke: 'red',
	          fillEnabled: false,
	          opacity: 0.8,
	          draggable: true
	        });		
	        layer.add(node);
	  }
	 
	  function inRange(node){
		  
		  var returnValue=false;
		  if(selectedList._length ==0 ){
			  returnValue=true;
		  }else{
			  for(var i=0; i< selectedList._length; i++)
			  {
				  if(node.getId()==selectedList.item(i).nodeId){
					  returnValue=false;
					  break;
				  }else{
					  returnValue=true;
				  }
			  }			  
		  }	  
		  return returnValue;
	  }
		document.write("data length is : "+data.length+"<br>");		  

		
		
		plotLayer.on('click', function(evt){  
			  var node = evt.shape;
			  
			  //document.write("data length is : "+data.length+"<br>");		  
		//	  selectLayer.remove();
			  for(var i=0; i<selectedList._length; i++){//remove all linkedList 
			  	  selectedList.remove(i);
			  }
			  selectLayer.destroy();
		//	  selectLayer.show();				
			  
		});
		
		
		
		
		
	  dataLayer.on('click', function(evt){  
		  var node = evt.shape;
		  var mousePos = {x: node.getX(), y:node.getY()};
		  var selectedListLengthChk = selectedList._length >=0 && selectedList._length < theophArr.subject.length;
		  var nameArr = new Array();
		  nameArr = node.getName().split(',');		
		  
		  if( inRange(node) && selectedListLengthChk){
			 
			  if(aPressed){ //select ALL
				  for(var i=0; i<selectedList._length; i++){//remove all linkedList 
				  	  selectedList.remove(i);
				  }
				  for(var i=0; i<data.length; i++){
							  var tmpMousePos = {x: data[i].x, y: data[i].y}
							  addNodeSelect(tmpMousePos, selectLayer);		
							  stage.add(selectLayer);
							  selectedList.add({x : tmpMousePos.x, y: tmpMousePos.y, nodeId: data[i].id, nodeName: data[i].name, id: selectedList._length });   	
				  }
				  
			  }else if(ctrlPressed){ //select mutiple node one by one.
				  addNodeSelect(mousePos, selectLayer);		
				  stage.add(selectLayer);
				 //selectLayer.moveToBottom();
				  //plotLayer.moveToBottom();
				  selectedList.add({x : mousePos.x, y: mousePos.y, nodeId: node.getId(), nodeName: node.getName(),  id: selectedList._length });   
				  
			  }else if(gPressed){ //select by Group, (select every node whose subject is the same)
					 
				  /*
				  for(var i=0; i<selectedList._length; i++){
					  
					  var tmpNodeNameArr = new Array();
					  tmpNodeNameArr = selectedList.item(i).nodeName.split(',');		
					  for(var j=0; j<data.length; j++){
						  var tmpNameArr = new Array();
						  tmpNameArr = data[i].name.split(',');		
						  if(nameArr[0]==tmpNodeNameArr[0]){
							  selectedList.remove(i);

							  
						  }
					  }
				  }*/
				  
				  
				  for(var i=0; i<data.length; i++){
					  var preSelected=false;
					  var tmpNameArr = new Array();
					  tmpNameArr = data[i].name.split(',');		
			//		document.write("datalength is : "+data.length+"<br>");							  
			/*		  for(var j=0; j<selectedList._length; j++)
					  {
						  var tmpNodeNameArr = new Array();
						  tmpNodeNameArr = selectedList.item(j).nodeName.split(',');
											
						  if(tmpNameArr[0] == tmpNodeNameArr[0]){
							  var preSelected=true;
						  }						  
					  }
			*/		  
					if( nameArr[0] == tmpNameArr[0] && !preSelected )
					{						  
						  var tmpMousePos = {x: data[i].x, y: data[i].y}
						  addNodeSelect(tmpMousePos, selectLayer);		
						  stage.add(selectLayer);
						  
							 //selectLayer.moveToBottom();
							  //plotLayer.moveToBottom();
						  selectedList.add({x : tmpMousePos.x, y: tmpMousePos.y, nodeId: data[i].id, nodeName: data[i].name,  id: selectedList._length });   	  			  						  
					}
				  }
			  }else{//select another one and remove other nodes.
			 
				  for(var i=0; i<selectedList._length; i++){//remove all linkedList 
				  	  selectedList.remove(i);
				  }
				  selectLayer.destroy();
				  
				  addNodeSelect(mousePos, selectLayer);		
				  stage.add(selectLayer);
				 //selectLayer.moveToBottom();
				  //plotLayer.moveToBottom();
				  selectedList.add({x : mousePos.x, y: mousePos.y, nodeId: node.getId(), nodeName: node.getName(),  id: selectedList._length });   		  
			  }
			  
		  }
		  

		  var shapes = stage.get('#'+node.getId());
		  shapes.apply('transitionTo', {
	          scale: {
	            x:  2,
	            y:  2
	          },
	          duration: 1,
	          easing: 'elastic-ease-out'
	        });
	  });
	  selectLayer.on('mouseover', function(){
		  document.body.style.cursor = "pointer";
	  });
	  selectLayer.on('mouseout', function(){
		  document.body.style.cursor = "default";
	  });	  
	  selectLayer.on('click', function(evt){
		  var node = evt.shape;
		  var mousePos = {x: node.getX(), y:node.getY()};
	//	  var selectedListLength = selectedList._length >=0 && selectedList._length < theophArr.subject.length;
	//	  document.write("selectLayer.id is : "+mousePos.x+" "+mousePos.y+"<br>");		  
		  if(ctrlPressed){
			  for(var i=0; i<selectedList._length; i++){
				  if(mousePos.x==selectedList.item(i).x && mousePos.y==selectedList.item(i).y){
					  selectedList.remove(i);
				  }
			  }
			  
			  node.hide();			  
			  selectLayer.draw();
			  node.destroy();
		  }else{
			  
			  for(var i=0; i<selectedList._length; i++){//remove all linkedList 
			  	  selectedList.remove(i);
			  }
			  selectLayer.destroy();
			  
			  addNodeSelect(mousePos, selectLayer);		
			  stage.add(selectLayer);
			 //selectLayer.moveToBottom();
			  //plotLayer.moveToBottom();
			  selectedList.add({x : mousePos.x, y: mousePos.y, nodeId: node.getId(), nodeName: node.getName(),  id: selectedList._length });   		
			  
		  }
		  
		  
		 /* 
		  else if(찍혀였으면 ){
			  
			  //deselect(node,...)
		  }		  
		  */
		  
	  });
	  
	  
	  
//////////////////////////////////////Selection End//////////////////////////////////////

//////////////////////////////////////Legend Start//////////////////////////////////////
	var legendLayer = new Kinetic.Layer({draggable:true});
	
	function addNodeLegend(obj, layer) {
		var node = new Kinetic.Circle({
			x: obj.x,
			y: obj.y,
			radius: 3,
			fill: obj.color,
			id: obj.id
		});		
		layer.add(node);
		//     return node;
	}
	
	var legendText = new Kinetic.Text({
		text: '',
		fontFamily: 'Calibri',
		fontSize: 13,
		padding: 5,
		fill: 'black',
		align:'center'
	});
	
	var legendRect= new Kinetic.Rect({
		stroke: 'black',
		fill: 'white'
	});
	
	function drawLegend(Location, Data){
		var tmpText='';	 
		
		for( var i = 1 ; i < Data.length; i++)
		{	
			if(i==1 ||  ( (i!=1) && (Data[i] != Data[i-1]) ) )  //subject 체크 한 후에 같은 거면 index추가 안함.		
			{		
				tmpText=tmpText + '     '+ Data[i] +"\r\n";
			}
		}
		
		if (Location == 'topright' || Location == undefined)	{
			x = plotXmargin+plotWidth-27;
			y = plotYmargin-plotLength;
		}else if(Location == 'topleft'){
			x = plotXmargin-plotLength;
			y = plotYmargin-plotLength;
		}else if(Location == 'bottomright'){
			x = plotXmargin+plotWidth-27;
			y = plotYmargin+plotHeight-tmpText.length*1.53; //check later
		}else if(Location == 'bottomleft'){
			x = plotXmargin-plotLength;
			y = plotYmargin+plotHeight-tmpText.length*1.53;//check later
		}else{						// default is topright
			x = plotXmargin+plotWidth-27;
			y = plotYmargin-plotLength;
			}
		
		return {
			'x': x,
			'y': y,
			'text': tmpText
		};
	}
	var myLegend= drawLegend("topright",theophArr.subject);
	
	legendRect.setPosition(myLegend.x, myLegend.y);
	legendText.setPosition(myLegend.x, myLegend.y);
	legendText.setText(myLegend.text); 
	legendRect.setAttrs({
		width: legendText.getWidth(),
		height: legendText.getHeight()
	});
	legendLayer.add(legendRect);
	legendLayer.add(legendText);
	
	var legendData = [];
	var colors = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];
	
	for(var n = 1; n < theophArr.subject.length ; n++)
	{
		if(n==1 ||  ( (n!=1) && (theophArr.subject[n] != theophArr.subject[n-1]) ) ) {
			var x = myLegend.x+10;
			var y = myLegend.y+plotLength+1.18*n-5;
			
			legendData.push({
				x: x,
				y: y,
				id: n,
				color: colors[theophArr.subject[n]-1]
			});
		}
	}
	for(var n = 0; n < legendData.length; n++) 
	{
		addNodeLegend(legendData[n], legendLayer);	
	}
	stage.add(legendLayer);
//////////////////////////////////////Legend End//////////////////////////////////////



	   
	   
//////////////////////////////////////Chk Start//////////////////////////////////////   
	var chkLayer= new Kinetic.Layer();  
	chkMsg = new Kinetic.Text({
        x: 30,
        y: 30,
        text: 'View selectedList',
        fontSize: 15,
        fontFamily: 'Calibri',
        fill: 'black',
        align: 'center'
      });		   
	chkLayer.add(chkMsg);
	stage.add(chkLayer);
	chkLayer.on('mouseover', function(evt){
		document.body.style.cursor = "pointer";
	});
	chkLayer.on('mouseout', function(evt){
		document.body.style.cursor = "default";
	 });
	chkLayer.on('click', function(evt){
	//	  var node = evt.shape;
	//  var mousePos = {x: node.getX(), y:node.getY()};
		for(var i=0; selectedList._length; i++){
			  document.write("selectedList("+i+").x is : "+selectedList.item(i).x+"<br>");
			  document.write("selectedList("+i+").y is : "+selectedList.item(i).y+"<br>");		  
			  document.write("selectedList("+i+").nodeId is : "+selectedList.item(i).nodeId+"<br>");		  

			  document.write("selectedList("+i+").nodeName is : "+selectedList.item(i).nodeName+"<br>");		
			  document.write("selectedList("+i+").id is : "+selectedList.item(i).id+"<br>");		  
		  }
	 });
	   
//////////////////////////////////////Chk End//////////////////////////////////////   
	
	