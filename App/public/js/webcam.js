var WSAvcPlayer = require('../vendor');

var canvas = document.getElementById("webcam1")
// Create h264 player
var uri = "ws://" + document.location.host;
var wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
wsavc.connect(uri);

//for button callbacks
window.wsavc = wsavc;

wsavc.playStream()