function addOption(title, optionClass, functionCallback, additionalAttribute, attributeValue) {
	if (title == "$SEPARATOR$" || title == "$SEPARATOR$ ") {
		return '<li role="separator" class="divider"></li>';
	}
	else {
		return '<li class="' + optionClass + '"' + (additionalAttribute != undefined ? ' ' + additionalAttribute + '="' + attributeValue + '"' : '') + '><a onclick="' + functionCallback + '">' + title + '</a></li>';
	}
}

function addTextareaWithLabel(labelText, link) {
	var html;
	html = '<label for="' + link + '">' + labelText + '</label>'
	html += '<textarea class="form-control" rows="5" id="' + link + '"></textarea>'
	return html;
}

function updateCoordinate(element, value) {
	updateOption(element, value, false);
}

function updateOption(element, value, isMonster) {
	var container = $(element).parents('.select-row');
	if (isMonster || value == 'Clear') { //monster select or clearing cordinates
		var monsterTitle = $(element).html();
		if (value != 'Clear') {
			container.find('input[name="master"]').attr('value', monsterTitle.indexOf(MasterSuffix) > -1);
		}
		var xYSelects = $(container).find('.select-x, .select-y');

		if (isMonster) {
			var monsterHp;
			if (monsterTitle.indexOf(MasterSuffix) > -1) {
				if (CurrentLevel == "I") {
					monsterHp = MONSTERS_LIST[value].masterHpI;
				} else {
					monsterHp = MONSTERS_LIST[value].masterHpII;
				}
			} else {
				if (CurrentLevel == "I") {
					monsterHp = MONSTERS_LIST[value].minionHpI;
				} else {
					monsterHp = MONSTERS_LIST[value].minionHpII;
				}
			}
			container.find('.monster-title').html(monsterTitle + ' ');
			container.find('input[name="monster-title"]').attr('value', value);
			container.find('.x-title').html('Select X coordinate' + ' ');
			container.find('.y-title').html('Select Y coordinate' + ' ');
			container.find('input[name="monster-x"]').attr('value', '');
			container.find('input[name="monster-y"]').attr('value', '');
			container.find('input[name="monster-hp"]').val(monsterHp);
		} else {
			var otherElementThanCleared;
			if ($(element).parents('.btn-group').hasClass('select-x')) {
				otherElementThanCleared = container.find('.select-y');
				container.find('.x-title').html('Select X coordinate' + ' ');
				container.find('input[name="monster-x"]').attr('value', '');
			} else {
				otherElementThanCleared = container.find('.select-x');
				container.find('.y-title').html('Select Y coordinate' + ' ');
				container.find('input[name="monster-y"]').attr('value', '');
			}
			xYSelects = otherElementThanCleared;
			value = container.find('.monster-title').html();
			value = value.substring(0, value.length - 1);
			//remove type : master / minion
			value = value.replace(MasterSuffix, "");
			value = value.replace(MinionSuffix, "");
		}

		var firstClass = SHOWING_CLASSES[MONSTERS_LIST[value].width];
		var secondClass = SHOWING_CLASSES[MONSTERS_LIST[value].height];
		xYSelects.removeClass(SHOWING_CLASSES[1] + ' ' + SHOWING_CLASSES[2] + ' ' + SHOWING_CLASSES[3] + ' squared');
		xYSelects.addClass(firstClass);
		if (firstClass == secondClass) {
			xYSelects.addClass('squared');
		} else {
			xYSelects.addClass(secondClass);
		}
	} else { //coordinate select
		var selectedSize = value.charAt(0);
		var selectedCoordinate = value.substr(1);
		var parent = $(element).parents('.btn-group');

		if (parent.hasClass('select-x')) {
			container.find('input[name="monster-x"]').attr('value', selectedCoordinate);
			container.find('input[name="hero-x"]').attr('value', selectedCoordinate);
			container.find('input[name="line-x"]').attr('value', selectedCoordinate);
			container.find('input[name="door-x"]').attr('value', selectedCoordinate);
			container.find('input[name="xs-x"]').attr('value', selectedCoordinate);
			container.find('input[name="ally-x"]').attr('value', selectedCoordinate);
			container.find('input[name="familiar-x"]').attr('value', selectedCoordinate);
			container.find('input[name="villager-x"]').attr('value', selectedCoordinate);
			container.find('input[name="maptoken-x"]').attr('value', selectedCoordinate);
			container.find('input[name="lieutenant-x"]').attr('value', selectedCoordinate);
			container.find('input[name="agent-x"]').attr('value', selectedCoordinate);
			container.find('input[name="monster-x-size"]').attr('value', selectedSize);
			container.find('.x-title').html($(element).html() + ' ');
			if (!parent.hasClass('squared')) {
				container.find('.select-y').removeClass(SHOWING_CLASSES[selectedSize]);
			}
		} else {
			container.find('.y-title').html($(element).html() + ' ');
			container.find('input[name="monster-y"]').attr('value', selectedCoordinate);
			container.find('input[name="hero-y"]').attr('value', selectedCoordinate);
			container.find('input[name="line-y"]').attr('value', selectedCoordinate);
			container.find('input[name="door-y"]').attr('value', selectedCoordinate);
			container.find('input[name="xs-y"]').attr('value', selectedCoordinate);
			container.find('input[name="ally-y"]').attr('value', selectedCoordinate);
			container.find('input[name="familiar-y"]').attr('value', selectedCoordinate);
			container.find('input[name="villager-y"]').attr('value', selectedCoordinate);
			container.find('input[name="maptoken-y"]').attr('value', selectedCoordinate);
			container.find('input[name="lieutenant-y"]').attr('value', selectedCoordinate);
			container.find('input[name="agent-y"]').attr('value', selectedCoordinate);
			container.find('input[name="monster-y-size"]').attr('value', selectedSize);
			if (!parent.hasClass('squared')) {
				container.find('.select-x').removeClass(SHOWING_CLASSES[selectedSize]);
			}
		}
	}
}

