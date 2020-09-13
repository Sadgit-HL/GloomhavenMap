function InitializeWindowFor_Heroes() {
	for (var i = 1; i <= MAX_Heroes; i++) {
		//here heroes are split between many windows (1 per window)
		InitializeWindowFor_OneHero(i);
	}
}

function UpdateWindow_Heroes() {
	//after Act Set
	//Update_MonsterImages(RowElement);
	//Update_MonsterImages();
}

function GetWindow_Heroes(DataToUpdate) {
	DataToUpdate = GetZone_Heroes(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_Heroes(NewData, FromPreFilledMaps) {
	//Fill_ActButton(); -> Common not Filled Here
	FillZone_Heroes(NewData, FromPreFilledMaps);
}

function ResetWindow_Heroes(FromPreFilledMaps) {
	for (var i = 1; i <= MAX_Heroes; i++) {
		ResetWindow_OneHero(i, FromPreFilledMaps);
	}
}

//one Hero
function InitializeWindowFor_OneHero(HeroNumber) {
	//one hero per window
	var html = $('#hero' + HeroNumber.toString());

	//one Hero zone
	html.append(CreateZone_Heroes(HeroNumber));
}

function ResetWindow_OneHero(HeroNumber, FromPreFilledMaps) {
	ResetZone_Heroes(HeroNumber, FromPreFilledMaps);
}

//Hero zone
function CreateZone_Heroes(HeroNumber) {
	var html = $('<div>');
	//using two classes ??!!
	//the second one used only for conditions
	html.addClass('heroes-container').addClass('hero' + HeroNumber.toString() + '-container');
	//initialize LineClass
	heroLine.NameListValues = Create_HeroListValues();
	//not the best thing to do 
	// using specific Element ID and
	// using common image container for specific hero .. but using number
	heroLine.elementID = "hero" + HeroNumber.toString()

	heroLine.TokenCommonImageContainer = "hero" + HeroNumber.toString() + "-conditions-container";
	html.append(AddLine_Hero());

	//add specific Zones
	html.append($('<div>').addClass('hero' + HeroNumber.toString() + '-conditions-container').addClass('conditions-container'));
	html.append(CreateZone_HeroIamge())

	//Items
//	html.append('<div style="clear:both"></div>');
//	html.append(CreateZone_HeroItems())
	//sacks
	//skills

	return html;
}

function GetZone_Heroes(DataToUpdate) {
	var result = [];
	var heroes = $('.heroes-container .select-row');
	for (var i = 0; i < heroes.length; i++) {
		var container = $(heroes[i]);
		var hero = {};
		hero = heroLine.GetOneLineData(container);
		//add specific Zones
		//GetZone_HeroSkills(container, hero);
		result.push(hero);
	}
	DataToUpdate.heroes = result;
	return DataToUpdate;
}

function FillZone_Heroes(NewData, FromPreFilledMaps) {
	ResetZone_Heroes(FromPreFilledMaps);
	if (NewData.heroes != undefined) {
		for (var i = 0; i < NewData.heroes.length; i++) {
			heroLine.XYBase = "1x1";
			//not the best thing to do 
			// using specific Element ID and
			// using common image container for specific hero .. but using number
			heroLine.elementID = "hero" + (i + 1).toString()
			heroLine.TokenCommonImageContainer = "hero" + (i + 1).toString() + "-conditions-container";

			var html = heroLine.AddOneLineWithData(NewData.heroes[i]);
			//add specific Zones

			////add zone for hero skill + insert skill images container
			//var HeroImageContainer = $('<div>').addClass('hero-skills-images-container');
			//html.find('.Row-cards').after(HeroImageContainer);
			//var SkillZone = CreateZone_HeroSkills(NewData.heroes[i].title);
			//html.append(SkillZone);
			//FillZone_HeroSkills(html, NewData.heroes[i], FromPreFilledMaps);

			//Update_HeroImages(html);
			$('#hero' + (i + 1).toString() + ' .heroes-container').prepend(html);
			Update_HeroImages($('#hero' + (i + 1).toString() + ' .heroes-container'));
			Update_TokenImages(html);
		}
	}
}

function ResetZone_Heroes(FromPreFilledMaps) {
	$('.heroes-container .select-row').remove();
}

function AddLine_Hero() {
	heroLine.XYBase = "1x1";
	var html = heroLine.AddOneEmptyLine();
	$('.heroes-container').append(html);
	return html;
}

function Create_HeroListValues() {
	var html = addOption('Clear', '', 'UnSet_Hero(this);');
	Object.keys(HEROES_LIST).forEach(item => {
		var additionalText = ''
		if (heroLine.DisplayExpansionNameInSelect == true) {
			additionalText = '- ' + HEROES_LIST[item].expansion;
		}
		html += addOption(HEROES_LIST[item].title + ' ' + additionalText, '', 'Set_Hero(this, \'' + item + '\')');
	});
	return html;
}

function Set_Hero(element, value) {
	heroLine.XYBase = "1x1";
	var container = $(element).parents('.select-row');
	heroLine.Set_MainElement(container, value);
	Update_HeroImages(container);
	//add zone for hero skill + insert skill images container
//	var HeroImageContainer = $('<div>').addClass('hero-skills-images-container');
//	container.find('.Row-cards').after(HeroImageContainer);
//	var SkillZone = CreateZone_HeroSkills(value);
//	container.append(SkillZone);
}

function UnSet_Hero(element) {
	var container = $(element).parents('.select-row');
	heroLine.UnSet_MainElement(container);
	Update_HeroImages(container);
}

//Hero Image is just for display : no need to Get / Fill
function CreateZone_HeroIamge() {
	var html = $('<div>').addClass('hero-image-container');

	var heroImage = $('<img>');
	heroImage.attr('src', '').attr('onclick', "$(this).parent().toggleClass('feat-used')");
	html.append(heroImage);

//	var heroImageFeat = $('<div>').addClass('hero-image-feat');
//	html.append(heroImageFeat);

	return html;
}

function Update_HeroImages(RowElement) {
	var HeroImage = RowElement.find('.hero-image-container img');
	var HeroTokenPath = 'images/StaticSite/mHeroNotSet.png';
	//Reset_HeroImages(RowElement);

	var OneHeroValue = RowElement.find('.MainElement-Value').val();
	if (OneHeroValue != undefined && OneHeroValue != '') {
		if (HeroImage != undefined) {
			HeroImage.attr('src', ImagePathRoot + heroLine.CardsPath(EXPANSION_PATHS[heroLine.AllData[OneHeroValue].expansion]) + urlize(heroLine.AllData[OneHeroValue].title) + '.png');
			HeroTokenPath = ImagePathRoot + heroLine.MapTokensPath(EXPANSION_PATHS[heroLine.AllData[OneHeroValue].expansion]) + urlize(heroLine.AllData[OneHeroValue].title) + '.png';
		}
	}
	else {
	}

	//update menu icon
	var heroId = RowElement.parent().attr('id');
	var heroImage = $('<img>');
	heroImage.attr('src', HeroTokenPath);
	var heroMenuIcon = $('[href="#' + heroId + '"]');
	heroMenuIcon.html('');
	heroMenuIcon.append(heroImage);


	//if (HeroImageContainer.find('.' + urlize(OneHeroValue)).length == 0) {
	//	var HeroImage = $('<img>');
	//	HeroImage.attr('src', 'images/heroes_cards/' + urlize(OneHeroValue) + '.png');
	//	HeroImageContainer.append(HeroImage);
	//}
}

function Reset_HeroImages(RowElement) {
	var HeroImageContainer = RowElement.find('.Row-cards');
	HeroImageContainer.find('img').remove();

	//update menu icon
	var HeroTokenPath = 'images/StaticSite/mHeroNotSet.png';
	var heroId = RowElement.parent().attr('id');
	var heroImage = $('<img>');
	heroImage.attr('src', HeroTokenPath);
	var heroMenuIcon = $('[href="#' + heroId + '"]');
	heroMenuIcon.html('');
	heroMenuIcon.append(heroImage);
}



































function addHeroLine(number) {
	var heroLine = $('<div>').attr('id','hero' + number.toString() + 'wrapper');
	addUnitLine(heroLine, 'hero');
	heroLine.append(Create_CustomInput(1));
	heroLine.append(Create_CustomInput(3));
	heroLine.append(Create_CustomInput(4));

	heroLine.find('.select-hero ul').append(createHeroSelectContent());
	heroLine.find('.select-x ul').append(createXSelectContent(true));
	heroLine.find('.select-x ul').addClass('showOneCell');
	heroLine.find('.select-y ul').addClass('showOneCell').append(createYSelectContent(true));

	heroLine.append($('<button type="button" class="btn btn-warning" aria-expanded="false" onclick="addCondition(this);">Add token</button>'));
	heroLine.append($('<button type="button" class="btn btn-default" aria-expanded="false" onclick="addAura(this);">Add aura</button>'));
	heroLine.append(createConditionsBlock());

	heroLine.append(getHeroImage());

	$('#hero' + number.toString()).append(heroLine);
}

function createHeroSelectContent() {
	var html = addOption('Clear', '', 'clearHero(this);');
	for (var i = 0; i < HEROES_LIST.length; i++) {
		html += addOption(HEROES_LIST[i][0] + ' - ' + HEROES_LIST[i][5], '', 'updateHero(this, \'' + HEROES_LIST[i][0] + '\');');
	}
	return html;
}

function updateHero(element, value) {
	var container = $(element).parents('.select-row');

	container.find('.hero-title').html(value + ' ');
	container.find('input[name="hero-title"]').attr('value',value);
	container.find('input[name="hero-x"]').attr('value','');
	container.find('input[name="hero-y"]').attr('value','');

	//OLD !!
	if (HEROES[value].hp != undefined) {
		container.find('input[name="hero-hp"]').val(HEROES[value].hp);
	}
	if (HEROES[value].stamina != undefined) {
		container.find('input[name="hero-stamina"]').val(HEROES[value].stamina);
	}
	container.find('.hero-image-container').children('img').attr('src', 'images/heroes_cards/' + urlize(value) + '.png');
	var heroId = container.parent().attr('id');
	var heroImage = $('<img>');
	heroImage.attr('src', 'images/heroes_tokens/' + urlize(value) + '.png');
	var heroMenuIcon = $('[href="#' + heroId + '"]');
	heroMenuIcon.html('');
	heroMenuIcon.append(heroImage);
}

function hero(element) {
	var container = $(element);
	var hero = {};
	hero.title = container.find('[name="hero-title"]').val();
	if (hero.title != "") {
		hero.x = container.find('[name="hero-x"]').val();
		hero.y = container.find('[name="hero-y"]').val();

		hero.ci = [];
		for (i=0;i<MAX_CustomInputs;i++){
			hero.ci[i] = Get_CustomInput(i, container);
		}

		hero.conditions = getConditions(container);
	}
	return hero;
}

function constructHeroesTabsFromConfig() {
	for (var i = 1; i <= MAX_Heroes; i++) {
		var heroConfig = config['hero' + i.toString()];
		if (heroConfig != undefined && heroConfig.title != undefined && heroConfig.title != "") {
			var heroSelector = '#hero' + i.toString();
			updateHero($(heroSelector + ' .select-hero li')[0],heroConfig.title);
			$(heroSelector + ' [name="hero-x"]').val(heroConfig.x);
			$(heroSelector + ' .x-title').html(getAlphabetChar(heroConfig.x - 1) + ' ');
			$(heroSelector + ' [name="hero-y"]').val(heroConfig.y);
			$(heroSelector + ' .y-title').html(heroConfig.y.toString() + ' ');

			updateConditionsInSettings(heroConfig.conditions, $(heroSelector));

			for (j=0;j<MAX_CustomInputs;j++){
				if (heroConfig.ci != undefined && heroConfig.ci.length > i && heroConfig.ci[j] != undefined){
					Set_CustomInput(j, $(heroSelector).find('.select-row'), heroConfig.ci[j]);
				}
			}
		}
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


function getHeroImage() {
	var heroImage = $('<img>');
	//var heroImageFeat = $('<div>').addClass('hero-image-feat');
	var heroImageContainer = $('<div>').addClass('hero-image-container');
	heroImageContainer.append(heroImage);
	//heroImageContainer.append(heroImageFeat);
	//heroImage.attr('src', '').attr('onclick',"$(this).parent().toggleClass('feat-used')");
	return heroImageContainer;
}
