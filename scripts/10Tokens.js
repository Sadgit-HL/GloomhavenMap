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

/*

function constructMiscellaneousObjectsTabFromConfig() {
	if (config.objectives != undefined) {
		for (var i = 0 ; i < config.objectives.length; i++) {
			var container = addObjectiveLine();
			var objective = config.objectives[i];
			updateObjective(container.find('.select-maptoken li')[0], objective.title);
			container.find('[name="maptoken-x"]').val(objective.x);
			container.find('.x-title').html(getAlphabetChar(objective.x - 1) + ' ');
			container.find('[name="maptoken-y"]').val(objective.y);
			container.find('.y-title').html(objective.y.toString() + ' ');
			if (objective.hp != undefined) {
				addHpInput(container.find('[onclick="addHpInput(this);"]'));
				container.find('input[name="hp"]').val(objective.hp);
			}
		}
	}
}

function createObjectiveSelectContent() {
	var html = addOption('Clear', '', 'clearObjective(this);');
	for (var i = 0; i < MOVABLE_TOKENS_LIST.length; i++) {
		html += addOption(MOVABLE_TOKENS_LIST[i][0] + ' ', '', 'updateObjective(this, \'' + MOVABLE_TOKENS_LIST[i][0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < MOVABLE_OBJECTS_LIST.length; i++) {
		html += addOption(MOVABLE_OBJECTS_LIST[i][0] + ' ', '', 'updateObjective(this, \'' + MOVABLE_OBJECTS_LIST[i][0] + '\')');
	}
	return html;
}

function clearMiscellaneousObjectsTab() {
	$('#maptoken-container .select-row').remove();
}

function addObjectiveLine() {
	var objective = $('<div>');
	addUnitLine(objective, 'Map Token');
	objective.find('input[type="text"]').remove();

	objective.find('.select-maptoken ul').append(createObjectiveSelectContent());
	objective.find('.select-x ul').addClass('showOneCell').append(createXSelectContent(true));
	objective.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));
	objective.append($('<button type="button" class="btn btn-warning" aria-expanded="false" onclick="addHpInput(this);">Add HP</button>'));
	objective.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove map token</button>'));
	$('#maptoken-container').append(objective);
	return objective;
}

function updateObjective(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.maptoken-title').html(value + ' ');
	container.find('input[name="maptoken-title"]').attr('value',value);
}

function clearObjective(element) {
	var container = $(element).parents('.select-row');
	container.find('.maptoken-title').html('Select Map Token ');
	container.find('input[name="maptoken-title"]').attr('value','');
}

function getObjectives() {
	var result = [];
	var objectives = $('#maptoken-container .select-row');
	for (var i = 0; i < objectives.length; i++) {
		var container = $(objectives[i]);
		var objective = {};
		objective.title = container.find('[name="maptoken-title"]').val();
		objective.x = container.find('[name="maptoken-x"]').val();
		objective.y = container.find('[name="maptoken-y"]').val();
		var objectiveHp = container.find('[name="hp"]');
		if (objectiveHp.length > 0) {
			objective.hp = $(objectiveHp[0]).val();
		}
		result.push(objective);
	}
	return result;
}
*/


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
			if (MOVABLE_TOKENS[NewData.maptokens[i].title] != undefined)
			{
				MovableMapTokenLine.XYBase = MOVABLE_TOKENS[NewData.maptokens[i].title].width + 'x' + MOVABLE_TOKENS[NewData.maptokens[i].title].height;
			}
			if (MOVABLE_OBJECTS[NewData.maptokens[i].title] != undefined)
			{
				MovableMapTokenLine.XYBase = MOVABLE_OBJECTS[NewData.maptokens[i].title].width + 'x' + MOVABLE_OBJECTS[NewData.maptokens[i].title].height;
			}
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

	for (var i = 0; i < MOVABLE_TOKENS_LIST.length; i++) {
		html += addOption(MOVABLE_TOKENS_LIST[i][0] + ' ', '', 'Set_MovableMapTokens(this, \'' + MOVABLE_TOKENS_LIST[i][0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < MOVABLE_OBJECTS_LIST.length; i++) {
		html += addOption(MOVABLE_OBJECTS_LIST[i][0] + ' ', '', 'Set_MovableMapTokens(this, \'' + MOVABLE_OBJECTS_LIST[i][0] + '\')');
	}

	return html;
}

function Set_MovableMapTokens(element, value) {
	var container = $(element).parents('.select-row');
	if (MOVABLE_TOKENS[value] != undefined)
	{
		MovableMapTokenLine.XYBase = MOVABLE_TOKENS[value].width + 'x' + MOVABLE_TOKENS[value].height;
	}
	if (MOVABLE_OBJECTS[value] != undefined)
	{
		MovableMapTokenLine.XYBase = MOVABLE_OBJECTS[value].width + 'x' + MOVABLE_OBJECTS[value].height;
	}
	MovableMapTokenLine.Set_MainElement(container, value);
}

function UnSet_MovableMapTokens(element) {
	var container = $(element).parents('.select-row');
	MovableMapTokenLine.UnSet_MainElement(container);
}

