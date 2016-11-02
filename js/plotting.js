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
  var Controls,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Plotting || (window.Plotting = {});

  window.Plotting.Controls = Controls = (function() {
    function Controls(access, options) {
      var accessToken, defaults;
      this.preError = "Plotting.Dropdown";
      defaults = {
        target: null
      };
      this.options = Object.mergeDefaults(options, defaults);
      accessToken = {
        token: null,
        expires: null,
        expired: true
      };
      access = Object.mergeDefaults(access, accessToken);
      this.maps = [];
      this.api = new window.Plotting.API(access.token);
    }

    Controls.prototype.appendStationDropdown = function(plotId, appendTarget, parameter, current) {
      var _, args, callback, target, uuid;
      target = "stations/" + parameter;
      _ = this;
      args = {};
      uuid = this.uuid();
      callback = function(data) {
        var _dots, _prepend, _region_selected, _row_current, _station, a_color, color, html, i, id, j, k, len, len1, len2, r_color, ref, ref1, ref2, region, station;
        html = "<div class=\"dropdown\"> <li><a id=\"" + uuid + "\" class=\"station-dropdown dropdown-toggle\" role=\"button\" data-toggle=\"dropdown\" href=\"#\"> <i class=\"icon-list\"></i></a> <ul id=\"station-dropdown-" + plotId + "\" class=\"dropdown-menu dropdown-menu-right\">";
        ref = data.responseJSON;
        for (i = 0, len = ref.length; i < len; i++) {
          region = ref[i];
          a_color = "";
          r_color = "";
          _dots = "";
          _region_selected = 0;
          ref1 = region.stations;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            _station = ref1[j];
            _row_current = _.isCurrent(current, 'dataLoggerId', _station.dataloggerid);
            if (_row_current) {
              _region_selected++;
              _dots = _dots + " <i class=\"icon-circle\" style=\"color: " + _row_current.color + "\"></i>";
            }
          }
          if (_region_selected > 0) {
            r_color = "style=\"background-color: rgb(248,248,248)\"";
            a_color = "style=\"font-weight: 700\"";
          }
          html = html + " <li class=\"subheader\" " + r_color + "> <a " + a_color + " href=\"#\"><i class=\"icon-caret-down\" style=\"margin-right: 6px\"></i> " + region.region + " " + _dots + "</a> </li> <ul class=\"list-group-item sublist\" style=\"display: none;\">";
          ref2 = region.stations;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            station = ref2[k];
            _row_current = _.isCurrent(current, 'dataLoggerId', station.dataloggerid);
            color = "";
            if (_row_current) {
              console.log("Row Current", _row_current);
              color = "style=\"color: " + _row_current.color + "\"";
            }
            id = "data-logger-" + station.dataloggerid + "-plot-" + plotId;
            _prepend = "<i id=\"" + id + "\" class=\"icon-circle\" " + color + "></i>";
            html = html + " <li class=\"list-group-item station\" style=\"cursor: pointer; padding: 1px 5px; list-style-type: none\">" + _prepend + " " + station.name + "</li>";
          }
          html = html + " </ul>";
        }
        html = html + " </ul> </li>";
        $(appendTarget).prepend(html);
        $('#' + uuid).dropdown();
        return $(".subheader").unbind().on('click', function(event) {
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
      return this.api.get(target, args, callback);
    };

    Controls.prototype.appendParameterDropdown = function(plotId, appendTarget, dataLoggerId, current) {
      var _current, args, callback, target, uuid;
      target = "parameters/" + dataLoggerId;
      args = {};
      uuid = this.uuid();
      _current = [];
      callback = function(data) {
        var _add, _id, _prepend, html, i, id, len, parameter, ref, ref1;
        html = "<div class=\"dropdown\"> <li><a id=\"" + uuid + "\" class=\"parameter-dropdown dropdown-toggle\" role=\"button\" data-toggle=\"dropdown\" href=\"#\"> <i class=\"icon-list\"></i></a> <ul id=\"param-dropdown-" + plotId + "\" class=\"dropdown-menu dropdown-menu-right\" role=\"menu\" aria-labelledby=\"" + uuid + "\">";
        ref = data.responseJSON;
        for (i = 0, len = ref.length; i < len; i++) {
          parameter = ref[i];
          if (parameter.parameter instanceof Array) {
            _add = parameter.parameter[0];
            _id = _add.replace("_", "-");
            id = _id + "-plot-" + plotId;
            if (ref1 = current.variable, indexOf.call(parameter.parameter, ref1) >= 0) {
              _prepend = "<i id=\"" + id + "\" class=\"parameter-" + parameter.parameter + " icon-circle\" style=\"color: " + current.color + "\"></i>";
            }
          } else {
            _add = parameter.parameter;
            _id = _add.replace("_", "-");
            id = _id + "-plot-" + plotId;
            if (current.variable === parameter.parameter) {
              _prepend = "<i id=\"" + id + "\" class=\"icon-circle\" style=\"color: " + current.color + "\"></i>";
            } else {
              _prepend = "<i id=\"" + id + "\" class=\"icon-circle\" style=\"\"></i>";
            }
          }
          html = html + " <li><a style=\"cursor: pointer\" onclick=\"plotter.addVariable(" + plotId + ", '" + _add + "')\">" + _prepend + " " + parameter.title + "</a></li>";
        }
        html = html + " </ul> </li> </div>";
        $(appendTarget).prepend(html);
        return $('#' + uuid).dropdown();
      };
      return this.api.get(target, args, callback);
    };

    Controls.prototype.updateParameterDropdown = function(plotId) {
      var _id, _options, id;
      _options = plotter.template[plotId].proto.options;
      if (_options.y.variable !== null) {
        _id = _options.y.variable.replace('_', '-');
        id = _id + "-plot-" + plotId;
        console.log("Update-Dropdown y", id);
        $(_options.target).find("\#" + id).css("color", _options.line1Color);
      }
      if (_options.y2.variable !== null) {
        _id = _options.y2.variable.replace('_', '-');
        id = _id + "-plot-" + plotId;
        console.log("Update-Dropdown y2", id);
        return $(_options.target).find("\#" + id).css("color", _options.line2Color);
      }
    };

    Controls.prototype.appendStationMap = function(plotId, appendTarget, parameter) {
      var _, dom_uuid, html, uuid;
      _ = this;
      uuid = this.uuid();
      dom_uuid = "map-control-" + uuid;
      html = "<li> <i class=\"icon-map-marker\" style=\"cursor: pointer\" onclick=\"plotter.controls.toggleMap('" + uuid + "')\"></i> </li> <div class=\"popover\"> <div class=\"arrow\"></div> <div class=\"popover-content\"> <div id=\"" + dom_uuid + "\" style=\"width: 512px; height: 512px;\"></div> </div> </div>";
      $(appendTarget).prepend(html);
      this.maps[uuid] = new google.maps.Map(document.getElementById(dom_uuid), {
        center: new google.maps.LatLng(47.6062, -122.3321),
        zoom: 6,
        mapTypeId: 'terrain',
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      });
      return console.log("Controls.maps (@maps)", this.maps);
    };

    Controls.prototype.toggleMap = function(mapUuid) {
      $("\#map-control-" + mapUuid).parent().parent().toggle();
      return google.maps.event.trigger(plotter.controls.maps[mapUuid], 'resize');
    };

    Controls.prototype.toggle = function(selector) {
      return $(selector).toggle();
    };

    Controls.prototype.move = function(plotId, direction) {
      var html;
      return html = "<i style=\"cursor: pointer;\" class=\"icon-arrow-" + direction + "\" onclick=\"plotter.move(" + plotId + ", '" + direction + "')\"></i>";
    };

    Controls.prototype.remove = function(plotId) {
      var html;
      return html = "<i style=\"cursor: pointer;\" class=\"icon-remove\" onclick=\"plotter.remove(" + plotId + ")\"></i>";
    };

    Controls.prototype["new"] = function() {
      var html;
      return html = "<i style=\"cursor: pointer;\" class=\"icon-plus\" onclick=\"plotter.add()\"></i>";
    };

    Controls.prototype.uuid = function() {
      return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
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

    return Controls;

  })();

}).call(this);

