var tableVisible = true;
document.getElementById('showTable').addEventListener('click', function() {
	if(tableVisible){
		tableVisible = false;
		document.getElementById('showTable').innerHTML = 'Show Table';
		document.getElementById('dataTable').style.display = 'none';
		document.getElementById('tableScrollableContainer').style.display = 'none';		
	}else{
		tableVisible = true;
		document.getElementById('showTable').innerHTML = 'Hide Table';
		document.getElementById('dataTable').style.display = 'block';
		document.getElementById('tableScrollableContainer').style.display = 'block';
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
