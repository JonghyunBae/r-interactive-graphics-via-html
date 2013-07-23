var cnt=0;
var tempHidden = new Array();
var save = new Array();

var xAxis=new Array('carat','cut','carat'); //user initial value
var yAxis=new Array('price','','price'); //user initial value
var color=new Array('price','',''); //user initial value
var legend=new Array('price','','');//user initial value
var legendArr = ['right', 'left', 'topright', 'topleft', 'default'];
var width=new Array(300, 300, 300); //user initial value
var widthArr = [-100, -10, -1, 1, 10, 100];
var height=new Array(300, 300, 300); //user initial value
var heightArr = [-100, -10, -1, 1, 10, 100];
var bin=new Array('', 2, ''); //user initial value
var binArr = [-1, 1];

var tempHidden = new Array();

var rightOutputBinding = new Shiny.OutputBinding();
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
		
		if(data[12] != null){
			scatter1._linear(data[12].xx, data[12].yy);
		}
		
	}
	cnt++;
};
Shiny.outputBindings.register(rightOutputBinding, 'div.rightOutputBinding');

var rightLinearBinding = new Shiny.OutputBinding();
rightLinearBinding.find = function(scope){
	return $(scope).find(".right-linear-output");
};

