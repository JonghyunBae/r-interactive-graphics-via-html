/**
 * SearchJS JavaScript Library
 * 
 * Copyright 2013, The RIGHT team
 * Licensed under the MIT or GPL Version 2 licenses.
 *
 * Copyright (C) 2013 by The RIGHT team
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
	
	document.write("</p><br>");
	document.write("<a id=\"ansId\" href=\"#\" class=\"ansButton\" onclick=\"addAnsToSearchBox(); return false;\">Ans</a>");
	document.write("<a id=\"clearAnsId\" href=\"#\" class=\"ansButton\" onclick=\" ans=''; printClearAns(); return false;\">Clr Ans</a>");
	document.write("<label  style = \" font-family:Trebuchet MS;font-weight:bold; color : #516ca3;\"> [ans] : </label>");
	document.write("<label  style = \" font-family:Trebuchet MS;font-weight:bold; color : #516ca3;\" id=\"label1\">undefined</label>");
	document.write("</p>");
	
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
	    		//    var newStr = mainArr[j][i].toString();
	    		inputStr = inputStr.replace(searchStr, "tempData["+i+"][i]");
	    	}
	  //if "Time" is for "mainArr[1][i]" and "labelArr[1]"    
	//for example, "8<= Time && Time <=10" will be "8<=mainArr[1][i] && mainArr[1][i] <=10"
	    	
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
//	    var newStr = mainArr[j][i].toString();
			ansShow = ansShow.replace(searchStr1, labelArr[i]);
			
	    }    
		//writeMsg(msgLayer);
		//addRow('dataTable');
		//saveWork();
	}
	///////////////////5<TIME ,,,,,,,bug found



