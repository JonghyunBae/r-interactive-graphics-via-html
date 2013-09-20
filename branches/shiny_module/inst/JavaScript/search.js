function makeSearchButton(searchBoxId, mainArr)
{
	var ans='';
	var ansShow='';
	
	// make form 
	document.write("<div class=\"wrap\"><form id=\"searchForm");
	document.write(searchBoxId);
	document.write("\">");
	
	// variable buttons update
	for(var i = 0; i < mainArr.labelArr.length ; i ++){
		document.write("<a id=\"labelArr[");
		document.write(i);
		document.write("]\" href=\"#\" class=\"variableButton\" onclick=\"addValueToSearchBox(");
		document.write(mainArr.labelArr[i]);
		document.write("); return false;\">");
		document.write(mainArr.labelArr[i]);
		document.write("</a>");	  
	}
	document.write("<br>");
	
	// make answer button
	document.write("<a id=\"ansId\" href=\"#\" class=\"ansButton\" onclick=\"addAnsToSearchBox(); return false;\">Ans</a>");
	
	// make answer clear button
	document.write("<a id=\"clearAnsId\" href=\"#\" class=\"ansButton\" onclick=\" ans=''; printClearAns(");
	document.write(searchBoxId);
	document.write("); return false;\">Clr Ans</a>");
	
	// make answer label
	document.write("<label> [ans] : </label>");
	document.write("<label id=\"label");
	document.write(searchBoxId);
	document.write("\">undefined</label>");
	
	// make text input box
	document.write("<input type=\"text\" id=\"searchBox");
	document.write(searchBoxId);
	document.write("\" name=\"searchId\" placeholder=\"Please input boolean statement...\" " +
			"onkeydown=\"if (event.which || event.keyCode){if ((event.which == 13) || (event.keyCode == 13))" +
			" {booleanSearch(searchForm1);  printAns(); return false;}};\"/>");
	
	// make search button
	document.write("<a id=\"searchBtn\" href=\"#\" class=\"myButton\" onClick=\"booleanSearch(searchForm1);" +
			" printAns(); return false;\">Search</a>");
	
	// make clear button
	document.write("<a id=\"clearBtn\" href=\"#\" class=\"myButton\" onClick=\"clearSearchBox(");
	document.write(searchBoxId);
	document.write("); return false;\">Clear</a>");
	
	// close form 
	document.write("<br><br></form></div>");
}
	
	
function printAns()
{
	var tmpStr = '';	
	tmpStr = ansShow.replace(/</g,'< ');//cannot understand why "<" do not work, "< " works.
	document.getElementById('label1').innerHTML = tmpStr;
	if(ansShow==''){		
		printClearAns();
	}
}

function printClearAns(searchBoxId)
{
	document.getElementById('label'+searchBoxId).innerHTML = "undefined";
}

function clearSearchBox(searchBoxId)
{
	//AllDeselect();
	var textBox = document.getElementById("searchBox"+searchBoxId);
	textBox.value = '';
	//Table Update needed;  	
}

function addValueToSearchBox(label)
{
    var textBox = document.getElementById("searchBox");
    textBox.value = textBox.value + label;
}

function addAnsToSearchBox()
{
    var textBox = document.getElementById("searchBox");
    textBox.value = textBox.value + "[ans]";
}


	function booleanSearch(string)
	{
//		scatterAllDeselect();
//		histAllDeselect();
	    var inputStr = string.searchId.value;
	       
	    if(1){
		    /*if(inputString includes any other variables except given ones){
		    alert("Please use given variables!");
			}*/
		   //if boolean expression is not logical, alert("Please use proper boolean expression!");
	    	for(var i=0; i<labelArr.length; i++)
		    {
	    		var searchStr =new RegExp( labelArr[i], 'gi'); // "g" means all search, "i" menas not-case-sensitive
	    		//    var newStr = tempData[j][i].toString();
	    		inputStr = inputStr.replace(searchStr, "tempData["+i+"][i]");
	    	}
	  //if "Time" is for "tempData[1][i]" and "labelArr[1]"    
	//for example, "8<= Time && Time <=10" will be "8<=tempData[1][i] && tempData[1][i] <=10"
	    	
	    	inputStr =inputStr.replace(/\[ans\]/gi, "("+ans+")"); //If there is "[ans]", change it to (ans).
	    	ans=inputStr; //current answer update.
	    	

	    	for(var i = 0 ; i < isSelected.length ; i++)
	        {
	    	    //    var tmpNameArr = new Array();
	    		//    tmpNameArr = scatterData[i].name.split(',');   
	    		//    alert("Please use given variables!");

	    		if(eval(inputStr)){
	    			if(isSelected[i][0] == 0)
	    			{
	    				for(var j = 1 ; j < isSelected[i].length ; j ++)
	    				{
	    					
	    					isSelected[i][j](1);
	    				}
	    				isSelected[i][0] = 1;
	    			}    	
	       		}else{
	       			if(isSelected[i][0] == 1)
	    			{
	    				for(var j = 1 ; j < isSelected[i].length ; j ++)
	    				{
	    					
	    					isSelected[i][j](0);
	    				}
	    				isSelected[i][0] = 0;
	    			}
	       		}
	    		
	        }
	    	addRow('dataTable');
	    	refresh();
	    	clearSearchBox();
	    }
	    ansShow=ans;
	   
	    for(var i=0; i<labelArr.length; i++)
	    {
		    var tmpStr = "tempData\\\["+i+"\\\]\\\[i\\\]";

		    var searchStr1 =new RegExp( tmpStr, 'g'); // "g" means all search, "i" menas not-case-sensitive
//	    var newStr = tempData[j][i].toString();
			ansShow = ansShow.replace(searchStr1, labelArr[i]);
			
	    }    
		//writeMsg(msgLayer);
		//addRow('dataTable');
		//saveWork();
	}
	///////////////////5<TIME ,,,,,,,bug found



