(function() {
  var API;

  window.Plotter || (window.Plotter = {});

  window.Plotter.API = API = (function() {
    function API(accessToken, async) {
      var preError;
      this.preError = "Plotter.API";
      preError = this.preError + ".constructor()";
      this.async = true;
      if (typeof async !== "undefined") {
        this.async = async;
      }
      this.getAccessToken = function() {
        return accessToken;
      };
      this.getAccessTokenValue = function() {
        if (accessToken === void 0) {
          throw new Error(preError + " Access token is not defined.");
        }
        return "Token " + accessToken;
      };
    }

    API.prototype.build = function() {
      var error, error1, error2, preError, xhr;
      preError = this.preError + ".build()";
      xhr = null;
      if (XMLHttpRequest) {
        xhr = new XMLHttpRequest;
      } else {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (error1) {
          error = error1;
          try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (error2) {
            error = error2;
            console.error(preError, 'Cannot specify XMLHTTPRequest (error)', error);
          }
        }
      }
      return xhr;
    };

    API.prototype.get = function(uri, args, callback) {
      var error, error1, preError, xhr;
      preError = this.preError + ".get(uri, params, callback)";
      xhr = this.build();
      if (typeof callback !== 'undefined') {
        xhr.onreadystatechange = function() {
          var error, error1, result;
          if (xhr.readyState !== 4) {
            return;
          }
          if (xhr.status !== 200 && xhr.status !== 304) {
            console.log(preError + " HTTP error, (status): " + xhr.status);
            xhr = null;
            return;
          }
          result = {
            response: xhr.response,
            responseText: xhr.responseText,
            responseJSON: null
          };
          try {
            result.responseJSON = JSON.parse(result.responseText);
          } catch (error1) {
            error = error1;
            result.responseJSON = null;
          }
          return callback(result);
        };
      }
      args = this.encodeArgs('GET', args);
      try {
        xhr.open('GET', uri + args, this.async);
        xhr.setRequestHeader("Authorization", this.getAccessTokenValue());
        xhr.send(null);
      } catch (error1) {
        error = error1;
        throw new Error(preError + ", " + error);
      }
    };

    API.prototype.put = function(uri, args, callback) {
      var error, error1, preError, xhr;
      preError = this.preError + ".put(uri, params, callback)";
      xhr = this.build();
      if (typeof callback !== 'undefined') {
        xhr.onreadystatechange = function() {
          var error, error1, result;
          if (xhr.readyState !== 4) {
            return;
          }
          if (xhr.status !== 200 && xhr.status !== 304) {
            console.log(preError + " HTTP error, (status): " + xhr.status);
            xhr = null;
            return;
          }
          result = {
            response: xhr.response,
            responseText: xhr.responseText,
            responseJSON: null
          };
          try {
            result.responseJSON = JSON.parse(result.responseText);
          } catch (error1) {
            error = error1;
            result.responseJSON = null;
          }
          return callback(result);
        };
      }
      args = this.encodeArgs('PUT', args);
      try {
        xhr.open('PUT', uri, this.async);
        xhr.setRequestHeader("Authorization", this.getAccessToken());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(args);
      } catch (error1) {
        error = error1;
        console.log(preError + 'catch(error).', error);
      }
    };

    API.prototype.post = function(uri, args, callback) {
      var error, error1, preError, xhr;
      preError = this.preError + ".post(uri, params, callback)";
      xhr = build();
      if (typeof callback !== 'undefined') {
        xhr.onreadystatechange = function() {
          var error, error1, result;
          if (xhr.readyState !== 4) {
            return;
          }
          if (xhr.status !== 200 && xhr.status !== 304) {
            console.log(preError + " HTTP error, (status): " + xhr.status);
            xhr = null;
            return;
          }
          result = {
            response: xhr.response,
            responseText: xhr.responseText,
            responseJSON: null
          };
          try {
            result.responseJSON = JSON.parse(result.responseText);
          } catch (error1) {
            error = error1;
            result.responseJSON = null;
          }
          return callback(result);
        };
      }
      args = this.encodeArgs('POST', args);
      try {
        xhr.open('POST', uri, this.async);
        xhr.setRequestHeader("Authorization", this.getAccessToken());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(args);
      } catch (error1) {
        error = error1;
        console.log(preError + 'catch(error).', error);
      }
    };

    API.prototype["delete"] = function(uri, args, callback) {
      var error, error1, preError, xhr;
      preError = this.preError + ".delete(uri, params, callback)";
      xhr = this.build();
      if (typeof callback !== 'undefined') {
        xhr.onreadystatechange = function() {
          var error, error1, result;
          if (xhr.readyState !== 4) {
            return;
          }
          if (xhr.status !== 200 && xhr.status !== 304) {
            console.log(preError + " HTTP error, (status): " + xhr.status);
            xhr = null;
            return;
          }
          result = {
            response: xhr.response,
            responseText: xhr.responseText,
            responseJSON: null
          };
          try {
            result.responseJSON = JSON.parse(result.responseText);
          } catch (error1) {
            error = error1;
            result.responseJSON = null;
          }
          return callback(result);
        };
      }
      args = this.encodeArgs('DELETE', args);
      try {
        xhr.open('DELETE', uri, this.async);
        xhr.setRequestHeader("Authorization", this.getAccessToken());
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(args);
      } catch (error1) {
        error = error1;
        console.log(preError + 'catch(error).', error);
      }
    };

    API.prototype.encodeArgs = function(type, json_args) {
      var aCount, argStr, argument, error, error1, preError;
      preError = this.preError + "encodeArgs(type, json_args)";
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
            argStr = "?" + argument + "=" + json_args[argument];
          } else {
            argStr = argStr + "&" + argument + "=" + json_args[argument];
          }
          aCount++;
        }
      }
      return argStr;
    };

    return API;

  })();

}).call(this);

