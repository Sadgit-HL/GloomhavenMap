function InitializeWindowFor_QuestObjectives() {
	var html = $('#quest-objectives');
	html.append(addTextareaWithLabel("Heroes victory conditions:", "heroes-victory"));
	html.append(addTextareaWithLabel("Overlord victory conditions:", "overlord-victory"));
	html.append(addTextareaWithLabel("Current quest status:", "current-status"));
	html.append(addTextareaWithLabel("Reinforcements:", "reinforcements"));

	//expansions
	html.append(Create_ExpansionList());
}

function GetWindow_QuestObjectives(DataToUpdate) {
	var questObjectives = {};
	questObjectives.heroesVictory = $('#heroes-victory').val();
	questObjectives.ovelordVictory = $('#overlord-victory').val();
	questObjectives.currentStatus = $('#current-status').val();
	questObjectives.reinforcements = $('#reinforcements').val();
	DataToUpdate.questObjectives = questObjectives
	DataToUpdate = GetZone_Expansions(DataToUpdate);
	return DataToUpdate;
}

function FillWindow_QuestObjectives(NewData, FromPreFilledMaps) {
	var questObjectives = NewData.questObjectives;
	ResetWindow_QuestObjectives(FromPreFilledMaps);
	if (questObjectives != undefined) {
		$('#heroes-victory').val(questObjectives.heroesVictory);
		$('#overlord-victory').val(questObjectives.ovelordVictory);
		$('#current-status').val(questObjectives.currentStatus);
		$('#reinforcements').val(questObjectives.reinforcements);
	}
	FillZone_Expansions(NewData, FromPreFilledMaps);
}

function ResetWindow_QuestObjectives(FromPreFilledMaps) {
	$('#heroes-victory').val('');
	$('#overlord-victory').val('');
	$('#current-status').val('');
	$('#reinforcements').val('');
	ResetZone_Expansions(FromPreFilledMaps);
}
