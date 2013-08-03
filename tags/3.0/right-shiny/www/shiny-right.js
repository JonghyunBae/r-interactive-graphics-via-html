var cnt=0;
var rightOutputBinding = new Shiny.OutputBinding();
rightOutputBinding.find = function(scope){
	return $(scope).find(".right-output");
};
rightOutputBinding.renderValue = function(el, data) {
	if(cnt > 0){//if(data change)
		cnt = 0;
		if(data[0] != -1){
			objArr[data[0]-1].draw_regression(data[1], data[2].xx, data[2].yy);	
			window.Shiny.onInputChange("id",-1);
		}
	}
	cnt ++;
};
Shiny.outputBindings.register(rightOutputBinding, 'div.rightOutputBinding');

var cnt1 = 0;
var rightOutputBinding1 = new Shiny.OutputBinding();
rightOutputBinding1.find = function(scope){
	return $(scope).find(".right-output1");
};
rightOutputBinding1.renderValue = function(el, data) {
	if(cnt1 > 0){//if(data change)
		cnt1 = 0;
		if(data[0] != -1){
			objArr[data[0]-1].draw_regression(data[1], data[2].xx1, data[2].yy1);	
			window.Shiny.onInputChange("id1",-1);
		}
	}
	cnt1 ++;
};
Shiny.outputBindings.register(rightOutputBinding1, 'div.rightOutputBinding1');


