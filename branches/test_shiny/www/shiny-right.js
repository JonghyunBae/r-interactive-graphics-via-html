var cnt=0;
var tempHidden = new Array();
var save = new Array();
var rightOutputBinding = new Shiny.OutputBinding();
var xAxis=new Array('carat','cut','carat'); //user initial value
var yAxis=new Array('price','','price'); //user initial value
var color=new Array('price','',''); //user initial value

var tempHidden = new Array();
rightOutputBinding.find = function(scope){
	return $(scope).find(".right-output");
};
rightOutputBinding.renderValue = function(el, data) {
	
	
	if(cnt>0){//if(data change)
		cnt=0;
		if(data[7] != null){				
			if(data[7] == "reset"){
				for(var i = 0 ; i < tempHidden.length ; i ++){
					isHidden[tempHidden[i]] = false;
				}
				tempHidden = new Array();
				tempData = mainArr; 
			}else{
				if(data[7].length == undefined){
					isHidden[tempData[tempData.length-1][data[7]]] = true;
					tempHidden.push(tempData[tempData.length-1][data[7]]);
				}else{
					for(var i = 0 ; i < data[7].length ; i ++){
						isHidden[tempData[tempData.length-1][data[7][i]]] = true;
						tempHidden.push(tempData[tempData.length-1][data[7][i]]);
					}
				}				
				tempData = make2DArr(mainArr.length);
				var h = 0;
				var p = 0;
				for(var i = 0 ; i < mainArr[0].length ; i ++){
					if(isHidden[i]){
					//	isSelected[isSelected.length-1-p][0] = 3; this should be included?
						p++;
						continue;
					}							
					for(var j = 0 ; j < mainArr.length ; j ++){
						tempData[j][h] = mainArr[j][i];
					}				
					h++;
					}
				}					
			window.Shiny.onInputChange("TestEntry1", null); // telling receive message completely.
		}
		if(data[8] != null && data[9] != null && data[10] != null){
			switch(data[9])
			{
				case 0 : xAxis[data[8]-1] = labelArr[data[10]]; break;
				case 1 : yAxis[data[8]-1] = labelArr[data[10]]; break;
				case 2 : color[data[8]-1] = labelArr[data[10]]; break;
			}		
			window.Shiny.onInputChange("graphName", null); // telling receive message completely.
			window.Shiny.onInputChange("changeXAxis", null); // telling receive message completely.
		}
		scatter1._initScatter(1, tempData, {x: xAxis[0] , y: yAxis[0], color: color[0], legend: data[3], width: data[4], height: data[5]});
		//scatter^id^._initScatter(^id^, tempData, {x: xAxis[^id-1^], y: data[1], color: data[2], legend: data[3], width: data[4], height: data[5]});
		scatter1.draw(1);
		eventTrigger(scatter1);	
		hist2._initHist(2, tempData, {bin: data[6], x: xAxis[1] , width: data[4], height: data[5]});
		hist2.draw(2);
		eventTrigger(hist2);	
		box3._initBox(3, tempData, {x: xAxis[2] , y: yAxis[2], width: data[4], height: data[5]});
		box3.draw(3);
		eventTrigger(box3);
	}
	cnt++;
};
Shiny.outputBindings.register(rightOutputBinding, 'createDiv.rightOutputBinding');