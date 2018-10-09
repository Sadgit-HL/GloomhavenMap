function Create_CoordinatesSystem(XYBase) {
	var html= $('<div>');
	html.addClass('coordinates-container');
	html.addClass('btn-group');

	var BaseArray = XYBase.split('x')
	if (BaseArray[0] != BaseArray[1]) {
		html.addClass('H V');
	}

	html.append($('<input type="hidden" name="XYBase-Value" class="XYBase-Value" value="' + XYBase + '"/>'));
	html.append(Create_XList(XYBase));
	html.append(Create_YList(XYBase));
	html.append(Create_Direction());
	return html;
}

function Update_XY(RowElement, NewXYBase) {
	//when main element is set
	if (NewXYBase != RowElement.find('.XYBase-Value').val()) {
		//New Base
		//initialise X list
		var XList = $(RowElement).find('.select-x ul');
		XList.find('li').remove();
		XList.append(Create_XListValues(NewXYBase));

		//initialise Y list
		var YList = $(RowElement).find('.select-y ul');
		YList.find('li').remove();
		YList.append(Create_YListValues(NewXYBase));
		RowElement.find('.XYBase-Value').attr('value', NewXYBase);


		if (RowElement.find('.X-Value').attr('value') == '') {
			UnSet_X(RowElement);
		}
		else {
			Set_X(RowElement,RowElement.find('.X-Value').attr('value'))
		}
		if (RowElement.find('.Y-Value').attr('value') == '') {
			UnSet_Y(RowElement);
		}
		else {
			Set_Y(RowElement,RowElement.find('.Y-Value').attr('value'))
		}
	}

//	var xYSelects = $(container).find('.select-x ul, .select-y ul');
//	var firstClass = SHOWING_CLASSES[NewXSize];
//	var secondClass = SHOWING_CLASSES[NewYSize];
//	xYSelects.removeClass(SHOWING_CLASSES[1] + ' ' + SHOWING_CLASSES[2] + ' ' + SHOWING_CLASSES[3] + ' squared');
//	xYSelects.addClass(firstClass);
//	if (firstClass == secondClass) {
//		xYSelects.addClass('squared');
//	} else {
//		xYSelects.addClass(secondClass);
//	}
//
//	UnSet_X(element);
//	UnSet_Y(element);
}

function Get_Coordinates(container) {
	var result = [];
	result.base = container.find('.XYBase-Value').val();
	result.direction = container.find('.direction-container a div').attr('class');
	result.x = container.find('.X-Value').val();
	result.y = container.find('.Y-Value').val();
	return result;
}

function Set_Coordinates(container, ConfigData) {
	container.find('.XYBase-Value').attr('value',ConfigData.base);
	container.find('.direction-container a div').attr('class',ConfigData.direction);
	Set_X(container,ConfigData.x);
	Set_Y(container,ConfigData.y);
}

// X element
function Create_XList(XYBase) {
	var html = createInputSelect('Select X coordinate', 'X-Title', 'select-x');
	html.find('ul').append(Create_XListValues(XYBase));
	html.append($('<input type="hidden" name="X-Value" class="X-Value" value=""/>'));
	return html;
}

function Create_XListValues(XYBase) {
	var html = "";
	html = addOption('Clear', '', 'UnSet_X(this,\'\');');
	var BaseArray = XYBase.split('x')
	var Direction1 = "";
	var Direction2 = "";
	var Direction3 = "";
	if (BaseArray[0] != BaseArray[1]) {
		switch (BaseArray[0]) {
			case "1":
				Direction1 = "V";
				break;
			case "2":
				Direction2 = "V";
				break;
		}
		switch (BaseArray[1]) {
			case "2":
				Direction2 = "H";
				break;
			case "3":
				Direction3 = "H";
				break;
		}
	}
	for (var i = 1; i <= mapWidth; i++) {
		//From 'A' to mapWidth in letters ex 'AN'
		if (BaseArray[0] == "1" || BaseArray[1] == "1") {
			html = html + addOption(getAlphabetChar(i-1), Direction1, 'Set_X(this, \'' + i.toString() + '\');');
		}
		if (BaseArray[0] == "2" || BaseArray[1] == "2") {
			if (i <= mapWidth-1)
				html = html + addOption(getAlphabetChar(i-1) + '-' + getAlphabetChar(i), Direction2, 'Set_X(this, \'' + i.toString() + '\');');
		}
		if (BaseArray[0] == "3" || BaseArray[1] == "3") {
			if (i <= mapWidth-2)
				html = html + addOption(getAlphabetChar(i-1) + '-' + getAlphabetChar(i+1), Direction3, 'Set_X(this, \'' + i.toString() + '\');');
		}
	}
	return html;
}