function updateDirection(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.direction-title').html(value + ' ');
	var inputs = container.find('input[name]');
	for (var i = 0; i < inputs.length; i++) {
		var input = $(inputs[i]);
		if (input.attr('name').indexOf('direction') > -1) {
			input.attr('value', value);
			return;
		}
	}
}

function clearDirection(element) {
	var container = $(element).parents('.select-row');
	container.find('.direction-title').html('Select direction ');
	container.find('input[name="door-direction"]').attr('value', '');
}

function createConditionSelectContent() {
	var html = addOption('Remove token', '', 'removeCondition(this);');
	var switched = CONDITIONS[CONDITIONS_LIST[0]].hasConditionCard;
	for (var i = 0; i < CONDITIONS_LIST.length; i++) {
		if (switched != CONDITIONS[CONDITIONS_LIST[i]].hasConditionCard) {
			switched = CONDITIONS[CONDITIONS_LIST[i]].hasConditionCard;
			html += '<li role="separator" class="divider"></li>';
		}
		html += addOption(CONDITIONS_LIST[i] + ' ', '', 'updateCondition(this, \'' + CONDITIONS_LIST[i] + '\')');
	}
	return html;
}

function recoverMonsterBaseName(MonsterFullName) {
	var MonsterBaseName = MonsterFullName.replace(MasterSuffix, '').replace(MinionSuffix, '')
	return MonsterBaseName;
}


function addConditions(conditions, container) {
	for (var condition in conditions) {
		if (condition == undefined || condition == '' || !CONDITIONS[condition].hasConditionCard) continue;
		var conditionImage = $('<img>');
		conditionImage.attr('src', ImagePathRoot + ImagePathConditionImage + urlize(condition) + '.png').addClass('condition');
		container.append(conditionImage);
	}
}

function getConditions(container) {
	var conditions = $(container).find('[name="condition-title"]');
	var conditionsObject = {};
	for (var i = 0; i < conditions.length; i++) {
		var condition = $(conditions[i]).val();
		if (conditionsObject[condition] == undefined) {
			conditionsObject[condition] = 1;
		} else {
			conditionsObject[condition] += 1;
		}
	}
	return conditionsObject;
}

