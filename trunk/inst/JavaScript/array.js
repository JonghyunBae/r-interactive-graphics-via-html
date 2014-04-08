function mulArr (array1, dimension1, array2, dimension2)
{
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

function makeOrthogonalArr (array, dimension)
{
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

function printArr (array, dimension)
{
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