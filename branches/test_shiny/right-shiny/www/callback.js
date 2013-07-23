var legendArr = ['right', 'left', 'topright', 'topleft', 'default'];
var widthArr = [-100, -10, -1, 1, 10, 100];
var heightArr = [-100, -10, -1, 1, 10, 100];
var binArr = [-1, 1];
var array_of_functions = [
                          function(Name, i) { changeXAxis(Name, i) },
                          function(Name, i) { changeYAxis(Name, i) },
                          function(Name, i) { changeColor(Name, i) },
                          function(Name, i) { changeLegend(Name, i) },
                          function(Name, i) { changeWidth(Name, i) },
                          function(Name, i) { changeHeight(Name, i) },
                          function(Name, i) { changeBin(Name, i) }
                      ]
var changeXAxis = function (Name, i){
	Name._init(Name._id, tempData, {x: Name._labelArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);		
}
var changeYAxis = function (Name, i){
	Name._init(Name._id, tempData, {y: Name._labelArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);			
}
var changeColor = function (Name, i){
	Name._init(Name._id, tempData, {color: Name._labelArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);
}
var changeLegend = function (Name, i){
	Name._init(Name._id, tempData, {legend: legendArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);
}
var changeWidth = function (Name, i){
	Name._init(Name._id, tempData, {width: Name.width + widthArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);
}
var changeHeight = function (Name, i){
	Name._init(Name._id, tempData, {height: Name.height + heightArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);
}
var changeBin = function (Name, i){
	Name._init(Name._id, tempData, {bin: Name.bin + binArr[i]});
	Name.draw(Name._id);
	eventTrigger(Name);
}