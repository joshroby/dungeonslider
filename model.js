

var grid = [];
var heroes = {};
	
function Room() {
	this.exits = {
		north: Math.random() * 3 << 0 > 0,
		south: Math.random() * 3 << 0 > 0,
		east: Math.random() * 3 << 0 > 0,
		west: Math.random() * 3 << 0 > 0,
	};
	this.treasure = Math.random() * 8 << 0 < 1;
	this.monster = Math.random() * 8 << 0 < 1;
	this.designation = ["a","b","c","d","e","f","g","h","i","j","k",'l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'][Math.random() * 26 << 0];
	this.designation += ["a","b","c","d","e","f","g","h","i","j","k",'l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'][Math.random() * 26 << 0];
};

function Hero(type) {
	this.x = 2;
	this.y = 2;
	this.hitPoints = 100;
	if (type === "warrior") {
		this.armor = 3;
		this.weapon = 2;
		this.type = "Warrior";
	} else if (type === "thief") {
		this.armor = 2;
		this.weapon = 3;
		this.type = "Thief";
	} else if (type === "wizard") {
		this.armor = 1;
		this.weapon = 4;
		this.type = "Wizard";
	} else if (type === "cleric") {
		this.armor = 4;
		this.weapon = 1;
		this.type = "Cleric";
	};
	
	this.move = function() {
		console.log(this.type,"moves!");
		var start = grid[this.x][this.y];
		var look = {north:[start],south:[start],east:[start],west:[start]};
		
		// Look North
		for (i=0;i<5;i++) {
			var target = grid[this.x-i-1][this.y];
			if (look.north[i].exits.north && target.exits.south) {
				look.north.push(target);
			} else {
				i = 5;
			}
			if (this.x-i === 1) {i=5};
		};
		
		// Look South
		for (i=0;i<5;i++) {
			var target = grid[this.x+i+1][this.y];
			if (look.south[i].exits.south && target.exits.north) {
				look.south.push(target);
			} else {
				i = 5;
			}
			if (this.x+i+2 === grid.length) {i=5};
		};
		
		// Look West
		for (i=0;i<5;i++) {
			var target = grid[this.x][this.y-i-1];
			if (look.west[i].exits.west && target.exits.east) {
				look.west.push(target);
			} else {
				i = 5;
			}
			if (this.y-i === 1) {i=5};
		};
		
		// Look East
		for (i=0;i<5;i++) {
			var target = grid[this.x][this.y+1+i];
			if (look.east[i].exits.east && target.exits.west) {
				look.east.push(target);
			} else {
				i = 5;
			}
			if (this.y+i+2 === grid.length) {i=5};
		};
		
		for (i in look) {look[i].shift();look[i].reverse()};
		
		// What is in the visible rooms?
		var targets = {north:{monster:10,treasure:10,tank:0,patient:100},south:{monster:10,treasure:10,tank:0,patient:100},east:{monster:10,treasure:10,tank:0,patient:100},west:{monster:10,treasure:10,tank:0,patient:100}};
		for (i in look) {
			for (n in look[i]) {
				if (look[i][n].monster) {
					targets[i].monster = look[i].length - n;
				};
				if (look[i][n].treasure) {
					targets[i].treasure = look[i].length - n;
				};
				for (t in heroes) {
					if (look[i][n] === grid[heroes[t].x][heroes[t].y]) {
						if (targets[i].tank > heroes[t].hitPoints) {
						} else {
							targets[i].tank = heroes[t].hitPoints + heroes[t].armor;
						};
						if (targets[i].patient < heroes[t].hitPoints) {
						} else {
							targets[i].patient = heroes[t].hitPoints;
						};
					};
				}
			};
		};
		console.log("targets",targets);
		
		var directionClosestMonster = undefined;
		if (targets.north.monster !== 10 && targets.north.monster < targets.south.monster && targets.north.monster < targets.east.monster && targets.north.monster < targets.west.monster) {directionClosestMonster = "north"
		} else if (targets.south.monster !== 10 && targets.south.monster < targets.north.monster && targets.south.monster < targets.east.monster && targets.south.monster < targets.west.monster) {directionClosestMonster = "south"
		} else if (targets.east.monster !== 10 && targets.east.monster < targets.north.monster && targets.east.monster < targets.south.monster && targets.east.monster < targets.west.monster) {directionClosestMonster = "east"
		} else if (targets.west.monster !== 10 && targets.west.monster < targets.north.monster && targets.west.monster < targets.east.monster && targets.west.monster < targets.south.monster) {directionClosestMonster = "west"
		};
		
		var directionClosestTreasure = undefined;
		if (targets.north.treasure !== 10 && targets.north.treasure < targets.south.treasure && targets.north.treasure < targets.east.treasure && targets.north.treasure < targets.west.treasure) {directionClosestTreasure = "north"
		} else if (targets.south.treasure !== 10 && targets.south.treasure < targets.north.treasure && targets.south.treasure < targets.east.treasure && targets.south.treasure < targets.west.treasure) {directionClosestTreasure = "south"
		} else if (targets.east.treasure !== 10 && targets.east.treasure < targets.north.treasure && targets.east.treasure < targets.south.treasure && targets.east.treasure < targets.west.treasure) {directionClosestTreasure = "east"
		} else if (targets.west.treasure !== 10 && targets.west.treasure < targets.north.treasure && targets.west.treasure < targets.east.treasure && targets.west.treasure < targets.south.treasure) {directionClosestTreasure = "west"
		};
		
		var directionLowHealth = undefined;
		if (targets.north.patient !== 100 && targets.north.patient < targets.south.patient && targets.north.patient < targets.east.patient && targets.north.patient < targets.west.patient) {directionLowHealth = "north"
		} else if (targets.south.patient !== 100 && targets.south.patient < targets.north.patient && targets.south.patient < targets.east.patient && targets.south.patient < targets.west.patient) {directionLowHealth = "south"
		} else if (targets.east.patient !== 100 && targets.east.patient < targets.north.patient && targets.east.patient < targets.south.patient && targets.east.patient < targets.west.patient) {directionLowHealth = "east"
		} else if (targets.west.patient !== 100 && targets.west.patient < targets.north.patient && targets.west.patient < targets.east.patient && targets.west.patient < targets.south.patient) {directionLowHealth = "west"
		};
		
		var directionHighHealth = undefined;
		if (targets.north.patient !== 0 && targets.north.patient > targets.south.patient && targets.north.patient > targets.east.patient && targets.north.patient > targets.west.patient) {directionHighHealth = "north"
		} else if (targets.south.patient !== 0 && targets.south.patient > targets.north.patient && targets.south.patient > targets.east.patient && targets.south.patient > targets.west.patient) {directionHighHealth = "south"
		} else if (targets.east.patient !== 0 && targets.east.patient > targets.north.patient && targets.east.patient > targets.south.patient && targets.east.patient > targets.west.patient) {directionHighHealth = "east"
		} else if (targets.west.patient !== 0 && targets.west.patient > targets.north.patient && targets.west.patient > targets.east.patient && targets.west.patient > targets.south.patient) {directionHighHealth = "west"
		};

		var direction;
		if (this.type === "Warrior") {
			if (directionClosestMonster !== undefined) {direction = directionClosestMonster;
			} else if (directionLowHealth !== undefined) {direction = directionLowHealth;
			} else if (directionHighHealth !== undefined) {direction = directionHighHealth;
			};
		} else if (this.type === "Thief") {
			if (directionClosestTreasure !== undefined) {direction = directionClosestTreasure;
			} else if (directionLowHealth !== undefined) {direction = directionLowHealth;
			} else if (directionHighHealth !== undefined) {direction = directionHighHealth;
			};
		} else if (this.type === "Wizard") {
			if (directionHighHealth !== undefined) {direction = directionHighHealth;
			};
		} else if (this.type === "Cleric") {
			if (directionLowHealth !== undefined) {direction = directionLowHealth;
			} else if (directionHighHealth !== undefined) {direction = directionHighHealth;
			};
		};
		
		console.log(this.type,"moves",direction);
		if (direction === "north") {
			this.x--;
		} else if (direction === "south") {
			this.x++;
		} else if (direction === "east") {
			this.y++;
		} else if (direction === "west") {
			this.y--;
		}
		
		// check for treasure and loot
		// cleric heals
		
		view.refreshGrid();
	};
	
};

