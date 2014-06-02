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
    ".pdf", ".md", ".rst",
    "AsciiDoc", "MediaWiki markup", "Emacs Org-Mode",
    "Textile"
  ];
})
.service('pdFileUpload', function(){
  return {
    filename: 'helloooooo'
  }
})

.controller('upload', function($scope, $rootScope, pdFileUpload) {
  // $scope.formats = $rootScope.formats;
  // $scope.filename = 'hi there';
  // $scope.clicked = function(){

  // }
  // $scope.$on('filenameChanged', function(e) {
  //   $scope.filename = document.getElementById('myFile').value;
  // });
})
