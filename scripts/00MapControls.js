function Initialize_MapControls() {
	var html = $('.top-controls');
	html.append('<div id="tinyUrl">Place for tiny link</div>');
	var TransformationDiv = $('<div>').addClass('map-transformation');
	TransformationDiv.append('<button type="button" class="btn btn-link" aria-expanded="false" onclick="toggleMapControls();">Show/hide map controls</button>');
	var ButtonsDiv = $('<div>').addClass('btn-group');
	ButtonsDiv.css('display','none');
	ButtonsDiv.append('<button type="button" class="btn" aria-expanded="false" onclick="moveObjectsOnMap(1,0);">Move map right</button>');
	ButtonsDiv.append('<button type="button" class="btn" aria-expanded="false" onclick="moveObjectsOnMap(-1,0);">Move map left</button>');
	ButtonsDiv.append('<button type="button" class="btn" aria-expanded="false" onclick="moveObjectsOnMap(0,1);">Move map down</button>');
	ButtonsDiv.append('<button type="button" class="btn" aria-expanded="false" onclick="moveObjectsOnMap(0,-1);">Move map up</button>');
	ButtonsDiv.append('<button type="button" class="btn" aria-expanded="false" onclick="rotateMap(true);">Rotate clockwise</button>');
	ButtonsDiv.append('<button type="button" class="btn" aria-expanded="false" onclick="rotateMap(false);">Rotate counterclockwise</button>');
	ButtonsDiv.append('<button type="button" class="btn" aria-expanded="false" onclick="updateMapSize();">UpdateMapSize (Changes will be made after refresh)</button>');
	ButtonsDiv.append('<input type="text" name="map-width" class="form-control" placeholder="Set Width" value="">');
	ButtonsDiv.append('<input type="text" name="map-height" class="form-control" placeholder="Set Height" value="">');
	TransformationDiv.append(ButtonsDiv);
	html.append(TransformationDiv);
}

function moveObjectsOnMap(right, down) {
	for (var n in config) {
		var configPart = config[n];
		if (configPart == undefined) continue;
		if (configPart.x != undefined) {
			configPart.x = (parseInt(configPart.x) + right).toString();
			configPart.y = (parseInt(configPart.y) + down).toString();
		} else {
			for (var i = 0; i < configPart.length && configPart.length != undefined; i++) {
				if (configPart[i].x != undefined) {
					configPart[i].x = (parseInt(configPart[i].x) + right).toString();
					configPart[i].y = (parseInt(configPart[i].y) + down).toString();;
				}
			}

		}
	}
	constructMapFromConfig();
	clearAdditionalElements();
	constructSettingsFromConfig();
	updateConfig();
}

function rotateMap(clockwise) {
	var realWidth = 0;
	var realHeight = 0;
	for (var i = 0; i < config.tiles.length; i++) {
		var tile = config.tiles[i];
		var rightSide, bottomSide;
		if (tile.angle == 90 || tile.angle == 270) {
			rightSide = parseInt(tile.x) + MAP_TILES_SIZES[tile.title].height - 1;
			bottomSide = parseInt(tile.y) + MAP_TILES_SIZES[tile.title].width - 1 + 1; //+1 for the nubering is starting from 0
		} else {
			rightSide = parseInt(tile.x) + MAP_TILES_SIZES[tile.title].width - 1;
			bottomSide = parseInt(tile.y) + MAP_TILES_SIZES[tile.title].height - 1 + 1;
		}
		if (rightSide > realWidth) realWidth = rightSide;
		if (bottomSide > realHeight) realHeight = bottomSide;
	}
	rotateTiles(clockwise, realWidth, realHeight);
	rotateDoors(clockwise, realWidth, realHeight);
	rotateMonsters(clockwise, realWidth, realHeight);
	rotateLieutenants(clockwise, realWidth, realHeight);
	rotateAgents(clockwise, realWidth, realHeight);
	rotateHeroes(clockwise, realWidth, realHeight);
	rotateAllies(clockwise, realWidth, realHeight);
	rotateFamiliars(clockwise, realWidth, realHeight);
	rotateVillagers(clockwise, realWidth, realHeight);
	rotateObjectives(clockwise, realWidth, realHeight);
	constructMapFromConfig();
	clearAdditionalElements();
	constructSettingsFromConfig();
	updateConfig();
}

function rotateTiles(clockwise, realWidth, realHeight) {
	if (clockwise) {
		for (var i = 0; i < config.tiles.length; i++) {
			var tile = config.tiles[i];
			var tileHeight;
			if (tile.angle == 270 || tile.angle == 90) {
				tileHeight = MAP_TILES_SIZES[tile.title].width;
			} else {
				tileHeight = MAP_TILES_SIZES[tile.title].height;
			}
			if (tile.angle == 270) {
				tile.angle = "0";
			} else {
				tile.angle = (parseInt(tile.angle) + 90).toString();
			}
			rotateObjectClockwise(tile, tileHeight, realHeight);
		}
	} else {
		for (var i = 0; i < config.tiles.length; i++) {
			var tile = config.tiles[i];
			var tileWidth;
			if (tile.angle == 270 || tile.angle == 90) {
				tileWidth = MAP_TILES_SIZES[tile.title].height;
			} else {
				tileWidth = MAP_TILES_SIZES[tile.title].width;
			}
			if (tile.angle == 0) {
				tile.angle = "270";
			} else {
				tile.angle = (parseInt(tile.angle) - 90).toString();
			}
			rotateObjectCounterClockwise(tile, tileWidth, realWidth);
		}
	}
}

