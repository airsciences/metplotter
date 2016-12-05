#
#   Northwest Avalanche Center (NWAC)
#   Plotting Tools - Plot Controls (control.coffee)
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotting ||= {}

window.Plotting.Controls = class Controls
  constructor: (plotter, token, options) ->
    @preError = "Plotting.Dropdown"

    # Methods
    @plotter = plotter
    @api = new window.Plotting.API token

    defaults =
      target: null
    @options = Object.mergeDefaults options, defaults

    # State Objects
    @current = []
    @stations = []

    # Reference Container Objects
    @maps = []
    @markers = {}
    @listeners = {}


  setCurrent: (plotId) ->
    # Simplify essential control from the currently displayed plot data sets.
    @current[plotId] = []
    for key in ["y", "y2", "y3"]
      _row = @plotter.template[plotId].proto.options[key]
      if _row.dataLoggerId != null
        args =
          dataLoggerId: parseInt(_row.dataLoggerId)
          yTarget: key
          color: _row.color
        @current[plotId].push(args)

  getCurrent: (plotId) ->
    # Return the full, or plot specific essential control data
    if plotId >= 0
      return @current[plotId]
    return @current

  updateStationStates: (plotId) ->
    # set displayed state.
    @setCurrent(plotId)

    if @stations[plotId].length > 0
      for region in @stations[plotId]
        region.displayed = []
        for station in region.dataloggers
          station.displayed = false
          station.color = ""
          _index = @plotter.indexOfValue(
            @current[plotId], "dataLoggerId", station.id)
          if _index > -1
            _color = @current[plotId][_index].color
            station.displayed = true
            station.color = _color
            dot_append =
              dataLoggerId: station.id
              color: _color
            region.displayed.push(dot_append)

  appendStationDropdown: (plotId, appendTarget, parameter, current) ->
    # Append Station Dropdown.
    target = "#{location.protocol}//dev.nwac.us/api/v5/dataloggerregion?\
      sensor_name=#{parameter}"
    _ = @
    args = {}
    uuid = @uuid()

    @setCurrent(plotId)

    callback = (data) ->
      _.stations[plotId] = data.responseJSON.results

      html = "<div class=\"dropdown\">
        <li><a id=\"#{uuid}\" class=\"station-dropdown dropdown-toggle\"
            role=\"button\"
            data-toggle=\"dropdown\" href=\"#\">
          <i class=\"icon-list\"></i></a>
        <ul id=\"station-dropdown-#{plotId}\"
          class=\"dropdown-menu pull-right\">"

      for region in _.stations[plotId]
        _region_name = _.__lcname(region.name)
        html = "#{html}
            <li class=\"subheader\">
              <a data-region=\"#{_region_name}\" data-plot-id=\"#{plotId}\"
              href=\"\">
                <i class=\"icon-caret-down\" style=\"margin-right: 6px\"></i>
                <span class=\"region-name\">#{region.name}</span>
                <span class=\"region-dots\"></span>
              </a>
            </li>
            <ul class=\"list-group-item sublist\"
              style=\"display: none;\">"

        for station in region.dataloggers
          html = "#{html}
            <li class=\"station\" data-station-id=\"#{station.id}\"
            data-plot-id=\"#{plotId}\" style=\"padding: 1px 5px; cursor:
            pointer; list-style-type: none\">
              <i class=\"icon-circle\"></i>
              <span class=\"station-name\">
                #{station.datalogger_name} | #{station.elevation} ft
              </span>
            </li>"

        html = "#{html}
          </ul>"

      html = "#{html}
        </ul>
        </li>"

      # Append the Object
      $(appendTarget).prepend(html)
      $('#'+uuid).dropdown()
      _.bindSubMenuEvent(".subheader")

      # Update Dropdown Highlighting & Events.
      _.updateStationDropdown(plotId)

      # Append the Station Map (Move)
      _.appendStationMap(plotId, appendTarget, data.responseJSON.results,
        current)

    @api.get(target, args, callback)

  updateStationDropdown: (plotId) ->
    _ = @

    # Update the Dropdown State Array
    @updateStationStates(plotId)

    # Private Dot HTML Function
    __buildDots = (displayed) ->
      # Build the Region Dot HTML
      html = ""
      for station in displayed
        html = "#{html}
          <i style=\"color: #{station.color};\" class=\"icon-circle\"></i>"
      return html

    # Private Station Click Event Function
    __bindStationClicks = (plotId, plotter, station) ->
      if station.displayed
        $("[data-station-id=\"#{station.id}\"][data-plot-id=\"#{plotId}\"]")
          .off("click").on("click", (event) ->
            event.stopPropagation()
            _plotId = $(this).attr("data-plot-id")
            $(this).append("<i class=\"icon-spinner icon-spin\"
            data-plot-id=\"#{_plotId}\"></i>")
            plotter.removeStation(_plotId,
              $(this).attr("data-station-id"))
          )
      else
        $("[data-station-id=\"#{station.id}\"][data-plot-id=\"#{plotId}\"]")
          .off("click").on("click", (event) ->
            event.stopPropagation()
            _plotId = $(this).attr("data-plot-id")
            $(this).append("<i class=\"icon-spinner icon-spin\"
            data-plot-id=\"#{_plotId}\"></i>")
            plotter.addStation(_plotId,
              $(this).attr("data-station-id"))
          )

    # Set the appropriate styling and onclick events for a plot's dropdown.
    for region in @stations[plotId]
      # Clear the Dots
      _data_region = @__lcname(region.name)
      _dots_html = ""
      _font_weight = ""
      _background_color = ""
      if region.displayed.length > 0
        # Update the Parent Header Weight.
        _background_color = "rgb(248, 248, 248)"
        _font_weight = 700
        _dots_html = __buildDots(region.displayed)
      for station in region.dataloggers
        # Add Station Color States
        $("[data-station-id=\"#{station.id}\"][data-plot-id=\"#{plotId}\"]\
        > i.icon-circle")
          .css("color", station.color)
        __bindStationClicks(plotId, _.plotter, station)

      $("[data-region=\"#{_data_region}\"][data-plot-id=\"#{plotId}\"]")
        .css("background-color", _background_color)
        .css("font-weight", _font_weight)

      $("[data-region=\"#{_data_region}\"][data-plot-id=\"#{plotId}\"] \
      > span.region-dots")
        .html(_dots_html)

  removeSpinner: (plotId) ->
    # Remove all spinners associated with that plot
    $("i.icon-spinner[data-plot-id=\"#{plotId}\"]").remove()

  appendParameterDropdown: (plotId, appendTarget, dataLoggerId, current) ->
    # Append Parameter Dropdown.
    target = "#{location.protocol}//dev.nwac.us/api/v5/\
      sensortype?sensors__data_logger=#{dataLoggerId}"
    args = {}
    uuid = @uuid()

    _current = []

    callback = (data) ->
      html = "<div class=\"dropdown\">
        <li><a id=\"#{uuid}\"
          class=\"parameter-dropdown dropdown-toggle\" role=\"button\"
          data-toggle=\"dropdown\" href=\"#\">
          <i class=\"icon-list\"></i></a>
        <ul id=\"param-dropdown-#{plotId}\"
          class=\"dropdown-menu pull-right\" role=\"menu\"
          aria-labelledby=\"#{uuid}\">"

      for parameter in data.responseJSON.results
        if (
          parameter.field_name is "wind_speed_minimum" or
          parameter.field_name is "wind_speed_maximum"
        )
          # No Action
        else if parameter.field_name is "wind_speed_average"
          _add = parameter.field_name
          _id = _add.replace("_", "-")
          id = "#{_id}-plot-#{plotId}"
          if current.variable in parameter.field_name
            _prepend = "<i id=\"#{id}\" class=\"parameter-#{parameter.parameter}
              icon-circle\"
              style=\"color: #{current.color}\"></i>"
        else
          _add = parameter.field_name
          _id = _add.replace("_", "-")
          id = "#{_id}-plot-#{plotId}"
          if current.variable == parameter.field_name
            _prepend = "<i id=\"#{id}\" class=\"icon-circle\"
              style=\"color: #{current.color}\"></i>"
          else
            _prepend = "<i id=\"#{id}\" class=\"icon-circle\" style=\"\"></i>"

        html = "#{html}
            <li><a style=\"cursor: pointer\"
              onclick=\"plotter.addVariable(#{plotId},
              '#{_add}')\">#{_prepend}
             #{parameter.sensortype_name}</a></li>"

      html = "#{html}
            </ul>
          </li>
        </div>"

      $(appendTarget).prepend(html)

      $('#'+uuid).dropdown()

    @api.get(target, args, callback)

  updateParameterDropdown: (plotId) ->
    _options = @plotter.template[plotId].proto.options
    if _options.y.variable != null
      _id = _options.y.variable.replace('_', '-')
      id = "#{_id}-plot-#{plotId}"
      $(_options.target).find("\##{id}")
        .css("color", _options.y.color)
    if _options.y2.variable != null
      _id = _options.y2.variable.replace('_', '-')
      id = "#{_id}-plot-#{plotId}"
      $(_options.target).find("\##{id}")
        .css("color", _options.y2.color)
    if _options.y3.variable != null
      _id = _options.y3.variable.replace('_', '-')
      id = "#{_id}-plot-#{plotId}"
      $(_options.target).find("\##{id}")
        .css("color", _options.y3.color)

  appendStationMap: (plotId, appendTarget, results, current) ->
    # Append a google maps popover.
    _ = @
    uuid = @uuid()
    dom_uuid = "map-control-" + plotId
    html = "<li data-toggle=\"popover\" data-placement=\"left\">
          <i id=\"map-#{plotId}\" class=\"icon-map-marker\"
          style=\"cursor: pointer\"></i>
        </li>
        <div class=\"popover\" style=\"max-width: 356px;\">
          <div class=\"arrow\"></div>
          <div class=\"popover-content\">
            <div id=\"#{dom_uuid}\" style=\"width: 312px;
              height: 312px;\"></div>
          </div>
        </div>"
    $(appendTarget).prepend(html)
    $("#map-#{plotId}").on('click', ->
      _.plotter.controls.toggleMap(plotId)
    )

    @maps[plotId] = new google.maps.Map(document.getElementById(dom_uuid), {
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
    })

    infowindow = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true
    })

    @markers[plotId] = []
    @listeners[plotId] = []

    _bounds = new google.maps.LatLngBounds()
    _bound_points = []

    for region in results
      for station in region.dataloggers
        # Append Marker
        color = "rgb(200,200,200)"
        scale = 5
        opacity = 0.5
        _row_id = "map-plot-#{plotId}-station-#{station.id}"
        _row_current = _.isCurrent(current, 'dataLoggerId', station.id)

        if _row_current
          color = _row_current.color
          scale = 7
          opacity = 0.8
          _bound_points.push(new google.maps.LatLng(station.lat, station.lon))

        marker = new google.maps.Marker({
          position: {
            lat: station.lat,
            lng: station.lon
          },
          id: _row_id,
          tooltip: "#{station.datalogger_name} - #{station.elevation} ft",
          dataLoggerId: station.id,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: scale,
            strokeWeight: 2,
            fillOpacity: opacity,
            fillColor: color
          },
          selected: false
        })
        marker.addListener('mouseover', ->
          infowindow.setContent(@tooltip)
          infowindow.open(_.maps[plotId], this)
        )

        marker.addListener('mouseout', ->
          infowindow.close()
        )

        @listeners[plotId][_row_id] = marker.addListener('click', ->
          _.plotter.addStation(plotId, @dataLoggerId)
        )

        _len = @markers[plotId][_row_id] = marker
        @markers[plotId][_row_id].setMap(@maps[plotId])

    # Fit to Bounds
    for _point in _bound_points
      _bounds.extend(_point)

    @maps[plotId].fitBounds(_bounds)
    #@maps[plotId].setZoom(12)

  resetStationMap: (plotId) ->
    # Reset the Station Map
    _= @

    for _key, _marker of @markers[plotId]
      _marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeWeight: 2,
        fillOpacity: 0.5,
        fillColor: "rgb(200,200,200)"
      })
      _marker.set("selected", false)

      _.listeners[plotId][_key].remove()
      _.listeners[plotId][_key] = _marker.addListener('click', ->
        _dataLoggerId = this.get("dataLoggerId")
        _.plotter.addStation(plotId, _dataLoggerId)
      )

  updateStationMap: (plotId) ->
    # Update the station map markers.
    _ = @

    @resetStationMap(plotId)

    updateMarker = (plotId, rowId, color) ->
      _.markers[plotId][rowId].setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        strokeWeight: 2,
        fillOpacity: 0.8,
        fillColor: color
      })
      _.markers[plotId][rowId].set("selected", true)

      _.listeners[plotId][rowId].remove()
      _.listeners[plotId][rowId] = _.markers[plotId][rowId].addListener(
        'click', ->
          _dataLoggerId = this.get("dataLoggerId")
          _.plotter.removeStation(plotId, _dataLoggerId)
      )

    _options = @plotter.template[plotId].proto.options
    if _options.y.variable != null
      _id = _options.y.variable.replace('_', '-')
      _row_id = "map-plot-#{plotId}-station-#{_options.y.dataLoggerId}"
      _color = _options.y.color
      updateMarker(plotId, _row_id, _color)
    if _options.y2.variable != null
      _id = _options.y2.variable.replace('_', '-')
      _row_id = "map-plot-#{plotId}-station-#{_options.y2.dataLoggerId}"
      _color = _options.y2.color
      updateMarker(plotId, _row_id, _color)
    if _options.y3.variable != null
      _id = _options.y3.variable.replace('_', '-')
      _row_id = "map-plot-#{plotId}-station-#{_options.y3.dataLoggerId}"
      _color = _options.y3.color
      updateMarker(plotId, _row_id, _color)

    @boundOnSelected(plotId)

  boundOnSelected: (plotId) ->
    # Reset the Station Map
    _ = @
    _bounds = new google.maps.LatLngBounds()
    _bound_points = []

    for _key, _marker of @markers[plotId]
      _selected = _marker.get("selected")
      if _selected is true
        _bound_points.push(_marker.getPosition())

    # Fit to Bounds
    for _point in _bound_points
      _bounds.extend(_point)

    @maps[plotId].fitBounds(_bounds)
    if @maps[plotId].getZoom() < 6
      @maps[plotId].setZoom(6)

  toggleMap: (plotId) ->
    # toggle the map div.
    __nwac_offset_left = 128
    __nwac_offset_top = 256

    __nwac_offset_left = 0
    __nwac_offset_top = 0

    _center = @plotter.controls.maps[plotId].getCenter()
    _zoom = @plotter.controls.maps[plotId].getZoom()

    _offset = $("#map-control-#{plotId}").parent().parent().prev().offset()
    $("#map-control-#{plotId}").parent().parent().toggle()
      .css("left", _offset.left - 356 - __nwac_offset_left)
      .css("top", _offset.top - __nwac_offset_top)

    google.maps.event.trigger(@plotter.controls.maps[plotId], 'resize')
    @plotter.controls.maps[plotId].setCenter(_center)
    @plotter.controls.maps[plotId].setZoom(_zoom)

  toggle: (selector) ->
    # Toggle the plotId's station down.
    $(selector).toggle()

  move: (plotId, appendTarget, direction) ->
    _ = @
    html = "<i id=\"move-#{plotId}-#{direction}\" style=\"cursor: pointer;\"
      class=\"icon-arrow-#{direction}\"></i>"
    $(appendTarget).append(html)
    $("#move-#{plotId}-#{direction}").on('click', ->
      _.plotter.move(plotId, direction)
    )

  remove: (plotId, appendTarget) ->
    _ = @
    html = "<i id=\"remove-#{plotId}\" style=\"cursor: pointer;\"
      class=\"icon-remove\"></i>"
    $(appendTarget).append(html)
    $("#remove-#{plotId}").on('click', ->
      _.plotter.remove(plotId)
    )

  new: (appendTarget) ->
    _ = @
    uuid = @uuid()

    _ul = "<ul id=\"new-#{uuid}-dropdown\"
        class=\"dropdown-menu pull-right\" role=\"menu\"
        aria-labelledby=\"new-#{uuid}\">
        <li><a id=\"new-#{uuid}-parameter\"
          style=\"cursor: pointer\">Add Parameter Plot</a></li>
        <li><a id=\"new-#{uuid}-station\"
          style=\"cursor: pointer\">Add Station Plot</a></li>
      </ul>"

    html = "<div class=\"dropdown\">
        <li><a id=\"new-#{uuid}\" role=\"button\" href=\"#\">
            <i class=\"icon-plus\"></i>
          </a></li>
        </div>"

    # Append & Bind Dropdown
    $(appendTarget).append(html)
    #$("#new-#{uuid}").dropdown()

    # Bind Click Events
    $("#new-#{uuid}").on('click', ->
      _.plotter.add("parameter")
    )
    # $("#new-#{uuid}-station").on('click', ->
    #   _.plotter.add("station")
    # )

  __lcname: (name) ->
    # Return a lower case string with underscores
    return name.replace(" ", "_").toLowerCase()

  uuid: ->
    return (((1+Math.random())*0x100000000)|0).toString(16).substring(1)

  isCurrent: (current, key, value) ->
    for cKey, cValue of current
      if cValue[key] == value
        return cValue
    return false

  bindSubMenuEvent: (target) ->
    # Bind the sub-menu dropdown click event.
    $(target).unbind().on('click', (event) ->
      event.preventDefault()
      event.stopPropagation()
      next = $(this).next()

      if next.is(":visible")
        $(this).find("i").removeClass("icon-caret-up")
          .addClass("icon-caret-down")
        next.slideUp()
      else
        $(this).find("i").removeClass("icon-caret-down")
          .addClass("icon-caret-up")
        next.slideDown()
    )
