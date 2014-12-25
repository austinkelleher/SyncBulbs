var socket = io();

/**
* Updates all bulbs with the new bulb colors emitted from the server.
* bulb[i] will now be the color stored at colors[i].
* @var bulbClassName The name of class element that stores the bulb color
* @var colors Array of color hex values
*/
function updateBulbColors(bulbClassName, colors) {
    var elements = document.getElementsByClassName(bulbClassName);

    if(colors.length > elements.length) return;

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = colors[i];
    }
}

/**
* @return A built div containing the bulb
*/
function generateBulb() {
	return "<div class='holder'>" +
				"<div class='ring'>" +
  					"<div class='ringhole'></div>" +
				"</div>" +
				"<div class='connector'></div>" +
				"<div class='bubble'></div>" +
			"</div>";
}

/**
* When the server has responded that the client has successfully
* connected, update the colors of each bulb to the colors that
* the server has stored.
*/
socket.on('connected', function(data) {
	var bulbs = "";
	for(var i = 0; i < data.bulbColors.length; i++) {
		bulbs += generateBulb();
	}

	document.getElementById("christmasBulbs").innerHTML = bulbs;
});

/**
* Update the colors of each bulb to the colors that
* the server has stored.
*/
socket.on('lights', function(data) {
	updateBulbColors("bubble", data.bulbColors);
});
