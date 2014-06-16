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

.run(function($rootScope) {
})

.controller('upload', function($scope, $rootScope, $http, postFile, getFileTypes){
  $scope.browseOrUpload   = 'browse';
  $scope.extensions       = [];
  $scope.formats          = getFileTypes.all
  $scope.extensionsPicked = '  '
  $scope.showName         = function(ext, val, mouse) {
    if(mouse){
      // document.getElementById(ext).innerText = val
    } else {
      document.getElementById(ext).innerText = ext
    }
  }
  $scope.chooseExtension = function(format) {
    var indexOfExtension = $scope.extensions.indexOf(format)
    if(indexOfExtension < 0){
      $scope.extensions.push(format);
      document.getElementById(format).style.backgroundColor = '#FF9290';
    } else {
      $scope.extensions.splice(indexOfExtension, 1);
      document.getElementById(format).style.backgroundColor = '#E5E5E5';
    }
    if($scope.extensions.length) {
      $scope.extensionsPicked = 'convert to: '+$scope.extensions.join(' + ')
    } else {
      $scope.extensionsPicked = ' '
    }
  };



  $scope.removeFile = function(){
    $scope.browseOrUpload = 'browse';
    $scope.filename = '';
  };

  $scope.$on('fileChange', function(evt, targetFile){
    $scope.browseOrUpload = 'upload';
    $scope.filepath = targetFile;

    var arr = targetFile.split('\\');
    $scope.filename = arr[arr.length - 1];

    extensions = JSON.stringify($scope.extensions);
    if(targetFile.files){
      for(var i = 0; i < targetFile.files.length; i++) {
        if(typeof targetFile.files[i] === 'object') {
          $scope.files.push(targetFile.files[i]);
        }
      };
      if($scope.fileExists){
        postFile.upload($scope.files,extensions);
      }
    }
  });
})

.directive('pdFileUpload', function(postFile){
  return {
    restrict: 'A',
    template: '<input type="file" width="30px" id="hiddenFileUpload" ng-show="!filename"/>'+
              '<input type="submit" id="submit" ng-model="fileExists" ng-value="browseOrUpload"/>',
    link: function(scope, element, attrs) {

      element.on('change', function(evt, fileName){
        scope.$broadcast('fileChange', evt.target.value);
        scope.$digest();
      });

      element.on('click', function(evt){
        if (!!scope.filename){
          postFile.upload(scope.filepath, scope.extensions);
        }
      });

    }
  };
})

.service('postFile', function($http) {
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
