function LineClass(elementName, elementID, RemoveCallBack) {
	//global parameters (the same for every MainElement)
	this.elementName = elementName;
	this.elementID = folderize(elementID).toLowerCase();
	this.NameListValues;
	this.needSideList = false;
	this.needCoordinates = false;
	this.needAngleList = false;
	this.needOpenedCheckbox = false;
	this.needHPInput = false;
	this.needFatigueInput = false;
	this.needArchetypeList = false;
	this.needClassList = false;
	this.UsesMainCommonImages = false;
	this.MainCommonImageContainer = "";
	this.TokenCommonImageContainer = "";
	this.RelicCommonImageContainer = "";
	this.needAddTokenButton = false;
	this.needAddRelicButton = false;
	this.needAddAuraButton = false;
	this.needRemoveButton = false;
	this.CallBackOnRemove = RemoveCallBack;		// -> should have a value if needRemoveButton = true

	//specific parameters (could be different from line to line for the same MainElement)
	this.XYBase = "1x1";						// -> should have a value if needCoordinates = true

	this.AddOneEmptyLine = function() {
			var lineHTML = $('<div>');
			lineHTML.addClass('select-row');

			if (this.UsesMainCommonImages == true) {
				lineHTML.append('<div class="Row-cards"></div>');
			}
			if (this.needAddRelicButton == true && this.RelicCommonImageContainer == "") {
				lineHTML.append('<div class="Row-relicscards"></div>');
			}
			if (this.needAddTokenButton == true && this.TokenCommonImageContainer == "") {
				lineHTML.append('<div class="Row-tokenscards"></div>');
			}
			lineHTML.append('<div style="clear:both"></div>');

			lineHTML.append(Create_MainElementList(this.elementName, this.elementID, this.NameListValues));

			if (this.needSideList == true) {
				lineHTML.append(Create_SideList());
			}
			if (this.needCoordinates == true) {
				lineHTML.append(Create_CoordinatesSystem(this.XYBase));
			}
			if (this.needOpenedCheckbox == true) {
				lineHTML.append(Create_OpenCheckbox());
			}
			if (this.needAngleList == true) {
				lineHTML.append(Create_AngleList());
			}
			if (this.needHPInput == true) {
				lineHTML.append(Create_HPInput());
			}
			if (this.needFatigueInput == true) {
				lineHTML.append(Create_FatigueInput());
			}
			if (this.needArchetypeList == true) {
			}
			if (this.needClassList == true) {
			}
			if (this.needAddTokenButton == true) {
				lineHTML.append(Create_TokenButton(this.TokenCommonImageContainer));
			}
			if (this.needAddRelicButton == true) {
				lineHTML.append(Create_RelicButton(this.RelicCommonImageContainer));
			}
			if (this.needAddAuraButton == true) {
				lineHTML.append(Create_AuraButton());
			}
			if (this.needRemoveButton == true) {
				var AdditionalCallBacks = "";		//Mainly for Images Updates
				if (this.needAddTokenButton == true && this.TokenCommonImageContainer != "") {
					AdditionalCallBacks = AdditionalCallBacks + "Update_TokenImages(this.parentElement);";
				}
				if (this.needAddRelicButton == true && this.RelicCommonImageContainer != "") {
					AdditionalCallBacks = AdditionalCallBacks + "Update_RelicImages(this.parentElement);";
				}
				lineHTML.append($('<button type="button" class="btn btn-danger" aria-expanded="false" onclick="RemoveOneRow(this);' + AdditionalCallBacks + RemoveCallBack + '">Remove ' + this.elementName + '</button>'));
			}
			return lineHTML;
		};
	this.Set_MainElement = function(RowElement, NewValue) {
			Set_MainElement(RowElement, this.elementID, NewValue);
			if (this.needCoordinates == true) {
				Update_XY(RowElement, this.XYBase)
			}
		};
	this.UnSet_MainElement = function(RowElement) {
			UnSet_MainElement(RowElement, this.elementName,this.elementID);
			if (this.needCoordinates == true) {
				UnSet_X(RowElement);
				UnSet_Y(RowElement);
			}
		};
	this.AddOneLineWithData = function(NewData) {
			var lineHTMLwithData = this.AddOneEmptyLine();

			Set_MainElement(lineHTMLwithData, this.elementID, NewData.title);
			if (this.needSideList == true) {
				Set_Side(lineHTMLwithData, NewData.side);
			}
			if (this.needCoordinates == true) {
				Update_XY(lineHTMLwithData, this.XYBase)
				Set_Coordinates(lineHTMLwithData, NewData);
			}
			if (this.needOpenedCheckbox == true) {
				Set_OpenCheckbox(lineHTMLwithData, NewData.opened);
			}
			if (this.needAngleList == true) {
				Set_Angle(lineHTMLwithData, NewData.angle);
			}
			if (this.needHPInput == true) {
				Set_HP(lineHTMLwithData, NewData.hp);
			}
			if (this.needFatigueInput == true) {
				Set_Fatigue(lineHTMLwithData, NewData.stamina);
			}
			if (this.needArchetypeList == true) {
			}
			if (this.needClassList == true) {
			}
			if (this.needAddTokenButton == true) {
				Set_Tokens(lineHTMLwithData, NewData.conditions);
			}
			if (this.needAddRelicButton == true) {
				Set_Relics(lineHTMLwithData, NewData.relics);
			}
			if (this.needAddAuraButton == true) {
				//for compatibility with old versions
				if (NewData.auras != undefined) {
					Set_Auras(lineHTMLwithData, NewData.auras);
				}
			}
			if (this.needRemoveButton == true) {
			}
			return lineHTMLwithData;
		};
	this.GetOneLineData = function(RowElement) {
			var LineData = {};

			LineData.title = Get_MainElement(RowElement);
			if (this.needSideList == true) {
				LineData.side = Get_Side(RowElement);
			}
			if (this.needCoordinates == true) {
				var Coordinates = Get_Coordinates(RowElement);
				LineData.direction = Coordinates.direction;
				LineData.x = Coordinates.x;
				LineData.y = Coordinates.y;
			}
			if (this.needOpenedCheckbox == true) {
				LineData.opened = Get_OpenCheckbox(RowElement);
			}
			if (this.needAngleList == true) {
				LineData.angle = Get_Angle(RowElement);
			}
			if (this.needHPInput == true) {
				LineData.hp = Get_HP(RowElement);
			}
			if (this.needFatigueInput == true) {
				LineData.stamina = Get_Fatigue(RowElement);
			}
			if (this.needArchetypeList == true) {
			}
			if (this.needClassList == true) {
			}
			if (this.needAddTokenButton == true) {
				LineData.conditions = Get_Tokens(RowElement);
			}
			if (this.needAddRelicButton == true) {
				LineData.relics = Get_Relics(RowElement);
			}
			if (this.needAddAuraButton == true) {
				LineData.auras = Get_Auras(RowElement);
			}
			if (this.needRemoveButton == true) {
			}
			return LineData;
		};
}


