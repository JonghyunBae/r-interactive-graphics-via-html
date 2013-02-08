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


	  var stage = new Kinetic.Stage({
	    container: 'container',
	    width: 800,
	    height: 800
	  });

	function addNode(obj, layer) {
		        var node = new Kinetic.Circle({
		          x: obj.x,
		          y: obj.y,
		          radius: 4,
		          fill: obj.color,
		          name: obj.name,
		          id: obj.id,
		          draggable: true
		        });		
		        layer.add(node);
	  }

	///////////////////////////Legend Layer Start///////////////////////////////
	  var legendLayer = new Kinetic.Layer({draggable:true});
	  
	function addNodeLegend(obj, layer) {
		        var node = new Kinetic.Circle({
		          x: obj.x,
		          y: obj.y,
		          radius: 4,
		          fill: obj.color,
		          id: obj.id
		        });		
		        legendLayer.add(node);
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
		        var y = myLegend.y+plotLength+1.3*n-5;
		 
		        legendData.push({
		          x: x,
		          y: y,
		          id: n,
		          color: colors[theophArr.subject[n]]
		        });
		     }
	      }
	    var layer = new Kinetic.Layer();
	    for(var n = 0; n < legendData.length; n++) 
		  {
	    	addNodeLegend(legendData[n], layer);
		  
		  }
		  stage.add(legendLayer);
///////////////////////////Legend Layer End///////////////////////////////   
	
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
	  
	  // build data
	  var xCanvasWidth = plotXmargin;//added by us
	  var yCanvasHeight = stage.height-plotYmargin-plotHeight; //added by us
	  var xScale=plotWidth/xMax;//added by us
	  var yScale=plotHeight/yMax; //added by us
	  
	  //a=(theophArr.time[n]*xScale+xCanvasWidth-plotYmargin);
	  
	  var data = [];
	 // var width = stage.getWidth();
	  //var height = stage.getHeight();
	  var colors = ['Green', 'Silver', 'Lime', 'Gray', 'Olive', 'Yellow','Maroon','Navy' ,'Red','Blue' ,'Purple','Teal'];
	      for(var n = 1; n < theophArr.time.length ; n++)
	      {
	        var x = theophArr.time[n]*xScale+xCanvasWidth;
	        var y = theophArr.conc[n]*yScale+plotYmargin;
	        var tmp=plotHeight/2+plotYmargin-y; 
	       y=y+2*tmp; //since (0,0) of canvas is top-left, so we need to change it into bottom-left.
	        data.push({
	          x: x,
	          y: y,
	          id: n,
	          name: theophArr.subject[n]+','+theophArr.wt[n]+','+theophArr.dose[n]+','+theophArr.time[n]+','+theophArr.conc[n], //does not work yet..
	       //   'Subject : ' + theophArr.subject[search_result.x] + "<br>" + 'Wt : ' + theophArr.wt[search_result.x] + "<br>" + 'Dose : ' + theophArr.dose[search_result.x] + "<br>" + 'Conc : ' + theophArr.conc[search_result.x] + "<br>" + 'Time : ' + theophArr.time[search_result.x], 'lightyellow'
	          
	          color: colors[theophArr.subject[n]]
	        });
	  //      document.write("n is : "+n+"<br>");

	      }
	   //   document.write("theophArr.time("+i+") is : "+theophArr.time.length+"<br>");

	  // render data
	  var nodeCount = 0;
	  var layer = new Kinetic.Layer();
	  for(var n = 0; n < data.length; n++) 
	  {
	    addNode(data[n], layer);
	    nodeCount++;
	    if(nodeCount >= 100)// IMPORTANT
	    {
	      nodeCount = 0;
	      stage.add(layer);
	      layer = new Kinetic.Layer();
	    }
	  }
	
	  stage.add(tooltipLayer);
	
	  stage.on('mouseover mousemove dragmove', function(evt){
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
	  }); 
	
	  stage.on('mouseout', function(evt) {
	    tooltip.hide();
	    tooltipLayer.draw();
	  });
	 
	  
	  var layer = new Kinetic.Layer();
	      // dashed line
	  /*
	   var rect = new Kinetic.Rect({
	        x: plotXmargin-plotLength,
	        y: plotYmargin-plotLength,
	        width: plotWidth+2*plotLength,
	        height: plotHeight+2*plotLength,
	   //     fill: 'green',
	        stroke: 'black',
	        strokeWidth: 2
	      });
		*/
	   var rect = new Kinetic.Line({
		   points: [plotXmargin-plotLength, plotYmargin-plotLength,plotXmargin-plotLength, plotYmargin+plotHeight+plotLength, plotXmargin+plotWidth+plotLength, plotYmargin+plotHeight+plotLength, plotXmargin+plotWidth+plotLength, plotYmargin-plotLength,plotXmargin-plotLength, plotYmargin-plotLength],
	        stroke: 'black',
	        strokeWidth: 2,		     
	      });
	  
	     layer.add(rect);
	  
		
		for(var i=0; i<parseInt(xMax/xDiff)+1; i++){
			var xLine = new Kinetic.Line({
		        points: [plotXmargin+i*plotWidth/(xMax/xDiff) ,plotYmargin+plotHeight+plotLength, plotXmargin+i*plotWidth/(xMax/xDiff),plotYmargin+plotHeight+2*plotLength],
		        stroke: 'black',
		        strokeWidth: 2,		     
		      });
			layer.add(xLine);	   		
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
		   layer.add(xText);			
		}
		for(var i=0; i<parseInt(yMax/yDiff)+1; i++){
			var yLine = new Kinetic.Line({
		        points: [plotXmargin-plotLength, plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff) , plotXmargin-2*plotLength,plotYmargin+plotHeight-i*plotHeight/(yMax/yDiff)],
		        stroke: 'black',
		        strokeWidth: 2,		     
		      });
			layer.add(yLine);	   
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
		   layer.add(yText);		
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
	   layer.add(xLabel);		
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
	   layer.add(yLabel);	
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
	   layer.add(main);
	   stage.add(layer);
