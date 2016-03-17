//Joystick / Keyboard
//0-1023
//
$(function() {
    var socket = io.connect('http://localhost:8080') //Enter valid network IP
    socket.on('sensorData', function(temp) {
        $('.tempData').val(temp)
    })
    $('#dataInp').keypress(function(evt) {
        if (evt.which == 13) { //Enter Key
            payload = {}
            $(this).children().each(function() {
                payload[$(this).attr('id')] = $(this).val()
            })
            socket.emit('onChange', payload)
        }
    })
});