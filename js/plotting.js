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
      var defaults;
      this.preError = "LinePlot.";
      defaults = {
        debug: true,
        target: null,
        theme: 'default',
        x: {
          ticks: null,
          format: "%Y-%m-%d %H:%M:%S"
        },
        axisColor: "rgb(0,0,0)"
      };
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
      this.getDefinition();
    }

    LinePlot.prototype.getDefinition = function() {
      var colorScale, height, margin, preError, width;
      preError = this.preError + "getDefinition():";
      width = Math.round($(this.options.target).width());
      height = Math.round(width / 4);
      if (this.options.theme === 'minimum') {
        margin = {
          top: height * 0.28,
          right: width * 0.03,
          bottom: height * 0.18,
          left: width * 0.03
        };
      } else {
        margin = {
          top: height * 0.07,
          right: width * 0.03,
          bottom: height * 0.07,
          left: width * 0.03
        };
      }
      this.log(preError + " (margin):", margin);
      if (this.options.theme !== 'minimum') {
        this.options.x.ticks = d3.timeFormat(this.options.x.format);
      }
      if (this.options.theme === 'airsci') {

      } else {
        colorScale = d3.schemeCategory20;
      }
      return this.definition = {
        dimensions: {
          width: width,
          height: height,
          margin: margin
        },
        colorScale: colorScale,
        x: d3.time.scale().range([margin.left, width - margin.right]),
        y: d3.scale.linear().range([height - margin.bottom, margin.top])
      };
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
      var _, preError;
      preError = this.preError + "append()";
      _ = this;
      this.log("" + preError, this.options);
      this.svg = d3.select(this.options.target).append("svg").attr("class", "line-plot").attr("width", this.definition.dimensions.width).attr("height", this.definition.dimensions.height);
      this.svg.append("g").attr("class", "line-plot-axis-x").attr("transform", "translate(0, " + (parseFloat(innerHeight)) + ")").style("fill", "none").stroke("stroke", this.options.axisColor).call(this.definition.xAxis);
      if (this.options.theme !== 'minimum') {
        return this.svg.select(".line-plot-axis-x").selectAll("text").style("font-weight", this.options.font.weight);
      }
    };

    LinePlot.prototype.update = function(data) {};

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
          return access.expired = true;
        }
      };
    }

    Handler.prototype.alert = function(message, type) {};

    return Handler;

  })();

}).call(this);
