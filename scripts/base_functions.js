function toggleMenu() {
	$('.menu').toggleClass('active');
}

function urlize(value) {
	return somethingize(value, '_');
}

function folderize(value) {
	return somethingize(value, '');
}

function somethingize(value, replacement) {
	if (value == undefined) {
		console.log('somethingize value is undefined');
		return '';
	}
	return value.replace(new RegExp(" ",'g'), replacement).toLowerCase();
}

function mapTilize(value) {
	return value.replace(new RegExp(" ",'g'), '');
}

function setClipboard(value) {
//    var tempInput = document.createElement("input");
    var tempInput = document.createElement("TEXTAREA");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}
