$(function() {

	// Initialize the Reveal.js library with the default config options
	// See more here https://github.com/hakimel/reveal.js#configuration
	Reveal.initialize({
		history: true,
		dependencies: [
			{ src: 'assets/revealjs/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
		]
	});

	var socket = io();

	var presentation = $('.reveal');

	socket.on('access', function(data){

		var ignore = false;

		$(window).on('hashchange', function(){

			if(ignore){
				return;
			}

			var hash = window.location.hash;

			socket.emit('slide-changed', {
				hash: hash
			});

		});

		socket.on('navigate', function(data){

			window.location.hash = data.hash;

			// The "ignore" variable stops the hash change from
			// triggering our hashchange handler above and sending
			// us into a never-ending cycle.

			ignore = true;

			setInterval(function () {
				ignore = false;
			},100);

		});

	});

	//Change slides with arduino
	socket.on('nextSlide', function(data){
		Reveal.right();
		//console.log('nextSlide');
	});
	socket.on('prevSlide', function(data){
		Reveal.left();
		//console.log('prevSlide');
	});

	Reveal.addEventListener('slidechanged', function( event ) {
		console.log(event);
	});

});