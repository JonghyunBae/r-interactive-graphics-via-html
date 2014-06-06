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
				for (var name in window[data[0]]) {
					window[data[0]][name] = data[1][name];
				}
				window[data[0]].draw();
			}
		}		
	}
	cnt++;
};
Shiny.outputBindings.register(rightOutputBinding, 'div.rightOutputBinding');



