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
    ".xhtml", ".html(5)", "Slidy slideshows (HTML)",
    "reveal.js", "Slideous", "S5", "DZSlides",
    ".docx", ".doc", ".odt", ".xml", ".epub (v2)",
    ".epub (v3)", "FictionBook2", "DocBook", "GNU TexInfo",
    "Groff man pages", "Haddock markup", "InDesign ICML",
    ".OPML", ".LaTeX", "ConTeXt", "Beamer slides",
    ".pdf", ".md", ".rst", "AsciiDoc", "MediaWiki markup",
    "Emacs Org-Mode", "Textile"
  ];
})

.controller('upload', function($scope, $rootScope, $http, $postFile){
  $scope.$on('fileChange', function(evt, targetFile){
    $scope.filename = targetFile.value;
    $scope.files = [];
    $scope.extensions = '["docx", "html"]'
    // refactor needed
    if(targetFile.files){
      for(var i = 0; i < targetFile.files.length; i++) {
        if(typeof targetFile.files[i] === 'object') {
          $scope.files.push(targetFile.files[i]);
        }
      }
      $postFile.upload($scope.files,$scope.extensions);
    }
  });
})

.directive('pdFileUpload', function(){
  return {
    restrict: 'A',
    template: '<input type="file" id="myFile"/>',
    link: function(scope, element, attrs) {
          element.on('change', function(evt, fileName){
            scope.$broadcast('fileChange', evt.target);
            scope.$digest();
          });
        },
  };
})

.service('$postFile', function($http){
  this.upload = function(files, extensions) {
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
  };
})