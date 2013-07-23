var cnt=0;
var save = new Array();


var rightOutputBinding = new Shiny.OutputBinding();
rightOutputBinding.find = function(scope){
	return $(scope).find(".right-output");
};
rightOutputBinding.renderValue = function(el, data) {
	if(cnt>0){//if(data change)
		cnt=0;
		//alert("dddd");
		//if(data[0] == null)
		//	alert("dddd");
		if(data[0] == "hide"){
			
			for(var i = 0 ; i < objArr.length ; i ++)
			{
				//alert(objArr[i]._type);
				objArr[i]._init(objArr[i]._id, tempData, {});
				objArr[i].draw(objArr[i]._id);
				eventTrigger(objArr[i]);
				//alert("dddd");
			}
			window.Shiny.onInputChange("hide", null); // telling receive message completely.
		}

	/*	if(data[1] != null){
			objArr[data[0]-1]._linear(data[1].xx, data[1].yy);			
		}		*/
	}
	cnt++;
};
Shiny.outputBindings.register(rightOutputBinding, 'div.rightOutputBinding');

var rightLinearBinding = new Shiny.OutputBinding();
rightLinearBinding.find = function(scope){
	return $(scope).find(".right-linear-output");
};

