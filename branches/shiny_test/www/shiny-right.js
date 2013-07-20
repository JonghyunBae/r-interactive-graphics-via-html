$(document).on("click", "button.increment", function(evt) {

  // evt.target is the button that was clicked
  var el = $(evt.target);
//  alert(el.text());
  // Set the button's text to its current value plus 1
  el.text(parseInt(el.text()) + 2);

  // Raise an event to signal that the value changed
  el.trigger("change");
});

var incrementBinding = new Shiny.InputBinding();
$.extend(incrementBinding, {
  find: function(scope) {
    return $(scope).find(".increment");
  },
  getValue: function(el) {
    return parseInt($(el).text());
  },
  setValue: function(el, value) {
    $(el).text(value);
  },
  subscribe: function(el, callback) {
    $(el).on("change.incrementBinding", function(e) {
      callback();
    });
  },
  unsubscribe: function(el) {
    $(el).off(".incrementBinding");
  }
});

Shiny.inputBindings.register(incrementBinding);

var cnt=0;
var tempHidden = new Array();
var save = new Array();
var rightOutputBinding = new Shiny.OutputBinding();

var tempHidden = new Array();
rightOutputBinding.find = function(scope) {
	  return $(scope).find(".right-output");
	};
	rightOutputBinding.renderValue = function(el, data) {
		if(cnt>0 ){//if(data change)
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
			scatter1._initScatter(1, tempData, {x: data[0], y: data[1], color: data[2], legend: data[3], width: data[4], height: data[5]});
			scatter1.draw(1);
			eventTrigger(scatter1);	
			hist2._initHist(2, tempData, {bin: data[6], x: data[0], width: data[4], height: data[5]});
		    hist2.draw(2);
		    eventTrigger(hist2);	
		    box3._initBox(3, tempData, {x: data[0], y: data[1], width: data[4], height: data[5]});
		    box3.draw(3);
		    eventTrigger(box3);
		}else{
			
		}
		cnt++;
    
		
		};	

Shiny.outputBindings.register(rightOutputBinding, 'createDiv.rightOutputBinding');













