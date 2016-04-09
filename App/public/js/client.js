//Joystick / Keyboard
//0-1023
//

var socket;

var motorValues = {
    vertical_f: 0,
    left_m: 0,
    right_m: 0,
    vertical_b: 0,
    arm: 90
}

var tmpValues = {
    vertical_f: 0,
    left_m: 0,
    right_m: 0,
    vertical_b: 0,
    arm: 90
}

var joystickConnected = false;
var connectedToServer = false;

$(document).ready(function() {
    //socket = io.connect('http://192.168.0.103:3000'); //Enter valid network IP
    window.addEventListener("gamepadconnected", function(e) {
        joystickConnected = true;
    });
    window.addEventListener("gamepaddisconnected", function(e) {
        joystickConnected = false;
    });
    socket.on('sensorData', function(temp) {
        $('#tempData').text(temp);
    })
    socket = io.connect('http://192.168.0.102:3000', {reconnect: true}); //Enter valid network IP
    socket.on('connect', function() {
        console.log("Connected to Server");
        connectedToServer = true;
    });
    socket.on('console', function(msg) {
        $('#console').text(msg + "\n" + $('#console').text())
    })
    window.setInterval(motorController, 10);
    window.setInterval(handleSocket, 10);
});

function motorController() {
    if(joystickConnected) {
        var changed = false
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        if (!gamepads) {
            return;
        }
        var gp = gamepads[0];
        tmpValues.left_m = (gp.axes[1] * 100).toFixed(0)*-1;
        tmpValues.right_m = (gp.axes[3] * 100).toFixed(0)*-1;

        //Joystick Press Handlers
        //Front Motors
        if(buttonPressed(gp.buttons[4])) {
            tmpValues.vertical_f += 1;
        }
        if(buttonPressed(gp.buttons[6])) {
            tmpValues.vertical_f -= 1;
        }
        //Back Motors
        if(buttonPressed(gp.buttons[5])) {
            tmpValues.vertical_b += 1;
        }
        if(buttonPressed(gp.buttons[7])) {
            tmpValues.vertical_b -= 1;
        }
        // Reset to Zero
        if(buttonPressed(gp.buttons[0])) {
            tmpValues.vertical_b = 0;
        }
        if(buttonPressed(gp.buttons[3])) {
            tmpValues.vertical_f = 0;
        }
        if(buttonPressed(gp.buttons[1])) {
            tmpValues.right_m = 0;
        }
        if(buttonPressed(gp.buttons[2])) {
            tmpValues.left_m = 0;
        }
        // Arm
        if(buttonPressed(gp.buttons[15])) {
            tmpValues.arm += 1;
        }
        if(buttonPressed(gp.buttons[14])) {
            tmpValues.arm -= 1;
        }

        $.each(tmpValues, function(key, value) {
            if(value > 100) {
                tmpValues[key] = 100;
            }
            if(value < -100) {
                tmpValues[key] = -100;
            }
            if(value != motorValues[key]) {
                changed = true;
                motorValues[key] = value;
            }
        })
        if(changed && connectedToServer) {
            socket.emit('onChange', motorValues);
            console.log(motorValues);
        }
        $("#vertical_f").text(motorValues.vertical_f);
        $("#left_m").text(motorValues.left_m);
        $("#right_m").text(motorValues.right_m);
        $("#vertical_b").text(motorValues.vertical_b);
        $("#arm").text(motorValues.arm);
    }
}

function buttonPressed(b) {
    if(typeof(b) == "object") {
        return b.pressed;
    }
    return b == 1.0;
}