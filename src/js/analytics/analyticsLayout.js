NR.module("Analytics.Layout", function (Layout, App, Backbone) {
  //Really basic view so far
  Layout.Main = Backbone.Marionette.LayoutView.extend({
    template: NRTemplates.Analytics.AnalyticsLayout,
    regions: {
      "bars": "#mock-bars",
      "pie": "#mock-pie",
      "legend": "#mock-legend",
    },
    events: {
      "click .fa-search": "search",
      "keypress input#search-name": "search"
    },
    search: function(e) {
      if ( e.which !== 13 && e.which !== 1) {
        return;
      }
      this.filterData = {
        q: $("input#search-name").val()
      };
      this.collection.fetch({
        url:"/mockData2.json",
        data: this.filterData,
        success: _.bind(function() {
          NR.vent.trigger("chartsmock:dataChanged", this.collection, "mock");
        }, this)
      });
    }
  });
});