function RemoveOneRow(element) {
	$(element).parents('.select-row').remove();
}

// Main Element
function Create_MainElementList(elementTitle, elementID, MainElementListValues) {
	var html = createInputSelect('Select ' + elementTitle, elementID + '-title', 'select-' + elementID);
	html.find('ul').append(MainElementListValues);
	html.append($('<input type="hidden" name="MainElement-Value" class="MainElement-Value" value=""/>'));
	html.append($('<input type="hidden" name="MainElement-ID" class="MainElement-ID" value="' + elementID + '"/>'));
	return html;
}

function Get_MainElement(RowElement) {
	return RowElement.find('.MainElement-Value').val();
}

function Set_MainElement(RowElement, elementID, NewValue) {
	RowElement.find('.' + elementID + '-title').html(NewValue + ' ');
	RowElement.find('.MainElement-Value').attr('value',NewValue);
}





//			var monster = config.monsters[i];
//			if (monster.title != '') {
//				var monsterLine = addMonsterLine();
//				var width = monster.vertical ? MONSTERS[monster.title].width : MONSTERS[monster.title].height;
//				var height = monster.vertical ? MONSTERS[monster.title].height : MONSTERS[monster.title].width;
//
//				var monsterSelectUnit = monsterLine.find('[onclick="updateMonster(this, \'' + monster.title + '\');"]');
//				var correctMonsterSelectUnit;
//
//				if (monster.master && $(monsterSelectUnit[0]).html().indexOf('master') > -1 || !monster.master && !($(monsterSelectUnit[0]).html().indexOf('master') > -1)) {
//					correctMonsterSelectUnit = monsterSelectUnit[0];
//				} else {
//					correctMonsterSelectUnit = monsterSelectUnit[1];
//				}
//				updateMonster(correctMonsterSelectUnit, monster.title);
//
//				var xValue = width.toString() + monster.x.toString();
//				updateCoordinate(monsterLine.find('.select-x [onclick="updateCoordinate(this, \'' + xValue + '\');"]'), xValue);
//				var yValue = height.toString() + monster.y.toString();
//				updateCoordinate(monsterLine.find('.select-y [onclick="updateCoordinate(this, \'' + yValue + '\');"]'), yValue);
//				monsterLine.find('input[name="monster-hp"]').val(monster.hp);
//				updateConditionsInSettings(monster.conditions, monsterLine);
//			}


