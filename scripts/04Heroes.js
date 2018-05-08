
function addHeroLine(number) {
	var heroLine = $('<div>').attr('id','hero' + number.toString() + 'wrapper');
	addUnitLine(heroLine, 'hero');
	heroLine.append($('<input type="text" name="hero-stamina" class="form-control" placeholder="Set stamina" value=""/>'));

	heroLine.find('.select-hero ul').append(createHeroSelectContent());
	heroLine.find('.select-x ul').append(createXSelectContent(true));
	heroLine.find('.select-x ul').addClass('showOneCell');
	heroLine.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));
	heroLine.append(createInputSelect('Select Archetype ', 'archetype-title', 'select-archetype'));
	heroLine.find('.select-archetype ul').addClass(ARCHETYPE_CLASSES + ' showarch').append(createArchetypeSelectContent());
	heroLine.append($('<input type="hidden" name="archetype-title" value=""/>'));
	heroLine.append(createInputSelect('Select Class ', 'class-title', 'select-class'));
	heroLine.find('.select-class ul').addClass(ARCHETYPE_CLASSES + ' showarch').append(createClassSelectContent(false));
	heroLine.append($('<input type="hidden" name="class-title" value=""/>'));
	heroLine.append($('<button type="button" class="btn btn-warning" aria-expanded="false" onclick="addCondition(this);">Add token</button>'));
	heroLine.append($('<button type="button" class="btn btn-default" aria-expanded="false" onclick="addAura(this);">Add aura</button>'));
	heroLine.append(createConditionsBlock());
	heroLine.append(createSkillsBlock(number));
	heroLine.append(createItemsBlock());
	heroLine.append(createSackAndSearchBlock());
	heroLine.append(getHeroImage());
	heroLine.append(buildTaintedBlock());
	$('#hero' + number.toString()).append(heroLine);
}

function createHeroSelectContent() {
	var html = addOption('Clear', '', 'clearHero(this);');
	for (var i = 0; i < HEROES_LIST.length; i++) {
		html += addOption(HEROES_LIST[i][0] + ' ', '', 'updateHero(this, \'' + HEROES_LIST[i][0] + '\');');
	}
	return html;
}

function updateHero(element, value) {
	var container = $(element).parents('.select-row');

	container.find('.hero-title').html(value + ' ');
	container.find('input[name="hero-title"]').attr('value',value);
	container.find('input[name="hero-x"]').attr('value','');
	container.find('input[name="hero-y"]').attr('value','');
	container.find('input[name="hero-hp"]').val(HEROES[value].hp);
	container.find('input[name="hero-stamina"]').val(HEROES[value].stamina);
	container.find('.hero-image-container').children('img').attr('src', 'images/heroes_cards/' + urlize(value) + '.png');
	var heroId = container.parent().attr('id');
	var heroImage = $('<img>');
	heroImage.attr('src', 'images/heroes_tokens/' + urlize(value) + '.png');
	var heroMenuIcon = $('[href="#' + heroId + '"]');
	heroMenuIcon.html('');
	heroMenuIcon.append(heroImage);
	updateArchetype(element, HEROES[value].archetype.title);
}

function adjustHero(element, archetype) {
	var container = $(element).parents('.select-row');
	var heroTitle = container.find('input[name="hero-title"]').val();
	if (heroTitle != '' && HEROES[heroTitle].archetype.title != archetype) {
		clearHero(element);
	}
}

function clearHero(element) {
	var container = $(element).parents('.select-row');
	container.find('.hero-title').html('Select hero ');
	container.find('input[name="hero-title"]').attr('value','');
	container.children('img').attr('src', 'images/heroes_cards/default.png');
	var heroId = container.parent().attr('id');
	heroId = heroId.substring(0, 5);
	var heroMenuIcon = $('[href="#' + heroId + '"]');
	heroMenuIcon.html('');
	heroMenuIcon.append($('<img src="images/heroes_tokens/unknown.png"/>'));
}

function createArchetypeSelectContent() {
	var html = addOption('Clear', '', 'clearArchetype(this);');
	for (var i = 0; i < ARCHETYPES_LIST.length; i++) {
		var title = ARCHETYPES_LIST[i].title;
		html += addOption(title + ' ', title, 'updateArchetype(this, \'' + title + '\');');
	}
	return html;
}

function updateArchetype(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.archetype-title').html(value + ' ');
	container.find('input[name="archetype-title"]').attr('value',value);
	adjustClass(element, value);
	adjustHero(element, value);
}

