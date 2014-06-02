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

.directive('pdFileUpload', function(){
  return {
    restrict: 'A',
    scope: {
      filename : '='
    },
    template: '<div id="test">{{filename || "somefile"}}</div>' +
    '<input type="file" id="myFile"/>'+ 
    '<button id="fileButton">{{buttonName}}</button>',
    link : function($scope, $element, scope, element, attributes) {
            $element.bind('change', function() {
              $scope.filename = 'hi there';
              console.log($scope, scope)
              console.log("change !");
            });
            $element.on('change', function() {
              $scope.filename = 'woo';

            })
        },
    // controller: function($scope, $element){
    //   $scope.buttonName = 'browse';
    //   $scope.fileNameChanged = function(){
    //     $scope.filename = document.getElementById('myFile').value;
    //     $scope.$broadcast('filenameChanged')
    //     console.log($scope.filename)
    //   }

    //   $element.on('change', function(e){
    //     $scope.filename = document.getElementById('myFile').value;
    //     console.log('changing name!')
    //     $scope.$emit('filenameChanged');
    //   })
    // },
  };
})

.controller('upload', function($scope, $rootScope, $fileUploader){
  $scope.formats = $rootScope.formats;
  $scope.$on('filenameChanged', function(e) {
    $scope.filename = document.getElementById('myFile').value;
  });
})
        // $scope.buttonName = 'upload';