function UnSet_MainElement(RowElement, elementTitle, elementID) {
	RowElement.find('.' + elementID + '-title').html('Select ' + elementTitle);
	RowElement.find('.MainElement-Value').attr('value','');
}

// Side Element
function Create_SideList() {
	var html = createInputSelect('Select side', 'Side-Title', 'select-side');
	html.find('ul').append(addOption('Clear', '', 'UnSet_Side(this,\'\');'));
	html.find('ul').append(addOption('A' + ' ', '', 'Set_Side(this, \'' + 'A' + '\');'));
	html.find('ul').append(addOption('B' + ' ', '', 'Set_Side(this, \'' + 'B' + '\');'));
	html.append($('<input type="hidden" name="Side-Value" class="Side-Value" value=""/>'));
	return html;
}

function Set_Side(element, value) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Side-Title').html(value + ' ');
	container.find('.Side-Value').attr('value',value);
}

function Get_Side(RowElement) {
	return RowElement.find('.Side-Value').val();
}

function UnSet_Side(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Side-Title').html('Select side ');
	container.find('.Side-Value').attr('value','');
}

// Coordinates
// Has it's own File -> cCoordinatesElements.js


// Open Check Box
function Create_OpenCheckbox(elementTitle) {
	var html = $('<div>').addClass('checkbox').addClass('door-opened');
	var checkboxContent = $('<label>');
	checkboxContent.append($('<input>').attr('type', 'checkbox').attr('name','opened'));
	checkboxContent.append('opened');
	html.append(checkboxContent);
	return html;
}

function Get_OpenCheckbox(RowElement) {
	return RowElement.find('[name="opened"]').prop('checked');
}

function Set_OpenCheckbox(RowElement, value) {
	RowElement.find('[name="opened"]').prop('checked',value);
}

// Angle Element
function Create_AngleList(elementTitle) {
	var html = createInputSelect('Select angle', 'Angle-Title', 'select-angle');
	html.find('ul').append(addOption('Clear', '', 'UnSet_Angle(this,\'\');'));
	html.find('ul').append(addOption('0' + ' ', '', 'Set_Angle(this, \'' + '0' + '\');'));
	html.find('ul').append(addOption('90' + ' ', '', 'Set_Angle(this, \'' + '90' + '\');'));
	html.find('ul').append(addOption('180' + ' ', '', 'Set_Angle(this, \'' + '180' + '\');'));
	html.find('ul').append(addOption('270' + ' ', '', 'Set_Angle(this, \'' + '270' + '\');'));
	html.append($('<input type="hidden" name="Angle-Value" class="Angle-Value" value=""/>'));
	return html;
}

function Set_Angle(element, value) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Angle-Title').html(value + ' ');
	container.find('.Angle-Value').attr('value',value);
}

function UnSet_Angle(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Angle-Title').html('Select angle ');
	container.find('.Angle-Value').attr('value','');
}

