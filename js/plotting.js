(function() {
  var API;

  window.Plotting || (window.Plotting = {});

  window.Plotting.API = API = (function() {
    function API(accessToken) {
      var preError;
      this.preError = "Plotting.API";
      preError = this.preError + ".constructor()";
      this.async = true;
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
          console.log(preError + " (callback)", callback);
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
      console.log(preError + " (args)", args);
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
          console.log(preError + " (callback)", callback);
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
        transitionDuration: 300,
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
        focusCircle: {
          color: "rgb(41, 128, 185)"
        },
        focusCircle2: {
          color: "rgb(39, 174, 96)"
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
      this.getDefinition();
      if (window.attachEvent) {
        window.attachEvent('onresize', function() {
          alert('attachEvent - resize');
        });
      } else if (window.addEventListener) {
        window.addEventListener('resize', (function() {
          console.log('addEventListener - resize');
        }), true);
      } else {

      }
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
      this.definition.line = d3.line().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y(function(d) {
        return _.definition.y(d.y);
      }).curve(d3.curveCatmullRom.alpha(0.5));
      this.definition.line2 = d3.line().defined(function(d) {
        return !isNaN(d.y2) && d.y2 !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y(function(d) {
        return _.definition.y(d.y2);
      }).curve(d3.curveCatmullRom.alpha(0.5));
      this.definition.area = d3.area().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y0(function(d) {
        return _.definition.y(d.yMin);
      }).y1(function(d) {
        return _.definition.y(d.yMax);
      }).curve(d3.curveCatmullRom.alpha(0.5));
      return this.definition.area2 = d3.area().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y0(function(d) {
        return _.definition.y(d.y2Min);
      }).y1(function(d) {
        return _.definition.y(d.y2Max);
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
      var preError, xmax, xmin, y1max, y1min, y2BandMax, y2BandMin, y2max, y2min, yBandMax, yBandMin, ymax, ymax_a, ymin, ymin_a;
      preError = this.preError + "calculateAxisDims(data)";
      xmin = this.options.x.min === null ? d3.min(data, function(d) {
        return d.x;
      }) : this.parseDate(this.options.x.min);
      xmax = this.options.x.max === null ? d3.max(data, function(d) {
        return d.x;
      }) : this.parseDate(this.options.x.max);
      y1min = this.options.y.min === null ? d3.min(data, function(d) {
        return d.y;
      }) : this.options.y.min;
      y1max = this.options.y.max === null ? d3.max(data, function(d) {
        return d.y;
      }) : this.options.y.max;
      y2min = this.options.y2.min === null ? d3.min(data, function(d) {
        return d.y2;
      }) : this.options.y2.min;
      y2max = this.options.y2.max === null ? d3.max(data, function(d) {
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
      ymin_a = [y1min, y2min, yBandMin, y2BandMin];
      ymax_a = [y1max, y2max, yBandMax, y2BandMax];
      ymin = d3.min(ymin_a);
      ymax = d3.max(ymax_a);
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
      var _, bottomPadding, gX, gY, innerHeight, innerWidth, leftPadding, preError, topPadding;
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
      gX = this.svg.append("g").attr("class", "line-plot-axis-x").style("fill", "none").style("stroke", this.options.axisColor).call(this.definition.xAxis).attr("transform", "translate(0, " + bottomPadding + ")");
      if (this.options.theme !== 'minimum') {
        this.svg.select(".line-plot-axis-x").selectAll("text").style("font-size", this.options.font.size).style("font-weight", this.options.font.weight);
      }
      gY = this.svg.append("g").attr("class", "line-plot-axis-y").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.yAxis).attr("transform", "translate(" + leftPadding + ", 0)");
      this.lineband = this.svg.append("path").datum(this.data).attr("d", this.definition.area).attr("class", "line-plot-area").style("fill", "rgb(52, 152, 219)").style("opacity", 0.15).style("stroke", "BLACK");
      this.lineband2 = this.svg.append("path").datum(this.data).attr("d", this.definition.area2).attr("class", "line-plot-area").style("fill", "rgb(46, 204, 113)").style("opacity", 0.15).style("stroke", "BLACK");
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.line).attr("class", "line-plot-path").style("stroke", this.options.line1Color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.line2).attr("class", "line-plot-path2").style("stroke", this.options.line2Color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.crosshairs = this.svg.append("g").attr("class", "crosshair");
      this.crosshairs.append("line").attr("class", "crosshair-x").style("stroke", this.options.crosshairX.color).style("stroke-width", this.options.crosshairX.weight).style("fill", "none");
      _ = this;
      this.focusCircle = this.svg.append("circle").attr("r", 4).attr("class", "focusCircle").attr("fill", this.options.focusCircle.color);
      this.focusText = this.svg.append("text").attr("class", "focusText").attr("x", 9).attr("y", 7).style("stroke", this.options.focusCircle.color);
      this.focusCircle2 = this.svg.append("circle").attr("r", 4).attr("class", "focusCircle2").attr("fill", this.options.focusCircle2.color);
      this.focusText2 = this.svg.append("text").attr("class", "focusText2").attr("x", 9).attr("y", 7).style("stroke", this.options.focusCircle2.color);
      return this.svg.append("rect").datum(this.data).attr("class", "overlay").attr("width", innerWidth).attr("height", innerHeight).attr("transform", "translate(" + leftPadding + ", " + topPadding + ")").style("fill", "none").style("pointer-events", "all").on("mouseover", function() {
        _.crosshairs.style("display", null);
        _.focusCircle.style("display", null);
        _.focusCircle2.style("display", null);
        _.focusText.style("display", null);
        return _.focusText2.style("display", null);
      }).on("mouseout", function() {
        _.crosshairs.style("display", "none");
        _.focusCircle.style("display", "none");
        _.focusCircle2.style("display", "none");
        _.focusText.style("display", "none");
        return _.focusText2.style("display", "none");
      }).on("mousemove", function(d) {
        var d0, d1, dx, dy, dy2, i, min, mouse, x0;
        mouse = d3.mouse(this);
        x0 = _.definition.x.invert(mouse[0] + leftPadding);
        i = _.bisectDate(d, x0, 1);
        min = x0.getMinutes();
        d0 = d[i - 1];
        d1 = d[i];
        d = d0;
        d = min >= 30 ? d1 : d0;
        dx = _.definition.x(d.x);
        dy = _.definition.y(d.y);
        dy2 = _.definition.y(d.y2);
        _.crosshairs.select(".crosshair-x").attr("x1", mouse[0]).attr("y1", topPadding).attr("x2", mouse[0]).attr("y2", innerHeight + topPadding).attr("transform", "translate(" + leftPadding + ", 0)");
        _.focusCircle.attr("cx", dx).attr("cy", dy);
        _.focusText.attr("x", dx + leftPadding / 10).attr("y", dy - topPadding / 10).text(d.y.toFixed(1) + " " + "°F");
        _.focusCircle2.attr("cx", dx).attr("cy", dy2);
        return _.focusText2.attr("x", dx + leftPadding / 10).attr("y", dy2 - topPadding / 10).text(d.y2.toFixed(1) + " " + "°F");
      });
    };

    LinePlot.prototype.zoomed = function() {
      var _, preError;
      preError = this.preError + "append()";
      _ = this;
      svg.attr("transform", d3.transform);
      gX.call(xAxis.scale(d3.transform.rescaleX(x)));
      return gY.call(yAxis.scale(d3.transform.rescaleY(y)));
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
        this.data.push(dtaRow);
      }
      this.svg.select(".line-plot-path").datum(this.data).attr("d", this.definition.line);
      this.svg.select(".line-plot-path2").datum(this.data).attr("d", this.definition.line2);
      this.calculateAxisDims(this.data);
      dtDiff = this.definition.x.max - dtOffset;
      this.log(preError + " Date Diff Calcs (dtOffset, @def.x.min, dtDiff)", dtOffset, this.definition.x.max, this.dtDiff);
      this.definition.x.domain([this.definition.x.min, this.definition.x.max]);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      this.svg.select(".line-plot-axis-x").style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).transition().duration(this.options.transitionDuration).ease(d3.easeLinear).call(this.definition.xAxis);
      this.svg.select(".line-plot-axis-y").style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).transition().duration(this.options.transitionDuration).ease(d3.easeLinear).call(this.definition.yAxis);
      this.svg.select(".line-plot-path").datum(this.data).transition().duration(this.options.transitionDuration).attr("d", this.definition.line);
      return this.svg.select(".line-plot-path2").datum(this.data).transition().duration(this.options.transitionDuration).attr("d", this.definition.line2);
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
        dateFormat: "%Y-%m-%dT%H:%M:%SZ"
      };
      this.options = Object.mergeDefaults(options, defaults);
      this.plots = [];
      this.endpoint = null;
      accessToken = {
        token: null,
        expires: null,
        expired: true
      };
      access = Object.mergeDefaults(access, accessToken);
      this.api = new window.Plotting.API(access.token);
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
        return _.template = data.responseJSON.templateData;
      };
      return this.api.get(target, args, callback);
    };

    Handler.prototype.getStationParamData = function(plotId) {
      var _, args, callback, preError, target;
      preError = this.preError + ".getStationParamData(...)";
      target = "http://dev.nwac.us/api/v5/measurement";
      _ = this;
      args = this.template[plotId].dataParams;
      console.log(preError + " (args)", args);
      callback = function(data) {
        console.log(preError + "->callback() Returning API (plotId)", plotId);
        return _.template[plotId].data = data.responseJSON;
      };
      return this.api.get(target, args, callback);
    };

    Handler.prototype.getPlotData = function() {
      var key, plot, preError, ref, results;
      preError = this.preError + ".getPlotData()";
      ref = this.template;
      results = [];
      for (key in ref) {
        plot = ref[key];
        results.push(this.getStationParamData(key));
      }
      return results;
    };

    Handler.prototype.append = function() {
      var data, i, instance, len, plot, preError, ref, results;
      preError = this.preError + ".append()";
      ref = this.template;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        plot.options.target = this.options.target;
        plot.options.x = {
          variable: 'datetime',
          format: this.options.dateFormat
        };
        plot.options.y = {
          variable: 'wind_speed_average'
        };
        data = {
          data: plot.data.results
        };
        console.log(preError + " (plot)", plot);
        instance = new window.Plotting.LinePlot(data, plot.options);
        instance.append();
        results.push(this.plots.push(instance));
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

    Handler.prototype.forward = function(offset) {};

    Handler.prototype.backward = function(offset) {};

    Handler.prototype.zoom = function(level) {};

    Handler.prototype.alert = function(message, type) {};

    return Handler;

  })();

}).call(this);
