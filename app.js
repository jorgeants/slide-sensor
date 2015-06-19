var five = require("johnny-five"),
	express = require('express'),
	app = express();

var board = new five.Board();
var ledG, ledR, sensorNext;

var port = process.env.PORT || 8080;

var io = require('socket.io').listen(app.listen(port));

// App Configuration
app.use(express.static(__dirname + '/public'));

// Initialize a new socket.io application
var presentation = io.on('connection', function (socket) {

	board.on("ready", function() {

		console.log("Johnny Five responde: Estou pronto!");

		ledG = new five.Led(10);
		ledR = new five.Led(12);

		sensorNext = new five.Motion(2);
		sensorPrev = new five.Motion(4);

		sensorNext.on("calibrated", function() {
			console.log("Sensor 1 calibrado!");
		});
		sensorPrev.on("calibrated", function() {
			console.log("Sensor 2 calibrado!");
		});

		var control = {
		    nextSlide: function() {
		    	socket.emit('nextSlide');
		    	ledG.on();
		    },
		    prevSlide: function() {
		    	socket.emit('prevSlide');
		    	ledR.on();
		    }
		};

		sensorNext.on("motionstart", function() {
			//console.log("Início de movimento do sensor 1 detectado!");
			control.nextSlide();
		});
		sensorNext.on("motionend", function() {
			//console.log("Fim de movimento do sensor 1 detectado!");
			ledG.off();
		});

		sensorPrev.on("motionstart", function() {
			//console.log("Início de movimento do sensor 2 detectado!");
			control.prevSlide();
		});
		sensorPrev.on("motionend", function() {
			//console.log("Fim de movimento do sensor 2 detectado!");
			ledR.off();
		});

	});

	socket.emit('access');

	socket.on('slide-changed', function(data){
			
		presentation.emit('navigate', {
			hash: data.hash
		});

	});

});
