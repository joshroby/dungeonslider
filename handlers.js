var handlers = {

	slide: function(direction,index) {
		console.log("Sliding",index,direction);
		slide(direction,index);
		view.refreshGrid();
	}


}