(function() {
  var BarPlot,
    slice = [].slice;

  window.Plotter || (window.Plotter = {});

  window.Plotter.BarPlot = BarPlot = (function() {
    function BarPlot(plotter, data, options) {
      var _domainMean, _domainScale, _y;
      this.preError = "BarPlot.";
      this.plotter = plotter;
      this.initialized = false;
      _y = [
        {
          dataLoggerId: null,
          variable: null,
          ticks: 5,
          min: null,
          max: null,
          maxBar: null,
          color: "rgb(41, 128, 185)",
          band: {
            minVariable: null,
            maxVariable: null
          }
        }
      ];
      this.defaults = {
        plotId: null,
        uuid: '',
        debug: true,
        target: null,
        width: null,
        merge: false,
        x: {
          variable: null,
          format: "%Y-%m-%dT%H:%M:%SZ",
          min: null,
          max: null,
          ticks: 7
        },
        y: _y,
        zoom: {
          scale: {
            min: 0.05,
            max: 5
          }
        },
        aspectDivisor: 5,
        transitionDuration: 500,
        weight: 2,
        axisColor: "rgb(0,0,0)",
        font: {
          weight: 100,
          size: 12
        },
        focusX: {
          color: "rgb(52, 52, 52)"
        },
        crosshairX: {
          weight: 1,
          color: "rgb(149,165,166)"
        },
        requestInterval: {
          data: 336
        }
      };
      if (options.x) {
        options.x = this.plotter.lib.mergeDefaults(options.x, this.defaults.x);
      }
      options.y[0] = this.plotter.lib.mergeDefaults(options.y[0], this.defaults.y[0]);
      this.options = this.plotter.lib.mergeDefaults(options, this.defaults);
      this.device = 'full';
      this.transform = d3.zoomIdentity;
      this.links = [
        {
          "variable": "battery_voltage",
          "title": "Battery Voltage"
        }, {
          "variable": "temperature",
          "title": "Temperature"
        }, {
          "variable": "relative_humidity",
          "title": "Relative Humidity"
        }, {
          "variable": "precipitation",
          "title": "Precipitation"
        }, {
          "variable": "snow_depth",
          "title": "Snow Depth"
        }, {
          "variable": "wind_direction",
          "title": "Wind Direction"
        }, {
          "variable": "wind_speed_average",
          "title": "Wind Speed"
        }, {
          "variable": "net_solar",
          "title": "Net Solar"
        }, {
          "variable": "solar_pyranometer",
          "title": "Solar Pyranometer"
        }, {
          "variable": "equip_temperature",
          "title": "Equipment Temperature"
        }, {
          "variable": "barometric_pressure",
          "title": "Barometric Pressure"
        }, {
          "variable": "snowfall_24_hour",
          "title": "24-Hr Snowfall"
        }, {
          "variable": "intermittent_snow",
          "title": "Intermittent Snow"
        }
      ];
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
      this.bisectDate = d3.bisector(function(d) {
        return d.x;
      }).left;
      this.sortDatetimeAsc = function(a, b) {
        return a.x - b.x;
      };
      this.data = this.processData(data);
      this.getDefinition();
      this.bars = [];
      this.focusRect = [];
      this.focusText = [];
      this.skipBandDomainSet = false;
      _domainScale = null;
      _domainMean = null;
      if (data.length > 0) {
        _domainScale = this.getDomainScale(this.definition.x);
        _domainMean = this.getDomainMean(this.definition.x);
      }
      this.state = {
        range: {
          data: [],
          scale: _domainScale
        },
        length: {
          data: []
        },
        interval: {
          data: []
        },
        zoom: 1,
        request: {
          data: []
        },
        requested: {
          data: []
        },
        mean: {
          scale: _domainMean
        }
      };
      if (data[0].length > 0) {
        this.setDataState();
        this.setIntervalState();
        this.setDataRequirement();
      }
    }

    BarPlot.prototype.processData = function(data) {
      var result, set, setId;
      result = [];
      for (setId in data) {
        set = data[setId];
        result[setId] = this.processDataSet(set, setId);
      }
      return result;
    };

    BarPlot.prototype.processDataSet = function(data, dataSetId) {
      var _result, _yOptions, key, result, row;
      _yOptions = this.options.y[dataSetId];
      result = [];
      for (key in data) {
        row = data[key];
        result[key] = {
          x: new Date(this.parseDate(row[this.options.x.variable]).getTime() - 8 * 3600000),
          y: row[_yOptions.variable]
        };
        if (_yOptions.band != null) {
          if (_yOptions.band.minVariable) {
            result[key].yMin = row[_yOptions.band.minVariable];
          }
          if (_yOptions.band.maxVariable) {
            result[key].yMax = row[_yOptions.band.maxVariable];
          }
        }
      }
      _result = new Plotter.Data(result);
      result = _result._clean(_result.get());
      return result.sort(this.sortDatetimeAsc);
    };

    BarPlot.prototype.setData = function(data) {
      var _domainMean, _domainScale;
      this.data = [this.processDataSet(data, 0)];
      this.getDefinition();
      _domainScale = null;
      _domainMean = null;
      if (data.length > 0) {
        _domainScale = this.getDomainScale(this.definition.x);
        _domainMean = this.getDomainMean(this.definition.x);
      }
      this.state.range.scale = _domainScale;
      this.state.mean.scale = _domainMean;
      if (data.length > 0) {
        this.setDataState();
        this.setIntervalState();
        return this.setDataRequirement();
      }
    };

    BarPlot.prototype.addData = function(data, dataSetId) {
      var _domainMean, _domainScale;
      this.data[dataSetId] = this.processDataSet(data, dataSetId);
      this.getDefinition();
      _domainScale = null;
      _domainMean = null;
      if (data.length > 0) {
        _domainScale = this.getDomainScale(this.definition.x);
        _domainMean = this.getDomainMean(this.definition.x);
      }
      this.state.range.scale = _domainScale;
      this.state.mean.scale = _domainMean;
      if (data.length > 0) {
        this.setDataState();
        this.setIntervalState();
        return this.setDataRequirement();
      }
    };

    BarPlot.prototype.appendData = function(data, dataSetId) {
      var _data, _set;
      _data = this.processDataSet(data, dataSetId);
      _set = new window.Plotter.Data(this.data[dataSetId]);
      _set.append(_data, ["x"]);
      this.data[dataSetId] = _set._clean(_set.get());
      this.data[dataSetId] = this.data[dataSetId].sort(this.sortDatetimeAsc);
      if (this.initialized) {
        this.setDataState();
        this.setIntervalState();
        return this.setDataRequirement();
      }
    };

    BarPlot.prototype.removeData = function(key) {
      if (key >= 0) {
        delete this.data[key];
        delete this.options[key];
        this.svg.select(".bar-plot-area-" + key).remove();
        this.svg.select(".bar-plot-path-" + key).remove();
        this.svg.select(".focus-rect-" + key).remove();
        this.svg.select(".focus-text-" + key).remove();
        if (this.initialized) {
          this.setDataState();
          this.setIntervalState();
          return this.setDataRequirement();
        }
      }
    };

    BarPlot.prototype.setDataState = function() {
      var _len, key, ref, results, row;
      _len = this.data.length - 1;
      ref = this.data;
      results = [];
      for (key in ref) {
        row = ref[key];
        this.state.range.data[key] = {
          min: d3.min(this.data[key], function(d) {
            return d.x;
          }),
          max: d3.max(this.data[key], function(d) {
            return d.x;
          })
        };
        results.push(this.state.length.data[key] = this.data[key].length);
      }
      return results;
    };

    BarPlot.prototype.setIntervalState = function() {
      var key, ref, results, row;
      ref = this.data;
      results = [];
      for (key in ref) {
        row = ref[key];
        results.push(this.state.interval.data[key] = {
          min: (this.state.range.scale.min.getTime() - this.state.range.data[key].min.getTime()) / 3600000,
          max: (this.state.range.data[key].max.getTime() - this.state.range.scale.max.getTime()) / 3600000
        });
      }
      return results;
    };

    BarPlot.prototype.setDataRequirement = function() {
      var _data_max, _now, key, ref, results, row;
      _now = new Date();
      ref = this.data;
      results = [];
      for (key in ref) {
        row = ref[key];
        _data_max = false;
        if (this.state.range.data[key].max.getTime() < (_now.getTime() - (3600000 * 2.5))) {
          _data_max = this.state.interval.data[key].max < this.options.requestInterval.data;
        }
        this.state.request.data[key] = {
          min: this.state.interval.data[key].min < this.options.requestInterval.data,
          max: _data_max
        };
        if (!(this.state.requested.data[key] != null)) {
          results.push(this.state.requested.data[key] = {
            min: false,
            max: false
          });
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    BarPlot.prototype.setZoomState = function(k) {
      return this.state.zoom = k;
    };

    BarPlot.prototype.getDomainScale = function(axis) {
      var result;
      return result = {
        min: axis.domain()[0],
        max: axis.domain()[1]
      };
    };

    BarPlot.prototype.getDomainMean = function(axis) {
      var center;
      center = new Date(d3.mean(axis.domain()));
      center.setHours(center.getHours() + Math.round(center.getMinutes() / 60));
      center.setMinutes(0);
      center.setSeconds(0);
      center.setMilliseconds(0);
      return center;
    };

    BarPlot.prototype.getDefinition = function() {
      var _, _extent, preError;
      preError = this.preError + "getDefinition():";
      _ = this;
      this.definition = {};
      this.calculateChartDims();
      this.calculateAxisDims(this.data);
      this.definition.xAxis = d3.axisBottom().scale(this.definition.x).ticks(Math.round($(this.options.target).width() / 100));
      this.definition.yAxis = d3.axisLeft().scale(this.definition.y).ticks(this.options.y[0].ticks);
      this.definition.x.domain([this.definition.x.min, this.definition.x.max]);
      if (!this.skipBandDomainSet) {
        this.definition.x1.domain(this.data[0].map(function(d) {
          return d.x;
        }));
        this.skipBandDomainSet = false;
      }
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      _extent = [[-Infinity, 0], [this.definition.x(new Date()), this.definition.dimensions.innerHeight]];
      return this.definition.zoom = d3.zoom().scaleExtent([this.options.zoom.scale.min, this.options.zoom.scale.max]).translateExtent(_extent).on("zoom", function() {
        var transform;
        transform = _.setZoomTransform();
        return _.plotter.i.zoom.set(transform);
      });
    };

    BarPlot.prototype.setBandDomain = function(bandDomain) {
      return this.definition.x1 = bandDomain;
    };

    BarPlot.prototype.calculateChartDims = function() {
      var _height, height, margin, width;
      if (this.options.width != null) {
        width = Math.round(this.options.width);
      } else {
        width = Math.round($(this.options.target).width()) - 24;
      }
      height = Math.round(width / this.options.aspectDivisor);
      if (width > 1000) {
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.3)),
          bottom: Math.round(height * 0.12),
          left: Math.round(Math.pow(width, 0.6))
        };
      } else if (width > 600) {
        this.device = 'mid';
        this.options.font.size = this.options.font.size / 1.25;
        _height = this.options.aspectDivisor / 1.25;
        height = Math.round(width / _height);
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.3)),
          bottom: Math.round(height * 0.14),
          left: Math.round(Math.pow(width, 0.6))
        };
      } else {
        this.device = 'small';
        this.options.font.size = this.options.font.size / 1.5;
        _height = this.options.aspectDivisor / 1.5;
        height = Math.round(width / _height);
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.3)),
          bottom: Math.round(height * 0.18),
          left: Math.round(Math.pow(width, 0.6))
        };
      }
      this.definition.dimensions = {
        width: width,
        height: height,
        margin: margin
      };
      this.definition.dimensions.topPadding = parseInt(this.definition.dimensions.margin.top);
      this.definition.dimensions.bottomPadding = parseInt(this.definition.dimensions.height - this.definition.dimensions.margin.bottom);
      this.definition.dimensions.leftPadding = parseInt(this.definition.dimensions.margin.left);
      this.definition.dimensions.innerHeight = parseInt(this.definition.dimensions.height - this.definition.dimensions.margin.bottom - this.definition.dimensions.margin.top);
      this.definition.dimensions.innerWidth = parseInt(this.definition.dimensions.width - this.definition.dimensions.margin.left - this.definition.dimensions.margin.right);
      this.definition.x = d3.scaleTime().range([margin.left, width - margin.right]);
      this.definition.x1 = d3.scaleBand().rangeRound([margin.left, width - margin.right], 0.05).padding(0.1);
      return this.definition.y = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    };

    BarPlot.prototype.calculateAxisDims = function(data) {
      this.calculateXAxisDims(data);
      return this.calculateYAxisDims(data);
    };

    BarPlot.prototype.calculateXAxisDims = function(data) {
      if (this.options.x.min === null) {
        this.definition.x.min = d3.min(data[0], function(d) {
          return d.x;
        });
      } else {
        this.definition.x.min = this.parseDate(this.options.x.min);
      }
      if (this.options.x.max === null) {
        return this.definition.x.max = d3.max(data[0], function(d) {
          return d.x;
        });
      } else {
        return this.definition.x.max = this.parseDate(this.options.x.max);
      }
    };

    BarPlot.prototype.calculateYAxisDims = function(data) {
      var _setMax, _setMin, set, subId;
      this.definition.y.min = 0;
      this.definition.y.max = 0;
      for (subId in data) {
        set = data[subId];
        _setMin = d3.min([
          d3.min(set, function(d) {
            return d.y;
          }), d3.min(set, function(d) {
            return d.yMin;
          })
        ]);
        _setMax = d3.max([
          d3.max(set, function(d) {
            return d.y;
          }), d3.max(set, function(d) {
            return d.yMax;
          })
        ]);
        if (_setMin < this.definition.y.min || this.definition.y.min === void 0) {
          this.definition.y.min = _setMin;
        }
        if (_setMax > this.definition.y.max || this.definition.y.max === void 0) {
          this.definition.y.max = _setMax;
        }
      }
      if (this.definition.y.min === this.definition.y.max) {
        this.definition.y.min = this.definition.y.min * 0.8;
        this.definition.y.max = this.definition.y.min * 1.2;
      }
      if (this.options.y[0].min != null) {
        this.definition.y.min = this.options.y[0].min;
      }
      if (this.options.y[0].max != null) {
        return this.definition.y.max = this.options.y[0].max;
      }
    };

    BarPlot.prototype.preAppend = function() {
      var _, preError;
      preError = this.preError + "preAppend()";
      _ = this;
      this.outer = d3.select(this.options.target).append("div").attr("class", "bar-plot-body").style("width", this.definition.dimensions.width + "px").style("height", this.definition.dimensions.height + "px").style("display", "inline-block");
      this.ctls = d3.select(this.options.target).append("div").attr("class", "plot-controls").style("width", '23px').style("height", this.definition.dimensions.height + "px").style("display", "inline-block").style("vertical-align", "top");
      this.svg = this.outer.append("svg").attr("class", "bar-plot").attr("width", this.definition.dimensions.width).attr("height", this.definition.dimensions.height);
      this.svg.append("defs").append("clipPath").attr("id", this.options.target + "_clip").append("rect").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")");
      this.svg.append("g").attr("class", "bar-plot-axis-x").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.xAxis).attr("transform", "translate(0, " + this.definition.dimensions.bottomPadding + ")");
      return this.svg.append("g").attr("class", "bar-plot-axis-y").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.yAxis).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", 0)");
    };

    BarPlot.prototype.append = function() {
      var _, _y_offset, _y_title, _y_vert, key, preError, ref, ref1, row;
      this.initialized = true;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + "append()";
      _ = this;
      this.svg.select(".bar-plot-axis-x").call(this.definition.xAxis);
      this.svg.select(".bar-plot-axis-y").call(this.definition.yAxis);
      _y_title = "" + this.options.y[0].title;
      if (this.options.y[0].units) {
        _y_title = _y_title + " " + this.options.y[0].units;
      }
      _y_vert = -15;
      _y_offset = -52;
      if (this.device === 'small') {
        _y_vert = -10;
        _y_offset = -30;
      }
      this.svg.select(".bar-plot-axis-y").append("text").text(_y_title).attr("class", "bar-plot-y-label").attr("x", _y_vert).attr("y", _y_offset).attr("dy", ".75em").attr("transform", "rotate(-90)").style("font-size", this.options.font.size).style("font-weight", this.options.font.weight);
      this.barWrapper = this.svg.append("g").attr("class", "bar-wrapper");
      ref = this.data;
      for (key in ref) {
        row = ref[key];
        this.bars[key] = this.barWrapper.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").selectAll(".bar-" + key).data(row).enter().append("rect").attr("class", "bar-" + key).attr("x", function(d) {
          return _.definition.x(d.x);
        }).attr("width", d3.max([1, this.definition.x1.bandwidth()])).attr("y", function(d) {
          return _.definition.y(d.y);
        }).attr("height", function(d) {
          return _.definition.dimensions.innerHeight + _.definition.dimensions.margin.top - _.definition.y(d.y);
        }).style("fill", this.options.y[key].color);
      }
      if (this.options.y[0].maxBar != null) {
        this.barWrapper.append("rect").attr("class", "bar-plot-max-bar").attr("x", this.definition.dimensions.leftPadding).attr("y", this.definition.y(this.options.y[0].maxBar)).attr("width", this.definition.dimensions.innerWidth).attr("height", 1).style("color", '#gggggg').style("opacity", 0.4);
      }
      this.hoverWrapper = this.svg.append("g").attr("class", "hover-wrapper");
      this.crosshairs = this.hoverWrapper.append("g").attr("class", "crosshair");
      this.crosshairs.append("line").attr("class", "crosshair-x").style("stroke", this.options.crosshairX.color).style("stroke-width", this.options.crosshairX.weight).style("stroke-dasharray", "3, 3").style("fill", "none");
      this.crosshairs.append("rect").attr("class", "crosshair-x-under").style("fill", "rgb(255,255,255)").style("opacity", 0.1);
      ref1 = this.data;
      for (key in ref1) {
        row = ref1[key];
        this.focusRect[key] = this.hoverWrapper.append("rect").attr("width", this.definition.x1.bandwidth()).attr("height", 2).attr("class", "focus-rect-" + key).attr("fill", this.options.focusX.color).attr("transform", "translate(-10, -10)").style("display", "none").style("stroke", "rgb(255,255,255)").style("opacity", 0.75);
        this.focusText[key] = this.hoverWrapper.append("text").attr("class", "focus-text-" + key).attr("x", 11).attr("y", 7).style("display", "none").style("fill", this.options.y[key].color).style("text-shadow", "-2px -2px 0 rgb(255,255,255), 2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255), 2px 2px 0 rgb(255,255,255)");
      }
      this.overlay = this.svg.append("rect").attr("class", "plot-event-target");
      this.appendCrosshairTarget(this.transform);
      return this.appendZoomTarget(this.transform);
    };

    BarPlot.prototype.update = function() {
      var _, _bandwidth, _rescaleX, key, preError, ref, row;
      preError = this.preError + "update()";
      _ = this;
      _rescaleX = this.transform.rescaleX(this.definition.x);
      _bandwidth = Math.floor(this.transform.k * this.definition.x1.bandwidth());
      ref = this.data;
      for (key in ref) {
        row = ref[key];
        if ((row != null) && (_.options.y[key] != null)) {
          if (this.svg.selectAll(".bar-" + key).node()[0] === null) {
            console.log("Adding new BarPlot data set.");
            this.bars[key] = this.barWrapper.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").selectAll(".bar-" + key).data(row).enter().append("rect").attr("class", "bar-" + key).attr("x", function(d) {
              return _rescaleX(d.x);
            }).attr("width", d3.max([1, _bandwidth])).attr("y", function(d) {
              return _.definition.y(d.y);
            }).attr("height", function(d) {
              return _.definition.dimensions.innerHeight + _.definition.dimensions.margin.top - _.definition.y(d.y);
            }).style("fill", this.options.y[key].color);
            this.focusRect[key] = this.hoverWrapper.append("rect").attr("width", this.definition.x1.bandwidth()).attr("height", 2).attr("class", "focus-rect-" + key).attr("fill", this.options.focusX.color).attr("transform", "translate(-10, -10)").style("display", "none").style("stroke", "rgb(255,255,255)").style("opacity", 0.75);
            this.focusText[key] = this.hoverWrapper.append("text").attr("class", "focus-text-" + key).attr("x", 11).attr("y", 7).style("display", "none").style("fill", this.options.y[key].color).style("text-shadow", "-2px -2px 0 rgb(255,255,255), 2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255), 2px 2px 0 rgb(255,255,255)");
          } else {
            this.bars[key] = this.barWrapper.select("g").selectAll(".bar-" + key).data(row);
            this.bars[key].enter().append("rect").attr("class", "bar-" + key).attr("x", function(d) {
              return _rescaleX(d.x);
            }).attr("width", d3.max([1, _bandwidth])).attr("y", function(d) {
              return _.definition.y(d.y);
            }).attr("height", function(d) {
              return _.definition.dimensions.innerHeight + _.definition.dimensions.margin.top - _.definition.y(d.y);
            }).style("fill", this.options.y[key].color);
            this.bars[key].exit().remove();
            this.bars[key].attr("x", function(d) {
              return _rescaleX(d.x);
            }).attr("width", d3.max([1, _bandwidth])).attr("y", function(d) {
              return _.definition.y(d.y);
            }).attr("height", function(d) {
              return _.definition.dimensions.innerHeight + _.definition.dimensions.margin.top - _.definition.y(d.y);
            });
          }
        }
      }
      this.overlay.remove();
      this.overlay = this.svg.append("rect").attr("class", "plot-event-target");
      this.appendCrosshairTarget(this.transform);
      this.appendZoomTarget(this.transform);
      this.calculateYAxisDims(this.data);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      this.svg.select(".bar-plot-axis-y").call(this.definition.yAxis);
      if (this.options.y[0].maxBar != null) {
        this.barWrapper.select(".bar-plot-max-bar").attr("y", this.definition.y(this.options.y[0].maxBar));
      }
      return this.setZoomTransform(this.transform);
    };

    BarPlot.prototype.removeTemp = function() {
      return this.temp.remove();
    };

    BarPlot.prototype.appendCrosshairTarget = function(transform) {
      var _, preError;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + "appendCrosshairTarget()";
      _ = this;
      return this.overlay.datum(this.data).attr("class", "overlay").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")").style("fill", "none").style("pointer-events", "all").on("mouseover", function() {
        return _.plotter.i.crosshairs.show();
      }).on("mouseout", function() {
        return _.plotter.i.crosshairs.hide();
      }).on("mousemove", function() {
        var mouse;
        mouse = _.setCrosshair(transform);
        return _.plotter.i.crosshairs.set(transform, mouse);
      });
    };

    BarPlot.prototype.appendZoomTarget = function(transform) {
      var _, preError;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + "appendZoomTarget()";
      _ = this;
      this.overlay.attr("class", "zoom-pane").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")").style("fill", "none").style("pointer-events", "all").style("cursor", "move");
      return this.svg.call(this.definition.zoom, transform);
    };

    BarPlot.prototype.setZoomTransform = function(transform) {
      var _, _rescaleX, _transform, key, preError, ref, row;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + ".setZoomTransform(transform)";
      _ = this;
      if (transform != null) {
        this.transform = transform;
      } else if (d3.event != null) {
        this.transform = d3.event.transform;
      }
      _transform = this.transform;
      _rescaleX = _transform.rescaleX(this.definition.x);
      this.svg.select(".bar-plot-axis-x").call(this.definition.xAxis.scale(_rescaleX));
      this.state.range.scale = this.getDomainScale(_rescaleX);
      this.state.mean.scale = this.getDomainMean(_rescaleX);
      this.setDataState();
      this.setIntervalState();
      this.setDataRequirement();
      this.setZoomState(_transform.k);
      ref = this.data;
      for (key in ref) {
        row = ref[key];
        this.svg.selectAll(".bar-" + key).attr("x", function(d) {
          return _rescaleX(d.x);
        }).attr("width", d3.max([1, Math.floor(_transform.k * this.definition.x1.bandwidth())]));
      }
      this.appendCrosshairTarget(_transform);
      return _transform;
    };

    BarPlot.prototype.setCrosshair = function(transform, mouse) {
      var _, _datum, _dims, _mouseTarget, _value, cx, directionLabel, dx, dy, i, key, preError, ref, row, x0;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + ".setCrosshair(mouse)";
      _ = this;
      _dims = this.definition.dimensions;
      directionLabel = function(dir) {
        switch (false) {
          case !(dir > 360 || dir < 0):
            return "INV";
          case !(dir >= 0 && dir < 11.25):
            return "N";
          case !(dir >= 11.25 && dir < 33.75):
            return "NNE";
          case !(dir >= 33.75 && dir < 56.25):
            return "NE";
          case !(dir >= 56.25 && dir < 78.75):
            return "ENE";
          case !(dir >= 78.75 && dir < 101.25):
            return "E";
          case !(dir >= 101.25 && dir < 123.75):
            return "ESE";
          case !(dir >= 123.75 && dir < 146.25):
            return "SE";
          case !(dir >= 146.25 && dir < 168.75):
            return "SSE";
          case !(dir >= 168.75 && dir < 191.25):
            return "S";
          case !(dir >= 191.25 && dir < 213.75):
            return "SSW";
          case !(dir >= 213.75 && dir < 236.25):
            return "SW";
          case !(dir >= 236.25 && dir < 258.75):
            return "WSW";
          case !(dir >= 258.75 && dir < 281.25):
            return "W";
          case !(dir >= 281.25 && dir < 303.75):
            return "WNW";
          case !(dir >= 303.75 && dir < 326.25):
            return "NW";
          case !(dir >= 326.25 && dir < 348.75):
            return "NNW";
          case !(dir >= 348.75 && dir <= 360):
            return "N";
        }
      };
      ref = this.data;
      for (key in ref) {
        row = ref[key];
        _mouseTarget = this.overlay.node();
        _datum = row;
        mouse = mouse ? mouse : d3.mouse(_mouseTarget);
        x0 = this.definition.x.invert(mouse[0] + _dims.leftPadding);
        if (transform) {
          x0 = this.definition.x.invert(transform.invertX(mouse[0] + _dims.leftPadding));
        }
        i = _.bisectDate(_datum, x0, 1);
        if (x0.getTime() < this.state.range.data[key].min.getTime()) {
          i--;
        }
        if (x0.getTime() > this.state.range.data[key].max.getTime()) {
          i--;
        }
        i = x0.getMinutes() >= 30 ? i : i - 1;
        if (_datum[i] != null) {
          if (transform) {
            dx = transform.applyX(this.definition.x(_datum[i].x));
          } else {
            dx = this.definition.x(_datum[i].x);
          }
          dy = [];
          _value = [];
          if (this.options.y[key].variable !== null) {
            _value[key] = _datum[i];
            if (_value[key] != null) {
              dy[key] = this.definition.y(_value[key].y);
              if (!isNaN(dy[key]) && (_value[key].y != null)) {
                this.focusRect[key].attr("transform", "translate(0, 0)");
              }
            }
          }
          cx = dx - _dims.leftPadding;
          if (cx >= 0) {
            this.crosshairs.select(".crosshair-x").attr("x1", cx).attr("y1", _dims.topPadding).attr("x2", cx).attr("y2", _dims.innerHeight + _dims.topPadding).attr("transform", "translate(" + _dims.leftPadding + ", 0)");
            this.crosshairs.select(".crosshair-x-under").attr("x", cx).attr("y", _dims.topPadding).attr("width", _dims.innerWidth - cx).attr("height", _dims.innerHeight).attr("transform", "translate(" + _dims.leftPadding + ", 0)");
          }
          if (this.options.y[key].variable !== null && !isNaN(dy[key]) && (_value[key].y != null)) {
            this.focusRect[key].attr("width", transform.k * this.definition.x1.bandwidth()).attr("x", dx).attr("y", dy[key]);
            this.focusText[key].attr("x", dx + _dims.leftPadding / 10 + transform.k * this.definition.x1.bandwidth() + 2).attr("y", dy[key] - _dims.topPadding / 10).text(_value[key].y != null ? _.options.y[0].variable === "wind_direction" ? directionLabel(_value[key].y) : _value[key].y.toFixed(2) + " " + this.options.y[key].units : void 0);
          }
        }
      }
      return mouse;
    };

    BarPlot.prototype.showCrosshair = function() {
      var ref, results, row, setId;
      if (!this.initialized) {
        return;
      }
      this.crosshairs.select(".crosshair-x").style("display", null);
      this.crosshairs.select(".crosshair-x-under").style("display", null);
      ref = this.options.y;
      results = [];
      for (setId in ref) {
        row = ref[setId];
        if (row.variable !== null) {
          if (this.focusRect[setId] != null) {
            this.focusRect[setId].style("display", null).attr("fill", this.options.focusX.color);
          }
          if (this.focusText[setId] != null) {
            results.push(this.focusText[setId].style("display", null).style("color", row.color).style("fill", row.color));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    BarPlot.prototype.hideCrosshair = function() {
      var ref, results, row, setId;
      if (!this.initialized) {
        return;
      }
      this.crosshairs.select(".crosshair-x").style("display", "none");
      this.crosshairs.select(".crosshair-x-under").style("display", "none");
      ref = this.options.y;
      results = [];
      for (setId in ref) {
        row = ref[setId];
        if (row.variable !== null) {
          if (this.focusRect[setId] != null) {
            this.focusRect[setId].style("display", "none");
          }
          if (this.focusText[setId] != null) {
            results.push(this.focusText[setId].style("display", "none"));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    BarPlot.prototype.appendTitle = function(title, subtitle) {
      var _mainSize, _offsetFactor, _subSize;
      _offsetFactor = 1;
      _mainSize = '16px';
      _subSize = '12px';
      if (this.device === 'small') {
        _offsetFactor = 0.4;
        _mainSize = '10px';
        _subSize = '7px';
      }
      this.title = this.svg.append("g").attr("class", "bar-plot-title");
      this.title.append("text").attr("x", this.definition.dimensions.margin.left + 10).attr("y", this.definition.dimensions.margin.top / 2 - (4 * _offsetFactor)).style("font-size", _mainSize).style("font-weight", 600).text(title);
      if (subtitle) {
        return this.title.append("text").attr("x", this.definition.dimensions.margin.left + 10).attr("y", this.definition.dimensions.margin.top / 2 + (12 * _offsetFactor)).style("font-size", _subSize).text(subtitle);
      }
    };

    BarPlot.prototype.getState = function() {
      return this.state;
    };

    return BarPlot;

  })();

}).call(this);

(function() {
  var Colors;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Colors = Colors = (function() {
    function Colors() {
      var __colors;
      __colors = {
        light: ["rgb(53, 152, 219)", "rgb(241, 196, 14)", "rgb(155, 88, 181)", "rgb(27, 188, 155)", "rgb(52, 73, 94)", "rgb(231, 126, 35)", "rgb(45, 204, 112)", "rgb(232, 76, 61)", "rgb(149, 165, 165)"],
        dark: ["rgb(45, 62, 80)", "rgb(210, 84, 0)", "rgb(39, 174, 97)", "rgb(192, 57, 43)", "rgb(126, 140, 141)", "rgb(42, 128, 185)", "rgb(239, 154, 15)", "rgb(143, 68, 173)", "rgb(23, 160, 134)"]
      };
      this.color = function(shade, key) {
        return __colors[shade][key];
      };
      this.templateColors = {};
    }

    Colors.prototype.getInitial = function(options) {
      var key, ref, row;
      ref = options.y;
      for (key in ref) {
        row = ref[key];
        row.color = this.get(row.dataLoggerId);
      }
      return options;
    };

    Colors.prototype.get = function(dataLoggerId) {
      var _length, _offset;
      _length = Object.keys(this.templateColors).length;
      _offset = (_length * 2) % 7;
      if ((this.templateColors[dataLoggerId] != null) === false) {
        this.templateColors[dataLoggerId] = this.color("light", _offset);
      }
      return this.templateColors[dataLoggerId];
    };

    return Colors;

  })();

}).call(this);

(function() {
  var Controls,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Plotter || (window.Plotter = {});

  window.Plotter.Controls = Controls = (function() {
    function Controls(plotter) {
      this.preError = "Plotter.Dropdown";
      this.plotter = plotter;
      this.api = this.plotter.i.api;
      this.current = [];
      this.stations = [];
      this.maps = [];
      this.markers = {};
      this.listeners = {};
    }

    Controls.prototype.append = function(plotId) {
      var _li_style, _proto, _template, _uuid, html, selector;
      _template = this.plotter.i.template.full()[plotId];
      _proto = this.plotter.plots[plotId].proto;
      _uuid = _proto.options.uuid;
      selector = "plot-controls-" + _uuid;
      _li_style = "";
      html = "<ul id=\"" + selector + "\" class=\"unstyled\" style=\"list-style-type: none; padding-left: 6px;\"> </ul>";
      $(_proto.options.target).find(".plot-controls").append(html);
      this.move(plotId, '#' + selector, 'up');
      this["new"]('#' + selector, 'down');
      this.remove(plotId, '#' + selector);
      this.move(plotId, '#' + selector, 'down');
      if (_template.type === "station") {
        return this.appendParameterDropdown(plotId, '#' + selector, _proto.options.y.dataloggerid);
      } else if (_template.type === "parameter") {
        return this.appendStationDropdown(plotId, '#' + selector, _proto.options.y[0].variable);
      }
    };

    Controls.prototype.setCurrent = function(plotId) {
      var _proto, args, key, ref, results1, row;
      _proto = this.plotter.plots[plotId].proto;
      this.current[plotId] = [];
      if (_proto.initialized) {
        ref = _proto.options.y;
        results1 = [];
        for (key in ref) {
          row = ref[key];
          if (row.dataLoggerId !== null) {
            args = {
              dataLoggerId: parseInt(row.dataLoggerId),
              yTarget: key,
              color: row.color
            };
            results1.push(this.current[plotId].push(args));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }
    };

    Controls.prototype.getCurrent = function(plotId) {
      if (plotId >= 0) {
        return this.current[plotId];
      }
      return this.current;
    };

    Controls.prototype.updateStationStates = function(plotId) {
      var _color, _index, dot_append, i, len, ref, region, results1, station;
      this.setCurrent(plotId);
      if (this.stations[plotId].length > 0) {
        ref = this.stations[plotId];
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          region = ref[i];
          region.displayed = [];
          results1.push((function() {
            var j, len1, ref1, results2;
            ref1 = region.dataloggers;
            results2 = [];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              station = ref1[j];
              station.displayed = false;
              station.color = "";
              _index = this.plotter.lib.indexOfValue(this.current[plotId], "dataLoggerId", station.id);
              if (_index > -1) {
                _color = this.current[plotId][_index].color;
                station.displayed = true;
                station.color = _color;
                dot_append = {
                  dataLoggerId: station.id,
                  color: _color
                };
                results2.push(region.displayed.push(dot_append));
              } else {
                results2.push(void 0);
              }
            }
            return results2;
          }).call(this));
        }
        return results1;
      }
    };

    Controls.prototype.appendStationDropdown = function(plotId, appendTarget, parameter) {
      var _, args, callback, current, target, uuid;
      target = location.protocol + "//dev.nwac.us/api/v5/dataloggerregion?sensor_name=" + parameter;
      _ = this;
      args = {};
      current = this.getCurrent(plotId);
      uuid = this.plotter.lib.uuid();
      callback = function(data) {
        var _region_name, html, i, j, len, len1, ref, ref1, region, station;
        _.stations[plotId] = data.responseJSON.results;
        html = "<div class=\"dropdown\"> <li><a id=\"" + uuid + "\" class=\"station-dropdown dropdown-toggle\" role=\"button\" title=\"Select Stations\" data-toggle=\"dropdown\" href=\"#\"> <i class=\"icon-list\"></i></a> <ul id=\"station-dropdown-" + plotId + "\" class=\"dropdown-menu pull-right\">";
        ref = _.stations[plotId];
        for (i = 0, len = ref.length; i < len; i++) {
          region = ref[i];
          _region_name = _.plotter.lib.toLower(region.name);
          html = html + " <li class=\"subheader\"> <a data-region=\"" + _region_name + "\" data-plot-id=\"" + plotId + "\" href=\"\"> <i class=\"icon-caret-down\" style=\"margin-right: 6px\"></i> <span class=\"region-name\">" + region.name + "</span> <span class=\"region-dots\"></span> </a> </li> <ul class=\"list-group-item sublist\" style=\"display: none;\">";
          ref1 = region.dataloggers;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            station = ref1[j];
            html = html + " <li class=\"station\" data-station-id=\"" + station.id + "\" data-plot-id=\"" + plotId + "\" style=\"padding: 1px 5px; cursor: pointer; list-style-type: none\"> <i class=\"icon-circle\"></i> <span class=\"station-name\"> " + station.datalogger_name + " | " + station.elevation + " ft </span> </li>";
          }
          html = html + " </ul>";
        }
        html = html + " </ul> </li>";
        $(appendTarget).prepend(html);
        $('#' + uuid).dropdown();
        _.bindSubMenuEvent(".subheader");
        _.setCurrent(plotId);
        _.updateStationDropdown(plotId);
        return _.appendStationMap(plotId, appendTarget, data.responseJSON.results);
      };
      return this.api.get(target, args, callback);
    };

    Controls.prototype.updateStationDropdown = function(plotId) {
      var _, __bindStationClicks, __buildDots, _background_color, _data_region, _dots_html, _font_weight, i, j, len, len1, ref, ref1, region, station;
      _ = this;
      this.updateStationStates(plotId);
      __buildDots = function(displayed) {
        var html, i, len, station;
        html = "";
        for (i = 0, len = displayed.length; i < len; i++) {
          station = displayed[i];
          html = html + " <i style=\"color: " + station.color + ";\" class=\"icon-circle\"></i>";
        }
        return html;
      };
      __bindStationClicks = function(plotId, plotter, station) {
        if (station.displayed) {
          return $("[data-station-id=\"" + station.id + "\"][data-plot-id=\"" + plotId + "\"]").off("click").on("click", function(event) {
            var _plotId;
            event.stopPropagation();
            _plotId = $(this).attr("data-plot-id");
            $(this).append("<i class=\"icon-spinner icon-spin\" data-plot-id=\"" + _plotId + "\"></i>");
            return plotter.removeStation(_plotId, $(this).attr("data-station-id"));
          });
        } else {
          return $("[data-station-id=\"" + station.id + "\"][data-plot-id=\"" + plotId + "\"]").off("click").on("click", function(event) {
            var _plotId;
            event.stopPropagation();
            _plotId = $(this).attr("data-plot-id");
            $(this).append("<i class=\"icon-spinner icon-spin\" data-plot-id=\"" + _plotId + "\"></i>");
            return plotter.addStation(_plotId, $(this).attr("data-station-id"));
          });
        }
      };
      ref = this.stations[plotId];
      for (i = 0, len = ref.length; i < len; i++) {
        region = ref[i];
        _data_region = this.plotter.lib.toLower(region.name);
        _dots_html = "";
        _font_weight = "";
        _background_color = "";
        if (region.displayed.length > 0) {
          _background_color = "rgb(248, 248, 248)";
          _font_weight = 700;
          _dots_html = __buildDots(region.displayed);
        }
        ref1 = region.dataloggers;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          station = ref1[j];
          $("[data-station-id=\"" + station.id + "\"][data-plot-id=\"" + plotId + "\"]> i.icon-circle").css("color", station.color);
          __bindStationClicks(plotId, _.plotter, station);
        }
        $("[data-region=\"" + _data_region + "\"][data-plot-id=\"" + plotId + "\"]").css("font-weight", _font_weight);
        $("[data-region=\"" + _data_region + "\"][data-plot-id=\"" + plotId + "\"] > span.region-dots").html(_dots_html);
      }
      if (this.plotter.legends[plotId] != null) {
        return this.plotter.legends[plotId].draw();
      }
    };

    Controls.prototype.removeSpinner = function(plotId) {
      return $("i.icon-spinner[data-plot-id=\"" + plotId + "\"]").remove();
    };

    Controls.prototype.appendParameterDropdown = function(plotId, appendTarget, dataLoggerId) {
      var _current, args, callback, current, target, uuid;
      target = location.protocol + "//dev.nwac.us/api/v5/sensortype?sensors__data_logger=" + dataLoggerId;
      args = {};
      current = this.getCurrent(plotId);
      uuid = this.plotter.lib.uuid();
      _current = [];
      callback = function(data) {
        var _add, _id, _prepend, html, i, id, len, parameter, ref, ref1;
        html = "<div class=\"dropdown\"> <li><a id=\"" + uuid + "\" class=\"parameter-dropdown dropdown-toggle\" role=\"button\" data-toggle=\"dropdown\" href=\"#\"> <i class=\"icon-list\"></i></a> <ul id=\"param-dropdown-" + plotId + "\" class=\"dropdown-menu pull-right\" role=\"menu\" aria-labelledby=\"" + uuid + "\">";
        ref = data.responseJSON.results;
        for (i = 0, len = ref.length; i < len; i++) {
          parameter = ref[i];
          if (parameter.field_name === "wind_speed_minimum" || parameter.field_name === "wind_speed_maximum") {

          } else if (parameter.field_name === "wind_speed_average") {
            _add = parameter.field_name;
            _id = _add.replace("_", "-");
            id = _id + "-plot-" + plotId;
            if (ref1 = current.variable, indexOf.call(parameter.field_name, ref1) >= 0) {
              _prepend = "<i id=\"" + id + "\" class=\"parameter-" + parameter.parameter + " icon-circle\" style=\"color: " + current.color + "\"></i>";
            }
          } else {
            _add = parameter.field_name;
            _id = _add.replace("_", "-");
            id = _id + "-plot-" + plotId;
            if (current.variable === parameter.field_name) {
              _prepend = "<i id=\"" + id + "\" class=\"icon-circle\" style=\"color: " + current.color + "\"></i>";
            } else {
              _prepend = "<i id=\"" + id + "\" class=\"icon-circle\" style=\"\"></i>";
            }
          }
          html = html + " <li><a style=\"cursor: pointer\" onclick=\"plotter.addVariable(" + plotId + ", '" + _add + "')\">" + _prepend + " " + parameter.sensortype_name + "</a></li>";
        }
        html = html + " </ul> </li> </div>";
        $(appendTarget).prepend(html);
        return $('#' + uuid).dropdown();
      };
      return this.api.get(target, args, callback);
    };

    Controls.prototype.appendStationMap = function(plotId, appendTarget, results) {
      var _, _bound_points, _bounds, _len, _point, _row_current, _row_id, color, current, dom_uuid, html, i, infowindow, j, k, len, len1, len2, marker, opacity, ref, region, scale, station;
      _ = this;
      current = this.getCurrent(plotId);
      dom_uuid = "map-control-" + this.plotter.plots[plotId].proto.options.uuid;
      html = "<li data-toggle=\"popover\" data-placement=\"left\"> <i id=\"map-" + plotId + "\" class=\"icon-map-marker\" title=\"Select Stations Map\" style=\"cursor: pointer\"></i> </li> <div class=\"popover\" style=\"max-width: 356px;\"> <div class=\"arrow\"></div> <div class=\"popover-content\"> <div id=\"" + dom_uuid + "\" style=\"width: 312px; height: 312px;\"></div> </div> </div>";
      $(appendTarget).prepend(html);
      $("#map-" + plotId).on('click', function() {
        return _.plotter.i.controls.toggleMap(plotId);
      });
      this.maps[plotId] = new google.maps.Map(document.getElementById(dom_uuid), {
        center: new google.maps.LatLng(46.980, -122.221),
        zoom: 6,
        maxZoom: 12,
        minZoom: 6,
        mapTypeId: 'terrain',
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      });
      infowindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true
      });
      this.markers[plotId] = [];
      this.listeners[plotId] = [];
      _bounds = new google.maps.LatLngBounds();
      _bound_points = [];
      for (i = 0, len = results.length; i < len; i++) {
        region = results[i];
        ref = region.dataloggers;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          station = ref[j];
          color = "rgb(200,200,200)";
          scale = 5;
          opacity = 0.5;
          _row_id = "map-plot-" + plotId + "-station-" + station.id;
          _row_current = _.isCurrent(current, 'dataLoggerId', station.id);
          if (_row_current) {
            color = _row_current.color;
            scale = 7;
            opacity = 0.8;
            _bound_points.push(new google.maps.LatLng(station.lat, station.lon));
          }
          marker = new google.maps.Marker({
            position: {
              lat: station.lat,
              lng: station.lon
            },
            id: _row_id,
            tooltip: station.datalogger_name + " - " + station.elevation + " ft",
            dataLoggerId: station.id,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: scale,
              strokeWeight: 2,
              fillOpacity: opacity,
              fillColor: color
            },
            selected: false
          });
          marker.addListener('mouseover', function() {
            infowindow.setContent(this.tooltip);
            return infowindow.open(_.maps[plotId], this);
          });
          marker.addListener('mouseout', function() {
            return infowindow.close();
          });
          this.listeners[plotId][_row_id] = marker.addListener('click', function() {
            return _.plotter.addStation(plotId, this.dataLoggerId);
          });
          _len = this.markers[plotId][_row_id] = marker;
          this.markers[plotId][_row_id].setMap(this.maps[plotId]);
        }
      }
      if (_bound_points.length > 0) {
        for (k = 0, len2 = _bound_points.length; k < len2; k++) {
          _point = _bound_points[k];
          _bounds.extend(_point);
        }
        console.log("Plot bounds & points", _bound_points, _bounds);
        this.maps[plotId].fitBounds(_bounds);
        this.maps[plotId].panToBounds(_bounds);
      }
      if (this.maps[plotId].getZoom() < 6) {
        return this.maps[plotId].setZoom(6);
      }
    };

    Controls.prototype.resetStationMap = function(plotId) {
      var _, _key, _marker, ref, results1;
      _ = this;
      ref = this.markers[plotId];
      results1 = [];
      for (_key in ref) {
        _marker = ref[_key];
        _marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5,
          strokeWeight: 2,
          fillOpacity: 0.5,
          fillColor: "rgb(200,200,200)"
        });
        _marker.set("selected", false);
        _.listeners[plotId][_key].remove();
        results1.push(_.listeners[plotId][_key] = _marker.addListener('click', function() {
          var _dataLoggerId;
          _dataLoggerId = this.get("dataLoggerId");
          return _.plotter.addStation(plotId, _dataLoggerId);
        }));
      }
      return results1;
    };

    Controls.prototype.updateStationMap = function(plotId) {
      var _, _id, _options, _row_id, key, ref, results1, row, updateMarker;
      _ = this;
      this.resetStationMap(plotId);
      updateMarker = function(plotId, rowId, color) {
        _.markers[plotId][rowId].setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          strokeWeight: 2,
          fillOpacity: 0.8,
          fillColor: color
        });
        _.markers[plotId][rowId].set("selected", true);
        _.listeners[plotId][rowId].remove();
        return _.listeners[plotId][rowId] = _.markers[plotId][rowId].addListener('click', function() {
          var _dataLoggerId;
          _dataLoggerId = this.get("dataLoggerId");
          return _.plotter.removeStation(plotId, _dataLoggerId);
        });
      };
      _options = this.plotter.plots[plotId].proto.options;
      ref = _options.y;
      results1 = [];
      for (key in ref) {
        row = ref[key];
        if (row.variable !== null) {
          _id = row.variable.replace('_', '-');
          _row_id = "map-plot-" + plotId + "-station-" + row.dataLoggerId;
          results1.push(updateMarker(plotId, _row_id, row.color));
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    Controls.prototype.boundOnSelected = function(plotId) {
      var _, _bound_points, _bounds, _key, _marker, _point, _selected, i, len, ref;
      _ = this;
      _bounds = new google.maps.LatLngBounds();
      _bound_points = [];
      ref = this.markers[plotId];
      for (_key in ref) {
        _marker = ref[_key];
        _selected = _marker.get("selected");
        if (_selected === true) {
          _bound_points.push(_marker.getPosition());
        }
      }
      for (i = 0, len = _bound_points.length; i < len; i++) {
        _point = _bound_points[i];
        _bounds.extend(_point);
      }
      this.maps[plotId].fitBounds(_bounds);
      if (this.maps[plotId].getZoom() < 6) {
        return this.maps[plotId].setZoom(6);
      }
    };

    Controls.prototype.toggleMap = function(plotId) {
      var _center, _nwac_offset_left, _nwac_offset_top, _offset, _uuid, _zoom;
      _uuid = this.plotter.plots[plotId].proto.options.uuid;
      _nwac_offset_left = 128;
      _nwac_offset_top = 256;
      if (location.origin === "http://localhost:5000") {
        _nwac_offset_left = 0;
        _nwac_offset_top = 0;
      }
      _center = this.plotter.i.controls.maps[plotId].getCenter();
      _zoom = this.plotter.i.controls.maps[plotId].getZoom();
      _offset = $("#map-control-" + _uuid).parent().parent().prev().offset();
      $("#map-control-" + _uuid).parent().parent().toggle().css("left", _offset.left - 356 - _nwac_offset_left).css("top", _offset.top - _nwac_offset_top);
      google.maps.event.trigger(this.plotter.i.controls.maps[plotId], 'resize');
      this.plotter.i.controls.maps[plotId].setCenter(_center);
      return this.plotter.i.controls.maps[plotId].setZoom(_zoom);
    };

    Controls.prototype.toggle = function(selector) {
      return $(selector).toggle();
    };

    Controls.prototype.move = function(plotId, appendTarget, direction) {
      var _, _dirText, html;
      _ = this;
      _dirText = direction === 'up' ? 'Up' : 'Down';
      html = "<i id=\"move-" + plotId + "-" + direction + "\" style=\"cursor: pointer;\" title=\"Move Plot " + _dirText + "\" class=\"icon-arrow-" + direction + "\"></i>";
      $(appendTarget).append(html);
      return $("#move-" + plotId + "-" + direction).on('click', function() {
        return _.plotter.move(plotId, direction);
      });
    };

    Controls.prototype.remove = function(plotId, appendTarget) {
      var _, html;
      _ = this;
      html = "<i id=\"remove-" + plotId + "\" style=\"cursor: pointer;\" title=\"Remove Plot\" class=\"icon-remove\"></i>";
      $(appendTarget).append(html);
      return $("#remove-" + plotId).on('click', function() {
        return _.plotter.remove(plotId);
      });
    };

    Controls.prototype["new"] = function(appendTarget) {
      var _, _params, _ul, html, i, j, len, len1, results1, row, uuid;
      _ = this;
      uuid = this.plotter.lib.uuid();
      _params = [
        {
          variable: "battery_voltage",
          title: "Battery Voltage"
        }, {
          variable: "net_solar",
          title: "Solar Radiation"
        }, {
          variable: "solar_pyranometer",
          title: "Solar Pyranometer"
        }, {
          variable: "relative_humidity",
          title: "Relative Humidity"
        }, {
          variable: "barometric_pressure",
          title: "Barometric Pressure"
        }, {
          variable: "snow_depth",
          title: "Snow Depth"
        }, {
          variable: "snowfall_24_hour",
          title: "24-Hour Snowfall"
        }, {
          variable: "intermittent_snow",
          title: "Intermittent Snow"
        }, {
          variable: "wind_direction",
          title: "Wind Direction"
        }, {
          variable: "precipitation",
          title: "Precipitation (Bar Plot)"
        }, {
          variable: "precipitation_line",
          title: "Precipitation (Line Plot)"
        }, {
          variable: "temperature",
          title: "Temperature"
        }, {
          variable: "equip_temperature",
          title: "Equipment Temperature"
        }, {
          variable: "wind_speed_average",
          title: "Wind Speed"
        }
      ];
      _ul = "<ul id=\"new-" + uuid + "-dropdown\" class=\"dropdown-menu pull-right\" role=\"menu\" aria-labelledby=\"new-" + uuid + "\"> <li><a id=\"new-" + uuid + "-parameter\" style=\"cursor: pointer\">Add Parameter Plot</a></li> <li><a id=\"new-" + uuid + "-station\" style=\"cursor: pointer\">Add Station Plot</a></li> </ul>";
      html = "<div class=\"dropdown\"> <li><a id=\"new-" + uuid + "\" class=\"dropdown-toggle\" title=\"Add New Plot\" data-toggle=\"dropdown\" role=\"button\" href=\"#\"> <i class=\"icon-plus\"></i></a> <ul class=\"dropdown-menu pull-right\" role=\"menu\" aria-labelledby=\"" + uuid + "\">";
      for (i = 0, len = _params.length; i < len; i++) {
        row = _params[i];
        html = html + " <li><a id=\"new_" + row.variable + "_" + uuid + "\" data-variable=\"" + row.variable + "\">" + row.title + "</a></li>";
      }
      html = html + " </ul> </li> </div>";
      $(appendTarget).append(html);
      results1 = [];
      for (j = 0, len1 = _params.length; j < len1; j++) {
        row = _params[j];
        results1.push($("#new_" + row.variable + "_" + uuid).off('click').on('click', function() {
          var _variable;
          _variable = $(this).attr("data-variable");
          return _.plotter.add("parameter", _variable);
        }));
      }
      return results1;
    };

    Controls.prototype.isCurrent = function(current, key, value) {
      var cKey, cValue;
      for (cKey in current) {
        cValue = current[cKey];
        if (cValue[key] === value) {
          return cValue;
        }
      }
      return false;
    };

    Controls.prototype.bindSubMenuEvent = function(target) {
      return $(target).unbind().on('click', function(event) {
        var next;
        event.preventDefault();
        event.stopPropagation();
        next = $(this).next();
        if (next.is(":visible")) {
          $(this).find("i").removeClass("icon-caret-up").addClass("icon-caret-down");
          return next.slideUp();
        } else {
          $(this).find("i").removeClass("icon-caret-down").addClass("icon-caret-up");
          return next.slideDown();
        }
      });
    };

    Controls.prototype.getLoggerName = function(plotId, dataLoggerId) {
      var key, outerKey, outerRow, ref, ref1, result, row;
      result = "Station";
      ref = this.stations[plotId];
      for (outerKey in ref) {
        outerRow = ref[outerKey];
        ref1 = outerRow.dataloggers;
        for (key in ref1) {
          row = ref1[key];
          if (row.id === parseInt(dataLoggerId)) {
            result = row.datalogger_name;
          }
        }
      }
      return result;
    };

    return Controls;

  })();

}).call(this);