function Get_Angle(RowElement) {
	return RowElement.find('.Angle-Value').val();
}

// HP Element
function Create_HPInput(elementTitle) {
	var html = $('<input type="text" name="HP-Value" class="form-control HP-Value" placeholder="Set HP" value=""/>');
	return html;
}

function Set_HP(element, value) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.HP-Value').attr('value',value);
}

function UnSet_HP(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.HP-Value').attr('value','');
}

function Get_HP(RowElement) {
	return RowElement.find('.HP-Value').val();
}

// Fatigue Element
function Create_FatigueInput(elementTitle) {
	var html = $('<input type="text" name="Stamina-Value" class="form-control Stamina-Value" placeholder="Set stamina" value=""/>');
	return html;
}

function Set_Fatigue(element, value) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Stamina-Value').attr('value',value);
}

function UnSet_Fatigue(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Stamina-Value').attr('value','');
}

function Get_Fatigue(RowElement) {
	return RowElement.find('.Stamina-Value').val();
}

// Archetype Element

// Class Element

// Token Element
function Create_TokenButton(TokenImageContainer) {
	var html= $('<div>');
	html.addClass('tokens-container');
	html.addClass('btn-group');
	html.append('<input type="hidden" name="TokenImageContainer" value="' + TokenImageContainer + '"/>');
	html.append($('<button type="button" class="btn btn-warning TokenButton" aria-expanded="false" onclick="Add_OneEmptyToken(this);">Add token</button>'));
	return html;
}

function Add_OneEmptyToken(ButtonElement) {
	var condition = $(createInputSelect('Select token', 'Token-Title', 'select-token')).attr('id', conditionNumber.toString());

	var removeButton = $('<a class="boxclose" id="boxclose" onclick="Remove_OneToken(this)"></a>');
	condition.find('.btn').prepend(removeButton);


	condition.find('ul').append(Create_TokenList());
	var buttonObject = $(ButtonElement);
	buttonObject.before(condition);
	buttonObject.before('<input type="hidden" name="Token-Value" class="Token-Value Token' + conditionNumber.toString() + '" value=""/>');
	conditionNumber += 1;
	return condition;
}

function Create_TokenList() {
	var html = ""; //addOption('Remove token', '', 'Remove_OneToken(this);');
	var switched = CONDITIONS[CONDITIONS_LIST[0]].hasConditionCard;
	for (var i = 0; i < CONDITIONS_LIST.length; i++) {
		if (switched != CONDITIONS[CONDITIONS_LIST[i]].hasConditionCard)
		{
			switched = CONDITIONS[CONDITIONS_LIST[i]].hasConditionCard;
			html += '<li role="separator" class="divider"></li>';
		}
		html += addOption(CONDITIONS_LIST[i] + ' ', '', 'Set_Token(this, \'' + CONDITIONS_LIST[i] + '\')');
	}
	return html;
}

function Remove_OneToken(element) {
	var container = $(element).parents('.select-row');
	var conditionSelect = $(element).parents('.select-token');
	var id = conditionSelect.attr('id');
	conditionSelect.remove();
	$('.Token' + id).remove();
	Update_TokenImages(container);
	//if (container.parents('#monsters').length > 0) {
	//	adjustMonsterList();
	//} else {
	//	container.find('.conditions-container').html('');
	//	addConditions(getConditions(container), conditionsContainer);
	//}
}

function Set_Token(element, value) {
	var TokenContainer;
	if ($(element).hasClass('select-token')) {
		TokenContainer = element
	}
	else {
		TokenContainer = $(element).parents('.select-token');
	}
	var id = TokenContainer.attr('id');
	$(TokenContainer).parents('.tokens-container').find('.Token' + id).attr('value',value);
	TokenContainer.find('.Token-Title').html(value + ' ');
	//Add_TokenImage($(TokenContainer).parents('.select-row'), value);
	Update_TokenImages($(TokenContainer).parents('.select-row'));
	//if (container.parents('#monsters').length > 0) {
	//	adjustMonsterList();
	//} else {
	//	container.find('.conditions-container').html('');
	//	addConditions(getConditions(container), conditionsContainer);
	//}
}

