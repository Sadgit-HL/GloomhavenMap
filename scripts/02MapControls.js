function InitializeWindowFor_MapControls() {
	var html = $('#map-controls');
	html.append('<div id="full-maps-container"><h1>Full maps</h1></div>');
	html.append('<div id="tiles-container"><h1>Map tiles</h1></div>');
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="addMapTileLine();">Add map tile</button>');
	html.append('<div id="doors-container"><h1>Doors</h1></div>');
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="addDoorLine();">Add door</button>');
	html.append('<div id="xs-container"><h1>Xs</h1></div>');
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="addXsLine();">Add X</button>');
}

function createFullMapsBlock() {
	var html = $('<div>').addClass('full-maps-container');

	html.append(createInputSelect('Select Campaign ', 'campaign-title', 'select-campaign'));
	html.find('.select-campaign ul').addClass(ALL_CAMPAIGNS_CLASSES + ' showcampaign').append(createCampaignSelectContent());
	html.append($('<input type="hidden" name="campaign-title" value=""/>'));

	html.append(createInputSelect('Remove and replace current map with : Quest / Encounter ', 'encounter-title', 'select-encounter'));
	html.find('.select-encounter ul').addClass(ALL_CAMPAIGNS_CLASSES + ' showcampaign').append(createEncounterSelectContent());

	$('#full-maps-container').append(html);
}

function createCampaignSelectContent() {
	var html = addOption('Clear', '', 'clearCampaign(this);');
	for (var i = 0; i < CAMPAIGNS.length; i++) {
		var code = CAMPAIGNS[i][1];
		var title = CAMPAIGNS[i][0];
		html += addOption(title + ' ', code, 'updateCampaign(this, \'' + code + '\');');
	}
	return html;
}

function updateCampaign(element, value) {
	var container = $(element).parents('.full-maps-container');
	container.find('.campaign-title').html(element.innerText + ' ');
	container.find('input[name="campaign-title"]').attr('value',value);
	adjustEncounter(element, value);
}

function clearCampaign(element) {
	var container = $(element).parents('.full-maps-container');
	container.find('.select-campaign ul').addClass(ALL_CAMPAIGNS_CLASSES);
	container.find('.campaign-title').html('Select campaign ');
	container.find('input[name="campaign-title"]').attr('value','');
	adjustEncounter(element, ALL_CAMPAIGNS_CLASSES);
}

function createEncounterSelectContent() {
	var html = '';
	for (var i = 0; i < MAP_HASES_LIST.length; i++) {
		html += addOption(MAP_HASES_LIST[i][1] + ' ',MAP_HASES_LIST[i][0], 'rebuildMap(this, \'' + i + '\', false);');
	}
	return html;
}

function adjustEncounter(element, campaign) {
	var container = $(element).parents('.full-maps-container');
	container.find('.select-encounter ul').removeClass(ALL_CAMPAIGNS_CLASSES).addClass(campaign);
}

function constructMapControlsTabFromConfig() {
	if (config.tiles != undefined) {
		for (var i = 0 ; i < config.tiles.length; i++) {
			var container = addMapTileLine();
			var tile = config.tiles[i];
			updateTile(container.find('.select-tile li')[0], tile.title);
			updateSide(container.find('.select-side li')[0], tile.side);
			container.find('[name="tile-x"]').val(tile.x);
			container.find('.x-title').html(getAlphabetChar(tile.x - 1) + ' ');
			container.find('[name="tile-y"]').val(tile.y);
			container.find('.y-title').html(tile.y.toString() + ' ');
			updateAngle(container.find('.select-angle li')[0], tile.angle);
		}
	}
	if (config.doors != undefined) {
		for (var i = 0 ; i < config.doors.length; i++) {
			var container = addDoorLine();
			var door = config.doors[i];
			updateDoor(container.find('.select-door li')[0], door.title);
			updateDirection(container.find('.select-direction li')[0], door.vertical ? 'vertical' : 'horizontal');
			if (door.opened != undefined) {
				container.find('[name="opened"]').prop('checked', door.opened);
			}
			container.find('[name="door-x"]').val(door.x);
			container.find('.x-title').html(getAlphabetChar(door.x - 1) + ' ');
			container.find('[name="door-y"]').val(door.y);
			container.find('.y-title').html(door.y.toString() + ' ');
		}
	}
	if (config.xs != undefined) {
		for (var i = 0 ; i < config.xs.length; i++) {
			var container = addXsLine();
			var xs = config.xs[i];
			updateXs(container.find('.select-xs li')[0], xs.title);
			container.find('[name="xs-x"]').val(xs.x);
			container.find('.x-title').html(getAlphabetChar(xs.x - 1) + ' ');
			container.find('[name="xs-y"]').val(xs.y);
			container.find('.y-title').html(xs.y.toString() + ' ');
		}
	}
}

