function color(c, nameContext)
{
	if (nameContext == 1)
	{
		switch(c)
		{
	        case 0 : //Black
	        	context.strokeStyle = "#000000";	
	        	context.fillStyle = "#000000"; 
	        	break;
	        case 1 : //Green
	        	context.strokeStyle = "#008000";	
	        	context.fillStyle = "#008000"; 
	        	break;
	        case 2 : //Silver
	        	context.strokeStyle = "#C0C0C0";	
	        	context.fillStyle = "#C0C0C0"; 
	        	break;
	        case 3 : //Lime
	        	context.strokeStyle = "#00FF00";	
	        	context.fillStyle = "#00FF00"; 
	        	break;
	        case 4 : //Gray
	        	context.strokeStyle = "#808080";	
	        	context.fillStyle = "#808080"; 
	        	break;
	        case 5 : //Olive
	          	context.strokeStyle = "#808000";	
	        	context.fillStyle = "#808000"; 
	        	break;
	        case 6 : //Yellow
	        	context.strokeStyle = "#FFFF00";	
	        	context.fillStyle = "#FFFF00"; 
	        	break;
	        case 7 : //Maroon
	        	context.strokeStyle = "#800000";	
	        	context.fillStyle = "#800000"; 
	        	break;
	        case 8 : //Navy
	        	context.strokeStyle = "#000080";	
	        	context.fillStyle = "#000080"; 
	        	break;
	        case 9 : //Red
	        	context.strokeStyle = "#FF0000";	
	        	context.fillStyle = "#FF0000"; 
	        	break;
	        case 10 : //Blue
	        	context.strokeStyle = "#0000FF";	
	        	context.fillStyle = "#0000FF"; 
	        	break;
	        case 11 : //Purple
	        	context.strokeStyle = "#800080";	
	        	context.fillStyle = "#800080"; 
	        	break;
	        case 12 : //Teal
	        	context.strokeStyle = "#008080";	
	        	context.fillStyle = "#008080"; 
	        	break;
	        case 13 : //Fuchsia
	        	context.strokeStyle = "#FF00FF";	
	        	context.fillStyle = "#FF00FF"; 
	        	break;
	        case 14 : //Aqua
	        	context.strokeStyle = "#00FFFF";	
	        	context.fillStyle = "#00FFFF"; 
	        	break;
	        default : //Black
	        	context.strokeStyle = "#000000";	
	        	context.fillStyle = "#000000"; 
		}
	}
}