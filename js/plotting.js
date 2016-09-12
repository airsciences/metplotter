(function() {
  var API;

  window.Plotting || (window.Plotting = {});

  window.Plotting.API = API = (function() {
    function API(accessToken) {
      var preError;
      this.preError = "Plotting.API";
      preError = this.preError + ".constructor()";
      this.xhr = null;
      this.async = true;
      this.getAccessToken = function() {
        return accessToken;
      };
    }

    API.prototype.build = function() {
      var error, error1, error2, preError;
      preError = this.preError + ".build()";
      this.xhr = null;
      if (XMLHttpRequest) {
        return this.xhr = new XMLHttpRequest;
      } else {
        try {
          return this.xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (error1) {
          error = error1;
          try {
            return this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (error2) {
            error = error2;
            return console.error(preError, 'Cannot specify XMLHTTPRequest (error)', error);
          }
        }
      }
    };

    API.prototype.get = function(uri, params, callback) {
      var _, args, error, error1, preError;
      preError = this.preError + ".get(uri, params, callback)";
      this.build();
      _ = this;
      if (typeof callback !== 'undefined') {
        this.xhr.onreadystatechange = function() {
          var error, error1, result;
          if (_.xhr.readyState !== 4) {
            return;
          }
          if (_.xhr.status !== 200 && _.xhr.status !== 304) {
            console.log(preError + " HTTP error, (status): " + _.xhr.status);
            _.xhr = null;
            return;
          }
          console.log(preError + " (callback)", callback);
          result = {
            response: _.xhr.response,
            responseText: _.xhr.responseText,
            responseJSON: null
          };
          try {
            result.responseJSON = JSON.parse(result.responseText);
          } catch (error1) {
            error = error1;
            result.responseJSON = null;
          }
          _.xhr = null;
          return callback(result);
        };
      }
      args = this.encodeArgs('GET', args);
      try {
        this.xhr.open('GET', uri + args, this.async);
        this.xhr.setRequestHeader("Authorization", this.getAccessToken());
        this.xhr.send(null);
      } catch (error1) {
        error = error1;
        console.log(preError + 'catch(error).', error);
      }
    };

    API.prototype.put = function() {
      var _, args, error, error1, preError;
      preError = this.preError + ".put(uri, params, callback)";
      this.build();
      _ = this;
      if (typeof callback !== 'undefined') {
        this.xhr.onreadystatechange = function() {
          var error, error1, result;
          if (_.xhr.readyState !== 4) {
            return;
          }
          if (_.xhr.status !== 200 && _.xhr.status !== 304) {
            console.log(preError + " HTTP error, (status): " + _.xhr.status);
            _.xhr = null;
            return;
          }
          console.log(preError + " (callback)", callback);
          result = {
            response: _.xhr.response,
            responseText: _.xhr.responseText,
            responseJSON: null
          };
          try {
            result.responseJSON = JSON.parse(result.responseText);
          } catch (error1) {
            error = error1;
            result.responseJSON = null;
          }
          _.xhr = null;
          return callback(result);
        };
      }
      args = this.encodeArgs('PUT', args);
      try {
        this.xhr.open('PUT', uri, this.async);
        this.xhr.setRequestHeader("Authorization", this.getAccessToken());
        this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.xhr.send(args);
      } catch (error1) {
        error = error1;
        console.log(preError + 'catch(error).', error);
      }
    };

    API.prototype.post = function() {
      var _, args, error, error1, preError;
      preError = this.preError + ".post(uri, params, callback)";
      this.build();
      _ = this;
      if (typeof callback !== 'undefined') {
        this.xhr.onreadystatechange = function() {
          var error, error1, result;
          if (_.xhr.readyState !== 4) {
            return;
          }
          if (_.xhr.status !== 200 && _.xhr.status !== 304) {
            console.log(preError + " HTTP error, (status): " + _.xhr.status);
            _.xhr = null;
            return;
          }
          console.log(preError + " (callback)", callback);
          result = {
            response: _.xhr.response,
            responseText: _.xhr.responseText,
            responseJSON: null
          };
          try {
            result.responseJSON = JSON.parse(result.responseText);
          } catch (error1) {
            error = error1;
            result.responseJSON = null;
          }
          _.xhr = null;
          return callback(result);
        };
      }
      args = this.encodeArgs('POST', args);
      try {
        this.xhr.open('POST', uri, this.async);
        this.xhr.setRequestHeader("Authorization", this.getAccessToken());
        this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.xhr.send(args);
      } catch (error1) {
        error = error1;
        console.log(preError + 'catch(error).', error);
      }
    };

    API.prototype["delete"] = function() {
      var _, args, error, error1, preError;
      preError = this.preError + ".delete(uri, params, callback)";
      this.build();
      _ = this;
      if (typeof callback !== 'undefined') {
        this.xhr.onreadystatechange = function() {
          var error, error1, result;
          if (_.xhr.readyState !== 4) {
            return;
          }
          if (_.xhr.status !== 200 && _.xhr.status !== 304) {
            console.log(preError + " HTTP error, (status): " + _.xhr.status);
            _.xhr = null;
            return;
          }
          console.log(preError + " (callback)", callback);
          result = {
            response: _.xhr.response,
            responseText: _.xhr.responseText,
            responseJSON: null
          };
          try {
            result.responseJSON = JSON.parse(result.responseText);
          } catch (error1) {
            error = error1;
            result.responseJSON = null;
          }
          _.xhr = null;
          return callback(result);
        };
      }
      args = this.encodeArgs('DELETE', args);
      try {
        this.xhr.open('DELETE', uri, this.async);
        this.xhr.setRequestHeader("Authorization", this.getAccessToken());
        this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.xhr.send(args);
      } catch (error1) {
        error = error1;
        console.log(preError + 'catch(error).', error);
      }
    };

    API.prototype.encodeArgs = function(type, json_args) {
      var aCount, argStr, argument, error, error1;
      argStr = "";
      aCount = 0;
      if (typeof json_args === 'string') {
        try {
          json_args = JSON.parse(json_args);
        } catch (error1) {
          error = error1;
          console.log(preError + 'catch(error).', error);
        }
      }
      if (type === 'POST' || type === 'PUT') {
        argStr = JSON.stringify(json_args);
      } else if (type === 'GET') {
        for (argument in json_args) {
          if (aCount === 0) {
            argStr = "?" + argument + "=" + args[argument];
          } else {
            argStr = argStr + "&" + argument + "=" + args[argument];
            aCount++;
          }
        }
      }
      return argStr;
    };

    return API;

  })();

}).call(this);

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
          format: "%Y-%m-%d %H:%M:%S",
          min: null,
          max: null,
          ticks: 7
        },
        y: {
          variable: null,
          ticks: 5,
          min: null,
          max: null
        },
        transitionDuration: 300,
        lineColor: "rgb(41,128,185)",
        weight: 2,
        axisColor: "rgb(0,0,0)",
        font: {
          weight: 200
        },
        crosshairX: {
          weight: 1,
          color: "rgb(149, 165, 166)"
        },
        crosshairY: {
          weight: 1,
          color: "rgb(149, 165, 166)"
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
      var _, preError;
      preError = this.preError + "getDefinition():";
      _ = this;
      if (this.options.theme !== 'minimum') {
        this.options.x.ticks = d3.timeFormat(this.options.x.format);
      }
      this.definition = {};
      this.calculateChartDims();
      this.definition.colorScale = d3.schemeCategory20;
      this.calculateAxisDims(this.data);
      this.definition.xAxis = d3.axisBottom().scale(this.definition.x).ticks(Math.round($(this.options.target).width() / 100));
      this.definition.yAxis = d3.axisLeft().scale(this.definition.y).ticks(this.options.y.ticks);
      return this.definition.line = d3.line().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y(function(d) {
        return _.definition.y(d.y);
      }).curve(d3.curveCatmullRom.alpha(0.5));
    };

    LinePlot.prototype.calculateChartDims = function() {
      var height, margin, preError, width;
      preError = this.preError + "calculateChartDims()";
      width = Math.round($(this.options.target).width());
      height = Math.round(width / 2.5);
      if (this.options.theme === 'minimum') {
        margin = {
          top: Math.round(height * 0.28),
          right: Math.round(Math.pow(width, 0.6)),
          bottom: Math.round(height * 0.18),
          left: Math.round(Math.pow(width, 0.6))
        };
      } else {
        margin = {
          top: Math.round(height * 0.07),
          right: Math.round(Math.pow(width, 0.6)),
          bottom: Math.round(height * 0.16),
          left: Math.round(Math.pow(width, 0.6))
        };
      }
      this.definition.dimensions = {
        width: width,
        height: height,
        margin: margin
      };
      this.definition.x = d3.scaleTime().range([margin.left, width - margin.right]);
      return this.definition.y = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    };

    LinePlot.prototype.calculateAxisDims = function(data) {
      var preError, xmax, xmin, ymax, ymin;
      preError = this.preError + "calculateAxisDims(data)";
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
      var preError;
      preError = this.preError + "responsive()";
      this.calculateChartDims();
      return true;
    };

    LinePlot.prototype.append = function() {
      var _, bottomPadding, innerHeight, innerWidth, leftPadding, preError, topPadding;
      preError = this.preError + "append()";
      _ = this;
      this.log("" + preError, this.options);
      topPadding = parseInt(this.definition.dimensions.margin.top);
      bottomPadding = parseInt(this.definition.dimensions.height - this.definition.dimensions.margin.bottom);
      leftPadding = parseInt(this.definition.dimensions.margin.left);
      innerHeight = parseInt(this.definition.dimensions.height - this.definition.dimensions.margin.bottom - this.definition.dimensions.margin.top);
      innerWidth = parseInt(this.definition.dimensions.width - this.definition.dimensions.margin.left - this.definition.dimensions.margin.right);
      this.svg = d3.select(this.options.target).append("svg").attr("class", "line-plot").attr("width", this.definition.dimensions.width).attr("height", this.definition.dimensions.height);
      this.svg.append("defs").append("clipPath").attr("id", this.options.target + "_clip").append("rect").attr("width", innerWidth).attr("height", innerHeight).attr("transform", "translate(" + leftPadding + ", " + topPadding + ")");
      this.definition.x.domain([this.definition.x.min, this.definition.x.max]);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      this.svg.append("g").attr("class", "line-plot-axis-x").attr("transform", "translate(0, " + bottomPadding + ")").style("fill", "none").style("stroke", this.options.axisColor).call(this.definition.xAxis);
      if (this.options.theme !== 'minimum') {
        this.svg.select(".line-plot-axis-x").selectAll("text").style("font-size", 10).style("font-weight", 100);
      }
      this.svg.append("g").attr("class", "line-plot-axis-y").attr("transform", "translate(" + leftPadding + ", 0)").style("fill", "none").style("stroke", this.options.axisColor).call(this.definition.yAxis);
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.line).attr("class", "line-plot-path").style("stroke", this.options.lineColor).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.svg.append("g").attr("class", "line");
      this.svg.append("g").attr("id", "crosshairX").attr("class", "crosshair").style("stroke", this.options.crosshairX.color).style("stroke-width", this.options.crosshairX.stroke).style("fill", "none");
      return this.svg.append("g").attr("id", "crosshairY").attr("class", "crosshair").style("stroke", this.options.crosshairY.color).style("stroke-width", this.options.crosshairY.stroke).style("fill", "none");
    };

    LinePlot.prototype.update = function(data) {
      var _, dtDiff, dtOffset, key, preError, row;
      preError = this.preError + "update()";
      _ = this;
      dtOffset = new Date(this.definition.x.max);
      for (key in data) {
        row = data[key];
        this.data.push({
          x: this.parseDate(row[this.options.x.variable]),
          y: row[this.options.y.variable]
        });
      }
      this.svg.select(".line-plot-path").datum(this.data).attr("d", this.definition.line);
      this.calculateAxisDims(this.data);
      dtDiff = this.definition.x.max - dtOffset;
      this.log(preError + " Date Diff Calcs (dtOffset, @def.x.min, dtDiff)", dtOffset, this.definition.x.max, this.dtDiff);
      this.definition.x.domain([this.definition.x.min, this.definition.x.max]);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      this.svg.select(".line-plot-axis-x").transition().duration(this.options.transitionDuration).ease(d3.easeLinear).call(this.definition.xAxis);
      this.svg.select(".line-plot-axis-y").transition().duration(this.options.transitionDuration).ease(d3.easeLinear).call(this.definition.yAxis);
      return this.svg.select(".line-plot-path").datum(this.data).transition().duration(this.options.transitionDuration).attr("d", this.definition.line);
    };

    return LinePlot;

  })();

}).call(this);

