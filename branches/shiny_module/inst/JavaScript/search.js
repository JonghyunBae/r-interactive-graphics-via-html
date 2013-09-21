function makeSearchButton(searchBoxIdString, mainArr)
{
	var ans='';
	var ansShow='';
	//get searchBoxId from string
	var searchBoxId=searchBoxIdString.slice(9);
	
	// to access mainArr from booleanSearch function later
	window["mainArrOfSearch"+searchBoxId] = mainArr;
	
	// make form 
	document.write("<div class=\"search_wrap\"><form id=\"searchForm");
	document.write(searchBoxId);
	document.write("\">");
	
	// variable buttons update
	for(var i = 0; i < mainArr.labelArr.length ; i ++){
		document.write("<a id=\"labelArr[");
		document.write(i);
		document.write("]\" href=\"#\" class=\"variableButton\" onclick=\"addValueToSearchBox('");
		document.write(mainArr.labelArr[i]);
		document.write("'); return false;\">");
		document.write(mainArr.labelArr[i]);
		document.write("</a>");	  
	}
	document.write("<br>");
	
	// make answer button
	document.write("<a id=\"ansId\" href=\"#\" class=\"ansButton\" onclick=\"addAnsToSearchBox(");
	document.write(searchBoxId);
	document.write("); return false;\">Ans</a>");
	
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
	document.write("\" name=\"searchId");
	document.write(searchBoxId);
	document.write("\" placeholder=\"Please input boolean statement...\" " +
			"onkeydown=\"if (event.which || event.keyCode){if ((event.which == 13) || (event.keyCode == 13))" +
			" {booleanSearch(");
	document.write(searchBoxId);
	document.write(", mainArrOfSearch");
	document.write(searchBoxId);
	document.write("); printAns(); return false;}};\"/>");
	

	// make search button
	document.write("<a id=\"searchBtn\" href=\"#\" class=\"myButton\" onClick=\"booleanSearch(");
	document.write(searchBoxId);
	document.write(", mainArrOfSearch");
	document.write(searchBoxId);
	document.write("); printAns(); return false;\">Search</a>");
	
	// make clear button
	document.write("<a id=\"clearBtn\" href=\"#\" class=\"myButton\" onClick=\"clearSearchBox(");
	document.write(searchBoxId);
	document.write("); return false;\">Clear</a>");
	
	// close form 
	document.write("<br><br></form></div>");
	
	// call auto complete function (jQuery)
	if(this.cnt == undefined){ // temporary static cnt.
		this.cnt = 0;
	}else{
		this.cnt ++;
	}
	if(this.cnt == 0){
		document.write("<link rel=\"stylesheet\" href=\"http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css\"/>");
		document.write("<script src=\"http://code.jquery.com/jquery-1.9.1.js\" type=\"text/javascript\"></script>");
		document.write("<script src=\"http://code.jquery.com/ui/1.10.3/jquery-ui.js\" type=\"text/javascript\"></script>");
	}else{
		this.cnt = 1;
	}	
	document.write("<script>");
	document.write("autoComplete(");
	document.write(searchBoxId);
	document.write(", mainArrOfSearch");
	document.write(searchBoxId);
	document.write(");</script>");
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
    var textBox = document.getElementById("searchBox1");
    textBox.value = textBox.value + label;
}

function addAnsToSearchBox(searchBoxId)
{
    var textBox = document.getElementById("searchBox"+searchBoxId);
    textBox.value = textBox.value + "[ans]";
}


function booleanSearch(searchBoxId, mainArr)
{
	var searchIdString = "searchId" + searchBoxId;
	var inputStr = document.getElementsByName(searchIdString)[0].value;
	var findingNumber = new Array();
	
	// replace labelArr to mainArr[labelArr]
	for(var i = 0 ; i < mainArr.labelArr.length ; i ++)
	{
		var searchStr = new RegExp(mainArr.labelArr[i], 'g'); // "g" means all search
		inputStr = inputStr.replace(searchStr, "mainArr[\"" + mainArr.labelArr[i] + "\"][i]");		
	}
	
	// find node number which satisfies boolean condition
	for(var i = 0 ; i < mainArr.$isSelected.length ; i ++)
	{		
		if(eval(inputStr)){			
			findingNumber.push(i);
		}
	}
	
	// root update
	for(var i = 0 ; i < mainArr.$isSelected.length ; i ++){
		mainArr.$isSelected[i][0] = 0;
		for(var j = 1 ; j < mainArr.$isSelected[i].length ; j ++){
			mainArr.$isSelected[i][j](0);
		}
	}
	for(var i = 0 ; i < findingNumber.length ; i ++){
		mainArr.$isSelected[findingNumber[i]][0] = 1;
		for(var j = 1 ; j < mainArr.$isSelected[findingNumber[i]].length ; j ++){
			mainArr.$isSelected[findingNumber[i]][j](1);
		}
	}
	// table update
	if(mainArr.refreshTable != undefined){
		mainArr.refreshTable();
	}
	// refresh
	for(var i = 1 ; i < mainArr.refreshArr.length ; i ++){
		mainArr.refreshArr[i]();
	}
	// mainArr update
	if(mainArr.child != null){
		for(var i = 0 ; i < mainArr.child.length ; i ++){
			var temp = mainArr.parentTOchild[i](findingNumber);
			childUpdate(mainArr.child[i], temp, 1, mainArr);
		}
	}
	
	
	
	
	/*
	for(var i = 0 ; i < mainArr.labelArr.length ; i ++)
	{
		var searchStr = new RegExp(mainArr.labelArr[i], 'gi'); // "g" means all search, "i" menas not-case-sensitive
		//    var newStr = tempData[j][i].toString();
		inputStr = inputStr.replace(searchStr, "tempData[" + i + "][i]");
		//alert(inputStr);
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
		//saveWork();*/
}
///////////////////5<TIME ,,,,,,,bug found


//auto complete (Reference, http://jqueryui.com/autocomplete/#multiple)
function autoComplete(searchBoxId, mainArr){
	$(function(){
	    var availableTags = mainArr.labelArr;
	    function split( val ) {
	        return val.split( / \s*/ );
	    }
	    function extractLast( term ) {
	    	return split( term ).pop();
	    }
	    $( "#searchBox"+searchBoxId )
	    	// don't navigate away from the field on tab when selecting an item
	        .bind( "keydown", function( event ) {
	          if ( event.keyCode === $.ui.keyCode.TAB &&
	              $( this ).data( "ui-autocomplete" ).menu.active ) {
	            event.preventDefault();
	          }
	        })
	        .autocomplete({
	          minLength: 0,
	          source: function( request, response ) {
	            // delegate back to autocomplete, but extract the last term
	            response( $.ui.autocomplete.filter(
	              availableTags, extractLast( request.term ) ) );
	          },
	          focus: function() {
	            // prevent value inserted on focus
	            return false;
	          },
	          select: function( event, ui ) {
	            var terms = split( this.value );
	            // remove the current input
	            terms.pop();
	            // add the selected item
	            terms.push( ui.item.value );
	            // add placeholder to get the comma-and-space at the end
	            terms.push( "" );
	            this.value = terms.join( " " );
	            return false;
	          }
	        });
	});	
	
	
	
}

