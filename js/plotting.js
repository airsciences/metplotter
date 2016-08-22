(function() {
  if (!Object.mergeDefaults) {
    Object.mergeDefaults = function(args, defaults) {
      var key, key1, merge, val, val1;
      merge = {};
      for (key in defaults) {
        val = defaults[key];
        merge[key] = val;
      }
      for (key1 in args) {
        val1 = args[key1];
        merge[key1] = val1;
      }
      return merge;
    };
  }

}).call(this);

(function() {
  var LinePlot,
    slice = [].slice;

  window.Plotting || (window.Plotting = {});

  window.Plotting.LinePlot = LinePlot = (function() {
    function LinePlot(data, options) {
      var defaults, key, ref, row;
      this.preError = "LinePlot.";
      defaults = {
        debug: true,
        target: null,
        theme: 'default',
        x: {
          variable: null,
          ticks: null,
          format: "%Y-%m-%d %H:%M:%S",
          min: null,
          max: null
        },
        y: {
          variable: null,
          min: null,
          max: null,
          ticks: 5
        },
        transitionDuration: 300,
        color: "rgb(41,128,185)",
        weight: 2,
        axisColor: "rgb(0,0,0)",
        font: {
          weight: 300
        }
      };
      if (options.x) {
        options.x = Object.mergeDefaults(options.x, defaults.x);
      }
      if (options.y) {
        options.y = Object.mergeDefaults(options.y, defaults.y);
      }
      this.options = Object.mergeDefaults(options, defaults);
      this.log = function() {
        var log;
        log = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      };
      if (this.options.debug) {
        this.log = function() {
          var log;
          log = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return console.log(log);
        };
      }
      this.parseDate = d3.timeParse(this.options.x.format);
      this.data = [];
      ref = data.data;
      for (key in ref) {
        row = ref[key];
        this.data[key] = {
          x: this.parseDate(row[this.options.x.variable]),
          y: row[this.options.y.variable]
        };
      }
      this.getDefinition();
    }

    LinePlot.prototype.getDefinition = function() {
      var _, height, margin, preError, width;
      preError = this.preError + "getDefinition():";
      _ = this;
      width = Math.round($(this.options.target).width());
      height = Math.round(width / 2);
      if (this.options.theme === 'minimum') {
        margin = {
          top: Math.round(height * 0.28),
          right: Math.round(width * 0.03),
          bottom: Math.round(height * 0.18),
          left: Math.round(width * 0.03)
        };
      } else {
        margin = {
          top: Math.round(height * 0.07),
          right: Math.round(width * 0.03),
          bottom: Math.round(height * 0.16),
          left: Math.round(width * 0.03)
        };
      }
      if (this.options.theme !== 'minimum') {
        this.options.x.ticks = d3.timeFormat(this.options.x.format);
      }
      this.definition = {
        dimensions: {
          width: width,
          height: height,
          margin: margin
        },
        colorScale: d3.schemeCategory20,
        x: d3.scaleTime().range([margin.left, width - margin.right]),
        y: d3.scaleLinear().range([height - margin.bottom, margin.top])
      };
      this.calculateAxisDims(this.data);
      this.definition.xAxis = d3.axisBottom().scale(this.definition.x);
      this.definition.yAxis = d3.axisLeft().scale(this.definition.y).ticks(this.options.y.ticks);
      return this.definition.line = d3.line().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y(function(d) {
        return _.definition.y(d.y);
      }).curve(d3.curveCatmullRom.alpha(0.5));
    };

    LinePlot.prototype.calculateAxisDims = function(data) {
      var preError, xmax, xmin, ymax, ymin;
      preError = this.preError + "calculateAxisDims()";
      xmin = this.options.x.min === null ? d3.min(data, function(d) {
        return d.x;
      }) : this.parseDate(this.options.x.min);
      xmax = this.options.x.max === null ? d3.max(data, function(d) {
        return d.x;
      }) : this.parseDate(this.options.x.max);
      ymin = this.options.y.min === null ? d3.min(data, function(d) {
        return d.y;
      }) : this.options.y.min;
      ymax = this.options.y.max === null ? d3.max(data, function(d) {
        return d.y;
      }) : this.options.y.max;
      ymin = ymin === ymax ? ymin * 0.8 : ymin;
      ymax = ymin === ymax ? ymax * 1.2 : ymax;
      this.definition.x.min = xmin;
      this.definition.x.max = xmax;
      this.definition.y.min = ymin;
      return this.definition.y.max = ymax;
    };

    LinePlot.prototype.responsive = function() {
      var dim, preError;
      preError = this.preError + "responsive()";
      return dim = {
        width: $(window).width(),
        height: $(window).height()
      };
    };

    LinePlot.prototype.append = function() {
      var _, innerHeight, innerWidth, preError;
      preError = this.preError + "append()";
      _ = this;
      this.log("" + preError, this.options);
      innerHeight = parseInt(this.definition.dimensions.height - this.definition.dimensions.margin.bottom);
      innerWidth = parseInt(this.definition.dimensions.margin.left);
      this.svg = d3.select(this.options.target).append("svg").attr("class", "line-plot").attr("width", this.definition.dimensions.width).attr("height", this.definition.dimensions.height);
      this.definition.x.domain([this.definition.x.min, this.definition.x.max]);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      this.svg.append("g").attr("class", "line-plot-axis-x").attr("transform", "translate(0, " + innerHeight + ")").style("fill", "none").style("stroke", this.options.axisColor).call(this.definition.xAxis);
      if (this.options.theme !== 'minimum') {
        this.svg.select(".line-plot-axis-x").selectAll("text").style("font-weight", this.options.font.weight);
      }
      this.svg.append("g").attr("class", "line-plot-axis-y").attr("transform", "translate(" + innerWidth + ", 0)").style("fill", "none").style("stroke", this.options.axisColor).call(this.definition.yAxis);
      return this.svg.selectAll(".line-plot-path").data(this.data).append("path").attr("d", this.definition.line).attr("class", "line-plot-path").style("stroke", this.options.color).style("stroke-width", this.options.weight).style("fill", "none");
    };

    LinePlot.prototype.update = function(data) {
      var _, key, preError, row, update;
      preError = this.preError + "update()";
      _ = this;
      update = [];
      for (key in data) {
        row = data[key];
        update[key] = {
          x: this.parseDate(row[this.options.x.variable]),
          y: row[this.options.y.variable]
        };
      }
      this.calculateAxisDims(data);
      this.definition.x.domain([this.definition.x.min, this.definition.x.max]);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      this.svg.select(".line-plot-axis-x").transition().duration(this.options.transitionDuration).call(this.definition.xAxis);
      this.svg.select(".line-plot-axis-y").transition().duration(this.options.transitionDuration).call(this.definition.yAxis);
      return this.svg.select(".line-plot-path").transition().duration(this.options.transitionDuration).attr("d", this.definition.line(this.data));
    };

    return LinePlot;

  })();

}).call(this);

(function() {
  var Handler;

  window.Plotting || (window.Plotting = {});

  window.Plotting.Handler = Handler = (function() {
    function Handler(access, options, plots) {
      this.endpoint = null;
      access = {
        token: null,
        expires: null,
        expired: true
      };
      this.hasAccess = function() {
        var now;
        now = new Date;
        if (access.expires < now) {
          access.expired = true;
        }
        if (access.expired) {
          return false;
        } else {
          return true;
        }
      };
    }

    Handler.prototype.alert = function(message, type) {};

    Handler.prototype.getTemplate = function() {};

    Handler.prototype.append = function() {};

    return Handler;

  })();

}).call(this);