function adjustArchetype(element, archetype) {
	var container = $(element).parents('.select-row');
	container.find('.select-archetype ul').removeClass(ARCHETYPE_CLASSES).addClass(archetype.toLowerCase());
}

function clearArchetype(element) {
	var container = $(element).parents('.select-row');
	container.find('.select-archetype ul').addClass(ARCHETYPE_CLASSES.toLowerCase());
	container.find('.archetype-title').html('Select archetype ');
	container.find('input[name="archetype-title"]').attr('value','');
	adjustClass(element, ARCHETYPE_CLASSES);
}

function createClassSelectContent(hybrid) {
	var html = addOption('Clear', '', 'clearClass(this, ' + hybrid.toString() + ');');
	for (var i = 0; i < ARCHETYPES_LIST.length; i++) {
		for (var j = 0; j < ARCHETYPES_LIST[i].classes.length; j++) {
			var title = ARCHETYPES_LIST[i].classes[j].title;
			if (hybrid == false || CLASSES[title].allowHybrid != true)
			{
				html += addOption(title + ' ', ARCHETYPES_LIST[i].title, 'updateClass(this, \'' + title + '\', false, ' + hybrid.toString() + ');');
			}
		}
	}
	return html;
}

function updateClass(element, value, skipItems, hybrid) {
	if (hybrid == undefined) hybrid = false;
	var container = $(element).parents('.select-row');
	container.find(hybrid ? '.hybrid-class-title' : '.class-title').html(value + ' ');
	container.find(hybrid ? 'input[name="hybrid-class-title"]' : 'input[name="class-title"]').attr('value',value);
	var currentClass = CLASSES[value];
	if (hybrid == undefined || !hybrid) {
		adjustArchetype(element, currentClass.archetype.title);
	}
	adjustSkills(element, value, hybrid);
	adjustSkillsImages(element, hybrid);
	adjustItems(element, value, hybrid);
	if (skipItems == undefined || !skipItems) {
		var handUsed = false;
		var itemUsed = false;
		clearBothHands(element);
		clearArmor(element);
		clearItem(element);
		for (var i = 0; i < currentClass.skills.length; i++) {
			var skill = currentClass.skills[i];
			var itemType = skill[2];
			if (itemType != undefined) {
				switch (itemType) {
				case hand:
					updateHand(container.find('.select-weapon' + (handUsed ? '.second-select' : ':not(.second-select)') + ' li:not(.twohand).' + folderize(value) + ' a')[0], skill[0]);
					handUsed = true;
					break;
				case twohand:
					updateHand(container.find('.select-weapon' + (handUsed ? '.second-select' : ':not(.second-select)') + ' li.twohand.' + folderize(value) + ' a')[0], skill[0]);
					handUsed = true;
					break;
				case armor:
					updateArmor(container.find('.select-armor li.' + folderize(value) + ' a')[0], skill[0]);
					break;
				case item:
					updateItem(container.find('.select-item' + (itemUsed ? '.second-select' : ':not(.second-select)') + ' li.' + folderize(value) + ' a')[0], skill[0]);
					itemUsed = true;
				}
			}
		}
	}
}

function adjustClass(element, archetype) {
	var container = $(element).parents('.select-row');
	container.find('.select-class ul').removeClass(ARCHETYPE_CLASSES).addClass(archetype.toLowerCase());
	var currentClass = container.find('input[name="class-title"]').val();
	if (currentClass != '' && CLASSES[currentClass].archetype.title != archetype) {
		clearClass(element);
	}
}

function clearClass(element, hyrbid) {
	var container = $(element).parents('.select-row');
	container.find(hyrbid ? '.hybrid-class-title' : '.class-title').html('Select class ');
	container.find('input[name="hybrid-class-title"]').attr('value','');

	clearSkills(element);
}

function addAura(button) {
	var aura = $('<div>').addClass('aura');
	aura.append($('<input type="text" name="aura-radius" class="form-control" placeholder="Aura radius" value="">'));
	aura.append($('<input type="text" name="aura-color" class="form-control" placeholder="Aura color" value="">'));
	aura.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="removeAura(this);">Remove aura</button>'));
	$(button).after(aura);
	$(button).remove();
	return aura;
}

function removeAura(button) {
	var container = $(button).parents('.aura');
	container.after($('<button type="button" class="btn btn-default" aria-expanded="false" onclick="addAura(this);">Add aura</button>'));
	container.remove();
}

