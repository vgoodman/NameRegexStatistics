NR.module('Main', function (Main, App, Backbone, Marionette, $, _) {

  Main.Router = Marionette.AppRouter.extend({
    initialize: function(controller) {
      this.controller = controller.controller;
    }
  });
});
