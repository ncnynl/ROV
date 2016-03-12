//Joystick / Keyboard
//0-1023
//{
//    left_m:
//    right_m:
//    vertical_f:
//    vertical_b:
//    arm:
//}
// Events: onChange, sensorData
// continually receive sensor data from server
$(function() {
    var socket = io.connect('http://localhost')
    socket.on('sensorData', function(temp) {

    })
});