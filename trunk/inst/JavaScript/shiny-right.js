var cnt = 0;
var offload;
var rightOutputBinding = new Shiny.OutputBinding();
rightOutputBinding.find = function(scope){
	return $(scope).find(".right-output");
};
rightOutputBinding.renderValue = function (el, data) {
	if (cnt > 0) {//if(data change)
		if (data != null) {
			if (data[0] != -1) {
				// TODO: Shoul we apply this method? xx and yy ?
				window[data[0]].xx = data[1].xx;
				window[data[0]].yy = data[1].yy;
				window[data[0]].draw();		
			}
		}		
	}
	cnt++;
};
Shiny.outputBindings.register(rightOutputBinding, 'div.rightOutputBinding');



