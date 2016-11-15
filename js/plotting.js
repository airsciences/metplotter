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
  var Controls,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Plotting || (window.Plotting = {});

  window.Plotting.Controls = Controls = (function() {
    function Controls(plotter, access, options) {
      var accessToken, defaults;
      this.preError = "Plotting.Dropdown";
      this.plotter = plotter;
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
      this.markers = {};
      this.listeners = {};
      this.api = new window.Plotting.API(access.token);
    }

    Controls.prototype.appendStationDropdown = function(plotId, appendTarget, parameter, current) {
      var _, args, callback, target, uuid;
      target = location.protocol + "//dev.nwac.us/api/v5/dataloggerregion?sensor_name=" + parameter;
      _ = this;
      args = {};
      uuid = this.uuid();
      callback = function(data) {
        var _dots, _id, _prepend, _region_selected, _row_current, _station, a_color, color, html, i, id, j, k, l, len, len1, len2, len3, len4, m, r_color, ref, ref1, ref2, ref3, ref4, region, station;
        html = "<div class=\"dropdown\"> <li><a id=\"" + uuid + "\" class=\"station-dropdown dropdown-toggle\" role=\"button\" data-toggle=\"dropdown\" href=\"#\"> <i class=\"icon-list\"></i></a> <ul id=\"station-dropdown-" + plotId + "\" class=\"dropdown-menu dropdown-menu-right\">";
        ref = data.responseJSON.results;
        for (i = 0, len = ref.length; i < len; i++) {
          region = ref[i];
          a_color = "";
          r_color = "";
          _dots = "<span class=\"station-dots\">";
          _region_selected = 0;
          ref1 = region.dataloggers;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            _station = ref1[j];
            _row_current = _.isCurrent(current, 'dataLoggerId', _station.id);
            if (_row_current) {
              _region_selected++;
              _dots = _dots + " <i class=\"icon-circle\" style=\"color: " + _row_current.color + "\"></i>";
            }
          }
          if (_region_selected > 0) {
            r_color = "style=\"background-color: rgb(248,248,248)\"";
            a_color = "style=\"font-weight: 700\"";
          }
          html = html + " <li class=\"subheader\" " + r_color + "> <a " + a_color + " href=\"#\"><i class=\"icon-caret-down\" style=\"margin-right: 6px\"></i> " + region.name + " " + _dots + "</span></a> </li> <ul class=\"list-group-item sublist\" style=\"display: none;\">";
          ref2 = region.dataloggers;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            station = ref2[k];
            _row_current = _.isCurrent(current, 'dataLoggerId', station.id);
            color = "";
            if (_row_current) {
              color = "style=\"color: " + _row_current.color + "\"";
            }
            id = "data-logger-" + station.id + "-plot-" + plotId;
            _prepend = "<i id=\"" + id + "\" class=\"icon-circle\" " + color + "></i>";
            _id = "add-station-" + plotId + "-" + station.id;
            html = html + " <li class=\"station\" id=\"" + _id + "\" data-station-id=\"" + station.id + "\" data-plot-id=\"" + plotId + "\" style=\"padding: 1px 5px; cursor: pointer; list-style-type: none\" onclick=\"\"> " + _prepend + " " + station.datalogger_name + " | " + station.elevation + " ft</li>";
          }
          html = html + " </ul>";
        }
        html = html + " </ul> </li>";
        $(appendTarget).prepend(html);
        ref3 = data.responseJSON.results;
        for (l = 0, len3 = ref3.length; l < len3; l++) {
          region = ref3[l];
          ref4 = region.dataloggers;
          for (m = 0, len4 = ref4.length; m < len4; m++) {
            station = ref4[m];
            _id = "add-station-" + plotId + "-" + station.id;
            $("#" + _id).on("click", function(event) {
              var _plotId, _stationId;
              event.stopPropagation();
              _plotId = $(this).attr("data-plot-id");
              _stationId = $(this).attr("data-station-id");
              return _.plotter.addStation(_plotId, _stationId);
            });
          }
        }
        $('#' + uuid).dropdown();
        _.bindSubMenuEvent(".subheader");
        return _.appendStationMap(plotId, appendTarget, data.responseJSON.results, current);
      };
      return this.api.get(target, args, callback);
    };

    Controls.prototype.updateStationDropdown = function(plotId) {
      var _, _append, _id, _options, id;
      _ = this;
      _options = this.plotter.template[plotId].proto.options;
      _append = "";
      if (_options.y.dataLoggerId !== null) {
        _id = _options.y.dataLoggerId;
        _append = " <i class=\"icon-circle\" style=\"color: " + _options.y.color + "\"></i>";
        id = "data-logger-" + _id + "-plot-" + plotId;
        $(_options.target).find("#" + id).css("color", _options.y.color).parent().parent().prev().css("background-color", "rgb(248,248,248)").css("font-weight", 700).children(":first").children(".station-dots").empty().append(_append);
        $("#add-station-" + plotId + "-" + _id).off('click').on("click", function(event) {
          var _plotId, _stationId;
          event.stopPropagation();
          console.log("this", $(this));
          _plotId = $(this).attr("data-plot-id");
          _stationId = $(this).attr("data-station-id");
          return _.plotter.removeStation(_plotId, _stationId);
        });
      }
      if (_options.y2.variable !== null) {
        _id = _options.y2.dataLoggerId;
        _append = " <i class=\"icon-circle\" style=\"color: " + _options.y2.color + "\"></i>";
        id = "data-logger-" + _id + "-plot-" + plotId;
        $(_options.target).find("\#" + id).css("color", _options.y2.color).parent().parent().prev().css("background-color", "rgb(248,248,248)").css("font-weight", 700).children(":first").append(_append);
        $("#add-station-" + plotId + "-" + _id).off('click').on("click", function(event) {
          var _plotId, _stationId;
          event.stopPropagation();
          _plotId = $(this).attr("data-plot-id");
          _stationId = $(this).attr("data-station-id");
          return _.plotter.removeStation(_plotId, _stationId);
        });
      }
      if (_options.y3.variable !== null) {
        _id = _options.y3.dataLoggerId;
        _append = " <i class=\"icon-circle\" style=\"color: " + _options.y3.color + "\"></i>";
        id = "data-logger-" + _id + "-plot-" + plotId;
        $(_options.target).find("\#" + id).css("color", _options.y3.color).parent().parent().prev().css("background-color", "rgb(248,248,248)").css("font-weight", 700).children(":first").append(_append);
        return $("#add-station-" + plotId + "-" + _id).off('click').on("click", function(event) {
          var _plotId, _stationId;
          event.stopPropagation();
          _plotId = $(this).attr("data-plot-id");
          _stationId = $(this).attr("data-station-id");
          return _.plotter.removeStation(_plotId, _stationId);
        });
      }
    };

    Controls.prototype.appendParameterDropdown = function(plotId, appendTarget, dataLoggerId, current) {
      var _current, args, callback, target, uuid;
      target = location.protocol + "//dev.nwac.us/api/v5/sensortype?sensors__data_logger=" + dataLoggerId;
      args = {};
      uuid = this.uuid();
      _current = [];
      callback = function(data) {
        var _add, _id, _prepend, html, i, id, len, parameter, ref, ref1;
        html = "<div class=\"dropdown\"> <li><a id=\"" + uuid + "\" class=\"parameter-dropdown dropdown-toggle\" role=\"button\" data-toggle=\"dropdown\" href=\"#\"> <i class=\"icon-list\"></i></a> <ul id=\"param-dropdown-" + plotId + "\" class=\"dropdown-menu dropdown-menu-right\" role=\"menu\" aria-labelledby=\"" + uuid + "\">";
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

    Controls.prototype.updateParameterDropdown = function(plotId) {
      var _id, _options, id;
      _options = this.plotter.template[plotId].proto.options;
      if (_options.y.variable !== null) {
        _id = _options.y.variable.replace('_', '-');
        id = _id + "-plot-" + plotId;
        $(_options.target).find("\#" + id).css("color", _options.y.color);
      }
      if (_options.y2.variable !== null) {
        _id = _options.y2.variable.replace('_', '-');
        id = _id + "-plot-" + plotId;
        $(_options.target).find("\#" + id).css("color", _options.y2.color);
      }
      if (_options.y3.variable !== null) {
        _id = _options.y3.variable.replace('_', '-');
        id = _id + "-plot-" + plotId;
        return $(_options.target).find("\#" + id).css("color", _options.y3.color);
      }
    };

    Controls.prototype.appendStationMap = function(plotId, appendTarget, results, current) {
      var _, _bound_points, _bounds, _len, _point, _row_current, _row_id, color, dom_uuid, html, i, infowindow, j, k, len, len1, len2, marker, opacity, ref, region, scale, station, uuid;
      _ = this;
      uuid = this.uuid();
      dom_uuid = "map-control-" + plotId;
      html = "<li data-toggle=\"popover\" data-placement=\"left\"> <i id=\"map-" + plotId + "\" class=\"icon-map-marker\" style=\"cursor: pointer\"></i> </li> <div class=\"popover\" style=\"max-width: 356px;\"> <div class=\"arrow\"></div> <div class=\"popover-content\"> <div id=\"" + dom_uuid + "\" style=\"width: 312px; height: 312px;\"></div> </div> </div>";
      $(appendTarget).prepend(html);
      $("#map-" + plotId).on('click', function() {
        return _.plotter.controls.toggleMap(plotId);
      });
      this.maps[plotId] = new google.maps.Map(document.getElementById(dom_uuid), {
        center: new google.maps.LatLng(46.980, -121.980),
        zoom: 6,
        maxZoom: 12,
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
            dataloggerid: station.id,
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
          this.listeners[_row_id] = marker.addListener('click', function() {
            console.log("Marker clicked", this);
            return _.plotter.addStation(plotId, this.dataloggerid);
          });
          _len = this.markers[_row_id] = marker;
          this.markers[_row_id].setMap(this.maps[plotId]);
        }
      }
      for (k = 0, len2 = _bound_points.length; k < len2; k++) {
        _point = _bound_points[k];
        _bounds.extend(_point);
      }
      return this.maps[plotId].fitBounds(_bounds);
    };

    Controls.prototype.resetStationMap = function(plotId) {
      var _, _key, _marker, ref, results1;
      _ = this;
      ref = this.markers;
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
        _.listeners[_key].remove();
        results1.push(_.listeners[_key] = _marker.addListener('click', function() {
          var _dataLoggerId;
          _dataLoggerId = this.get("dataloggerid");
          return _.plotter.addStation(plotId, _dataLoggerId);
        }));
      }
      return results1;
    };

    Controls.prototype.updateStationMap = function(plotId) {
      var _, _color, _id, _options, _row_id, updateMarker;
      _ = this;
      this.resetStationMap(plotId);
      updateMarker = function(plotId, rowId, color) {
        _.markers[rowId].setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          strokeWeight: 2,
          fillOpacity: 0.8,
          fillColor: color
        });
        _.markers[rowId].set("selected", true);
        _.listeners[rowId].remove();
        return _.listeners[rowId] = _.markers[rowId].addListener('click', function() {
          var _dataLoggerId;
          _dataLoggerId = this.get("dataloggerid");
          return _.plotter.removeStation(plotId, _dataLoggerId);
        });
      };
      _options = this.plotter.template[plotId].proto.options;
      if (_options.y.variable !== null) {
        _id = _options.y.variable.replace('_', '-');
        _row_id = "map-plot-" + plotId + "-station-" + _options.y.dataLoggerId;
        _color = _options.y.color;
        updateMarker(plotId, _row_id, _color);
      }
      if (_options.y2.variable !== null) {
        _id = _options.y2.variable.replace('_', '-');
        _row_id = "map-plot-" + plotId + "-station-" + _options.y2.dataLoggerId;
        _color = _options.y2.color;
        updateMarker(plotId, _row_id, _color);
      }
      if (_options.y3.variable !== null) {
        _id = _options.y3.variable.replace('_', '-');
        _row_id = "map-plot-" + plotId + "-station-" + _options.y3.dataLoggerId;
        _color = _options.y3.color;
        updateMarker(plotId, _row_id, _color);
      }
      return this.boundOnSelected(plotId);
    };

    Controls.prototype.boundOnSelected = function(plotId) {
      var _, _bound_points, _bounds, _key, _marker, _point, _selected, i, len, ref;
      _ = this;
      _bounds = new google.maps.LatLngBounds();
      _bound_points = [];
      ref = this.markers;
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
      return this.maps[plotId].fitBounds(_bounds);
    };

    Controls.prototype.toggleMap = function(plotId) {
      var __nwac_left, __nwac_top, _center, _offset, _zoom;
      __nwac_left = 128;
      __nwac_top = 256;
      _center = this.plotter.controls.maps[plotId].getCenter();
      _zoom = this.plotter.controls.maps[plotId].getZoom();
      _offset = $("#map-control-" + plotId).parent().parent().prev().offset();
      $("#map-control-" + plotId).parent().parent().toggle().css("left", _offset.left - 356 - __nwac_left).css("top", _offset.top - __nwac_top);
      google.maps.event.trigger(this.plotter.controls.maps[plotId], 'resize');
      this.plotter.controls.maps[plotId].setCenter(_center);
      return this.plotter.controls.maps[plotId].setZoom(_zoom);
    };

    Controls.prototype.toggle = function(selector) {
      return $(selector).toggle();
    };

    Controls.prototype.move = function(plotId, appendTarget, direction) {
      var _, html;
      _ = this;
      html = "<i id=\"move-" + plotId + "-" + direction + "\" style=\"cursor: pointer;\" class=\"icon-arrow-" + direction + "\"></i>";
      $(appendTarget).append(html);
      return $("#move-" + plotId + "-" + direction).on('click', function() {
        return _.plotter.move(plotId, direction);
      });
    };

    Controls.prototype.remove = function(plotId, appendTarget) {
      var _, html;
      _ = this;
      html = "<i id=\"remove-" + plotId + "\" style=\"cursor: pointer;\" class=\"icon-remove\"></i>";
      $(appendTarget).append(html);
      return $("#remove-" + plotId).on('click', function() {
        return _.plotter.remove(plotId);
      });
    };

    Controls.prototype["new"] = function(appendTarget) {
      var _, _ul, html, uuid;
      _ = this;
      uuid = this.uuid();
      _ul = "<ul id=\"new-" + uuid + "-dropdown\" class=\"dropdown-menu dropdown-menu-right\" role=\"menu\" aria-labelledby=\"new-" + uuid + "\"> <li><a id=\"new-" + uuid + "-parameter\" style=\"cursor: pointer\">Add Parameter Plot</a></li> <li><a id=\"new-" + uuid + "-station\" style=\"cursor: pointer\">Add Station Plot</a></li> </ul>";
      html = "<div class=\"dropdown\"> <li><a id=\"new-" + uuid + "\" role=\"button\" href=\"#\"> <i class=\"icon-plus\"></i> </a></li> </div>";
      $(appendTarget).append(html);
      return $("#new-" + uuid).on('click', function() {
        return _.plotter.add("parameter");
      });
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

    return Controls;

  })();

}).call(this);

