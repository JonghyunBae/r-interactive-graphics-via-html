
document.getElementById('showTable').addEventListener('click', function() {

     //   msgShow = true;
     //   writeMsg(msgLayer);
	//document.getElementById('msgContainer').style.visibility = 'visible'; 
//	document.getElementById('dataTable').style.visibility = 'visible'; 
	 document.getElementById('dataTable').style.display = 'block';
	 document.getElementById('tableScrollableContainer').style.display = 'block';
	// document.getElementById('tableScrollingArea').style.display = 'block';
	 
}, false);   
   
document.getElementById('hideTable').addEventListener('click', function() {
   //     msgShow = false;
    //      msgLayer.clear();
	//document.getElementById('msgContainer').style.visibility = 'hidden'; 
//	document.getElementById('dataTable').style.visibility = 'hidden'; 
	 document.getElementById('dataTable').style.display = 'none';
	document.getElementById('tableScrollableContainer').style.display = 'none';
	// document.getElementById('tableScrollingArea').style.display = 'none';
	
}, false);   


