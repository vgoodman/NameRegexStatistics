NR.module("Model", function (Model, App, Backbone) {
  Model.Segment = Backbone.AssociatedModel.extend({
    defaults: {
      key: "",
      value: ""
    }
  });
  Model.Segments = Backbone.Collection.extend({
    model: Model.Segment
  });
  Model.Analytics = Backbone.AssociatedModel.extend({
    relations: [
      {
        type: Backbone.Many,
        key: "segments",
        relatedModel: Model.Segment,
        collectionType: Model.Segments
      }
    ],
    defaults: {
      count: 0,
      id: 0,
      name: ""
    }
  });
  Model.AnalyticsCollection = Backbone.Collection.extend({
    model: Model.Analytics,
    url:function() {
      return "/mockData.json";
    }
  });
});