function updateCondition(element, value) {
	if (value == 'Marked') {
		value = 'Tracked';
	}
	var container = $(element).parents('.select-row');
	var id = $(element).parents('.select-condition').attr('id');
	container.find('#' + id + ' .condition-title').html(value + ' ');
	container.find('#input' + id).attr('value', value);
	var conditionsContainer = container.find('.conditions-container');
	if (container.parents('#monsters').length > 0) {
		adjustMonsterList();
	} else {
		conditionsContainer.html('');
		addConditions(getConditions(container), conditionsContainer);
	}
}

function removeCondition(element) {
	var container = $(element).parents('.select-row');
	var conditionSelect = $(element).parents('.select-condition');
	var id = conditionSelect.attr('id');
	conditionSelect.remove();
	$('#input' + id).remove();
	if (container.parents('#monsters').length > 0) {
		adjustMonsterList();
	} else {
		container.find('.conditions-container').html('');
		addConditions(getConditions(container), conditionsContainer);
	}
}

function removeRow(element) {
	$(element).parents('.select-row').remove();
}

function getAlphabetChar(number) {
	var result = '';
	if (number >= 26) {
		result += ALPHABET.charAt(Math.floor(number / 26) - 1);
	}
	return result += ALPHABET.charAt(number % 26);
}

function createYSelectContent(oneCellOnly) {
	var html = addOption('Clear', '', 'updateCoordinate(this, \'Clear\');');
	for (var i = 0; i <= mapHeight; i++) {
		html += addOption(i.toString(), 'oneCell', 'updateCoordinate(this, \'1' + i.toString() + '\');');
		if (i <= mapHeight - 1 && !oneCellOnly)
			html += addOption(i.toString() + '-' + (i + 1).toString(), 'twoCells', 'updateCoordinate(this, \'2' + i.toString() + '\');');
		if (i <= mapHeight - 2 && !oneCellOnly)
			html += addOption(i.toString() + '-' + (i + 2).toString(), 'threeCells', 'updateCoordinate(this, \'3' + i.toString() + '\');');
	}
	return html;
}

function createXSelectContent(oneCellOnly) {
	var html = addOption('Clear', '', 'updateCoordinate(this, \'Clear\');');
	for (var i = 1; i <= mapWidth; i++) {
		html += addOption(getAlphabetChar(i - 1), 'oneCell', 'updateCoordinate(this, \'1' + i.toString() + '\');');
		if (i <= mapWidth - 1 && !oneCellOnly)
			html += addOption(getAlphabetChar(i - 1) + '-' + getAlphabetChar(i), 'twoCells', 'updateCoordinate(this, \'2' + i.toString() + '\');');
		if (i <= mapWidth - 2 && !oneCellOnly)
			html += addOption(getAlphabetChar(i - 1) + '-' + getAlphabetChar(i + 1), 'threeCells', 'updateCoordinate(this, \'3' + i.toString() + '\');');
	}
	return html;
}

function createDirectionSelectContent() {
	var html = addOption('Clear', '', 'clearDirection(this);');
	html += addOption('horizontal ', '', 'updateDirection(this, \'horizontal\')');
	html += addOption('vertical ', '', 'updateDirection(this, \'vertical\')');
	return html;
}

function recoverConfig(Base64Data) {
	var dataTemp = JSON.parse(Base64.decode(Base64Data));
	dataTemp = RetroCompatibility(dataTemp);

	return dataTemp;
}

