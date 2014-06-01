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
var output = __dirname + '/temp/files';

makeDirStructure = function(cb) {
  mkdirp(temp, function (err) {
    if (err) console.error(err)
    else {
      mkdirp(output, function (err) {
        if (err) console.error(err)
      });
    }
  });
  cb();
}

app.post('/upload', function(req, res) {

  var filePath     = req.files.files.path;
  var fileName     = req.files.files.name.split('.')[0];
  var extensions   = req.body.data;

  makeDirStructure(function(err){
    if(err) {
      console.error(err)
    } else {
      console.log('file structure created')
      fs.readFile(filePath, function(err, data){
        if(err){
          console.error(err);
        } else {
          processFile(filePath, data, extensions, fileName, function(){
            res.send('success')
          });
        }
      });
    }
  });
});

var processFile = function(path, data, extensions, name, cb) {
  fs.writeFile(path, data, function(err) {
    if(err) {
      console.log(err);
    } else {

      extensions  = JSON.parse(extensions)
      var arr     = path.split('/');
      var oldName = arr[arr.length-1].split('.')[0]; // string created by fs

      async.each(extensions, function(val){
        jandoc.cmd('-d '+path+ ' -o ' + output +' --write '+ val, function(err){
          fs.rename(output+'/'+oldName+'.'+val, output+'/'+name+'.'+val, function(err){
            if (err) {
              console.error(err);
            }
          });
          console.log('getting in here!')
        });
      }, function(err) {
          if( err ) {
            console.error('A file failed to process');
          } else {
            new targz()
            .compress(output, name+'.tar.gz', function(err){
              if(err) { console.error(err) }
              else {
                deleteDirectories();
                return name+'.tar.gz'
              }
            });
          }
      });
      cb();
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
