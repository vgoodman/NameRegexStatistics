
NR.module("Chart.View", function (View, App, Backbone) {
  View.Pie = Backbone.Marionette.ItemView.extend({
    template: Handlebars.compile(""),

    events: {
      "click path": "hover"
    },
    _pieDimensions: {w:300, h: 300},
    _svgDimensions: {w:340, h: 340},
    _arc: null,
    _data: null,
    _pieSVG: null,
    _currentArc: null,
    _arcOver: null,
    onShow: function () {
      this._data = null;
      // total frequency calculation
      this.calculateData();
      this.figureOutDimensions();
      this.pieChart(this._data);
      this.resizeComponents();
      NR.vent.bind("charts"+this.options.type+":legendSelected", _.bind(this.selectPie, this));
      NR.vent.bind("charts"+this.options.type+":legendUnselected", _.bind(this.unselectPie, this));
      NR.vent.bind("charts"+this.options.type+":barsSelected", _.bind(this.updatePie, this));
      NR.vent.bind("charts"+this.options.type+":barsUnselected", _.bind(this.setBackPie, this));
      NR.vent.bind("charts"+this.options.type+":dataChanged", _.bind(this.dataChanged, this));
    },
    dataChanged: function(collection) {
      this.collection = collection;
      this._data = [];
      this.calculateData();
      $("svg", this.options.parentContainerId).remove();
      this.pieChart();
    },
    figureOutDimensions: function() {
      var id = this.options.parentContainerId;
      var parentContainerWidth = parseInt($(id).css("width"));
      if(parentContainerWidth === this._svgDimensions.w){
        return;
      }
      this._svgDimensions.w = parentContainerWidth;
      this._svgDimensions.h = parentContainerWidth;
      this._pieDimensions.w = parentContainerWidth - 30;
      this._pieDimensions.h = parentContainerWidth -30;
      this._pieDimensions.r = Math.min(this._pieDimensions.w, this._pieDimensions.h) / 2;
    },
    resizeComponents: function() {
      var id = this.options.parentContainerId;
      // draw the arcs for the slices
      this._arc = d3.svg.arc()
      .outerRadius(this._pieDimensions.r - 10)
      .innerRadius(0);
      this._arcOver = d3.svg.arc()
      .outerRadius(this._pieDimensions.r + 5);
      this._pieSVG.selectAll("g.slice").select("path")
      .attr("d", this._arc);
      d3.select(id).select("svg")
      .attr("width", this._svgDimensions.w)
      .attr("height", this._svgDimensions.h);
      d3.select(id).select("g")
      .attr("transform", "translate("+(this._svgDimensions.w/2)+","+(this._svgDimensions.h/2)+")");
    },
    calculateData: function() {
      this._data = _.map(this.collection.models, function(model) {
        return {type:model.attributes.name, freq:model.attributes.count};
      });
    },
    //Create pie chart
    pieChart: function(){
      var segmentColor =  this.options.segmentColors;
      var id = this.options.parentContainerId;
      // svg for pie chart
      this._pieSVG = d3.select(id).append("svg")
      .append("g");

      // figure out pie angles for slices
      this.pie = d3.layout.pie()
      .sort(null)
      .value(function(data) { return data.freq; });

      this.resizeComponents();
      var arcs = this._pieSVG.selectAll("g.slice")
      .data(this.pie(this._data))
      .enter()
      .append("g")
      .attr("class", "slice")
      .on("mouseover", _.partial(function(self, data, index) {
        NR.vent.trigger("charts"+self.options.type+":sliceSelected", index);
        d3.select(this).select("path").transition()
        .duration(500)
        .delay(100)
        .attr("d", self._arcOver);
        d3.select(".tooltip").transition()
        .duration(500)
        .style("opacity", 1);
      }, this))
      .on("mouseout", _.partial(function(self, data, index) {
        NR.vent.trigger("charts"+self.options.type+":sliceUnselected", index);
        d3.select(this).select("path").transition()
        .duration(500)
        .delay(100)
        .attr("d", self._arc);
        d3.select(".tooltip").transition()
        .duration(500)
        .style("opacity", 0.0001);
      }, this))
      .on("mousemove", _.bind(function(data, index) {
        d3.select(".tooltip").text(data.data.type + ", " + this.calculatePercentage(data.data, this._data))
        .style("left", (d3.event.pageX - 34) + "px")
        .style("top", (d3.event.pageY - 12) + "px");
      }, this));

      arcs.append("path")
      .attr("fill", function (data, index) { return segmentColor[index]; })
      .attr("d", this._arc)
      .each(function(d) {
        this._currentArc = d;
        window.a = this;
      });

    },
    //Select/unselect pie from legend
    selectPie: function(index) {
      var arcOver = d3.svg.arc()
      .outerRadius(this._pieDimensions.r + 15);
      d3.select(this._pieSVG.selectAll("g.slice")[0][index]).select("path").transition()
      .duration(500)
      .attr("d", arcOver);
    },
    unselectPie: function(index) {
      var arc = this._arc;
      d3.select(this._pieSVG.selectAll("g.slice")[0][index]).select("path").transition()
      .duration(500)
      .attr("d", arc);
    },
    //Update Data based on barchart selection
    update: function(newData){
      this._pieSVG.selectAll("path").data(this.pie(newData)).transition().duration(300)
      .attrTween("d", _.partial(this.arcTween, this));
    },
    // Animating the pie-slice
    arcTween: function(self, arc) {
      var i = d3.interpolate(this._currentArc, arc);
      this._currentArc = i(0);
      return function(t) {
        return self._arc(i(t));
      };
    },
    updatePie: function(index) {
      var newData = _.map(this.collection.models, _.bind(function(model) {
        var segments = model.attributes.segments.models[index].attributes;
        return { type: model.attributes.name, freq:segments.value};
      }, index));
      this.update(newData);
    },
    setBackPie: function(index) {
      this.update(this._data);
    },
    calculatePercentage: function (data, completeData) { // Utility function to compute percentage.
      return d3.format("%")(data.freq / d3.sum(completeData.map(function (v) {
        return v.freq;
      })));
    }
  });
});