function RetroCompatibility(OldConfig) {
	//update Recovered config based on Version
	var AndOlder = false
	var NewConfig = OldConfig

	//initialize values if needed
	if (NewConfig.CurrentLevel == undefined) {
		NewConfig.CurrentLevel = 0;
	}
	if (NewConfig.CurrentLevel == "I" || NewConfig.CurrentLevel == "II") {
		NewConfig.CurrentLevel = 0;
	}

	// previous to 1.0.0
	if (NewConfig.mapVersion == undefined) {
		//change monsters data
		// FROM "title":"Wraith","master":true TO "title":"Wraith master"
		// AND FROM "title":"Wraith","master":false TO "title":"Wraith minion"
		if (NewConfig.monsters != undefined) {
			for (var i = 0; NewConfig.monsters != undefined && i < NewConfig.monsters.length; i++) {
				if (NewConfig.monsters[i].master) {
					NewConfig.monsters[i].title = NewConfig.monsters[i].title + MaserSuffix;
				}
				else {
					NewConfig.monsters[i].title = NewConfig.monsters[i].title + MinionSuffixMinionSuffix;
				}
				//				if (monster.vertical) folder += 'vertical/';
				//				if (monster.direction == "V") folder += 'vertical/';

			}
		}

		//change Doors Direction
		// FROM "vertical":true TO "direction":"V"
		// FROM "vertical":false TO "direction":"H"
		if (NewConfig.doors != undefined) {
			for (var i = 0; NewConfig.doors != undefined && i < NewConfig.doors.length; i++) {
				if (NewConfig.doors[i].vertical) {
					NewConfig.doors[i].direction = "V";
				}
				else {
					NewConfig.doors[i].direction = "H";
				}
			}
		}

		//change Level
		// FROM "actOne":true TO "CurrentLevel":"I"
		// FROM "actOne":false TO "CurrentLevel":"II"
		//if (NewConfig.actOne != undefined) {
		//	if (NewConfig.actOne) {
		//		NewConfig.CurrentLevel = "I";
		//	}
		//	else {
		//		NewConfig.CurrentLevel = "II";
		//	}
		//}



		AndOlder = true;
	}

	// previous to 1.1.0
	if (NewConfig.mapVersion == "1.0.0" || AndOlder == true) {
		//heroes in a list (heroes1, heroes2, ... -> heroes[])
		NewConfig.heroes = [];
		for (var i = 1; i <= MAX_Heroes; i++) {
			NewConfig.heroes[i - 1] = NewConfig['hero' + i.toString()];
			delete NewConfig['hero' + i.toString()];
		}

		//replace titles by ids
		for (var i = 0; NewConfig.tiles != undefined && i < NewConfig.tiles.length; i++) {
			NewConfig.tiles[i].id = FromTitleToID(tileLine.AllData, NewConfig.tiles[i].title);
		}
		for (var i = 0; NewConfig.overlaytiles != undefined && i < NewConfig.overlaytiles.length; i++) {
			NewConfig.overlaytiles[i].id = FromTitleToID(OverlayTileLine.AllData, NewConfig.overlaytiles[i].title);
		}
		for (var i = 0; NewConfig.doors != undefined && i < NewConfig.doors.length; i++) {
			NewConfig.doors[i].id = FromTitleToID(doorLine.AllData, NewConfig.doors[i].title);
		}
		for (var i = 0; NewConfig.maptokens != undefined && i < NewConfig.maptokens.length; i++) {
			NewConfig.maptokens[i].id = FromTitleToID(MovableMapTokenLine.AllData, NewConfig.maptokens[i].title);
		}
		for (var i = 0; NewConfig.familiars != undefined && i < NewConfig.familiars.length; i++) {
			NewConfig.familiars[i].id = FromTitleToID(familiarLine.AllData, NewConfig.familiars[i].title);
		}
		for (var i = 0; NewConfig.villagers != undefined && i < NewConfig.villagers.length; i++) {
			NewConfig.villagers[i].id = FromTitleToID(villagerLine.AllData, NewConfig.villagers[i].title);
		}
		for (var i = 0; NewConfig.monsters != undefined && i < NewConfig.monsters.length; i++) {
			var MonsterBaseName = recoverMonsterBaseName(NewConfig.monsters[i].title);
			var MonsterSuffit = NewConfig.monsters[i].title.replace(MonsterBaseName, '');
			NewConfig.monsters[i].id = FromTitleToID(monsterLine.AllData, MonsterBaseName) + MonsterSuffit;
		}
		for (var i = 0; NewConfig.lieutenants != undefined && i < NewConfig.lieutenants.length; i++) {
			NewConfig.lieutenants[i].id = FromTitleToID(lieutenantLine.AllData, NewConfig.lieutenants[i].title);
		}
		for (var i = 0; NewConfig.heroes != undefined && i < NewConfig.heroes.length; i++) {
			NewConfig.heroes[i].id = FromTitleToID(heroLine.AllData, NewConfig.heroes[i].title);
		}

		AndOlder = true;
	}
	return NewConfig;
}

