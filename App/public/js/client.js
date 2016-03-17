//Joystick / Keyboard
//0-1023
//

var socket;

var motorValues = {
    vertical_f: 0,
    left_m: 0,
    right_m: 0,
    vertical_b: 0,
    arm: 0
}

var tmpValues = {
    vertical_f: 0,
    left_m: 0,
    right_m: 0,
    vertical_b: 0,
    arm: 0
}

$(document).ready(function() {
    socket = io.connect('http://192.168.0.103:3000'); //Enter valid network IP
    console.log("is this running?");
    socket.on('connect', function() {
        console.log("connected to server");
        window.setInterval(motorController, 10);
    });
    socket.on('sensorData', function(temp) {
        $('.tempData').val(temp);
    })

});

function motorController() {
    
    var changed = false
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads) {
        return;
    }
    var gp = gamepads[0];
    tmpValues.left_m = (gp.axes[1] * 100).toFixed(2)*-1;
    tmpValues.right_m = (gp.axes[3] * 100).toFixed(2)*-1;

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
    if(changed) {
        socket.emit('onChange', motorValues);
    }
    $("#vertical_f").text(motorValues.vertical_f);
    $("#left_m").text(motorValues.left_m);
    $("#right_m").text(motorValues.right_m);
    $("#vertical_b").text(motorValues.vertical_b);
}

function buttonPressed(b) {
    if(typeof(b) == "object") {
        return b.pressed;
    }
    return b == 1.0;
}