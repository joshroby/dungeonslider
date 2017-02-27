var handlers = {

	slide: function(direction,index) {
		console.log("Sliding",index,direction);
		slide(direction,index);
		view.toggleSliderButtons();
		view.refreshGrid();
	},
	
	skipTurn: function() {
		console.log('skip!');
		view.toggleSliderButtons();
		moves();
		view.refreshGrid();
	},


}