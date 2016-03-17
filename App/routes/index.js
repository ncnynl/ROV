module.exports = function(io) {
	var express = require('express');
	var router = express.Router();
	// var fs = require("fs");
	// var spawn = require('child_process').spawn;

	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.render('index');
	});

	// router.get('/stream.mp4', function(req, res, next) {
	// 	var file = "/tmp/stream/vid.mp4";
	// 	var total = stats.size;
	// 	var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
	// 	var chunksize = (end - start) + 1;

	// 	var arguments = "-t 0 -w 1280 -h 720 -hf -ih -fps 20 -o -"
	// 	var child = spawn('raspivid', arguments);

	// 	res.writeHead(206, {
	// 		"Content-Range": "bytes " + start + "-" + end + "/" + total,
	// 		"Accept-Ranges": "bytes",
	// 		"Content-Length": chunksize,
	// 		"Content-Type": "video/mp4"
	// 	}); 

	// 	child.stdout.on("open", function() {
	// 		child.stdout.pipe(res);
	// 	}).on("error", function(err) {
	// 		res.end(err);
	// 	});
	// });

	return router;
};


