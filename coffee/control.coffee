#
#   Northwest Avalanche Center (NWAC)
#   Plotting Tools - Plot Controls (control.coffee)
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotting ||= {}

window.Plotting.Controls = class Controls
  constructor: (plotter, access, options) ->
    @preError = "Plotting.Dropdown"
    @plotter = plotter
    
    defaults =
      target: null
    @options = Object.mergeDefaults options, defaults

    accessToken =
      token: null
      expires: null
      expired: true
    access = Object.mergeDefaults access, accessToken
    
    # Settings
    
    @maps = []
    @markers = {}
    @listeners = {}
    @api = new window.Plotting.API access.token

  appendStationDropdown: (plotId, appendTarget, parameter, current) ->
    # Append Station Dropdown.
    target = "#{location.protocol}//dev.nwac.us/api/v5/dataloggerregion?\
      sensor_name=#{parameter}"
    _ = @
    args = {}
    uuid = @uuid()
    
    callback = (data) ->
      html = "<div class=\"dropdown\">
        <li><a id=\"#{uuid}\" class=\"station-dropdown dropdown-toggle\"
            role=\"button\"
            data-toggle=\"dropdown\" href=\"#\">
          <i class=\"icon-list\"></i></a>
        <ul id=\"station-dropdown-#{plotId}\"
          class=\"dropdown-menu dropdown-menu-right\">"
     
      for region in data.responseJSON.results
        a_color = ""
        r_color = ""
        _dots = "<span class=\"station-dots\">"
        _region_selected = 0
        for _station in region.dataloggers
          _row_current = _.isCurrent(current, 'dataLoggerId', _station.id)
          if _row_current
            _region_selected++
            _dots = "#{_dots} <i class=\"icon-circle\"
              style=\"color: #{_row_current.color}\"></i>"
        if _region_selected > 0
          r_color = "style=\"background-color: rgb(248,248,248)\""
          a_color = "style=\"font-weight: 700\""
        html = "#{html}
            <li class=\"subheader\" #{r_color}>
              <a #{a_color} href=\"#\"><i class=\"icon-caret-down\"
                style=\"margin-right: 6px\"></i>
               #{region.name} #{_dots}</span></a>
            </li>
            <ul class=\"list-group-item sublist\"
              style=\"display: none;\">"
        for station in region.dataloggers
          _row_current = _.isCurrent(current, 'dataLoggerId', station.id)
          color = ""
          if _row_current
            color = "style=\"color: #{_row_current.color}\""
          id = "data-logger-#{station.id}-plot-#{plotId}"
          _prepend = "<i id=\"#{id}\" class=\"icon-circle\"
            #{color}></i>"
          _id = "add-station-#{plotId}-#{station.id}"
          html = "#{html}
            <li class=\"station\" id=\"#{_id}\"
              data-station-id=\"#{station.id}\" data-plot-id=\"#{plotId}\"
              style=\"padding: 1px 5px; cursor: pointer;
              list-style-type: none\" onclick=\"\">
               #{_prepend} #{station.datalogger_name} |
               #{station.elevation} ft</li>"
        
        html = "#{html}
          </ul>"
      
      html = "#{html}
        </ul>
        </li>"
    
      $(appendTarget).prepend(html)
      
      # Bind Onclick Events
      for region in data.responseJSON.results
        for station in region.dataloggers
          _id = "add-station-#{plotId}-#{station.id}"
          $("#"+_id).on("click", (event) ->
            event.stopPropagation()
            _plotId = $(this).attr("data-plot-id")
            _stationId = $(this).attr("data-station-id")
            _.plotter.addStation(_plotId, _stationId)
          )
      
      # Bind Dropdown & Submenu Click Event.
      $('#'+uuid).dropdown()
      _.bindSubMenuEvent(".subheader")
      
      _.appendStationMap(plotId, appendTarget, data.responseJSON.results,
        current)
    
    @api.get(target, args, callback)

  updateStationDropdown: (plotId) ->
    _ = @
    _options = @plotter.template[plotId].proto.options
    _append = ""
    
    if _options.y.dataLoggerId != null
      _id = _options.y.dataLoggerId
      _append = " <i class=\"icon-circle\"
        style=\"color: #{_options.y.color}\"></i>"
      id = "data-logger-#{_id}-plot-#{plotId}"
      $(_options.target).find("##{id}")
        .css("color", _options.y.color)
        .parent().parent().prev()
        .css("background-color", "rgb(248,248,248)")
        .css("font-weight", 700)
        .children(":first").children(".station-dots")
        .empty()
        .append(_append)
      $("#add-station-#{plotId}-#{_id}").off('click').on("click", (event) ->
        event.stopPropagation()
        console.log("this", $(this))
        _plotId = $(this).attr("data-plot-id")
        _stationId = $(this).attr("data-station-id")
        _.plotter.removeStation(_plotId, _stationId)
      )
    if _options.y2.variable != null
      _id = _options.y2.dataLoggerId
      _append = " <i class=\"icon-circle\"
        style=\"color: #{_options.y2.color}\"></i>"
      id = "data-logger-#{_id}-plot-#{plotId}"
      $(_options.target).find("\##{id}")
        .css("color", _options.y2.color)
        .parent().parent().prev()
        .css("background-color", "rgb(248,248,248)")
        .css("font-weight", 700)
        .children(":first")
        .append(_append)
      $("#add-station-#{plotId}-#{_id}").off('click').on("click", (event) ->
        event.stopPropagation()
        _plotId = $(this).attr("data-plot-id")
        _stationId = $(this).attr("data-station-id")
        _.plotter.removeStation(_plotId, _stationId)
      )
    if _options.y3.variable != null
      _id = _options.y3.dataLoggerId
      _append = " <i class=\"icon-circle\"
        style=\"color: #{_options.y3.color}\"></i>"
      id = "data-logger-#{_id}-plot-#{plotId}"
      $(_options.target).find("\##{id}")
        .css("color", _options.y3.color)
        .parent().parent().prev()
        .css("background-color", "rgb(248,248,248)")
        .css("font-weight", 700)
        .children(":first")
        .append(_append)
      $("#add-station-#{plotId}-#{_id}").off('click').on("click", (event) ->
        event.stopPropagation()
        _plotId = $(this).attr("data-plot-id")
        _stationId = $(this).attr("data-station-id")
        _.plotter.removeStation(_plotId, _stationId)
      )

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
          class=\"dropdown-menu dropdown-menu-right\" role=\"menu\"
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
          dataloggerid: station.id,
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
        
        @listeners[_row_id] = marker.addListener('click', ->
          console.log("Marker clicked", this)
          _.plotter.addStation(plotId, @dataloggerid)
        )
        
        _len = @markers[_row_id] = marker
        @markers[_row_id].setMap(@maps[plotId])
    
    # Fit to Bounds
    for _point in _bound_points
      _bounds.extend(_point)
    
    @maps[plotId].fitBounds(_bounds)
    @maps[plotId].setZoom(12)

  resetStationMap: (plotId) ->
    # Reset the Station Map
    _= @
    
    for _key, _marker of @markers
      _dataLoggerId = _marker.get("dataloggerid")
      _marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeWeight: 2,
        fillOpacity: 0.5,
        fillColor: "rgb(200,200,200)"
      })
      _marker.set("selected", false)
      
      _.listeners[_key].remove()
      _marker.addListener('click', ->
        _.plotter.addStation(plotId, _dataLoggerId)
      )

  updateStationMap: (plotId) ->
    # Update the station map markers.
    _ = @
    
    @resetStationMap(plotId)
    
    updateMarker = (plotId, dataLoggerId, rowId, color) ->
      _.markers[rowId].setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        strokeWeight: 2,
        fillOpacity: 0.8,
        fillColor: color
      })
      _.markers[rowId].set("selected", true)
      
      _.listeners[rowId].remove()
      _.markers[rowId].addListener('click', ->
        _.plotter.removeStation(plotId, dataLoggerId)
      )
        
    _options = @plotter.template[plotId].proto.options
    if _options.y.variable != null
      _id = _options.y.variable.replace('_', '-')
      _row_id = "map-plot-#{plotId}-station-#{_options.y.dataLoggerId}"
      _data_logger_id = _options.y.dataLoggerId
      _color = _options.y.color
      updateMarker(plotId, _data_logger_id, _row_id, _color)
    if _options.y2.variable != null
      _id = _options.y2.variable.replace('_', '-')
      _row_id = "map-plot-#{plotId}-station-#{_options.y2.dataLoggerId}"
      _data_logger_id = _options.y2.dataLoggerId
      _color = _options.y2.color
      updateMarker(plotId, _data_logger_id, _row_id, _color)
    if _options.y3.variable != null
      _id = _options.y3.variable.replace('_', '-')
      _row_id = "map-plot-#{plotId}-station-#{_options.y3.dataLoggerId}"
      _data_logger_id = _options.y3.dataLoggerId
      _color = _options.y3.color
      updateMarker(plotId, _data_logger_id, _row_id, _color)
    
    console.log("Updating markers row (marker, color)",
      @markers[_row_id], _color)

  toggleMap: (plotId) ->
    # toggle the map div.
    _center = @plotter.controls.maps[plotId].getCenter()
    _zoom = @plotter.controls.maps[plotId].getZoom()
    
    _offset = $("#map-control-#{plotId}").parent().parent().prev().offset()
    $("#map-control-#{plotId}").parent().parent().toggle()
      .css("left", _offset.left - 356)
      .css("top", _offset.top)
    
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
        class=\"dropdown-menu dropdown-menu-right\" role=\"menu\"
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
    
