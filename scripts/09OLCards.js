function createOverlordCardsBlock() {
	var html = $('<div>').addClass('overlord-cards-container');
	var cardsImages = $('<div>').addClass('overlord-cards-images-container');
	var cardXP = '';
	for (var cardType in OVERLORD_CARDS) {
		if (OVERLORD_CARDS[cardType] == undefined) continue;
		var cardClass = $('<div>').addClass('overlord-cards-class');
		cardClass.append("<b>"+cardType+"</b>");
		var cardsOfType = OVERLORD_CARDS[cardType];
		for (var i = 0; i < cardsOfType.length; i++) {
			var card = cardsOfType[i];
			if (true || cardType != 'Basic' && cardType != 'Basic2') {
				var cardCheckbox = $('<div>').addClass('checkbox');
				cardXP = card.xp;
				if (cardXP != '') {
					cardXP = ' (' + cardXP + ' XP)'
				}
				cardCheckbox.append($('<label><input type="checkbox" name="' + card.title + '" onClick="adjustOverlordCardsImages();"/> ' + card.title + cardXP + '</label>'));
				cardClass.append(cardCheckbox);
			}
			for (var j = 0; j < card.number; j++) {
				cardsImages.append($('<img>').attr('src', 'images/overlord_cards/' + urlize(cardType) + '/' + urlize(card.title) + '.png').attr('card', card.title).attr('onclick','$(this).toggleClass(\'secondary\');').css('display','none'));
			}
		}
		html.append(cardClass);
	}
	html.prepend(cardsImages);
	$('#overlord-container').append(html);
	adjustOverlordCardsImages();
}

function constructOverlordCardsTabFromConfig() {
	for (var i = 0; config.overlord != undefined && config.overlord.cards != undefined && i < config.overlord.cards.length; i++) {
		var card = config.overlord.cards[i];
		updateOverlordCard(card.title, true);
		var imageObjects = $('[card="' + card.title + '"');
		for (var j = 0; j < card.secondary && j < imageObjects.length; j++) {
			$(imageObjects[j]).addClass('secondary');
		}
	}
	if (config.overlord.cards != undefined) {
		adjustOverlordCardsImages();
	}
}

function adjustOverlordCardsImages() {
	$('.overlord-cards-images-container img').css('display','none');
	var overlordCards = $('.overlord-cards-container input[type="checkbox"]');
	for (var i = 0; i < overlordCards.length; i++) {
		var overlordCard = $(overlordCards[i]);
		if (overlordCard.prop('checked')) {
			$('.overlord-cards-images-container img[card="' + overlordCard.attr('name') + '"]').css('display', 'inline-block');
		}
	}
}

function selectBasicOverlordDeck() {
	switchBasicOverlordDeck(true);
}

function selectBasic2OverlordDeck() {
	switchBasicOverlordDeck(false);
}

function switchBasicOverlordDeck(first) {
	for (var i = 0; i < OVERLORD_CARDS['Basic'].length; i++) {
		updateOverlordCard(OVERLORD_CARDS['Basic'][i].title, first);
	}
	for (var i = 0; i < OVERLORD_CARDS['Basic2'].length; i++) {
		updateOverlordCard(OVERLORD_CARDS['Basic2'][i].title, !first);
	}
	adjustOverlordCardsImages();
}

function clearOverlordDeck(){
	$('.overlord-cards-container input').prop('checked', false);
	adjustOverlordCardsImages();
}

function updateOverlordCard(title, value) {
	$('.overlord-cards-container input[name="' + title + '"]').prop('checked', value);
}

function getOverlordCards() {
	//$('.overlord-cards-images-container img').css('display','none');
	var overlordCards = $('.overlord-cards-container input[type="checkbox"]');
	var result = [];
	for (var i = 0; i < overlordCards.length; i++) {
		var overlordCard = $(overlordCards[i]);
		if (overlordCard.prop('checked')) {
			var card = {};
			card.secondary = $('.overlord-cards-images-container img[card="' + overlordCard.attr('name') + '"].secondary').length;
			card.title = overlordCard.attr('name');
			result.push(card);
		}
	}
	return result;
}

			function HashOverlordDeck()
			{
				//Recover selected OL Cards
				var overlordCards = $('.overlord-cards-images-container  img:visible.secondary');
				var numberOfOverlordCardsSelected = overlordCards.length

				//Create empty array with the number of OL Cards found
				var overlordCardsRadomArray = []; // = new Array[numberOfOverlordCardsSelected];
				for (var i = 0; i < numberOfOverlordCardsSelected; i++)
				{
					overlordCardsRadomArray[i] = '';
				}

				//Fill Empty array with Selected Card Randomly
				var randomNumber;
				var overlordCard;
				for (var i = 0; i < numberOfOverlordCardsSelected; i++) {
					randomNumber = Math.floor(Math.random() * numberOfOverlordCardsSelected);
					var found = 0;
					if(overlordCardsRadomArray[randomNumber] == '')
					{
						//Empty place put Card Name in it
						overlordCard = $(overlordCards[i]);
						overlordCardsRadomArray[randomNumber] = overlordCard.attr('card');
						found = 1;
					}
					else
					{
						//Find another empty place
						//actually next empty place
						while(found == 0)
						{
							randomNumber = randomNumber + 1;
							if (randomNumber >= numberOfOverlordCardsSelected)
							{
								randomNumber = 0;
							}
							if(overlordCardsRadomArray[randomNumber] == '')
							{
								//Empty place put Card Name in it
								overlordCard = $(overlordCards[i]);
								overlordCardsRadomArray[randomNumber] = overlordCard.attr('card');
								found = 1;
							}
						}
					}
				}

				//Out put Random Array in a field text
				var temporaryText = '';
				for (var i = 0; i < numberOfOverlordCardsSelected; i++)
				{
					temporaryText = temporaryText + (i+1) + ' - ' + overlordCardsRadomArray[i] + '\n';
				}
				//adding unique key to the field text (for the moment the key is 20 numbers long)
				temporaryText = temporaryText + 'KEY=';
				for (var i = 0; i < 20; i++)
				{
					temporaryText = temporaryText + Math.floor(Math.random() * 10);
				}

				setClipboard(temporaryText);
//				var textZone = $('#RandomSortedText');
//
//				textZone.val(temporaryText);
//
//				//Select text and send to Clipboard
//				textZone.select();
//				document.execCommand("Copy");
				alert("Copied the text to Clipboard: \n" + temporaryText);
			}


