
NR.module("Chart.View", function (View, App, Backbone) {
  View.Legend = Backbone.Marionette.ItemView.extend({
    template: Handlebars.compile(""),

    events: {
      "click .close-popUp-button": "hideModal",
      "click #warning-cancel-button": "cancel",
      "click #warning-proceed-button": "proceed"
    },
    _legend: null,
    _data: [],
    initialize: function() {
      NR.vent.bind("charts"+this.options.type+":sliceSelected", _.bind(this.selectLegend, this));
      NR.vent.bind("charts"+this.options.type+":sliceUnselected", _.bind(this.unselectLegend, this));
      NR.vent.bind("charts"+this.options.type+":barsSelected", _.bind(this.updateLegend, this));
      NR.vent.bind("charts"+this.options.type+":barsUnselected", _.bind(this.setBackLegend, this));
      NR.vent.bind("charts"+this.options.type+":dataChanged", _.bind(this.dataChanged, this));
    },
    onShow: function () {
      this.calculateData();
      this.createLegend();
    },
    dataChanged: function(collection) {
      this.collection = collection;
      this.calculateData();
      $("table", this.options.parentContainerId).remove();
      this.createLegend();
    },
    calculateData:function() {
      this._data = [];
      var array = _.map(this.collection.models,
        function(model){
          return model.attributes.segments.models;
        }
      );
      var sumCollection = function(a){
        return a.attributes.value;
      };
      for(var i = 0; i<array.length; i++) {
        var sumArray = _.map(array[i], _.bind(sumCollection, i));
        var sum = NR.HelperFunctions.sumArray(sumArray);
        this._data.push({type:this.collection.models[i].attributes.name, freq:sum});
      }
    },
    createLegend: function () {
      var segmentColor =  this.options.segmentColors;
      var id = this.options.parentContainerId;
      var parentContainerWidth = parseInt($(id).css("width"));

      // create the table
      this._legend = d3.select(id).append("table")
        .attr("style", "width:"+ (parentContainerWidth - 10) +"px;");

      // create a row per segment
      var tr = this._legend.append("tbody")
        .selectAll("tr")
        .data(this._data)
        .enter()
        .append("tr");

      // create first column
      tr.append("td")
        .attr("class", "legendColor")
        .append("svg")
        .attr("width", "16")
        .attr("height", "16")
        .append("rect")
        .attr("width", "16")
        .attr("height", "16")
        .attr("fill", function (data, index) {
          return segmentColor[index];
        });
      this._legend.selectAll("tr")
        .on("mouseover", _.partial(function(self, data, index) {
          NR.vent.trigger("charts"+self.options.type+":legendSelected", index);
          $(this).addClass("highlighted");
        }, this))
        .on("mouseout", _.partial(function(self, data, index) {
          NR.vent.trigger("charts"+self.options.type+":legendUnselected", index);
          $(this).removeClass("highlighted");
        }, this));
      // create second column
      tr.append("td")
        .attr("class", "legendName")
        .attr("title", function (data) {
          return data.type;
        })
        .append("div")
        .attr("style", "width:"+(parentContainerWidth-170))
        .text(function (data) {
          return data.type;
        });

      // create third column
      tr.append("td")
        .attr("class", "legendFrequency")
        .text(function (data) {
          return d3.format(",")(data.freq);
        });

      // create fourth column
      tr.append("td")
        .attr("class", "legendPercent")
        .text(_.bind(function (data) {
          return this.calculatePercentage(data, this._data);
        }, this));
    },
    update: function (newData) {
      // update the data
      var legend = this._legend.select("tbody").selectAll("tr").data(newData);
      this._data = newData;
      // update the frequency
      legend.select(".legendFrequency").text(_.bind(function (data) {
        return d3.format(",")(data.freq);
      }, this));

      // update the percentage
      legend.select(".legendPercent").text(_.bind(function (data) {
        return this.calculatePercentage(data, newData);
      }, this));
    },
    calculatePercentage: function (data, completeData) {
      return d3.format("%")(data.freq / d3.sum(completeData.map(function (v) {
        return v.freq;
      })));
    },
    selectLegend: function(index) {
      $(this._legend.select("tbody")
        .selectAll("tr")[0][index])
        .addClass("light-orange-bg");

    },
    unselectLegend: function(index) {
      $(this._legend.select("tbody")
        .selectAll("tr")[0][index])
        .removeClass("light-orange-bg");
    },
    updateLegend: function(index) {
      var legendData = _.map(this.collection.models, _.bind(function(model) {
        var segments = model.attributes.segments.models[index].attributes;
        return { type: model.attributes.title, freq:segments.value};
      }, index));
      this.update(legendData);
    },
    setBackLegend: function(index) {
      this.update(this._data);
    }
  });
});
