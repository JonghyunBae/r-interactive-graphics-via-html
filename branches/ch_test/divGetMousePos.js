/*
 Here add the ID of the HTML elements for which to show the mouse coords
 Within quotes, separated by comma.
 E.g.:   ['imgid', 'divid'];
*/
var elmids = ['scatterContainer', 'histContainer'];

var x, y = 0;       // variables that will contain the coordinates

// Get X and Y position of the elm (from: vishalsays.wordpress.com)
function getXYpos(elm) {
  x = elm.offsetLeft;        // set x to elm’s offsetLeft
  y = elm.offsetTop;         // set y to elm’s offsetTop

  elm = elm.offsetParent;    // set elm to its offsetParent

  //use while loop to check if elm is null
  // if not then add current elm’s offsetLeft to x
  //offsetTop to y and set elm to its offsetParent
  while(elm != null) {
    x = parseInt(x) + parseInt(elm.offsetLeft);
    y = parseInt(y) + parseInt(elm.offsetTop);
    elm = elm.offsetParent;
  }

  // returns an object with "xp" (Left), "=yp" (Top) position
  return {'xp':x, 'yp':y};
}

// Get X, Y coords, and displays Mouse coordinates
function getCoords(e) {
 // coursesweb.net/
  var xy_pos = getXYpos(this);

  // if IE
  if(navigator.appVersion.indexOf("MSIE") != -1) {
    // in IE scrolling page affects mouse coordinates into an element
    // This gets the page element that will be used to add scrolling value to correct mouse coords
    var standardBody = (document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;

    x = event.clientX + standardBody.scrollLeft;
    y = event.clientY + standardBody.scrollTop;
  }
  else {
    x = e.pageX;
    y = e.pageY;
  }

  x = x - xy_pos['xp'];
  y = y - xy_pos['yp'];

  // displays x and y coords in the #coords element
  document.getElementById('coords').innerHTML = 'X= '+ x+ ' ,Y= ' +y;
}

// register onmousemove, and onclick the each element with ID stored in elmids
for(var i=0; i<elmids.length; i++) {
  if(document.getElementById(elmids[i])) {
    // calls the getCoords() function when mousemove
    document.getElementById(elmids[i]).onmousemove = getCoords;

    // execute a function when click
    document.getElementById(elmids[i]).onclick = function() {
      document.getElementById('regcoords').value = x+ ' , ' +y;
    };
  }
}


