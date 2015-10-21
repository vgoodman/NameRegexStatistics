//Create application
Backbone.Marionette.$ = $;
var NR = new Backbone.Marionette.Application();

NR.addRegions({
  mainRegion: "#centered-content"
});

NR.modules = [
  "Analytics"
];

if(typeof globals === 'undefined') {
  var globals = {};
}
globals.js = globals.js || {};
globals.css = globals.css || {};