function Set_Tokens(RowElement, ConfigData) {
	var Button = $(RowElement.find('.TokenButton'))
	for (var OneToken in ConfigData) {
		OneTokenItem = Add_OneEmptyToken(Button);
		Set_Token(OneTokenItem, OneToken);
	}
	Update_TokenImages(RowElement);
}

function Reset_TokenImages(RowElement) {
	var TokenImageContainer;
	var ContainerName = RowElement.find('input[name="TokenImageContainer"]').val();
	if (ContainerName == "") {
		TokenImageContainer = $(RowElement.find('.Row-tokenscards'));
	}
	else {
		TokenImageContainer = $('.'+ContainerName);
	}
	TokenImageContainer.find('img').remove()
}

function Add_TokenImage(RowElement, NewValue) {
	var TokenImageContainer;
	var ContainerName = RowElement.find('input[name="TokenImageContainer"]').val();
	if (ContainerName == "") {
		TokenImageContainer = $(RowElement.find('.Row-tokenscards'));
	}
	else {
		TokenImageContainer = $('.'+ContainerName);
	}
	if (NewValue != undefined && NewValue != '' && CONDITIONS[NewValue].hasConditionCard) {
		if (TokenImageContainer.find('.' + urlize(NewValue)).length == 0)
		{
			var TokenImage = $('<img>');
			TokenImage.attr('src', 'images/conditions_cards/' + urlize(NewValue) + '.png').addClass('condition').addClass(urlize(NewValue));
			TokenImageContainer.append(TokenImage);
		}
	}
}

function Update_TokenImages(RowElement) {
	var TokenImageContainer;
	RowElement = $(RowElement);
	var ContainerName = RowElement.find('input[name="TokenImageContainer"]').val();
	var TokenList;
	if (ContainerName == "") {
		TokenImageContainer = $(RowElement.find('.Row-tokenscards'));
		TokenList = RowElement.find('.Token-Value');
	}
	else {
		TokenImageContainer = $('.'+ContainerName);
		TokenList = $('.'+RowElement.find('.MainElement-ID').val()+'-container').find('.Token-Value');
	}
	Reset_TokenImages(RowElement);
	for (var i = 0; i < TokenList.length; i++) {
		var OneTokenValue = $(TokenList[i]).attr('value');
		Add_TokenImage(RowElement, OneTokenValue);
	}
}

function Get_Tokens(RowElement) {
	var conditions = $(RowElement).find('.Token-Value');
	var conditionsObject = {};
	for (var i = 0; i < conditions.length; i++) {
		var condition = $(conditions[i]).val();
		if (conditionsObject[condition] == undefined) {
			conditionsObject[condition] = 1;
		} else {
			conditionsObject[condition] += 1;
		}
	}
	return conditionsObject;
}

// Relic Element
function Create_RelicButton(RelicImageContainer) {
	var html= $('<div>');
	html.addClass('relics-container');
	html.addClass('btn-group');
	html.append('<input type="hidden" name="RelicImageContainer" value="' + RelicImageContainer + '"/>');
	html.append($('<button type="button" class="btn btn-info RelicButton" aria-expanded="false" onclick="Add_OneEmptyRelic(this);">Add relic</button>'));
	return html;
}


function Add_OneEmptyRelic(ButtonElement) {
	var relic = $(createInputSelect('Select relic', 'Relic-Title', 'select-relic')).attr('id', relicNumber.toString());

	var removeButton = $('<a class="boxclose" id="boxclose" onclick="Remove_OneRelic(this)"></a>');
	relic.find('.btn').prepend(removeButton);

	relic.find('ul').append(Create_RelicList());
	var buttonObject = $(ButtonElement);
	buttonObject.before(relic);
	buttonObject.before('<input type="hidden" name="Relic-Value" class="Relic-Value Relic' + relicNumber.toString() + '" value=""/>');
	relicNumber += 1;
	return relic;
}

