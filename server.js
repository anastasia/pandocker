var express       = require("express");
var app           = express();
var port          = 3000;

var targz    = require('tar.gz');
var async    = require('async');
var jandoc   = require('jandoc');
var fs       = require('fs');
var mkdirp   = require('mkdirp');
var rmdir    = require('rimraf');

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.listen(port);

var temp   = __dirname + '/temp';
var output = temp + '/files';

app.post('/upload', function(req, res) {
  var filePath     = req.files.files.path;
  var fileName     = req.files.files.name.split('.')[0];
  var extensions   = req.body.data;
  var tmpDirectory = temp + '/' + fileName;

  async.waterfall([
    function(cb){
      mkdirp(tmpDirectory, cb);

    }, function(made, cb){
      fs.readFile(filePath, cb);

    }, function(fileContents, cb){
      processFile(filePath,
                  fileContents,
                  extensions,
                  fileName,
                  cb);

    }], function(err){
      if (err) { console.error('shit\'s crazy!') }
      res.send('success');

    });
});

var processFile = function(path, data, extensions, name, cb) {
  fs.writeFile(path, data, function(err) {
    if (err) { console.log(err); }
    else {
      extensions  = JSON.parse(extensions);
      var arr     = path.split('/');
      var oldName = arr[arr.length-1].split('.')[0]; // string created by fs

      async.each(extensions, function(val, cb){
        jandoc.cmd( '-d ' + path + ' -o ' + output + ' --write ' + val,
                    function(err){
                      fs.rename(output + '/' + oldName + '.' + val,
                                output + '/' + name    + '.' + val,
                                cb);
                    }
        );
      }, function(err) {
          if( err ) { console.error('A file failed to process'); }
          else {
            new targz().compress(
              output,
              name+'.tar.gz',
              function(err){
                deleteDirectories();
                cb(err, name+'.tar.gz');
              }
            );
          }
      });
    }
  });
};

var deleteDirectories = function() {
  rmdir(__dirname+'/temp', function(err) {
    if(err) {
      console.error(err)
    }
    console.log('temp dir removed!');
  });
}