function Set_X(element, value) {
	var container;
	var DirectionDiv;
	var currentDirection;
	if ($(element).hasClass('select-row')) {
		//From Config
		container = element;
		DirectionDiv = element.find('.direction-container a div');
	}
	else {
		//FromMap
		container = $(element).parents('.select-row');
		DirectionDiv = $(element).parents('li');
	}
	container.find('.X-Value').attr('value', value);

	var BaseArray = container.find('.XYBase-Value').attr('value').split('x');
	var titleTemp = getAlphabetChar(value - 1);
	var NumCells = "1";
	currentDirection = DirectionDiv.attr("class");
	switch (currentDirection) {
		case "V":
			NumCells = BaseArray[0];
			break;
		case "H":
			NumCells = BaseArray[1];
			break;
		default:
			//BaseArray[0] = BaseArray[1]
			NumCells = BaseArray[0];
			break;
	}
	switch (NumCells) {
		case "2":
			titleTemp = titleTemp + '-' + getAlphabetChar(value);
			break;
		case "3":
			titleTemp = titleTemp + '-' + getAlphabetChar(value+1);
			break;
	}

	var DirectionAlreadyVisible = container.find('.direction-container').hasClass('visible');

	Update_Direction(element,currentDirection);

	container.find('.X-Title').html(titleTemp + ' ');

	if (DirectionAlreadyVisible == false && container.find('.direction-container').hasClass('visible') && value != '') {
		//also update Y title -> using Yvalue as if coming fromconfig
		Set_Y(container,container.find('.Y-Value').attr('value'))
	}
}

function Update_X(element, NewYSize) {
	var parent = $(element).parents('.btn-group');
	if (!parent.hasClass('squared')) {
		container.find('.select-x').removeClass(SHOWING_CLASSES[NewYSize]);
	}
}

function UnSet_X(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		//From Config
		container = element;
	}
	else {
		//FromMap
		container = $(element).parents('.select-row');
	}
	container.find('.X-Title').html('Select X coordinate');
	container.find('.X-Value').attr('value','');
	Update_Direction(element,'');
}

// Y element
function Create_YList(XYBase) {
	var html = createInputSelect('Select Y coordinate', 'Y-Title', 'select-y');
	html.find('ul').append(Create_YListValues(XYBase));
	html.append($('<input type="hidden" name="Y-Value" class="Y-Value" value=""/>'));
	return html;
}

function Create_YListValues(XYBase) {
	var html = "";
	html = addOption('Clear', '', 'UnSet_Y(this,\'\');');
	var BaseArray = XYBase.split('x')
	var Direction1 = "";
	var Direction2 = "";
	var Direction3 = "";
	// is the opposite of X
	if (BaseArray[0] != BaseArray[1]) {
		switch (BaseArray[0]) {
			case "1":
				Direction1 = "H";
				break;
			case "2":
				Direction2 = "H";
				break;
		}
		switch (BaseArray[1]) {
			case "2":
				Direction2 = "V";
				break;
			case "3":
				Direction3 = "V";
				break;
		}
	}
	for (var i = 0; i <= mapHeight; i++) {
		if (BaseArray[0] == "1" || BaseArray[1] == "1") {
			html = html + addOption(i.toString(), Direction1, 'Set_Y(this, \'' + i.toString() + '\');');
		}
		if (BaseArray[0] == "2" || BaseArray[1] == "2") {
			if (i <= mapHeight-1)
				html = html + addOption(i.toString() + '-' + (i+1).toString(), Direction2, 'Set_Y(this, \'' + i.toString() + '\');');
		}
		if (BaseArray[0] == "3" || BaseArray[1] == "3") {
			if (i <= mapHeight-2)
				html = html + addOption(i.toString() + '-' + (i+2).toString(), Direction3, 'Set_Y(this, \'' + i.toString() + '\');');
		}
	}
	return html;
}