function newGame(x,y) {
	
	if (x == undefined ) {x = 5};
	if (y == undefined ) {y = 5};

	grid = [];

	for (i=0;i<5;i++) {
		var newRow = [];
		for (n=0;n<5;n++) {
			newRow.push(new Room());
		}
		grid.push(newRow);
	};
	
	grid[2][2].monster = false;
	grid[2][2].treasure = false;
	
	var heroTypes = {warrior:1,thief:1,wizard:1,cleric:1};
	
	for (i in heroTypes) {
		var newHero = new Hero(i);
		heroes[i] = newHero;
	}
	
	view.refreshGrid();
	view.refreshHeroes();
};

function slide(direction,index) {
	var temp = [];
	if (direction === "up") {
		for (i=0;i<grid.length;i++) {
			temp[i] = grid[i][index];
		}
		temp.push(temp[0]);
		temp.shift();
		for (i=0;i<grid.length;i++) {
			grid[i][index] = temp[i];
		}
	} else if (direction === "down") {
		for (i=0;i<grid.length;i++) {
			temp[i] = grid[i][index];
		}
		temp.unshift(temp[4]);
		temp.pop();
		for (i=0;i<grid.length;i++) {
			grid[i][index] = temp[i];
		}
	} else if (direction === "right") {
		grid[index].unshift(grid[index][4]);
		grid[index].pop();
	} else if (direction === "left") {
		grid[index].push(grid[index][0]);
		grid[index].shift()
	} else {
		console.log("Error: invalid direction to slide in.");
	};
	var delay = 0;
	for (i in heroes) {
		if (heroes[i].x === index && direction === "left") {
			heroes[i].y--;
		} else if (heroes[i].x === index && direction === "right") {
			heroes[i].y++;
		} else if (heroes[i].y === index && direction === "up") {
			heroes[i].x--;
		} else if (heroes[i].y === index && direction === "down") {
			heroes[i].x++;
		}
		if (heroes[i].x < 0) {heroes[i].x = grid.length-1};
		if (heroes[i].y < 0) {heroes[i].y = grid[0].length-1};
		var timedEvent = setTimeout(heroes[i].move.bind(heroes[i]),1000+delay);
		delay += 500;
	};
	var monstersAttackEvent = setTimeout(dungeonMoves,3000);
};

function dungeonMoves() {
	console.log("Monsters Attack! Rar!");
	for (i in heroes) {
		if (grid[heroes[i].x][heroes[i].y].monster) {
			heroes[i].hitPoints -= ( 10 +  Math.random() * 20 << 0 ) / heroes[i].armor << 0 ;
			grid[heroes[i].x][heroes[i].y].monster = false;
		};
	};
	for (i in heroes) {
		if (grid[heroes[i].x][heroes[i].y].treasure) {
			heroes[i].gold++;
			grid[heroes[i].x][heroes[i].y].treasure = false;
//			check if all treasure is collected; if so, reveal stairs down			
			view.refreshGrid();
		};
	};
	view.refreshHeroes();
};