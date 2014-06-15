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
  $rootScope.formats = [
    "JSON", "HTML", ".xhtml", ".html(5)", "Slidy slideshows (HTML)",
    "reveal.js", "Slideous", "S5", "DZSlides",
    ".docx", ".doc", ".odt", ".xml", ".epub (v2)",
    // ".epub (v3)", "FictionBook2", "DocBook", "GNU TexInfo",
    // "Groff man pages", "Haddock markup", "InDesign ICML",
    ".OPML", ".LaTeX", "ConTeXt", "Beamer slides",
    // ".pdf", ".md", ".rst", "AsciiDoc", "MediaWiki markup",
    "Emacs Org-Mode", "Textile"
  ];
})

.controller('upload', function($scope, $rootScope, $http, postFile){
  $scope.browseOrUpload   = 'browse';

  $scope.removeFile = function(){
    $scope.browseOrUpload = 'browse';
    $scope.filename = '';
  };

  $scope.$on('fileChange', function(evt, targetFile){
    $scope.browseOrUpload = 'upload';
    $scope.filepath = targetFile;

    var arr = targetFile.split('\\');
    $scope.filename = arr[arr.length - 1];
    $scope.extensions = '["docx", "html"]';
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
        console.log('error!',data)
      });
    }
  };
});
