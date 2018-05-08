
function constructMonstersAndLieutenantsTabFromConfig() {
	removeMonsterRows();
	if (config.monsters != undefined) {
		for (var i = 0; i < config.monsters.length; i++) {
			var monster = config.monsters[i];
			if (monster.title != '') {
				var monsterLine = addMonsterLine();
				var width = monster.vertical ? MONSTERS[monster.title].width : MONSTERS[monster.title].height;
				var height = monster.vertical ? MONSTERS[monster.title].height : MONSTERS[monster.title].width;

				var monsterSelectUnit = monsterLine.find('[onclick="updateMonster(this, \'' + monster.title + '\');"]');
				var correctMonsterSelectUnit;

				if (monster.master && $(monsterSelectUnit[0]).html().indexOf('master') > -1 || !monster.master && !($(monsterSelectUnit[0]).html().indexOf('master') > -1)) {
					correctMonsterSelectUnit = monsterSelectUnit[0];
				} else {
					correctMonsterSelectUnit = monsterSelectUnit[1];
				}
				updateMonster(correctMonsterSelectUnit, monster.title);

				var xValue = width.toString() + monster.x.toString();
				updateCoordinate(monsterLine.find('.select-x [onclick="updateCoordinate(this, \'' + xValue + '\');"]'), xValue);
				var yValue = height.toString() + monster.y.toString();
				updateCoordinate(monsterLine.find('.select-y [onclick="updateCoordinate(this, \'' + yValue + '\');"]'), yValue);
				monsterLine.find('input[name="monster-hp"]').val(monster.hp);
				updateConditionsInSettings(monster.conditions, monsterLine);
			}
		}
	}
	if (config.lieutenants != undefined) {
		for (var i = 0 ; i < config.lieutenants.length; i++) {
			var container = addLieutenantLine();
			var lieutenant = config.lieutenants[i];
			updateLieutenant(container.find('.select-lieutenant li')[0], lieutenant.title, lieutenant.hasBack);
			container.find('[name="lieutenant-x"]').val(lieutenant.x);
			container.find('.x-title').html(getAlphabetChar(lieutenant.x - 1) + ' ');
			container.find('[name="lieutenant-y"]').val(lieutenant.y);
			container.find('.y-title').html(lieutenant.y.toString() + ' ');
			container.find('[name="lieutenant-hp"]').val(lieutenant.hp);
			var direction = lieutenant.vertical == undefined || !lieutenant.vertical ? 'horizontal' : 'vertical';
			container.find('.direction-title').html(direction + ' ');
			container.find('[name="lieutenant-direction"]').val(direction);
			for (var j = 0; lieutenant.skills != undefined && j < lieutenant.skills.length; j++) {
				container.find('[name="' + lieutenant.skills[j] + '"]').prop('checked', true);
			}
			updateConditionsInSettings(lieutenant.conditions, container);
			for (var k = 0; lieutenant.relics != undefined && k < lieutenant.relics.length; k++) {
				var relicContainer = addRelic(container.find('[onclick="addRelic(this);"]'));
				updateOverlordRelic(relicContainer.find('li')[0], lieutenant.relics[k]);
			}
//			adjustAlliesSkillsImages(container.children()[0]);
		}
	}
}

function addMonsterLine() {
	var monsterLine = $('<div>').attr('id','monster' + monsterNumber.toString());
	monsterNumber += 1;
	addUnitLine(monsterLine, 'monster');
	monsterLine.append($('<button type="button" class="btn btn-warning" aria-expanded="false" onclick="addCondition(this);">Add token</button>'));
	monsterLine.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove monster</button>'));
	monsterLine.append($('<input type="hidden" name="master" value=""/>'));
	monsterLine.append($('<input type="hidden" name="monster-y-size" value=""/>'));
	monsterLine.append($('<input type="hidden" name="monster-x-size" value=""/>'));

	monsterLine.find('.select-monster ul').append(createMonsterSelectContent());
	monsterLine.find('.select-x ul').append(createXSelectContent(false));
	monsterLine.find('.select-y ul').append(createYSelectContent(false));
	$('#monsters-container').append(monsterLine);
	return monsterLine;
}