(function() {
  var Data,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Plotting || (window.Plotting = {});

  window.Plotting.Data = Data = (function() {
    function Data(data) {
      var preError;
      this.preError = "Data.";
      preError = this.preError + ".constructor(data)";
      if (!(data instanceof Array)) {
        console.log(preError + " data not of type array.");
        return;
      }
      this.data = $.extend(true, [], data);
      this.test = function(row, joinRow, onKeys) {
        var _calculated, _required, i, len, testResult, testRow;
        _required = onKeys.length;
        _calculated = 0;
        testResult = false;
        for (i = 0, len = onKeys.length; i < len; i++) {
          testRow = onKeys[i];
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
      var _dataKeys, _key, _len, _primary, _protoKeys, _row, _secondary, _subKey, _test, _value, key, result, row;
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
        for (_key in _secondary) {
          _row = _secondary[_key];
          _test = this.test(row, _row, onKeys);
          _len = result.push($.extend(true, {}, row));
          if (_test) {
            for (_subKey in _row) {
              _value = _row[_subKey];
              if (indexOf.call(onKeys, _subKey) < 0) {
                result[_len - 1][_subKey + "_2"] = _value;
              }
            }
          }
        }
      }
      this.data = $.extend(true, [], data);
      return this.data;
    };

    Data.prototype.merge = function(data, onKeys) {
      var _dataKeys, _key, _len, _primary, _protoKeys, _row, _secondary, _subKey, _test, _value, key, result, row;
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
        for (_key in _secondary) {
          _row = _secondary[_key];
          _test = this.test(row, _row, onKeys);
          _len = result.push($.extend(true, {}, row));
          if (_test) {
            for (_subKey in _row) {
              _value = _row[_subKey];
              if (indexOf.call(onKeys, _subKey) < 0) {
                result[_len - 1][_subKey] = _value;
              }
            }
          }
        }
      }
      this.data = $.extend(true, [], data);
      return this.data;
    };

    Data.prototype.append = function(data, onKeys) {
      var _key, _primary, _row, _secondary, _subKey, _test, _total, _value, key, row;
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
            delete _secondary[_key];
          }
        }
      }
      _total = _primary.concat(_secondary);
      this.data = $.extend(true, [], _total);
      return this.data;
    };

    Data.prototype.sub = function(start, end) {
      this.data = $.extend(true, [], this.data.slice(start, end));
      return this.data;
    };

    Data.prototype.get = function() {
      return $.extend(true, [], this.data);
    };

    return Data;

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
      var defaults;
      this.preError = "LinePlot.";
      defaults = {
        plotId: null,
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
          dataLoggerId: null,
          variable: null,
          ticks: 5,
          min: null,
          max: null,
          maxBarValue: null,
          color: "rgb(41, 128, 185)"
        },
        yBand: {
          minVariable: null,
          maxVariable: null
        },
        y2: {
          dataLoggerId: null,
          variable: null,
          ticks: 5,
          min: null,
          max: null,
          color: "rgb(39, 174, 96)"
        },
        y2Band: {
          minVariable: null,
          maxVariable: null
        },
        y3: {
          dataLoggerId: null,
          variable: null,
          ticks: 5,
          min: null,
          max: null,
          color: "rgb(142, 68, 173)"
        },
        y3Band: {
          minVariable: null,
          maxVariable: null
        },
        zoom: {
          scale: {
            min: 0.3,
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
          color: "rgb(149, 165, 166)"
        },
        requestInterval: {
          data: 336
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
      this.data = this.processData(data.data);
      this.getDefinition();
      this.state = {
        range: {
          data: null,
          scale: this.getDomainScale(this.definition.x)
        },
        length: {
          data: null
        },
        interval: {
          data: null
        },
        zoom: 1,
        request: {
          data: null
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
        if (this.options.y3.variable !== null) {
          result[key].y3 = row[this.options.y3.variable];
        }
        if (this.options.yBand.minVariable !== null && this.options.yBand.maxVariable !== null) {
          result[key].yMin = row[this.options.yBand.minVariable];
          result[key].yMax = row[this.options.yBand.maxVariable];
        }
        if (this.options.y2Band.minVariable !== null && this.options.y2Band.maxVariable !== null) {
          result[key].y2Min = row[this.options.y2Band.minVariable];
          result[key].y2Max = row[this.options.y2Band.maxVariable];
        }
        if (this.options.y3Band.minVariable !== null && this.options.y3Band.maxVariable !== null) {
          result[key].y3Min = row[this.options.y3Band.minVariable];
          result[key].y3Max = row[this.options.y3Band.maxVariable];
        }
      }
      return result.sort(this.sortDatetimeAsc);
    };

    LinePlot.prototype.appendData = function(data) {
      var _data, _full;
      _data = this.processData(data);
      _full = new Plotting.Data(this.data);
      this.data = _full.append(_data, ["x"]);
      this.data = this.data.sort(this.sortDatetimeAsc);
      this.setDataState();
      this.setIntervalState();
      return this.setDataRequirement();
    };

    LinePlot.prototype.setDataState = function() {
      this.state.range.data = {
        min: d3.min(this.data, function(d) {
          return d.x;
        }),
        max: d3.max(this.data, function(d) {
          return d.x;
        })
      };
      return this.state.length.data = this.data.length;
    };

    LinePlot.prototype.setIntervalState = function() {
      return this.state.interval.data = {
        min: (this.state.range.scale.min.getTime() - this.state.range.data.min.getTime()) / 3600000,
        max: (this.state.range.data.max.getTime() - this.state.range.scale.max.getTime()) / 3600000
      };
    };

    LinePlot.prototype.setDataRequirement = function() {
      var _data_max, _now;
      _now = new Date();
      _data_max = false;
      if (this.state.range.data.max < _now) {
        _data_max = this.state.interval.data.max < this.options.requestInterval.data;
      }
      return this.state.request.data = {
        min: this.state.interval.data.min < this.options.requestInterval.data,
        max: _data_max
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
      this.calculateAxisDims(this.data);
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
      });
      this.definition.line2 = d3.line().defined(function(d) {
        return !isNaN(d.y2) && d.y2 !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y(function(d) {
        return _.definition.y(d.y2);
      });
      this.definition.line3 = d3.line().defined(function(d) {
        return !isNaN(d.y3) && d.y3 !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y(function(d) {
        return _.definition.y(d.y3);
      });
      this.definition.area = d3.area().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y0(function(d) {
        return _.definition.y(d.yMin);
      }).y1(function(d) {
        return _.definition.y(d.yMax);
      });
      this.definition.area2 = d3.area().defined(function(d) {
        return !isNaN(d.y2) && d.y2 !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y0(function(d) {
        return _.definition.y(d.y2Min);
      }).y1(function(d) {
        return _.definition.y(d.y2Max);
      });
      return this.definition.area3 = d3.area().defined(function(d) {
        return !isNaN(d.y3) && d.y3 !== null;
      }).x(function(d) {
        return _.definition.x(d.x);
      }).y0(function(d) {
        return _.definition.y(d.y3Min);
      }).y1(function(d) {
        return _.definition.y(d.y3Max);
      });
    };

    LinePlot.prototype.calculateChartDims = function() {
      var height, margin, width;
      width = Math.round($(this.options.target).width()) - 24;
      height = Math.round(width / this.options.aspectDivisor);
      if (width > 1000) {
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.3)),
          bottom: Math.round(height * 0.08),
          left: Math.round(Math.pow(width, 0.6))
        };
      } else if (width > 600) {
        this.device = 'mid';
        this.options.font.size = this.options.font.size / 1.25;
        height = Math.round(width / (this.options.aspectDivisor / 1.25));
        margin = {
          top: Math.round(height * 0.04),
          right: Math.round(Math.pow(width, 0.3)),
          bottom: Math.round(height * 0.12),
          left: Math.round(Math.pow(width, 0.6))
        };
      } else {
        this.device = 'small';
        this.options.font.size = this.options.font.size / 1.5;
        height = Math.round(width / (this.options.aspectDivisor / 1.5));
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
          return d.y2;
        }), d3.min(data, function(d) {
          return d.yMin;
        }), d3.min(data, function(d) {
          return d.y2Min;
        }), d3.min(data, function(d) {
          return d.y3Min;
        })
      ]);
      this.definition.y.max = d3.max([
        d3.max(data, function(d) {
          return d.y;
        }), d3.max(data, function(d) {
          return d.y2;
        }), d3.max(data, function(d) {
          return d.y3;
        }), d3.max(data, function(d) {
          return d.yMax;
        }), d3.max(data, function(d) {
          return d.y2Max;
        }), d3.max(data, function(d) {
          return d.y3Max;
        })
      ]);
      if (this.definition.y.min === this.definition.y.max) {
        this.definition.y.min = this.definition.y.min * 0.8;
        this.definition.y.max = this.definition.y.min * 1.2;
      }
      this.definition.y.min = d3.min([this.options.y.min, this.definition.y.min]);
      return this.definition.y.max = d3.max([this.options.y.max, this.definition.y.max]);
    };

    LinePlot.prototype.preAppend = function() {};

    LinePlot.prototype.append = function() {
      var _, _y2_title, _y3_title, _y_offset, _y_title, _y_vert, preError;
      preError = this.preError + "append()";
      _ = this;
      this.outer = d3.select(this.options.target).append("div").attr("class", "line-plot-body").style("width", this.definition.dimensions.width + "px").style("height", this.definition.dimensions.height + "px").style("display", "inline-block");
      this.ctls = d3.select(this.options.target).append("div").attr("class", "line-plot-controls").style("width", '23px').style("height", this.definition.dimensions.height + "px").style("display", "inline-block").style("vertical-align", "top");
      this.svg = this.outer.append("svg").attr("class", "line-plot").attr("width", this.definition.dimensions.width).attr("height", this.definition.dimensions.height);
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
      if (this.options.y3.units) {
        _y3_title = _y3_title + " " + this.options.y3.units;
      }
      if (this.options.yBand.minVariable !== null && this.options.yBand.maxVariable !== null) {
        this.lineband = this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.area).attr("class", "line-plot-area").style("fill", this.options.y.color).style("opacity", 0.15).style("stroke", function() {
          return d3.color(_.options.y.color).darker(1);
        });
      }
      if (this.options.y2Band.minVariable !== null && this.options.y2Band.maxVariable !== null) {
        this.lineband2 = this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.area2).attr("class", "line-plot-area2").style("fill", this.options.y2.color).style("opacity", 0.25).style("stroke", function() {
          return d3.rgb(_.options.y2.color).darker(1);
        });
      }
      if (this.options.y3Band.minVariable !== null && this.options.y3Band.maxVariable !== null) {
        this.lineband3 = this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.area3).attr("class", "line-plot-area3").style("fill", this.options.y3.color).style("opacity", 0.25).style("stroke", function() {
          return d3.rgb(_.options.y3.color).darker(1);
        });
      }
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.line).attr("class", "line-plot-path").style("stroke", this.options.y.color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.line2).attr("class", "line-plot-path2").style("stroke", this.options.y2.color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.svg.append("g").attr("clip-path", "url(\#" + this.options.target + "_clip)").append("path").datum(this.data).attr("d", this.definition.line3).attr("class", "line-plot-path3").style("stroke", this.options.y3.color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      if (this.options.y.maxBarValue !== null) {
        this.svg.append("rect").attr("class", "line-plot-max-bar").attr("x", this.definition.dimensions.leftPadding).attr("y", this.definition.y(32)).attr("width", this.definition.dimensions.innerWidth).attr("height", 1).style("color", '#gggggg').style("opacity", 0.4);
      }
      this.crosshairs = this.svg.append("g").attr("class", "crosshair");
      this.crosshairs.append("line").attr("class", "crosshair-x").style("stroke", this.options.crosshairX.color).style("stroke-width", this.options.crosshairX.weight).style("stroke-dasharray", "3, 3").style("fill", "none");
      this.crosshairs.append("rect").attr("class", "crosshair-x-under").style("fill", "rgb(255,255,255)").style("opacity", 0.1);
      this.focusCircle = this.svg.append("circle").attr("r", 4).attr("id", "focus-circle-1").attr("class", "focus-circle").attr("fill", this.options.y.color).attr("transform", "translate(-10, -10)").style("display", "none");
      this.focusText = this.svg.append("text").attr("id", "focus-text-1").attr("class", "focus-text").attr("x", 9).attr("y", 7).style("display", "none").style("fill", this.options.y.color).style("text-shadow", "-2px -2px 0 rgb(255,255,255), 2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255), 2px 2px 0 rgb(255,255,255)");
      this.focusCircle2 = this.svg.append("circle").attr("r", 4).attr("id", "focus-circle-2").attr("class", "focus-circle").attr("fill", this.options.y2.color).attr("transform", "translate(-10, -10)").style("display", "none");
      this.focusText2 = this.svg.append("text").attr("id", "focus-text-2").attr("class", "focus-text").attr("x", 9).attr("y", 7).style("display", "none").style("fill", this.options.y2.color).style("text-shadow", "-2px -2px 0 rgb(255,255,255), 2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255), 2px 2px 0 rgb(255,255,255)");
      this.focusCircle3 = this.svg.append("circle").attr("r", 4).attr("id", "focus-circle-3").attr("class", "focus-circle").attr("fill", this.options.y3.color).attr("transform", "translate(-10, -10)").style("display", "none");
      this.focusText3 = this.svg.append("text").attr("id", "focus-text-3").attr("class", "focus-text").attr("x", 9).attr("y", 7).style("display", "none").style("fill", this.options.y3.color).style("text-shadow", "-2px -2px 0 rgb(255,255,255), 2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255), 2px 2px 0 rgb(255,255,255)");
      this.overlay = this.svg.append("rect").attr("class", "plot-event-target");
      this.appendCrosshairTarget();
      return this.appendZoomTarget();
    };

    LinePlot.prototype.update = function() {
      var _, preError;
      preError = this.preError + "update()";
      _ = this;
      this.svg.select(".line-plot-area").datum(this.data).attr("d", this.definition.area);
      this.svg.select(".line-plot-area2").datum(this.data).attr("d", this.definition.area2);
      this.svg.select(".line-plot-area3").datum(this.data).attr("d", this.definition.area3);
      this.svg.select(".line-plot-path").datum(this.data).attr("d", this.definition.line);
      this.svg.select(".line-plot-path2").datum(this.data).attr("d", this.definition.line2);
      this.svg.select(".line-plot-path3").datum(this.data).attr("d", this.definition.line3);
      this.overlay.datum(this.data);
      this.calculateYAxisDims(this.data);
      this.definition.y.domain([this.definition.y.min, this.definition.y.max]).nice();
      this.svg.select(".line-plot-area").datum(this.data).attr("d", this.definition.area);
      this.svg.select(".line-plot-area2").datum(this.data).attr("d", this.definition.area2);
      this.svg.select(".line-plot-area3").datum(this.data).attr("d", this.definition.area3);
      this.svg.select(".line-plot-path").datum(this.data).attr("d", this.definition.line);
      this.svg.select(".line-plot-path2").datum(this.data).attr("d", this.definition.line2);
      this.svg.select(".line-plot-path3").datum(this.data).attr("d", this.definition.line3);
      return this.svg.select(".line-plot-axis-y").call(this.definition.yAxis);
    };

    LinePlot.prototype.appendCrosshairTarget = function(transform) {
      var _, preError;
      preError = this.preError + "appendCrosshairTarget()";
      _ = this;
      return this.overlay.datum(this.data).attr("class", "overlay").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")").style("fill", "none").style("pointer-events", "all").on("mouseover", function() {
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
      });
      this.svg.select(".line-plot-area").attr("d", this.definition.area);
      this.definition.line = d3.line().defined(function(d) {
        return !isNaN(d.y) && d.y !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y(function(d) {
        return _.definition.y(d.y);
      });
      this.svg.select(".line-plot-path").attr("d", this.definition.line);
      this.definition.area2 = d3.area().defined(function(d) {
        return !isNaN(d.y2Max) && d.y2Max !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y0(function(d) {
        return _.definition.y(d.y2Min);
      }).y1(function(d) {
        return _.definition.y(d.y2Max);
      });
      this.svg.select(".line-plot-area2").attr("d", this.definition.area2);
      this.definition.line2 = d3.line().defined(function(d) {
        return !isNaN(d.y2) && d.y2 !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y(function(d) {
        return _.definition.y(d.y2);
      });
      this.svg.select(".line-plot-path2").attr("d", this.definition.line2);
      this.definition.area3 = d3.area().defined(function(d) {
        return !isNaN(d.y3Max) && d.y3Max !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y0(function(d) {
        return _.definition.y(d.y3Min);
      }).y1(function(d) {
        return _.definition.y(d.y3Max);
      });
      this.svg.select(".line-plot-area3").attr("d", this.definition.area3);
      this.definition.line3 = d3.line().defined(function(d) {
        return !isNaN(d.y3) && d.y3 !== null;
      }).x(function(d) {
        return _transform.applyX(_.definition.x(d.x));
      }).y(function(d) {
        return _.definition.y(d.y3);
      });
      this.svg.select(".line-plot-path3").attr("d", this.definition.line3);
      this.appendCrosshairTarget(_transform);
      return _transform;
    };

    LinePlot.prototype.setCrosshair = function(transform, mouse) {
      var _, _datum, _dims, _mouseTarget, cx, d, dx, dy, dy2, dy3, i, preError, x0, ypos;
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
      if (x0.getTime() < this.state.range.data.min.getTime()) {
        d = _datum[i - 1];
      }
      if (x0.getTime() > this.state.range.data.max.getTime()) {
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
      if (this.options.y3.variable !== null) {
        dy3 = this.definition.y(d.y3);
        this.focusCircle3.attr("transform", "translate(0, 0)");
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
      if (this.options.y3.variable !== null) {
        this.focusCircle3.attr("cx", dx).attr("cy", dy3);
        this.focusText3.attr("x", dx + _dims.leftPadding / 10).attr("y", dy3 - _dims.topPadding / 10).text(d.y3.toFixed(2) + " " + this.options.y3.units);
      }
      if (this.options.y.variable !== null && this.options.y2.variable !== null && this.options.y3.variable !== null) {
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
        this.focusText2.style("display", null);
      }
      if (this.options.y3.variable !== null) {
        this.focusCircle3.style("display", null);
        return this.focusText3.style("display", null);
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
        this.focusText2.style("display", "none");
      }
      if (this.options.y3.variable !== null) {
        this.focusCircle3.style("display", "none");
        return this.focusText3.style("display", "none");
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
        refresh: 500,
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
      this.controls = new window.Plotting.Controls;
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
      return this.listen();
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
      var _, args, callback, preError, target;
      preError = this.preError + ".getStationParamData()";
      target = location.protocol + "//dev.nwac.us/api/v5/measurement";
      _ = this;
      args = this.template[plotId].dataParams;
      callback = function(data) {
        return _.template[plotId].data = data.responseJSON;
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

    Handler.prototype.append = function() {
      var _bounds, dKey, data, instance, key, plot, preError, ref, ref1, results, row, target, title;
      preError = this.preError + ".append()";
      ref = this.template;
      results = [];
      for (key in ref) {
        plot = ref[key];
        target = this.utarget(this.options.target);
        $(this.options.target).append("<div id='" + target + "'></div>");
        plot.type = "parameter";
        plot.options.plotId = key;
        plot.options.uuid = this.uuid();
        plot.options.target = "\#" + target;
        plot.options.dataParams = plot.dataParams;
        plot.options.y.color = this.getColor('light', key);
        if (plot.options.y2) {
          plot.options.y2.color = this.getColor('light', key + 1);
        }
        if (plot.options.y3) {
          plot.options.y3.color = this.getColor('light', key + 2);
        }
        _bounds = this.getVariableBounds(plot.options.y.variable);
        if (_bounds) {
          plot.options.y.min = _bounds.min;
          plot.options.y.max = _bounds.max;
        }
        if (plot.options.y.variable === 'temperature') {
          plot.options.y.maxBarValue = 32;
        }
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
          plot.data = [null, null];
        } else {
          data = {
            data: plot.data.results
          };
          plot.data = null;
        }
        title = this.getTitle(plot);
        instance = new window.Plotting.LinePlot(data, plot.options);
        instance.append();
        this.template[key].proto = instance;
        results.push(this.appendControls(key));
      }
      return results;
    };

    Handler.prototype.mergeTemplateOption = function() {};

    Handler.prototype.getPrependData = function(plotId, dataParams, key) {
      var _, _is_array, args, callback, preError, target;
      preError = this.preError + ".getPrependData(key, dataParams)";
      target = "http://dev.nwac.us/api/v5/measurement";
      _ = this;
      _is_array = dataParams instanceof Array;
      args = dataParams;
      callback = function(data) {
        _.template[plotId].proto.appendData(data.responseJSON.results);
        return _.template[plotId].proto.update();
      };
      return this.api.get(target, args, callback);
    };

    Handler.prototype.getAppendData = function(plotId, dataParams) {
      var _, args, callback, preError, target;
      preError = this.preError + ".getAppendData(key, dataParams)";
      target = "http://dev.nwac.us/api/v5/measurement";
      _ = this;
      args = dataParams;
      callback = function(data) {
        _.template[plotId].proto.appendData(data.responseJSON.results);
        return _.template[plotId].proto.update();
      };
      return this.api.get(target, args, callback);
    };

    Handler.prototype.prependData = function(key) {
      var dataParams, pKey, params, plot, preError, ref, state;
      preError = this.preError + ".prependData()";
      plot = this.template[key];
      state = plot.proto.getState();
      if (plot.proto.options.dataParams instanceof Array) {
        dataParams = [];
        ref = plot.proto.options.dataParams;
        for (pKey in ref) {
          params = ref[pKey];
          dataParams[pKey] = params;
          dataParams[pKey].max_datetime = this.format(state.range.data.min);
          dataParams[pKey].limit = this.options.updateLength;
        }
      } else {
        dataParams = plot.proto.options.dataParams;
        dataParams.max_datetime = this.format(state.range.data.min);
        dataParams.limit = this.options.updateLength;
      }
      return this.getPrependData(key, dataParams);
    };

    Handler.prototype.appendData = function(key) {
      var _max_datetime, _new_max_datetime, _now, dataParams, pKey, params, plot, preError, ref, state;
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
        for (pKey in ref) {
          params = ref[pKey];
          dataParams[pKey] = plot.proto.options.dataParams[pKey];
          dataParams[pKey].max_datetime = this.format(new Date(_new_max_datetime));
          dataParams[pKey].limit = this.options.updateLength;
        }
      } else {
        dataParams = plot.proto.options.dataParams;
        dataParams.max_datetime = this.format(new Date(_new_max_datetime));
        dataParams.limit = this.options.updateLength;
      }
      return this.getPrependData(key, dataParams);
    };

    Handler.prototype.addVariable = function(plotId, variable) {
      var _bounds, _info, _max_datetime, dataParams, state;
      state = this.template[plotId].proto.getState();
      _bounds = this.getVariableBounds(variable);
      _info = this.getVariableInfo(variable);
      _max_datetime = state.range.data.max.getTime();
      dataParams = this.template[plotId].proto.options.dataParams;
      dataParams.max_datetime = this.format(new Date(_max_datetime));
      dataParams.limit = state.length.data;
      if (this.template[plotId].proto.options.y.variable === null) {
        this.template[plotId].proto.options.y = {
          variable: variable
        };
        if (_info) {
          this.template[plotId].proto.options.y.title = _info.title;
          this.template[plotId].proto.options.y.units = _info.units;
        }
        if (_bounds) {
          this.template[plotId].proto.options.y.min = _bounds.min;
          this.template[plotId].proto.options.y.max = _bounds.max;
        }
      } else if (this.template[plotId].proto.options.y2.variable === null) {
        this.template[plotId].proto.options.y2 = {
          variable: variable
        };
        if (_info) {
          this.template[plotId].proto.options.y.title = _info.title;
          this.template[plotId].proto.options.y.units = _info.units;
        }
        if (_bounds) {
          this.template[plotId].proto.options.y2.min = _bounds.min;
          this.template[plotId].proto.options.y2.max = _bounds.max;
        }
      }
      this.getAppendData(plotId, dataParams);
      return this.controls.updateParameterDropdown(plotId);
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

    Handler.prototype.appendControls = function(plotId) {
      var _down_control, _li_style, _new_control, _remove_control, _up_control, current, html, selector;
      selector = "plot-controls-" + plotId;
      _li_style = "";
      _new_control = this.controls["new"]();
      _remove_control = this.controls.remove(plotId);
      _up_control = this.controls.move(plotId, 'up');
      _down_control = this.controls.move(plotId, 'down');
      html = "<ul id=\"" + selector + "\" class=\"unstyled\" style=\"list-style-type: none; padding-left: 6px;\"> <li>" + _up_control + "</li> <li>" + _remove_control + "</li> <li>" + _new_control + "</li> <li>" + _down_control + "</i></li> </ul>";
      $(this.template[plotId].proto.options.target).find(".line-plot-controls").append(html);
      if (this.template[plotId].type === "station") {
        current = [this.template[plotId].proto.options.y, this.template[plotId].proto.options.y2, this.template[plotId].proto.options.y3];
        return this.controls.appendParameterDropdown(plotId, '#' + selector, 1, current);
      } else if (this.template[plotId].type === "parameter") {
        current = [this.template[plotId].proto.options.y, this.template[plotId].proto.options.y2, this.template[plotId].proto.options.y3];
        this.controls.appendStationMap(plotId, '#' + selector, 1, current);
        return this.controls.appendStationDropdown(plotId, '#' + selector, 1, current);
      }
    };

    Handler.prototype.remove = function(plotId) {
      $(this.template[plotId].proto.options.target).fadeOut(500, function() {
        return $(this).remove();
      });
      return this.template[plotId] = null;
    };

    Handler.prototype.move = function(plotId, direction) {
      var selected;
      selected = $(this.template[plotId].proto.options.target);
      if (direction === 'up') {
        return selected.prev().insertAfter(selected);
      } else if (direction === 'down') {
        return selected.next().insertBefore(selected);
      }
    };

    Handler.prototype.getVariableBounds = function(variable) {
      var bounds;
      bounds = {
        battery_voltage: {
          min: 8,
          max: 16
        },
        net_solar: {
          min: 0,
          max: 800
        },
        relative_humidity: {
          min: 0,
          max: 100
        },
        snow_depth: {
          min: 0,
          max: 40
        },
        wind_direction: {
          min: 0,
          max: 360
        },
        precipitation: {
          min: 0,
          max: 0.7
        },
        temperature: {
          min: 0,
          max: 60
        },
        wind_speed: {
          min: 0,
          max: 60
        }
      };
      return bounds[variable];
    };

    Handler.prototype.getVariableInfo = function(variable) {
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
        relative_humidity: {
          title: "Relative Humidity",
          units: "%"
        },
        barometric_pressure: {
          title: "Barometric Pressure",
          units: "atm"
        },
        snow_depth: {
          title: "Snow Depth",
          units: "\""
        },
        wind_direction: {
          title: "Wind Direction",
          units: "°"
        },
        precipitation: {
          title: "Precipitation",
          units: "\""
        },
        temperature: {
          title: "Temperature",
          units: "°F"
        },
        wind_speed: {
          title: "Wind Speed",
          units: "mph"
        }
      };
      return info[variable];
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

    Handler.prototype.uuid = function() {
      return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    };

    Handler.prototype.utarget = function(prepend) {
      prepend = prepend.replace('#', '');
      return prepend + "-" + (this.uuid());
    };

    return Handler;

  })();

}).call(this);
