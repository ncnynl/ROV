var WSAvcPlayer = require('../../vendor');

window.addEventListener("gamepadconnected", function(e) {
	console.log("Gamepad connected at index %d: %s. %d buttons, %d axes. ",
		e.gamepad.index, e.gamepad.id,
		e.gamepad.buttons.length, e.gamepad.axes.length);
});

var canvas = document.getElementById("webcam1")
// Create h264 player
var uri = "ws://" + document.location.host;
var wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
wsavc.connect(uri);

//for button callbacks
window.wsavc = wsavc;