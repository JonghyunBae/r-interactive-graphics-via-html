
//create dynamic css style for dynamic table

var colWidth=100;
document.write("<style>");
document.write("table.selectedInfo { width: "+((colWidth+9)*(labelArr.length+1)-1)+"px; }");			
document.write("div.scrollableContainer { width: "+ ((colWidth+9)*(labelArr.length+1)+15) +"px;}");
document.write("div.scrollingArea { height: " + 300 + "px;}"); //you can set the height of scrolling area
document.write("table.selectedInfo .node     div { width: "+colWidth+"px; text-align:center;  }");
document.write("table.selectedInfo .column div { width: "+colWidth+"px; text-align:center;  }");

document.write("</style>"); 


//create dynamic table

document.write("<div id=\"tableScrollableContainer\" class=\"scrollableContainer\" style=\"float: left; position : relative; display:none; margin: 15px 15px 15px 300px;\">");
document.write(" <div class=\"scrollingArea\">");
	document.write("<table id=\"dataTable\" class=\"selectedInfo scrollable\">");
		document.write("<thead>");
			document.write("<tr>");
			document.write("<th class=\"node\"><div>node<br>(number)</div></th>");
			for(var i=0; i<labelArr.length ; i++)
			{
				document.write("<th class=\"column\"><div>"+labelArr[i]+"</div></th>");
			}	  			
  	      document.write("</tr>");
		document.write("</thead>");
		document.write("<tbody>");		
		//	for(var i=0; i<3; i++)
		//	{
			//	if(scatterData[i].selected==1)
			//	{
					document.write("<tr id=\"tr1\" style=\"display:none; \"> ");			//style=\"display:none\">
						document.write("<td id=\"td1\" class=\"node\"><div>-</div></td>");
						for(var i=0; i<labelArr.length ; i++)
						{
							document.write("<td class=\"column\"><div>-</div></td>");
						}	  	
					document.write("</tr>");		
			//	}					
		//	}
			document.write("</tbody>");			
		document.write("</table>");	
	document.write(" </div>");
document.write(" </div>");			


function addRow(tableID) {
	
	
	
	deleteRow(tableID);
    var table = document.getElementById(tableID);

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var colCount = table.rows[0].cells.length;
   
    for(var i=0; i<mainArr[0].length; i++)
	{
		if(isSelected[i][0] == 1)
		{
			rowCount = table.rows.length;
			row = table.insertRow(rowCount);
				var newcell = row.insertCell(0);
				 newcell.align = 'center';
				
				newcell.style.backgroundColor = '#b6c5ee';
				newcell.style.color = 'black';
				newcell.width = colWidth;
				newcell.innerHTML = i;
			   for(var j=1; j<colCount; j++) {

		           var newcell = row.insertCell(j);
		           // newcell.innerHTML = table.rows[0].cells[j].innerHTML;
		           newcell.align = 'center';
		           newcell.style.color = 'black';
			           newcell.width = colWidth;
			           newcell.innerHTML = mainArr[j-1][i];
			           
				   }
			}
		}	
    }
function deleteRow(tableID) {
	try {
		var table = document.getElementById(tableID);
		var rowCount = table.rows.length;
 
		for(var i=2; i<rowCount; i++) {
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
        //        context.fillStyle = colors2[mainArr[0][i]-1];   
                context.fillStyle = setColor(scatterColor,i);
                context.fillText(i, 10+cnt2, 10*cnt1+20);
        //    document.write("selected("+i+") is : "+scatterData.selected[i]+"<br>");
            }
        }
    }
	
	*/