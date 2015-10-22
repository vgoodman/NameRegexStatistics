NR.BaseController = Marionette.Controller.extend({
  scriptFetched: {},
  controller: {},

  loadScript: function(module, secondController) {
    var moduleName = module.toLowerCase();
    var success = _.bind(function() {
      this.scriptFetched[this.script] = true;
      this.checkIfDone();
    }, this);
    if(!this.scriptFetched[this.script]) {
      var url = globals.js[moduleName]||"js/"+moduleName+".js";
      var error = _.bind(function() {
        var options = {
          text: "An error occurred when loading script. Try clearing your browser cache and reloading the site.",
          type: "error"
        };
        NR.vent.trigger("warning:showWarning", options);
      });
      $.getScript(url, success, error);
      var cssUrl = globals.css[moduleName]||"css/"+moduleName+".css";
      var cssLink = $("<link rel='stylesheet' type='text/css' href='"+cssUrl+"'>");
      $("head").append(cssLink);
    }
    else {
      success();
    }
  }
});
