//  table example
document.write("<p>Use the variables below only, you can click one to add into input box</p>");
document.write("<p>");
for(var i=0; i<labelArr.length; i++)
{
	document.write("<a id=\"labelArr[");
	document.write(i);
	document.write("]\" href=\"#\" class=\"variableButton\" onclick=\"addValueToSearchBox(");
	document.write(i);
	document.write("); return false;\">");
	document.write(labelArr[i]);
	document.write("</a>");	  
}
document.write("</p>");					
//document.write("<a id=\"clearSearchBoxId\" href=\"#\" class=\"variableButton\" onclick=\"clearSearchBox()\">Clear</a>");
  
function clearSearchBox()
{
	//scatterAllDeselect();
	//histAllDeselect();
	var textBox = document.getElementById("searchBox");
	textBox.value = '';
	scatterAllDeselect();
	histAllDeselect();
	//if(msgShow==true){
		writeMsg(msgLayer);
//	}
	doRefresh();	     	
}

function addValueToSearchBox(i)
{
    var textBox = document.getElementById("searchBox");
    if(textBox.value==textBox.defaultValue){	
    	textBox.value = '';
    }
    textBox.value = textBox.value + labelArr[i];
}

function booleanSearch(string)
{
	scatterAllDeselect();
	histAllDeselect();
    var inputStr = string.searchId.value;
       
  //      if(string.select1.value == 0){//scatter selected // can be removed later
    if(1){
	    /*if(inputString includes any other variables except given ones){
	    alert("Please use given variables!");
		}*/
	   //if boolean expression is not logical, alert("Please use proper boolean expression!");
    	for(var i=0; i<labelArr.length; i++)
	    {
    		var searchStr =new RegExp( labelArr[i].split('\n')[0] , 'gi'); // "g" means all search, "i" menas not-case-sensitive
    			//-------------------------csv2Arr(data, liveChar) has bug.....last column data includes "\n", should be removed...!!!!!!!!!!!!
    		//    var newStr = mainArr[j][i].toString();
    		inputStr = inputStr.replace(searchStr, "mainArr["+i+"][i]");
    	}

  //if "Time" is for "mainArr[1][i]" and "labelArr[1]"    
//for example, "8<= Time && Time <=10" will be "8<=mainArr[1][i] && mainArr[1][i] <=10"
   
    	for(var i = 0 ; i < scatterData.length ; i++)
        {
            //    var tmpNameArr = new Array();
    		//    tmpNameArr = scatterData[i].name.split(',');   
    		//    alert("Please use given variables!");
    		if(eval(inputStr))
    		{
    			tmpNode = scatterStage.get("#"+ (i + scatterIdStart));
    			scatterSingleSelect(tmpNode, i);
    			histUpdate(scatterXMain[i], 0);  //과부하로 인한 보류
    		}
        }
    doRefresh();
    }   
//        }else if(string.select1.value ==1){//hist selected
           
 //       }
    if(msgShow==true)
    {
      writeMsg(msgLayer);
    }
}