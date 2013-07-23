var cnt=0;
var save = new Array();


var rightOutputBinding = new Shiny.OutputBinding();
rightOutputBinding.find = function(scope){
	return $(scope).find(".right-output");
};
rightOutputBinding.renderValue = function(el, data) {
	if(cnt>0){//if(data change)
		cnt=0;
		
		if(data[0] != null){						
			window.Shiny.onInputChange("hide", null); // telling receive message completely.
		}
		for(var i = 0 ; i < objArr.length ; i ++)
		{
			//alert(objArr[i]._type);
			objArr[i]._init(objArr[i]._id, tempData, {});
			objArr[i].draw(objArr[i]._id);
			eventTrigger(objArr[i]);
			//alert("dddd");
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

