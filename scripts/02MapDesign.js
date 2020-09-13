function InitializeWindowFor_MapDesign() {
	var html = $('#map-controls');

	//Level Button
//	html.append(Create_LevelButton());

	//tiles zone
	html.append(CreateZone_Tiles());
	//OverlayTiles zone
	html.append(CreateZone_OverlayTiles());
	//doors zone
	html.append(CreateZone_Doors());
}

function UpdateWindow_MapDesign() {
	//after Level Set
//	Update_EncounterList('', CurrentLevel);
}


function GetWindow_MapDesign(DataToUpdate) {
	DataToUpdate = GetZone_Tiles(DataToUpdate);
	DataToUpdate = GetZone_OverlayTiles(DataToUpdate);
	DataToUpdate = GetZone_Doors(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_MapDesign(NewData, FromPreFilledMaps) {
	//Fill_LevelButton(); -> Common not Filled Here
	FillZone_Tiles(NewData, FromPreFilledMaps);
	FillZone_OverlayTiles(NewData, FromPreFilledMaps);
	FillZone_Doors(NewData, FromPreFilledMaps);
}

function ResetWindow_MapDesign(FromPreFilledMaps) {
	ResetZone_Tiles(FromPreFilledMaps);
	ResetZone_OverlayTiles(FromPreFilledMaps);
	ResetZone_Doors(FromPreFilledMaps);
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
	Object.keys(MAP_TILES_LIST).forEach(item => {
		html += addOption(MAP_TILES_LIST[item].title + ' ', '', 'Set_Tile(this, \'' + item + '\')');
	});
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
			doorLine.XYBase = doorLine.AllData[NewData.doors[i].id].width + 'x' + doorLine.AllData[NewData.doors[i].id].height;
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
	Object.keys(DOORS_LIST).forEach(item => {
		html += addOption(DOORS_LIST[item].title + ' ', '', 'Set_Door(this, \'' + item + '\')');
	});
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
			OverlayTileLine.XYBase = OverlayTileLine.AllData[NewData.overlaytiles[i].id].width + 'x' + OverlayTileLine.AllData[NewData.overlaytiles[i].id].height;
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
	Object.keys(OVERLAYTILES_LIST).forEach(item => {
		html += addOption(OVERLAYTILES_LIST[item].title + ' ', '', 'Set_OverlayTiles(this, \'' + item + '\')');
	});
	return html;
}

function Set_OverlayTiles(element, value) {
	var container = $(element).parents('.select-row');
	OverlayTileLine.XYBase = OverlayTileLine.AllData[value].width + 'x' + OverlayTileLine.AllData[value].height;
	OverlayTileLine.Set_MainElement(container, value);
}

function UnSet_OverlayTiles(element) {
	var container = $(element).parents('.select-row');
	OverlayTileLine.UnSet_MainElement(container);
}

