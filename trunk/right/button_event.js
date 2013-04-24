/**
 * Button_eventJS JavaScript Library
 * 
 * Copyright 2013, The RIGHT team
 * Licensed under the MIT or GPL Version 2 licenses.
 *
 * Copyright (C) 2013 by The RIGHT team
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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