(function() {
  var Crosshairs;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Crosshairs = Crosshairs = (function() {
    function Crosshairs(plotter) {
      this.preError = "Plotter.Crosshairs.";
      this.plotter = plotter;
    }

    Crosshairs.prototype.set = function(transform, mouse) {
      var i, len, plot, ref, results;
      ref = this.plotter.plots;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        if (plot != null) {
          results.push(plot.proto.setCrosshair(transform, mouse));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Crosshairs.prototype.show = function() {
      var i, len, plot, ref, results;
      ref = this.plotter.plots;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        if (plot != null) {
          results.push(plot.proto.showCrosshair());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Crosshairs.prototype.hide = function() {
      var i, len, plot, ref, results;
      ref = this.plotter.plots;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        if (plot != null) {
          results.push(plot.proto.hideCrosshair());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Crosshairs;

  })();

}).call(this);

(function() {
  var Data,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Plotter || (window.Plotter = {});

  window.Plotter.Data = Data = (function() {
    function Data(data) {
      var preError;
      this.preError = "Plotter.Data.";
      preError = this.preError + ".constructor(...)";
      if (!(data instanceof Array)) {
        console.log(preError + " data not of type array.");
        return;
      }
      this.data = $.extend(true, [], data);
      this.sourceCount = 1;
      this.test = function(row, joinRow, onKeys) {
        var _calculated, _required, j, len, testResult, testRow;
        preError = this.preError + "test(...):";
        if (!(onKeys != null)) {
          throw new Error(preError + " Missing onKeys (required)");
          return false;
        }
        _required = onKeys.length;
        _calculated = 0;
        testResult = false;
        for (j = 0, len = onKeys.length; j < len; j++) {
          testRow = onKeys[j];
          if (row[testRow] === void 0) {
            throw new Error(preError + " key '" + testRow + "' not found in primary data set.");
          }
          if (joinRow[testRow] === void 0) {
            throw new Error(preError + " key '" + testRow + "' not found in joining data set.");
          }
          if (row[testRow] instanceof Date) {
            if (row[testRow].getTime() === joinRow[testRow].getTime()) {
              _calculated++;
            }
          } else {
            if (row[testRow] === joinRow[testRow]) {
              _calculated++;
            }
          }
        }
        if (_calculated === _required) {
          testResult = true;
        }
        return testResult;
      };
    }

    Data.prototype.join = function(data, onKeys) {
      var _dataKeys, _key, _len, _offset, _primary, _protoKeys, _row, _secondary, _subKey, _test, _value, key, preError, result, row;
      preError = this.preError + ".join(data, onKeys)";
      result = [];
      _offset = "_" + (parseInt(this.sourceCount + 1));
      _protoKeys = Object.keys(this.data[0]);
      _dataKeys = Object.keys(data[0]);
      if (data.length > this.data.length) {
        _primary = $.extend(true, [], data);
        _secondary = $.extend(true, [], this.data);
      } else {
        _primary = $.extend(true, [], this.data);
        _secondary = $.extend(true, [], data);
      }
      for (key in _primary) {
        row = _primary[key];
        _len = result.push($.extend(true, {}, row));
        for (_key in _secondary) {
          _row = _secondary[_key];
          _test = this.test(row, _row, onKeys);
          if (_test) {
            for (_subKey in _row) {
              _value = _row[_subKey];
              if (indexOf.call(onKeys, _subKey) < 0) {
                result[_len - 1][_subKey + _offset] = _value;
              }
            }
            _secondary.splice(_key, 1);
            break;
          }
        }
      }
      this.sourceCount++;
      this.data = this._clean(result);
      return this.data;
    };

    Data.prototype.merge = function(data, onKeys) {
      var _dataKeys, _key, _len, _primary, _protoKeys, _row, _secondary, _subKey, _test, _value, key, preError, result, row;
      preError = this.preError + ".merge(data, onKeys)";
      result = [];
      _protoKeys = Object.keys(this.data[0]);
      _dataKeys = Object.keys(data[0]);
      if (data.length > this.data.length) {
        _primary = $.extend(true, [], data);
        _secondary = $.extend(true, [], this.data);
      } else {
        _primary = $.extend(true, [], this.data);
        _secondary = $.extend(true, [], data);
      }
      for (key in _primary) {
        row = _primary[key];
        _len = result.push($.extend(true, {}, row));
        for (_key in _secondary) {
          _row = _secondary[_key];
          _test = this.test(row, _row, onKeys);
          if (_test) {
            for (_subKey in _row) {
              _value = _row[_subKey];
              if (indexOf.call(onKeys, _subKey) < 0) {
                result[_len - 1][_subKey] = _value;
              }
            }
            _secondary.splice(_key, 1);
            break;
          }
        }
      }
      this.data = this._clean(result);
      return this.data;
    };

    Data.prototype.append = function(data, onKeys) {
      var _key, _primary, _row, _secondary, _subKey, _test, _value, key, preError, result, row;
      preError = this.preError + ".append(data, onKeys)";
      _primary = $.extend(true, [], this.data);
      _secondary = $.extend(true, [], data);
      for (key in _primary) {
        row = _primary[key];
        for (_key in _secondary) {
          _row = _secondary[_key];
          _test = this.test(row, _row, onKeys);
          if (_test) {
            for (_subKey in _row) {
              _value = _row[_subKey];
              if (indexOf.call(onKeys, _subKey) < 0) {
                _primary[key][_subKey] = _value;
              }
            }
            _secondary.splice(_key, 1);
          }
        }
      }
      result = _primary.concat(_secondary);
      this.data = this._clean(result);
      return this.data;
    };

    Data.prototype.appendKeys = function(data, append) {
      var key, result, row;
      result = [];
      for (key in data) {
        row = data[key];
        result[key + append] = row;
      }
      return this._clean(result);
    };

    Data.prototype.sub = function(start, end) {
      this.data = this._clean($.extend(true, [], this.data.slice(start, end)));
      return this.data;
    };

    Data.prototype.get = function() {
      return $.extend(true, [], this.data);
    };

    Data.prototype.getSourceCount = function() {
      return this.sourceCount;
    };

    Data.prototype._clean = function(data) {
      var _data, _len, i, j, ref;
      _data = $.extend(true, [], data);
      _len = _data.length - 1;
      for (i = j = 0, ref = _len; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (_data[i] === void 0) {
          _data.splice(i, 1);
        }
      }
      return $.extend(true, [], _data);
    };

    Data.prototype._tryError = function(data, preError) {
      var _len, i, j, ref, results;
      _len = data.length - 1;
      results = [];
      for (i = j = 0, ref = _len; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (data[i] === void 0) {
          console.log("@data[i] is (i, row)", i, row);
          throw new Error(preError + " undefined row");
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Data;

  })();

}).call(this);

(function() {
  var InitialSync;

  window.Plotter || (window.Plotter = {});

  window.Plotter.InitialSync = InitialSync = (function() {
    function InitialSync(plotter) {
      this.preError = "Plotter.InitialSync";
      this.plotter = plotter;
      this.api = this.plotter.i.api;
      this.requests = {};
      this.endpoint = function() {
        return this.plotter.options.href + "/api/v5/measurement";
      };
    }

    InitialSync.prototype.stageAll = function() {
      var j, plotId, ref, results;
      results = [];
      for (plotId = j = 0, ref = this.plotter.i.template.plotCount() - 1; 0 <= ref ? j <= ref : j >= ref; plotId = 0 <= ref ? ++j : --j) {
        results.push(this.stage(plotId));
      }
      return results;
    };

    InitialSync.prototype.stage = function(plotId) {
      var _plotTemplate, args, i, j, maxDatetime, ref, results, uuid;
      _plotTemplate = this.plotter.i.template.template[plotId];
      maxDatetime = _plotTemplate.x.max;
      results = [];
      for (i = j = 0, ref = this.plotter.i.template.dataSetCount(plotId) - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        args = this.plotter.i.template.forSync(plotId, i, maxDatetime, this.plotter.options.initialLength);
        uuid = this.plotter.lib.uuid();
        this.requests[uuid] = {
          plot: plotId,
          ready: false,
          requested: false
        };
        results.push(this.requests[uuid]['requested'] = this.get(plotId, i, uuid, args));
      }
      return results;
    };

    InitialSync.prototype.add = function(plotId) {
      var _plotTemplate, _state, args, j, len, limit, maxDatetime, plot, ref, uuid;
      ref = this.plotter.plots;
      for (j = 0, len = ref.length; j < len; j++) {
        plot = ref[j];
        if (plot !== void 0) {
          _state = plot.proto.getState();
          break;
        }
      }
      _plotTemplate = this.plotter.i.template.template[plotId];
      maxDatetime = this.plotter.lib.format(_state.range.data[0].max);
      limit = _state.length.data[0];
      args = this.plotter.i.template.forSync(plotId, 0, maxDatetime, limit);
      uuid = this.plotter.lib.uuid();
      this.requests[uuid] = {
        plotId: plotId,
        ready: false,
        requested: false
      };
      return this.requests[uuid]['requested'] = this.getAppend(plotId, 0, uuid, args);
    };

    InitialSync.prototype.get = function(plotId, dataSetId, uuid, args) {
      var _, callback, preError, target;
      preError = this.preError + ".get()";
      target = this.endpoint();
      _ = this;
      callback = function(data) {
        if (!(data.responseJSON != null)) {
          throw new Error(preError + " error requesting data.");
          return null;
        }
        if (data.responseJSON.results.length === 0) {
          throw new Error(preError + " no set found.");
          return null;
        }
        _.requests[uuid].ready = true;
        return _.plotter.plots[plotId].__data__[dataSetId] = data.responseJSON.results;
      };
      this.api.get(target, args, callback);
      return true;
    };

    InitialSync.prototype.getAppend = function(plotId, dataSetId, uuid, args) {
      var _, callback, preError, target;
      preError = this.preError + ".get()";
      target = this.endpoint();
      _ = this;
      callback = function(data) {
        var _transform, j, len, plot, ref;
        if (!(data.responseJSON != null)) {
          throw new Error(preError + " error requesting data.");
          return null;
        }
        if (data.responseJSON.results.length === 0) {
          throw new Error(preError + " no set found.");
          return null;
        }
        ref = _.plotter.plots;
        for (j = 0, len = ref.length; j < len; j++) {
          plot = ref[j];
          if (plot !== void 0) {
            _transform = plot.proto.transform;
            break;
          }
        }
        if (!(_.plotter.plots[plotId].__data__ != null)) {
          _.plotter.plots[plotId].__data__ = [];
        }
        _.requests[uuid].ready = true;
        _.plotter.plots[plotId].__data__[dataSetId] = data.responseJSON.results;
        _.plotter.plots[plotId].proto.skipBandDomainSet = true;
        _.plotter.plots[plotId].proto.setData(_.plotter.plots[plotId].__data__[dataSetId]);
        _.plotter.plots[plotId].proto.setBandDomain(_.plotter.bandDomain);
        _.plotter.plots[plotId].proto.append();
        _.plotter.plots[plotId].proto.setZoomTransform(_transform);
        if (!(_.plotter.legends[plotId] != null)) {
          _.plotter.legends[plotId] = new window.Plotter.Legend(_.plotter, plotId);
          _.plotter.legends[plotId].draw();
        }
        return _.plotter.i.controls.removeSpinner(plotId);
      };
      this.api.get(target, args, callback);
      return true;
    };

    InitialSync.prototype.isReady = function() {
      var count, key, ref, request;
      count = 0;
      ref = this.requests;
      for (key in ref) {
        request = ref[key];
        if (request.ready === false) {
          count++;
        }
      }
      return count === 0;
    };

    return InitialSync;

  })();

}).call(this);

(function() {
  var Legend;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Legend = Legend = (function() {
    function Legend(plotter, plotId) {
      var preError;
      this.preError = "Plotter.Legend.";
      preError = this.preError + ".constructor(...)";
      this.plotter = plotter;
      this.svg = this.plotter.plots[plotId].proto.svg;
      this.plotId = this.plotter.plots[plotId].proto.options.plotId;
      this.dimensions = this.plotter.plots[plotId].proto.definition.dimensions;
      this.legend = this.svg.append("g").attr("class", "legend");
    }

    Legend.prototype.set = function() {
      var _count, _datalogger, _options, _result, key, ref, row;
      this.data = [];
      _options = this.plotter.plots[this.plotId].proto.options;
      _count = 0;
      ref = _options.y;
      for (key in ref) {
        row = ref[key];
        _datalogger = this.plotter.i.controls.getLoggerName(this.plotId, row.dataLoggerId);
        _count++;
        _result = {
          offset: _count,
          title: "" + _datalogger,
          color: row.color
        };
        this.data.push(_result);
      }
      return this.data;
    };

    Legend.prototype.draw = function() {
      var _rect, _text;
      this.set();
      _rect = this.legend.selectAll("rect").data(this.data);
      _rect.attr("y", function(d) {
        return d.offset * 12;
      }).style("fill", function(d) {
        return d.color;
      });
      _rect.enter().append("rect").attr("rx", 1).attr("ry", 1).attr("width", 6).attr("height", 6).attr("x", this.dimensions.margin.left + 20).attr("y", function(d) {
        return d.offset * 12;
      }).style("fill", function(d) {
        return d.color;
      });
      _rect.exit().remove();
      _text = this.legend.selectAll("text").data(this.data);
      _text.attr("y", function(d) {
        return d.offset * 12 + 6;
      }).text(function(d) {
        return d.title;
      });
      _text.enter().append("text").attr("x", this.dimensions.margin.left + 30).attr("y", function(d) {
        return d.offset * 12 + 6;
      }).text(function(d) {
        return d.title;
      }).style("font-size", "12px").style("font-weight", 500);
      _text.exit().remove();
      return {
        remove: function() {
          return this.legend.selectAll(".legend").remove();
        }
      };
    };

    return Legend;

  })();

}).call(this);

(function() {
  var Library;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Library = Library = (function() {
    function Library(options) {
      var __options, defaults;
      defaults = {
        dateFormat: "%Y-%m-%dT%H:%M:%SZ"
      };
      __options = this.mergeDefaults(defaults, options);
      this.parseDate = d3.timeParse(__options.dateFormat);
      this.format = d3.utcFormat(__options.dateFormat);
      this.getNow = function() {
        return this.format(new Date());
      };
    }

    Library.prototype.mergeDefaults = function(args, defaults) {
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

    Library.prototype.indexOfValue = function(array, key, value) {
      var i, index, j, ref;
      index = -1;
      if (array.length > 0) {
        for (i = j = 0, ref = array.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          if (array[i] != null) {
            if (array[i][key] == value) {
              index = i;
            }
          }
        }
      }
      return index;
    };

    Library.prototype.uuid = function() {
      return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    };

    Library.prototype.utarget = function(prepend) {
      prepend = prepend.replace('#', '');
      return prepend + "-" + (this.uuid());
    };

    Library.prototype.toLower = function(string) {
      return string.replace(" ", "_").toLowerCase();
    };

    return Library;

  })();

}).call(this);

(function() {
  var LinePlot,
    slice = [].slice;

  window.Plotter || (window.Plotter = {});

  window.Plotter.LinePlot = LinePlot = (function() {
    function LinePlot(plotter, data, options) {
      var _domainMean, _domainScale, _y;
      this.preError = "LinePlot.";
      this.plotter = plotter;
      this.initialized = false;
      _y = [
        {
          dataLoggerId: null,
          variable: null,
          ticks: 5,
          min: null,
          max: null,
          maxBar: null,
          color: "rgb(41, 128, 185)",
          band: {
            minVariable: null,
            maxVariable: null
          }
        }
      ];
      this.defaults = {
        plotId: null,
        uuid: '',
        debug: true,
        target: null,
        width: null,
        merge: false,
        x: {
          variable: null,
          format: "%Y-%m-%dT%H:%M:%SZ",
          min: null,
          max: null,
          ticks: 7
        },
        y: _y,
        zoom: {
          scale: {
            min: 0.05,
            max: 5
          }
        },
        aspectDivisor: 5,
        transitionDuration: 500,
        weight: 2,
        axisColor: "rgb(0,0,0)",
        font: {
          weight: 100,
          size: 12
        },
        crosshairX: {
          weight: 1,
          color: "rgb(149,165,166)"
        },
        requestInterval: {
          data: 336
        }
      };
      if (options.x) {
        options.x = this.plotter.lib.mergeDefaults(options.x, this.defaults.x);
      }
      options.y[0] = this.plotter.lib.mergeDefaults(options.y[0], this.defaults.y[0]);
      this.options = this.plotter.lib.mergeDefaults(options, this.defaults);
      this.device = 'full';
      this.transform = d3.zoomIdentity;
      this.links = [
        {
          "variable": "battery_voltage",
          "title": "Battery Voltage"
        }, {
          "variable": "temperature",
          "title": "Temperature"
        }, {
          "variable": "relative_humidity",
          "title": "Relative Humidity"
        }, {
          "variable": "precipitation",
          "title": "Precipitation"
        }, {
          "variable": "snow_depth",
          "title": "Snow Depth"
        }, {
          "variable": "wind_direction",
          "title": "Wind Direction"
        }, {
          "variable": "wind_speed_average",
          "title": "Wind Speed"
        }, {
          "variable": "net_solar",
          "title": "Net Solar"
        }, {
          "variable": "solar_pyranometer",
          "title": "Solar Pyranometer"
        }, {
          "variable": "equip_temperature",
          "title": "Equipment Temperature"
        }, {
          "variable": "barometric_pressure",
          "title": "Barometric Pressure"
        }, {
          "variable": "snowfall_24_hour",
          "title": "24-Hr Snowfall"
        }, {
          "variable": "intermittent_snow",
          "title": "Intermittent Snow"
        }
      ];
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
      this.bisectDate = d3.bisector(function(d) {
        return d.x;
      }).left;
      this.sortDatetimeAsc = function(a, b) {
        return a.x - b.x;
      };
      this.data = this.processData(data);
      this.getDefinition();
      this.bands = [];
      this.lines = [];
      this.focusCircle = [];
      this.focusText = [];
      this.skipBandDomainSet = false;
      _domainScale = null;
      _domainMean = null;
      if (data.length > 0) {
        _domainScale = this.getDomainScale(this.definition.x);
        _domainMean = this.getDomainMean(this.definition.x);
      }
      this.state = {
        range: {
          data: [],
          scale: _domainScale
        },
        length: {
          data: []
        },
        interval: {
          data: []
        },
        zoom: 1,
        request: {
          data: []
        },
        requested: {
          data: []
        },
        mean: {
          scale: _domainMean
        }
      };
      if (data[0].length > 0) {
        this.setDataState();
        this.setIntervalState();
        this.setDataRequirement();
      }
    }

    LinePlot.prototype.processData = function(data) {
      var result, set, setId;
      result = [];
      for (setId in data) {
        set = data[setId];
        result[setId] = this.processDataSet(set, setId);
      }
      return result;
    };

    LinePlot.prototype.processDataSet = function(data, dataSetId) {
      var _result, _yOptions, key, result, row;
      _yOptions = this.options.y[dataSetId];
      result = [];
      for (key in data) {
        row = data[key];
        result[key] = {
          x: new Date(this.parseDate(row[this.options.x.variable]).getTime() - 8 * 3600000),
          y: row[_yOptions.variable]
        };
        if (_yOptions.band != null) {
          if (_yOptions.band.minVariable) {
            result[key].yMin = row[_yOptions.band.minVariable];
          }
          if (_yOptions.band.maxVariable) {
            result[key].yMax = row[_yOptions.band.maxVariable];
          }
        }
      }
      _result = new Plotter.Data(result);
      result = _result._clean(_result.get());
      return result.sort(this.sortDatetimeAsc);
    };

    LinePlot.prototype.setData = function(data) {
      var _domainMean, _domainScale;
      this.data = [this.processDataSet(data, 0)];
      this.getDefinition();
      _domainScale = null;
      _domainMean = null;
      if (data.length > 0) {
        _domainScale = this.getDomainScale(this.definition.x);
        _domainMean = this.getDomainMean(this.definition.x);
      }
      this.state.range.scale = _domainScale;
      this.state.mean.scale = _domainMean;
      if (data.length > 0) {
        this.setDataState();
        this.setIntervalState();
        return this.setDataRequirement();
      }
    };

    LinePlot.prototype.addData = function(data, dataSetId) {
      var _domainMean, _domainScale;
      this.data[dataSetId] = this.processDataSet(data, dataSetId);
      this.getDefinition();
      _domainScale = null;
      _domainMean = null;
      if (data.length > 0) {
        _domainScale = this.getDomainScale(this.definition.x);
        _domainMean = this.getDomainMean(this.definition.x);
      }
      this.state.range.scale = _domainScale;
      this.state.mean.scale = _domainMean;
      if (data.length > 0) {
        this.setDataState();
        this.setIntervalState();
        return this.setDataRequirement();
      }
    };

    LinePlot.prototype.appendData = function(data, dataSetId) {
      var _data, _set;
      _data = this.processDataSet(data, dataSetId);
      _set = new window.Plotter.Data(this.data[dataSetId]);
      _set.append(_data, ["x"]);
      this.data[dataSetId] = _set._clean(_set.get());
      this.data[dataSetId] = this.data[dataSetId].sort(this.sortDatetimeAsc);
      if (this.initialized) {
        this.setDataState();
        this.setIntervalState();
        return this.setDataRequirement();
      }
    };

    LinePlot.prototype.removeData = function(key) {
      if (key >= 0) {
        delete this.data[key];
        delete this.options[key];
        this.svg.select(".line-plot-area-" + key).remove();
        this.svg.select(".line-plot-path-" + key).remove();
        this.svg.select(".focus-circle-" + key).remove();
        this.svg.select(".focus-text-" + key).remove();
        if (this.initialized) {
          this.setDataState();
          this.setIntervalState();
          return this.setDataRequirement();
        }
      }
    };

    LinePlot.prototype.setDataState = function() {
      var _len, key, ref, results, row;
      _len = this.data.length - 1;
      ref = this.data;
      results = [];
      for (key in ref) {
        row = ref[key];
        this.state.range.data[key] = {
          min: d3.min(this.data[key], function(d) {
            return d.x;
          }),
          max: d3.max(this.data[key], function(d) {
            return d.x;
          })
        };
        results.push(this.state.length.data[key] = this.data[key].length);
      }
      return results;
    };

    LinePlot.prototype.setIntervalState = function() {
      var key, ref, results, row;
      ref = this.data;
      results = [];
      for (key in ref) {
        row = ref[key];
        results.push(this.state.interval.data[key] = {
          min: (this.state.range.scale.min.getTime() - this.state.range.data[key].min.getTime()) / 3600000,
          max: (this.state.range.data[key].max.getTime() - this.state.range.scale.max.getTime()) / 3600000
        });
      }
      return results;
    };

    LinePlot.prototype.setDataRequirement = function() {
      var _data_max, _now, key, ref, results, row;
      _now = new Date();
      ref = this.data;
      results = [];
      for (key in ref) {
        row = ref[key];
        _data_max = false;
        if (this.state.range.data[key].max.getTime() < (_now.getTime() - (3600000 * 2.5))) {
          _data_max = this.state.interval.data[key].max < this.options.requestInterval.data;
        }
        this.state.request.data[key] = {
          min: this.state.interval.data[key].min < this.options.requestInterval.data,
          max: _data_max
        };
        if (!(this.state.requested.data[key] != null)) {
          results.push(this.state.requested.data[key] = {
            min: false,
            max: false
          });
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    LinePlot.prototype.setZoomState = function(k) {
      return this.state.zoom = k;
    };

    LinePlot.prototype.getDomainScale = function(axis) {
      var result;
      return result = {
        min: axis.domain()[0],
        max: axis.domain()[1]
      };
    };

    LinePlot.prototype.getDomainMean = function(axis) {
      var center;
      center = new Date(d3.mean(axis.domain()));
      center.setHours(center.getHours() + Math.round(center.getMinutes() / 60));
      center.setMinutes(0);
      center.setSeconds(0);
      center.setMilliseconds(0);
      return center;
    };

    LinePlot.prototype.setBandDomain = function(bandDomain) {
      return this.definition.x1 = bandDomain;
    };

    LinePlot.prototype.getDefinition = function() {
      var _, _extent, preError;
      preError = this.preError + "getDefinition():";
      _ = this;
      this.definition = {};
      this.calculateChartDims();
      this.calculateAxisDims(this.data);
      this.definition.xAxis = d3.axisBottom().scale(this.definition.x).ticks(Math.round($(this.options.target).width() / 100));
      this.definition.yAxis = d3.axisLeft().scale(this.definition.y).ticks(this.options.y[0].ticks);
      this.definition.x.domain([this.definition.x.min, this.definition.x.max]);
      if (!this.skipBandDomainSet) {
        this.definition.x1.domain(this.data[0].map(function(d) {
          return d.x;
        }));
        this.skipBandDomainSet = false;
      }
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      _extent = [[-Infinity, 0], [this.definition.x(new Date()), this.definition.dimensions.innerHeight]];
      this.definition.zoom = d3.zoom().scaleExtent([this.options.zoom.scale.min, this.options.zoom.scale.max]).translateExtent(_extent).on("zoom", function() {
        var transform;
        transform = _.setZoomTransform();
        return _.plotter.i.zoom.set(transform);
      });
      this.definition.line = d3.line().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y(function(d) {
        return _.definition.y(d.y);
      });
      return this.definition.area = d3.area().defined(function(d) {
        return !isNaN(d.yMin) && d.yMin !== null && !isNaN(d.yMax) && d.yMax !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y0(function(d) {
        return _.definition.y(d.yMin);
      }).y1(function(d) {
        return _.definition.y(d.yMax);
      });
    };

    LinePlot.prototype.calculateChartDims = function() {
      var _height, height, margin, width;
      if (this.options.width != null) {
        width = Math.round(this.options.width);
      } else {
        width = Math.round($(this.options.target).width()) - 24;
      }
      height = Math.round(width / this.options.aspectDivisor);
      if (width > 1000) {
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.3)),
          bottom: Math.round(height * 0.12),
          left: Math.round(Math.pow(width, 0.6))
        };
      } else if (width > 600) {
        this.device = 'mid';
        this.options.font.size = this.options.font.size / 1.25;
        _height = this.options.aspectDivisor / 1.25;
        height = Math.round(width / _height);
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.3)),
          bottom: Math.round(height * 0.14),
          left: Math.round(Math.pow(width, 0.6))
        };
      } else {
        this.device = 'small';
        this.options.font.size = this.options.font.size / 1.5;
        _height = this.options.aspectDivisor / 1.5;
        height = Math.round(width / _height);
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.3)),
          bottom: Math.round(height * 0.18),
          left: Math.round(Math.pow(width, 0.6))
        };
      }
      this.definition.dimensions = {
        width: width,
        height: height,
        margin: margin
      };
      this.definition.dimensions.topPadding = parseInt(this.definition.dimensions.margin.top);
      this.definition.dimensions.bottomPadding = parseInt(this.definition.dimensions.height - this.definition.dimensions.margin.bottom);
      this.definition.dimensions.leftPadding = parseInt(this.definition.dimensions.margin.left);
      this.definition.dimensions.innerHeight = parseInt(this.definition.dimensions.height - this.definition.dimensions.margin.bottom - this.definition.dimensions.margin.top);
      this.definition.dimensions.innerWidth = parseInt(this.definition.dimensions.width - this.definition.dimensions.margin.left - this.definition.dimensions.margin.right);
      this.definition.x = d3.scaleTime().range([margin.left, width - margin.right]);
      this.definition.x1 = d3.scaleBand().rangeRound([margin.left, width - margin.right], 0.05).padding(0.1);
      return this.definition.y = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    };

    LinePlot.prototype.calculateAxisDims = function(data) {
      this.calculateXAxisDims(data);
      return this.calculateYAxisDims(data);
    };

    LinePlot.prototype.calculateXAxisDims = function(data) {
      if (this.options.x.min === null) {
        this.definition.x.min = d3.min(data[0], function(d) {
          return d.x;
        });
      } else {
        this.definition.x.min = this.parseDate(this.options.x.min);
      }
      if (this.options.x.max === null) {
        return this.definition.x.max = d3.max(data[0], function(d) {
          return d.x;
        });
      } else {
        return this.definition.x.max = this.parseDate(this.options.x.max);
      }
    };

    LinePlot.prototype.calculateYAxisDims = function(data) {
      var _setMax, _setMin, set, subId;
      this.definition.y.min = 0;
      this.definition.y.max = 0;
      for (subId in data) {
        set = data[subId];
        _setMin = d3.min([
          d3.min(set, function(d) {
            return d.y;
          }), d3.min(set, function(d) {
            return d.yMin;
          })
        ]);
        _setMax = d3.max([
          d3.max(set, function(d) {
            return d.y;
          }), d3.max(set, function(d) {
            return d.yMax;
          })
        ]);
        if (_setMin < this.definition.y.min || this.definition.y.min === void 0) {
          this.definition.y.min = _setMin;
        }
        if (_setMax > this.definition.y.max || this.definition.y.max === void 0) {
          this.definition.y.max = _setMax;
        }
      }
      if (this.definition.y.min === this.definition.y.max) {
        this.definition.y.min = this.definition.y.min * 0.8;
        this.definition.y.max = this.definition.y.min * 1.2;
      }
      if (this.options.y[0].min != null) {
        this.definition.y.min = this.options.y[0].min;
      }
      if (this.options.y[0].max != null) {
        return this.definition.y.max = this.options.y[0].max;
      }
    };

    LinePlot.prototype.preAppend = function() {
      var _, preError;
      preError = this.preError + "preAppend()";
      _ = this;
      this.outer = d3.select(this.options.target).append("div").attr("class", "line-plot-body").style("width", this.definition.dimensions.width + "px").style("height", this.definition.dimensions.height + "px").style("display", "inline-block");
      this.ctls = d3.select(this.options.target).append("div").attr("class", "plot-controls").style("width", '23px').style("height", this.definition.dimensions.height + "px").style("display", "inline-block").style("vertical-align", "top");
      this.svg = this.outer.append("svg").attr("class", "line-plot").attr("width", this.definition.dimensions.width).attr("height", this.definition.dimensions.height);
      this.svg.append("defs").append("clipPath").attr("id", this.options.target + "_clip").append("rect").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")");
      this.svg.append("g").attr("class", "line-plot-axis-x").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.xAxis).attr("transform", "translate(0, " + this.definition.dimensions.bottomPadding + ")");
      return this.svg.append("g").attr("class", "line-plot-axis-y").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.yAxis).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", 0)");
    };

    LinePlot.prototype.append = function() {
      var _, _y_offset, _y_title, _y_vert, key, preError, ref, ref1, row;
      this.initialized = true;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + "append()";
      _ = this;
      this.svg.select(".line-plot-axis-x").call(this.definition.xAxis);
      this.svg.select(".line-plot-axis-y").call(this.definition.yAxis);
      _y_title = "" + this.options.y[0].title;
      if (this.options.y[0].units) {
        _y_title = _y_title + " " + this.options.y[0].units;
      }
      _y_vert = -15;
      _y_offset = -52;
      if (this.device === 'small') {
        _y_vert = -10;
        _y_offset = -30;
      }
      this.svg.select(".line-plot-axis-y").append("text").text(_y_title).attr("class", "line-plot-y-label").attr("x", _y_vert).attr("y", _y_offset).attr("dy", ".75em").attr("transform", "rotate(-90)").style("font-size", this.options.font.size).style("font-weight", this.options.font.weight);
      this.lineWrapper = this.svg.append("g").attr("class", "line-wrapper");
      ref = this.data;
      for (key in ref) {
        row = ref[key];
        this.bands[key] = this.lineWrapper.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(row).attr("d", this.definition.area).attr("class", "line-plot-area-" + key).style("fill", this.options.y[key].color).style("opacity", 0.15).style("stroke", function() {
          return d3.color(_.options.y[key].color).darker(1);
        });
        this.lines[key] = this.lineWrapper.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(row).attr("d", this.definition.line).attr("class", "line-plot-path-" + key).style("stroke", this.options.y[key].color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      }
      if (this.options.y[0].maxBar != null) {
        this.lineWrapper.append("rect").attr("class", "line-plot-max-bar").attr("x", this.definition.dimensions.leftPadding).attr("y", this.definition.y(this.options.y[0].maxBar)).attr("width", this.definition.dimensions.innerWidth).attr("height", 1).style("color", '#gggggg').style("opacity", 0.4);
      }
      this.hoverWrapper = this.svg.append("g").attr("class", "hover-wrapper");
      this.crosshairs = this.hoverWrapper.append("g").attr("class", "crosshair");
      this.crosshairs.append("line").attr("class", "crosshair-x").style("stroke", this.options.crosshairX.color).style("stroke-width", this.options.crosshairX.weight).style("stroke-dasharray", "3, 3").style("fill", "none");
      this.crosshairs.append("rect").attr("class", "crosshair-x-under").style("fill", "rgb(255,255,255)").style("opacity", 0.1);
      ref1 = this.data;
      for (key in ref1) {
        row = ref1[key];
        this.focusCircle[key] = this.hoverWrapper.append("circle").attr("r", 4).attr("class", "focus-circle-" + key).attr("fill", this.options.y[key].color).attr("transform", "translate(-10, -10)").style("display", "none");
        this.focusText[key] = this.hoverWrapper.append("text").attr("class", "focus-text-" + key).attr("x", 9).attr("y", 7).style("display", "none").style("fill", this.options.y[key].color).style("text-shadow", "-2px -2px 0 rgb(255,255,255), 2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255), 2px 2px 0 rgb(255,255,255)");
      }
      this.overlay = this.svg.append("rect").attr("class", "plot-event-target");
      this.appendCrosshairTarget(this.transform);
      return this.appendZoomTarget(this.transform);
    };

    LinePlot.prototype.update = function() {
      var _, key, preError, ref, ref1, row;
      preError = this.preError + "update()";
      _ = this;
      ref = this.data;
      for (key in ref) {
        row = ref[key];
        if ((row != null) && (_.options.y[key] != null)) {
          if (this.svg.select(".line-plot-area-" + key).node() === null) {
            this.bands[key] = this.lineWrapper.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(row).attr("d", this.definition.area).attr("class", "line-plot-area-" + key).style("fill", this.options.y[key].color).style("opacity", 0.15).style("stroke", function() {
              return d3.color(_.options.y[key].color).darker(1);
            });
          } else {
            this.svg.select(".line-plot-area-" + key).datum(row).attr("d", this.definition.area).style("fill", this.options.y[key].color).style("stroke", function() {
              return d3.rgb(_.options.y[key].color).darker(1);
            });
          }
          if (this.svg.select(".line-plot-path-" + key).node() === null) {
            this.lines[key] = this.lineWrapper.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(row).attr("d", this.definition.line).attr("class", "line-plot-path-" + key).style("stroke", this.options.y[key].color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
            this.focusCircle[key] = this.hoverWrapper.append("circle").attr("r", 4).attr("class", "focus-circle-" + key).attr("fill", this.options.y[key].color).attr("transform", "translate(-10, -10)").style("display", "none");
            this.focusText[key] = this.hoverWrapper.append("text").attr("class", "focus-text-" + key).attr("x", 9).attr("y", 7).style("display", "none").style("fill", this.options.y[key].color).style("text-shadow", "-2px -2px 0 rgb(255,255,255), 2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255), 2px 2px 0 rgb(255,255,255)");
          } else {
            this.svg.select(".line-plot-path-" + key).datum(row).attr("d", this.definition.line).style("stroke", this.options.y[key].color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
          }
        }
      }
      this.overlay.remove();
      this.overlay = this.svg.append("rect").attr("class", "plot-event-target");
      this.appendCrosshairTarget(this.transform);
      this.appendZoomTarget(this.transform);
      this.calculateYAxisDims(this.data);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      ref1 = this.data;
      for (key in ref1) {
        row = ref1[key];
        this.svg.select(".line-plot-area-" + key).datum(row).attr("d", this.definition.area);
        this.svg.select(".line-plot-path-" + key).datum(row).attr("d", this.definition.line);
      }
      this.svg.select(".line-plot-axis-y").call(this.definition.yAxis);
      if (this.options.y[0].maxBar != null) {
        this.lineWrapper.select(".line-plot-max-bar").attr("y", this.definition.y(this.options.y[0].maxBar));
      }
      return this.setZoomTransform(this.transform);
    };

    LinePlot.prototype.appendCrosshairTarget = function(transform) {
      var _, preError;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + "appendCrosshairTarget()";
      _ = this;
      return this.overlay.datum(this.data).attr("class", "overlay").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")").style("fill", "none").style("pointer-events", "all").on("mouseover", function() {
        return _.plotter.i.crosshairs.show();
      }).on("mouseout", function() {
        return _.plotter.i.crosshairs.hide();
      }).on("mousemove", function() {
        var mouse;
        mouse = _.setCrosshair(transform);
        return _.plotter.i.crosshairs.set(transform, mouse);
      });
    };

    LinePlot.prototype.appendZoomTarget = function(transform) {
      var _, preError;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + "appendZoomTarget()";
      _ = this;
      this.overlay.attr("class", "zoom-pane").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")").style("fill", "none").style("pointer-events", "all").style("cursor", "move");
      return this.svg.call(this.definition.zoom, transform);
    };

    LinePlot.prototype.setZoomTransform = function(transform) {
      var _, _rescaleX, _transform, key, preError, ref, row;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + ".setZoomTransform(transform)";
      _ = this;
      if (transform != null) {
        this.transform = transform;
      } else if (d3.event != null) {
        this.transform = d3.event.transform;
      }
      _transform = this.transform;
      _rescaleX = _transform.rescaleX(this.definition.x);
      this.svg.select(".line-plot-axis-x").call(this.definition.xAxis.scale(_rescaleX));
      this.state.range.scale = this.getDomainScale(_rescaleX);
      this.state.mean.scale = this.getDomainMean(_rescaleX);
      this.setDataState();
      this.setIntervalState();
      this.setDataRequirement();
      this.setZoomState(_transform.k);
      this.definition.area = d3.area().defined(function(d) {
        return !isNaN(d.yMin) && d.yMin !== null && !isNaN(d.yMax) && d.yMax !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y0(function(d) {
        return _.definition.y(d.yMin);
      }).y1(function(d) {
        return _.definition.y(d.yMax);
      });
      this.definition.line = d3.line().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y(function(d) {
        return _.definition.y(d.y);
      });
      ref = this.data;
      for (key in ref) {
        row = ref[key];
        this.svg.select(".line-plot-area-" + key).attr("d", this.definition.area);
        this.svg.select(".line-plot-path-" + key).attr("d", this.definition.line);
      }
      this.appendCrosshairTarget(_transform);
      return _transform;
    };

    LinePlot.prototype.setCrosshair = function(transform, mouse) {
      var _, _datum, _dims, _mouseTarget, _value, cx, directionLabel, dx, dy, i, key, preError, ref, row, x0;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + ".setCrosshair(mouse)";
      _ = this;
      _dims = this.definition.dimensions;
      directionLabel = function(dir) {
        switch (false) {
          case !(dir > 360 || dir < 0):
            return "INV";
          case !(dir >= 0 && dir < 11.25):
            return "N";
          case !(dir >= 11.25 && dir < 33.75):
            return "NNE";
          case !(dir >= 33.75 && dir < 56.25):
            return "NE";
          case !(dir >= 56.25 && dir < 78.75):
            return "ENE";
          case !(dir >= 78.75 && dir < 101.25):
            return "E";
          case !(dir >= 101.25 && dir < 123.75):
            return "ESE";
          case !(dir >= 123.75 && dir < 146.25):
            return "SE";
          case !(dir >= 146.25 && dir < 168.75):
            return "SSE";
          case !(dir >= 168.75 && dir < 191.25):
            return "S";
          case !(dir >= 191.25 && dir < 213.75):
            return "SSW";
          case !(dir >= 213.75 && dir < 236.25):
            return "SW";
          case !(dir >= 236.25 && dir < 258.75):
            return "WSW";
          case !(dir >= 258.75 && dir < 281.25):
            return "W";
          case !(dir >= 281.25 && dir < 303.75):
            return "WNW";
          case !(dir >= 303.75 && dir < 326.25):
            return "NW";
          case !(dir >= 326.25 && dir < 348.75):
            return "NNW";
          case !(dir >= 348.75 && dir <= 360):
            return "N";
        }
      };
      ref = this.data;
      for (key in ref) {
        row = ref[key];
        _mouseTarget = this.overlay.node();
        _datum = row;
        mouse = mouse ? mouse : d3.mouse(_mouseTarget);
        x0 = this.definition.x.invert(mouse[0] + _dims.leftPadding);
        if (transform) {
          x0 = this.definition.x.invert(transform.invertX(mouse[0] + _dims.leftPadding));
        }
        i = _.bisectDate(_datum, x0, 1);
        if (x0.getTime() < this.state.range.data[key].min.getTime()) {
          i--;
        }
        if (x0.getTime() > this.state.range.data[key].max.getTime()) {
          i--;
        }
        i = x0.getMinutes() >= 30 ? i : i - 1;
        if (_datum[i] != null) {
          if (transform) {
            dx = transform.applyX(this.definition.x(_datum[i].x));
          } else {
            dx = this.definition.x(_datum[i].x);
          }
          dy = [];
          _value = [];
          if (this.options.y[key].variable !== null) {
            _value[key] = _datum[i];
            if (_value[key] != null) {
              dy[key] = this.definition.y(_value[key].y);
              if (!isNaN(dy[key]) && (_value[key].y != null)) {
                this.focusCircle[key].attr("transform", "translate(0, 0)");
              }
            }
          }
          cx = dx - _dims.leftPadding;
          if (cx >= 0) {
            this.crosshairs.select(".crosshair-x").attr("x1", cx).attr("y1", _dims.topPadding).attr("x2", cx).attr("y2", _dims.innerHeight + _dims.topPadding).attr("transform", "translate(" + _dims.leftPadding + ", 0)");
            this.crosshairs.select(".crosshair-x-under").attr("x", cx).attr("y", _dims.topPadding).attr("width", _dims.innerWidth - cx).attr("height", _dims.innerHeight).attr("transform", "translate(" + _dims.leftPadding + ", 0)");
          }
          if (this.options.y[key].variable !== null && !isNaN(dy[key]) && (_value[key].y != null)) {
            this.focusCircle[key].attr("cx", dx).attr("cy", dy[key]);
            this.focusText[key].attr("x", dx + _dims.leftPadding / 10).attr("y", dy[key] - _dims.topPadding / 10).text(_value[key].y ? _.options.y[0].variable === "wind_direction" ? directionLabel(_value[key].y) : _value[key].y.toFixed(1) + " " + this.options.y[key].units : void 0);
          }
        }
      }
      return mouse;
    };

    LinePlot.prototype.showCrosshair = function() {
      var ref, results, row, setId;
      if (!this.initialized) {
        return;
      }
      this.crosshairs.select(".crosshair-x").style("display", null);
      this.crosshairs.select(".crosshair-x-under").style("display", null);
      ref = this.options.y;
      results = [];
      for (setId in ref) {
        row = ref[setId];
        if (row.variable !== null) {
          if (this.focusCircle[setId] != null) {
            this.focusCircle[setId].style("display", null).attr("fill", row.color);
          }
          if (this.focusText[setId] != null) {
            results.push(this.focusText[setId].style("display", null).style("color", row.color).style("fill", row.color));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    LinePlot.prototype.hideCrosshair = function() {
      var ref, results, row, setId;
      if (!this.initialized) {
        return;
      }
      this.crosshairs.select(".crosshair-x").style("display", "none");
      this.crosshairs.select(".crosshair-x-under").style("display", "none");
      ref = this.options.y;
      results = [];
      for (setId in ref) {
        row = ref[setId];
        if (row.variable !== null) {
          if (this.focusCircle[setId] != null) {
            this.focusCircle[setId].style("display", "none");
          }
          if (this.focusText[setId] != null) {
            results.push(this.focusText[setId].style("display", "none"));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    LinePlot.prototype.appendTitle = function(title, subtitle) {
      var _mainSize, _offsetFactor, _subSize;
      _offsetFactor = 1;
      _mainSize = '16px';
      _subSize = '12px';
      if (this.device === 'small') {
        _offsetFactor = 0.4;
        _mainSize = '10px';
        _subSize = '7px';
      }
      this.title = this.svg.append("g").attr("class", "line-plot-title");
      this.title.append("text").attr("x", this.definition.dimensions.margin.left + 10).attr("y", this.definition.dimensions.margin.top / 2 - (4 * _offsetFactor)).style("font-size", _mainSize).style("font-weight", 600).text(title);
      if (subtitle) {
        return this.title.append("text").attr("x", this.definition.dimensions.margin.left + 10).attr("y", this.definition.dimensions.margin.top / 2 + (12 * _offsetFactor)).style("font-size", _subSize).text(subtitle);
      }
    };

    LinePlot.prototype.getState = function() {
      return this.state;
    };

    return LinePlot;

  })();

}).call(this);

(function() {
  var LiveSync;

  window.Plotter || (window.Plotter = {});

  window.Plotter.LiveSync = LiveSync = (function() {
    function LiveSync(plotter) {
      this.preError = "Plotter.LiveSync";
      this.plotter = plotter;
      this.api = this.plotter.i.api;
      this.requests = {};
      this.endpoint = function() {
        return this.plotter.options.href + "/api/v5/measurement";
      };
    }

    LiveSync.prototype.append = function(plotId, dataSetId, state) {
      var _now, args, currentMax, limit, maxDatetime, newMax, uuid;
      _now = new Date();
      if (state.range.data[dataSetId].max >= _now) {
        return true;
      }
      limit = this.plotter.options.updateLength;
      currentMax = state.range.data[dataSetId].max.getTime();
      newMax = new Date(currentMax + (this.plotter.options.updateLength * 3600000));
      if (newMax > _now) {
        limit = Math.round((newMax.getTime() - _now.getTime()) / 3600000);
      }
      maxDatetime = this.plotter.lib.format(new Date(newMax));
      if (limit < this.plotter.options.minUpdateLength) {
        return true;
      }
      args = this.plotter.i.template.forSync(plotId, dataSetId, maxDatetime, limit);
      uuid = this.plotter.lib.uuid();
      this.requests[uuid] = {
        ready: false,
        requested: false
      };
      return this.requests[uuid]['requested'] = this.get(plotId, dataSetId, uuid, args, "max");
    };

    LiveSync.prototype.prepend = function(plotId, dataSetId, state) {
      var args, limit, maxDatetime, uuid;
      maxDatetime = this.plotter.lib.format(state.range.data[dataSetId].min);
      limit = this.plotter.options.updateLength;
      args = this.plotter.i.template.forSync(plotId, dataSetId, maxDatetime, limit);
      uuid = this.plotter.lib.uuid();
      this.requests[uuid] = {
        ready: false,
        requested: false
      };
      return this.requests[uuid]['requested'] = this.get(plotId, dataSetId, uuid, args, "min");
    };

    LiveSync.prototype.add = function(plotId, dataSetId, state) {
      var _now, args, limit, maxDatetime, uuid;
      _now = new Date();
      if (state.range.data[0].max >= _now) {
        return true;
      }
      maxDatetime = this.plotter.lib.format(state.range.data[0].max);
      limit = state.length.data[0];
      args = this.plotter.i.template.forSync(plotId, dataSetId, maxDatetime, limit);
      uuid = this.plotter.lib.uuid();
      this.requests[uuid] = {
        ready: false,
        requested: false
      };
      return this.requests[uuid]['requested'] = this.getNew(plotId, dataSetId, uuid, args);
    };

    LiveSync.prototype.get = function(plotId, dataSetId, uuid, args, direction) {
      var _, callback, preError, target;
      preError = this.preError + ".get()";
      target = this.endpoint();
      _ = this;
      callback = function(data) {
        var _proto, _result;
        _proto = _.plotter.plots[plotId].proto;
        if (!(data.responseJSON != null)) {
          throw new Error(preError + " error requesting data.");
          return null;
        }
        _result = data.responseJSON.results;
        if (_.plotter.plots[plotId].__data__ === void 0) {
          throw new Error(preError + " appending to empty data set.");
          _.plotter.plots[plotId].__data__ = new window.Plotter.Data([]);
        }
        if (data.responseJSON.results.length === 0) {
          throw new Error(preError + " no new data found.");
          _result = [];
        }
        _proto.appendData(_result, dataSetId);
        _proto.update();
        _.requests[uuid].ready = true;
        _proto.state.requested.data[dataSetId][direction] = false;
        return _.plotter.updates = _.plotter.updates < 0 ? 0 : _.plotter.updates - 1;
      };
      this.api.get(target, args, callback);
      return true;
    };

    LiveSync.prototype.getNew = function(plotId, dataSetId, uuid, args) {
      var _, callback, preError, target;
      preError = this.preError + ".getNew()";
      target = this.endpoint();
      _ = this;
      callback = function(data) {
        var _proto, _result;
        _proto = _.plotter.plots[plotId].proto;
        if (!(data.responseJSON != null)) {
          throw new Error(preError + " error requesting data.");
          return null;
        }
        _result = data.responseJSON.results;
        if (_.plotter.plots[plotId].__data__ === void 0) {
          throw new Error(preError + " appending to empty data set.");
          _.plotter.plots[plotId].__data__ = new window.Plotter.Data([]);
        }
        if (data.responseJSON.results.length === 0) {
          throw new Error(preError + " no new data found.");
          _result = [];
        }
        _proto.addData(_result, dataSetId);
        _proto.update();
        _.requests[uuid].ready = true;
        _.plotter.i.controls.removeSpinner(plotId);
        return _.plotter.updates = _.plotter.updates < 0 ? 0 : _.plotter.updates - 1;
      };
      this.api.get(target, args, callback);
      return true;
    };

    return LiveSync;

  })();

}).call(this);

(function() {
  var Now;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Now = Now = (function() {
    function Now(format, datetime) {
      this.parse = function(datetime) {
        var _offset, newDatetime;
        if (datetime.indexOf("now") >= 0) {
          newDatetime = new Date();
          if (datetime.indexOf("(") >= 0) {
            _offset = parseInt(datetime.replace("(", "").replace(")", "").replace("now", ""));
            newDatetime = new Date(newDatetime.getTime() + (_offset * 3600000));
          }
          datetime = format(newDatetime);
        }
        return datetime;
      };
      this.datetime = this.parse(datetime);
      return this.datetime;
    }

    Now.prototype.set = function(datetime) {
      this.datetime = this.parse(datetime);
      return true;
    };

    Now.prototype.get = function() {
      return this.datetime;
    };

    return Now;

  })();

}).call(this);

(function() {
  var Handler;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Handler = Handler = (function() {
    function Handler(accessToken, options, plots) {
      var __accessToken, __href, __libDateFormat, __libOptions, access, defaults;
      this.preError = "Plotter.Handler";
      __libDateFormat = options.dateFormat ? options.dateFormat : "%Y-%m-%dT%H:%M:%SZ";
      __libOptions = {
        dateFormat: __libDateFormat
      };
      this.lib = new window.Plotter.Library(__libOptions);
      if (location.origin.indexOf(":5000") >= 0) {
        __href = "http://dev.nwac.us";
      } else {
        __href = location.origin;
      }
      defaults = {
        templateId: null,
        uuid: this.lib.uuid(),
        href: __href,
        target: null,
        dateFormat: "%Y-%m-%dT%H:%M:%SZ",
        refresh: 500,
        updateLength: 168,
        initialLength: 504,
        minUpdateLength: 1,
        updateLimit: 6,
        width: null
      };
      this.options = this.lib.mergeDefaults(options, defaults);
      __accessToken = {
        token: null,
        admin: false
      };
      access = this.lib.mergeDefaults(accessToken, __accessToken);
      this.isAdmin = function() {
        return access.admin;
      };
      this.i = {
        api: new window.Plotter.API(access.token),
        sapi: new window.Plotter.API(access.token, false)
      };
      this.i.template = new window.Plotter.Template(this);
      this.i.controls = new window.Plotter.Controls(this);
      this.i.initialsync = new window.Plotter.InitialSync(this);
      this.i.livesync = new window.Plotter.LiveSync(this);
      this.i.zoom = new window.Plotter.Zoom(this);
      this.i.crosshairs = new window.Plotter.Crosshairs(this);
      this.i.specs = new window.Plotter.Specs();
      this.i.colors = new window.Plotter.Colors();
      this.plots = [];
      this.legends = [];
      this.updates = 0;
      this.bandDomain = null;
      this.isReady = function() {
        return this.updates <= this.options.updateLimit;
      };
    }

    Handler.prototype.initialize = function() {
      var _, __wait;
      this.i.template.get();
      this.appendLoading();
      this.initializePlots();
      this.i.initialsync.stageAll();
      _ = this;
      __wait = function() {
        if (_.i.initialsync.isReady()) {
          _.append();
          _.removeLoading();
          return _.listen();
        } else {
          setTimeout(__wait, 100);
          return true;
        }
      };
      return __wait();
    };

    Handler.prototype.initializePlots = function() {
      var _plotRow, _template, key, results, row;
      _template = this.i.template.full();
      results = [];
      for (key in _template) {
        row = _template[key];
        _plotRow = {
          proto: null,
          __data__: []
        };
        results.push(this.plots[key] = _plotRow);
      }
      return results;
    };

    Handler.prototype.listen = function(test) {
      var dataSetId, plot, plotId, ref, ref1, request, state;
      ref = this.plots;
      for (plotId in ref) {
        plot = ref[plotId];
        if (plot != null) {
          if (plot.proto.initialized) {
            state = plot.proto.getState();
            ref1 = state.request.data;
            for (dataSetId in ref1) {
              request = ref1[dataSetId];
              if (request.min === true && this.isReady() && plot.proto.state.requested.data[dataSetId].min === false) {
                this.updates++;
                plot.proto.state.requested.data[dataSetId].min = true;
                this.i.livesync.prepend(plotId, dataSetId, state);
              }
              if (request.max === true && this.isReady() && plot.proto.state.requested.data[dataSetId].max === false) {
                this.updates++;
                plot.proto.state.requested.data[dataSetId].max = true;
                this.i.livesync.append(plotId, dataSetId, state);
              }
            }
          }
        }
      }
      if (!test) {
        return setTimeout(Plotter.Handler.prototype.listen.bind(this), this.options.refresh);
      }
    };

    Handler.prototype.append = function() {
      var _, _options, key, ref, row;
      _ = this;
      ref = this.plots;
      for (key in ref) {
        row = ref[key];
        row.uuid = this.lib.uuid();
        $(this.options.target).append("<div id=\"outer-" + row.uuid + "\"></div>");
        _options = this.i.template.forPlots(key);
        _options = this.i.colors.getInitial(_options);
        _options.target = "\#outer-" + row.uuid;
        _options.uuid = row.uuid;
        if (this.options.width != null) {
          _options.width = this.options.width;
        }
        if (_options.plotType === "bar") {
          row.proto = new window.Plotter.BarPlot(this, row.__data__, _options);
        } else {
          row.proto = new window.Plotter.LinePlot(this, row.__data__, _options);
        }
        row.proto.preAppend();
        row.proto.append();
        this.i.controls.append(key);
        this.legends[key] = new window.Plotter.Legend(this, key);
      }
      this.bandDomain = this.plots[0].proto.definition.x1;
      return this.appendSave();
    };

    Handler.prototype.appendLoading = function() {
      return $(this.options.target).append("<div class=\"plotter-loading\" style=\"text-align: center; \"> <span> <i class=\"icon-spinner icon-spin icon-large\"></i> Loading Plots... </span> </div>");
    };

    Handler.prototype.removeLoading = function() {
      return $(this.options.target).find(".plotter-loading").remove();
    };

    Handler.prototype.remove = function(plotId) {
      $(this.plots[plotId].proto.options.target).fadeOut(500, function() {
        return $(this).remove();
      });
      this.i.template.removePlot(plotId);
      return delete this.plots[plotId];
    };

    Handler.prototype.move = function(plotId, direction) {
      var _pageOrder, _primary, _swap, _template, _tradeKey, selected;
      _template = this.i.template.template;
      _primary = _template[plotId];
      _pageOrder = _primary.pageOrder;
      selected = $(this.plots[plotId].proto.options.target);
      if (direction === 'up') {
        if (_pageOrder > 1) {
          _tradeKey = this.lib.indexOfValue(_template, "pageOrder", _pageOrder - 1);
          _swap = _template[_tradeKey];
          _primary.pageOrder--;
          _swap.pageOrder++;
          return selected.prev().insertAfter(selected);
        }
      } else if (direction === 'down') {
        if (_pageOrder < _template.length) {
          _tradeKey = this.lib.indexOfValue(_template, "pageOrder", _pageOrder + 1);
          _swap = _template[_tradeKey];
          _primary.pageOrder++;
          _swap.pageOrder--;
          return selected.next().insertBefore(selected);
        }
      }
    };

    Handler.prototype.add = function(type, variable) {
      var _key, _plotType, _revisedOptions, _target, _yOptions, html, i, len, plot, ref, template, uuid;
      uuid = this.lib.uuid();
      _target = "outer-" + uuid;
      plot = {
        pageOrder: this.i.template.plotCount() + 1,
        type: type,
        target: '#' + _target,
        y: []
      };
      html = "<div id=\"" + _target + "\"></div>";
      $(this.options.target).append(html);
      _key = this.i.template.add(plot);
      this.plots[_key] = {};
      _plotType = this.i.specs.getPlotType(variable);
      if (variable === "precipitation_line") {
        variable = "precipitation";
        _plotType = "line";
      }
      if (_plotType === "bar") {
        this.plots[_key].proto = new window.Plotter.BarPlot(this, [[]], plot);
      } else {
        this.plots[_key].proto = new window.Plotter.LinePlot(this, [[]], plot);
      }
      this.plots[_key].proto.preAppend();
      this.plots[_key].proto.options.plotType = _plotType;
      this.plots[_key].proto.options.plotId = _key;
      this.plots[_key].proto.options.uuid = uuid;
      this.appendSave();
      _yOptions = this.i.specs.getOptions(variable, null);
      ref = this.i.template.template;
      for (i = 0, len = ref.length; i < len; i++) {
        template = ref[i];
        if (template !== void 0) {
          this.i.template.template[_key].x = $.extend(true, {}, template.x);
          break;
        }
      }
      this.i.template.template[_key].y = [_yOptions];
      _revisedOptions = this.i.template.forPlots(_key);
      this.plots[_key].proto.options.x = _revisedOptions.x;
      this.plots[_key].proto.options.y = _revisedOptions.y;
      return this.i.controls.append(_key);
    };

    Handler.prototype.addStation = function(plotId, dataLoggerId) {
      var _state, _yOptions, dataSetId, maxDatetime;
      if (!this.plots[plotId].proto.initialized) {
        this.plots[plotId].proto.options.y[0].dataLoggerId = dataLoggerId;
        this.plots[plotId].proto.options.y[0].color = this.i.colors.get(dataLoggerId);
        this.i.initialsync.add(plotId);
        this.i.controls.updateStationDropdown(plotId);
        this.i.controls.updateStationMap(plotId);
        return true;
      }
      if (this.plots[plotId].proto.options.plotType === 'bar') {
        this.i.controls.removeSpinner(plotId);
        alert("Bar plots only support one station. Please add a new Precipitation Line Plot to view multiple stations.");
        return false;
      }
      _state = this.plots[plotId].proto.getState();
      maxDatetime = _state.range.data[0].max.getTime();
      _yOptions = $.extend(true, {}, this.plots[plotId].proto.options.y[0]);
      _yOptions.dataLoggerId = dataLoggerId;
      _yOptions.color = this.i.colors.get(dataLoggerId);
      dataSetId = this.plots[plotId].proto.options.y.push(_yOptions) - 1;
      this.i.controls.updateStationDropdown(plotId);
      this.i.controls.updateStationMap(plotId);
      this.i.livesync.add(plotId, dataSetId, _state);
      return true;
    };

    Handler.prototype.removeStation = function(plotId, dataLoggerId) {
      var _key;
      _key = this.lib.indexOfValue(this.plots[plotId].proto.options.y, "dataLoggerId", dataLoggerId);
      if (_key > 0) {
        delete this.i.template.template[plotId].y[_key];
        this.plots[plotId].proto.removeData(_key);
        this.plots[plotId].proto.getDefinition();
        this.plots[plotId].proto.update();
        this.i.controls.updateStationDropdown(plotId);
        this.i.controls.updateStationMap(plotId);
      }
      return this.i.controls.removeSpinner(plotId);
    };

    Handler.prototype.appendSave = function() {
      var _;
      _ = this;
      $("#save-" + this.options.uuid).parent().remove();
      if (this.isAdmin() || (this.options.uuid != null)) {
        $(this.options.target).append("<small><a style=\"cusor:pointer\" id=\"save-" + this.options.uuid + "\">Save Template</a></small>");
        return $("#save-" + this.options.uuid).on("click", function(event) {
          return _.i.template.put();
        });
      }
    };

    return Handler;

  })();

}).call(this);

(function() {
  var Specs;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Specs = Specs = (function() {
    function Specs() {}

    Specs.prototype.getOptions = function(variable, dataLoggerId) {
      var _bounds, _info, yOptions;
      _bounds = this.getVariableBounds(variable);
      _info = this.getVariableInfo(variable);
      yOptions = {
        dataLoggerId: dataLoggerId,
        variable: variable,
        plotType: this.getPlotType(variable),
        min: _bounds.min,
        max: _bounds.max,
        maxBar: _bounds.maxBar,
        title: _info.title,
        units: _info.units
      };
      return yOptions;
    };

    Specs.prototype.getVariableBounds = function(variable) {
      var bounds;
      bounds = {
        battery_voltage: {
          min: 8,
          max: 16,
          maxBar: null
        },
        temperature: {
          min: null,
          max: null,
          maxBar: 32
        },
        equip_temperature: {
          min: null,
          max: null,
          maxBar: null
        },
        relative_humidity: {
          min: 0,
          max: 100,
          maxBar: null
        },
        net_solar: {
          min: 0,
          max: 800,
          maxBar: null
        },
        snow_depth: {
          min: 0,
          max: 200,
          maxBar: null
        },
        snowfall_24_hour: {
          min: 0,
          max: 30,
          maxBar: null
        },
        intermittent_snow: {
          min: 0,
          max: null,
          maxBar: null
        },
        wind_direction: {
          min: 0,
          max: 360,
          maxBar: null
        },
        precipitation: {
          min: 0,
          max: 0.4,
          maxBar: null
        },
        wind_speed_average: {
          min: 0,
          max: null,
          maxBar: null
        },
        solar_pyranometer: {
          min: 0,
          max: null,
          maxBar: null
        },
        barometric_pressure: {
          min: 950,
          max: 1050,
          maxBar: null
        }
      };
      return bounds[variable];
    };

    Specs.prototype.getVariableInfo = function(variable) {
      var info;
      info = {
        battery_voltage: {
          title: "Battery Voltage",
          units: "V"
        },
        net_solar: {
          title: "Solar Radiation",
          units: "W/m2"
        },
        solar_pyranometer: {
          title: "Solar Pyranometer",
          units: "W/m2"
        },
        relative_humidity: {
          title: "Relative Humidity",
          units: "%"
        },
        barometric_pressure: {
          title: "Barometric Pressure",
          units: "mb"
        },
        snow_depth: {
          title: "Snow Depth",
          units: "\""
        },
        snowfall_24_hour: {
          title: "24-Hour Snowfall",
          units: "\""
        },
        intermittent_snow: {
          title: "Intermittent Snow",
          units: "\""
        },
        wind_direction: {
          title: "Wind Direction",
          units: ""
        },
        precipitation: {
          title: "Precipitation",
          units: "\""
        },
        temperature: {
          title: "Temperature",
          units: "°F"
        },
        equip_temperature: {
          title: "Equipment Temperature",
          units: "°F"
        },
        wind_speed_average: {
          title: "Wind Speed",
          units: "mph"
        }
      };
      return info[variable];
    };

    Specs.prototype.getPlotType = function(variable) {
      switch (variable) {
        case "precipitation":
          return "bar";
        default:
          return "line";
      }
    };

    return Specs;

  })();

}).call(this);

(function() {
  var Template;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Template = Template = (function() {
    function Template(plotter) {
      this.preError = "Plotter.Template.";
      this.plotter = plotter;
      this.api = this.plotter.i.api;
      this.sapi = this.plotter.i.sapi;
      this.template = null;
      this.dataSets = 0;
      this.isValid = function(template) {
        var i, j, len, len1, ref, row, y;
        for (i = 0, len = template.length; i < len; i++) {
          row = template[i];
          if (row != null) {
            if (row.type === void 0) {
              return false;
            }
            if (row.x === void 0) {
              return false;
            }
            if (row.y === void 0) {
              return false;
            }
            if (row.x.variable === void 0) {
              return false;
            }
            if (row.x.min === void 0) {
              return false;
            }
            if (row.x.max === void 0) {
              return false;
            }
            if (row.y[0] === void 0) {
              return false;
            }
            ref = row.y;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              y = ref[j];
              if (y.dataLoggerId === void 0) {
                return false;
              }
              if (y.variable === void 0) {
                return false;
              }
              if (y.title === void 0) {
                return false;
              }
              if (y.units === void 0) {
                return false;
              }
            }
          }
        }
        return true;
      };
      this.newIsValid = function(template) {
        var i, len, row;
        for (i = 0, len = template.length; i < len; i++) {
          row = template[i];
          if (row != null) {
            if (row.type === void 0) {
              return false;
            }
          }
        }
        return true;
      };
      this.parse = function(templateData) {
        var __json, i, len, row;
        __json = JSON.parse(templateData).templateData;
        if (this.isValid(__json)) {
          for (i = 0, len = __json.length; i < len; i++) {
            row = __json[i];
            row.x.min = new window.Plotter.Now(this.plotter.lib.format, row.x.min).get();
            row.x.max = new window.Plotter.Now(this.plotter.lib.format, row.x.max).get();
          }
          return __json;
        } else {
          throw new Error("Plotter template format is invalid. Reference a working example.");
          return null;
        }
      };
      this.stringify = function() {
        var __prepared;
        __prepared = {
          templateData: this.template
        };
        return JSON.stringify(__prepared);
      };
      this.endpoint = function() {
        return this.plotter.options.href + "/api/v5/plothandler/";
      };
    }

    Template.prototype.get = function() {
      var _, args, callback, preError, target;
      preError = this.preError + "get()";
      target = this.endpoint() + this.plotter.options.templateId;
      args = null;
      _ = this;
      callback = function(data) {
        if (data.responseJSON === null || data.responseJSON.error) {
          throw new Error(preError + ".callback(data) error retrieving template.");
          return;
        }
        return _.template = _.parse(data.responseJSON.template_data);
      };
      return this.sapi.get(target, args, callback);
    };

    Template.prototype.put = function() {
      var _, args, callback, preError, target;
      preError = this.preError + "put()";
      if (!this.plotter.isAdmin() || !(this.plotter.options.uuid != null)) {
        throw new Error(preError + ", not authorized for PUT requests.");
        return false;
      }
      target = this.endpoint();
      args = {
        id: this.plotter.options.templateId,
        template_data: this.stringify(this.template)
      };
      _ = this;
      callback = function(data) {
        return console.log("Template PUT completed (data)", data);
      };
      return this.api.put(target, args, callback);
    };

    Template.prototype.add = function(options) {
      var _valid, key, preError;
      preError = this.preError + "add(options)";
      key = this.template.push(options) - 1;
      _valid = (function() {
        if (!this.newIsValid(this.template)) {
          throw new Error(preError + " template invalid after adding new plot.");
        }
      }).call(this);
      return key;
    };

    Template.prototype.plotCount = function() {
      return this.template.length;
    };

    Template.prototype.dataSetCount = function(plotId) {
      return this.template[plotId].y.length;
    };

    Template.prototype.full = function() {
      return this.template;
    };

    Template.prototype.forSync = function(plotId, lineId, maxDatetime, limit) {
      var _id, result;
      _id = null;
      if (this.template[plotId].y[lineId] != null) {
        _id = this.template[plotId].y[lineId].dataLoggerId;
      }
      result = {
        data_logger: _id,
        max_datetime: maxDatetime,
        limit: limit
      };
      return result;
    };

    Template.prototype.forControls = function() {};

    Template.prototype.forPlots = function(plotId) {
      var _row, _type, _x, _y, i, len, result;
      _x = this.template[plotId].x;
      _y = this.template[plotId].y;
      for (i = 0, len = _y.length; i < len; i++) {
        _row = _y[i];
        if (_row.variable === "wind_speed_average") {
          _row.band = {
            minVariable: "wind_speed_minimum",
            maxVariable: "wind_speed_maximum"
          };
        }
      }
      _type = "line";
      if (this.template[plotId].plotType !== void 0) {
        _type = this.template[plotId].plotType;
      }
      result = {
        plotId: plotId,
        plotType: _type,
        x: _x,
        y: _y
      };
      return result;
    };

    Template.prototype.removePlot = function(plotId) {
      return delete this.template[plotId];
    };

    return Template;

  })();

}).call(this);

(function() {
  var Zoom;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Zoom = Zoom = (function() {
    function Zoom(plotter) {
      this.preError = "Plotter.Zoom.";
      this.plotter = plotter;
    }

    Zoom.prototype.set = function(transform) {
      var i, len, plot, ref, results;
      ref = this.plotter.plots;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        if (plot != null) {
          results.push(plot.proto.setZoomTransform(transform));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Zoom;

  })();

}).call(this);
