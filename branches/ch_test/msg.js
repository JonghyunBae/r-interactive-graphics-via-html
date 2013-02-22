  var msgStage = new Kinetic.Stage({
        container: 'msgContainer',
        width: 500,
        height: 500
      });     
    var msgLayer = new Kinetic.Layer();
   /*
    var drawEdgeRect = new Kinetic.Rect({
          x: 0,
      y: 0,
      width: 500,
      height: 500,
      fillEnabled: false,
      stroke: 'black',
      strokeWidth: 2 
 });
 msgLayer.add(drawEdgeRect);
   */
    msgStage.add(msgLayer);
   
    function writeMsg(layer){
       
        var context = layer.getContext();
        layer.clear();
       
        context.font = "12pt Calibri";
        context.fillStyle = "black";       
        context.fillText("# of Selected for Hist", 300, 15);
        var cnt=0;       
        for(var i=0; i<histData.length; i++){           
            context.font = "10pt Calibri";
            context.fillText( i+' : '+histData[i].selected, 300, 13*cnt+30);
            cnt++;           
        }
       
        context.font = "12pt Calibri";
        context.fillStyle = "black";       
        context.fillText("Selected Items for Scatter", 10, 15);
      
        var cnt1=0;
        var cnt2=0;
       // document.write('a');
        for(var i=0; i<scatterData.length; i++){
            if(scatterData[i].selected==1){
                if(cnt1>49){
                    cnt1=0;
                    cnt2=cnt2+20;
                }
                cnt1++;
                context.font = "8pt Calibri";
        //        context.fillStyle = colors2[mainArr[0][i]-1];   
                context.fillStyle = setColor(scatterColor,i);
                context.fillText(i, 10+cnt2, 10*cnt1+20);
        //    document.write("selected("+i+") is : "+scatterData.selected[i]+"<br>");
            }
        }
       
   
       
    }