var handlers = {

	slide: function(direction,index) {
		slide(direction,index);
		view.toggleSliderButtons();
		view.refreshGrid();
	},
	
	skipTurn: function() {
		console.log('skip!');
		view.toggleSliderButtons();
		slide();
		view.refreshGrid();
	},

	goose: function() {
		console.log("Honk!");
	},
	
	tunnel: function() {
		console.log("Tunnel!");
	},

}