function getAura(container) {
	var aura = {};
	var auraContainer = $(container).find('.aura');
	if (auraContainer.length == 0) return undefined;
	aura.radius = auraContainer.find('[name="aura-radius"]').val();
	aura.color = auraContainer.find('[name="aura-color"]').val();
	return aura;
}

function createSkillsBlock(heroNumber) {
	var html = $('<div>').addClass('showClass').addClass('skills-container');
	html.append($('<h1>Skills</h1>'));

	for (var i = 0; i < HYBRID_CLASSES.length; i++) {
		var hc = HYBRID_CLASSES[i];
		var hybridInput = createInputSelect('Select Class ', 'hybrid-class-title', 'select-hybrid-class ' + folderize(hc.title));
		html.append(hybridInput);
		hybridInput.find('ul').addClass(folderize(hc.newArchetype.title) + ' showarch').append(createClassSelectContent(true));
	}

	html.append($('<input type="hidden" name="hybrid-class-title" value=""/>'));
	var skillsImages = $('<div>').addClass('imagescontainer');
	for (var tempoClass in CLASSES) {
		if (CLASSES[tempoClass] == undefined) continue;
		var currentClass = CLASSES[tempoClass];
		for (var i = 0; i < currentClass.skills.length; i++) {
			var skill = currentClass.skills[i];
			if (skill[2] != undefined) continue;
			var classUpdatedTitle = folderize(currentClass.title);
			var skillObject = $('<div>').addClass('checkbox').addClass(classUpdatedTitle);
			skillObject.attr('xp-cost', skill[1]);
			skillObject.append($('<label><input type="checkbox" name="' + skill[0] + '" onClick="adjustSkillsImages(this);"/> ' + skill[0] + '</label>'));
			if (skill[1] == 0) {
				skillObject.addClass('disabled');
				skillObject.find('input').prop('checked', true);
				skillObject.find('input').attr('disabled', '');
			}
			html.append(skillObject);
			skillsImages.append($('<img>').attr('src', 'images/classes_cards/' + classUpdatedTitle + '/' + urlize(skill[0]) + '.png').attr('skill', skill[0]).attr('onclick',"exhaustSkill(this);").attr('ondragover',"allowDrop(event)").attr('ondrop',"drop(event)"));
		}
		if (currentClass.title == 'Bard') {
			skillsImages.append($('<div>').attr('class','fakeimg').attr('ondragover',"allowDrop(event)").attr('ondrop',"drop(event)"));
			skillsImages.append($('<img>').attr('src', 'images/skills_tokens/melody.png').attr('id', 'melody' + heroNumber.toString()).attr('draggable', 'true').attr('ondragstart',"drag(event)"));
			skillsImages.append($('<img>').attr('src', 'images/skills_tokens/harmony.png').attr('id', 'harmony' + heroNumber.toString()).attr('draggable', 'true').attr('ondragstart',"drag(event)"));
		}
	}
	html.append(skillsImages);
	return html;
}

function getSkillsItems(type) {
	var result = [];
	for (var i = 0; i < CLASSES_ITEMS.length; i++) {
		if (CLASSES_ITEMS[i][2] == type) result.push(CLASSES_ITEMS[i]);
	}
	return result;
}

function updateSkills(element, skillValues, heroNumber) {
	var container = $(element).parents('.select-row');
	for (var i = 0; i < skillValues.length; i++) {
		var skillTitle = skillValues[i][0];
		var skill = container.find('input[name="' + skillTitle + '"]');
		skill.prop('checked', skillValues[i][1]);
		if (skillValues[i][2] != undefined && skillValues[i][2]) {
			skill.addClass('card-exhausted');
		}
		if (skillValues[i][3] != undefined && skillValues[i][3]) {
			dropToken(container.find('img[skill="' + skillTitle + '"]'), 'melody' + heroNumber.toString());
		}
		if (skillValues[i][4] != undefined && skillValues[i][4]) {
			dropToken(container.find('img[skill="' + skillTitle + '"]'), 'harmony' + heroNumber.toString());
		}
	}
}

function adjustSkills(element, value, hybrid) {
	if (hybrid == undefined) hybrid = false;
	var container = $(element).parents('.select-row');
	if (!hybrid) {
		container.find('.skills-container').attr("class", "showclass skills-container " + folderize(value));
	} else {
		container.find('.skills-container').attr("class", "showclass skills-container " + folderize(container.find('input[name="class-title"]').val()));
		container.find('.skills-container').addClass(folderize(value));
	}
}

