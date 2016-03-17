var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var socket_io = require("socket.io");

// Express
var app = express();
//var server = app.listen(3000);

// Socket.io
var io = socket_io();
app.io = io;

// Routes
var routes = require('./routes/index')(io);
var users = require('./routes/users');

var SerialPort = require('serialport').SerialPort;

//serialport setup
var portname = '/dev/ttyACM0'; //needs port name
// var portname = '/dev/cu.usbmodem1411';
var serialPort = new SerialPort(portname, {
    baudRate: 115200,
    //parser: serialport.parsers.readline('\n'),
}, false); // do not open immediately

var temp;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var motorValues = {
    vertical_f: 0,
    left_m: 0,
    right_m: 0,
    vertical_b: 0,
    arm: 0
}

//socket.io connection
io.on('connection', function (socket) {
    console.log('user has connected');
    //send motor values to arduino
    socket.on('onChange', function (values) {
        motorValues = values;
        // port.write(`${values['vertical_f']} ${values['vertical_b']} ${values['left_m']} ${values['right_m']} ${values['arm']}`);
        // console.log(values);
    });
    serialPort.open(function(error) {
        if(error) {
            console.log('failed to open serial port: '+error);
        } else {
            console.log("connected to arduino");
            setInterval(()=> {
                var out = "<"+motorValues['vertical_b'].toString()+">\n";
                serialPort.drain(function() {
                    serialPort.write(out, function() {
                        console.log(out);
                    });
                });
            }, 100);

            //continuously send sensor data to client
            setInterval(()=> {
                io.emit('sensorData', temp);
            }, 1000);

            //assigns incoming temperature data to temp variable
            serialPort.on('data', (data)=> {
                temp = data;
                console.log(temp.toString('ascii'));
            });

            serialPort.on('error', (err)=> {
                console.log("Error: " + err);
            });
        }
    });
    // continuosly write data to arduin  
});


module.exports = app;