function FromTitleToID(LIST, TitleValue) {
	var NewIDValue = 0;
	Object.keys(LIST).forEach(item => {
		if (LIST[item].title == TitleValue) {
			NewIDValue = item;
		}
	});
	return NewIDValue;
}


function rebuildMap(element, mapNb) {
	var mapConfig = recoverConfig(MAP_HASES_LIST[mapNb][3]);



	config.tiles = mapConfig.tiles;
	config.doors = mapConfig.doors;
	config.xs = mapConfig.xs;
	config.monsters = mapConfig.monsters;
	config.lieutenants = mapConfig.lieutenants;
	config.villagers = mapConfig.villagers;
	config.CurrentLevel = mapConfig.CurrentLevel;
	config.questObjectives = mapConfig.questObjectives;
	config.monsterTraits = mapConfig.monsterTraits;


	updateLevel(config.CurrentLevel);
	FillWindow_QuestObjectives(config, true);
	FillWindow_MapDesign(config, true);
	FillWindow_MapTokens(config, true);
	FillWindow_OLFigures(config, true);
	FillWindow_Familiars(config, true);

	switchToMap();
	UnSet_Campaign(element);
}

function clearHeroesConditions() {
	$('.select-condition').remove();
	$('[name="condition-title"]').remove();
}

function addCondition(button) {
	var condition = $(createInputSelect('Select token', 'condition-title', 'select-condition')).attr('id', 'condition' + conditionNumber.toString());
	condition.find('ul').append(createConditionSelectContent());
	var buttonObject = $(button);
	buttonObject.before(condition);
	buttonObject.before('<input type="hidden" name="condition-title" id="inputcondition' + conditionNumber.toString() + '" value=""/>');
	conditionNumber += 1;
	return condition;
}

function addUnitLine(line, title) {
	line.addClass('select-row');

	line.append(createInputSelect('Select ' + title, folderize(title).toLowerCase() + '-title', 'select-' + folderize(title).toLowerCase()));
	line.append(createInputSelect('Select X coordinate', 'x-title', 'select-x'));
	line.append(createInputSelect('Select Y coordinate', 'y-title', 'select-y'));
	line.append(Create_CustomInput(0));
	line.append($('<input type="hidden" name="' + folderize(title).toLowerCase() + '-title" value=""/>'));
	line.append($('<input type="hidden" name="' + folderize(title).toLowerCase() + '-x" value=""/>'));
	line.append($('<input type="hidden" name="' + folderize(title).toLowerCase() + '-y" value=""/>'));
}

function addHpInput(element) {
	var elementObject = $(element);
	elementObject.before('<input type="text" name="hp" class="form-control" placeholder="Set HP" value=""/>');
	elementObject.before('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeHpInput(this);">Remove HP</button>');
	elementObject.remove();
}

function removeHpInput(element) {
	var elementObject = $(element);
	elementObject.parents('.select-row').find('input[name="hp"]').remove();
	elementObject.before('<button type="button" class="btn btn-warning" aria-expanded="false" onclick="addHpInput(this);">Add HP</button>');
	elementObject.remove();
}

function createConditionsBlock() {
	return $('<div>').addClass('conditions-container');
}

function createInputSelect(title, titleClass, additionalClass) {
	var select = $('<div>').addClass('btn-group').addClass(additionalClass);
	var button = $('<button>').attr('type', 'button').addClass('btn btn-default dropdown-toggle').attr('data-toggle', 'dropdown').attr('aria-expanded', 'false');
	button.append($('<span>' + title + ' </span>').addClass(titleClass)).append($('<span>').addClass('caret'));
	select.append(button).append($('<ul>').addClass('dropdown-menu').attr('role', 'menu'));
	return select;
}

function populate() {
	collectData();
	updateConfig();
	constructMapFromConfig();
}

function addMapObject(xCoordinate, yCoordinate, object, priority) {
	var coordinateObjects = mapObjects[[xCoordinate, yCoordinate]];
	if (coordinateObjects == undefined) {
		coordinateObjects = mapObjects[[xCoordinate, yCoordinate]] = [];
	}
	coordinateObjects.push({ "object": object, "priority": priority });
}

