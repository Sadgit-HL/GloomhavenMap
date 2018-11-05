function InitializeWindowFor_MapDesign() {
	var html = $('#map-controls');

	//Act Button
//	html.append(Create_ActButton());

	//pre-filled Maps zone
//	html.append(CreateZone_PreFilledMaps());
	//tiles zone
	html.append(CreateZone_Tiles());
	//OverlayTiles zone
	html.append(CreateZone_OverlayTiles());
	//doors zone
	html.append(CreateZone_Doors());
}

function UpdateWindow_MapDesign() {
	//after Act Set
	Update_EncounterList('', CurrentAct);
}


function GetWindow_MapDesign(DataToUpdate) {
	DataToUpdate = GetZone_Tiles(DataToUpdate);
	DataToUpdate = GetZone_OverlayTiles(DataToUpdate);
	DataToUpdate = GetZone_Doors(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_MapDesign(NewData, FromPreFilledMaps) {
	//Fill_ActButton(); -> Common not Filled Here
	FillZone_Tiles(NewData, FromPreFilledMaps);
	FillZone_OverlayTiles(NewData, FromPreFilledMaps);
	FillZone_Doors(NewData, FromPreFilledMaps);
}

function ResetWindow_MapDesign(FromPreFilledMaps) {
	ResetZone_Tiles(FromPreFilledMaps);
	ResetZone_OverlayTiles(FromPreFilledMaps);
	ResetZone_Doors(FromPreFilledMaps);
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
			doorLine.XYBase = DOORS[NewData.doors[i].title].width + 'x' + DOORS[NewData.doors[i].title].height;
			var html = doorLine.AddOneLineWithData(NewData.doors[i]);
			$('.doors-container').append(html);
		}
	}
}

function ResetZone_Doors(FromPreFilledMaps) {
	$('.doors-container .select-row').remove();
}

function AddLine_Door() {
	doorLine.XYBase = "1x1";
	var html = doorLine.AddOneEmptyLine()
	$('.doors-container').append(html);
	return html;
}

function Create_DoorListValues() {
	var html = addOption('Clear', '', 'UnSet_Door(this);');
	for (var i = 0; i < DOORS_LIST.length; i++) {
		html += addOption(DOORS_LIST[i][0] + ' ', '', 'Set_Door(this, \'' + DOORS_LIST[i][0] + '\')');
	}
	return html;
}

function Set_Door(element, value) {
	doorLine.XYBase = "1x1";
	var container = $(element).parents('.select-row');
	doorLine.Set_MainElement(container, value);
}

function UnSet_Door(element) {
	var container = $(element).parents('.select-row');
	doorLine.UnSet_MainElement(container);
}


//X Marks zone
function CreateZone_OverlayTiles() {
	var html = $('<div>');
	var container = $('<div>').addClass('overlaytile-container');
	container.append('<h1>Overlay Tiles</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_OverlayTiles();">Add Overlay Tile</button>');
	//initialize LineClass
	OverlayTileLine.NameListValues = Create_OverlayTileListValues();
	return html;
}

function GetZone_OverlayTiles(DataToUpdate) {
	var result = [];
	var overlay = $('.overlaytile-container .select-row');
	for (var i = 0; i < overlay.length; i++) {
		var container = $(overlay[i]);
		var x = {};
		x = OverlayTileLine.GetOneLineData(container);
		result.push(x);
	}
	DataToUpdate.overlaytiles = result;
	return DataToUpdate;
}

function FillZone_OverlayTiles(NewData, FromPreFilledMaps) {
	ResetZone_OverlayTiles(FromPreFilledMaps);
	if (NewData.overlaytiles != undefined) {
		for (var i = 0 ; i < NewData.overlaytiles.length; i++) {
			OverlayTileLine.XYBase = OVERLAYTILES[NewData.overlaytiles[i].title].width + 'x' + OVERLAYTILES[NewData.overlaytiles[i].title].height;
			var html = OverlayTileLine.AddOneLineWithData(NewData.overlaytiles[i]);
			$('.overlaytile-container').append(html);
		}
	}
}

function ResetZone_OverlayTiles(FromPreFilledMaps) {
	$('.overlaytile-container .select-row').remove();
}

function AddLine_OverlayTiles() {
	OverlayTileLine.XYBase = "1x1";
	var html = OverlayTileLine.AddOneEmptyLine()
	$('.overlaytile-container').append(html);
	return html;
}

function Create_OverlayTileListValues() {
	var html = addOption('Clear', '', 'UnSet_OverlayTiles(this);');
	for (var i = 0; i < OVERLAYTILES_LIST.length; i++) {
		html += addOption(OVERLAYTILES_LIST[i][0] + ' ', '', 'Set_OverlayTiles(this, \'' + OVERLAYTILES_LIST[i][0] + '\')');
	}
	return html;
}

function Set_OverlayTiles(element, value) {
	var container = $(element).parents('.select-row');
	OverlayTileLine.XYBase = OVERLAYTILES[value].width + 'x' + OVERLAYTILES[value].height;
	OverlayTileLine.Set_MainElement(container, value);
}

function UnSet_OverlayTiles(element) {
	var container = $(element).parents('.select-row');
	OverlayTileLine.UnSet_MainElement(container);
}

