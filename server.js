var express 	= require('express'),
    app     	= express(),
    path 	= require('path'),
    http 	= require('http').Server(app),
    io 		= require('socket.io')(http),
    config 	= require('./config');

/**
* Array of color hex values
*/
var bulbColors = [config.TOTAL_BULBS];

/**
* @return Random hex color string
*/
function randomColor() {
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

/**
* Updates all bulb colors to a new random hex value
*/
function updateBulbColors() {
	for(var i = 0; i < config.TOTAL_BULBS; i++) {
		bulbColors[i] = randomColor();
	}
}

/**
* Infinite loop of updating the bulb colors and emitting
* the newly generated colors
*/
function emitBulbUpdate() {
	updateBulbColors();

	io.sockets.emit('lights', {
		bulbColors: bulbColors
	});

	setTimeout(emitBulbUpdate, config.LIGHT_UPDATE_INTERVAL);
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	io.sockets.connected[socket.id].emit('connected', {
		bulbColors: bulbColors
	});
});

http.listen(config.PORT, function(){
	console.log('Listening on *:' + config.PORT.toString());
	emitBulbUpdate();
});
