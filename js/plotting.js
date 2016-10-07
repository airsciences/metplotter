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
      var defaults, key, ref, row;
      this.preError = "LinePlot.";
      defaults = {
        uuid: '',
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
      this.data = [];
      ref = data.data;
      for (key in ref) {
        row = ref[key];
        this.data[key] = {
          x: this.parseDate(row[this.options.x.variable]),
          y: row[this.options.y.variable]
        };
        if (this.options.y2.variable !== null) {
          this.data[key].y2 = row[this.options.y2.variable];
        }
        if (this.options.yBand.minVariable !== null && this.options.yBand.maxVariable !== null) {
          this.data[key].yMin = row[this.options.yBand.minVariable];
          this.data[key].yMax = row[this.options.yBand.maxVariable];
        }
        if (this.options.y2Band.minVariable !== null && this.options.y2Band.maxVariable !== null) {
          this.data[key].y2Min = row[this.options.y2Band.minVariable];
          this.data[key].y2Max = row[this.options.y2Band.maxVariable];
        }
      }
      this.data = this.data.sort(this.sortDatetimeAsc);
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
      this.definition.zoom = d3.zoom().on("zoom", function(d) {
        console.log("On-zoom. (d)", d);
        _.calculateYAxisDims(_.data);
        _.svg.select(".line-plot-axis-x").call(_.definition.xAxis.scale(d3.event.transform.rescaleX(_.definition.x)));
        _.svg.select(".line-plot-axis-y").call(_.definition.yAxis);
        _.svg.select(".line-plot-path").attr("d", _.definition.line).attr("transform", function() {
          return "translate(" + d3.event.transform.x + "," + 0 + ") scale(" + d3.event.transform.k + ", 1)";
        });
        return _.svg.select(".line-plot-path2").attr("d", _.definition.line2).attr("transform", function() {
          return "translate(" + d3.event.transform.x + "," + 0 + ") scale(" + d3.event.transform.k + ", 1)";
        });
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
      var height, margin, preError, width;
      preError = this.preError + "calculateChartDims()";
      width = Math.round($(this.options.target).width());
      height = Math.round(width / 4);
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
        stageWidth: width + 200,
        height: height,
        margin: margin
      };
      this.definition.x = d3.scaleTime().range([margin.left, width - margin.right]);
      return this.definition.y = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    };

    LinePlot.prototype.calculateAxisDims = function(data) {
      var preError;
      preError = this.preError + "calculateAxisDims(data)";
      this.calculateXAxisDims(data);
      return this.calculateYAxisDims(data);
    };

    LinePlot.prototype.calculateXAxisDims = function(data) {
      var preError, xmax, xmin;
      preError = this.preError + "calculateXAxisDims(data)";
      xmin = this.options.x.min === null ? d3.min(data, function(d) {
        return d.x;
      }) : this.parseDate(this.options.x.min) - 10000;
      xmax = this.options.x.max === null ? d3.max(data, function(d) {
        return d.x;
      }) : this.parseDate(this.options.x.max);
      this.definition.x.min = xmin;
      return this.definition.x.max = xmax;
    };

    LinePlot.prototype.calculateYAxisDims = function(data) {
      var preError, y2BandMax, y2BandMin, y2Max, y2Min, yBandMax, yBandMin, yMax, yMin, ymax, ymax_a, ymin, ymin_a;
      preError = this.preError + "calculateYAxisDims(data)";
      yMin = this.options.y.min === null ? d3.min(data, function(d) {
        return d.y;
      }) : this.options.y.min;
      yMax = this.options.y.max === null ? d3.max(data, function(d) {
        return d.y;
      }) : this.options.y.max;
      y2Min = this.options.y2.min === null ? d3.min(data, function(d) {
        return d.y2;
      }) : this.options.y2.min;
      y2Max = this.options.y2.max === null ? d3.max(data, function(d) {
        return d.y2;
      }) : this.options.y2.max;
      yBandMin = d3.min(data, function(d) {
        return d.yMin;
      });
      yBandMax = d3.max(data, function(d) {
        return d.yMax;
      });
      y2BandMin = d3.min(data, function(d) {
        return d.y2Min;
      });
      y2BandMax = d3.max(data, function(d) {
        return d.y2Max;
      });
      ymin_a = [yMin, y2Min, yBandMin, y2BandMin];
      ymax_a = [yMax, y2Max, yBandMax, y2BandMax];
      ymin = d3.min(ymin_a);
      ymax = d3.max(ymax_a);
      ymin = ymin === ymax ? ymin * 0.8 : ymin;
      ymax = ymin === ymax ? ymax * 1.2 : ymax;
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
      this.svg.append("g").attr("class", "line-plot-axis-x").style("fill", "none").style("stroke", this.options.axisColor).call(this.definition.xAxis).attr("transform", "translate(0, " + bottomPadding + ")");
      if (this.options.theme !== 'minimum') {
        this.svg.select(".line-plot-axis-x").selectAll("text").style("font-size", this.options.font.size).style("font-weight", this.options.font.weight);
      }
      this.svg.append("g").attr("class", "line-plot-axis-y").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.yAxis).attr("transform", "translate(" + leftPadding + ", 0)");
      if (this.options.yBand.minVariable !== null && this.options.yBand.maxVariable !== null) {
        this.lineband = this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.area).attr("class", "line-plot-area").style("fill", "rgb(171, 211, 237)").style("opacity", 0.5).style("stroke", "rgb(0, 0, 0)").style("stroke-width", "1");
      }
      if (this.options.y2Band.minVariable !== null && this.options.y2Band.maxVariable !== null) {
        this.lineband2 = this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.area2).attr("class", "line-plot-area2").style("fill", "rgb(172, 236, 199)").style("opacity", 0.5).style("stroke", "rgb(0, 0, 0)");
      }
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.line).attr("class", "line-plot-path").style("stroke", this.options.line1Color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.line2).attr("class", "line-plot-path2").style("stroke", this.options.line2Color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      return this.svg.append("rect").attr("class", "zoom-pane").attr("width", innerWidth).attr("height", innerHeight).attr("transform", "translate(" + leftPadding + ", " + topPadding + ")").style("fill", "none").style("pointer-events", "all").style("cursor", "move").call(this.definition.zoom);
    };

    LinePlot.prototype.update = function(data) {
      var _, dtDiff, dtOffset, dtaRow, key, preError, row;
      preError = this.preError + "update()";
      _ = this;
      dtOffset = new Date(this.definition.x.max);
      for (key in data) {
        row = data[key];
        dtaRow = {
          x: this.parseDate(row[this.options.x.variable]),
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
        this.data.push(dtaRow);
      }
      this.data = this.data.sort(this.sortDatetimeAsc);
      this.svg.select(".line-plot-area").datum(this.data).attr("d", this.definition.area);
      this.svg.select(".line-plot-area2").datum(this.data).attr("d", this.definition.area2);
      this.svg.select(".line-plot-path").datum(this.data).attr("d", this.definition.line);
      this.svg.select(".line-plot-path2").datum(this.data).attr("d", this.definition.line2);
      this.calculateYAxisDims(this.data);
      dtDiff = this.definition.x.max - dtOffset;
      this.log(preError + " Date Diff Calcs (dtOffset, @def.x.min, dtDiff)", dtOffset, this.definition.x.max, this.dtDiff);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      this.svg.select(".line-plot-area").datum(this.data).transition().duration(this.options.transitionDuration).attr("d", this.definition.area);
      this.svg.select(".line-plot-area2").datum(this.data).transition().duration(this.options.transitionDuration).attr("d", this.definition.area2);
      this.svg.select(".line-plot-path").datum(this.data).transition().duration(this.options.transitionDuration).attr("d", this.definition.line);
      this.svg.select(".line-plot-path2").datum(this.data).transition().duration(this.options.transitionDuration).attr("d", this.definition.line2);
      return this.svg.select(".line-plot-axis-y").style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).transition().duration(this.options.transitionDuration).ease(d3.easeLinear).call(this.definition.yAxis);
    };

    LinePlot.zoomed = function() {
      var preError;
      preError = this.preError + ".zoomed()";
      return this.log(preError + " zoom action occured.");
    };

    return LinePlot;

  })();

}).call(this);

