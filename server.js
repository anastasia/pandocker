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
// test commit
app.post('/upload', function(req, res) {
  console.log(req)
  var filePath     = req.body.file;
  var fileName     = filePath.split('\\')[2];
  var newFileDir   = fileName.replace(/ /g, '_');
  var extensions   = req.body.extensions;
  var tmpDirectory = temp + '/' + newFileDir;

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
                  tmpDirectory,
                  cb);

    }], function(err, fileName){
      console.log('downloading filename',fileName)
      if (err) { console.error(err) }
      res.download(fileName);
    });
});

var processFile = function(path, data, extensions, name, tempDir, cb) {
  console.log('processFile', name, data, path)
  fs.writeFile(path, data, function(err) {
    if (err) { console.error(err); }
    else {
      extensions  = JSON.parse(extensions);
      var arr     = path.split('/');
      var oldName = arr[arr.length-1].split('.')[0]; // string created by fs

      async.each(extensions, function(val, cb){
        jandoc.cmd( '-d ' + path + ' -o ' + tempDir + ' --write ' + val,
                    function(err){
                      fs.rename(tempDir + '/' + oldName + '.' + val,
                                tempDir + '/' + name    + '.' + val,
                                cb);
                    }
        );
      }, function(err) {
          if( err ) { console.error(err +'\nA file failed to process'); }
          else {
            async.waterfall([
              function(cb){
                new targz().compress( tempDir, name+'.tar.gz', function(err){
                  cb(err, name+'.tar.gz')
                });

              }, function(gzipName, cb){
                deleteDirectories(function(err){
                  cb(err, gzipName);
                });

              },

            ], cb);
          }
      });
    }
  });
};

var deleteDirectories = function(cb) {
  rmdir(temp, cb);
};