function updateMonstersVisibility() {
	monsterTraits = {};
	selectedExpansions = {};
	var traitInputs = $('#monster-traits input');
	var expansionInputs = $('#expansions input');
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
	$('#monsters-container .select-monster li').css('display', 'none');
	for (var monsterTrait in monsterTraits) {
		for (var selectedExpansion in selectedExpansions) {
			if (monsterTraits[monsterTrait] == undefined || selectedExpansions[selectedExpansion] == undefined) continue;
			$('#monsters-container .' + monsterTrait + '.' + selectedExpansion).css('display', 'block');
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
	var actAddition = actOne ? '_act1' : '_act2';
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

function updateMonster(element, value) {
	updateOption(element, value, true);
	adjustMonsterList();
}

function createMonsterSelectContent() {
	var html = '';
	for (var i = 0; i < MONSTERS_LIST.length; i++) {
		var monsterClass = folderize(MONSTERS_LIST[i][4]);
		for (var j = 0; j < MONSTERS_LIST[i][5].length; j++) {
			monsterClass += ' ';
			monsterClass += urlize(MONSTERS_LIST[i][5][j]);
		}
		var monsterTitle = MONSTERS_LIST[i][0];
		var monsterVisible = (monsterTraits[MONSTERS[monsterTitle].traits[0]] != undefined || monsterTraits[MONSTERS[monsterTitle].traits[1]] != undefined) && selectedExpansions[MONSTERS[monsterTitle].expansion] != undefined;
		var option = $(addOption(monsterTitle + ' master', monsterClass, 'updateMonster(this, \'' + monsterTitle + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
		option = $(addOption(monsterTitle + ' minion', monsterClass, 'updateMonster(this, \'' + monsterTitle + '\');'));
		option.css('display', monsterVisible ? 'block' : 'none');
		html += option[0].outerHTML;
	}
	return html;
}

function removeMonsterRows() {
	$('#monsters-container .select-row').remove();
}

function addLieutenantLine() {
	var lieutenant = $('<div>');
	addUnitLine(lieutenant, 'Lieutenant');

	lieutenant.find('.select-lieutenant ul').append(createLieutenantsSelectContent());
	lieutenant.find('.select-x ul').addClass('showOneCell').append(createXSelectContent(true));
	lieutenant.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));
	lieutenant.find('.select-lieutenant').after(createInputSelect('Select direction', 'direction-title', 'select-direction'));
	lieutenant.append($('<input type="hidden" name="lieutenant-direction" value=""/>'));
	lieutenant.find('.select-direction ul').append(createDirectionSelectContent());
	lieutenant.append($('<button type="button" class="btn btn-info" aria-expanded="false" onclick="addRelic(this);">Add relic</button>'));
	lieutenant.append($('<button type="button" class="btn btn-warning" aria-expanded="false" onclick="addCondition(this);">Add token</button>'));
	lieutenant.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeRow(this);">Remove row</button>'));
	lieutenant.append($('<br/>'));
	lieutenant.append($('<img src="" style="display: none;">').addClass('lieutenant-image'));
	lieutenant.append($('<img src="" style="display: none;">').addClass('lieutenant-image-back'));
	$('#lieutenants-container').append(lieutenant);
	return lieutenant;
}

function createLieutenantsSelectContent() {
	var html = addOption('Clear', '', 'clearLieutenant(this);');
	for (var i = 0; i < LIEUTENANTS_LIST.length; i++) {
		var lieutenantTitle = LIEUTENANTS_LIST[i][0];
		html += addOption(lieutenantTitle + ' ', '', 'updateLieutenant(this, \'' + lieutenantTitle + '\', ' + LIEUTENANTS_LIST[i][1].toString() + ')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < LIEUTENANTS_LIST.length; i++) {
		if (LIEUTENANTS_LIST[i][0].indexOf('act') != -1 || LIEUTENANTS_LIST[i][0].indexOf('Act') != -1) {
			continue;
		}
		var lieutenantTitle = 'Agent ' + LIEUTENANTS_LIST[i][0];
		html += addOption(lieutenantTitle + ' ', '', 'updateLieutenant(this, \'' + lieutenantTitle + '\', ' + LIEUTENANTS_LIST[i][1].toString() + ')');
	}
	return html;
}

function updateLieutenant(element, value, showBack) {
	var container = $(element).parents('.select-row');
	var isAgent = value.indexOf('Agent') >= 0;
	var realName = value.replace('Agent ', '');
	container.find('.lieutenant-title').html(value + ' ');
	container.find('input[name="lieutenant-title"]').attr('value',value);
	if (isAgent) {
		container.addClass('agent');
	} else {
		container.removeClass('agent');
	}
	var actAcronym = '_act';
	var cardFolder = isAgent ? 'plot_cards/agents' : 'lieutenant_cards';
	container.find('img.lieutenant-image').attr('src', 'images/' + cardFolder + '/' + urlize(realName) + actAcronym + (actOne ? '1' : '2') + '.png').css('display','inline-block');
	if (showBack) {
		container.find('img.lieutenant-image-back').attr('src', 'images/' + cardFolder + '/' + urlize(realName) + actAcronym + (actOne ? '1' : '2') + '_back' + '.png').css('display','inline-block');
	} else {
		container.find('img.lieutenant-image-back').css('display','none');
	}
	container.find('[lieutenant="' + value + '"] input[type="checkbox"]').parent().parent().css('display', 'block');
}

function clearLieutenant(element) {
	var container = $(element).parents('.select-row');
	container.find('.lieutenant-title').html('Select Lieutenant ');
	container.find('input[name="lieutenant-title"]').attr('value','');
	container.find('img.lieutenant-image').css('display','none');
	container.find('img.lieutenant-image-back').css('display','none');
}

function addRelic(button) {
	var relicNumber = overlordRelicNumber += 1;
	var relic = $(createInputSelect('Select relic', 'relic-title', 'select-relic'));
	relic.attr('id', 'relic-select-' + relicNumber.toString());
	relic.find('ul').append(createOverlordRelicsSelectContent());
	var buttonObject = $(button);
	buttonObject.before(relic);
	buttonObject.before('<input type="hidden" name="relic-title" id="relic' + relicNumber.toString() + '" value=""/>');
	return relic;
}

function updateOverlordRelic(element, value) {
	var container = $(element).parents('.select-row');
	var relicContainer = $(element).parents('.select-relic');
	var relicNumber = relicContainer.attr('id').replace('relic-select-', '');
	relicContainer.find('.relic-title').html(value + ' ');
	$('#relic' + relicNumber.toString()).val(value);
	var relicImage = $('#relic-image-' + relicNumber.toString());
	if (relicImage.length == 0) {
		relicImage = $('<img>').addClass('relic-image').attr('id', 'relic-image-' + relicNumber.toString());
		container.append(relicImage);
	}
	relicImage.attr('src', 'images/items_cards/relic/overlord/' + urlize(value) + '.png');
}

function removeOverlordRelic(element) {
	var relicContainer = $(element).parents('.select-relic');
	var relicNumber = relicContainer.attr('id').replace('relic-select-', '');
	$('#relic' + relicNumber.toString()).remove();
	$('#relic-image-' + relicNumber.toString()).remove();
	relicContainer.remove();
}

function createOverlordRelicsSelectContent() {
	var html = addOption('Remove relic', '', 'removeOverlordRelic(this);');
	for (var i = 0; i < OVERLORD_RELICS_LIST.length; i++) {
		html += addOption(OVERLORD_RELICS_LIST[i] + ' ', '', 'updateOverlordRelic(this, \'' + OVERLORD_RELICS_LIST[i] + '\')');
	}
	return html;
}

function getLieutenants() {
	var result = [];
	var lieutenants = $('#lieutenants-container .select-row');
	for (var i = 0; i < lieutenants.length; i++) {
		var container = $(lieutenants[i]);
		var lieutenant = {};
		lieutenant.title = container.find('[name="lieutenant-title"]').val();
		lieutenant.x = container.find('[name="lieutenant-x"]').val();
		lieutenant.y = container.find('[name="lieutenant-y"]').val();
		lieutenant.hp = container.find('[name="lieutenant-hp"]').val();
		lieutenant.conditions = getConditions(container);
		lieutenant.hasBack = container.find('img.lieutenant-image-back').css('display') != 'none';
		lieutenant.vertical = container.find('[name="lieutenant-direction"]').val() == 'vertical';
		lieutenant.relics = [];
		var relics = container.find('[name="relic-title"]');
		for (var j = 0; j < relics.length; j++) {
			lieutenant.relics.push($(relics[j]).val());
		}
		lieutenant.skills = [];
		var skillCheckboxes = container.find('input[type="checkbox"]');
		for (var k = 0; k < skillCheckboxes.length; k++) {
			var skillCheckbox = $(skillCheckboxes[k]);
			if (skillCheckbox.prop('checked')) {
				lieutenant.skills.push(skillCheckbox.attr('name'));
			}
		}
		result.push(lieutenant);
	}
	return result;
}

function clearLieutenants() {
	$('#lieutenants-container .select-row').remove();
}

function updateAct(actOne) {
	var isActOne = actOne == undefined || actOne;
	$(isActOne ? '#actOne' : '#actTwo').prop('checked', true);
	adjustAct();
}

function adjustAct() {
	actOne = $('[name="act"]:checked').val() == 'one';
	adjustMonsterList();
}

function updateTraitsAndExpansionsFromConfig() {
	updateTraitsFromConfig();
	updateExpansionsFromConfig();
}

function createMonsterTraitsBlock() {
	var html = $('#monster-traits');
	for (var i = 0; i < MONSTER_TRAITS.length; i++) {
		var monsterTrait = MONSTER_TRAITS[i];
		var traitObject = $('<div>').addClass('checkbox');
		traitObject.append($('<img src="images/monster_traits/' + urlize(monsterTrait) + '.png"/>'));
		var traitInput = $('<input type="checkbox" name="' + urlize(monsterTrait) + '" onClick="updateMonstersVisibility();" />');
		traitInput.prop('checked', true);
		traitObject.append($('<label></label>').append(traitInput));
		html.append(traitObject);
	}
	return html;
}

function updateTraitsFromConfig() {
	if (config.monsterTraits != undefined) {
		monsterTraits = config.monsterTraits;
		updateTraits();
	}
}

function updateTraits() {
	$('#monster-traits input').prop('checked',false);
	for (var monsterTrait in monsterTraits) {
		if (monsterTraits[monsterTrait] == undefined) continue;
		$('[name="' + urlize(monsterTrait) + '"]').prop('checked',true);
	}
}

function createExpansionsBlock() {
	var html = $('#expansions');
	for (var expansionGroup in EXPANSION_GROUPS) {
		if (EXPANSION_GROUPS[expansionGroup] == undefined) continue;
		var GroupHTML = $('<div>').addClass('expansions-group');
		GroupHTML.append("<b>"+expansionGroup+"</b>");
		var expansionList = EXPANSION_GROUPS[expansionGroup];

		for (var i = 0; i < expansionList.length; i++) {
			var expansion = expansionList[i];
			var expansionObject = $('<div>').addClass('checkbox');
			var expansionInput = $('<input type="checkbox" name="' + folderize(expansion) + '" onClick="updateMonstersVisibility();" />');
			expansionInput.prop('checked', true);
			expansionObject.append($('<label> ' + expansion + '</label>').prepend(expansionInput));
			GroupHTML.append(expansionObject);
		}
		html.append(GroupHTML);
	}

	return html;
}

function updateExpansionsFromConfig() {
	if (config.expansions != undefined) {
		selectedExpansions = config.expansions;
		updateExpansions();
	}
}

function updateExpansions() {
	$('#expansions input').prop('checked',false);
	for (var selectedExpansion in selectedExpansions) {
		if (selectedExpansions[selectedExpansion] == undefined) continue;
		$('[name="' + urlize(selectedExpansion) + '"]').prop('checked',true);
	}
}
