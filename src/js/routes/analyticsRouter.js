NR.module("Main", function (Main, App, Backbone, Marionette, $, _) {

  Main.Router.Analytics = Marionette.AppRouter.extend({
    appRoutes: {
      "": "analytics",
      "analytics": "analytics",
      "analytics/": "analytics"
    }
  });
});