(function() {
  var Handler;

  window.Plotting || (window.Plotting = {});

  window.Plotting.Handler = Handler = (function() {
    function Handler(access, options, plots) {
      var accessToken, defaults, format;
      this.preError = "Plotting.Handler";
      defaults = {
        target: null,
        stage: 4,
        dateFormat: "%Y-%m-%dT%H:%M:%SZ",
        updateHourOffset: 25
      };
      this.options = Object.mergeDefaults(options, defaults);
      this.now = new Date();
      this.current = null;
      this.plots = [];
      this.readyState = {
        template: false
      };
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
      format = d3.utcFormat(this.options.dateFormat);
      this.getCurrent = function() {
        return format(this.current);
      };
      this.getNow = function() {
        return format(this.now);
      };
      this.getForwardHours = function() {
        var now;
        now = new Date();
        return Math.floor((now.getTime() - this.current.getTime()) / 1000 / 3600);
      };
      this.hasForward = function() {
        return this.getForwardHours() > 0;
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
      this.getPlotData(null, false);
      this.append();
      console.log("Appended");
      return this.stage();
    };

    Handler.prototype.stage = function() {
      var i, num, ref, results;
      results = [];
      for (num = i = 0, ref = this.options.stage; 0 <= ref ? i <= ref : i >= ref; num = 0 <= ref ? ++i : --i) {
        this.backward();
        results.push(this.forward());
      }
      return results;
    };

    Handler.prototype.getTemplate = function(template_uri) {
      var _, args, callback, preError, target;
      preError = this.preError + ".getTemplate(...)";
      target = "template/1";
      args = null;
      _ = this;
      callback = function(data) {
        if (data.responseJSON === null || data.responseJSON.error) {
          console.log(preError + ".callback(...) error detected (data)", data);
          return;
        }
        _.template = data.responseJSON.templateData;
        return _.readyState.template = true;
      };
      return this.syncronousapi.get(target, args, callback);
    };

    Handler.prototype.getStationParamData = function(plotId, async) {
      var _, args, callback, preError, target;
      preError = this.preError + ".getStationParamData(...)";
      target = "http://dev.nwac.us/api/v5/measurement";
      _ = this;
      args = this.template[plotId].dataParams;
      if (args.max_datetime === void 0) {
        args.max_datetime = this.getNow();
        this.current = this.now;
      } else {
        this.current = new Date(args.max_datetime);
      }
      callback = function(data) {
        console.log(preError + " callback() Returning API (data)", data.responseJSON.results);
        return _.template[plotId].data = data.responseJSON;
      };
      if (async === false) {
        return this.syncronousapi.get(target, args, callback);
      } else {
        return this.api.get(target, args, callback);
      }
    };

    Handler.prototype.getPlotData = function(direction, async) {
      var key, plot, preError, prepend_offset, ref, results, update;
      preError = this.preError + ".getPlotData(...)";
      update = false;
      prepend_offset = 0;
      if (direction === 'forward' && this.hasForward()) {
        update = true;
        this.current = this.current.getTime() + (this.options.updateHourOffset * 60 * 60 * 1000);
        console.log(preError + " (@current)", this.current);
      } else if (direction === 'backward') {
        update = true;
        prepend_offset = this.options.updateHourOffset;
      }
      preError = this.preError + ".getPlotData()";
      ref = this.template;
      results = [];
      for (key in ref) {
        plot = ref[key];
        if (update) {
          this.template[key].dataParams.limit = this.template[key].dataParams.limit + prepend_offset;
          this.template[key].dataParams.max_datetime = this.getCurrent();
        }
        results.push(this.getStationParamData(key, async));
      }
      return results;
    };

    Handler.prototype.append = function() {
      var data, instance, key, plot, preError, ref, results, target;
      preError = this.preError + ".append()";
      ref = this.template;
      results = [];
      for (key in ref) {
        plot = ref[key];
        target = this.utarget(this.options.target);
        $(this.options.target).append("<div id='" + target + "'></div>");
        plot.options.uuid = this.uuid();
        plot.options.target = "\#" + target;
        plot.options.x = {
          variable: 'datetime',
          format: this.options.dateFormat
        };
        plot.options.y = {
          variable: 'wind_speed_average'
        };
        plot.options.y2 = {
          variable: 'wind_speed_minimum'
        };
        data = {
          data: plot.data.results
        };
        console.log(preError + " (plot)", plot);
        instance = new window.Plotting.LinePlot(data, plot.options);
        instance.append();
        results.push(this.plots[key] = instance);
      }
      return results;
    };

    Handler.prototype.mergeTemplateOption = function() {};

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

    Handler.prototype.update = function() {
      var data, key, plot, preError, ref, results;
      preError = this.preError + ".update()";
      ref = this.plots;
      results = [];
      for (key in ref) {
        plot = ref[key];
        console.log(preError + " ready to go forward (@template[key].data)", this.template[key].data);
        data = this.template[key].data.results;
        results.push(this.plots[key].update(data));
      }
      return results;
    };

    Handler.prototype.forward = function() {
      var preError;
      preError = this.preError + ".forward()";
      return this.getPlotData("forward");
    };

    Handler.prototype.backward = function() {
      var preError;
      preError = this.preError + ".backward()";
      return this.getPlotData("backward");
    };

    Handler.prototype.zoom = function(level) {};

    Handler.prototype.alert = function(message, type) {};

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