function Create_RelicList() {
	var html = ""; //addOption('Remove relic', '', 'Remove_OneRelic(this);');
	for (var i = 0; i < OVERLORD_RELICS_LIST.length; i++) {
		html += addOption(OVERLORD_RELICS_LIST[i] + ' ', '', 'Set_Relic(this, \'' + OVERLORD_RELICS_LIST[i] + '\')');
	}
	return html;
}

function Remove_OneRelic(element) {
	var container = $(element).parents('.select-row');
	var relicSelect = $(element).parents('.select-relic');
	var id = relicSelect.attr('id');
	relicSelect.remove();
	$('.Relic' + id).remove();
	Update_RelicImages(container);
}

function Set_Relic(element, value) {
	var RelicContainer;
	if ($(element).hasClass('select-relic')) {
		RelicContainer = element
	}
	else {
		RelicContainer = $(element).parents('.select-relic');
	}
	var id = RelicContainer.attr('id');
	$(RelicContainer).parents('.relics-container').find('.Relic' + id).attr('value',value);
	RelicContainer.find('.Relic-Title').html(value + ' ');
	//Add_RelicImage($(RelicContainer).parents('.select-row'), value);
	Update_RelicImages($(RelicContainer).parents('.select-row'));
}

function Set_Relics(RowElement, ConfigData) {
	var Button = $(RowElement.find('.RelicButton'))
	for (var OneRelic in ConfigData) {
		OneRelicItem = Add_OneEmptyRelic(Button);
		Set_Relic(OneRelicItem, OneRelic);
	}
	Update_RelicImages(RowElement);
}

function Reset_RelicImages(RowElement) {
	var RelicImageContainer = $('.'+ContainerName);
	var ContainerName = RowElement.find('input[name="RelicImageContainer"]').val();
	if (ContainerName == "") {
		RelicImageContainer = $(RowElement.find('.Row-relicscards'));
	}
	else {
		RelicImageContainer = $('.'+ContainerName);
	}
	RelicImageContainer.find('img').remove()
}

function Add_RelicImage(RowElement, NewValue) {
	var RelicImageContainer;
	var ContainerName = RowElement.find('input[name="RelicImageContainer"]').val();
	if (ContainerName == "") {
		RelicImageContainer = $(RowElement.find('.Row-relicscards'));
	}
	else {
		RelicImageContainer = $('.'+ContainerName);
	}
	if (NewValue != undefined && NewValue != '') {
		if (RelicImageContainer.find('.' + urlize(NewValue)).length == 0)
		{
			var RelicImage = $('<img>');
			RelicImage.attr('src', 'images/items_cards/relic/overlord/' + urlize(NewValue) + '.png').addClass('relic').addClass(urlize(NewValue));
			RelicImageContainer.append(RelicImage);
		}
	}
}

function Update_RelicImages(RowElement) {
	var RelicImageContainer;
	RowElement = $(RowElement);
	var ContainerName = RowElement.find('input[name="RelicImageContainer"]').val();
	var RelicList;
	if (ContainerName == "") {
		RelicImageContainer = $(RowElement.find('.Row-relicscards'));
		RelicList = RowElement.find('.Relic-Value');
	}
	else {
		RelicImageContainer = $('.'+ContainerName);
		RelicList = $('.'+RowElement.find('.MainElement-ID').val()+'-container').find('.Relic-Value');
	}
	Reset_RelicImages(RowElement);
	for (var i = 0; i < RelicList.length; i++) {
		var OneRelicValue = $(RelicList[i]).attr('value');
		Add_RelicImage(RowElement, OneRelicValue);
	}
}

function Get_Relics(RowElement) {
	var relics = $(RowElement).find('.Relic-Value');
	var relicsObject = {};
	for (var i = 0; i < relics.length; i++) {
		var relic = $(relics[i]).val();
		if (relicsObject[relic] == undefined) {
			relicsObject[relic] = 1;
		} else {
			relicsObject[relic] += 1;
		}
	}
	return relicsObject;
}

// Aura Element
function Create_AuraButton(elementTitle) {
	var html= $('<div>');
	html.addClass('auras-container');
	html.addClass('btn-group');
	html.append($('<button type="button" class="btn btn-success AuraButton" aria-expanded="false" onclick="Add_OneEmptyAura(this);">Add aura</button>'));
	return html;
}