function constructMapFromConfig() {
	var mapContainer = $('#map');
	var map = mapContainer.find('.map');
	var figures = mapContainer.find('.figures');
	map.html('');
	figures.html('');
	mapObjects = [];

	AddArrayObjectsOnMap(config.tiles, tileLine, map);
	AddArrayObjectsOnMap(config.overlaytiles, OverlayTileLine, map);
	AddArrayObjectsOnMap(config.doors, doorLine, map);
	AddArrayObjectsOnMap(config.maptokens, MovableMapTokenLine, map);
	AddArrayObjectsOnMap(config.familiars, familiarLine, figures);
	AddArrayObjectsOnMap(config.villagers, villagerLine, figures);
	AddArrayObjectsOnMap(config.monsters, monsterLine, figures);
	////AddArrayObjectsOnMap(config.allies, 'images/allies_tokens/', allyLine, figures);
	AddArrayObjectsOnMap(config.lieutenants, lieutenantLine, figures);
	////AddArrayObjectsOnMap(config.agents, 'images/monster_tokens/', agentLine, figures);



	AddArrayObjectsOnMap(config.heroes, heroLine, figures);
	//for (var i = 1; i <= MAX_Heroes; i++) {
	//	AddObjectsOnMap(config['hero' + i], heroLine, figures)
	//}


	//addHeroToMap(config.hero1);
	//addHeroToMap(config.hero2);
	//addHeroToMap(config.hero3);
	//addHeroToMap(config.hero4);

	adjustOverlappingImages();

	setShortLink();
}

function getConditionsArrayFromObjectOrArray(conditions) {
	var result = [];
	if (conditions.length == undefined) {
		for (var condition in conditions) {
			if (condition == undefined || condition == "") continue;
			for (var i = 0; i < conditions[condition] && (i == 0 || !CONDITIONS[condition].hasConditionCard); i++) {
				result.push(condition);
			}
		}
	} else {
		result = conditions;
	}
	return result;
}

function addConditionsToImage(sourcesObject, sourceConfig) {
	var conditions = $('<div>').addClass('conditions');
	var updatedSourceConfig = getConditionsArrayFromObjectOrArray(sourceConfig);
	var interval = updatedSourceConfig != undefined && updatedSourceConfig.length > 3 ? Math.floor(50 / updatedSourceConfig.length) : 20;
	for (var j = 0; updatedSourceConfig != undefined && j < updatedSourceConfig.length; j++) {
		var conditionObject = $('<img>').attr('src', ImagePathRoot + ImagePathConditionFigureToken + urlize(updatedSourceConfig[j]) + '.png');
		if (j > 0) conditionObject.css({
			'position': 'absolute',
			'top': (interval * j).toString() + 'px'
		});
		conditions.append(conditionObject);
	}
	sourcesObject.append(conditions);
}

function addHeroToMap(hero) {
	if (hero == undefined || hero.title == undefined || hero.title == "") return;
	var heroObject = $('<div>');
	var heroImage = $('<img>');
	var z_index = 2;

	var folder = ImagePathHeroesMapToken;
	//		var angle = door.angle;

	var HexDelta = (1 - (hero.x % 2)) * (VCellSize / 2);

	heroObject.css({
		'position': 'absolute',
		'left': ((Math.floor(hero.x * HCellSize * 3 / 4)) - HEROES[hero.title].left + (HCellSize / 2)).toString() + 'px',
		'top': ((hero.y * VCellSize) - HEROES[hero.title].top + (VCellSize / 2) + HexDelta).toString() + 'px',
		'z-index': z_index
	});

	var monsterPosition = $('<div>').addClass('xy');
	monsterPosition.html(getAlphabetChar(Number(hero.x) - 1) + hero.y.toString());
	heroObject.append(monsterPosition);
	/*
		if (hero.aura != undefined) {
			var aura = $('<div>');
			var auraRadius = parseInt(hero.aura.radius);
			aura.css({
				'position' : 'absolute',
				'left' : '-' + (auraRadius * HCellSize).toString() + 'px',
				'top' : '-' + (auraRadius * VCellSize).toString() + 'px',
				'width' : ((2 * auraRadius + 1) * HCellSize).toString() + 'px',
				'height' : ((2 * auraRadius + 1) * VCellSize).toString() + 'px',
				'background' : hero.aura.color,
				'opacity' : '0.2',
				'border-radius' : ((HCellSize + VCellSize) / 4).toString() + 'px'
			});
			heroObject.append(aura);
		}
	*/
	heroImage.attr('src', folder + urlize(hero.title) + '.png');
	heroObject.append(heroImage);

	if (hero.ci != undefined) {
		for (j = 0; j < MAX_CustomInputs; j++) {
			//0 -> HP
			//1 -> Initiative
			//2 -> Sequential
			if (hero.ci[j] != undefined) {
				var heroCustomInputTemp = $('<div>').addClass('ci' + j);
				heroCustomInputTemp.html((hero.ci == undefined || hero.ci[j] == undefined) ? '' : hero.ci[j].toString());
				heroObject.append(heroCustomInputTemp);
			}
		}
	}
	if (hero.hp == 0) heroObject.addClass('secondary');
	if (hero.conditions != undefined) {
		addConditionsToImage(heroObject, hero.conditions);
	}
	addMapObject(hero.x, hero.y, heroObject, z_index);
	$('#map .figures').append(heroObject);
}

