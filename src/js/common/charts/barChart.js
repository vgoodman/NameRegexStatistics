
NR.module("Chart.View", function (View, App, Backbone) {
  View.Bars = Backbone.Marionette.ItemView.extend({
    template: Handlebars.compile(""),

    events: {
      "click .close-popUp-button": "hideModal",
      "click #warning-cancel-button": "cancel",
      "click #warning-proceed-button": "proceed",
      "dataChanged": "proceed"
    },
    _hGsvg: null,
    _hGDim: {t: 60, r: 0, b: 30, l: 0},
    _y: null,
    _x: null,
    _created: false,
    _totals:[],
    initialize: function() {
      NR.vent.bind("charts"+this.options.type+":sliceSelected", _.bind(this.switchBarChart, this));
      NR.vent.bind("charts"+this.options.type+":sliceUnselected", _.bind(this.switchDefault, this));
      NR.vent.bind("charts"+this.options.type+":legendSelected", _.bind(this.switchBarChart, this));
      NR.vent.bind("charts"+this.options.type+":legendUnselected", _.bind(this.switchDefault, this));
      NR.vent.bind("charts"+this.options.type+":dataChanged", _.bind(this.dataChanged, this));
    },
    onShow: function(){
      this.calculateData();
      if(!this._created) {
        this.histoGram(this._totals);
      }
      this._created = true;
    },
    resize: function() {
      var id = this.options.parentContainerId;
      var parentContainerWidth = parseInt($(id).css("width"));
      if(parentContainerWidth < 175) {
        parentContainerWidth = 175;
      }
      this._hGDim.w = parentContainerWidth - this._hGDim.l - this._hGDim.r;
      this._hGDim.h = parentContainerWidth - this._hGDim.t - this._hGDim.b;


      d3.select(id).select("svg")
      .attr("width", this._hGDim.w + this._hGDim.l + this._hGDim.r)
      .attr("height", this._hGDim.h + this._hGDim.t + this._hGDim.b);

      this._x.rangeRoundBands([0, this._hGDim.w], 0.1);
      this._y.range([this._hGDim.h, 0]);
      d3.select(id).select(".x.axis")
      .attr("transform", "translate(0," + this._hGDim.h + ")")
      .call(d3.svg.axis().scale(this._x).orient("bottom"));
      this._hGsvg.selectAll(".bar").select("rect")
      .attr("y", _.bind(function(data) {return this._y(data[1]); }, this))
      .attr("height", _.bind(function(data) { return this._hGDim.h - this._y(data[1]); }, this))
      .attr("x", _.bind(function(data) { return this._x(data[0]); }, this))
      .attr("width", this._x.rangeBand());
      this._hGsvg.selectAll(".bar").select("text")
      .attr("x", _.bind(function(data) { return this._x(data[0])+this._x.rangeBand()/2; }, this))
      .attr("y", _.bind(function(data) { return this._y(data[1])-5; }, this));
    },
    dataChanged: function(collection, type) {
      this.collection = collection;
      this.calculateData(type);
      $("svg", this.options.parentContainerId).remove();
      this.histoGram(this._totals);
    },
    calculateData: function(type) {
      this._totals=[];
      var array = _.map(this.collection.models, function(model){
        return model.attributes.segments.models;
      });
      $("#"+this.options.type+"-bars").text("");
      if(array.length === 0){
        $("#"+this.options.type+"-bars").text("Not enough data");
        return;
      }
      var sumDays = function(a){
        return a[i].attributes.value;
      };

      for(var i = 0; i<array[0].length; i++) {
        var sum = NR.HelperFunctions.sumArray(_.map(array, _.bind(sumDays, i)));
        this._totals.push([this.collection.models[0].attributes.segments.models[i].attributes.key, sum]);
      }
    },
    histoGram: function(frequencyData){

      var id = this.options.parentContainerId;

      //create svg for barchart
      this._hGsvg = d3.select(id).append("svg").append("g")
      .attr("transform", "translate(" + this._hGDim.l + "," + this._hGDim.t + ")");

      // x-axis mapping
      this._x = d3.scale.ordinal().rangeRoundBands([0, this._hGDim.w], 0.1)
      .domain(frequencyData.map(function(data) { return data[0]; }));
      // Add x-axis
      this._hGsvg.append("g").attr("class", "x axis").style("fill", "#F8F8F8");

      // y-axis map
      this._y = d3.scale.linear().range([this._hGDim.h, 0])
      .domain([0, d3.max(frequencyData, function(data) { return parseInt(data[1]); })]);

      // Create bars and frequency labels
      var bars = this._hGsvg.selectAll(".bar").data(frequencyData).enter()
      .append("g").attr("class", "bar");
      var barColor = "#881C5B";
      //create the rectangles.
      bars.append("rect")
      .attr("fill",barColor);

      bars.selectAll("rect")
      .on("mouseover", _.partial(this.mouseOver, this))
      .on("mouseout", _.partial(this.mouseOut, this));

      //Create the frequency labels
      bars.append("text").text(function(data){
        return d3.format(",")(Math.abs(data[1]));
      })
      .attr("text-anchor", "middle").style("fill", "#F8F8F8");
      this.resize();
    },
    mouseOver: function(self, data, a, index) {
      NR.vent.trigger("charts"+self.options.type+":barsSelected", index);
      $(this).attr("fill", "#4E213C");
    },
    mouseOut: function(self, data, a, index) {
      NR.vent.trigger("charts"+self.options.type+":barsUnselected", index);
      $(this).attr("fill", "#881C5B");
    },
    // create function to update the bars
    update: function(newData, color){
      // update the y-axis map to show the change in frequencies
      this._y.domain([0, d3.max(newData, function(data) { return parseInt(data[1]);})]);
      var y = this._y;
      var hGDim = this._hGDim;
      // Attach new data to the bars
      var bars = this._hGsvg.selectAll(".bar").data(newData);

      // change the height and color of the rectangles
      bars.select("rect").transition().duration(500)
      .attr("y", function(data) {return y(data[1]); })
      .attr("height", function(data) { return Math.abs(hGDim.h - y(data[1])); })
      .attr("fill", color);

      // change the frequency labels and value
      bars.select("text").transition().duration(500)
      .text(function(data){ return d3.format(",")(data[1]);})
      .attr("y", function(data) {return y(data[1])-5; });
    },
    switchBarChart: function(index) {
      // call the update function with new data
      var collection = this.collection.at(index);
      var data = _.map(collection.attributes.segments.models, function(model) {
        return [model.attributes.key, model.attributes.value];
      });
      this.update(data, this.options.segmentColors[index]);
    },
    switchDefault: function(index) {
      this.update(this._totals, "#881C5B");
    }
  });
});
