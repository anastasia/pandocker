var express         = require("express");
var app             = express();
var port            = 3000;

var jandoc   = require('jandoc');
var fs       = require('fs');
var targz    = require('tar.gz');
var mkdirp   = require('mkdirp');
var rmdir    = require('rimraf');

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.listen(port);

var input  = __dirname + '/temp/input';
var output = __dirname + '/temp/output';

mkdirp(input, function (err) {
  if (err) console.error(err)
  else console.log('input!')
});

mkdirp(output, function (err) {
  if (err) console.error(err)
  else console.log('output!')
});

app.post('/upload', function(req, res) {

  var filePath     = req.files.files.path;
  var fileName     = req.files.files.name.split('.')[0];
  var extensions   = req.body.data;

  fs.readFile(filePath, function(err, data){
    if(err){
       throw err
    } else {
      fileToSendBack = processFile(filePath, data, extensions, fileName);
    }
  });
  res.send('oook then')
});

var processFile = function(path, data, extensions, name) {
  fs.writeFile(path, data, function(err) {
    if(err) {
      console.log(err)
    } else {
      extensions = JSON.parse(extensions)
      for(var i = 0; i < extensions.length; i++) {
        jandoc.cmd('-d '+path+ ' -o ' + output +' --write '+extensions[i]); // write each file in output directory
      }

      var compress = new targz().compress(
                                  output, name+'.tar.gz', function(err){
                                  if(err) throw err;
                                  return name+'.tar.gz';
                                });
    }
  });
  deleteDirectories();
};

var deleteDirectories = function() {
  console.log('WHOA THERE')

  rmdir(__dirname+'/temp', function(err) {
    if(err) throw err
    else {
      console.log('temp dir removed!');
    }
  });
}
