var cnt=0;
var rightOutputBinding = new Shiny.OutputBinding();
rightOutputBinding.find = function(scope){
	return $(scope).find(".right-output");
};
rightOutputBinding.renderValue = function(el, data) {
	if(cnt>0){//if(data change)
		cnt=0;
		if(data[0] != -1){
			objArr[data[0]-1].draw_regression(data[1], data[2].xx, data[2].yy);	
			window.Shiny.onInputChange("id",-1);
		}
	}
	cnt++;
};
Shiny.outputBindings.register(rightOutputBinding, 'div.rightOutputBinding');

var rightLinearBinding = new Shiny.OutputBinding();
rightLinearBinding.find = function(scope){
	return $(scope).find(".right-linear-output");
};