function clearSkills(element) {
	var container = $(element).parents('.select-row');
	container.find('.skills-container').attr("class", "showclass skills-container");
	container.find('.hybrid-class-title').html('Select class ');
	container.find('input[name="hybrid-class-title"]').attr('value','');

	clearSkillsImages(element);

	clearBothHands(element);
	clearArmor(element);
	clearItem(element);
}

function adjustSkillsImages(element, hybrid) {
	if (hybrid == undefined) hybrid = false;
	var container = $(element).parents('.select-row');
	var className = container.find('input[name="class-title"]').attr('value');
	if (className == '') return;
	clearSkillsImages(element);

	adjustSkillsImagesForOneClass(element, className);
	if (CLASSES[className].allowHybrid || hybrid) {
		var classNameHybrid = container.find('input[name="hybrid-class-title"]').attr('value');
		if (classNameHybrid == '') return;
		adjustSkillsImagesForOneClass(element, classNameHybrid);
	}
}

function clearSkillsImages(element) {
	var container = $(element).parents('.select-row');
	container.find('.imagescontainer img').removeClass('showimage');
}
function adjustSkillsImagesForOneClass(element, className) {
	var container = $(element).parents('.select-row');
	var skills = $(container).find('.checkbox.' + folderize(className) + ' input');
	for (var i = 0; i < skills.length; i++) {
		var currentSkill = $(skills[i]);
		if (currentSkill.prop('checked')) {
			var skill = container.find('[skill="' + currentSkill.attr('name') + '"]');
			skill.addClass('showimage');
			if (currentSkill.hasClass('card-exhausted')) {
				skill.addClass('exhausted');
			}
		}
	}
	if (className == 'Bard') {
		container.find('#harmony1,#melody1,#harmony2,#melody2,#harmony3,#melody3,#harmony4,#melody4').addClass('showimage');
	}
}

function exhaustSkill(image) {
	$(image).toggleClass('exhausted');
	var container = $(image).parents('.select-row');
	container.find('[name="' + $(image).attr('skill') + '"]').toggleClass('card-exhausted');
}

function getSkills(container, className, hybridClassName) {
	var result = [];
	var skills = $(container).find('.checkbox.' + folderize(className) + ' input');
	for (var i = 0; i < skills.length; i++) {
		var currentSkill = $(skills[i]);
		var image = container.find('img[skill="' + currentSkill.attr('name') + '"]');
		result.push([currentSkill.attr('name'), currentSkill.prop('checked'), currentSkill.hasClass('card-exhausted'), image.hasClass('hasmelody'), image.hasClass('hasharmony')]);
	}
	if (hybridClassName != undefined) {
		var hybridSkills = $(container).find('.checkbox.' + folderize(hybridClassName) + ' input');
		for (var i = 0; i < hybridSkills.length; i++) {
			var currentSkill = $(hybridSkills[i]);
			var image = container.find('img[skill="' + currentSkill.attr('name') + '"]');
			result.push([currentSkill.attr('name'), currentSkill.prop('checked'), currentSkill.hasClass('card-exhausted'), image.hasClass('hasmelody'), image.hasClass('hasharmony')]);
		}
	}
	return result;
}

function createItemsBlock() {
	var html = $('<div>').addClass('items-block');
	var itemsContainer = $('<div>').addClass('items-container');
	itemsContainer.append($('<h1>Items</h1>'));
	itemsContainer.append($('<img src="images/misc/hand.png">').addClass('hand').attr('onclick', "$(this).toggleClass('exhausted')"));
	itemsContainer.append($('<img src="images/misc/hand2.png">').addClass('hand2').attr('onclick', "$(this).toggleClass('exhausted')"));
	itemsContainer.append($('<img src="images/misc/armor.png">').addClass('armor').attr('onclick', "$(this).toggleClass('exhausted')"));
	itemsContainer.append($('<img src="images/misc/item.png">').addClass('item').attr('onclick', "$(this).toggleClass('exhausted')"));
	itemsContainer.append($('<img src="images/misc/item.png">').addClass('item2').attr('onclick', "$(this).toggleClass('exhausted')"));
	html.append(itemsContainer);

	var itemsSelects = $('<div>').addClass('items-selects showclass');
	var weaponSelect = $(createInputSelect('Select Weapon', 'weapon-title', 'select-weapon'));
	weaponSelect.find('ul').append(createHandSelectContent());
	itemsSelects.append(weaponSelect);

	var weaponSelectSecond = $(createInputSelect('Select Weapon', 'weapon-title', 'select-weapon')).addClass('second-select');
	weaponSelectSecond.find('ul').append(createHandSelectContent());
	itemsSelects.append(weaponSelectSecond);

	var armorSelect = $(createInputSelect('Select Armor', 'armor-title', 'select-armor'));
	armorSelect.find('ul').append(createArmorSelectContent());
	itemsSelects.append(armorSelect);

	var itemsSelect = $(createInputSelect('Select Item', 'item-title', 'select-item'));
	itemsSelect.find('ul').append(createItemSelectContent());
	itemsSelects.append(itemsSelect);

	var itemsSelectSecond = $(createInputSelect('Select Item', 'item-title', 'select-item')).addClass('second-select');
	itemsSelectSecond.find('ul').append(createItemSelectContent());
	itemsSelects.append(itemsSelectSecond);

	html.append(itemsSelects);
	html.append($('<input type="hidden" name="hand">'));
	html.append($('<input type="hidden" name="hand2">'));
	html.append($('<input type="hidden" name="armor">'));
	html.append($('<input type="hidden" name="item">'));
	html.append($('<input type="hidden" name="item2">'));
	return html;
}

