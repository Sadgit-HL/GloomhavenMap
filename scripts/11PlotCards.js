function createPlotDeckBlock() {
	var plotContainer = $('<div>').addClass('select-row');
	plotContainer.append($('<h1>Plot deck</h1>'));
	plotContainer.append(createInputSelect('Select plot deck ', 'plot-deck-title', 'select-plot-deck'));
	plotContainer.find('.select-plot-deck ul').append(createPlotDeckSelectContent());
	plotContainer.append($('<input type="hidden" name="plot-deck-title" value=""/>'));
	plotContainer.append($('<span class="threat-number-label">Threat tokens: </span>'));
	plotContainer.append($('<input type="text" name="threat-tokens" class="form-control" placeholder="Set Threat" value="0">'));
	plotContainer.append(createPlotCardsBlock());
	var plot = $('#plot');
    plot.html('');
    plot.append(plotContainer)
}

function createPlotCardsBlock() {
	var html = $('<div>').addClass('showplot').addClass('plot-cards-container');
	html.append($('<h2>Plot cards</h2>'));

	var plotImages = $('<div>').addClass('imagescontainer');
	for (var i = 0; i < PLOT_DECKS.length; i++) {
		var currentPlotDeck = PLOT_DECKS[i];
		for (var j = 0; j < currentPlotDeck[1].length; j++) {
			var plotCard = currentPlotDeck[1][j];
			var plotCardObject = $('<div>').addClass('checkbox').addClass(folderize(currentPlotDeck[0]));
			plotCardObject.append($('<label><input type="checkbox" name="' + plotCard[0] + '" onClick="adjustPlotCardsImages(this, \'' + currentPlotDeck[0] + '\');"/> ' + plotCard[0] + '</label>'));
			if (plotCard[1] == 0) {
				plotCardObject.addClass('disabled');
				plotCardObject.find('input').prop('checked', true);
				plotCardObject.find('input').attr('disabled', '');
			}
			html.append(plotCardObject);
			plotImages.append($('<img>').attr('src', 'images/plot_cards/' + urlize(currentPlotDeck[0]) + '/' + urlize(plotCard[0]) + '.png').attr('card', plotCard[0]).attr('onclick',"exhaustPlotCard(this);"));
		}
	}
	html.append(plotImages);
	return html;
}

function constructPlotDeckTabFromConfig() {
	if (config.plot != undefined) {
		if (config.plot.title != undefined && config.plot.title != '') {
			for (var i = 0; i < config.plot.cards.length; i++) {
				var card = config.plot.cards[i];
				var plotCard=$('input[type="checkbox"][name="' + card[0] + '"]');
				plotCard.prop('checked', card[1]);
				if (card[2]) {
					plotCard.addClass('card-exhausted', 'exhausted');
					$('#plot img[card="' + card[0] + '"]').addClass('exhausted')
				}
			}
			updatePlotDeck($('#plot .select-plot-deck li a')[0], config.plot.title);
			$('[name="threat-tokens"]').val(config.plot.number);
		}
	}
}

function createPlotDeckSelectContent() {
	var html = addOption('Clear', '', 'clearPlotDeck(this);');
	for (var i = 0; i < PLOT_DECKS.length; i++) {
		var title = PLOT_DECKS[i][0];
		html += addOption(title + ' ', title, 'updatePlotDeck(this, \'' + title + '\');');
	}
	return html;
}

function updatePlotDeck(element, value) {
	var container = $(element).parents('.select-row');
	container.find('.plot-deck-title').html(value + ' ');
	container.find('input[name="plot-deck-title"]').attr('value',value);
	adjustPlotCardsImages(element, value);
}

function clearPlotDeck(element) {
	var container = $(element).parents('.select-row');
	container.find('.plot-deck-title').html('Select plot deck ');
	container.find('input[name="plot-deck-title"]').attr('value','');
}

function adjustPlotCardsImages(element, value) {
	var container = $(element).parents('.select-row');
	if (value == undefined || value == '') {
		return;
	}
	container.find('.plot-cards-container').attr("class", "showplot plot-cards-container " + folderize(value));
	container.find('img').removeClass('showimage');
	var plotCards = $(container).find('.checkbox.' + folderize(value) + ' input');
	for (var i = 0; i < plotCards.length; i++) {
		var currentPlotCard = $(plotCards[i]);
		if (currentPlotCard.prop('checked')) {
			var plotCard = container.find('[card="' + currentPlotCard.attr('name') + '"]');
			plotCard.addClass('showimage');
			if (currentPlotCard.hasClass('card-exhausted')) {
				plotCard.addClass('exhausted');
			}
		}
	}
}

function exhaustPlotCard(image) {
	$(image).toggleClass('exhausted');
	var container = $(image).parents('.select-row');
	container.find('[name="' + $(image).attr('card') + '"]').toggleClass('card-exhausted');
}

function getPlotInfo() {
	var plot = {};
	var container = $('#plot .select-row');
	plot.title = container.find('[name="plot-deck-title"]').val();
	if (plot.title == undefined || plot.title =='') {
		return plot;
	}
	var cards = [];
	var plotCards = $(container).find('.checkbox.' + folderize(plot.title) + ' input');
	for (var i = 0; i < plotCards.length; i++) {
		var currentPlotCard = $(plotCards[i]);
		// var image = container.find('img[skill="' + currentPlotCard.attr('name') + '"]');
		cards.push([currentPlotCard.attr('name'), currentPlotCard.prop('checked'), currentPlotCard.hasClass('card-exhausted')]);
	}
	plot.cards = cards;
	plot.number = $('[name="threat-tokens"]').val();
	return plot;
}