function addMapTileLine() {
	var mapTileLine = $('<div>');
	addUnitLine(mapTileLine, 'tile');
	mapTileLine.find('input[type="text"]').remove();
	mapTileLine.find('.select-tile').after(createInputSelect('Select side', 'side-title', 'select-side'));
	mapTileLine.append(createInputSelect('Select angle', 'angle-title', 'select-angle'));
	mapTileLine.append($('<input type="hidden" name="tile-side" value=""/>'));
	mapTileLine.append($('<input type="hidden" name="tile-angle" value=""/>'));

	mapTileLine.find('.select-tile ul').append(createTileSelectContent());
	mapTileLine.find('.select-side ul').append(createSideSelectContent());
	mapTileLine.find('.select-x ul').addClass('showOneCell').append(createXSelectContent(true));
	mapTileLine.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));
	mapTileLine.find('.select-angle ul').append(createAngleSelectContent());
	mapTileLine.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove row</button>'));
	$('#tiles-container').append(mapTileLine);
	return mapTileLine;
}

function createTileSelectContent() {
	var html = addOption('Clear', '', 'clearTile(this);');
	for (var i = 0; i < MAP_TILES_LIST.length; i++) {
		html += addOption(MAP_TILES_LIST[i] + ' ', '', 'updateTile(this, \'' + MAP_TILES_LIST[i] + '\')');
	}
	return html;
}

function updateTile(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.tile-title').html(value + ' ');
	container.find('input[name="tile-title"]').attr('value',value);
}

function clearTile(element) {
	var container = $(element).parents('.select-row');
	container.find('.tile-title').html('Select tile ');
	container.find('input[name="tile-title"]').attr('value','');
}

function createSideSelectContent() {
	var html = addOption('Clear', '', 'clearSide(this);');
	html += addOption('A ', '', 'updateSide(this, \'A\')');
	html += addOption('B ', '', 'updateSide(this, \'B\')');
	return html;
}

function updateSide(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.side-title').html(value + ' ');
	container.find('input[name="tile-side"]').attr('value',value);
}

function clearSide(element) {
	var container = $(element).parents('.select-row');
	container.find('.side-title').html('Select tile ');
	container.find('input[name="tile-side"]').attr('value','');
}

function createAngleSelectContent() {
	var html = addOption('Clear', '', 'clearAngle(this);');
	html += addOption('0 ', '', 'updateAngle(this, \'0\')');
	html += addOption('90 ', '', 'updateAngle(this, \'90\')');
	html += addOption('180 ', '', 'updateAngle(this, \'180\')');
	html += addOption('270 ', '', 'updateAngle(this, \'270\')');
	return html;
}

function updateAngle(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.angle-title').html(value + ' ');
	container.find('input[name="tile-angle"]').attr('value',value);
}

function clearAngle(element) {
	var container = $(element).parents('.select-row');
	container.find('.angle-title').html('Select tile ');
	container.find('input[name="tile-angle"]').attr('value','');
}

function getMapTiles() {
	var result = [];
	var tiles = $('#tiles-container .select-row');
	for (var i = 0; i < tiles.length; i++) {
		var container = $(tiles[i]);
		var tile = {};
		tile.title = container.find('[name="tile-title"]').val();
		tile.side = container.find('[name="tile-side"]').val();
		tile.x = container.find('[name="tile-x"]').val();
		tile.y = container.find('[name="tile-y"]').val();
		tile.angle = container.find('[name="tile-angle"]').val();
		result.push(tile);
	}
	return result;
}