(function() {
  var Handler;

  window.Plotting || (window.Plotting = {});

  window.Plotting.Handler = Handler = (function() {
    function Handler(access, options, plots) {
      var accessToken, defaults;
      this.preError = "Plotting.Handler";
      defaults = {
        target: null,
        dateFormat: "%Y-%m-%d %H:%M:%S"
      };
      this.options = Object.mergeDefaults(options, defaults);
      this.endpoint = null;
      accessToken = {
        token: null,
        expires: null,
        expired: true
      };
      access = Object.mergeDefaults(access, accessToken);
      this.api = new window.Plotting.API;
      this.parseDate = d3.timeParse(this.options.dateFormat);
      this.hasAccess = function() {
        if (this.parseDate(access.expires) > new Date) {
          access.expired = true;
        }
        if (access.expired) {
          return false;
        } else {
          return true;
        }
      };
    }

    Handler.prototype.listen = function() {};

    Handler.prototype.getTemplate = function() {};

    Handler.prototype.getStationParamData = function(data_logger, fields, limit, offset) {
      var args, callback, preError, target;
      preError = this.preError + ".getStationParamData(...)";
      target = "http://dev.nwac.us/api/v5/measurement";
      args = {
        data_logger: data_logger,
        fields: fields,
        limit: limit,
        offset: offset
      };
      callback = function(data) {
        return console.log(preError + ".callback(...) (data)", data);
      };
      return this.api.get(target, args, callback);
    };

    Handler.prototype.append = function() {
      var i, instance, len, plot, ref, results;
      ref = this.plots;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        instance = new window.Plotting.LinePlot(plot.data, plot.options);
        instance.append();
        results.push(this.plots.push(instance));
      }
      return results;
    };

    Handler.prototype.alert = function(message, type) {};

    return Handler;

  })();

}).call(this);
