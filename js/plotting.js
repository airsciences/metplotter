(function() {
  var API;

  window.Plotting || (window.Plotting = {});

  window.Plotting.API = API = (function() {
    function API(accessToken, async) {
      var preError;
      this.preError = "Plotting.API";
      preError = this.preError + ".constructor()";
      this.async = true;
      if (typeof async !== "undefined") {
        this.async = async;
      }
      this.getAccessToken = function() {
        return accessToken;
      };
      this.getAccessTokenValue = function() {
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
        console.log(preError + 'catch(error).', error);
      }
    };

    API.prototype.put = function() {
      var args, error, error1, preError, xhr;
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

    API.prototype.post = function() {
      var args, error, error1, preError, xhr;
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

    API.prototype["delete"] = function() {
      var args, error, error1, preError, xhr;
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
      var _initial, defaults;
      this.preError = "LinePlot.";
      defaults = {
        uuid: '',
        debug: true,
        target: null,
        dataParams: null,
        merge: false,
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
        yBand: {
          minVariable: null,
          maxVariable: null
        },
        y2: {
          variable: null,
          ticks: 5,
          min: null,
          max: null
        },
        y2Band: {
          minVariable: null,
          maxVariable: null
        },
        zoom: {
          scale: {
            min: 0.2,
            max: 5
          }
        },
        visible: {
          limit: 2190
        },
        aspectDivisor: 5,
        transitionDuration: 500,
        line1Color: "rgb(41, 128, 185)",
        line2Color: "rgb(39, 174, 96)",
        weight: 2,
        axisColor: "rgb(0,0,0)",
        font: {
          weight: 100,
          size: 12
        },
        crosshairX: {
          weight: 1,
          color: "rgb(149, 165, 166)"
        },
        requestInterval: {
          data: 336,
          visible: 336
        }
      };
      if (options.x) {
        options.x = Object.mergeDefaults(options.x, defaults.x);
      }
      if (options.y) {
        options.y = Object.mergeDefaults(options.y, defaults.y);
      }
      if (options.y2) {
        options.y2 = Object.mergeDefaults(options.y2, defaults.y2);
      }
      this.options = Object.mergeDefaults(options, defaults);
      this.device = 'full';
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
      if (this.options.merge) {
        _initial = this.mergeData(data.data);
        this.options.y2.variable = this.options.y.variable + "2";
        this.options.y2.units = "" + this.options.y.units;
      } else {
        _initial = this.processData(data.data);
      }
      this.data = {
        full: _initial.slice(0),
        visible: _initial.slice(0)
      };
      this.getDefinition();
      this.state = {
        range: {
          data: null,
          visible: null,
          scale: this.getDomainScale(this.definition.x)
        },
        length: {
          data: null,
          visible: null
        },
        interval: {
          data: null,
          visible: null
        },
        zoom: 1,
        request: {
          data: null,
          visible: null
        },
        mean: {
          scale: this.getDomainMean(this.definition.x)
        }
      };
      this.setDataState();
      this.setIntervalState();
      this.setDataRequirement();
    }

    LinePlot.prototype.processData = function(data) {
      var key, result, row;
      result = [];
      for (key in data) {
        row = data[key];
        result[key] = {
          x: new Date(this.parseDate(row[this.options.x.variable]).getTime() - 8 * 3600000),
          y: row[this.options.y.variable]
        };
        if (this.options.y2.variable !== null) {
          result[key].y2 = row[this.options.y2.variable];
        }
        if (this.options.yBand.minVariable !== null && this.options.yBand.maxVariable !== null) {
          result[key].yMin = row[this.options.yBand.minVariable];
          result[key].yMax = row[this.options.yBand.maxVariable];
        }
        if (this.options.y2Band.minVariable !== null && this.options.y2Band.maxVariable !== null) {
          result[key].y2Min = row[this.options.y2Band.minVariable];
          result[key].y2Max = row[this.options.y2Band.maxVariable];
        }
      }
      return result.sort(this.sortDatetimeAsc);
    };

    LinePlot.prototype.appendData = function(data) {
      var dtaRow, key, row;
      for (key in data) {
        row = data[key];
        dtaRow = {
          x: new Date(this.parseDate(row[this.options.x.variable]).getTime() - 8 * 3600000),
          y: row[this.options.y.variable]
        };
        if (this.options.y2.variable !== null) {
          dtaRow.y2 = row[this.options.y2.variable];
        }
        if (this.options.yBand.minVariable !== null && this.options.yBand.maxVariable !== null) {
          dtaRow.yMin = row[this.options.yBand.minVariable];
          dtaRow.yMax = row[this.options.yBand.maxVariable];
        }
        if (this.options.y2Band.minVariable !== null && this.options.y2Band.maxVariable !== null) {
          dtaRow.y2Min = row[this.options.y2Band.minVariable];
          dtaRow.y2Max = row[this.options.y2Band.maxVariable];
        }
        this.data.full.push(dtaRow);
      }
      this.data.full = this.data.full.sort(this.sortDatetimeAsc);
      this.setDataState();
      this.setIntervalState();
      return this.setDataRequirement();
    };

    LinePlot.prototype.mergeData = function(data) {
      var key, ref, result, row;
      result = [];
      ref = data[0];
      for (key in ref) {
        row = ref[key];
        result[key] = {
          x: new Date(this.parseDate(row[this.options.x.variable]).getTime() - 8 * 3600000),
          y: row[this.options.y.variable],
          y2: data[1][key][this.options.y.variable]
        };
        if (this.options.y2.variable !== null) {
          result[key].y2 = row[this.options.y2.variable];
        }
        if (this.options.yBand.minVariable !== null && this.options.yBand.maxVariable !== null) {
          result[key].yMin = row[this.options.yBand.minVariable];
          result[key].yMax = row[this.options.yBand.maxVariable];
          result[key].y2Min = row[this.options.y2Band.minVariable];
          result[key].y2Max = row[this.options.y2Band.maxVariable];
        }
      }
      return result.sort(this.sortDatetimeAsc);
    };

    LinePlot.prototype.appendMergeData = function(data) {
      var dtaRow, key, ref, row;
      ref = data[0];
      for (key in ref) {
        row = ref[key];
        dtaRow = {
          x: new Date(this.parseDate(row[this.options.x.variable]).getTime() - 8 * 3600000),
          y: row[this.options.y.variable],
          y2: data[1][key][this.options.y.variable]
        };
        if (this.options.y2.variable !== null) {
          dtaRow.y2 = row[this.options.y2.variable];
        }
        if (this.options.yBand.minVariable !== null && this.options.yBand.maxVariable !== null) {
          dtaRow.yMin = row[this.options.yBand.minVariable];
          dtaRow.yMax = row[this.options.yBand.maxVariable];
          dtaRow.y2Min = row[this.options.y2Band.minVariable];
          dtaRow.y2Max = row[this.options.y2Band.maxVariable];
        }
        this.data.full.push(dtaRow);
      }
      this.data.full = this.data.full.sort(this.sortDatetimeAsc);
      console.log("LinePlot.appendMergeData(data) (@data)", this.data);
      this.setDataState();
      this.setIntervalState();
      return this.setDataRequirement();
    };

    LinePlot.prototype.appendVisible = function(key, length) {
      var _append, _length, _max, _min, _visible;
      _min = key;
      _max = key + length;
      if (length < 0) {
        _min = key + length;
        _max = key;
      }
      _min = d3.max([0, _min]);
      _max = d3.min([_max, this.data.full.length]);
      _append = $.extend(true, [], this.data.full.slice(_min, _max));
      _length = _append.length;
      _visible = $.extend(true, [], this.data.visible);
      if (this.data.visible.length > this.options.visible.limit) {
        if (length > 0) {
          _visible = _visible.slice(0, _visible.length - 1 - _append.length);
        } else if (length < 0) {
          _visible = $.extend(true, [], this.data.visible.slice(_append.length, this.data.visible.length - 1));
        }
      }
      this.data.visible = [];
      this.data.visible = _visible.concat(_append);
      this.data.visible.sort(this.sortDatetimeAsc);
      this.update();
      this.setDataState();
      this.setIntervalState();
      return this.setDataRequirement();
    };

    LinePlot.prototype.setVisibleData = function() {
      var _data_key, _max, _min, key, preError, ref, ref1, row;
      preError = this.preError + "setVisibleData()";
      if (this.state.request.visible.min) {
        _min = this.data.visible[0];
        ref = this.data.full;
        for (key in ref) {
          row = ref[key];
          if (row.x.valueOf() === _min.x.valueOf()) {
            _data_key = parseInt(key);
            break;
          }
        }
        if (_data_key > 0) {
          this.appendVisible(_data_key, parseInt(-1 * this.options.requestInterval.visible));
        }
      }
      if (this.state.request.visible.max) {
        _max = this.data.visible[this.data.visible.length - 1];
        ref1 = this.data.full;
        for (key in ref1) {
          row = ref1[key];
          if (row.x.valueOf() === _max.x.valueOf()) {
            _data_key = parseInt(key);
            break;
          }
        }
        if (_data_key > 0) {
          return this.appendVisible(_data_key, parseInt(this.options.requestInterval.visible));
        }
      }
    };

    LinePlot.prototype.setDataState = function() {
      this.state.range.data = {
        min: d3.min(this.data.full, function(d) {
          return d.x;
        }),
        max: d3.max(this.data.full, function(d) {
          return d.x;
        })
      };
      this.state.range.visible = {
        min: d3.min(this.data.visible, function(d) {
          return d.x;
        }),
        max: d3.max(this.data.visible, function(d) {
          return d.x;
        })
      };
      this.state.length.data = this.data.full.length;
      return this.state.length.visible = this.data.visible.length;
    };

    LinePlot.prototype.setIntervalState = function() {
      this.state.interval.visible = {
        min: (this.state.range.scale.min.getTime() - this.state.range.visible.min.getTime()) / 3600000,
        max: (this.state.range.visible.max.getTime() - this.state.range.scale.max.getTime()) / 3600000
      };
      return this.state.interval.data = {
        min: (this.state.range.scale.min.getTime() - this.state.range.data.min.getTime()) / 3600000,
        max: (this.state.range.data.max.getTime() - this.state.range.scale.max.getTime()) / 3600000
      };
    };

    LinePlot.prototype.setDataRequirement = function() {
      var _data_max, _now, _visible_max;
      _now = new Date();
      _data_max = false;
      _visible_max = false;
      if (this.state.range.data.max < _now) {
        _data_max = this.state.interval.data.max < this.options.requestInterval.data;
      }
      if (this.state.range.visible.max < _now) {
        _visible_max = this.state.interval.visible.max < this.options.requestInterval.visible;
      }
      this.state.request.data = {
        min: this.state.interval.data.min < this.options.requestInterval.data,
        max: _data_max
      };
      return this.state.request.visible = {
        min: this.state.interval.visible.min < this.options.requestInterval.visible,
        max: _visible_max
      };
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

    LinePlot.prototype.getDefinition = function() {
      var _, _extent, preError;
      preError = this.preError + "getDefinition():";
      _ = this;
      this.definition = {
        colorScale: d3.schemeCategory20
      };
      this.calculateChartDims();
      this.calculateAxisDims(this.data.full);
      this.definition.xAxis = d3.axisBottom().scale(this.definition.x).ticks(Math.round($(this.options.target).width() / 100));
      this.definition.yAxis = d3.axisLeft().scale(this.definition.y).ticks(this.options.y.ticks);
      this.definition.x.domain([this.definition.x.min, this.definition.x.max]);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      _extent = [[-Infinity, 0], [this.definition.x(new Date()), this.definition.dimensions.innerHeight]];
      this.definition.zoom = d3.zoom().scaleExtent([this.options.zoom.scale.min, this.options.zoom.scale.max]).translateExtent(_extent).on("zoom", function() {
        var transform;
        transform = _.setZoomTransform();
        return plotter.zoom(transform);
      });
      this.definition.line = d3.line().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y(function(d) {
        return _.definition.y(d.y);
      }).curve(d3.curveMonotoneX);
      this.definition.line2 = d3.line().defined(function(d) {
        return !isNaN(d.y2) && d.y2 !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y(function(d) {
        return _.definition.y(d.y2);
      }).curve(d3.curveMonotoneX);
      this.definition.area = d3.area().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y0(function(d) {
        return _.definition.y(d.yMin);
      }).y1(function(d) {
        return _.definition.y(d.yMax);
      }).curve(d3.curveMonotoneX);
      return this.definition.area2 = d3.area().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y0(function(d) {
        return _.definition.y(d.y2Min);
      }).y1(function(d) {
        return _.definition.y(d.y2Max);
      }).curve(d3.curveMonotoneX);
    };

    LinePlot.prototype.calculateChartDims = function() {
      var height, margin, width;
      width = Math.round($(this.options.target).width());
      height = Math.round(width / this.options.aspectDivisor);
      if (width > 1000) {
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.6)),
          bottom: Math.round(height * 0.08),
          left: Math.round(Math.pow(width, 0.6))
        };
      } else if (width > 600) {
        this.device = 'mid';
        this.options.font.size = this.options.font.size / 1.25;
        height = Math.round(width / (this.options.aspectDivisor / 1.25));
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.6)),
          bottom: Math.round(height * 0.12),
          left: Math.round(Math.pow(width, 0.6))
        };
      } else {
        this.device = 'small';
        this.options.font.size = this.options.font.size / 1.5;
        height = Math.round(width / (this.options.aspectDivisor / 1.5));
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.6)),
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
      return this.definition.y = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    };

    LinePlot.prototype.calculateAxisDims = function(data) {
      this.calculateXAxisDims(data);
      return this.calculateYAxisDims(data);
    };

    LinePlot.prototype.calculateXAxisDims = function(data) {
      this.definition.x.min = this.options.x.min === null ? d3.min(data, function(d) {
        return d.x;
      }) : this.parseDate(this.options.x.min);
      return this.definition.x.max = this.options.x.max === null ? d3.max(data, function(d) {
        return d.x;
      }) : this.parseDate(this.options.x.max);
    };

    LinePlot.prototype.calculateYAxisDims = function(data) {
      this.definition.y.min = d3.min([
        d3.min(data, function(d) {
          return d.y;
        }), d3.min(data, function(d) {
          return d.y2;
        }), d3.min(data, function(d) {
          return d.yMin;
        }), d3.min(data, function(d) {
          return d.y2Min;
        })
      ]);
      this.definition.y.max = d3.max([
        d3.max(data, function(d) {
          return d.y;
        }), d3.max(data, function(d) {
          return d.y2;
        }), d3.max(data, function(d) {
          return d.yMax;
        }), d3.max(data, function(d) {
          return d.y2Max;
        })
      ]);
      if (this.definition.y.min === this.definition.y.max) {
        this.definition.y.min = this.definition.y.min * 0.8;
        this.definition.y.max = this.definition.y.min * 1.2;
      }
      this.definition.y.min = this.options.y.min === null ? this.definition.y.min : this.options.y.min;
      return this.definition.y.max = this.options.y.max === null ? this.definition.y.max : this.options.y.max;
    };

    LinePlot.prototype.append = function() {
      var _, _y2_title, _y_offset, _y_title, _y_vert, preError;
      preError = this.preError + "append()";
      _ = this;
      this.svg = d3.select(this.options.target).append("svg").attr("class", "line-plot").attr("width", this.definition.dimensions.width).attr("height", this.definition.dimensions.height);
      this.svg.append("defs").append("clipPath").attr("id", this.options.target + "_clip").append("rect").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")");
      this.svg.append("g").attr("class", "line-plot-axis-x").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.xAxis).attr("transform", "translate(0, " + this.definition.dimensions.bottomPadding + ")");
      this.svg.append("g").attr("class", "line-plot-axis-y").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.yAxis).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", 0)");
      _y_title = "" + this.options.y.title;
      if (this.options.y.units) {
        _y_title = _y_title + " " + this.options.y.units;
      }
      _y_vert = -95;
      _y_offset = -46;
      if (this.device === 'small') {
        _y_vert = -50;
        _y_offset = -30;
      }
      this.svg.select(".line-plot-axis-y").append("text").text(_y_title).attr("class", "line-plot-y-label").attr("x", _y_vert).attr("y", _y_offset).attr("dy", ".75em").attr("transform", "rotate(-90)").style("font-size", this.options.font.size).style("font-weight", this.options.font.weight);
      if (this.options.y2.title) {
        _y2_title = _y2_title + " " + this.options.y2.title;
      }
      if (this.options.y2.units) {
        _y2_title = _y2_title + " " + this.options.y2.units;
      }
      if (this.options.yBand.minVariable !== null && this.options.yBand.maxVariable !== null) {
        this.lineband = this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data.visible).attr("d", this.definition.area).attr("class", "line-plot-area").style("fill", this.options.line1Color).style("opacity", 0.15).style("stroke", function() {
          return d3.color(_.options.line1Color).darker(1);
        });
      }
      if (this.options.y2Band.minVariable !== null && this.options.y2Band.maxVariable !== null) {
        this.lineband2 = this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data.visible).attr("d", this.definition.area2).attr("class", "line-plot-area2").style("fill", this.options.line2Color).style("opacity", 0.25).style("stroke", function() {
          return d3.rgb(_.options.line2Color).darker(1);
        });
      }
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data.visible).attr("d", this.definition.line).attr("class", "line-plot-path").style("stroke", this.options.line1Color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data.visible).attr("d", this.definition.line2).attr("class", "line-plot-path2").style("stroke", this.options.line2Color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.crosshairs = this.svg.append("g").attr("class", "crosshair");
      this.crosshairs.append("line").attr("class", "crosshair-x").style("stroke", this.options.crosshairX.color).style("stroke-width", this.options.crosshairX.weight).style("stroke-dasharray", "3, 3").style("fill", "none");
      this.crosshairs.append("rect").attr("class", "crosshair-x-under").style("fill", "rgb(255,255,255)").style("opacity", 0.1);
      if (this.options.y.variable !== null) {
        this.focusCircle = this.svg.append("circle").attr("r", 4).attr("id", "focus-circle-1").attr("class", "focus-circle").attr("fill", this.options.line1Color).attr("transform", "translate(-10, -10)");
        this.focusText = this.svg.append("text").attr("id", "focus-text-1").attr("class", "focus-text").attr("x", 9).attr("y", 7).style("fill", this.options.line1Color).style("text-shadow", "-2px -2px 0 rgb(255,255,255), 2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255), 2px 2px 0 rgb(255,255,255)");
      }
      if (this.options.y2.variable !== null) {
        this.focusCircle2 = this.svg.append("circle").attr("r", 4).attr("id", "focus-circle-2").attr("class", "focus-circle").attr("fill", this.options.line2Color).attr("transform", "translate(-10, -10)");
        this.focusText2 = this.svg.append("text").attr("id", "focus-text-2").attr("class", "focus-text").attr("x", 9).attr("y", 7).style("fill", this.options.line2Color).style("text-shadow", "-2px -2px 0 rgb(255,255,255), 2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255), 2px 2px 0 rgb(255,255,255)");
      }
      this.overlay = this.svg.append("rect").attr("class", "plot-event-target");
      this.appendCrosshairTarget();
      return this.appendZoomTarget();
    };

    LinePlot.prototype.update = function() {
      var _, preError;
      preError = this.preError + "update()";
      _ = this;
      this.svg.select(".line-plot-area").datum(this.data.visible).attr("d", this.definition.area);
      this.svg.select(".line-plot-area2").datum(this.data.visible).attr("d", this.definition.area2);
      this.svg.select(".line-plot-path").datum(this.data.visible).attr("d", this.definition.line);
      this.svg.select(".line-plot-path2").datum(this.data.visible).attr("d", this.definition.line2);
      this.overlay.datum(this.data.visible);
      this.calculateYAxisDims(this.data.visible);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      this.svg.select(".line-plot-area").datum(this.data.visible).attr("d", this.definition.area);
      this.svg.select(".line-plot-area2").datum(this.data.visible).attr("d", this.definition.area2);
      this.svg.select(".line-plot-path").datum(this.data.visible).attr("d", this.definition.line);
      this.svg.select(".line-plot-path2").datum(this.data.visible).attr("d", this.definition.line2);
      return this.svg.select(".line-plot-axis-y").call(this.definition.yAxis);
    };

    LinePlot.prototype.appendCrosshairTarget = function(transform) {
      var _, preError;
      preError = this.preError + "appendCrosshairTarget()";
      _ = this;
      return this.overlay.datum(this.data.visible).attr("class", "overlay").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")").style("fill", "none").style("pointer-events", "all").on("mouseover", function() {
        return plotter.showCrosshairs();
      }).on("mouseout", function() {
        return plotter.hideCrosshairs();
      }).on("mousemove", function() {
        var mouse;
        mouse = _.setCrosshair(transform);
        return plotter.crosshair(transform, mouse);
      });
    };

    LinePlot.prototype.appendZoomTarget = function() {
      var _, preError;
      preError = this.preError + "appendZoomTarget()";
      _ = this;
      return this.overlay.attr("class", "zoom-pane").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")").style("fill", "none").style("pointer-events", "all").style("cursor", "move").call(this.definition.zoom, d3.zoomIdentity);
    };

    LinePlot.prototype.setZoomTransform = function(transform) {
      var _, _rescaleX, _transform, preError;
      preError = this.preError + ".setZoomTransform(transform)";
      _ = this;
      _transform = transform ? transform : d3.event.transform;
      _rescaleX = _transform.rescaleX(this.definition.x);
      this.svg.select(".line-plot-axis-x").call(this.definition.xAxis.scale(_rescaleX));
      this.state.range.scale = this.getDomainScale(_rescaleX);
      this.state.mean.scale = this.getDomainMean(_rescaleX);
      this.setDataState();
      this.setIntervalState();
      this.setDataRequirement();
      this.setZoomState(_transform.k);
      this.definition.area = d3.area().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y0(function(d) {
        return _.definition.y(d.yMin);
      }).y1(function(d) {
        return _.definition.y(d.yMax);
      }).curve(d3.curveMonotoneX);
      this.svg.select(".line-plot-area").attr("d", this.definition.area);
      this.definition.line = d3.line().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y(function(d) {
        return _.definition.y(d.y);
      }).curve(d3.curveMonotoneX);
      this.svg.select(".line-plot-path").attr("d", this.definition.line);
      this.definition.area2 = d3.area().defined(function(d) {
        return !isNaN(d.y2Max) && d.y2Max !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y0(function(d) {
        return _.definition.y(d.y2Min);
      }).y1(function(d) {
        return _.definition.y(d.y2Max);
      }).curve(d3.curveMonotoneX);
      this.svg.select(".line-plot-area2").attr("d", this.definition.area2);
      this.definition.line2 = d3.line().defined(function(d) {
        return !isNaN(d.y2) && d.y2 !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y(function(d) {
        return _.definition.y(d.y2);
      }).curve(d3.curveMonotoneX);
      this.svg.select(".line-plot-path2").attr("d", this.definition.line2);
      this.appendCrosshairTarget(_transform);
      return _transform;
    };

    LinePlot.prototype.setCrosshair = function(transform, mouse) {
      var _, _datum, _dims, _mouseTarget, cx, d, dx, dy, dy2, i, preError, x0, ypos;
      preError = this.preError + ".setCrosshair(mouse)";
      _ = this;
      _dims = this.definition.dimensions;
      _mouseTarget = this.overlay.node();
      _datum = this.overlay.datum();
      mouse = mouse ? mouse : d3.mouse(_mouseTarget);
      x0 = this.definition.x.invert(mouse[0] + _dims.leftPadding);
      if (transform) {
        x0 = this.definition.x.invert(transform.invertX(mouse[0] + _dims.leftPadding));
      }
      i = _.bisectDate(_datum, x0, 1);
      d = x0.getMinutes() >= 30 ? _datum[i] : _datum[i - 1];
      if (x0.getTime() < this.state.range.visible.min.getTime()) {
        d = _datum[i - 1];
      }
      if (x0.getTime() > this.state.range.visible.max.getTime()) {
        d = _datum[i - 1];
      }
      dx = transform ? transform.applyX(this.definition.x(d.x)) : this.definition.x(d.x);
      if (this.options.y.variable !== null) {
        dy = this.definition.y(d.y);
        this.focusCircle.attr("transform", "translate(0, 0)");
      }
      if (this.options.y2.variable !== null) {
        dy2 = this.definition.y(d.y2);
        this.focusCircle2.attr("transform", "translate(0, 0)");
      }
      cx = dx - _dims.leftPadding;
      this.crosshairs.select(".crosshair-x").attr("x1", cx).attr("y1", _dims.topPadding).attr("x2", cx).attr("y2", _dims.innerHeight + _dims.topPadding).attr("transform", "translate(" + _dims.leftPadding + ", 0)");
      this.crosshairs.select(".crosshair-x-under").attr("x", cx).attr("y", _dims.topPadding).attr("width", _dims.innerWidth - cx).attr("height", _dims.innerHeight).attr("transform", "translate(" + _dims.leftPadding + ", 0)");
      if (this.options.y.variable !== null) {
        this.focusCircle.attr("cx", dx).attr("cy", dy);
        this.focusText.attr("x", dx + _dims.leftPadding / 10).attr("y", dy - _dims.topPadding / 10).text(d.y.toFixed(2) + " " + this.options.y.units);
      }
      if (this.options.y2.variable !== null) {
        this.focusCircle2.attr("cx", dx).attr("cy", dy2);
        this.focusText2.attr("x", dx + _dims.leftPadding / 10).attr("y", dy2 - _dims.topPadding / 10).text(d.y2.toFixed(2) + " " + this.options.y2.units);
      }
      if (this.options.y.variable !== null && this.options.y2.variable !== null) {
        ypos = [];
        this.svg.selectAll('.focus-text').attr("transform", function(d, i) {
          var row;
          row = {
            ind: i,
            y: parseInt(d3.select(this).attr("y")),
            offset: 0
          };
          ypos.push(row);
          return "";
        }).call(function(sel) {
          ypos.sort(function(a, b) {
            return a.y - b.y;
          });
          return ypos.forEach((function(p, i) {
            var offset;
            if (i > 0) {
              offset = Math.max(0, (ypos[i - 1].y + 18) - ypos[i].y);
              if (ypos[i].ind === 0) {
                offset = -offset;
              }
              return ypos[i].offset = offset;
            }
          }));
        }).attr("transform", function(d, i) {
          return "translate (0, " + ypos[i].offset + ")";
        });
      }
      return mouse;
    };

    LinePlot.prototype.showCrosshair = function() {
      this.crosshairs.select(".crosshair-x").style("display", null);
      this.crosshairs.select(".crosshair-x-under").style("display", null);
      if (this.options.y.variable !== null) {
        this.focusCircle.style("display", null);
        this.focusText.style("display", null);
      }
      if (this.options.y2.variable !== null) {
        this.focusCircle2.style("display", null);
        return this.focusText2.style("display", null);
      }
    };

    LinePlot.prototype.hideCrosshair = function() {
      this.crosshairs.select(".crosshair-x").style("display", "none");
      this.crosshairs.select(".crosshair-x-under").style("display", "none");
      if (this.options.y.variable !== null) {
        this.focusCircle.style("display", "none");
        this.focusText.style("display", "none");
      }
      if (this.options.y2.variable !== null) {
        this.focusCircle2.style("display", "none");
        return this.focusText2.style("display", "none");
      }
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
  var Handler;

  window.Plotting || (window.Plotting = {});

  window.Plotting.Handler = Handler = (function() {
    function Handler(access, options, plots) {
      var accessToken, defaults;
      this.preError = "Plotting.Handler";
      defaults = {
        target: null,
        dateFormat: "%Y-%m-%dT%H:%M:%SZ",
        refresh: 100,
        updateLength: 256,
        colors: {
          light: ["rgb(53, 152, 219)", "rgb(241, 196, 14)", "rgb(155, 88, 181)", "rgb(27, 188, 155)", "rgb(52, 73, 94)", "rgb(231, 126, 35)", "rgb(45, 204, 112)", "rgb(232, 76, 61)", "rgb(149, 165, 165)"],
          dark: ["rgb(45, 62, 80)", "rgb(210, 84, 0)", "rgb(39, 174, 97)", "rgb(192, 57, 43)", "rgb(126, 140, 141)", "rgb(42, 128, 185)", "rgb(239, 154, 15)", "rgb(143, 68, 173)", "rgb(23, 160, 134)"]
        }
      };
      this.options = Object.mergeDefaults(options, defaults);
      this.now = new Date();
      this.endpoint = null;
      accessToken = {
        token: null,
        expires: null,
        expired: true
      };
      access = Object.mergeDefaults(access, accessToken);
      this.api = new window.Plotting.API(access.token);
      this.syncronousapi = new window.Plotting.API(access.token, false);
      this.parseDate = d3.timeParse(this.options.dateFormat);
      this.format = d3.utcFormat(this.options.dateFormat);
      this.getNow = function() {
        return this.format(this.now);
      };
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

    Handler.prototype.initialize = function() {
      this.getTemplate();
      this.getTemplatePlotData();
      this.append();
      this.listen();
      return this.listenViewport();
    };

    Handler.prototype.listen = function() {
      var key, plot, ref, state;
      ref = this.template;
      for (key in ref) {
        plot = ref[key];
        state = plot.proto.getState();
        if (state.request.data.min) {
          this.prependData(key);
        }
        if (state.request.data.max) {
          this.appendData(key);
        }
      }
      return setTimeout(Plotting.Handler.prototype.listen.bind(this), this.options.refresh);
    };

    Handler.prototype.listenViewport = function() {
      var key, plot, ref, state;
      ref = this.template;
      for (key in ref) {
        plot = ref[key];
        state = plot.proto.getState();
        if (state.request.visible.min) {
          plot.proto.setVisibleData();
        }
        if (state.request.visible.max) {
          plot.proto.setVisibleData();
        }
      }
      return setTimeout(Plotting.Handler.prototype.listenViewport.bind(this), this.options.refreshViewport);
    };

    Handler.prototype.getTemplate = function(template_uri) {
      var _, args, callback, preError, target;
      preError = this.preError + ".getTemplate(...)";
      target = "template/" + this.options.plotHandlerId;
      args = null;
      _ = this;
      callback = function(data) {
        if (data.responseJSON === null || data.responseJSON.error) {
          console.log(preError + ".callback(...) error detected (data)", data);
          return;
        }
        return _.template = data.responseJSON.templateData;
      };
      return this.syncronousapi.get(target, args, callback);
    };

    Handler.prototype.getStationParamData = function(plotId, key) {
      var _, _is_array, args, callback, preError, target;
      preError = this.preError + ".getStationParamData()";
      target = location.protocol + "//dev.nwac.us/api/v5/measurement";
      _ = this;
      _is_array = this.template[plotId].dataParams instanceof Array;
      if (_is_array) {
        args = this.template[plotId].dataParams[key];
      } else {
        args = this.template[plotId].dataParams;
      }
      callback = function(data) {
        if (_is_array) {
          if (parseInt(key) === 0) {
            _.template[plotId].data = [];
          }
          return _.template[plotId].data[key] = data.responseJSON;
        } else {
          return _.template[plotId].data = data.responseJSON;
        }
      };
      return this.syncronousapi.get(target, args, callback);
    };

    Handler.prototype.getTemplatePlotData = function() {
      var key, params, plot, preError, ref, results, subKey;
      preError = this.preError + ".getPlotData()";
      ref = this.template;
      results = [];
      for (key in ref) {
        plot = ref[key];
        if (this.template[key].dataParams instanceof Array) {
          results.push((function() {
            var ref1, results1;
            ref1 = this.template[key].dataParams;
            results1 = [];
            for (subKey in ref1) {
              params = ref1[subKey];
              results1.push(this.getStationParamData(key, subKey));
            }
            return results1;
          }).call(this));
        } else {
          results.push(this.getStationParamData(key));
        }
      }
      return results;
    };

    Handler.prototype.getParameterDropdown = function() {
      var _, args, preError, target;
      preError = this.preError + ".getStationParamData()";
      target = "template/" + plotHandlerId;
      _ = this;
      return args = this.template[plotId].dataParams;
    };

    Handler.prototype.getStationDropdown = function() {
      var preError;
      return preError = "";
    };

    Handler.prototype.append = function() {
      var dKey, data, instance, key, plot, preError, ref, ref1, results, row, target, title;
      preError = this.preError + ".append()";
      ref = this.template;
      results = [];
      for (key in ref) {
        plot = ref[key];
        target = this.utarget(this.options.target);
        $(this.options.target).append("<div id='" + target + "'></div>");
        plot.options.uuid = this.uuid();
        plot.options.target = "\#" + target;
        plot.options.dataParams = plot.dataParams;
        plot.options.line1Color = this.getColor('dark', key);
        plot.options.line1Color = this.getColor('light', key);
        if (plot.data instanceof Array) {
          plot.options.merge = true;
          data = {
            data: []
          };
          ref1 = plot.data;
          for (dKey in ref1) {
            row = ref1[dKey];
            data.data[dKey] = row.results;
          }
        } else {
          data = {
            data: plot.data.results
          };
        }
        plot.data = null;
        title = this.getTitle(plot);
        console.log(preError + " (plot, data)", plot, data);
        instance = new window.Plotting.LinePlot(data, plot.options);
        instance.append();
        results.push(this.template[key].proto = instance);
      }
      return results;
    };

    Handler.prototype.mergeTemplateOption = function() {};

    Handler.prototype.getPrependData = function(plotId, dataParams, key) {
      var _, _is_array, _ready, append, args, callback, callback1, callback2, preError, target;
      preError = this.preError + ".getPrependData(key, dataParams)";
      target = "http://dev.nwac.us/api/v5/measurement";
      _ = this;
      _is_array = dataParams instanceof Array;
      args = dataParams;
      if (_is_array) {
        _ready = [false, false];
        _.template[plotId].data = [];
        append = function() {
          console.log("Appending data set (_.template[plotId].data)", _.template[plotId].data);
          _.template[plotId].proto.appendMergeData(_.template[plotId].data);
          return _.template[plotId].proto.setVisibleData();
        };
        callback1 = function(data) {
          console.log("Callback1 (data)", data);
          _.template[plotId].data[0] = data.responseJSON.results;
          _ready[0] = true;
          if (_ready[0] && _ready[1]) {
            return append();
          }
        };
        return callback2 = function(data) {
          console.log("Callback2 (data)", data);
          _.template[plotId].data[1] = data.responseJSON.results;
          _ready[1] = true;
          if (_ready[0] && _ready[1]) {
            return append();
          }
        };
      } else {
        args = this.template[plotId].dataParams;
        callback = function(data) {
          _.template[plotId].proto.appendData(data.responseJSON.results);
          return _.template[plotId].proto.setVisibleData();
        };
        return this.api.get(target, args, callback);
      }
    };

    Handler.prototype.getAppendData = function(plotId, dataParams) {
      var _, args, callback, preError, target;
      preError = this.preError + ".getAppendData(key, dataParams)";
      target = "http://dev.nwac.us/api/v5/measurement";
      _ = this;
      args = dataParams;
      callback = function(data) {
        _.template[plotId].proto.appendData(data.responseJSON.results);
        return _.template[plotId].proto.setVisibleData();
      };
      return this.api.get(target, args, callback);
    };

    Handler.prototype.prependData = function(key) {
      var dataParams, params, plot, preError, ref, state;
      preError = this.preError + ".prependData()";
      plot = this.template[key];
      state = plot.proto.getState();
      if (plot.proto.options.dataParams instanceof Array) {
        dataParams = [];
        ref = plot.proto.options.dataParams;
        for (key in ref) {
          params = ref[key];
          dataParams[key] = params;
          dataParams[key].max_datetime = this.format(state.range.data.min);
          dataParams[key].limit = this.options.updateLength;
        }
      } else {
        dataParams = plot.proto.options.dataParams;
        dataParams.max_datetime = this.format(state.range.data.min);
        dataParams.limit = this.options.updateLength;
      }
      return this.getPrependData(key, dataParams);
    };

    Handler.prototype.appendData = function(key) {
      var _max_datetime, _new_max_datetime, _now, dataParams, params, plot, preError, ref, state;
      preError = this.preError + ".appendData()";
      _now = new Date();
      plot = this.template[key];
      state = plot.proto.getState();
      if (state.range.data.max >= _now) {
        return;
      }
      _max_datetime = state.range.data.max.getTime();
      _new_max_datetime = _max_datetime + (this.options.updateLength * 3600000);
      if (plot.proto.options.dataParams instanceof Array) {
        dataParams = [];
        ref = plot.proto.options.dataParams;
        for (key in ref) {
          params = ref[key];
          dataParams[key] = plot.proto.options.dataParams[key];
          dataParams[key].max_datetime = this.format(new Date(_new_max_datetime));
          dataParams[key].limit = this.options.updateLength;
        }
      } else {
        dataParams = plot.proto.options.dataParams;
        dataParams.max_datetime = this.format(new Date(_new_max_datetime));
        dataParams.limit = this.options.updateLength;
      }
      return this.getPrependData(key, dataParams);
    };

    Handler.prototype.zoom = function(transform) {
      var i, len, plot, ref, results;
      ref = this.template;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        results.push(plot.proto.setZoomTransform(transform));
      }
      return results;
    };

    Handler.prototype.crosshair = function(transform, mouse) {
      var i, len, plot, ref, results;
      ref = this.template;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        results.push(plot.proto.setCrosshair(transform, mouse));
      }
      return results;
    };

    Handler.prototype.showCrosshairs = function() {
      var i, len, plot, ref, results;
      ref = this.template;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        results.push(plot.proto.showCrosshair());
      }
      return results;
    };

    Handler.prototype.hideCrosshairs = function() {
      var i, len, plot, ref, results;
      ref = this.template;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        results.push(plot.proto.hideCrosshair());
      }
      return results;
    };

    Handler.prototype.appendDropdown = function(target, type, data) {
      var foot, head, i, j, len, len1, list, parameter, ref, ref1, result, station;
      head = "";
      list = "";
      foot = "";
      switch (type) {
        case 'station':
          head = "<button class=\"btn btn-xs btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu3\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"> <span>Stations </span> <span class=\"caret\"></span> </button> <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu3\">";
          ref = data.stations;
          for (i = 0, len = ref.length; i < len; i++) {
            station = ref[i];
            list = list + " <li><a onclick=\"" + parameter.onclick + "\"> <i style=\"color: " + parameter.color + "\" class=\"icon-circle\"></i> " + station.station + " </a></li>";
          }
          foot = "</ul>";
          break;
        case 'parameter':
          head = "<button class=\"btn btn-xs btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu3\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"> <span>Stations </span> <span class=\"caret\"></span> </button> <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu3\">";
          ref1 = data.parameters;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            parameter = ref1[j];
            list = list + " <li><a onclick=\"" + parameter.onclick + "\"> <i style=\"color: " + parameter.color + "\" class=\"icon-circle\"></i> " + parameter.title + " </a></li>";
          }
          foot = "</ul>";
      }
      result = head + " " + list + " " + foot;
      return $(target).append(result);
    };

    Handler.prototype.getColor = function(shade, key) {
      return this.options.colors[shade][key];
    };

    Handler.prototype.getTitle = function(plot) {
      var result;
      result = {};
      if (plot.type === 'station') {
        result.title = plot.station.station;
        result.subtitle = "";
      } else if (plot.type === 'parameter') {
        result.title = plot.options.y.title;
        result.subtitle = "";
      }
      return result;
    };

    Handler.prototype.getAggregateMethod = function(param, start, end) {
      var aggregate, arregate, interval;
      aggregate = 'hourly';
      interval = new Date(end - new Date(start));
      switch (param) {
        case 'temp':
          return arregate = 'daily';
        case 'precip':
          return aggregate = 'daily';
      }
    };

    Handler.prototype.uuid = function(length) {
      return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    };

    Handler.prototype.utarget = function(prepend) {
      prepend = prepend.replace('#', '');
      return prepend + "-" + (this.uuid());
    };

    return Handler;

  })();

}).call(this);
