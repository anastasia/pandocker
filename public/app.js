angular.module('pd', ['ui.router', 'angularFileUpload'])
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('upload', {
      url: '',
      controller: 'upload',
      templateUrl: 'features/upload/partial.html',
    })

})

.controller('upload', function($scope, $http, $timeout, $upload, getFileTypes){
  $scope.browseOrUpload   = 'browse';
  $scope.extensions       = [];
  $scope.formats          = getFileTypes.all;
  $scope.extensionsPicked = '  ';

  $scope.showName         = function(ext, val, mouse) {
    if(mouse){
      // document.getElementById(ext).innerText = val
    } else {
      document.getElementById(ext).innerText = ext;
    }
  }

  $scope.chooseExtension = function(format) {
    var indexOfExtension = $scope.extensions.indexOf(format);
    if(indexOfExtension < 0){
      $scope.extensions.push(format);
      document.getElementById(format).style.backgroundColor = '#FF9290';
    } else {
      $scope.extensions.splice(indexOfExtension, 1);
      document.getElementById(format).style.backgroundColor = '#E5E5E5';
    }
    if($scope.extensions.length) {
      $scope.extensionsPicked = 'convert to: '+$scope.extensions.join(' + ');
    } else {
      $scope.extensionsPicked = ' ';
    }
  };


  $scope.onFileSelect = function($files) {
    $scope.upload = [];
    $scope.uploadResult = [];
    $scope.selectedFiles = $files;
    $scope.dataUrls = [];
    var singlefileIdx = 0;
    var $file = $files[singlefileIdx];

    var fileReader = new FileReader();
    fileReader.readAsDataURL($files[singlefileIdx]);

    fileReader.onload = function(e) {
      $timeout(function() {
        $scope.dataUrls[singlefileIdx] = e.target.result;

        $scope.browseOrUpload = 'upload';
        $scope.filename = $file.name;
      });
    }
  };

  $scope.start = function(index) {
    $scope.errorMsg = null;
    $scope.upload[index] = $upload.upload({
      url : 'upload',
      method: 'POST',
      data : {
        extensions : JSON.stringify($scope.extensions),
      },
      file: $scope.selectedFiles[index],
    }).then(function(response) {
      console.log('success!', response);
      $scope.uploadResult.push(response.data);
    }, function(response) {
      console.log('error!');
      if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
    })
  };


  $scope.abort = function(index) {
    $scope.upload[index] = null;
    $scope.browseOrUpload = 'browse';
    $scope.filename = '';
  };

})

.service('postFile', function($http, $timeout, $upload) {
  return {
    upload: function(files, extensions) {
      var formData = new FormData();
      // just loading single file now, change this later?
      formData.append('file', files[0]);
      // append extensions here
      formData.append('extensions', extensions);
      $http({
        method: 'POST',
        url: '/upload',
        data: formData,
        headers: {'Content-Type': undefined},
        transformRequest: angular.identity
      }).success(function(data) {
        console.log('success!')
      }).error(function(data){
        console.error('error!',data)
      });
    }
  };
})

.service('getFileTypes', function(){
  return {
    all: {
      'json': "JSON",
      'html': "HyperText Markup Language",
      'html5': "HyperText Markup Language 5",
      'xhtml': "extensible HyperText Markup Language",
      'rst': "reStructuredText",
      'asciidoc': "AsciiDoc",
      'context': "ConTeXt",
      'docbook': "DocBook",
      'docx': "Word docx",
      'dzslides': "DZSlides HTML5 + javascript slide show",
      'epub': "EPUB v2 book",
      'epub3': "EPUB v3",
      'fb2': "FictionBook2 e-book",
      'html': "HyperText Markup Language",
      'html5': "HyperText Markup Language 5",
      'icml': "InDesign ICML",
      'json': "JSON",
      'latex': "LaTex",
      'man': "groff man",
      'markdown': "Extended Markdown",
      'mediawiki': "MediaWiki markup",
      'native': "Native Haskell",
      'odt': "OpenOffice text document",
      'opendocument': "OpenDocument",
      'opml': "OPML",
      'org': "Emacs Org-Mode",
      'plain': "plain text",
      'revealjs': "reveal.js HTML5 + javascript slide show",
      'rst': "reStructuredText",
      'rtf': "rich text format",
      's5': "S5 HTML and javascript slide show",
      'slidy': "Slideous HTML and javascript slide show",
      'texinfo': "GNU Texinfo",
      'textile': "Textile"
    }
  }
});
