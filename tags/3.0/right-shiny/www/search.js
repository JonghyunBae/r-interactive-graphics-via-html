
	var ans='';
	var ansShow='';
	// variable buttons update

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
	
	document.write("<br>");
	document.write("<a id=\"ansId\" href=\"#\" class=\"ansButton\" onclick=\"addAnsToSearchBox(); return false;\">Ans</a>");
	document.write("<a id=\"clearAnsId\" href=\"#\" class=\"ansButton\" onclick=\" ans=''; printClearAns(); return false;\">Clr Ans</a>");
	document.write("<label> [ans] : </label>");
	document.write("<label id=\"label1\">undefined</label>");
	
	function printAns(){
		var tmpStr = '';	
		tmpStr = ansShow.replace(/</g,'< ');//cannot understand why "<" do not work, "< " works.
		document.getElementById('label1').innerHTML = tmpStr;
		if(ansShow==''){		
			printClearAns();
		}
	}

	function printClearAns(){
		document.getElementById('label1').innerHTML = "undefined";
	}

	function clearSearchBox()
	{
		//scatterAllDeselect();
		//histAllDeselect();
		var textBox = document.getElementById("searchBox");
		textBox.value = '';
		//writeMsg(msgLayer);
		addRow('dataTable');     	
	}

	function addValueToSearchBox(i)
	{
		
	    var textBox = document.getElementById("searchBox");
	    textBox.value = textBox.value + labelArr[i];
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



