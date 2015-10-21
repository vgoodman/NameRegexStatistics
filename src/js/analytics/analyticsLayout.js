NR.module("Analytics.Layout", function (Layout, App, Backbone) {
//Really basic view so far
  Layout.Main = Backbone.Marionette.LayoutView.extend({
    template: NRTemplates.Analytics.AnalyticsLayout,
    regions: {
    },
    events: {
    },
    initialize: function() {
    },
    onShow: function() {
    }
  });
});