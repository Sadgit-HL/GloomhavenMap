function InitializeWindowFor_MapTokens() {
	var html = $('#map-tokens');

	//OverlayTiles zone
	html.append(CreateZone_MovableMapTokens());

}

function UpdateWindow_MapTokens() {
	//after Level Set
//	Update_EncounterList('', CurrentLevel);
}


function GetWindow_MapTokens(DataToUpdate) {
	DataToUpdate = GetZone_MovableMapTokens(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_MapTokens(NewData, FromPreFilledMaps) {
	//Fill_LevelButton(); -> Common not Filled Here
	FillZone_MovableMapTokens(NewData, FromPreFilledMaps);
}

function ResetWindow_MapTokens(FromPreFilledMaps) {
	ResetZone_MovableMapTokens(FromPreFilledMaps);
}


//Movable Map Tokens zone
function CreateZone_MovableMapTokens() {
	var html = $('<div>');
	var container = $('<div>').addClass('maptoken-container');
	container.append('<h1>Movable Map Tokens</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_MovableMapTokens();">Add Map Token</button>');
	//initialize LineClass
	MovableMapTokenLine.NameListValues = Create_MovableMapTokenListValues();
	return html;
}

function GetZone_MovableMapTokens(DataToUpdate) {
	var result = [];
	var overlay = $('.maptoken-container .select-row');
	for (var i = 0; i < overlay.length; i++) {
		var container = $(overlay[i]);
		var x = {};
		x = MovableMapTokenLine.GetOneLineData(container);
		result.push(x);
	}
	DataToUpdate.maptokens = result;
	return DataToUpdate;
}

function FillZone_MovableMapTokens(NewData, FromPreFilledMaps) {
	ResetZone_MovableMapTokens(FromPreFilledMaps);
	if (NewData.maptokens != undefined) {
		for (var i = 0 ; i < NewData.maptokens.length; i++) {
			MovableMapTokenLine.XYBase = MovableMapTokenLine.AllData[NewData.maptokens[i].id].width + 'x' + MovableMapTokenLine.AllData[NewData.maptokens[i].id].height;
			var html = MovableMapTokenLine.AddOneLineWithData(NewData.maptokens[i]);
			$('.maptoken-container').append(html);
		}
	}
}

function ResetZone_MovableMapTokens(FromPreFilledMaps) {
	$('.maptoken-container .select-row').remove();
}

function AddLine_MovableMapTokens() {
	MovableMapTokenLine.XYBase = "1x1";
	var html = MovableMapTokenLine.AddOneEmptyLine()
	$('.maptoken-container').append(html);
	return html;
}

function Create_MovableMapTokenListValues() {
	var html = addOption('Clear', '', 'UnSet_MovableMapTokens(this);');
	Object.keys(MOVABLE_TOKENS_LIST).forEach(item => {
		html += addOption(MOVABLE_TOKENS_LIST[item].title + ' ', '', 'Set_MovableMapTokens(this, \'' + item + '\')');
	});
	return html;
}

function Set_MovableMapTokens(element, value) {
	var container = $(element).parents('.select-row');
	MovableMapTokenLine.XYBase = MovableMapTokenLine.AllData[value].width + 'x' + MovableMapTokenLine.AllData[value].height;
	MovableMapTokenLine.Set_MainElement(container, value);
}

function UnSet_MovableMapTokens(element) {
	var container = $(element).parents('.select-row');
	MovableMapTokenLine.UnSet_MainElement(container);
}

