var WSAvcPlayer = require('../../vendor');
var left_m, right_m, vertical_f, vertical_b, arm = 0;
var disp_f = document.getElementById("vertical_f");
var disp_b = document.getElementById("vertical_b");
var disp_l = document.getElementById("left_m");
var disp_r = document.getElementById("right_m");

var tmp_l = 0;
var tmp_r = 0;
var tmp_f = 0;
var tmp_b = 0;

window.onload=function() {
	var socket = io.connect("http://127.0.0.1:3000")

	socket.on("connect", function() {
		window.setInterval(motorController, 10);
	});
}

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

function motorController() {
	

	var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
	if (!gamepads) {
    	return;
    }
    var gp = gamepads[0];
    var tmp_l = (gp.axes[1] * 100).toFixed(2)*-1;
    var tmp_r = (gp.axes[3] * 100).toFixed(2)*-1;

    //Front Motors
    if(buttonPressed(gp.buttons[4])) {
    	tmp_f += 1;
    }
    if(buttonPressed(gp.buttons[6])) {
    	tmp_f -= 1;
    }
    //Back Motors
    if(buttonPressed(gp.buttons[5])) {
    	tmp_b += 1;
    }
    if(buttonPressed(gp.buttons[7])) {
    	tmp_b -= 1;
    }
    if(tmp_f > 100) {tmp_f = 100};
    if(tmp_f < -100) {tmp_f = -100};
    if(tmp_b > 100) {tmp_b = 100};
    if(tmp_b < -100) {tmp_b = -100};

    disp_l.innerHTML = tmp_l;
    disp_r.innerHTML = tmp_r;
    disp_f.innerHTML = tmp_f;
    disp_b.innerHTML = tmp_b;

}

function buttonPressed(b) {
	if(typeof(b) == "object") {
		return b.pressed;
	}
	return b == 1.0;
}