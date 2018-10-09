function InitializeWindowFor_MapDesign() {
	var html = $('#map-controls');

	//Act Button
	html.append(Create_ActButton());

	//pre-filled Maps zone
	html.append(CreateZone_PreFilledMaps());
	//tiles zone
	html.append(CreateZone_Tiles());
	//doors zone
	html.append(CreateZone_Doors());
	//xMarks zone
	html.append(CreateZone_XMarks());
}

function UpdateWindow_MapDesign() {
	//after Act Set
	Update_EncounterList('', CurrentAct);
}


function GetWindow_MapDesign(DataToUpdate) {
	DataToUpdate = GetZone_Tiles(DataToUpdate);
	DataToUpdate = GetZone_Doors(DataToUpdate);
	DataToUpdate = GetZone_XMarks(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_MapDesign(NewData, FromPreFilledMaps) {
	//Fill_ActButton(); -> Common not Filled Here
	FillZone_Tiles(NewData, FromPreFilledMaps);
	FillZone_Doors(NewData, FromPreFilledMaps);
	FillZone_XMarks(NewData, FromPreFilledMaps);
}

function ResetWindow_MapDesign(FromPreFilledMaps) {
	ResetZone_Tiles(FromPreFilledMaps);
	ResetZone_Doors(FromPreFilledMaps);
	ResetZone_XMarks(FromPreFilledMaps);
}

//pre-filled Maps zone
function CreateZone_PreFilledMaps() {
	var html = $('<div>').addClass('full-maps-container');
	html.append('<h1>Full maps</h1>');
	html.append(Create_CampaignList());
	html.append(Create_EncounterList());
	return html;
}

function Create_CampaignList() {
	var html = createInputSelect('Select Campaign ', 'Campaign-Title', 'select-campaign');
	html.find('ul').addClass('showcampaign ' + ALL_CAMPAIGNS_CLASSES);
	html.find('ul').append(addOption('Clear', '', 'UnSet_Campaign(this,\'\');'));
	for (var i = 0; i < CAMPAIGNS.length; i++) {
		var code = CAMPAIGNS[i][1];
		var title = CAMPAIGNS[i][0];
		html.find('ul').append(addOption(title + ' ', code, 'Set_Campaign(this, \'' + code + '\');'));
	}
	html.append($('<input type="hidden" name="Campaign-Value" class="Campaign-Value" value=""/>'));
	return html;
}

function Create_EncounterList() {
	var html = createInputSelect('Remove and replace current map with : Quest / Encounter ', 'encounter-title', 'select-encounter');
	html.find('ul').addClass('showencounter ' + ALL_CAMPAIGNS_CLASSES + ' ' + ALL_ACTS);
	for (var i = 0; i < MAP_HASES_LIST.length; i++) {
		html.find('ul').append(addOption(MAP_HASES_LIST[i][1] + ' ',MAP_HASES_LIST[i][0] + ' ' + 'Act' + MAP_HASES_LIST[i][2], 'rebuildMap(this, \'' + i + '\', false);'));
	}
	return html;
}

function Set_Campaign(element, value) {
	var container = $(element).parents('.full-maps-container');
	container.find('.Campaign-Title').html(element.innerText + ' ');
	container.find('.Campaign-Value').attr('value',value);
	Update_EncounterList(value, CurrentAct);
}

function UnSet_Campaign(element, value) {
	var container = $(element).parents('.full-maps-container');
	container.find('.select-campaign ul').addClass(ALL_CAMPAIGNS_CLASSES);
	container.find('.Campaign-Title').html('Select campaign ');
	container.find('.Campaign-Value').attr('value',value);
	Update_EncounterList(ALL_CAMPAIGNS_CLASSES, ALL_ACTS);
}

function Update_EncounterList(campaign, act) {
	var container = $('.full-maps-container');
	if (campaign != '') {
		container.find('.select-encounter ul').removeClass(ALL_CAMPAIGNS_CLASSES).addClass(campaign);
	}
	if (act == "I" || act == "II") {
		act = 'Act' + act;
	}
	container.find('.select-encounter ul').removeClass(ALL_ACTS).addClass(act);
}

//tiles zone
function CreateZone_Tiles() {
	var html = $('<div>');
	var container = $('<div>').addClass('tiles-container');
	container.append('<h1>Map tiles</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Tile();">Add map tile</button>');
	//initialize LineClass
	tileLine.NameListValues = Create_TileListValues();

	return html;
}

function GetZone_Tiles(DataToUpdate) {
	var result = [];
	var tiles = $('.tiles-container .select-row');
	for (var i = 0; i < tiles.length; i++) {
		var container = $(tiles[i]);
		var tile = {};
		tile = tileLine.GetOneLineData(container);
		result.push(tile);
	}
	DataToUpdate.tiles = result;
	return DataToUpdate;
}

function FillZone_Tiles(NewData, FromPreFilledMaps) {
	ResetZone_Tiles(FromPreFilledMaps);
	if (NewData.tiles != undefined) {
		for (var i = 0 ; i < NewData.tiles.length; i++) {
			tileLine.XYBase = "1x1";
			var html = tileLine.AddOneLineWithData(NewData.tiles[i]);
			$('.tiles-container').append(html);
		}
	}
}

function ResetZone_Tiles(FromPreFilledMaps) {
	$('.tiles-container .select-row').remove();
}

function AddLine_Tile() {
	tileLine.XYBase = "1x1";
	var html = tileLine.AddOneEmptyLine();
	$('.tiles-container').append(html);
	return html;
}

function Create_TileListValues() {
	var html = addOption('Clear', '', 'UnSet_Tile(this);');
	for (var i = 0; i < MAP_TILES_LIST.length; i++) {
		html += addOption(MAP_TILES_LIST[i] + ' ', '', 'Set_Tile(this, \'' + MAP_TILES_LIST[i] + '\')');
	}
	return html;
}

function Set_Tile(element, value) {
	tileLine.XYBase = "1x1";
	var container = $(element).parents('.select-row');
	tileLine.Set_MainElement(container, value);
}

function UnSet_Tile(element) {
	var container = $(element).parents('.select-row');
	tileLine.UnSet_MainElement(container);
}

//doors zone
function CreateZone_Doors() {
	var html = $('<div>');
	var container = $('<div>').addClass('doors-container');
	container.append('<h1>Doors</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Door();">Add door</button>');
	//initialize LineClass
	doorLine.NameListValues = Create_DoorListValues();

	return html;
}

function GetZone_Doors(DataToUpdate) {
	var result = [];
	var doors = $('.doors-container .select-row');
	for (var i = 0; i < doors.length; i++) {
		var container = $(doors[i]);
		var door = {};
		door = doorLine.GetOneLineData(container);
		result.push(door);
	}
	DataToUpdate.doors = result;
	return DataToUpdate;
}

function FillZone_Doors(NewData, FromPreFilledMaps) {
	ResetZone_Doors(FromPreFilledMaps);
	if (NewData.doors != undefined) {
		for (var i = 0 ; i < NewData.doors.length; i++) {
			doorLine.XYBase = "1x2";
			var html = doorLine.AddOneLineWithData(NewData.doors[i]);
			$('.doors-container').append(html);
		}
	}
}

function ResetZone_Doors(FromPreFilledMaps) {
	$('.doors-container .select-row').remove();
}

function AddLine_Door() {
	doorLine.XYBase = "1x2";
	var html = doorLine.AddOneEmptyLine()
	$('.doors-container').append(html);
	return html;
}

function Create_DoorListValues() {
	var html = addOption('Clear', '', 'UnSet_Door(this);');
	for (var i = 0; i < DOORS_LIST.length; i++) {
		html += addOption(DOORS_LIST[i] + ' ', '', 'Set_Door(this, \'' + DOORS_LIST[i] + '\')');
	}
	return html;
}

function Set_Door(element, value) {
	doorLine.XYBase = "1x2";
	var container = $(element).parents('.select-row');
	doorLine.Set_MainElement(container, value);
}

function UnSet_Door(element) {
	var container = $(element).parents('.select-row');
	doorLine.UnSet_MainElement(container);
}


//X Marks zone
function CreateZone_XMarks() {
	var html = $('<div>');
	var container = $('<div>').addClass('xs-container');
	container.append('<h1>Xs</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_XMarks();">Add X</button>');
	//initialize LineClass
	xMarkLine.NameListValues = Create_xMarkListValues();
	return html;
}

function GetZone_XMarks(DataToUpdate) {
	var result = [];
	var xs = $('.xs-container .select-row');
	for (var i = 0; i < xs.length; i++) {
		var container = $(xs[i]);
		var x = {};
		x = xMarkLine.GetOneLineData(container);
		result.push(x);
	}
	DataToUpdate.xs = result;
	return DataToUpdate;
}

function FillZone_XMarks(NewData, FromPreFilledMaps) {
	ResetZone_XMarks(FromPreFilledMaps);
	if (NewData.xs != undefined) {
		for (var i = 0 ; i < NewData.xs.length; i++) {
			xMarkLine.XYBase = BLOCKS[NewData.xs[i].title].width + 'x' + BLOCKS[NewData.xs[i].title].height;
			var html = xMarkLine.AddOneLineWithData(NewData.xs[i]);
			$('.xs-container').append(html);
		}
	}
}

function ResetZone_XMarks(FromPreFilledMaps) {
	$('.xs-container .select-row').remove();
}

function AddLine_XMarks() {
	xMarkLine.XYBase = "1x1";
	var html = xMarkLine.AddOneEmptyLine()
	$('.xs-container').append(html);
	return html;
}

function Create_xMarkListValues() {
	var html = addOption('Clear', '', 'UnSet_XMarks(this);');
	for (var i = 0; i < BLOCKS_LIST.length; i++) {
		html += addOption(BLOCKS_LIST[i][0] + ' ', '', 'Set_XMarks(this, \'' + BLOCKS_LIST[i][0] + '\')');
	}
	return html;
}

function Set_XMarks(element, value) {
	var container = $(element).parents('.select-row');
	xMarkLine.XYBase = BLOCKS[value].width + 'x' + BLOCKS[value].height;
	xMarkLine.Set_MainElement(container, value);
}

function UnSet_XMarks(element) {
	var container = $(element).parents('.select-row');
	xMarkLine.UnSet_MainElement(container);
}

