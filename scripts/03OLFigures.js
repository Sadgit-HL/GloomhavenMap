function InitializeWindowFor_OLFigures() {
	var html = $('#monsters');

	html.append(Create_LevelButton());

	//monsters zone
	html.append(CreateZone_Monsters());
	//bosses zone
	html.append(CreateZone_Lieutenants());

	//expansions
//	html.append(Create_ExpansionList());
}

function UpdateWindow_OLFigures() {
	//after Level Set

	//Update_MonsterImages(RowElement);
	Update_MonsterImages();

	var LieutenantsList = $('.lieutenant-container .select-row');
	for (var i = 0; i < LieutenantsList.length; i++) {
		var container = $(LieutenantsList[i]);
		Update_LieutenantImages(container);
	}
}

function GetWindow_OLFigures(DataToUpdate) {
	DataToUpdate = GetZone_Monsters(DataToUpdate);
	DataToUpdate = GetZone_Lieutenants(DataToUpdate);
//	DataToUpdate = GetZone_Expansions(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_OLFigures(NewData, FromPreFilledMaps) {
	//Fill_LevelButton(); -> Common not Filled Here
	FillZone_Monsters(NewData, FromPreFilledMaps);
	FillZone_Lieutenants(NewData, FromPreFilledMaps);
//	FillZone_Expansions(NewData, FromPreFilledMaps);
}

function ResetWindow_OLFigures(FromPreFilledMaps) {
	ResetZone_Monsters(FromPreFilledMaps);
	ResetZone_Lieutenants(FromPreFilledMaps);
//	ResetZone_Expansions(FromPreFilledMaps);
}

//monsters zone
function CreateZone_Monsters() {
	var html = $('<div>');
	var container = $('<div>').addClass('monster-container');
	container.append('<h1>Monsters</h1>');
	container.append('<div class="monsters-cards"></div>');
	container.append('<div class="monsters-relicscards"></div>');
	container.append('<div class="monsters-tokenscards"></div>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Monster();">Add monster</button>');
	//initialize LineClass
	monsterLine.NameListValues = Create_MonsterListValues();
	monsterLine.RelicCommonImageContainer = "monsters-relicscards";
	monsterLine.TokenCommonImageContainer = "monsters-tokenscards";

	return html;
}

function GetZone_Monsters(DataToUpdate) {
	var result = [];
	var monsters = $('.monster-container .select-row');
	for (var i = 0; i < monsters.length; i++) {
		var container = $(monsters[i]);
		var monster = {};
		monster = monsterLine.GetOneLineData(container);
		result.push(monster);
	}
	DataToUpdate.monsters = result;
	return DataToUpdate;
}

function FillZone_Monsters(NewData, FromPreFilledMaps) {
	ResetZone_Monsters(FromPreFilledMaps);
	if (NewData.monsters != undefined) {
		for (var i = 0 ; i < NewData.monsters.length; i++) {
			monsterLine.XYBase = monsterLine.AllData[recoverMonsterBaseName(NewData.monsters[i].id)].width + 'x' + monsterLine.AllData[recoverMonsterBaseName(NewData.monsters[i].id)].height;
			var html = monsterLine.AddOneLineWithData(NewData.monsters[i]);
			$('.monster-container').append(html);
		}
		Update_MonsterImages();
	}
}

function ResetZone_Monsters(FromPreFilledMaps) {
	$('.monster-container .select-row').remove();
}

function AddLine_Monster() {
	monsterLine.XYBase = "1x1";
	var html = monsterLine.AddOneEmptyLine();
	$('.monster-container').append(html);
	return html;
}

function RemoveLine_Monster(Button) {
	Update_MonsterImages();
}

