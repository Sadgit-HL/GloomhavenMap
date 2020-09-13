//Level Button Element
function Create_LevelButton()
{
	/*
	var DisplayLevel = "II";
	if (CurrentLevel == "I")
	{
		DisplayLevel = "I";
	}
	*/

	var html;
	html = $('<div>').addClass('SelectLevel');
	html.append('<input type="image" src="' + ImagePathRoot + ImagePathLevelImage + 'Level' + CurrentLevel + '.png" class="ImgLevel" onclick="SwitchLevel();" />');
	return html;
}

function Fill_LevelButton()
{
	var LevelImg = $('.ImgLevel');
	var LevelImgSrc = LevelImg.attr('src');
	LevelImgSrc = ImagePathRoot + ImagePathLevelImage + 'Level' + CurrentLevel + ".png";
	LevelImg.attr('src', LevelImgSrc);
}

function SwitchLevel()
{
	var SwitcToLevel = CurrentLevel + 1;
	if (SwitcToLevel == 8)
	{
		SwitcToLevel= 0
	}
	/*
	if (CurrentLevel == "I")
	{
		SwitcToLevel = "II";
	}
	*/

	var LevelImg = $('.ImgLevel');
	var LevelImgSrc = LevelImg.attr('src');
	LevelImgSrc = LevelImgSrc.replace('Level' + CurrentLevel, 'Level' + SwitcToLevel)
	LevelImg.attr('src', LevelImgSrc);

	//new current Level
	CurrentLevel = SwitcToLevel;

	UpdateWindow_OLFigures();
	UpdateWindow_MapDesign();
}

function updateLevel(NewLevel) {
	CurrentLevel = NewLevel;
	Fill_LevelButton();
	//Data Linked
	UpdateWindow_OLFigures();
}

//expansions
function Create_ExpansionList()
{
	var html;
	html = $('<div>').addClass('expansions');
	for (var expansionGroup in EXPANSION_GROUPS) {
		if (EXPANSION_GROUPS[expansionGroup] == undefined) continue;
		var GroupHTML = $('<div>').addClass('expansions-group');
		GroupHTML.append("<b>"+expansionGroup+"</b>");

		var expansionList = EXPANSION_GROUPS[expansionGroup];
		for (var i = 0; i < expansionList.length; i++) {
			var expansion = expansionList[i];
			var expansionObject = $('<div>').addClass('checkbox');
			var expansionInput = $('<input type="checkbox" class="Expansions-Value" name="' + folderize(expansion) + '" onClick="Set_Expansion(this, \'' + folderize(expansion) + '\');" />');
			expansionInput.prop('checked', true);
			expansionObject.append($('<label> ' + expansion + '</label>').prepend(expansionInput));
			GroupHTML.append(expansionObject);
		}
		html.append(GroupHTML);
	}
	return html;
}

function Set_Expansion(element, value) {
	if ($(element).hasClass('expansions')) {
		$('[name="' + urlize(value) + '"]').prop('checked',true);
	}
	//Data Linked
	updateMonstersVisibility();
}

function GetZone_Expansions(DataToUpdate) {
	var result = {};
	var SelectedExpansions = $('.Expansions-Value:checkbox:checked')
	for (var i = 0; i < SelectedExpansions.length; i++) {
		var checkedExpansion = $(SelectedExpansions[i]).attr('name');
		result[checkedExpansion] = checkedExpansion;
	}
	DataToUpdate.expansions = result;
	return DataToUpdate;
}

function FillZone_Expansions(NewData, FromPreFilledMaps) {
	ResetZone_Expansions(FromPreFilledMaps);
	if (NewData.expansions != undefined) {
		for (var oneExpansion in NewData.expansions) {
			Set_Expansion($('.expansions'), oneExpansion);
		}
	}
}

function ResetZone_Expansions(FromPreFilledMaps) {
	$('.Expansions-Value').prop('checked',false);
}

