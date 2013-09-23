function deleteRow(tableID) {
	try {
		var table = document.getElementById(tableID);
		var rowCount = table.rows.length;
 
		for(var i = 2 ; i < rowCount ; i ++) {
			var row = table.rows[i];
               //var chkbox = row.cells[0].childNodes[0];
	        if(1){
	            table.deleteRow(i);
	            rowCount--;
	            i--;
	        }
    }
    }catch(e){
        alert(e);
    }
}

function refreshTable(tableID, mainArr){
	return function() {
			deleteRow(tableID); //delete all Row first.
		    var table = document.getElementById(tableID);
		    var rowCount = table.rows.length;
		    var row = table.insertRow(rowCount);
		    var colCount = table.rows[0].cells.length;
		    var colWidth=100;
		    var cnt = 0;
		    for(var i = 0 ; i < mainArr.$isSelected.length ; i ++){
				if(mainArr.$isSelected[i][0] == 1){
					rowCount = table.rows.length;
					row = table.insertRow(rowCount);
					var newcell = row.insertCell(0);
					newcell.align = 'center';
					newcell.style.backgroundColor = '#cfe444';
					newcell.style.color = 'black';
					newcell.innerHTML = i;
					newcell.width = colWidth;
					
					for(var j = 1 ; j < colCount ; j ++) {
						var newcell = row.insertCell(j);			
						newcell.align = 'center';
						newcell.style.color = 'black';
						newcell.width = colWidth;
						if(mainArr[mainArr.labelArr[j-1]].isDiscrete == true){
							newcell.innerHTML = mainArr[mainArr.labelArr[j-1]].index[mainArr[mainArr.labelArr[j-1]][i]];
						}else{
							newcell.innerHTML = mainArr[mainArr.labelArr[j-1]][i];
						}					
					}
				}
			}		
	};
}

//create dynamic css style for dynamic table
function makeTable(tableID, mainArr, height){
	//tableID = 'table' + tableID;
	var colWidth=100;
	mainArr.refreshTable = refreshTable(tableID, mainArr);
	document.write("<style>");
	document.write("table.selectedInfo { width: "+((colWidth)*(mainArr.labelArr.length+1)-1)+"px; }");			
	document.write("#"+"css"+tableID+" { width: "+ ((colWidth+1)*(mainArr.labelArr.length+1)+16) +"px;}");
//	document.write("#"+"csstbody"+tableID+" { width: "+ ((colWidth+9)*(mainArr.labelArr.length+1)+15) +"px;}");
	document.write("#"+"css"+tableID+" { height: " + height + "px;}"); //you can set the height of scrolling area
	document.write("table.scrollable .node     div { width: "+colWidth+"px; text-align:center;  }");
	document.write("table.scrollable .column div { width: "+colWidth+"px; text-align:center;  }");

	document.write("</style>"); 
	//create dynamic table

	document.write("<div id="+"css"+tableID+" class=\"scrollableContainer\" style=\"float: left; position : relative; display:block; margin : 10px 1px 0px 10px ;\">");
	document.write(" <div id="+"css"+tableID+" style=\"overflow: auto; \">");
		document.write("<table id=" + tableID + " class=\"scrollable\">");
			document.write("<thead>");
				document.write("<tr>");
				document.write("<th class=\"node\"><div>node<br>(number)</div></th>");
				for(var i = 0 ; i < mainArr.labelArr.length ; i ++){
					document.write("<th class=\"column\"><div>" + mainArr.labelArr[i] + "</div></th>");
				}	  			
				document.write("</tr>");
			document.write("</thead>");
			document.write("<tbody id="+"csstbody"+tableID+">");		
			//	for(var i=0; i<3; i++)
			//	{
				//	if(scatterData[i].selected==1)
				//	{
						document.write("<tr style=\"display:none; \"> ");			//style=\"display:none\">
							document.write("<td><div>-</div></td>");
							for(var i = 0 ; i < mainArr.labelArr.length ; i ++){
								document.write("<td ><div>-</div></td>");
							}
						document.write("</tr>");
				//	}					
			//	}
				document.write("</tbody>");
			document.write("</table>");
		document.write(" </div>");
	document.write(" </div>");
}

/*
<div class="scrollableContainer" style="left:100px; top:100px">
  <div class="scrollingArea">
  	<table class="selectedInfo scrollable" >
  	  <thead>
  			<tr>
  	      <th class="node"><div>node</div></th>
  	      <th class="column1"><div>column1</div></th>
  	      <th class="column2"><div>column2 operation</div></th>
  	      <th class="column3"><div>column3</div></th>
  	      <th class="column4"><div>column4</div></th>
  			</tr>
  		</thead>
  		<tbody>
  		  		  <tr>
          <td class="node"><div>Seabourne Sun</div></td>
          <td class="column1"><div>Seabourn Cruise Line</div></td>
          <td class="column2"><div>1988</div></td>
          <td class="column3"><div></div></td>
          <td class="column4"><div >Ended service in 2002, currently operating as Prinsendam</div></td>                        
        </tr>
        		  <tr>
          <td class="node"><div>Adventures of the Seas</div></td>
          <td class="column1"><div>Royal Caribbean International</div></td>
          <td class="column2"><div>2001</div></td>
          <td class="column3"><div>138,000</div></td>
          <td class="column4"><div >Operating</div></td>                        
        </tr>
        </tbody>
      	</table>
	</div>
</div>
*/













/*

var msgStage = new Kinetic.Stage({
        container: 'msgContainer',
        width: 500,
        height: 500,
        
      });     
    var msgLayer = new Kinetic.Layer();
    
    document.getElementById('msgContainer').style.visibility = 'hidden'; 


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
        //        context.fillStyle = colors2[tempData[0][i]-1];   
                context.fillStyle = setColor(scatterColor,i);
                context.fillText(i, 10+cnt2, 10*cnt1+20);
        //    document.write("selected("+i+") is : "+scatterData.selected[i]+"<br>");
            }
        }
    }
	
	*/