(function() {
  var Data,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Plotting || (window.Plotting = {});

  window.Plotting.Data = Data = (function() {
    function Data(data) {
      var _len, i, j, preError, ref;
      this.preError = "Plotting.Data.";
      preError = this.preError + ".constructor(...)";
      if (!(data instanceof Array)) {
        console.log(preError + " data not of type array.");
        return;
      }
      this.data = $.extend(true, [], data);
      this.sourceCount = 1;
      _len = this.data.length - 1;
      for (i = j = 0, ref = _len; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (this.data[i] === void 0) {
          console.log(preError + " on construct, @data[i] is (i, row)", i, this.data[i]);
        }
      }
      this.test = function(row, joinRow, onKeys) {
        var _calculated, _required, k, len, testResult, testRow;
        preError = this.preError + "test(...):";
        _required = onKeys.length;
        _calculated = 0;
        testResult = false;
        for (k = 0, len = onKeys.length; k < len; k++) {
          testRow = onKeys[k];
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
    function LinePlot(plotter, data, options) {
      var _domainMean, _domainScale;
      this.preError = "LinePlot.";
      this.plotter = plotter;
      this.initialized = false;
      this.defaults = {
        plotId: null,
        uuid: '',
        debug: true,
        target: null,
        dataParams: null,
        merge: false,
        x: {
          variable: null,
          format: "%Y-%m-%dT%H:%M:%SZ",
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
          color: "rgb(149,165,166)"
        },
        requestInterval: {
          data: 336
        }
      };
      if (options.x) {
        options.x = Object.mergeDefaults(options.x, this.defaults.x);
      }
      if (options.y) {
        options.y = Object.mergeDefaults(options.y, this.defaults.y);
      }
      if (options.y2) {
        options.y2 = Object.mergeDefaults(options.y2, this.defaults.y2);
      }
      if (options.y3) {
        options.y3 = Object.mergeDefaults(options.y3, this.defaults.y3);
      }
      this.options = Object.mergeDefaults(options, this.defaults);
      this.device = 'full';
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
          "variable": "precitation",
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
      _domainScale = null;
      _domainMean = null;
      if (data.length > 0) {
        _domainScale = this.getDomainScale(this.definition.x);
        _domainMean = this.getDomainMean(this.definition.x);
      }
      this.state = {
        range: {
          data: null,
          scale: _domainScale
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
          scale: _domainMean
        }
      };
      if (data.length > 0) {
        this.setDataState();
        this.setIntervalState();
        this.setDataRequirement();
      }
    }

    LinePlot.prototype.processData = function(data) {
      var _result, key, result, row;
      result = [];
      for (key in data) {
        row = data[key];
        result[key] = {
          x: new Date(this.parseDate(row[this.options.x.variable]).getTime() - 8 * 3600000),
          y: row[this.options.y.variable]
        };
        if (this.options.y2.variable !== null) {
          if (this.options.y.variable === this.options.y2.variable) {
            result[key].y2 = row[this.options.y2.variable + "_2"];
          } else {
            result[key].y2 = row[this.options.y2.variable];
          }
        }
        if (this.options.y3.variable !== null) {
          if (this.options.y.variable === this.options.y3.variable || this.options.y2.variable === this.options.y3.variable) {
            result[key].y3 = row[this.options.y3.variable + "_3"];
          } else {
            result[key].y3 = row[this.options.y3.variable];
          }
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
      _result = new Plotting.Data(result);
      result = _result._clean(_result.get());
      return result.sort(this.sortDatetimeAsc);
    };

    LinePlot.prototype.setData = function(data) {
      var _domainMean, _domainScale;
      this.data = this.processData(data);
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

    LinePlot.prototype.appendData = function(data) {
      var _data, _full;
      _data = this.processData(data);
      _full = new Plotting.Data(this.data);
      _full.append(_data, ["x"]);
      this.data = _full._clean(_full.get());
      this.data = this.data.sort(this.sortDatetimeAsc);
      if (this.initialized) {
        this.setDataState();
        this.setIntervalState();
        return this.setDataRequirement();
      }
    };

    LinePlot.prototype.removeData = function(key) {
      var _full, _key, _row, ref, result;
      result = [];
      ref = this.data;
      for (_key in ref) {
        _row = ref[_key];
        delete _row[key];
        result[_key] = _row;
      }
      _full = new Plotting.Data(result);
      this.data = _full.get();
      this.data = this.data.sort(this.sortDatetimeAsc);
      if (this.initialized) {
        this.setDataState();
        this.setIntervalState();
        return this.setDataRequirement();
      }
    };

    LinePlot.prototype.setDataState = function() {
      var _len, i, j, ref;
      _len = this.data.length - 1;
      for (i = j = 0, ref = _len; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (this.data[i] === void 0) {
          console.log("data[i] is (i, row)", i, this.data[i]);
        }
      }
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
        return _.plotter.zoom(transform);
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
      this.definition.y.min = this.options.y.min === null ? this.definition.y.min : this.options.y.min;
      return this.definition.y.max = this.options.y.max === null ? this.definition.y.max : this.options.y.max;
    };

    LinePlot.prototype.preAppend = function() {
      var _, _offset, add_text, preError, sub_text;
      preError = this.preError + "preAppend()";
      _ = this;
      this.outer = d3.select(this.options.target).append("div").attr("class", "line-plot-body").style("width", this.definition.dimensions.width + "px").style("height", this.definition.dimensions.height + "px").style("display", "inline-block");
      this.ctls = d3.select(this.options.target).append("div").attr("class", "line-plot-controls").style("width", '23px').style("height", this.definition.dimensions.height + "px").style("display", "inline-block").style("vertical-align", "top");
      if (this.data.length === 0) {
        if (this.options.type === "station") {
          add_text = "Select the Plot's Station";
          sub_text = "Station type plots allow comparison of different variables from the same station.";
        } else if (this.options.type === "parameter") {
          add_text = "Select the Plot's Parameter";
          sub_text = "Parameter type plots allow comparison of a single paramater at multiple stations";
        }
        _offset = $(this.options.target).offset();
        this.temp = this.outer.append("div").attr("class", "new-temp-" + this.options.plotId).style("position", "absolute").style("top", (parseInt(_offset.top + this.definition.dimensions.innerHeight / 2 - 18)) + "px").style("left", (parseInt(_offset.left + this.definition.dimensions.margin.left)) + "px").style("width", this.definition.dimensions.innerWidth + "px").style("text-align", "center");
        this.dropdown = this.temp.append("div").attr("class", "dropdown");
        this.dropdown.append("a").text(add_text).attr("class", "dropdown-toggle").attr("data-toggle", "dropdown");
        this.dropdown.append("ul").attr("class", "dropdown-menu").selectAll("li").data(_.links).enter().append("li").append("a").text(function(d) {
          return d.title;
        }).on("click", function(d) {
          return _.plotter.initVariable(_.options.plotId, d.variable, d.title);
        });
        this.temp.append("p").text(sub_text).style("color", "#ggg").style("font-size", "12px");
      }
      this.svg = this.outer.append("svg").attr("class", "line-plot").attr("width", this.definition.dimensions.width).attr("height", this.definition.dimensions.height);
      this.svg.append("defs").append("clipPath").attr("id", this.options.target + "_clip").append("rect").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")");
      this.svg.append("g").attr("class", "line-plot-axis-x").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.xAxis).attr("transform", "translate(0, " + this.definition.dimensions.bottomPadding + ")");
      return this.svg.append("g").attr("class", "line-plot-axis-y").style("fill", "none").style("stroke", this.options.axisColor).style("font-size", this.options.font.size).style("font-weight", this.options.font.weight).call(this.definition.yAxis).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", 0)");
    };

    LinePlot.prototype.append = function() {
      var _, _y2_title, _y3_title, _y_offset, _y_title, _y_vert, preError;
      this.initialized = true;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + "append()";
      _ = this;
      _y_title = "" + this.options.y.title;
      if (this.options.y.units) {
        _y_title = _y_title + " " + this.options.y.units;
      }
      _y_vert = -95;
      _y_offset = -52;
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
      this.svg.select(".line-plot-path").datum(this.data).attr("d", this.definition.line).style("stroke", this.options.y.color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.svg.select(".line-plot-path2").datum(this.data).attr("d", this.definition.line2).style("stroke", this.options.y2.color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
      this.svg.select(".line-plot-path3").datum(this.data).attr("d", this.definition.line3).style("stroke", this.options.y3.color).style("stroke-width", Math.round(Math.pow(this.definition.dimensions.width, 0.1))).style("fill", "none");
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

    LinePlot.prototype.removeTemp = function() {
      return this.temp.remove();
    };

    LinePlot.prototype.appendCrosshairTarget = function(transform) {
      var _, preError;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + "appendCrosshairTarget()";
      _ = this;
      return this.overlay.datum(this.data).attr("class", "overlay").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")").style("fill", "none").style("pointer-events", "all").on("mouseover", function() {
        return _.plotter.showCrosshairs();
      }).on("mouseout", function() {
        return _.plotter.hideCrosshairs();
      }).on("mousemove", function() {
        var mouse;
        mouse = _.setCrosshair(transform);
        return _.plotter.crosshair(transform, mouse);
      });
    };

    LinePlot.prototype.appendZoomTarget = function() {
      var _, preError;
      if (!this.initialized) {
        return;
      }
      preError = this.preError + "appendZoomTarget()";
      _ = this;
      return this.overlay.attr("class", "zoom-pane").attr("width", this.definition.dimensions.innerWidth).attr("height", this.definition.dimensions.innerHeight).attr("transform", "translate(" + this.definition.dimensions.leftPadding + ", " + this.definition.dimensions.topPadding + ")").style("fill", "none").style("pointer-events", "all").style("cursor", "move").call(this.definition.zoom, d3.zoomIdentity);
    };

    LinePlot.prototype.setZoomTransform = function(transform) {
      var _, _rescaleX, _transform, preError;
      if (!this.initialized) {
        return;
      }
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
      if (!this.initialized) {
        return;
      }
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
        if (!isNaN(dy)) {
          this.focusCircle.attr("transform", "translate(0, 0)");
        }
      }
      if (this.options.y2.variable !== null) {
        dy2 = this.definition.y(d.y2);
        if (!isNaN(dy2)) {
          this.focusCircle2.attr("transform", "translate(0, 0)");
        }
      }
      if (this.options.y3.variable !== null) {
        dy3 = this.definition.y(d.y3);
        if (!isNaN(dy3)) {
          this.focusCircle3.attr("transform", "translate(0, 0)");
        }
      }
      if (d === null || d === void 0) {
        console.log("d is broken (d)", d);
      }
      cx = dx - _dims.leftPadding;
      this.crosshairs.select(".crosshair-x").attr("x1", cx).attr("y1", _dims.topPadding).attr("x2", cx).attr("y2", _dims.innerHeight + _dims.topPadding).attr("transform", "translate(" + _dims.leftPadding + ", 0)");
      this.crosshairs.select(".crosshair-x-under").attr("x", cx).attr("y", _dims.topPadding).attr("width", _dims.innerWidth - cx).attr("height", _dims.innerHeight).attr("transform", "translate(" + _dims.leftPadding + ", 0)");
      if (this.options.y.variable !== null && !isNaN(dy)) {
        this.focusCircle.attr("cx", dx).attr("cy", dy);
        this.focusText.attr("x", dx + _dims.leftPadding / 10).attr("y", dy - _dims.topPadding / 10).text(d.y.toFixed(2) + " " + this.options.y.units);
      }
      if (this.options.y2.variable !== null && !isNaN(dy2)) {
        this.focusCircle2.attr("cx", dx).attr("cy", dy2);
        this.focusText2.attr("x", dx + _dims.leftPadding / 10).attr("y", dy2 - _dims.topPadding / 10).text(d.y2.toFixed(2) + " " + this.options.y2.units);
      }
      if (this.options.y3.variable !== null && !isNaN(dy3)) {
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
      if (!this.initialized) {
        return;
      }
      this.crosshairs.select(".crosshair-x").style("display", null);
      this.crosshairs.select(".crosshair-x-under").style("display", null);
      if (this.options.y.variable !== null) {
        this.focusCircle.style("display", null).attr("fill", this.options.y.color);
        this.focusText.style("display", null).style("color", this.options.y.color).style("fill", this.options.y.color);
      }
      if (this.options.y2.variable !== null) {
        this.focusCircle2.style("display", null).attr("fill", this.options.y2.color);
        this.focusText2.style("display", null).style("color", this.options.y2.color).style("fill", this.options.y2.color);
      }
      if (this.options.y3.variable !== null) {
        this.focusCircle3.style("display", null).attr("fill", this.options.y3.color);
        return this.focusText3.style("display", null).style("color", this.options.y3.color).style("fill", this.options.y3.color);
      }
    };

    LinePlot.prototype.hideCrosshair = function() {
      if (!this.initialized) {
        return;
      }
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


/*
Northwest Avalanche Center (NWAC)
Plotting Tools - (plotter.js) - v0.9

Air Sciences Inc. - 2016
 */

(function() {
  var Handler;

  window.Plotting || (window.Plotting = {});

  window.Plotting.Handler = Handler = (function() {
    function Handler(access, options, plots) {
      var accessToken, defaults;
      this.preError = "Plotting.Handler";
      defaults = {
        templateId: null,
        href: location.href,
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
      if (this.options.href === "http://localhost:5000/") {
        this.options.href = "http://dev.nwac.us/";
      }
      this.endpoint = null;
      accessToken = {
        token: null,
        expires: null,
        expired: true,
        admin: false
      };
      access = Object.mergeDefaults(access, accessToken);
      this.api = new window.Plotting.API(access.token);
      this.syncronousapi = new window.Plotting.API(access.token, false);
      this.controls = new window.Plotting.Controls(this, access);
      this.parseDate = d3.timeParse(this.options.dateFormat);
      this.format = d3.utcFormat(this.options.dateFormat);
      this.getNow = function() {
        return this.format(this.now);
      };
      this.isAdmin = function() {
        return access.admin;
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
        if (plot.proto.initialized) {
          state = plot.proto.getState();
          if (state.request.data.min) {
            this.prependData(key);
          }
          if (state.request.data.max) {
            this.appendData(key);
          }
        }
      }
      return setTimeout(Plotting.Handler.prototype.listen.bind(this), this.options.refresh);
    };

    Handler.prototype.listenTest = function() {
      var key, plot, state;
      key = 0;
      plot = this.template[key];
      state = plot.proto.getState();
      if (state.request.data.min) {
        this.prependData(key);
      }
      if (state.request.data.max) {
        return this.appendData(key);
      }
    };

    Handler.prototype.listenTestLoop = function() {
      var key, plot, ref, results, state;
      ref = this.template;
      results = [];
      for (key in ref) {
        plot = ref[key];
        state = plot.proto.getState();
        if (state.request.data.min) {
          this.prependData(key);
        }
        if (state.request.data.max) {
          results.push(this.appendData(key));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Handler.prototype.getTemplate = function(template_uri) {
      var _, args, callback, preError, target;
      preError = this.preError + ".getTemplate(...)";
      target = this.options.href + "api/v5/plothandler/" + this.options.plotHandlerId;
      args = null;
      _ = this;
      callback = function(data) {
        var _parsed, error, error1;
        if (data.responseJSON === null || data.responseJSON.error) {
          console.log(preError + ".callback(...) error detected (data)", data);
          return;
        }
        try {
          _parsed = JSON.parse(data.responseJSON.template_data);
          _.template = _parsed.templateData;
        } catch (error1) {
          error = error1;
          console.log(preError + ".callback(...) JSON.parse error", error);
        }
        return _.parseDates(_.template);
      };
      return this.syncronousapi.get(target, args, callback);
    };

    Handler.prototype.parseDates = function(template) {
      var _, j, k, len, len1, parse, ref, results, row, sub;
      _ = this;
      parse = function(datetime) {
        var _offset, newDatetime;
        if (datetime.includes("now")) {
          newDatetime = new Date();
          if (datetime.includes("(")) {
            _offset = parseInt(datetime.replace("(", "").replace(")", "").replace("now", ""));
            newDatetime = new Date(newDatetime.getTime() + (_offset * 3600000));
          }
          datetime = this.format(newDatetime);
        }
        return datetime;
      };
      results = [];
      for (j = 0, len = template.length; j < len; j++) {
        row = template[j];
        ref = row.dataParams;
        for (k = 0, len1 = ref.length; k < len1; k++) {
          sub = ref[k];
          sub.max_datetime = parse(sub.max_datetime);
        }
        row.options.x.min = parse(row.options.x.min);
        results.push(row.options.x.max = parse(row.options.x.max));
      }
      return results;
    };

    Handler.prototype.putTemplate = function() {
      var _, args, callback, preError, target;
      if (this.isAdmin() === false) {
        return;
      }
      preError = this.preError + ".putTemplate()";
      target = this.options.href + "api/v5/plothandler/";
      args = {
        templateId: this.options.templateId,
        templateData: this.template
      };
      _ = this;
      callback = function(data) {
        if (data.responseJSON === null || data.responseJSON.error) {
          console.log(preError + ".callback(...) error detected (data)", data);
          return;
        }
        return console.log(preError + ".callback() success saving template.");
      };
      return this.api.put(target, args, callback);
    };

    Handler.prototype.getStationParamData = function(plotId, paramsKey) {
      var _, args, callback, preError, target;
      preError = this.preError + ".getStationParamData()";
      target = this.options.href + "api/v5/measurement";
      _ = this;
      args = this.template[plotId].dataParams[paramsKey];
      callback = function(data) {
        if (_.template[plotId].data === void 0) {
          return _.template[plotId].data = [data.responseJSON.results];
        } else {
          return _.template[plotId].data.push(data.responseJSON.results);
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
      }
      return results;
    };

    Handler.prototype.append = function() {
      var _, __data, _bounds, _len, i, instance, j, key, plot, preError, ref, ref1, target, title;
      preError = this.preError + ".append()";
      _ = this;
      ref = this.template;
      for (key in ref) {
        plot = ref[key];
        target = this.utarget(this.options.target);
        $(this.options.target).append("<div id='" + target + "'></div>");
        this.mergeTemplateOption(key);
        if (plot.options.y2 === void 0) {
          plot.options.y2 = {};
        }
        if (plot.options.y3 === void 0) {
          plot.options.y3 = {};
        }
        plot.options.plotId = key;
        plot.options.uuid = this.uuid();
        plot.options.target = "\#" + target;
        plot.options.y.color = this.getColor('light', key);
        plot.options.y2.color = this.getColor('light', parseInt(key + 4 % 7));
        plot.options.y3.color = this.getColor('light', parseInt(key + 6 % 7));
        _bounds = this.getVariableBounds(plot.options.y.variable);
        if (_bounds) {
          plot.options.y.min = _bounds.min;
          plot.options.y.max = _bounds.max;
        }
        if (plot.options.y.variable === 'temperature') {
          plot.options.y.maxBarValue = 32;
        }
        __data = new window.Plotting.Data(plot.data[0]);
        _len = plot.data.length - 1;
        if (_len > 0) {
          for (i = j = 1, ref1 = _len; 1 <= ref1 ? j <= ref1 : j >= ref1; i = 1 <= ref1 ? ++j : --j) {
            __data.join(plot.data[i], [plot.options.x.variable]);
          }
        }
        title = this.getTitle(plot);
        instance = new window.Plotting.LinePlot(this, __data.get(), plot.options);
        instance.preAppend();
        instance.append();
        this.template[key].proto = instance;
        this.appendControls(key);
      }
      if (this.isAdmin()) {
        $(this.options.target).append("<small><a style=\"cusor:pointer\" id=\"save-" + target + "\">Save Template</a></small>");
        return $("#save-" + target).on("click", function(event) {
          return _.putTemplate();
        });
      }
    };

    Handler.prototype.mergeTemplateOption = function(plotId) {
      var _params, plot;
      plot = this.template[plotId];
      plot.options.dataParams = plot.dataParams;
      _params = plot.options.dataParams.length;
      if (_params > 0) {
        plot.options.y.dataLoggerId = plot.options.dataParams[0].data_logger;
      }
      if (_params > 1) {
        plot.options.y2.dataLoggerId = plot.options.dataParams[1].data_logger;
      }
      if (_params > 2) {
        return plot.options.y2.dataLoggerId = plot.options.dataParams[2].data_logger;
      }
    };

    Handler.prototype.getAppendData = function(call, plotId, paramsKey) {
      var _, _length, args, callback, preError, target;
      preError = this.preError + ".getAppendData(key, dataParams)";
      target = this.options.href + "api/v5/measurement";
      _ = this;
      args = this.template[plotId].proto.options.dataParams[paramsKey];
      _length = this.template[plotId].proto.options.dataParams.length;
      callback = function(data) {
        var plot;
        plot = _.template[plotId];
        if (plot.__data === void 0) {
          plot.__data = [];
        }
        if (plot.__data[call] === void 0) {
          plot.__data[call] = new window.Plotting.Data(data.responseJSON.results);
        } else {
          plot.__data[call].join(data.responseJSON.results, [plot.proto.options.x.variable]);
        }
        if (plot.__data[call].getSourceCount() === _length) {
          if (plot.proto.initialized) {
            plot.proto.appendData(plot.__data[call].get());
            plot.proto.update();
          } else {
            plot.proto.setData(plot.__data[call].get());
            plot.proto.append();
          }
          return delete plot.__data[call];
        }
      };
      return this.api.get(target, args, callback);
    };

    Handler.prototype.prependData = function(plotId) {
      var call, params, paramsKey, plot, preError, ref, results, state;
      preError = this.preError + ".prependData()";
      plot = this.template[plotId];
      state = plot.proto.getState();
      call = this.uuid();
      ref = plot.proto.options.dataParams;
      results = [];
      for (paramsKey in ref) {
        params = ref[paramsKey];
        plot.proto.options.dataParams[paramsKey].max_datetime = this.format(state.range.data.min);
        plot.proto.options.dataParams[paramsKey].limit = this.options.updateLength;
        results.push(this.getAppendData(call, plotId, paramsKey));
      }
      return results;
    };

    Handler.prototype.appendData = function(plotId) {
      var _max_datetime, _new_max_datetime, _now, call, params, paramsKey, plot, preError, ref, results, state;
      preError = this.preError + ".appendData()";
      plot = this.template[plotId];
      state = plot.proto.getState();
      _now = new Date();
      if (state.range.data.max >= _now) {
        return;
      }
      _max_datetime = state.range.data.max.getTime();
      _new_max_datetime = _max_datetime + (this.options.updateLength * 3600000);
      call = this.uuid();
      ref = plot.proto.options.dataParams;
      results = [];
      for (paramsKey in ref) {
        params = ref[paramsKey];
        plot.proto.options.dataParams[paramsKey].max_datetime = this.format(new Date(_new_max_datetime));
        plot.proto.options.dataParams[paramsKey].limit = this.options.updateLength;
        results.push(this.getAppendData(call, plotId, paramsKey));
      }
      return results;
    };

    Handler.prototype.addVariable = function(plotId, variable) {
      var _max_datetime, params, paramsKey, ref, results, state, uuid;
      state = this.template[plotId].proto.getState();
      _max_datetime = state.range.data.max.getTime();
      this.setNewOptions(plotId, variable);
      uuid = this.uuid();
      ref = this.template[plotId].proto.options.dataParams;
      results = [];
      for (paramsKey in ref) {
        params = ref[paramsKey];
        this.template[plotId].proto.options.dataParams[paramsKey].max_datetime = this.format(new Date(_max_datetime));
        this.template[plotId].proto.options.dataParams[paramsKey].limit = state.length.data;
        results.push(this.getAppendData(uuid, plotId, paramsKey));
      }
      return results;
    };

    Handler.prototype.addStation = function(plotId, dataLoggerId) {
      var _len, _max_datetime, _params, _variable, params, paramsKey, ref, state, uuid;
      if (!this.template[plotId].proto.initialized) {
        return this.appendNew(plotId, dataLoggerId);
      }
      if (this.template[plotId].proto.options.y.dataLoggerId && this.template[plotId].proto.options.y2.dataLoggerId && this.template[plotId].proto.options.y3.dataLoggerId) {
        console.log("Maximum of 3 Plot selected.");
        return null;
      }
      state = this.template[plotId].proto.getState();
      _variable = this.template[plotId].proto.options.y.variable;
      _max_datetime = state.range.data.max.getTime();
      _params = $.extend(true, {}, this.template[plotId].proto.options.dataParams[0]);
      _params.data_logger = dataLoggerId;
      _len = this.template[plotId].proto.options.dataParams.push(_params);
      this.setNewOptions(plotId, _variable, dataLoggerId);
      uuid = this.uuid();
      ref = this.template[plotId].proto.options.dataParams;
      for (paramsKey in ref) {
        params = ref[paramsKey];
        this.template[plotId].proto.options.dataParams[paramsKey].max_datetime = this.format(new Date(_max_datetime));
        this.template[plotId].proto.options.dataParams[paramsKey].limit = state.length.data;
        this.getAppendData(uuid, plotId, paramsKey);
      }
      this.controls.updateStationDropdown(plotId);
      return this.controls.updateStationMap(plotId);
    };

    Handler.prototype.removeStation = function(plotId, dataLoggerId) {
      var _key, _paramKey, _plot, _template;
      _key = null;
      _template = this.template[plotId];
      _plot = this.template[plotId].proto;
      _paramKey = this.indexOfValue(_template.dataParams, "data_logger", dataLoggerId);
      if (_plot.options.y.dataLoggerId === dataLoggerId) {
        _key = "y";
      } else if (_plot.options.y2.dataLoggerId === dataLoggerId) {
        _key = "y2";
      } else if (_plot.options.y3.dataLoggerId === dataLoggerId) {
        _key = "y3";
      }
      if (_paramKey > -1) {
        _template.dataParams.splice(_paramKey, 1);
        _plot.options[_key] = null;
        _plot.appendData();
        if (_key === "y") {
          _plot.options.y = Object.mergeDefaults(_plot.options.y, _plot.defaults.y);
        }
        if (_key === "y2") {
          _plot.options.y2 = Object.mergeDefaults(_plot.options.y2, _plot.defaults.y2);
        }
        if (_key === "y3") {
          _plot.options.y3 = Object.mergeDefaults(_plot.options.y3, _plot.defaults.y3);
        }
        _plot.getDefinition();
        _plot.removeData(_key);
        _plot.update();
      }
      this.controls.updateStationDropdown(plotId);
      return this.controls.updateStationMap(plotId);
    };

    Handler.prototype.zoom = function(transform) {
      var j, len, plot, ref, results;
      ref = this.template;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        plot = ref[j];
        results.push(plot.proto.setZoomTransform(transform));
      }
      return results;
    };

    Handler.prototype.crosshair = function(transform, mouse) {
      var j, len, plot, ref, results;
      ref = this.template;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        plot = ref[j];
        results.push(plot.proto.setCrosshair(transform, mouse));
      }
      return results;
    };

    Handler.prototype.showCrosshairs = function() {
      var j, len, plot, ref, results;
      ref = this.template;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        plot = ref[j];
        results.push(plot.proto.showCrosshair());
      }
      return results;
    };

    Handler.prototype.hideCrosshairs = function() {
      var j, len, plot, ref, results;
      ref = this.template;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        plot = ref[j];
        results.push(plot.proto.hideCrosshair());
      }
      return results;
    };

    Handler.prototype.appendControls = function(plotId) {
      var _li_style, current, html, selector;
      selector = "plot-controls-" + plotId;
      _li_style = "";
      html = "<ul id=\"" + selector + "\" class=\"unstyled\" style=\"list-style-type: none; padding-left: 6px;\"> </ul>";
      $(this.template[plotId].proto.options.target).find(".line-plot-controls").append(html);
      this.controls.move(plotId, '#' + selector, 'up');
      this.controls["new"]('#' + selector, 'down');
      this.controls.remove(plotId, '#' + selector);
      this.controls.move(plotId, '#' + selector, 'down');
      if (this.template[plotId].type === "station") {
        current = [this.template[plotId].proto.options.y, this.template[plotId].proto.options.y2, this.template[plotId].proto.options.y3];
        return this.controls.appendParameterDropdown(plotId, '#' + selector, this.template[plotId].proto.options.y.dataloggerid, current);
      } else if (this.template[plotId].type === "parameter") {
        current = [this.template[plotId].proto.options.y, this.template[plotId].proto.options.y2, this.template[plotId].proto.options.y3];
        return this.controls.appendStationDropdown(plotId, '#' + selector, this.template[plotId].proto.options.y.variable, current);
      }
    };

    Handler.prototype.remove = function(plotId) {
      $(this.template[plotId].proto.options.target).fadeOut(500, function() {
        return $(this).remove();
      });
      return this.template[plotId] = null;
    };

    Handler.prototype.move = function(plotId, direction) {
      var _pageOrder, _tradeKey, selected;
      _pageOrder = this.template[plotId].pageOrder;
      selected = $(this.template[plotId].proto.options.target);
      if (direction === 'up') {
        if (_pageOrder > 1) {
          _tradeKey = this.indexOfValue(this.template, "pageOrder", _pageOrder - 1);
          this.template[plotId].pageOrder--;
          this.template[_tradeKey].pageOrder++;
          return selected.prev().insertAfter(selected);
        }
      } else if (direction === 'down') {
        if (_pageOrder < this.template.length) {
          _tradeKey = this.indexOfValue(this.template, "pageOrder", _pageOrder + 1);
          this.template[plotId].pageOrder++;
          this.template[_tradeKey].pageOrder--;
          return selected.next().insertBefore(selected);
        }
      }
    };

    Handler.prototype.add = function(type) {
      var _key, _options, _plot, _target, html, instance;
      if (this.template[this.template.length - 1].proto.initialized === false) {
        return;
      }
      _target = this.utarget(this.options.target);
      _plot = {
        plotOrder: this.template.length,
        type: type
      };
      _options = {
        target: '#' + _target,
        type: type,
        x: {
          variable: "datetime"
        }
      };
      html = "<div id=\"" + _target + "\"></div>";
      $(this.options.target).append(html);
      _key = this.template.push(_plot) - 1;
      instance = new window.Plotting.LinePlot(this, [], _options);
      instance.preAppend();
      this.template[_key].proto = instance;
      this.template[_key].proto.options.plotId = _key;
      if (this.template[_key].proto.initialized) {
        return this.appendControls(_key);
      }
    };

    Handler.prototype.initVariable = function(plotId, variable, title) {
      this.template[plotId].dataParams = [this.template[plotId - 1].dataParams[0]];
      this.template[plotId].dataParams[0].data_logger = null;
      this.template[plotId].proto.options.y.variable = variable;
      this.template[plotId].proto.options.y.title = title;
      this.appendControls(plotId);
      return this.template[plotId].proto.removeTemp();
    };

    Handler.prototype.appendNew = function(plotId, dataLoggerId) {
      var _plot;
      _plot = this.template[plotId];
      _plot.dataParams[0].data_logger = dataLoggerId;
      _plot.proto.options.dataParams = _plot.dataParams;
      _plot.proto.options.y.dataloggerid = dataLoggerId;
      return this.getAppendData(this.uuid(), plotId, 0);
    };

    Handler.prototype.setNewOptions = function(plotId, variable, dataLoggerId) {
      var _bounds, _info;
      _bounds = this.getVariableBounds(variable);
      _info = this.getVariableInfo(variable);
      if (this.template[plotId].proto.options.y.variable === null) {
        this.template[plotId].proto.options.y = {
          dataLoggerId: dataLoggerId,
          variable: variable,
          color: this.getColor('light', parseInt(plotId))
        };
        if (_info) {
          this.template[plotId].proto.options.y.title = _info.title;
          this.template[plotId].proto.options.y.units = _info.units;
        }
        if (_bounds) {
          this.template[plotId].proto.options.y.min = _bounds.min;
          return this.template[plotId].proto.options.y.max = _bounds.max;
        }
      } else if (this.template[plotId].proto.options.y2.variable === null) {
        this.template[plotId].proto.options.y2 = {
          dataLoggerId: dataLoggerId,
          variable: variable,
          color: this.getColor('light', parseInt(plotId) + 4 % 7)
        };
        if (_info) {
          this.template[plotId].proto.options.y2.title = _info.title;
          this.template[plotId].proto.options.y2.units = _info.units;
        }
        if (_bounds) {
          this.template[plotId].proto.options.y2.min = _bounds.min;
          return this.template[plotId].proto.options.y2.max = _bounds.max;
        }
      } else if (this.template[plotId].proto.options.y3.variable === null) {
        this.template[plotId].proto.options.y3 = {
          dataLoggerId: dataLoggerId,
          variable: variable,
          color: this.getColor('light', parseInt(plotId) + 6 % 7)
        };
        if (_info) {
          this.template[plotId].proto.options.y2.title = _info.title;
          this.template[plotId].proto.options.y2.units = _info.units;
        }
        if (_bounds) {
          this.template[plotId].proto.options.y3.min = _bounds.min;
          return this.template[plotId].proto.options.y3.max = _bounds.max;
        }
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

    Handler.prototype.indexOfValue = function(array, key, value) {
      var i, index, j, ref;
      index = -1;
      for (i = j = 0, ref = array.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (array[i][key] === value) {
          index = i;
        }
      }
      return index;
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