function Add_OneEmptyAura(ButtonElement,DefaultColor) {
	var buttonObject = $(ButtonElement);

	var aura = $('<div>').addClass('aura').addClass('btn-group').attr('id', auraNumber.toString());

	if (DefaultColor == undefined) {
		DefaultColor = "";
	}
	var SpectrumInput = $('<input type="text" id="full' + auraNumber.toString() + '" value="' + DefaultColor + '" />');
	aura.append(SpectrumInput);

	buttonObject.before(aura);
	buttonObject.before('<input type="hidden" name="Aura-Value" class="Aura-Value Aura' + auraNumber.toString() + '" value=""/>');

	InitializeSpectrum(SpectrumInput, auraNumber.toString());
	CustomizeSpectrum(SpectrumInput, auraNumber.toString());

	auraNumber += 1;
	return aura;
}

function Create_AuraList() {
	var html = ""; //addOption('Remove aura', '', 'Remove_OneAura(this);');
	for (var i = 0; i < 15; i++) {
		html += addOption(i + ' ', '', 'Set_Aura(this, \'' + i + '\')');
	}
	return html;
}

function CustomizeSpectrum(StartElement,elementNb) {
	var removeButton = $('<a class="boxclose" id="boxclose" onclick="Remove_OneAura(this)"></a>');
	StartElement.parent().find(".sp-replacer.full"+elementNb+"-spectrum").addClass('btn').addClass('btn-default');
	StartElement.parent().find(".sp-replacer.full"+elementNb+"-spectrum").prepend(removeButton);

	var aura = $(createInputSelect('Select aura radius', 'Aura-Title NoSTOP', 'select-aura')).attr('id', elementNb);
	aura.find('ul').append(Create_AuraList());
	aura.find('ul').find('a').addClass('NoSTOP');
	aura.find('button').addClass('NoSTOP');
	var RadiusZone = $('<div>');
	RadiusZone.append(aura);
	StartElement.parent().find(".sp-container.full"+elementNb+"-spectrum").find(".sp-palette-container").prepend(RadiusZone);
}

function Remove_OneAura(element) {
	var oneAuraZone = $(element).parents('.aura');
	var id = oneAuraZone.attr('id');
	oneAuraZone.remove();
	$('.Aura' + id).remove();
}


function Set_Aura(element, value) {
	var container;
	if ($(element).hasClass('select-aura')) {
		container = element
	}
	else {
		if ($(element).is('.aura.btn-group')) {
			container = element
		}
		else {
			container = $(element).parents('.aura.btn-group');
		}
	}
	var id = container.attr('id');
	$(container).parents('.auras-container').find('.Aura' + id).attr('value',value);
	container.find('.Aura-Title').html(value + ' ');
	//for display on color selector
	var Preview = $(container).parents('.auras-container').find('.sp-replacer.full' + id + '-spectrum').find('.sp-preview-inner');
	Preview.html(value);
}

function Set_Auras(RowElement, ConfigData) {
	var Button = $(RowElement.find('.AuraButton'))
	for (var i = 0; i < ConfigData.length; i++) {
		var OneAura = ConfigData[i]
		OneAuraItem = Add_OneEmptyAura(Button, OneAura.color);
		Set_Aura(OneAuraItem, OneAura.radius);
	}
}

function UnSet_Aura(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		container = element
	}
	else {
		container = $(element).parents('.select-row');
	}
	container.find('.Angle-Title').html('Select angle ');
	container.find('.Angle-Value').attr('value','');
}

function Get_Auras(RowElement) {
	var aurasValues = $(RowElement).find('.Aura-Value');
	var aurasColors = $(RowElement).find('.sp-preview-inner');
	var result = [];
	for (var i = 0; i < aurasValues.length; i++) {
		var oneAura = {};
		oneAura.radius = $(aurasValues[i]).val();
		oneAura.color = $(aurasColors[i]).css('background-color');
		result.push(oneAura);
	}
	return result;
}

//    color: black;
//    background: rgba(255, 0, 0, .2);




