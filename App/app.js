var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();
var server = app.listen(8080);
var io = require("socket.io")(server);
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

//serialport setup
var portname = '/dev/ttyACM0'; //needs port name
var port = new SerialPort(portname, {
    baudRate: 9600,
    parser: serialport.parsers.readline('\n')
});

var temp;
//assigns incoming temperature data to temp variable
port.on('data', (data)=> {
    temp = data;
});

port.on('error', (err)=> {
    console.log("Error: " + err);
})
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

//socket.io connection
io.on('connection', function (socket) {
    console.log('user has connected');
    //send motor values to arduino
    socket.on('onChange', function (values) {
        port.write(`${values['vertical_f']},${values['vertical_b']},${values['left_m']},${values['right_m']},${values['arm']}`);
    });
    //continuously send sensor data to client
    setInterval(()=> {
        io.emit('sensorData', temp);
    }, 1000);
});


module.exports = app;
