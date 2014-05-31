angular.module('pd', ['ui-router'])
.config(function($stateProvider){
  $stateProvider
    .when('upload', {
      url: '',
      controller: 'upload',
      template: '',
    })
    .when('download', {
      url: 'download',
      controller: 'download',
      template: '',
    })
})
.run(function($rootScope) {
  $rootScope.formats = [
    "XHTML", "HTML5", "HTML slideshows with Slidy",
    "reveal.js", "Slideous", "S5", "DZSlides",
    "Microsoft Word docx", "OpenOffice/LibreOffice ODT",
    "OpenDocument XML", "EPUB v2", "EPUB v3",
    "FictionBook2", "DocBook", "GNU TexInfo",
    "Groff man pages", "Haddock markup", "InDesign ICML",
    "OPML", "LaTeX", "ConTeXt", "LaTeX Beamer slides",
    "via LaTeX", "Markdown", "reStructuredText",
    "AsciiDoc", "MediaWiki markup", "Emacs Org-Mode",
    "Textile", "Can be written in lua",
  ]
})
.controller('upload', function(){

})
.controller('download', function(){

})