function adjustOverlappingImages() {
	for (var coordinate in mapObjects) {
		var tileObjects = mapObjects[coordinate];
		if (tileObjects == undefined || tileObjects.length == undefined || tileObjects.length <= 1) {
			continue;
		}
		tileObjects.sort(function (a, b) {
			return a.priority - b.priority;
		});
		for (var i = 0; i < tileObjects.length; i++) {
			var offset = 10 * (tileObjects.length - i - 1);
			var leftString = tileObjects[i].object.css('left');
			tileObjects[i].object.css('left', (parseInt(leftString.substring(0, leftString.length - 2)) + offset).toString() + "px");
			var topString = tileObjects[i].object.css('top');
			tileObjects[i].object.css('top', (parseInt(topString.substring(0, topString.length - 2)) + offset).toString() + "px");
		}
	}
}

function constructSettingsFromConfig() {
	updateLevel(config.CurrentLevel);
	FillWindow_QuestObjectives(config, false);
	FillWindow_MapDesign(config, false);
	FillWindow_MapTokens(config, false);
	FillWindow_OLFigures(config, false);
	FillWindow_Heroes(config, false);
//	constructHeroesTabsFromConfig();
	FillWindow_Familiars(config, false);
	constructMapSize();
}

function constructMapSize() {
	if (config.mapWidth != undefined) {
		mapWidth = config.mapWidth;
	}
	if (config.mapHeight != undefined) {
		mapHeight = config.mapHeight;
	}
}

function updateConditionsInSettings(conditions, container) {
	var conditionsArray = getConditionsArrayFromObjectOrArray(conditions);
	for (var i = 0; i < conditionsArray.length; i++) {
		var condition = conditionsArray[i];
		updateCondition(addCondition(container.find('.btn-warning')).find('li')[0], condition);
	}
}

function updateConfig() {
	window.location.hash = Base64.encode(JSON.stringify(config));
}

function collectData() {
	config.mapVersion = MAPVERSION;
	config.mapGame = MAPGAME;
	config.CurrentLevel = CurrentLevel;
	//	config.expansions = selectedExpansions;
	config = GetWindow_QuestObjectives(config);
	config = GetWindow_MapDesign(config);
	config = GetWindow_MapTokens(config);
	config = GetWindow_OLFigures(config);
	config = GetWindow_Heroes(config);
//	config.hero1 = hero($('#hero1 .select-row'));
//	config.hero2 = hero($('#hero2 .select-row'));
//	config.hero3 = hero($('#hero3 .select-row'));
//	config.hero4 = hero($('#hero4 .select-row'));
	config = GetWindow_Familiars(config);

	config.mapWidth = mapWidth;
	config.mapHeight = mapHeight;
}

