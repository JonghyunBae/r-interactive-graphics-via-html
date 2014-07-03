// array1 -> src, array2 -> dest
/*
function copyValueArr (array1, array2) {
	if (array1.length == array2.length) {
		for (var i=0; i<array1.length; i++) {
			array2[i] = array1[i];
		}
	} else {
		alert("Cannot copy arrays: the length of arrays are different");
	}
}
*/

function invertValueArr (array, numbers) {
	var returnArray = array.slice(0);
	if (numbers.length == undefined) {
		returnArray[numbers] = (returnArray[numbers] + 1) % 2; 
	} else {
		for (var i=0; i<numbers.length; i++) {
			returnArray[numbers[i]] = (returnArray[numbers[i]] + 1) % 2;
		}
	}
	return returnArray;
}

function extensionArr (numbers, length, value) {
	var returnArray = new Array(length);
	for (var i=0; i<length; i++) {
		returnArray[i] = 0;
	}
	if (numbers.length == undefined) {
		returnArray[numbers] = value;
	} else {
		for (var i=0; i<numbers.length; i++) {
			returnArray[numbers[i]] = value;
		}
	}
	return returnArray;
}

function addArr (array1, array2) {
	var returnArray;
	if (array1.length == array2.length) {
		returnArray = new Array(array1.length);
		for (var i=0; i<array1.length; i++) {
			returnArray[i] = array1[i] + array2[i];
		}
	} else {
		alert("Cannot add arrays: the length of arrays are different");
	}
	return returnArray;
}

function subtractArr (array1, array2) {
	var returnArray;
	if (array1.length == array2.length) {
		returnArray = new Array(array1.length);
		for (var i=0; i<array1.length; i++) {
			returnArray[i] = array1[i] - array2[i];			
		}
	} else {
		alert("Cannot subtract arrays: the length of arrays are different");
	}
	return returnArray;
}

function mergeParentChildArr (p2cArr, c2pArr) {
	var returnArray = new Array(p2cArr.length);
	for (var i=0; i<returnArray.length; i++) {
		returnArray[i] = new Array(c2pArr.length);
		//zero initialize
		for (var j=0; j<returnArray[i].length; j++) {
			returnArray[i][j] = 0;
		}
	}	
	for (var i=0; i<p2cArr.length; i++) {
		if (p2cArr[i].length == undefined) {
			if (p2cArr[i] != -1) {
				returnArray[i][p2cArr[i]] = 1;
			}
		} else {
			for (var j=0; j<p2cArr[i].length; j++) {
				returnArray[i][p2cArr[i][j]] = 1;
			}
		}
	}
	return returnArray;
}

function mulArr (array1, dimension1, array2, dimension2) {
	var returnArray;
	if (dimension1 == 1 && dimension2 == 2) { // 1D X 2D
		if (array1.length == array2.length) {
			returnArray = new Array(array2[0].length);
			for (var i=0; i<array2[0].length; i++) {
				var temp = 0;
				for (var j=0; j<array2.length; j++) {
					temp = temp + array1[j]*array2[j][i];
				}
				returnArray[i] = temp;
			}
		} else {
			alert("Cannot multply arrays: the length of arrays are different");
		}
	}
	return returnArray;
}

function makeOrthogonalArr (array, dimension) {
	var returnArray;
	if (dimension == 2) {
		returnArray = new Array(array[0].length);
		for (var i=0; i<returnArray.length; i++) {
			returnArray[i] = new Array(array.length);
		}
		for (var i=0; i<returnArray.length; i++) {
			for(var j=0; j<returnArray[0].length; j++) {
				returnArray[i][j] = array[j][i];
			}
		}
	}
	return returnArray;
}

function printArr (array, dimension) {
	if (dimension == 1) {
		document.write("[ ");
		for (var i=0; i<array.length; i++) {
			document.write(array[i] + " ");
		}
		document.write("]");
	} else if (dimension == 2) {
		for (var i=0; i<array.length; i++) {
			document.write("[ ");
			for (var j=0; j<array[i].length; j++) {
				document.write(array[i][j] + " ");
			}
			document.write("]");
		}
	}
}
