var Box = {};    

(function() {    
    
    Box = function(mainArr, optionObj) {
        this._initScatter(optionObj);        
        this._type = 'box';
        
        
    };
    Box.prototype = {
            
            _initScatter: function(optionObj){
                
            
                    
                ////////// Make essential variables ////////                
                this.width = optionObj.width || plotWidth; //plot width
                this.height = optionObj.height || plotHeight; //plot height
                this.plotXMargin=this.width*0.2; //canvas left, right margin
                this.plotYMargin=this.height*0.2; //canvas top, bottom margin
                this.plotLength= (optionObj.plotLength==undefined)?(this.width*0.02):(optionObj.plotLength); //margin from plot box
                this.radius= (optionObj.radius==undefined)?(3):(optionObj.radius); //default radius is 3
                
                for(var i = 0 ; i < labelArr.length ; i ++)
                {
                    if(labelArr[i].toLowerCase()==optionObj.x.toLowerCase()){                        
                         this.x =  i;
                         break;
                    }
                    if(i==labelArr.length-1){
                        alert('retype x label');
                    }
                }
                for(var i = 0 ; i < labelArr.length ; i ++)
                {
                    if(labelArr[i].toLowerCase()==optionObj.y.toLowerCase()){                        
                         this.y =  i;
                         break;
                    }
                    if(i==labelArr.length-1){
                        alert('retype y label');
                    }
                }
                

                var nodeX = new Array(mainArr[this.x].length);
                this.xTick= (optionObj.xTick==undefined)?(5    ):(optionObj.xTick);
                var xTmp = boxMakeAxisArr(this.width, this.x, this.xTick); // node가 찍혀야할 nodeX array에 저장. x좌표가 찍혀야할 좌표 위치와 이름이 xPlotArr에 저장된다. 
                nodeX = xTmp.node;
                this.xPlotArr = xTmp.plotArr;
                
                var nodeY = new Array(mainArr[this.y].length);
                this.yTick= (optionObj.yTick==undefined)?(5):(optionObj.yTick); //default y ticks is 5                 
                var yTmp = boxMakeAxisArr(this.height, this.y, this.yTick);                
                nodeY = yTmp.node;
                this.yPlotArr = yTmp.plotArr;
            
                
                
                var xMainValueArr = new Array(); //mainValueArr>>> name change to 
                var indexArr = new Array();
                var cnt=0;
                var sortedXMainArr = new Array();                    
                for(var i=0; i<mainArr[this.x].length; i++){        
                    sortedXMainArr[i] = {
                            a : mainArr[this.x][i],
                            b : i
                    };        
                }     
                var stableSort = function(a,b) { //stable sort is needed because Chrome does not support stable sort.
                    if (a.a === b.a) return a.stableSortKey > b.stableSortKey ? 1 : -1; 
                    if (a.a > b.a) return 1;
                    return -1;
                };
                for (i = 0; i < sortedXMainArr.length; i++) {                     
                    sortedXMainArr[i].stableSortKey = i;                           
                }       
                sortedXMainArr.sort(stableSort); //sort stably colorArr (temporarily saved in sortedColorArr)

                 for(var i=0; i<sortedXMainArr.length; i++){        
                    if(i==0){
                        xMainValueArr[cnt]=sortedXMainArr[0].a;
                        indexArr[0]=0;
                      
                    }else{
                        if(sortedXMainArr[i].a==sortedXMainArr[i-1].a){
                            
                            indexArr[i]=cnt;
                        }else{
                            cnt++;
                            xMainValueArr[cnt]=sortedXMainArr[i].a;
                            indexArr[i]=cnt;
                        }
                    }
                }
                 var reindexArr = new Array(); // re assign
                for(var i=0; i<sortedXMainArr.length; i++){        // re assign
                    reindexArr[sortedXMainArr[i].b]=indexArr[ i ]; 
                }
                for(var i=0; i<sortedXMainArr.length; i++){        //re re assign
                    indexArr[i]=reindexArr[i];    
                }
 
            //    for(var i=0; i<sortedXMainArr.length; i++){        //re re assign
            //        document.write(sortedXMainArr[i].a+','+sortedXMainArr[i].b, '<br />');
            //    }                
            //    document.write(xMainValueArr, '<br />');
                
                
                var boxHasArr = make2DArr(xMainValueArr.length);
                
                var j=0;
                boxHasArr[0][0] = sortedXMainArr[0].b;
            //    boxHasArr[0][1] = sortedXMainArr[1].b;
                for(var i=1; i<sortedXMainArr.length; i++){
                    //for(var j=0; j<xMainValueArr.length; j++){
                    //    if(sortedXMainArr[i].a == xMainValueArr[j]){
                    if(sortedXMainArr[i].a != sortedXMainArr[i-1].a){
                        j++;
                    }
                //    alert(boxHasArr);
                    
                    boxHasArr[j].push(sortedXMainArr[i].b);
                //            alert(boxHasArr[0]);
                    //    }
                //    }
                }
                for(var i=0; i<xMainValueArr.length; i++){
          //          document.write(boxHasArr[i], '<br />');
                }
                
                this.boxWidth = (optionObj.plotLength==undefined)?(this.width/xMainValueArr.length*0.7):(optionObj.plotLength); 
/*
                function findQuartile(_th, Data, index)//_th =1, return Q1
                { 
                    var x = new Array();
                    var j=0;
                    for(var i=0; i<Data.length; i++)
                    {    
                        if(i==index[j] )
                        {   
                            x.push(Data[i]);
                            j++;
                        }
                    }
                */
                //boxHasArr has node number, valueOfHasArr has node value itself
                var valueOfHasArr = make2DArr(boxHasArr.length);
                for(var k=0; k<boxHasArr.length; k++){
                     var j=0;
                     
                     for(var i=0; i<mainArr[this.y].length; i++)
                     {    
                         if(i==boxHasArr[k][j] )
                         {   
                             valueOfHasArr[k].push(mainArr[this.y][i]);
                             j++;
                         }
                     }
                     valueOfHasArr[k].sort(function (a, b){ return (a-b);});                
                }
            //    for(var k=0; k<boxHasArr.length; k++){
                       //       document.write(valueOfHasArr[ k ], '<br />');
            //    }
                
                var max = new Array();
                var min = new Array();
                var median = new Array();
                var q3 = new Array();
                var q1 = new Array();
                var iqr = new Array();
                var maxBelowFence = new Array();
                var minAboveFence = new Array();
                var maxOutliersArr = new Array();
                var minOutliersArr = new Array();
                var outliersArr = new Array();
                
                for(var i=0; i<xMainValueArr.length; i++){
                    max[i] = findMaxValue(valueOfHasArr[i]);
                    min[i] = findMinValue(valueOfHasArr[i]);
                    q3[i] = findQuartile(valueOfHasArr[i], 3);
                    median[i] = findQuartile(valueOfHasArr[i], 2);
                    q1[i] = findQuartile(valueOfHasArr[i], 1);
                    iqr[i] = q3[i] - q1[i];
                    var tmpFindMaxBelowFence = findMaxBelowFence(mainArr[this.y], boxHasArr[i], q1[i], q3[i]);
                    var tmpFindMinAboveFence = findMinAboveFence(mainArr[this.y], boxHasArr[i], q1[i], q3[i]);
                    maxBelowFence[i] = tmpFindMaxBelowFence.max;
                    minAboveFence[i] = tmpFindMinAboveFence.min;
                    maxOutliersArr[i] = tmpFindMaxBelowFence.outliers;
                    minOutliersArr[i] = tmpFindMinAboveFence.outliers;
               //     document.write('<br>'+' ,valueOfHasArr : '+valueOfHasArr[i]);
               //     document.write('<br>'+' ,max : '+max[i]+' ,min : '+min[i]+' ,q3 : '+q3[i]+' ,median : '+median[i]+' ,q1 : '+q1[i] +' ,iqr : '+iqr[i] +' ,maxBF : '+maxBelowFence[i]+' ,minAF : '+minAboveFence[i], '<br />');
                    outliersArr[i] = maxOutliersArr[i].concat(minOutliersArr[i]);
                  //   document.write('<br>','<br>','i : '+outliersArr[i],'<br>','<br>' );
                }
             //   document.write('<br>',maxOutliersArr[0],'<br>' );
           //    document.write('<br>',minOutliersArr[0],'<br>' );
            //    document.write('<br>',outliersArr,'<br>' );
                /*
                var tmpMainArr = mainArr[this.y];
                
                tmpMainArr.sort();
                
              //  alert(tmpMainArr);
                
                for(var i = 0; i < this.xPlotArr.length ; i++) //for discontinuous data, this.xPlotArr.length is used, for continuous data, it should be just 1.
                {
                    this.median[i] = getMedianValue(tmpMainArr);
                }*/
                
             // 요소 개수가 1개뿐인 배열은 이렇게 지정해야 합니다
             // 다음은, 100 이라는 숫자 하나만 들어 있는 배열 정의
        //     a = new Array();
      //       a[0] = 100;
      //       a[1]= 20;
       //      a.sort();
        //     document.write(findMedianValue(a), '<br />');
             // 출력 결과: 100




            var tooltipTextGetInfo = new Array();
			for(var i = 0; i < mainArr[this.x].length ; i++)
			{
				tooltipTextGetInfo[i]=labelArr[0]+" : " + mainArr[0][i]+ "\r\n" ;
				for(var j=1; j< labelArr.length ; j++){
					tooltipTextGetInfo[i]=tooltipTextGetInfo[i]+ labelArr[j]+" : " + mainArr[j][i]+ "\r\n" ;
				}
			}				   
                
                //////////Make Data Structure of nodes and essential arrays////////
               
            this.node = new Array();
            this.outlierNode = new Array();
            var yMax = findMaxValue(mainArr[this.y]);
            var yMin = findMinValue(mainArr[this.y]);
            var tickRange = (yMax-yMin )/this.yTick;                
            var tmp = Math.ceil( Math.log(tickRange) / Math.log(10));
            tickRange = setTickRange(tmp, tickRange);
            yMax = tickRange * Math.ceil(yMax/tickRange);              
            yMin = tickRange * Math.floor(yMin/tickRange);
         //   alert(xMainValueArr.length);
            
                    //if(this.color==-1 ){
            var cnt=0;
            var medianXPos =0;
            var medianYpos =0;
            for(var i = 0; i < xMainValueArr.length ; i++) //for discontinuous data, this.xPlotArr.length is used, for continuous data, it should be just 1.
            {
                medianXPos = this.plotXMargin + (i+1) * (this.width) / (xMainValueArr.length+1);
                medianYPos = this.height +this.plotYMargin - (median[i]-yMin)*this.height/(yMax - yMin); 
                
                this.node[i] = new Kinetic.Rect({
                    //id: i,
                    name : i,
                    x: medianXPos, //////////////////////////////////???????????????????????????
                    y: medianYPos-(q3[i]-median[i])*this.height/(yMax - yMin), //this.median[i],
                    stroke : 'black',
                    fill : 'green',
                    radius : this.radius,
                    width:  this.boxWidth,
                    height: (q3[i]-q1[i])*this.height/(yMax - yMin),
                //    strokeWidth : 0.01,
                    opacity : 0.7,
                    offset : {x: this.boxWidth/2},
                //    draggable : false,
                    hidden : 0,
                    selected : 0,
                    info :  "Node : "+i+"\r\n"+"Frequency : "+boxHasArr[i].length,
                    hasArr : boxHasArr[i]
                });       
                this.node[i+xMainValueArr.length]= new Kinetic.Line({
                    name : i,
                    x: medianXPos,
                    y: medianYPos,
                    points: [0, 0, this.boxWidth, 0],
                    opacity : 0.7,
                    offset : {x: this.boxWidth/2},
                    stroke: 'black',
                    info: "Node : "+i+"\r\n"+"Frequency : "+boxHasArr[i].length,
                    strokeWidth: '4',
                });        
                this.node[i+2*xMainValueArr.length]= new Kinetic.Line({
                    name : i,
                    x: medianXPos,
                //    y: medianYPos,
                    points: [    0, this.height +this.plotYMargin -(maxBelowFence[i]-yMin)*this.height/(yMax - yMin),
                                 0, this.height +this.plotYMargin -(q3[i]-yMin)*this.height/(yMax - yMin)],
                    opacity : 0.7,
                    info: "Node : "+i+"\r\n"+"Frequency : "+boxHasArr[i].length,
                    stroke: 'black'
                });    
                this.node[i+3*xMainValueArr.length]= new Kinetic.Line({
                    name : i,
                    x: medianXPos,
                //    y: medianYPos,
                    points: [    0, this.height +this.plotYMargin -(q1[i]-yMin)*this.height/(yMax - yMin),
                                 0, this.height +this.plotYMargin -(minAboveFence[i]-yMin)*this.height/(yMax - yMin)],
                    opacity : 0.7,
                    info: "Node : "+i+"/r/n"+"Frequency : "+boxHasArr[i].length,
                    stroke: 'black'
                });    
                
                for(var j = 0; j < outliersArr[i].length ; j++) //for discontinuous data, this.xPlotArr.length is used, for continuous data, it should be just 1.
                {
                    this.node[4*xMainValueArr.length+j+cnt] = new Kinetic.Circle({
                        name : 4*xMainValueArr.length+j+cnt,
                        x: this.plotXMargin + (i+1) * (this.width) / (xMainValueArr.length+1), //////////////////////////////////???????????????????????????
                        y: this.height +this.plotYMargin - (mainArr[this.y][outliersArr[i][j]]-yMin)*this.height/(yMax - yMin), //this.median[i],
                        fill : 'green',
                        radius : this.radius,
                        hidden : 0,
                        selected : 0,
                        opacity : 0.7,
                        info : "Node : "+(xMainValueArr.length+j+cnt)+"\r\n"+tooltipTextGetInfo[outliersArr[i][j]],
                    });                    
                }
                cnt=cnt+outliersArr[i].length;
            }    
    
            this.boxRect = new Array();
            this.boxVerticalLine = new Array();
            this.boxHorizontalLine = new Array();
            for(var i = 0; i < xMainValueArr.length ; i++) //for discontinuous data, this.xPlotArr.length is used, for continuous data, it should be just 1.
            {
                this.boxVerticalLine[i]= new Kinetic.Line({
                    y: -(maxBelowFence[i]-median[i])*this.height/(yMax - yMin),
                    points: [    0, minAboveFence[i]*this.height/(yMax - yMin),
                                 0, maxBelowFence[i]*this.height/(yMax - yMin)],
                    stroke: 'green'
                });    
                this.boxRect[i]= new Kinetic.Rect({
                    x:-this.boxWidth/2,
                    y:-(q3[i]-median[i])*this.height/(yMax - yMin),
                    width:  this.boxWidth,
                    height: (q3[i]-q1[i])*this.height/(yMax - yMin),
                    stroke: 'green',
                    fill : 'yellowgreen'
                });                        
                this.boxHorizontalLine[i]= new Kinetic.Line({
                    x: -this.boxWidth/2,
                    points: [0, 0, this.boxWidth, 0],
                    stroke: 'green',
                    strokeWidth: '4',
                });    
            }
            for(var i = 0; i < xMainValueArr.length ; i++) //for discontinuous data, this.xPlotArr.length is used, for continuous data, it should be just 1.
            {
            //    this.node[i].add(this.boxVerticalLine[i]);
            //    this.node[i].add(this.boxRect[i]);
            //    this.node[i].add(this.boxHorizontalLine[i]);
            }
    //        alert(this.node[6].getName());
        //    alert(    this.group1[0].getName());
        //    alert(this.node[1].getHasArr());
                /*    }else{
                        for(var i = 0; i < mainArr[this.x].length ; i++)
                        {
                            this.node[i] = new Kinetic.Circle({
                                //id: i,
                                name : i,
                                x: nodeX[i] + this.plotXMargin,
                                y: this.height +this.plotYMargin - nodeY[i],
                                radius: this.radius,
                                fill: getColor(i,colors, mainValueArr, tmpColorArr),
                            //    stroke : 'black',
                            //    strokeWidth : 0.01,
                            //    opacity : 0.7,
                            //    draggable : false,
                                hidden : 0,
                                selected : 0,
                                info :  "Node : "+i+"\r\n"+tooltipTextGetInfo[i]
                            });                            
                        }
                    }*/
                
            },
            doIt: function() { 
                alert('do it'); 
            },
            draw: function(id){    
                //draw plot
                this.stage = new Kinetic.Stage({            
                    container: 'boxContainer'+id,            
                    width: this.width+this.plotXMargin*2,
                    height: this.height+this.plotYMargin*2 
                });
                this.plotLayer = new Kinetic.Layer();
                this.plotRect = new Kinetic.Rect({
                    name : "baseRect",
                    x: this.plotXMargin-this.plotLength,
                    y: this.plotYMargin-this.plotLength,
                    width: this.width+2*this.plotLength,
                    height: this.height+2*this.plotLength,
                    stroke: 'black',
                    strokeWidth: 2
                });       
                this.plotLayer.add(this.plotRect);   
                this.xLine = new Array();
                this.xText = new Array();
                for(var i=0; i<this.xPlotArr.length; i++)
                {
                    this.xLine[i] = new Kinetic.Line({
                        name : "xLine"+i,
                        points: [    this.plotXMargin+this.xPlotArr[i][0],
                                     this.plotYMargin+this.height+this.plotLength,
                                     this.plotXMargin+this.xPlotArr[i][0],
                                     this.plotYMargin+this.height+2*this.plotLength],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
                    this.plotLayer.add(this.xLine[i]);               
                    this.xText[i] = new Kinetic.Text({
                        name : "xText"+i,
                        x: this.plotXMargin+this.xPlotArr[i][0]-30,
                        y: this.plotYMargin+this.height+this.plotLength*2,
                        text: this.xPlotArr[i][1],
                        fontSize: 15,
                        fontFamily: 'Calibri',
                        fill: 'black',
                        width: 60,
                        align: 'center'    
                    });          
                    this.plotLayer.add(this.xText[i]);            
                } 
                this.yLine = new Array();
                this.yText = new Array();
               
                for(var i=0; i< this.yPlotArr.length ; i++)
                {
                    this.yLine[i] = new Kinetic.Line({
                        points: [    this.plotXMargin-this.plotLength, 
                                     this.plotYMargin+this.height-this.yPlotArr[i][0], 
                                     this.plotXMargin-2*this.plotLength,
                                     this.plotYMargin+this.height-this.yPlotArr[i][0]],
                        stroke: 'black',
                        strokeWidth: 2,             
                    });
                    this.plotLayer.add(this.yLine[i]);       
                    this.yText[i] = new Kinetic.Text({
                        x: this.plotXMargin-this.plotLength*2-15,
                        y: this.plotYMargin+this.height-this.yPlotArr[i][0]+30,
                        text: this.yPlotArr[i][1],
                        fontSize: 15,
                        fontFamily: 'Calibri',
                        fill: 'black',
                        width: 60,
                        align: 'center',
                        rotation: (Math.PI)*3/2
                    });           
                    this.plotLayer.add(this.yText[i]);        
                }    
                this.xLabel = new Kinetic.Text({
                    name : 'xLabel',
                    x: this.plotXMargin+this.width/2,
                    y: this.plotYMargin+this.height+5*this.plotLength,
                    offset : {x: labelArr[this.x].length/2 * 10, y:0},
                    text: labelArr[this.x],
                    fontSize: 15,
                    fontStyle: 'bold',
                    fontFamily: 'Calibri',
                    fill: 'black',
                });                                   
                this.plotLayer.add(this.xLabel);
                this.yLabel = new Kinetic.Text({
                    x: this.plotXMargin-this.plotLength - 40,
                    y: this.plotYMargin+this.height/2  - 15,
                    offset : {x: labelArr[this.y].length/2 * 10},
                    text: labelArr[this.y],
                    fontSize: 15,
                    fontStyle: 'bold',
                    fontFamily: 'Calibri',
                    fill: 'black',
                    rotation: (Math.PI)*3/2
                });    
                this.plotLayer.add(this.yLabel);    
                this.mainLabel = new Kinetic.Text({
                    name : 'mainLabel',
                    x: this.plotXMargin+this.width/2, 
                    y: this.plotYMargin *0.3 ,
                    offset : {x: ('Box-and-Whisker of ' + labelArr[this.x] + ' & ' + labelArr[this.y]).length/2 * 10, y:0},
                    text: 'Box-and-Whisker of ' + labelArr[this.x] + ' & ' + labelArr[this.y],
                    fontSize: 20,
                    fontStyle: 'bold',
                    fontFamily: 'Calibri',
                    fill: 'black',
                });           
                this.plotLayer.add(this.mainLabel);
                 
                this.stage.add(this.plotLayer);
                this.plotLayer.on('mouseover mousemove dragmove', function(evt){  
                    document.body.style.cursor = "default";
                });   
                //draw node
                this.dataLayer = new Kinetic.Layer();    
                for(var i = 0 ; i < this.node.length ; i ++)
                {
                    if(i % parseInt(this.node.length/20) == 0)
                    {
                        this.stage.add(this.dataLayer);
                        this.dataLayer = new Kinetic.Layer();
                    }
                    this.dataLayer.add(this.node[i]);
                    
                } 
                this.stage.add(this.dataLayer);
                

                 //////////////////////////////Tooltip Setting////////////////////////////////////////
               this.tooltipLayer = new Kinetic.Layer();
               this.tooltip = new Kinetic.Group({
                   opacity: 0.75,
                   visible: false
               });
               this.tooltipText = new Kinetic.Text({
                   text: '',
                   fontFamily: 'Calibri',
                   fontSize: 15,
                   padding: 5,
                   fill: 'white'
               });      
               this.tooltipRect = new Kinetic.Rect({
                   fill: 'black'
               });
               
               this.tooltip.add(this.tooltipRect).add(this.tooltipText);
               this.tooltipLayer.add(this.tooltip);
               this.stage.add(this.tooltipLayer);
               ///////////////////////////////////////////////////////////////////////////////////
                
                
            },            
            update: function(){
                alert('scatter is updated');                
            }
    };
    
})();

/*
function boxFindMaxValue(Data , index)
{
    var j=0;
    var maxValue=Data[ index[j++] ];
    for(var i=1; i<Data.length; i++)
    {    
        if(i==index[j] )
        {   
            if(Data[i] > maxValue){
                maxValue=Data[i];            
            }
            j++;
        }
    }
    return maxValue;
}
function boxFindMinValue(Data , index)
{
    var j=0;
    var minValue=Data[ index[j++] ];
    for(var i=1; i<Data.length; i++)
    {    
        if(i==index[j] )
        {   
            if(Data[i] < minValue){
                minValue=Data[i];            
            }
            j++;
        }
    }
    return minValue;
}*/
function findQuartile(Data, _th)//_th =1, return Q1
{     
    var p=_th/4;
    var n=Data.length;
    var j=parseInt(n*p);
    var g=n*p-j;
   
    if(g==0){
        return (Data[j-1]+Data[j])/2;
    }else{ //g>0
        return Data[j];
    }
    
}

function findMaxBelowFence(Data, index, q1, q3)
{
    var iqr = q3-q1;    
    var fence = q3 + 1.5*iqr;
    var outliers = new Array();
    var j=0;
    var maxValue=q3;
    for(var i=0; i<Data.length; i++)
    {    
        if(i==index[j])
        {   
            if(Data[i] > maxValue && Data[i] <= fence){
                maxValue=Data[i];            
            }else if(Data[i] > fence){
                outliers.push(i);                
            }            
            j++;
        }
    }    
    return {max : maxValue, outliers : outliers};    
}
function findMinAboveFence(Data, index, q1, q3)
{
    var iqr = q3-q1;    
    var fence = q1 - 1.5*iqr;
    var outliers = new Array();
    var j=0;    
    var minValue=q1;
    
    for(var i=0; i<Data.length; i++)
    {    
        if(i==index[j])
        {   
            if(Data[i] < minValue && Data[i] >= fence){
                minValue=Data[i];    
            }else if(Data[i] < fence){
                outliers.push(i);                
            }            
            j++;
        }    
    }
    //outliers.push('NaN');
    return {min : minValue, outliers : outliers};    
}

function findOutliers(Data, maxBelowFence, minAboveFence)
{
    var outliersArr = new Array();    
    for(var i=1; i<Data.length; i++)
    {              
        if(Data[i] < minAboveFence || Data[i] > maxBelowFence){
            outliersArr.push(i);
        }        
    }
    return outliersArr;
}

/*

// 중앙값 계산 함수
// 크기 순으로 이미 정렬된 배열을 입력해야만 합니다
// 범용성을 위해서 이 함수 자체에는 정렬 기능 미포함
function findMedianValue(array) {
      if (array.length == 0) return NaN; // 빈 배열은 에러 반환(NaN은 숫자가 아니라는 의미임)
      var center = parseInt(array.length / 2); // 요소 개수의 절반값 구하기
    
      if (array.length % 2 == 1) { // 요소 개수가 홀수면
        return array[center]; // 홀수 개수인 배열에서는 중간 요소를 그대로 반환
      } else {
        return (array[center - 1] + array[center]) / 2.0; // 짝수 개 요소는, 중간 두 수의 평균 반환
      }
}
*/
function boxMakeAxisArr(length, axis, tick)     //from scatter.js, so this function can be put into common.js later
{                                                        // return은 x좌표와 x좌표 이름이 찍혀있는 plotArr와 node가 찍혀야할 좌표가 node에 저장되어 return된다. 
    var node = new Array(mainArr[axis].length);
    if(isDiscrete[axis] == true)
    {        
        
        var tmp = new Array();  //the names of each content belowtmp[0] = mainArr[axis][0];
        node[0] = 0;
        for(var i = 1 ; i < mainArr[axis].length ; i++)
        {
            for(j = 0 ; j < tmp.length ; j ++)
            {
                if(tmp[j] == mainArr[axis][i])
                {
                    node[i] = j;
                    break;
                }                                
            }
            if(j == tmp.length)
            {
                node[i] = j;
                tmp.push(mainArr[axis][i]);
            }
        }    
        var plotArr = make2DArr(tmp.length);
        var diff = length / (tmp.length+1);
        tmp.sort();//only difference with scatter!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111
        for(var i = 1 ; i < plotArr.length+1 ; i ++)
        {
            plotArr[i-1][0] = i*diff;
            plotArr[i-1][1] = tmp[i-1];
        }    
        for(var i = 0 ; i < node.length ; i++)
        {
            node[i] = (node[i]+1)*diff;
        }
    }else{            
        
        var max = findMaxValue(mainArr[axis]);
        var min = findMinValue(mainArr[axis]);
        var tickRange = (max-min )/tick;                
        var tmp = Math.ceil( Math.log(tickRange) / Math.log(10));
        tickRange = setTickRange(tmp, tickRange);
        max = tickRange * Math.ceil(max/tickRange);              
        min = tickRange * Math.floor(min/tickRange);
        var diff = length * tickRange   / (max - min);
        plotArr = make2DArr(  Math.round ((max - min)/tickRange + 1 ));
        
        for(var i = 0 ; i < plotArr.length ; i ++)
        {
            plotArr[i][0] = i*diff;
            if (tickRange.toString().indexOf('.') == -1){
                plotArr[i][1] = min+i*tickRange;
            }else{
                plotArr[i][1] = (min+i*tickRange).toFixed(tickRange.toString().substring(tickRange.toString().indexOf('.')+1,tickRange.toString().length).length);
            }
        }        
        //alert(obj.plotXMargin);
        for(var i = 0 ; i < node.length ; i ++)
        {
            node[i] = length* ((mainArr[axis][i]-min)) /((max - min));
        }
    //    alert(node);
    }
    return { plotArr : plotArr, node : node};
}