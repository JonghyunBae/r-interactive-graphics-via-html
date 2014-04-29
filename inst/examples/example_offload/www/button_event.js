//This JS file is not used.
function addButtonEvent()
{
	var tableVisible = true;
	document.getElementById('showTable').addEventListener('click', function() {
		if(tableVisible){
			tableVisible = false;
			document.getElementById('showTable').innerHTML = 'Show Table';
			document.getElementById('table1').style.display = 'none';
		//	document.getElementById('scrollableContainer').style.display = 'none';		
		}else{
			tableVisible = true;
			document.getElementById('showTable').innerHTML = 'Hide Table';
			document.getElementById('table1').style.display = 'block';
		//	document.getElementById('scrollableContainer').style.display = 'block';
		}
	}, false);   
	document.getElementById('saveImg').addEventListener('click', function() {
		for(var i = 0 ; i < objArr.length ; i ++)
		{
			objArr[i].stage.toDataURL({
		        callback: function(dataUrl) {         
		            window.open(dataUrl);
		          }
		    });
		}
	}, false);
}
 
