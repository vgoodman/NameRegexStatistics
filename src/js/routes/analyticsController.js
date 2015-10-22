NR.module("Main.Controller", function (Controller, App, Backbone, Marionette, $, _) {

  Controller.Analytics = NR.BaseController.extend({
    dataFetched: false,
    script: "analytics",
    data: {},
    analytics: function () {
      //Base controller loads the script
      this.loadScript("analytics");
      //Load Data
      this.data.yearCollection = new NR.Model.AnalyticsCollection();
      this.data.yearCollection.fetch({
        success: _.bind(function() {
          this.dataFetched = true;
          this.checkIfDone();
        }, this)
      });
    },
    checkIfDone: function() {
      //scriptFetched is set in BaseController
      if(this.scriptFetched[this.script] && this.dataFetched) {
        this.addVisualComponents();
      }
    },
    addVisualComponents: function() {
      //Initialize the views
      var collection = this.data.yearCollection;
      var analyticsLayout = new NR.Analytics.Layout.Main({
        collection: collection
      });
      App.mainRegion.show(analyticsLayout);
      var amountColors = collection.length;
      if(amountColors === 0) {
        amountColors = 5;
      }
      var colors =  NR.HelperFunctions.generateColors(amountColors);
      var type = "mock";

      var bars = new NR.Chart.View.Bars({
        collection: collection,
        segmentColors: colors,
        type: type,
        parentContainerId: "#"+type+"-bars"
      });
      analyticsLayout.bars.show(bars);
      var pie = new NR.Chart.View.Pie({
        collection: collection,
        segmentColors: colors,
        type: type,
        parentContainerId: "#"+type+"-pie"
      });
      analyticsLayout.pie.show(pie);
      var legend = new NR.Chart.View.Legend({
        collection: collection,
        segmentColors: colors,
        type: type,
        parentContainerId: "#"+type+"-legend"
      });
      analyticsLayout.legend.show(legend);
    }
  });
});