function addDoorLine() {
	var doorLine = $('<div>');
	addUnitLine(doorLine, 'door');
	doorLine.find('input[type="text"]').remove();
	doorLine.find('.select-door').after(createInputSelect('Select direction', 'direction-title', 'select-direction'));

	var openedCheckbox = $('<div>').addClass('checkbox').addClass('door-opened');
	var checkboxContent = $('<label>');
	checkboxContent.append($('<input>').attr('type', 'checkbox').attr('name','opened'));//.attr('onclick','updateOpened(this)')
	checkboxContent.append('opened');
	openedCheckbox.append(checkboxContent);
	doorLine.append(openedCheckbox);

	doorLine.append($('<input type="hidden" name="door-direction" value=""/>'));

	doorLine.find('.select-door ul').append(createDoorSelectContent());
	doorLine.find('.select-direction ul').append(createDirectionSelectContent());
	doorLine.find('.select-x ul').addClass('showOneCell').append(createXSelectContent(true));
	doorLine.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));
	doorLine.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove row</button>'));
	$('#doors-container').append(doorLine);
	return doorLine;
}

function createDoorSelectContent() {
	var html = addOption('Clear', '', 'clearDoor(this);');
	for (var i = 0; i < DOORS_LIST.length; i++) {
		html += addOption(DOORS_LIST[i] + ' ', '', 'updateDoor(this, \'' + DOORS_LIST[i] + '\')');
	}
	return html;
}

function updateDoor(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.door-title').html(value + ' ');
	container.find('input[name="door-title"]').attr('value',value);
}

function clearDoor(element) {
	var container = $(element).parents('.select-row');
	container.find('.door-title').html('Select door ');
	container.find('input[name="door-title"]').attr('value','');
}

function getDoors() {
	var result = [];
	var doors = $('#doors-container .select-row');
	for (var i = 0; i < doors.length; i++) {
		var container = $(doors[i]);
		var door = {};
		door.title = container.find('[name="door-title"]').val();
		door.vertical = container.find('[name="door-direction"]').val() == 'vertical';
		door.x = container.find('[name="door-x"]').val();
		door.y = container.find('[name="door-y"]').val();
		door.opened = container.find('[name="opened"]').prop('checked');
		result.push(door);
	}
	return result;
}

function addXsLine() {
	var xLine = $('<div>');
	addUnitLine(xLine, 'Xs');
	xLine.find('input[type="text"]').remove();

	xLine.find('.select-xs ul').append(createXsSelectContent());
	xLine.find('.select-x ul').addClass('showOneCell').append(createXSelectContent(true));
	xLine.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));
	xLine.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove row</button>'));
	$('#xs-container').append(xLine);
	return xLine;
}

function createXsSelectContent() {
	var html = addOption('Clear', '', 'clearXs(this);');
	for (var i = 0; i < BLOCKS_LIST.length; i++) {
		html += addOption(BLOCKS_LIST[i] + ' ', '', 'updateXs(this, \'' + BLOCKS_LIST[i] + '\')');
	}
	return html;
}

function updateXs(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.xs-title').html(value + ' ');
	container.find('input[name="xs-title"]').attr('value',value);
}

function clearXs(element) {
	var container = $(element).parents('.select-row');
	container.find('.xs-title').html('Select X ');
	container.find('input[name="xs-title"]').attr('value','');
}

function getXs() {
	var result = [];
	var xs = $('#xs-container .select-row');
	for (var i = 0; i < xs.length; i++) {
		var container = $(xs[i]);
		var x = {};
		x.title = container.find('[name="xs-title"]').val();
		x.x = container.find('[name="xs-x"]').val();
		x.y = container.find('[name="xs-y"]').val();
		result.push(x);
	}
	return result;
}

function clearMapControlTab() {
	$('#tiles-container .select-row').remove();
	$('#doors-container .select-row').remove();
	$('#xs-container .select-row').remove();
}

