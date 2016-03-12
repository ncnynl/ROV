var host = location.hostname;
var img = document.querySelector('#webcam1');
var client = new BinaryClient('ws://' + host + ':9001');
client.on('open', function() {
	console.log('client connected');
	client.send('foo');
});
client.on('stream', function(stream, meta){    
	console.log('Received stream');
	var parts = [];
	stream.on('data', function(data){
	parts.push(data);
});
stream.on('end', function(){
	img.src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
	client.send('foo');
	});
});