function drawGrid() {
	for (var i = 0; i < mapWidth; i++) {
		var element = $('<div>');
		element.html(getAlphabetChar(i));
		element.css({
			'position': 'absolute',
			'left': (Math.floor((1 + i) * HCellSize * 3 / 4)).toString() + 'px',
			'top': '-' + VCellSize + 'px'
		});
		$('.grid').append(element);
	}
	for (var i = 0; i <= mapHeight; i++) {
		var element = $('<div>');
		element.html(i.toString());
		element.css({
			'position': 'absolute',
			'left': '-10px',
			'top': Math.floor(((i * VCellSize) + (VCellSize / 4))).toString() + 'px'
		});
		$('.grid').append(element);
	}
}

function setShortLink() {
	var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		string = '',
		charCnt = 20,
		uri;
	for (var i = 0; i < charCnt; i += 1) {
		string += characters[Math.floor(Math.random() * characters.length)];
	}
	uri = 'https://tinyurl.com/create.php?source=indexpage&url=' + encodeURIComponent(location.href) + '&alias=' + string;
	$('body').append('<img src="' + uri + '" style="height: 1px; width: 1px; position: absolute; z-index: -999; opacity: 0;" />');
	var tinyUrl = $('#tinyUrl');
	tinyUrl.html('Tiny link: https://tinyurl.com/' + string);
	tinyUrl.attr('href', 'https://tinyurl.com/' + string);
}

function switchToMap() {
	//	$('[href="#map"]').tab('show');
	$('[href="#map"]').click();
}

function clearAdditionalElements() {
	ResetWindow_MapDesign();
	ResetWindow_MapTokens();
	ResetWindow_OLFigures();
	ResetWindow_Heroes();

//	clearHeroesSackAndSearchItems();
//	clearHeroesConditions();

	ResetWindow_Familiars();
}

function updateMapSize() {
	mapWidth = $('[name="map-width"]').val();
	mapHeight = $('[name="map-height"]').val();
}

function setMapSizeFromConfig() {
	$('[name="map-width"]').val(mapWidth);
	$('[name="map-height"]').val(mapHeight);
}

function toggleMapControls() {
	$('.map-transformation div').toggle();
}

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	var target = $(ev.target);
	dropToken(target, data);
}

function dropToken(target, data) {
	var container = target.parents('.select-row');
	var dataWithoutHeroNumber = data.substring(0, data.length - 1);
	target.after($('#' + data));
	container.find('.imagescontainer img').removeClass('has' + dataWithoutHeroNumber);
	target.addClass('has' + dataWithoutHeroNumber);
}


function LoadOneSubScripts(scriptFile) {
	$.getScript(scriptFile);
	var script = document.createElement("script");
	script.src = scriptFile;
	document.head.appendChild(script);
}
function LoadSubScripts() {
	LoadOneSubScripts("scripts/00MapControls.js");
	LoadOneSubScripts("scripts/01QuestObjectives.js");
	LoadOneSubScripts("scripts/02MapDesign.js");
	LoadOneSubScripts("scripts/10Tokens.js");
	LoadOneSubScripts("scripts/03OLFigures.js");
	LoadOneSubScripts("scripts/04Heroes.js");
	LoadOneSubScripts("scripts/08Familiers.js");
}



function InitializeAllWindows() {
	Initialize_MapControls();

	InitializeWindowFor_QuestObjectives();
	InitializeWindowFor_MapDesign();
	InitializeWindowFor_OLFigures();
	InitializeWindowFor_Heroes();
	InitializeWindowFor_MapTokens();
	InitializeWindowFor_Familiars();

}

$(function () {
	//	LoadSubScripts();

	InitializeAllWindows();
//	for (var i = 1; i <= MAX_Heroes; i++) {
//		addHeroLine(i);
//	}


	// recover data / config
	if (window.location.hash != "") {
		//From URL
		config = recoverConfig(window.location.hash);
	} else {
		//From default config
		config = recoverConfig(defaultConfig);
	}
	constructSettingsFromConfig();
	constructMapFromConfig();
	drawGrid();
	setMapSizeFromConfig();

	$('.nav-tabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	$('.tab-pane').append($('<div class="close" onclick="switchToMap();">x</div>'));
	$('#map').click(function () {
		switchToMap();
	});
	$(document).keyup(function (e) {
		if (e.keyCode == 27) { // esc keycode
			switchToMap();
		}
	});
});