function Set_Y(element, value) {
	var container;
	var currentDirection;
	var DirectionDiv;
	if ($(element).hasClass('select-row')) {
		//From Config
		container = element;
		DirectionDiv = element.find('.direction-container a div');
	}
	else {
		//FromMap
		container = $(element).parents('.select-row');
		DirectionDiv = $(element).parents('li');
	}
	container.find('.Y-Value').attr('value', value);

	var BaseArray = container.find('.XYBase-Value').attr('value').split('x');
	var titleTemp = value;
	var NumCells = "1";
	currentDirection = DirectionDiv.attr("class");
	switch (currentDirection) {
		case "V":
			NumCells = BaseArray[1];
			break;
		case "H":
			NumCells = BaseArray[0];
			break;
		default:
			//BaseArray[0] = BaseArray[1]
			NumCells = BaseArray[0];
			break;
	}
	switch (NumCells) {
		case "2":
			titleTemp = titleTemp + '-' + (Number(value)+1);
			break;
		case "3":
			titleTemp = titleTemp + '-' + (Number(value)+2);
			break;
	}

	var DirectionAlreadyVisible = container.find('.direction-container').hasClass('visible');

	Update_Direction(element,currentDirection);

	container.find('.Y-Title').html(titleTemp + ' ');

	if (DirectionAlreadyVisible == false && container.find('.direction-container').hasClass('visible') && value != '') {
		//also update Y title -> using Yvalue as if coming fromconfig
		Set_X(container,container.find('.X-Value').attr('value'))
	}
}

function Update_Y(element, NewXSize) {
	var parent = $(element).parents('.btn-group');
	if (!parent.hasClass('squared')) {
		container.find('.select-y').removeClass(SHOWING_CLASSES[NewXSize]);
	}
}

function UnSet_Y(element) {
	var container;
	if ($(element).hasClass('select-row')) {
		//From Config
		container = element;
	}
	else {
		//FromMap
		container = $(element).parents('.select-row');
	}
	container.find('.Y-Title').html('Select Y coordinate');
	container.find('.Y-Value').attr('value','');
	Update_Direction(element,'');
}

//direction
function Create_Direction() {
	var html= $('<div>');
	html.addClass('btn-group');
	html.addClass('direction-container');
	html.append($('<a onclick="SwitchDirection(this);"><div></div></a>'));
	return html;
}

function Update_Direction(element, value) {
	var container;
	var coordinatesContainer;
	if ($(element).hasClass('select-row')) {
		//From Config
		container = element;
		coordinatesContainer = container.find('.coordinates-container');
	}
	else {
		//FromMap
		container = $(element).parents('.select-row');
		coordinatesContainer = $(element).parents('.coordinates-container');
	}

	var DirectionContainer = container.find('.direction-container');
	var DirectionDiv = container.find('.direction-container a div');
	DirectionDiv.attr('class',value);

	switch (value) {
		case "V":
			coordinatesContainer.removeClass('H');
			DirectionContainer.addClass('visible');
			break;
		case "H":
			coordinatesContainer.removeClass('V');
			DirectionContainer.addClass('visible');
			break;
		default:
			var BaseArray = container.find('.XYBase-Value').attr('value').split('x');
			if (BaseArray[0] != BaseArray[1]) {
				coordinatesContainer.addClass('H V');
			}
			DirectionContainer.removeClass('visible');
	}
}

function SwitchDirection(element)
{
	var container = $(element).parents('.select-row');
	var DirectionDiv = container.find('.direction-container a div');
	var coordinatesContainer = $(element).parents('.coordinates-container');

	var BaseArray = container.find('.XYBase-Value').attr('value').split('x');
	var startX = container.find('.X-Value').attr('value');
	var titleXTemp = getAlphabetChar(startX - 1);
	var titleYTemp = container.find('.Y-Value').attr('value');
	if (DirectionDiv.attr("class") == "H")
	{
		DirectionDiv.attr("class","V");
		coordinatesContainer.removeClass('H');
		coordinatesContainer.addClass('V');
		switch (BaseArray[0]) {
			case "2":
				titleXTemp = titleXTemp + '-' + getAlphabetChar(startX);
				break;
			case "3":
				titleXTemp = titleXTemp + '-' + getAlphabetChar(startX+1);
				break;
		}
		switch (BaseArray[1]) {
			case "2":
				titleYTemp = titleYTemp + '-' + (Number(titleYTemp)+1);
				break;
			case "3":
				titleYTemp = titleYTemp + '-' + (Number(titleYTemp)+2);
				break;
		}
	}
	else if (DirectionDiv.attr("class") == "V")
	{
		DirectionDiv.attr("class","H");
		coordinatesContainer.removeClass('V');
		coordinatesContainer.addClass('H');
		switch (BaseArray[1]) {
			case "2":
				titleXTemp = titleXTemp + '-' + getAlphabetChar(startX);
				break;
			case "3":
				titleXTemp = titleXTemp + '-' + getAlphabetChar(startX+1);
				break;
		}
		switch (BaseArray[0]) {
			case "2":
				titleYTemp = titleYTemp + '-' + (Number(titleYTemp)+1);
				break;
			case "3":
				titleYTemp = titleYTemp + '-' + (Number(titleYTemp)+2);
				break;
		}
	}
	container.find('.X-Title').html(titleXTemp + ' ');
	container.find('.Y-Title').html(titleYTemp + ' ');
}
