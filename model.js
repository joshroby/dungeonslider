

var grid = [];
var heroes = {};
var dungeonLevel = 1;
var treasureTotal = 0;
var heroMoves = {};
var exitDown = {};
	
function Room(level) {

	this.exits = {
		north: false,
		south: false,
		east: false,
		west: false,
	};
	for (e=0;e<10;e++) {
		var direction = ["north","south","east","west"][Math.random() * 4 << 0];
		this.exits[direction] = true;
		e += Math.random() * Math.min(20,level) << 0;
	};

	this.treasure = false;
	this.monster = false;
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
	
	this.loot = function(type) {
		if (type == undefined) {type = ["weapon","armor","potion"][Math.random() * 3 << 0]};
		
		var random = ( Math.random() * 5 << 0 ) + ( Math.random() * 5 << 0 ) + ( Math.random() * 5 << 0 )
		
		if (type === "weapon" && random > this.weapon) {
			this.weapon++;
			new Audio('assets/sword.mp3').play()
			console.log(this.type,"found a",type,"upgrade!");
		}
		
		if (type === "armor" && random > this.armor) {
			this.armor++;
			new Audio('assets/sword.mp3').play()
			console.log(this.type,"found a",type,"upgrade!");
		}
		
		if (type === "potion") {
			this.hitPoints = Math.min(150,this.hitPoints + 50);
			console.log(this.type,"found a",type,"!");
		}
		
	};
	
	this.move = function(display) {
		var start = grid[this.x][this.y];
		var look = {here: [start,start],north:[start],south:[start],east:[start],west:[start]};
		
		// Look North
		for (i=1;i<5 && this.x-i>-1;i++) {
			var target = grid[this.x-i][this.y];
			if (look.north[i-1].exits.north && target.exits.south) {
				look.north.push(target);
			} else {
				i = 5;
			}
		};
		
		// Look South
		for (i=1;i<5 && this.x+i < grid.length;i++) {
			var target = grid[this.x+i][this.y];
			if (look.south[i-1].exits.south && target.exits.north) {
				look.south.push(target);
			} else {
				i = 5;
			}
		};
		
		// Look West
		for (i=1;i<5 && this.y-i > -1;i++) {
			var target = grid[this.x][this.y-i];
			if (look.west[i-1].exits.west && target.exits.east) {
				look.west.push(target);
			} else {
				i = 5;
			}
		};
		
		// Look East
		for (i=1;i<5 && this.y+i < grid[0].length;i++) {
			var target = grid[this.x][this.y+i];
			if (look.east[i-1].exits.east && target.exits.west) {
				look.east.push(target);
			} else {
				i = 5;
			}
		};
		
		for (i in look) {look[i].shift();look[i].reverse()};
		
		// What is in the visible rooms?
		var targets = {here:{monster:10,treasure:10,tank:0,patient:100,stairs:10},north:{monster:10,treasure:10,tank:0,patient:100,stairs:10},south:{monster:10,treasure:10,tank:0,patient:100,stairs:10},east:{monster:10,treasure:10,tank:0,patient:100,stairs:10},west:{monster:10,treasure:10,tank:0,patient:100,stairs:10}};
		for (i in look) {
			for (n in look[i]) {
				if (look[i][n].monster) {
					targets[i].monster = look[i].length - n;
				};
				if (look[i][n].treasure) {
					targets[i].treasure = look[i].length - n;
				};
				if (look[i][n].stairs) {
					targets[i].stairs = look[i].length - n;
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
		console.log(this.type,"targets:",targets);
		
		var directionClosestMonster = undefined;
		if (targets.here.monster !== 10 && targets.here.monster < targets.south.monster && targets.here.monster < targets.east.monster && targets.here.monster < targets.west.monster) {directionClosestMonster = "stayput"
		} else if (targets.north.monster !== 10 && targets.north.monster < targets.south.monster && targets.north.monster < targets.east.monster && targets.north.monster < targets.west.monster) {directionClosestMonster = "north"
		} else if (targets.south.monster !== 10 && targets.south.monster < targets.north.monster && targets.south.monster < targets.east.monster && targets.south.monster < targets.west.monster) {directionClosestMonster = "south"
		} else if (targets.east.monster !== 10 && targets.east.monster < targets.north.monster && targets.east.monster < targets.south.monster && targets.east.monster < targets.west.monster) {directionClosestMonster = "east"
		} else if (targets.west.monster !== 10 && targets.west.monster < targets.north.monster && targets.west.monster < targets.east.monster && targets.west.monster < targets.south.monster) {directionClosestMonster = "west"
		};
		
		var directionClosestTreasure = undefined;
		if (targets.here.treasure !== 10 && targets.here.treasure < targets.south.treasure && targets.here.treasure < targets.east.treasure && targets.here.treasure < targets.west.treasure) {directionClosestTreasure = "stayput"
		} else if (targets.north.treasure !== 10 && targets.north.treasure < targets.south.treasure && targets.north.treasure < targets.east.treasure && targets.north.treasure < targets.west.treasure) {directionClosestTreasure = "north"
		} else if (targets.south.treasure !== 10 && targets.south.treasure < targets.north.treasure && targets.south.treasure < targets.east.treasure && targets.south.treasure < targets.west.treasure) {directionClosestTreasure = "south"
		} else if (targets.east.treasure !== 10 && targets.east.treasure < targets.north.treasure && targets.east.treasure < targets.south.treasure && targets.east.treasure < targets.west.treasure) {directionClosestTreasure = "east"
		} else if (targets.west.treasure !== 10 && targets.west.treasure < targets.north.treasure && targets.west.treasure < targets.east.treasure && targets.west.treasure < targets.south.treasure) {directionClosestTreasure = "west"
		};
		
		var directionLowHealth = undefined;
		if (targets.here.patient !== 100 && targets.here.patient < targets.south.patient && targets.here.patient < targets.east.patient && targets.here.patient < targets.west.patient) {directionLowHealth = "stayput"
		} else if (targets.north.patient !== 100 && targets.north.patient < targets.south.patient && targets.north.patient < targets.east.patient && targets.north.patient < targets.west.patient) {directionLowHealth = "north"
		} else if (targets.south.patient !== 100 && targets.south.patient < targets.north.patient && targets.south.patient < targets.east.patient && targets.south.patient < targets.west.patient) {directionLowHealth = "south"
		} else if (targets.east.patient !== 100 && targets.east.patient < targets.north.patient && targets.east.patient < targets.south.patient && targets.east.patient < targets.west.patient) {directionLowHealth = "east"
		} else if (targets.west.patient !== 100 && targets.west.patient < targets.north.patient && targets.west.patient < targets.east.patient && targets.west.patient < targets.south.patient) {directionLowHealth = "west"
		};
		
		var directionHighHealth = undefined;
		if (targets.here.tank !== 100 && targets.here.tank < targets.south.tank && targets.here.tank < targets.east.tank && targets.here.tank < targets.west.tank) {directionHighHealth = "stayput"
		} else if (targets.north.tank !== 0 && targets.north.tank > targets.south.tank && targets.north.tank > targets.east.tank && targets.north.tank > targets.west.tank) {directionHighHealth = "north"
		} else if (targets.south.tank !== 0 && targets.south.tank > targets.north.tank && targets.south.tank > targets.east.tank && targets.south.tank > targets.west.tank) {directionHighHealth = "south"
		} else if (targets.east.tank !== 0 && targets.east.tank > targets.north.tank && targets.east.tank > targets.south.tank && targets.east.tank > targets.west.tank) {directionHighHealth = "east"
		} else if (targets.west.tank !== 0 && targets.west.tank > targets.north.tank && targets.west.tank > targets.east.tank && targets.west.tank > targets.south.tank) {directionHighHealth = "west"
		};
		
		var directionStairs = undefined;
		if (targets.here.stairs !== 10 && targets.here.stairs < targets.south.stairs && targets.here.stairs < targets.east.stairs && targets.here.stairs < targets.west.stairs) {directionStairs = "stayput"
		} else if (targets.north.stairs !== 10 && targets.north.stairs < targets.south.stairs && targets.north.stairs < targets.east.stairs && targets.north.stairs < targets.west.stairs) {directionStairs = "north"
		} else if (targets.south.stairs !== 10 && targets.south.stairs < targets.north.stairs && targets.south.stairs < targets.east.stairs && targets.south.stairs < targets.west.stairs) {directionStairs = "south"
		} else if (targets.east.stairs !== 10 && targets.east.stairs < targets.north.stairs && targets.east.stairs < targets.south.stairs && targets.east.stairs < targets.west.stairs) {directionStairs = "east"
		} else if (targets.west.stairs !== 10 && targets.west.stairs < targets.north.stairs && targets.west.stairs < targets.east.stairs && targets.west.stairs < targets.south.stairs) {directionStairs = "west"
		};
		
		console.log(this.type,directionClosestMonster,directionClosestTreasure,directionLowHealth,directionHighHealth,directionStairs);

		var direction;
		if (this.type === "Warrior") {
			if (directionClosestMonster !== undefined) {direction = directionClosestMonster;
			} else if (directionLowHealth !== undefined) {direction = directionLowHealth;
			} else if (directionStairs !== undefined) {direction = directionStairs;
			} else if (directionHighHealth !== undefined) {direction = directionHighHealth;
			};
		} else if (this.type === "Thief") {
			if (directionClosestTreasure !== undefined) {direction = directionClosestTreasure;
			} else if (directionStairs !== undefined) {direction = directionStairs;
			} else if (directionLowHealth !== undefined) {direction = directionLowHealth;
			} else if (directionHighHealth !== undefined) {direction = directionHighHealth;
			};
		} else if (this.type === "Wizard") {
			if (directionHighHealth !== undefined) {direction = directionHighHealth;
			} else if (directionStairs !== undefined) {direction = directionStairs;
			};
		} else if (this.type === "Cleric") {
			if (directionLowHealth !== undefined) {direction = directionLowHealth;
			} else if (directionHighHealth !== undefined) {direction = directionHighHealth;
			} else if (directionStairs !== undefined) {direction = directionStairs;
			};
		};
		
		heroMoves[this.type.toLowerCase()] = direction;
		this.oldX = this.x;
		this.oldY = this.y;
		
		if (direction === "north" && this.hitPoints > 0) {
			this.x--;
		} else if (direction === "south" && this.hitPoints > 0) {
			this.x++;
		} else if (direction === "east" && this.hitPoints > 0) {
			this.y++;
		} else if (direction === "west" && this.hitPoints > 0) {
			this.y--;
		}
		
		// cleric heals
		if (this.type === "Cleric") {
			for (i in heroes) {
				if (heroes[i].x === this.x && heroes[i].y === this.y && heroes[i].hitPoints < 100) {
					heroes[i].hitPoints = Math.min(100,heroes[i].hitPoints + 2);
				};
			};
		};
		if (display) {console.log('display is true');view.refreshGrid();};
	};
	
	this.goose = function() {
		var here = grid[this.x][this.y].exits;
		
		console.log('goose: ',here);
	
		if (here.north && !here.south && !here.east && !here.west) {
			this.x--;
			this.hitPoints = Math.max(0,this.hitPoints - 50);
		};
	
		if (!here.north && here.south && !here.east && !here.west) {
			this.x++;
			this.hitPoints = Math.max(0,this.hitPoints - 50);
		};
	
		if (!here.north && !here.south && !here.east && here.west) {
			this.y--;
			this.hitPoints = Math.max(0,this.hitPoints - 50);
		};
	
		if (!here.north && !here.south && here.east && !here.west) {
			this.y++;
			this.hitPoints = Math.max(0,this.hitPoints - 50);
		};
		
		view.refreshGrid();
	};
	
};

function newGame(level,x,y) {
	
	if (x == undefined ) {x = 5};
	if (y == undefined ) {y = 5};
	if (level == undefined ) {level = dungeonLevel};
	
	console.log('new');
	document.getElementById('levelHead').innerHTML = "Dungeon Level " + level;

	grid = [];
	rooms = [];

	for (i=0;i<x;i++) {
		var newRow = [];
		for (n=0;n<y;n++) {
			var newRoom = new Room(level);
			newRow.push(newRoom);
			rooms.push(newRoom);
		}
		grid.push(newRow);
	};
	
	for (i=0;i<Math.min(20,level);i++) {
		grid[Math.random() * grid.length << 0][Math.random() * grid[0].length << 0].treasure = true;
	};
	
	for (i=0;i<level;i++) {
		// different monsters can 'cost' different amounts of levels
		grid[Math.random() * grid.length << 0][Math.random() * grid[0].length << 0].monster = true;
	};
	
	exitDown.x = Math.random() *  grid.length << 0;
	exitDown.y = Math.random() *  grid[0].length << 0;
	grid[exitDown.x][exitDown.y].trapdoor = true;
	
	if (level = 1 && grid[2][2].monster) {
		grid[2][2].monster = false;
		grid[1][1].monster = true;
	};
	
	if (level = 1 && grid[2][2].treasure) {
		grid[2][2].treasure = false;
		grid[3][3].treasure = true;
	};
	
	treasureTotal = 0;
	for (i in rooms) {
		if (rooms[i].treasure) {treasureTotal++};
	};
	if (treasureTotal === 0) {
		grid[Math.random() * grid.length << 0][Math.random() * grid[0].length << 0].stairs = true;
	};
	
	if (Object.keys(heroes).length === 0) {
	
		var heroTypes = {warrior:1,thief:1,cleric:1,wizard:1};
	
		for (i in heroTypes) {
			var newHero = new Hero(i);
			heroes[i] = newHero;
		};
		
	};
	
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
	} else if (direction === "skip") {
	} else {
		console.log("Error: invalid direction to slide in.");
	};
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
		if (heroes[i].x > grid.length-1) {heroes[i].x = 0};
		if (heroes[i].y > grid[0].length-1) {heroes[i].y = 0};
	};
	
	// Heroes Move
	for (i in heroes) {
		heroes[i].move(false);
	};
	for (i in heroes) {
		heroes[i].x = heroes[i].oldX;
		heroes[i].y = heroes[i].oldY;
	};
	console.log(heroMoves);
	delay = 250;
	for (i in heroMoves) {
		if (heroMoves[i] !== undefined) {
			var timedEvent = setTimeout(heroes[i].move.bind(heroes[i],true),delay);
			delay += 250;
		};
	};
	var monstersAttackEvent = setTimeout(dungeonMoves,delay);
	view.refreshGrid();
};


function dungeonMoves() {
	console.log("Dungeon Moves");
	for (i in heroes) {
		if (grid[heroes[i].x][heroes[i].y].monster) {
			heroes[i].hitPoints -= ( 10 +  Math.random() * 50 ) / heroes[i].armor << 0 ;
			if (Math.random() * 10 < heroes[i].weapon && heroes[i].hitPoints > 0) {
				grid[heroes[i].x][heroes[i].y].monster = false;
				lootTile(heroes[i].x,heroes[i].y);
				view.refreshGrid();
			};
		};
	};
	for (i in heroes) {
		if (grid[heroes[i].x][heroes[i].y].treasure) {
			grid[heroes[i].x][heroes[i].y].treasure = false;
			lootTile(heroes[i].x,heroes[i].y);
			treasureTotal--;
			if (treasureTotal < 1) {
				grid[exitDown.x][exitDown.y].trapdoor = false;
				grid[exitDown.x][exitDown.y].stairs = true;
			};
			view.refreshGrid();
		};
	};

//	check if all alive heroes are at stairs, if so, new level	
	var atStairs = 0;
	for (i in heroes) {
		if (grid[heroes[i].x][heroes[i].y].stairs) {atStairs++};
	};
	if (atStairs === 4) {
		dungeonLevel++;
		newGame();
	};

	view.toggleSliderButtons();
	view.refreshHeroes();
};

function lootTile(x,y) {
	for (i in heroes) {
		if (heroes[i].x === x && heroes[i].y === y) {heroes[i].loot()};
	}
};

function gooseAll() {
	for (i in heroes) {
		heroes[i].goose();
	};
};