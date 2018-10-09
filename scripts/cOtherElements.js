//Act Button Element
function Create_ActButton()
{
	var DisplayAct = "II";
	if (CurrentAct == "I")
	{
		DisplayAct = "I";
	}

	var html;
	html = $('<div>').addClass('SelectAct');
	html.append('<input type="image" src="images/misc/Act' + DisplayAct + '.png" class="ImgAct" onclick="SwitchAct();" />');
	return html;
}

function Fill_ActButton()
{
	var ActImg = $('.ImgAct');
	var ActImgSrc = ActImg.attr('src');
	ActImgSrc = ActImgSrc.replace('ActII','ActI');
	ActImgSrc = ActImgSrc.replace('ActI', 'Act' + CurrentAct);
	ActImg.attr('src', ActImgSrc);
}

function SwitchAct()
{
	var SwitcToAct = "I";
	if (CurrentAct == "I")
	{
		SwitcToAct = "II";
	}

	var ActImg = $('.ImgAct');
	var ActImgSrc = ActImg.attr('src');
	ActImgSrc = ActImgSrc.replace('Act' + CurrentAct, 'Act' + SwitcToAct)
	ActImg.attr('src', ActImgSrc);

	//new current Act
	CurrentAct = SwitcToAct;

	UpdateWindow_OLFigures();
	UpdateWindow_MapDesign();
}

function updateAct(NewAct) {
	CurrentAct = NewAct;
	Fill_ActButton();
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

