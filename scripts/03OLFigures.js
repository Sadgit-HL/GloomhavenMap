function InitializeWindowFor_OLFigures() {
	var html = $('#monsters');

	html.append(Create_ActButton());

	//tiles zone
	html.append(CreateZone_Monsters());
	//doors zone
	html.append(CreateZone_Lieutenants());
	//xMarks zone
	html.append(CreateZone_Agents());
	//monsters traits
	html.append(Create_MonsterTraitsList());
	//expansions
	html.append(Create_ExpansionList());
}

function UpdateWindow_OLFigures() {
	//after Act Set
	//Update_MonsterImages(RowElement);
	Update_MonsterImages();

	var LieutenantsList = $('.lieutenant-container .select-row');
	for (var i = 0; i < LieutenantsList.length; i++) {
		var container = $(LieutenantsList[i]);
		Update_LieutenantImages(container);
	}

	var AgentsList = $('.agent-container .select-row');
	for (var i = 0; i < AgentsList.length; i++) {
		var container = $(AgentsList[i]);
		Update_AgentImages(container);
	}

}

function GetWindow_OLFigures(DataToUpdate) {
	DataToUpdate = GetZone_Monsters(DataToUpdate);
	DataToUpdate = GetZone_Lieutenants(DataToUpdate);
	DataToUpdate = GetZone_Agents(DataToUpdate);
	DataToUpdate = GetZone_MonsterTraits(DataToUpdate);
	DataToUpdate = GetZone_Expansions(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_OLFigures(NewData, FromPreFilledMaps) {
	//Fill_ActButton(); -> Common not Filled Here
	FillZone_Monsters(NewData, FromPreFilledMaps);
	FillZone_Lieutenants(NewData, FromPreFilledMaps);
	FillZone_Agents(NewData, FromPreFilledMaps);
	FillZone_MonsterTraits(NewData, FromPreFilledMaps);
	FillZone_Expansions(NewData, FromPreFilledMaps);
}

function ResetWindow_OLFigures(FromPreFilledMaps) {
	ResetZone_Monsters(FromPreFilledMaps);
	ResetZone_Lieutenants(FromPreFilledMaps);
	ResetZone_Agents(FromPreFilledMaps);
	ResetZone_MonsterTraits(FromPreFilledMaps);
	ResetZone_Expansions(FromPreFilledMaps);
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
			monsterLine.XYBase = MONSTERS[NewData.monsters[i].title.replace(' master','').replace(' minion','')].width + 'x' + MONSTERS[NewData.monsters[i].title.replace(' master','').replace(' minion','')].height;
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
	for (var i = 0; i < MONSTERS_LIST.length; i++) {
		var monsterClass = folderize(MONSTERS_LIST[i][4]);
		for (var j = 0; j < MONSTERS_LIST[i][5].length; j++) {
			monsterClass += ' ';
			monsterClass += urlize(MONSTERS_LIST[i][5][j]);
		}
		var monsterTitle = MONSTERS_LIST[i][0];
		var monsterVisible = (monsterTraits[MONSTERS[monsterTitle].traits[0]] != undefined || monsterTraits[MONSTERS[monsterTitle].traits[1]] != undefined) && selectedExpansions[MONSTERS[monsterTitle].expansion] != undefined;
		var option = $(addOption(monsterTitle + ' master', monsterClass, 'Set_Monster(this, \'' + monsterTitle + ' master' + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
		option = $(addOption(monsterTitle + ' minion', monsterClass, 'Set_Monster(this, \'' + monsterTitle + ' minion' + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
	}
	return html;
}

function Set_Monster(element, value) {
	var container = $(element).parents('.select-row');
	//for copatibility
	if (value.indexOf(" minion") < 0 && value.indexOf(" master") < 0)
	{
		//by default minion
		value = value + ' minion';
	}
	var OneMonsterValue = value.replace(' master','').replace(' minion','');
	monsterLine.XYBase = MONSTERS[OneMonsterValue].width + 'x' + MONSTERS[OneMonsterValue].height;
	monsterLine.Set_MainElement(container, value);

	var monsterHp;
	if (value.indexOf(" master") > -1) {
		if (CurrentAct == "I") {
			monsterHp = MONSTERS[OneMonsterValue].masterHpActI;
		} else {
			monsterHp = MONSTERS[OneMonsterValue].masterHpActII;
		}
	} else {
		if (CurrentAct == "I") {
			monsterHp = MONSTERS[OneMonsterValue].minionHpActI;
		} else {
			monsterHp = MONSTERS[OneMonsterValue].minionHpActII;
		}
	}

	Set_HP(container, monsterHp)
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
	var actAddition = (CurrentAct == "I") ? '_act1' : '_act2';
	for (var i = 0; i < MonsterList.length; i++) {
		var OneMonsterValue = $(MonsterList[i]).attr('value').replace(' master','').replace(' minion','');
		if (OneMonsterValue == undefined || OneMonsterValue == '') continue;
		if (MonsterImageContainer.find('.' + urlize(OneMonsterValue)).length == 0)
		{
			var MonsterImage = $('<img>');
			MonsterImage.attr('src', 'images/monster_cards/' + urlize(OneMonsterValue) + actAddition + '.png').addClass('monster').addClass(urlize(OneMonsterValue));
			MonsterImageContainer.append(MonsterImage);
			if (MONSTERS[OneMonsterValue].hasBack) {
				var monsterCardBack = $('<img>');
				monsterCardBack.attr('src', 'images/monster_cards/' + urlize(OneMonsterValue) + '_back' + actAddition + '.png');
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
	container.append('<h1>Lieutenants</h1>');
	// non global -> line by line
	//container.append('<div class="lieutenants-cards"></div>');
	//container.append('<div class="lieutenants-relicscards"></div>');
	//container.append('<div class="lieutenants-tokenscards"></div>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Lieutenant();">Add lieutenant</button>');
	//initialize LineClass
	lieutenantLine.NameListValues = Create_LieutenantListValues();
	//lieutenantLine.RelicCommonImageContainer = "lieutenants-relicscards";
	//lieutenantLine.TokenCommonImageContainer = "lieutenants-tokenscards";

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
	for (var i = 0; i < LIEUTENANTS_LIST.length; i++) {
		var lieutenantTitle = LIEUTENANTS_LIST[i][0];
		html += addOption(lieutenantTitle + ' ', '', 'Set_Lieutenant(this, \'' + lieutenantTitle + '\')');
	}
	return html;
}

function Set_Lieutenant(element, value) {
	var container = $(element).parents('.select-row');
	lieutenantLine.XYBase = LIEUTENANTS[value].width + 'x' + LIEUTENANTS[value].height;
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
	var actAddition = (CurrentAct == "I") ? '_act1' : '_act2';

	var OneLieutenantValue = RowElement.find('.MainElement-Value').val();
	if (OneLieutenantValue == undefined || OneLieutenantValue == '') return;

	if (LieutenantImageContainer.find('.' + urlize(OneLieutenantValue)).length == 0)
	{
		var LieutenantImage = $('<img>');
		LieutenantImage.attr('src', 'images/lieutenant_cards/' + urlize(OneLieutenantValue) + actAddition + '.png').addClass('lieutenant').addClass(urlize(OneLieutenantValue));
		LieutenantImageContainer.append(LieutenantImage);
		if (LIEUTENANTS[OneLieutenantValue].hasBack) {
			var LieutenantCardBack = $('<img>');
			LieutenantCardBack.attr('src', 'images/lieutenant_cards/' + urlize(OneLieutenantValue) + actAddition + '_back' + '.png');
			LieutenantImageContainer.append(LieutenantCardBack);
		}
	}
}

function Reset_LieutenantImages(RowElement) {
	var LieutenantImageContainer = RowElement.find('.Row-cards');
	LieutenantImageContainer.find('img').remove();
}


//agents zone
function CreateZone_Agents() {
	var html = $('<div>');
	var container = $('<div>').addClass('agent-container');
	container.append('<h1>Agents</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Agent();">Add agent</button>');
	//initialize LineClass
	agentLine.NameListValues = Create_AgentListValues();

	return html;
}

function GetZone_Agents(DataToUpdate) {
	var result = [];
	var agents = $('.agent-container .select-row');
	for (var i = 0; i < agents.length; i++) {
		var container = $(agents[i]);
		var agent = {};
		agent = agentLine.GetOneLineData(container);
		result.push(agent);
	}
	DataToUpdate.agents = result;
	return DataToUpdate;
}

function FillZone_Agents(NewData, FromPreFilledMaps) {
	ResetZone_Agents(FromPreFilledMaps);
	if (NewData.agents != undefined) {
		for (var i = 0 ; i < NewData.agents.length; i++) {
			agentLine.XYBase = "1x1";
			var html = agentLine.AddOneLineWithData(NewData.agents[i]);
			$('.agent-container').append(html);
		}
	}
}

function ResetZone_Agents(FromPreFilledMaps) {
	$('.agent-container .select-row').remove();
}

function AddLine_Agent() {
	agentLine.XYBase = "1x1";
	var html = agentLine.AddOneEmptyLine();
	$('.agent-container').append(html);
	return html;
}

function RemoveLine_Agent(Button) {
}

function Create_AgentListValues() {
	var html = addOption('Clear', '', 'UnSet_Agent(this);');
	for (var i = 0; i < LIEUTENANTS_LIST.length; i++) {
		var agentTitle = LIEUTENANTS_LIST[i][0];
		html += addOption('Agent ' + agentTitle + ' ', '', 'Set_Agent(this, \'' + agentTitle + '\')');
	}
	return html;
}

function Set_Agent(element, value) {
	var container = $(element).parents('.select-row');
	agentLine.XYBase = LIEUTENANTS[value].width + 'x' + LIEUTENANTS[value].height;
	agentLine.Set_MainElement(container, value);
	Update_AgentImages(container);
}

function UnSet_Agent(element) {
	var container = $(element).parents('.select-row');
	agentLine.UnSet_MainElement(container);
	Update_AgentImages(container);
}

function Update_AgentImages(RowElement) {
	var AgentImageContainer = RowElement.find('.Row-cards');
	Reset_AgentImages(RowElement);
	var actAddition = (CurrentAct == "I") ? '_act1' : '_act2';

	var OneAgentValue = RowElement.find('.MainElement-Value').val();
	if (OneAgentValue == undefined || OneAgentValue == '') return;

	if (AgentImageContainer.find('.' + urlize(OneAgentValue)).length == 0)
	{
		var AgentImage = $('<img>');
		AgentImage.attr('src', 'images/plot_cards/agents/' + urlize(OneAgentValue) + actAddition + '.png').addClass('agent').addClass(urlize(OneAgentValue));
		AgentImageContainer.append(AgentImage);
		if (LIEUTENANTS[OneAgentValue].hasBack) {
			var AgentCardBack = $('<img>');
			AgentCardBack.attr('src', 'images/plot_cards/agents/' + urlize(OneAgentValue) + actAddition + '_back' + '.png');
			AgentImageContainer.append(AgentCardBack);
		}
	}

}

function Reset_AgentImages(RowElement) {
	var AgentImageContainer = RowElement.find('.Row-cards');
	AgentImageContainer.find('img').remove();
}


//monsters traits
function Create_MonsterTraitsList()
{
	var html;
	html = $('<div>').addClass('monster-traits');
	for (var i = 0; i < MONSTER_TRAITS.length; i++) {
		var monsterTrait = MONSTER_TRAITS[i];
		var traitObject = $('<div>').addClass('checkbox');
		traitObject.append($('<img src="images/monster_traits/' + urlize(monsterTrait) + '.png"/>'));
		var traitInput = $('<input type="checkbox" class="MonstrerTraits-Value" name="' + urlize(monsterTrait) + '" onClick="Set_MonsterTrait(this, \'' + folderize(monsterTrait) + '\');" />');
		traitInput.prop('checked', true);
		traitObject.append($('<label></label>').append(traitInput));
		html.append(traitObject);
	}
	return html;
}

function GetZone_MonsterTraits(DataToUpdate) {
	var result = {};
	var SelectedMonsterTraits = $('.MonstrerTraits-Value:checkbox:checked')
	for (var i = 0; i < SelectedMonsterTraits.length; i++) {
		var checkedTrait = $(SelectedMonsterTraits[i]).attr('name');
		result[checkedTrait] = checkedTrait;
	}
	DataToUpdate.monsterTraits = result;
	return DataToUpdate;
}

function FillZone_MonsterTraits(NewData, FromPreFilledMaps) {
	ResetZone_MonsterTraits(FromPreFilledMaps);
	if (NewData.monsterTraits != undefined) {
		for (var oneMonsterTrait in NewData.monsterTraits) {
			Set_MonsterTrait($('.monster-traits'), oneMonsterTrait);
		}
	}
}

function ResetZone_MonsterTraits(FromPreFilledMaps) {
	$('.MonstrerTraits-Value').prop('checked',false);
}

function Set_MonsterTrait(element, value) {
	if ($(element).hasClass('monster-traits')) {
		$('[name="' + urlize(value) + '"]').prop('checked',true);
	}
	//Data Linked
	updateMonstersVisibility();
}

function updateTraitsFromConfig() {
	if (config.monsterTraits != undefined) {
		monsterTraits = config.monsterTraits;
		updateTraits();
	}
}

function updateTraits() {
	$('.monster-traits input').prop('checked',false);
	for (var monsterTrait in monsterTraits) {
		if (monsterTraits[monsterTrait] == undefined) continue;
		$('[name="' + urlize(monsterTrait) + '"]').prop('checked',true);
	}
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
	var actAddition = (CurrentAct == "I") ? '_act1' : '_act2';
	for (var i = 0; i < monsterList.length; i++) {
		var monster = monsterList[i];
		if (monster == '') continue;
		var monsterCard = $('<img>');
		monsterCard.attr('src', 'images/monster_cards/' + urlize(monster) + actAddition + '.png');
		monsterCardsContainer.append(monsterCard);
		if (MONSTERS[monster].hasBack) {
			var monsterCardBack = $('<img>');
			monsterCardBack.attr('src', 'images/monster_cards/' + urlize(monster) + '_back' + actAddition + '.png');
			monsterCardsContainer.append(monsterCardBack);
		}
	}
	addConditions(getConditions($('#monsters')), monsterCardsContainer);
}
