NR.module("Main.Controller", function (Controller, App, Backbone, Marionette, $, _) {

  Controller.Analytics = NR.BaseController.extend({
    analytics: function () {
      //Base controller loads the script
      this.loadScript("analytics");
    },
    checkIfDone: function() {
      this.addVisualComponents();
    },
    addVisualComponents: function() {
      //Initialize the views
      var analyticsLayout = new NR.Analytics.Layout.Main({
      });
      App.mainRegion.show(analyticsLayout);
    }
  });
});