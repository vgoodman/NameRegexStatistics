
NR.module("Main.Controller", function (Controller, App, Backbone, Marionette, $, _) {
  //This function allows me to have a separate controller for each module
  //It creates a controller for each module and ties it to its router
  NR.Main.addInitializer(function () {
    _.each(NR.modules, function (module) {
      if(!NR.Main.Controller[module]) {
        return;
      }
      var controller = new NR.Main.Controller[module]();
      NR.router = new NR.Main.Router[module]({
        controller: controller
      });
    });
    Backbone.history.start();
  });
});
