var Hist = {};		

(function() {	
	
	Hist = function(mainArr, optionObj) {
		this._initHist(optionObj);
    };
	Hist.prototype = {
			_initHist: function(optionObj) {
				this.bin = optionObj.bin || 1;
	            this.width = optionObj.width || plotWidth; //plot width
	            this.height = optionObj.height || plotHeight; //plot height
	            this.plotXMargin=this.width*0.1; //canvas left, right margin
	            this.plotYMargin=this.height*0.1; //canvas top, bottom margin
	            this.plotLength=this.width*0.05; //margin from plot box
	            for(var i = 0 ; i < labelArr.length ; i ++)
	            {
	            	if(labelArr[i].toLowerCase()==optionObj.x.toLowerCase()){	            		
	            		 this.x =  i;
	            		 break;
	            	}
	            	if(i==labelArr.length-1){
	            		alert('retype x label');
	            	}
	            }
	           
	            var xMax = findMaxValue(mainArr[this.x],this.bin);
	            var yMax= histFindMaxValue(xMax,mainArr[this.x],this.bin);
				this.barWidth = optionObj.barWidth || ( this.width /parseInt(xMax/this.bin));
				
				
				
				
				var histArr = new Array(10);
				
				
				
				var freq = new Array();
				var histHasArr=make2DArr(parseInt(xMax/this.bin +1));
				var cnt=0;
				var col = 0;
				for (var i=0; i<parseInt(xMax/this.bin); i++)//tmpHistArr initialization
				{
					freq[i]=0;
				}		
				for(cnt=0; cnt< parseInt(xMax/this.bin ); cnt++)//count how many data in certain range and save the value into freq array
				{
					for( var i = 0 ; i < mainArr[this.x].length; i++)
					{	
						if(mainArr[this.x][i]>=cnt*this.bin && mainArr[this.x][i]<(cnt+1)*this.bin)
						{
							freq[cnt]++;
							histHasArr[cnt][col] = i;
							col++;
						}
					}
					col = 0;
				}	
				alert(freq);
				alert(histArr);
			
				
				 
				 
	        },				
			doIt: function() { 
				alert('do it'); 
			},
			draw: function(){
				alert('hist is drawn');
			},
			update: function(){
				alert('hist is updated');				
			}
	};
})();


function findMaxValue(Data,bin)
{
	var maxValue=Data[0];

	var returnValue;
	for(var i=1; i<Data.length; i++)
	{
	//	document.write(maxValue + ", " +  Data[i] + "<br>");
		if(Data[i]>maxValue)
		{
//					document.write("dddddddddddddd");
			maxValue=Data[i];					
		}
//				document.write(maxValue + ", " +  Data[i] + "<br>");
	}
	returnValue=parseInt(maxValue+1);	
	for(var i=0; i<bin; i++) //until mod ==0
	{
		returnValue=returnValue+i;
		if((returnValue% bin) == 0)
		{
			break;
		}				
	}	
	return returnValue;
}
function histFindMaxValue(xMaxHist, xData,bin)
{
	var maxValue=0;
	var tmpHistArr = new Array();
	var cnt=0;
	for (var i=0; i<parseInt(xMaxHist/bin +1); i++)//tmpHistArr initialization
	{
		tmpHistArr[i]=0;
	}			
	for(cnt=0; cnt< parseInt(xMaxHist/bin +1); cnt++)
	{
		for( var i = 0 ; i < xData.length; i++)
		{	
			if(xData[i]>=cnt*bin && xData[i]<(cnt+1)*bin)
			{
				tmpHistArr[cnt]++;
			}
		}
	}
	for(var i=0; i<parseInt(xMaxHist/bin +1); i++)
	{
		if(tmpHistArr[i]>maxValue)
		{
			maxValue=tmpHistArr[i];					
		}
	}	
	return maxValue;
}