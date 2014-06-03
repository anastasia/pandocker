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

.controller('upload', function($scope, $rootScope, $fileUploader){
  $scope.$on('fileChange', function(evt, fileName){
    $scope.filename = fileName;
  });
})

.directive('pdFileUpload', function(){
  return {
    restrict: 'A',
    template: '<input type="file" id="myFile"/>',
    link: function(scope, element, attrs) {
          element.on('change', function(evt, fileName){
            scope.$broadcast('fileChange', evt.target.value);
            scope.$digest();
          });
        },
  };
})