function Create_MonsterListValues() {
	var html = addOption('Clear', '', 'UnSet_Monster(this);');

	Object.entries(MONSTERS_LIST).forEach(OneItem => {
		var monsterClass = folderize(OneItem[1].expansion);
		for (var j = 0; j < OneItem[1].traits.length; j++) {
			monsterClass += ' ';
			monsterClass += urlize(OneItem[1].traits[j]);
		}
		var monsterID = OneItem[0];
		var monsterTitle = OneItem[1].title;
		var monsterVisible = true; //(monsterTraits[OneItem[1].traits[0]] != undefined || monsterTraits[OneItem[1].traits[1]] != undefined) && selectedExpansions[OneItem[1].expansion] != undefined;
		var option = $(addOption(monsterTitle + MasterSuffix, monsterClass, 'Set_Monster(this, \'' + monsterID + MasterSuffix + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
		option = $(addOption(monsterTitle + MinionSuffix, monsterClass, 'Set_Monster(this, \'' + monsterID + MinionSuffix + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
	});
	return html;
}

function Set_Monster(element, value) {
	var container = $(element).parents('.select-row');
	//for copatibility
	if (value.indexOf(MinionSuffix) < 0 && value.indexOf(MasterSuffix) < 0)
	{
		//by default minion
		value = value + MinionSuffix;
	}
	var OneMonsterValue = recoverMonsterBaseName(value);
	monsterLine.XYBase = monsterLine.AllData[OneMonsterValue].width + 'x' + monsterLine.AllData[OneMonsterValue].height;
	monsterLine.Set_MainElement(container, value);

	var monsterHp;
	if (value.indexOf(MasterSuffix) > -1) {
		if (CurrentLevel == "I") {
			monsterHp = MONSTERS_LIST[OneMonsterValue].masterHpActI;
		} else {
			monsterHp = MONSTERS_LIST[OneMonsterValue].masterHpActII;
		}
	} else {
		if (CurrentLevel == "I") {
			monsterHp = MONSTERS_LIST[OneMonsterValue].minionHpActI;
		} else {
			monsterHp = MONSTERS_LIST[OneMonsterValue].minionHpActII;
		}
	}

	Set_CustomInput(0, false, container, monsterHp);
	Update_MonsterImages(container);
}

function UnSet_Monster(element) {
	var container = $(element).parents('.select-row');
	monsterLine.UnSet_MainElement(container);
	Update_MonsterImages(container);
}

function Update_MonsterImages(RowElement) {
	var MonsterImageContainer = $('.monsters-cards');
	var MonsterList = $('.monster-container').find('.MainElement-Value');
	Reset_MonsterImages(RowElement);
	var LevelAddition = '_' + CurrentLevel;
	for (var i = 0; i < MonsterList.length; i++) {
		var OneMonsterValue = recoverMonsterBaseName($(MonsterList[i]).attr('value'));
		if (OneMonsterValue == undefined || OneMonsterValue == '') continue;
		if (MonsterImageContainer.find('.' + urlize(OneMonsterValue)).length == 0)
		{
			var MonsterImage = $('<img>');
			var ImageCardPath = ImagePathRoot + monsterLine.CardsPath(EXPANSION_PATHS[monsterLine.AllData[OneMonsterValue].expansion]);
			MonsterImage.attr('src', ImageCardPath + urlize(monsterLine.AllData[OneMonsterValue].title) + LevelAddition + '.png').addClass('monster').addClass(urlize(OneMonsterValue));
			MonsterImageContainer.append(MonsterImage);
			if (MONSTERS_LIST[OneMonsterValue].hasBack) {
				var monsterCardBack = $('<img>');
				monsterCardBack.attr('src', ImageCardPath + urlize(monsterLine.AllData[OneMonsterValue].title) + '_back' + LevelAddition + '.png');
				MonsterImageContainer.append(monsterCardBack);
			}
		}
	}
}

function Reset_MonsterImages(RowElement) {
	var MonsterImageContainer = $('.monsters-cards');
	MonsterImageContainer.find('img').remove()
}

//lieutenants zone
function CreateZone_Lieutenants() {
	var html = $('<div>');
	var container = $('<div>').addClass('lieutenant-container');
	container.append('<h1>Bosses</h1>');
	// non global -> line by line
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Lieutenant();">Add boss</button>');
	//initialize LineClass
	lieutenantLine.NameListValues = Create_LieutenantListValues();

	return html;
}

function GetZone_Lieutenants(DataToUpdate) {
	var result = [];
	var lieutenants = $('.lieutenant-container .select-row');
	for (var i = 0; i < lieutenants.length; i++) {
		var container = $(lieutenants[i]);
		var lieutenant = {};
		lieutenant = lieutenantLine.GetOneLineData(container);
		result.push(lieutenant);
	}
	DataToUpdate.lieutenants = result;
	return DataToUpdate;
}

function FillZone_Lieutenants(NewData, FromPreFilledMaps) {
	ResetZone_Lieutenants(FromPreFilledMaps);
	if (NewData.lieutenants != undefined) {
		for (var i = 0 ; i < NewData.lieutenants.length; i++) {
			lieutenantLine.XYBase = "1x1";
			var html = lieutenantLine.AddOneLineWithData(NewData.lieutenants[i]);
			Update_LieutenantImages(html);
			$('.lieutenant-container').append(html);
		}
	}
}

function ResetZone_Lieutenants(FromPreFilledMaps) {
	$('.lieutenant-container .select-row').remove();
}

function AddLine_Lieutenant() {
	lieutenantLine.XYBase = "1x1";
	var html = lieutenantLine.AddOneEmptyLine();
	$('.lieutenant-container').append(html);
	return html;
}

function RemoveLine_Lieutenant(Button) {
}

function Create_LieutenantListValues() {
	var html = addOption('Clear', '', 'UnSet_Lieutenant(this);');
	Object.keys(LIEUTENANTS_LIST).forEach(item => {
		html += addOption(LIEUTENANTS_LIST[item].title + ' ', '', 'Set_Lieutenant(this, \'' + item + '\')');
	});
	return html;
}

function Set_Lieutenant(element, value) {
	var container = $(element).parents('.select-row');
	lieutenantLine.XYBase = lieutenantLine.AllData[value].width + 'x' + lieutenantLine.AllData[value].height;
	lieutenantLine.Set_MainElement(container, value);
	Update_LieutenantImages(container);
}

function UnSet_Lieutenant(element) {
	var container = $(element).parents('.select-row');
	lieutenantLine.UnSet_MainElement(container);
	Update_LieutenantImages(container);
}

function Update_LieutenantImages(RowElement) {
	var LieutenantImageContainer = RowElement.find('.Row-cards');
	Reset_LieutenantImages(RowElement);
	var LevelAddition = '_' + CurrentLevel;

	var OneLieutenantValue = RowElement.find('.MainElement-Value').val();
	if (OneLieutenantValue == undefined || OneLieutenantValue == '') return;

	if (LieutenantImageContainer.find('.' + urlize(OneLieutenantValue)).length == 0)
	{
		var LieutenantImage = $('<img>');
		var ImageCardPath = ImagePathRoot + lieutenantLine.CardsPath(EXPANSION_PATHS[lieutenantLine.AllData[OneLieutenantValue].expansion]);
		LieutenantImage.attr('src', ImageCardPath + urlize(ieutenantLine.AllData[OneLieutenantValue].title) + LevelAddition + '.png').addClass('lieutenant').addClass(urlize(ieutenantLine.AllData[OneLieutenantValue].title));
		LieutenantImageContainer.append(LieutenantImage);
		if (LIEUTENANTS_LIST[OneLieutenantValue].hasBack) {
			var LieutenantCardBack = $('<img>');
			LieutenantCardBack.attr('src', ImageCardPath + urlize(ieutenantLine.AllData[OneLieutenantValue].title) + LevelAddition + '_back' + '.png');
			LieutenantImageContainer.append(LieutenantCardBack);
		}
	}
}

function Reset_LieutenantImages(RowElement) {
	var LieutenantImageContainer = RowElement.find('.Row-cards');
	LieutenantImageContainer.find('img').remove();
}

















function updateMonstersVisibility() {
	monsterTraits = {};
	selectedExpansions = {};
	var traitInputs = $('.monster-traits input');
	var expansionInputs = $('.expansions input');
	for (var i = 0; i < traitInputs.length; i++) {
		if ($(traitInputs[i]).prop('checked')) {
			var checkedTrait = $(traitInputs[i]).attr('name');
			monsterTraits[checkedTrait] = checkedTrait;
		}
	}
	for (var i = 0; i < expansionInputs.length; i++) {
		if ($(expansionInputs[i]).prop('checked')) {
			var selectedExpansion = $(expansionInputs[i]).attr('name');
			selectedExpansions[selectedExpansion] = selectedExpansion;
		}
	}
	$('.monster-container .select-monster li').css('display', 'none');
	for (var monsterTrait in monsterTraits) {
		for (var selectedExpansion in selectedExpansions) {
			if (monsterTraits[monsterTrait] == undefined || selectedExpansions[selectedExpansion] == undefined) continue;
			$('.monster-container .' + monsterTrait + '.' + selectedExpansion).css('display', 'block');
		}
	}
}



function adjustMonsterList() {
	monsterList = [];
	var monsters = $('[name="monster-title"]');
	var monsterCardsContainer = $('#monsters-cards');
	monsterCardsContainer.html('');
	for (var i = 0; i < monsters.length; i++) {
		var title = $(monsters[i]).val();
		var inSet = false; //there is not Set in old browsers - thats why such a poor code is used
		for (var j = 0; j < monsterList.length && !inSet; j++) {
			if (monsterList[j] == title) {
				inSet = true;
			}
		}
		if (!inSet) {
			monsterList.push(title);
		}
	}
	var LevelAddition = '_' + CurrentLevel;
	for (var i = 0; i < monsterList.length; i++) {
		var monster = monsterList[i];
		if (monster == '') continue;
		var monsterCard = $('<img>');
		var ImageCardPath = ImagePathRoot + monsterLine.CardsPath(EXPANSION_PATHS[monsterLine.AllData[OneMonsterValue].expansion]);
		monsterCard.attr('src', ImageCardPath + urlize(monster) + LevelAddition + '.png');
		monsterCardsContainer.append(monsterCard);
		if (MONSTERS[monster].hasBack) {
			var monsterCardBack = $('<img>');
			monsterCardBack.attr('src', ImageCardPath + urlize(monster) + '_back' + LevelAddition + '.png');
			monsterCardsContainer.append(monsterCardBack);
		}
	}
	addConditions(getConditions($('#monsters')), monsterCardsContainer);
}
