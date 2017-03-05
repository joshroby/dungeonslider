var view = {

	refreshGrid: function() {
// 		console.log('Refresh Grid!');
		for (x=0;x<5;x++) {
			for (y=0;y<5;y++) {
				var row = ["A","B","C","D","E"][x]
				var cellId = 'grid' + row + y;
				var cell = document.getElementById('gameGridDiv').children[x+1].children[y+1];
				cell.style.backgroundImage = 'url("assets/tile-room.png")';
				cell.style.backgroundSize = '100% 100%';
				cell.innerHTML = '';
				if (true) {
					var designation = document.createElement('span');
					designation.className = 'debug';
					designation.innerHTML = grid[x][y].designation;
					cell.appendChild(designation);
				};
				if (grid[x][y].exits.north) {
					var exitNorth = document.createElement('img');
					exitNorth.id = cellId + 'exitNorth';
					exitNorth.className = 'exitNorth, tileImg';
					exitNorth.src = 'assets/exit-n.png';
					cell.appendChild(exitNorth);
				};
				if (grid[x][y].exits.south) {
					var exitSouth = document.createElement('img');
					exitSouth.id = cellId + 'exitSouth';
					exitSouth.className = 'exitSouth, tileImg';
					exitSouth.src = 'assets/exit-s.png';
					cell.appendChild(exitSouth);		
				};
				if (grid[x][y].exits.east) {
					var exitEast = document.createElement('img');
					exitEast.id = cellId + 'exitEast';
					exitEast.className = 'exitEast, tileImg';
					exitEast.src = 'assets/exit-e.png';
					cell.appendChild(exitEast);
				};
				if (grid[x][y].exits.west) {
					var exitWest = document.createElement('img');
					exitWest.id = cellId + 'exitWest';
					exitWest.className = 'exitWest, tileImg';
					exitWest.src = 'assets/exit-w.png';
					cell.appendChild(exitWest);
				};
				if (grid[x][y].trapdoor) {
					var trapdoor = document.createElement('img');
					trapdoor.id = cellId + 'trapdoor';
					trapdoor.className = 'trapdoor, tileImg';
					trapdoor.src = 'assets/trapdoor.png';
					cell.appendChild(trapdoor);
				};
				if (grid[x][y].stairs) {
					var stairs = document.createElement('img');
					stairs.id = cellId + 'stairs';
					stairs.className = 'stairs, tileImg';
					stairs.src = 'assets/stairs.png';
					cell.appendChild(stairs);
				};
				if (grid[x][y].treasure) {
					var treasure = document.createElement('img');
					treasure.id = cellId + 'treasure';
					treasure.className = 'treasure, tileImg';
					treasure.src = 'assets/treasure.png';
					cell.appendChild(treasure);
				};
				if (grid[x][y].monster) {
					var monster = document.createElement('img');
					monster.id = cellId + 'monster';
					monster.className = 'monster, tileImg';
					monster.src = 'assets/monster.png';
					cell.appendChild(monster);
				};
				for (i in heroes) {
					if (heroes[i].x === x && heroes[i].y === y) {
						var hero = document.createElement('img');
						hero.id = cellId + i;
						hero.className = "tileImg " + i;
						hero.src = 'assets/' + i + ".png";
						cell.appendChild(hero);
					};
				};

			};
		};
	},
	
	refreshHeroes: function() {
		document.getElementById('warriorHitPoints').innerHTML = heroes.warrior.hitPoints;
		document.getElementById('warriorArmor').innerHTML = heroes.warrior.armor;
		document.getElementById('warriorWeapon').innerHTML = heroes.warrior.weapon;
		
		document.getElementById('thiefHitPoints').innerHTML = heroes.thief.hitPoints;
		document.getElementById('thiefArmor').innerHTML = heroes.thief.armor;
		document.getElementById('thiefWeapon').innerHTML = heroes.thief.weapon;
		
		document.getElementById('wizardHitPoints').innerHTML = heroes.wizard.hitPoints;
		document.getElementById('wizardArmor').innerHTML = heroes.wizard.armor;
		document.getElementById('wizardWeapon').innerHTML = heroes.wizard.weapon;
		
		document.getElementById('clericHitPoints').innerHTML = heroes.cleric.hitPoints;
		document.getElementById('clericArmor').innerHTML = heroes.cleric.armor;
		document.getElementById('clericWeapon').innerHTML = heroes.cleric.weapon;
	},
	
	toggleSliderButtons: function() {
		var toggle = document.getElementById('slideLeftAButton').disabled;
		toggle = !toggle;
		var buttons = [];
		for (x=0;x<grid.length;x++) {
			var row = ["A","B","C","D","E"][x]
			buttons.push(document.getElementById('slideLeft'+row+'Button'));
			buttons.push(document.getElementById('slideRight'+row+'Button'));
		};
		for (y=0;y<grid[0].length;y++) {
			buttons.push(document.getElementById('slideUp'+y+'Button'));
			buttons.push(document.getElementById('slideDown'+y+'Button'));
		};
		for (i in buttons) {
			buttons[i].disabled = toggle;
			if (toggle) {
				buttons[i].children[0].style.opacity = 0.5;
			} else {
				buttons[i].children[0].style.opacity = 1;
			};
		};
	},

}