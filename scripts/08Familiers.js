function InitializeWindowFor_Familiars() {
	var html = $('#familiars');

	//familiars zone
	html.append(CreateZone_Familiars());


	//villagers zone
	html.append(CreateZone_Villagers());
}

function UpdateWindow_Familiars() {
	//after Act Set
	//Update_MonsterImages(RowElement);
	//Update_MonsterImages();
}

function GetWindow_Familiars(DataToUpdate) {
	DataToUpdate = GetZone_Familiars(DataToUpdate);
	DataToUpdate = GetZone_Villagers(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_Familiars(NewData, FromPreFilledMaps) {
	//Fill_ActButton(); -> Common not Filled Here
	FillZone_Familiars(NewData, FromPreFilledMaps);
	FillZone_Villagers(NewData, FromPreFilledMaps);
}

function ResetWindow_Familiars(FromPreFilledMaps) {
	ResetZone_Familiars(FromPreFilledMaps);
	ResetZone_Villagers(FromPreFilledMaps);
}


//Familiars zone
function CreateZone_Familiars() {
	var html = $('<div>');
	var container = $('<div>').addClass('familiar-container');
	container.append('<h1>Summons</h1>');
	//container.append('<div class="familiars-cards"></div>');
	//container.append('<div class="familiars-tokenscards"></div>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Familiar();">Add Summons</button>');
	//initialize LineClass
	familiarLine.NameListValues = Create_FamiliarListValues();
	//familiarLine.TokenCommonImageContainer = "familiars-tokenscards";

	return html;
}

function GetZone_Familiars(DataToUpdate) {
	var result = [];
	var familiars = $('.familiar-container .select-row');
	for (var i = 0; i < familiars.length; i++) {
		var container = $(familiars[i]);
		var familiar = {};
		familiar = familiarLine.GetOneLineData(container);
		result.push(familiar);
	}
	DataToUpdate.familiars = result;
	return DataToUpdate;
}

function FillZone_Familiars(NewData, FromPreFilledMaps) {
	ResetZone_Familiars(FromPreFilledMaps);
	if (NewData.familiars != undefined) {
		for (var i = 0; i < NewData.familiars.length; i++) {
			familiarLine.XYBase = "1x1";
			var html = familiarLine.AddOneLineWithData(NewData.familiars[i]);
			$('.familiar-container').append(html);
		}
		//Update_FamiliarImages(html);
	}
}

function ResetZone_Familiars(FromPreFilledMaps) {
	$('.familiar-container .select-row').remove();
}

function AddLine_Familiar() {
	familiarLine.XYBase = "1x1";
	var html = familiarLine.AddOneEmptyLine();
	$('.familiar-container').append(html);
	return html;
}

function RemoveLine_Familiar(Button) {
	Update_FamiliarImages();
}

function Create_FamiliarListValues() {
	var html = addOption('Clear', '', 'UnSet_Familiar(this);');
	Object.keys(FAMILIARS_LIST).forEach(item => {
		html += addOption(FAMILIARS_LIST[item].title + ' ', '', 'Set_Familiar(this, \'' + item + '\')');
	});
	return html;
}

function Set_Familiar(element, value) {
	familiarLine.XYBase = "1x1";
	var container = $(element).parents('.select-row');
	familiarLine.Set_MainElement(container, value);
	//Update_FamiliarImages(container);
}

function UnSet_Familiar(element) {
	var container = $(element).parents('.select-row');
	familiarLine.UnSet_MainElement(container);
	//Update_FamiliarImages(container);
}

//function Update_FamiliarImages(RowElement) {
//	var FamiliarImageContainer = $('.familiars-cards');
//	var FamiliarList = $('.familiar-container').find('.MainElement-Value');
//	Reset_FamiliarImages(RowElement);

//	for (var i = 0; i < FamiliarList.length; i++) {
//		var OneFamiliarValue = $(FamiliarList[i]).attr('value');
//		if (OneFamiliarValue == undefined || OneFamiliarValue == '') continue;
//		if (FamiliarImageContainer.find('.' + urlize(OneFamiliarValue)).length == 0) {
//			if (FAMILIARS_LIST[OneFamiliarValue].hasCard) {
//				var FamiliarImage = $('<img>').addClass('familiar-image');
//				FamiliarImage.attr('src', 'images/familiars_cards/' + urlize(OneFamiliarValue) + '.png').addClass('familiar').addClass(urlize(OneFamiliarValue));
//				FamiliarImageContainer.append(FamiliarImage);
//			}
//		}
//	}
//}

//function Reset_FamiliarImages(RowElement) {
//	var FamiliarImageContainer = $('.familiars-cards');
//	FamiliarImageContainer.find('img').remove();
//}

//Villagers zone
function CreateZone_Villagers() {
	var html = $('<div>');
	var container = $('<div>').addClass('villagers-container');
	container.append('<h1>Custom Summons</h1>');
	html.append(container);
	html.append('<button type="button" class="btn btn-success" aria-expanded="false" onclick="AddLine_Villager();">Add Custom Summons</button>');
	//initialize LineClass
	villagerLine.NameListValues = Create_VillagerListValues();

	return html;
}

function GetZone_Villagers(DataToUpdate) {
	var result = [];
	var villagers = $('.villagers-container .select-row');
	for (var i = 0; i < villagers.length; i++) {
		var container = $(villagers[i]);
		var villager = {};
		villager = villagerLine.GetOneLineData(container);
		result.push(villager);
	}
	DataToUpdate.villagers = result;
	return DataToUpdate;
}

function FillZone_Villagers(NewData, FromPreFilledMaps) {
	ResetZone_Villagers(FromPreFilledMaps);
	if (NewData.villagers != undefined) {
		for (var i = 0; i < NewData.villagers.length; i++) {
			villagerLine.XYBase = "1x1";
			var html = villagerLine.AddOneLineWithData(NewData.villagers[i]);
			$('.villagers-container').append(html);
		}
	}
}

function ResetZone_Villagers(FromPreFilledMaps) {
	$('.villagers-container .select-row').remove();
}

function AddLine_Villager() {
	villagerLine.XYBase = "1x1";
	var html = villagerLine.AddOneEmptyLine();
	$('.villagers-container').append(html);
	return html;
}

function Create_VillagerListValues() {
	var html = addOption('Clear', '', 'UnSet_Villager(this);');
	Object.keys(VILLAGERS_LIST).forEach(item => {
		html += addOption(VILLAGERS_LIST[item].title + ' ', '', 'Set_Villager(this, \'' + item + '\')');
	});
	return html;
}

function Set_Villager(element, value) {
	villagerLine.XYBase = "1x1";
	var container = $(element).parents('.select-row');
	villagerLine.Set_MainElement(container, value);
}

function UnSet_Villager(element) {
	var container = $(element).parents('.select-row');
	villagerLine.UnSet_MainElement(container);
}

