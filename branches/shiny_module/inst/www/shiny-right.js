var cnt = 0;
var offload;
var rightOutputBinding = new Shiny.OutputBinding();
rightOutputBinding.find = function(scope){
	return $(scope).find(".right-output");
};
rightOutputBinding.renderValue = function(el, data) {
	if(cnt > 0){//if(data change)
		cnt = 0;
		if(data[0] != -1){
			if(data[0] == 'first'){
				offload._run(data[2].x, data[2].y);
				//axisSaving1.getAxisObj(data[1])._drawRegression(data[2].x, data[2].y);
			}
		//	axisSaving1.getAxisObj(data[0])._drawRegression(data[1].xx, data[1].yy);
				
			//axis2._drawRegression(data[1].xx, data[1].yy);
		//	objArr[data[0]-1].draw_regression(data[1], data[2].xx, data[2].yy);	
		//	window.Shiny.onInputChange("start",-1);
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



