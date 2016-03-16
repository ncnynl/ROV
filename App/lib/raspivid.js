var Class     = require('uclass');
var spawn        = require('child_process').spawn;
var util      = require('util');
var Server    = require('./_server');


var RpiServer = new Class({
  Extends : Server,

  options : {
    fps : 24,
    width : 960,
    height : 540
  },

  get_feed : function(){
    var msk = "raspivid -t 0 -o - -w %d -h %d -fps %d";
    var cmd = util.format(msk, this.options.width, this.options.height, this.options.fps);
    console.log(cmd);
    var streamer = spawn('raspivid', ['-t', '0', '-o', '-', '-w', this.options.width, '-h', this.options.height, '-fps', this.options.fps, '-n', '-pf', 'baseline']);
    streamer.on("exit", function(code){
      console.log("Failure", code);
    });

    return streamer.stdout;
  },

});


module.exports = RpiServer;