function rotateDoors(clockwise, realWidth, realHeight) {
	for (var i = 0; i < config.doors.length; i++) {
		var door = config.doors[i];
		var height, width;
		if (door.vertical) {
			height = 4;
			width = 2;
		} else {
			height = 2;
			width = 4;
		}
		door.vertical = !door.vertical;
		rotateObject(clockwise, door, height, width, realHeight, realWidth);
	}
}

function rotateXs(clockwise, realWidth, realHeight) {
	for (var i = 0; i < config.doors.length; i++) {
		var x = config.doors[i];
		var height, width;
		height = parseInt(x.title.substring(0,1));
		width = height;
		rotateObject(clockwise, x, height, width, realHeight, realWidth);
	}
}

function rotateMonsters(clockwise, realWidth, realHeight) {
	for (var i = 0; i < config.monsters.length; i++) {
		var monster = config.monsters[i];
		var height, width;
		if (monster.vertical) {
			height = MONSTERS[monster.title].width;
			width = MONSTERS[monster.title].height;
		} else {
			height = MONSTERS[monster.title].height;
			width = MONSTERS[monster.title].width;
		}
		monster.vertical = !monster.vertical;
		rotateObject(clockwise, monster, height, width, realHeight, realWidth);
	}
}

function rotateLieutenants(clockwise, realWidth, realHeight) {
	if (config.lieutenants == undefined) {
		return;
	}
	for (var i = 0; i < config.lieutenants.length; i++) {
		var lieutenant = config.lieutenants[i];
		var height, width;
		if (lieutenant.vertical) {
			height = LIEUTENANTS[lieutenant.title].width;
			width = LIEUTENANTS[lieutenant.title].height;
		} else {
			height = LIEUTENANTS[lieutenant.title].height;
			width = LIEUTENANTS[lieutenant.title].width;
		}
		lieutenant.vertical = !lieutenant.vertical;
		rotateObject(clockwise, lieutenant, height, width, realHeight, realWidth);
	}
}

function rotateAgents(clockwise, realWidth, realHeight) {
	if (config.agents == undefined) {
		return;
	}
	for (var i = 0; i < config.agents.length; i++) {
		var agent = config.agents[i];
		var height, width;
		if (agent.vertical) {
			height = LIEUTENANTS[agent.title].width;
			width = LIEUTENANTS[agent.title].height;
		} else {
			height = LIEUTENANTS[agent.title].height;
			width = LIEUTENANTS[agent.title].width;
		}
		agent.vertical = !agent.vertical;
		rotateObject(clockwise, agent, height, width, realHeight, realWidth);
	}
}

function rotateHeroes(clockwise, realWidth, realHeight) {
	for (var i = 0; i < 4; i++) {
		var hero = config['hero' + (i+1).toString()];
		if (config.hero4.title == '') {
			continue;
		}
		var height = 1, width = 1;
		rotateObject(clockwise, hero, height, width, realHeight, realWidth);
	}
}

function rotateAllies(clockwise, realWidth, realHeight) {
	for (var i = 0; i < config.allies.length; i++) {
		var ally = config.allies[i];
		var height = 1, width = 1;
		rotateObject(clockwise, ally, height, width, realHeight, realWidth);
	}
}

function rotateFamiliars(clockwise, realWidth, realHeight) {
	for (var i = 0; i < config.familiars.length; i++) {
		var familiar = config.familiars[i];
		var height = 1, width = 1;
		rotateObject(clockwise, familiar, height, width, realHeight, realWidth);
	}
}

function rotateVillagers(clockwise, realWidth, realHeight) {
	for (var i = 0; i < config.villagers.length; i++) {
		var villager = config.villagers[i];
		var height = 1, width = 1;
		rotateObject(clockwise, villager, height, width, realHeight, realWidth);
	}
}

function rotateObjectives(clockwise, realWidth, realHeight) {
	for (var i = 0; i < config.objectives.length; i++) {
		var objective = config.objectives[i];
		var height = 1, width = 1;
		rotateObject(clockwise, objective, height, width, realHeight, realWidth);
	}
}






function rotateObjectClockwise(object, height, canvasHeight) {
	var newX = (canvasHeight - parseInt(object.y) + 1 - height).toString(); //+1 and -1 lower are made becays numbering on x starts width 1 and on y - with 0
	object.y = (parseInt(object.x) - 1).toString();
	object.x = newX;
}

function rotateObjectCounterClockwise(object, width, canvasWidth) {
	var newY = (canvasWidth - parseInt(object.x) - width + 1).toString();
	object.x = (parseInt(object.y) + 1).toString();
	object.y = newY;
}

function rotateObject(clockwise, object, height, width, canvasHeight, canvasWidth) {
	if (clockwise) {
		rotateObjectClockwise(object, height, canvasHeight);
	} else {
		rotateObjectCounterClockwise(object, width, canvasWidth);
	}
}