function createHandSelectContent() {
	var html = addOption('Clear', '', 'clearHand(this);');
	for (var i = 0; i < ITEMS['hand'].length; i++) {
		var item = ITEMS['hand'][i];
		html += addOption(item[0] + ' ', 'hand tierone', 'updateHand(this, \'' + item[0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < ITEMS['hand2'].length; i++) {
		var item = ITEMS['hand2'][i];
		html += addOption(item[0] + ' ', 'hand twohand tierone', 'updateHand(this, \'' + item[0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < ITEMS2['hand'].length; i++) {
		var item = ITEMS2['hand'][i];
		html += addOption(item[0] + ' ', 'hand tiertwo', 'updateHand(this, \'' + item[0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < ITEMS2['hand2'].length; i++) {
		var item = ITEMS2['hand2'][i];
		html += addOption(item[0] + ' ', 'hand twohand tiertwo', 'updateHand(this, \'' + item[0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < ITEMSR['hand'].length; i++) {
		var item = ITEMSR['hand'][i];
		html += addOption(item[0] + ' ', 'hand relic', 'updateHand(this, \'' + item[0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < ITEMSR['hand2'].length; i++) {
		var item = ITEMSR['hand2'][i];
		html += addOption(item[0] + ' ', 'hand twohand relic', 'updateHand(this, \'' + item[0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	var classItems = getSkillsItems(hand);
	for (var i = 0; i < classItems.length; i++) {
		html += addOption(classItems[i][0] + ' ', 'hand classitem ' + classItems[i][1], 'updateHand(this, \'' + classItems[i][0] + '\')');
	}
	classItems = getSkillsItems(twohand);
	for (var i = 0; i < classItems.length; i++) {
		html += addOption(classItems[i][0] + ' ', 'hand twohand classitem ' + classItems[i][1], 'updateHand(this, \'' + classItems[i][0] + '\')');
	}
	return html;
}

function updateHand(element, value) {
	var container = $(element).parents('.select-row');
	var second = $(element).parents('.select-weapon').hasClass('second-select');
	var twohand = $(element).parent().hasClass('twohand');
	var tierOne = $(element).parent().hasClass('tierone');
	var relic = $(element).parent().hasClass('relic');
	var oldTwoHand = container.find('.items-container').find('.hand2').hasClass('secondary');
	var selector = '.hand';
	if (second) selector += '2';
	container.find('.items-container').find('.hand,.hand2').removeClass('secondary');
	var src;
	if ($(element).parent().hasClass('classitem')) {
		var classValue = container.find('input[name="class-title"]').attr('value');
		src = 'images/classes_cards/' + folderize(classValue) + '/' + urlize(value) + '.png';
	} else {
		var tierFolder = tierOne ? 'tier_one' : 'tier_two';
		if (relic) tierFolder = 'relic';
		src = 'images/items_cards/' + tierFolder + '/' + urlize(value) + '.png';
	}
	container.find('.items-container').find(twohand ? '.hand,.hand2' : selector).attr('src', src);
	if (!twohand && oldTwoHand) {
		clearHand(container.find('.items-selects').find('.select-weapon' + (second ? ':not(.second-select)' : '.second-select') + ' li')[0]);
	}
	if (twohand) {
		container.find('.weapon-title').html(value + ' ');
		container.find('.items-container').find('.hand2').addClass('secondary');
	} else {
		$(element).parents('.select-weapon').find('.weapon-title').html(value + ' ');
	}
	container.find('[name="hand' + (second && !twohand ? '2' : '') + '"]').val(value);
	if (twohand) {
		container.find('[name="hand2"]').val('');
	}
}

function clearBothHands(element) {
	var container = $(element).parents('.select-row');
	container.find('.hand2').removeClass('secondary');
	container.find('.items-container').find('.hand').attr('src', 'images/misc/hand.png');
	container.find('.items-container').find('.hand2').attr('src', 'images/misc/hand2.png');
	container.find('.weapon-title').html('Select Weapon ');
	container.find('[name="hand"],[name="hand2"]').val('');
}

function clearHand(element) {
	var container = $(element).parents('.select-row');
	var second = $(element).parents('.select-weapon').hasClass('second-select');
	var selector = '.hand';
	if (second) selector += '2';
	var twoHand = container.find('.hand2').hasClass('secondary');
	if (twoHand) {
		container.find('.hand2').removeClass('secondary');
		container.find('.items-container').find('.hand').attr('src', 'images/misc/hand.png');
		container.find('.items-container').find('.hand2').attr('src', 'images/misc/hand2.png');
		container.find('.weapon-title').html('Select Weapon ');
		container.find('[name="hand"],[name="hand2"]').val('');
	} else {
		container.find('.items-container').find(selector).attr('src', 'images/misc/hand' + (second ? '2' : '') + '.png');
		$(element).parents('.select-weapon').find('.weapon-title').html('Select Weapon ');
		container.find('[name="hand' + (second ? '2' : '') + '"]').val('');
	}
}

function createArmorSelectContent() {
	var html = addOption('Clear', '', 'clearArmor(this);');
	for (var i = 0; i < ITEMS['armor'].length; i++) {
		var item = ITEMS['armor'][i];
		html += addOption(item[0] + ' ', 'armor tierone', 'updateArmor(this, \'' + item[0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < ITEMS2['armor'].length; i++) {
		var item = ITEMS2['armor'][i];
		html += addOption(item[0] + ' ', 'armor tiertwo', 'updateArmor(this, \'' + item[0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	for (var i = 0; i < ITEMSR['armor'].length; i++) {
		var item = ITEMSR['armor'][i];
		html += addOption(item[0] + ' ', 'armor relic', 'updateArmor(this, \'' + item[0] + '\')');
	}
	html += '<li role="separator" class="divider"></li>';
	var classItems = getSkillsItems(armor);
	for (var i = 0; i < classItems.length; i++) {
		html += addOption(classItems[i][0] + ' ', 'armor classitem ' + classItems[i][1], 'updateArmor(this, \'' + classItems[i][0] + '\')');
	}
	return html;
}

function updateArmor(element, value) {
	var container = $(element).parents('.select-row');
	var tierOne = $(element).parent().hasClass('tierone');
	var relic = $(element).parent().hasClass('relic');
	var src;
	if ($(element).parent().hasClass('classitem')) {
		var classValue = container.find('input[name="class-title"]').attr('value');
		src = 'images/classes_cards/' + folderize(classValue) + '/' + urlize(value) + '.png';
	} else {
		var tierFolder = tierOne ? 'tier_one' : 'tier_two';
		if (relic) tierFolder = 'relic';
		src = 'images/items_cards/' + tierFolder + '/' + urlize(value) + '.png';
	}
	container.find('.items-container').find('.armor').attr('src', src);
	$(element).parents('.select-armor').find('.armor-title').html(value + ' ');
	container.find('[name="armor"]').val(value);
}

function clearArmor(element) {
	var container = $(element).parents('.select-row');
	container.find('.items-container').find('.armor').attr('src', 'images/misc/armor.png');
	$(element).parents('.select-weapon').find('.weapon-title').html('Select Armor ');
	container.find('[name="armor"]').val('');
}

function createItemSelectContent() {
	var html = addOption('Clear', '', 'clearItem(this);');
	for (var i = 0; i < ITEMS['item'].length; i++) {
		var itemObject = ITEMS['item'][i];
		html += addOption(itemObject[0] + ' ', 'item tierone', 'updateItem(this, \'' + itemObject[0] + '\')');
	}
	for (var i = 0; i < ITEMS2['item'].length; i++) {
		var itemObject = ITEMS2['item'][i];
		html += addOption(itemObject[0] + ' ', 'item tiertwo', 'updateItem(this, \'' + itemObject[0] + '\')');
	}
	for (var i = 0; i < ITEMSR['item'].length; i++) {
		var itemObject = ITEMSR['item'][i];
		html += addOption(itemObject[0] + ' ', 'item relic', 'updateItem(this, \'' + itemObject[0] + '\')');
	}
	var classItems = getSkillsItems(item);
	for (var i = 0; i < classItems.length; i++) {
		html += addOption(classItems[i][0] + ' ', 'item classitem tierone ' + classItems[i][1], 'updateItem(this, \'' + classItems[i][0] + '\')');
	}
	return html;
}


function updateItem(element, value) {
	var container = $(element).parents('.select-row');
	var second = $(element).parents('.select-item').hasClass('second-select');
	var selector = '.item';
	if (second) selector += '2';
	var tierOne = $(element).parent().hasClass('tierone');
	var relic = $(element).parent().hasClass('relic');
	var src;
	if ($(element).parent().hasClass('classitem')) {
		var classValue = container.find('input[name="class-title"]').attr('value');
		src = 'images/classes_cards/' + folderize(classValue) + '/' + urlize(value) + '.png';
	} else {
		var tierFolder = tierOne ? 'tier_one' : 'tier_two';
		if (relic) tierFolder = 'relic';
		src = 'images/items_cards/' + tierFolder + '/' + urlize(value) + '.png';
	}
	container.find('.items-container').find(selector).attr('src', src);
	$(element).parents('.select-item').find('.item-title').html(value + ' ');
	container.find('[name="item' + (second ? '2' : '') + '"]').val(value);
}

function adjustItems(element, value, hybrid) {
	var container = $(element).parents('.select-row');
	if (hybrid == undefined || !hybrid) {
		container.find('.items-selects').attr("class", "showclass items-selects " + folderize(value));
	} else {
		container.find('.items-selects').attr("class", "showclass items-selects " + folderize(container.find('input[name="class-title"]').val()));
		container.find('.items-selects').addClass(folderize(value));
	}
}

function clearItem(element) {
	var container = $(element).parents('.select-row');
	var second = $(element).parents('.select-item').hasClass('second-select');
	var selector = '.item';
	if (second) selector += '2';
	container.find('.items-container').find(selector).attr('src', 'images/misc/item.png');
	$(element).parents('.select-item').find('.item-title').html('Select Item ');
	container.find('input[name="item' + (second ? '2' : '') + '"]').attr('value', '');
}

function getItems(container) {
	var items = {};
	items.hand = container.find('[name="hand"]').val();
	items.hand2 = container.find('[name="hand2"]').val();
	items.armor = container.find('[name="armor"]').val();
	items.item = container.find('[name="item"]').val();
	items.item2 = container.find('[name="item2"]').val();
	return items;
}

function createSackAndSearchBlock() {
	var html = $('<div>').addClass('sack-block');
	var sackContainer = $('<div>').addClass('sack-container');
	sackContainer.append($('<h1>Sack and Search items</h1>'));
	var additionButton = $('<button>').attr('type','button').addClass('btn btn-success').attr('aria-expanded','false').attr('onclick', 'addToSack(this);');
	additionButton.html('Add Item or Search card');
	sackContainer.append(additionButton);
	html.append(sackContainer);

	var sackSelects = $('<div>').addClass('sack-selects');
	html.append(sackSelects);
	return html;
}

function createSearchSelectContent() {
	var html = '';
	for (var i = 0; i < SEARCH_ITEMS_LIST.length; i++) {
		html += addOption(SEARCH_ITEMS_LIST[i] + ' ', 'search', 'updateSackItem(this, \'' + SEARCH_ITEMS_LIST[i] + '\')');
	}
	return html;
}

function getSackAndSearch(container) {
	var result = [];
	var sack = $(container).find('[item]');
	for (var i = 0; i < sack.length; i++) {
		result.push($(sack[i]).attr('item'));
	}
	return result;
}

function createItemsAndSearchSelect() {
	var select = $(createInputSelect('Set Item/Search', 'sack-title', 'select-sack'));
	var ul = select.find('ul');
	ul.append(addOption('Remove', '', 'removeFromSack(this);'));
	ul.append($('<li role="separator" class="divider"></li>'));
	ul.append(createSearchSelectContent());
	ul.append($('<li role="separator" class="divider"></li>'));
	ul.append(createHandSelectContent().replace(new RegExp("updateHand",'g'), 'updateSackItem'));
	ul.append(createArmorSelectContent().replace(new RegExp("updateArmor",'g'), 'updateSackItem'));
	ul.append(createItemSelectContent().replace(new RegExp("updateItem",'g'), 'updateSackItem'));
	select.find('.hand,.armor,.item').removeClass('hand armor item');
	return select;
}

function addToSack(element) {
	var container = $(element).parents('.select-row');
	var sackAttribute = 'sack' + sackNumber.toString();
	container.find('.sack-container button').before('<img src="images/search_cards/flipped.png" item="Flipped" sack="' + sackAttribute + '"/>');
	container.find('.sack-selects').append(createItemsAndSearchSelect().attr('sack', sackAttribute));
	sackNumber += 1;
	return sackAttribute;
}

function removeFromSack(element) {
	var elementAttr = $(element).parents('.select-sack').attr('sack');
	$(element).parents('.select-row').find('[sack="' + elementAttr + '"]').remove();
}

function updateSackItem(element, value) {
	var container = $(element).parents('.select-row');
	var parent = $(element).parent();
	var search = parent.hasClass('search');
	var tierOne = parent.hasClass('tierone');
	var relic = parent.hasClass('relic');
	var classItem = parent.hasClass('classitem');
	var elementAttr = $(element).parents('.select-sack').attr('sack');
	var folder = search ? 'search_cards' : 'items_cards/' + (tierOne ? 'tier_one' : relic ? 'relic' : 'tier_two');
	if (classItem) {
		folder = 'classes_cards/' + parent.attr('class').replace(new RegExp("classitem",'g'), '').replace(new RegExp("twohand",'g'), '').replace(new RegExp(" ",'g'), '');
	}
	container.find('img[sack="' + elementAttr + '"]').attr('src', 'images/' + folder + '/' + urlize(value) + '.png').attr('item', value);
	container.find('div[sack="' + elementAttr + '"]').find('.sack-title').html(value + ' ');
}

function getHeroImage() {
	var heroImage = $('<img>');
	var heroImageFeat = $('<div>').addClass('hero-image-feat');
	var heroImageContainer = $('<div>').addClass('hero-image-container');
	heroImageContainer.append(heroImage);
	heroImageContainer.append(heroImageFeat);
	heroImage.attr('src', '').attr('onclick',"$(this).parent().toggleClass('feat-used')");
	return heroImageContainer;
}

function createTaintedSelectContent() {
	var html = addOption('Remove tainted card', '', 'removeTainted(this);');
	html += addOption('Back ', '', 'updateTainted(this, \'Back\')');
	for (var i = 0; i < TAINTED_CARDS_LIST.length; i++) {
		html += addOption(TAINTED_CARDS_LIST[i] + ' ', '', 'updateTainted(this, \'' + TAINTED_CARDS_LIST[i] + '\')');
	}
	return html;
}

function buildTaintedBlock() {
	var taintedBlock = $('<div>');
	taintedBlock.addClass('tainted-container');
	taintedBlock.append(buildTaintedButton());
	return taintedBlock;
}

function addTainted(button) {
	var buttonObject = $(button);
	var buttonContainer = buttonObject.parents('.tainted-container');
	var taintedSelect = $(createInputSelect('Back', 'tainted-title', 'select-tainted'));
	taintedSelect.find('ul').append(createTaintedSelectContent());
	buttonObject.remove();
	buttonContainer.append($('<img src="images/tainted_cards/back.png" class="tainted-image">'));
	buttonContainer.append(taintedSelect);
	buttonContainer.append($('<input type="hidden" name="tainted" value="back">'));
	return taintedSelect;
}

function buildTaintedButton() {
	return $('<button type="button" class="btn btn-default" aria-expanded="false" onclick="addTainted(this);">Add tainted card</button>');
}

function updateTainted(element, value) {
	var taintedContainer = $(element).parents('.tainted-container');
	taintedContainer.find('.tainted-title').html(value + ' ');
	taintedContainer.find('input[name="tainted"]').val(value);
	taintedContainer.find('img').attr('src','images/tainted_cards/' + urlize(value) + '.png');
}

function removeTainted(element) {
	var taintedContainer = $(element).parents('.tainted-container');
	taintedContainer.html('');
	taintedContainer.append(buildTaintedButton());
}

function getTainted(container) {
	var taintedInput = $(container).find('[name="tainted"]');
	if (taintedInput != undefined) {
		return taintedInput.val();
	} else {
		return undefined;
	}
}

function clearHeroesSackAndSearchItems() {
	$('.sack-container img').remove();
}
