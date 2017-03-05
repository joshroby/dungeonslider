var handlers = {

	slide: function(direction,index) {
		new Audio('assets/slide.mp3').play()
		slide(direction,index);
		view.toggleSliderButtons();
		view.refreshGrid();
	},
	
	skipTurn: function() {
		console.log('skip!');
		view.toggleSliderButtons();
		slide("skip");
		view.refreshGrid();
	},

	goose: function() {
		console.log("Honk!");
		new Audio('assets/honk.mp3').play()
		gooseAll();
	},
	
	tunnel: function() {
		console.log("Tunnel!");
	},

}