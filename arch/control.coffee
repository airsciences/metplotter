#
#   Northwest Avalanche Center (NWAC)
#   Plotter Tools - Plot Controls (control.coffee)
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotter ||= {}

window.Plotter.Controls = class Controls
  constructor: (plotter, access, options) ->
    @preError = "Plotter.Dropdown"
    @plotter = plotter

    defaults =
      target: null
    @options = Object.mergeDefaults options, defaults

    accessToken =
      token: null
      expires: null
      expired: true
    access = Object.mergeDefaults access, accessToken

    @maps = []
    @markers = []
    @api = new window.Plotter.API access.token

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
          html = "#{html}
            <li class=\"station\"
              style=\"padding: 1px 5px; cursor: pointer;
              list-style-type: none\" onclick=\"plotter.addStation(#{plotId},
                #{station.id})\">
               #{_prepend} #{station.datalogger_name}</li>"

        html = "#{html}
          </ul>"

      html = "#{html}
        </ul>
        </li>"

      $(appendTarget).prepend(html)

      # Bind Dropdown & Submenu Click Event.
      $('#'+uuid).dropdown()
      _.bindSubMenuEvent(".subheader")

      _.appendStationMap(plotId, appendTarget, data.responseJSON.results,
        current)

    @api.get(target, args, callback)

  updateStationDropdown: (plotId) ->
    _options = @plotter.template[plotId].proto.options
    _append = ""
    if _options.y.dataLoggerId != null
      _id = _options.y.dataLoggerId
      _append = " <i class=\"icon-circle\"
        style=\"color: #{_options.y.color}\"></i>"
      id = "data-logger-#{_id}-plot-#{plotId}"
      $(_options.target).find("\##{id}")
        .css("color", _options.y.color)
        .attr("onclic", "removeStation(#{plotId}, #{_options.y.dataLoggerId})")
        .parent().parent().prev()
        .css("background-color", "rgb(248,248,248)")
        .children(":first").children(".station-dots")
        .empty()
        .append(_append)
    if _options.y2.variable != null
      _id = _options.y2.dataLoggerId
      _append = " <i class=\"icon-circle\"
        style=\"color: #{_options.y2.color}\"></i>"
      id = "data-logger-#{_id}-plot-#{plotId}"
      $(_options.target).find("\##{id}")
        .css("color", _options.y2.color)
        .attr("onclic", "removeStation(#{plotId}, #{_options.y2.dataLoggerId})")
        .parent().parent().prev()
        .css("background-color", "rgb(248,248,248)")
        .children(":first")
        .append(_append)
    if _options.y3.variable != null
      _id = _options.y3.dataLoggerId
      _append = " <i class=\"icon-circle\"
        style=\"color: #{_options.y3.color}\"></i>"
      id = "data-logger-#{_id}-plot-#{plotId}"
      $(_options.target).find("\##{id}")
        .css("color", _options.y3.color)
        .attr("onclic", "removeStation(#{plotId}, #{_options.y3.dataLoggerId})")
        .parent().parent().prev()
        .css("background-color", "rgb(248,248,248)")
        .children(":first")
        .append(_append)

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
      console.log("Update-Dropdown y", id)
      $(_options.target).find("\##{id}")
        .css("color", _options.y.color)
    if _options.y2.variable != null
      _id = _options.y2.variable.replace('_', '-')
      id = "#{_id}-plot-#{plotId}"
      console.log("Update-Dropdown y2", id)
      $(_options.target).find("\##{id}")
        .css("color", _options.y2.color)
    if _options.y3.variable != null
      _id = _options.y3.variable.replace('_', '-')
      id = "#{_id}-plot-#{plotId}"
      console.log("Update-Dropdown y3", id)
      $(_options.target).find("\##{id}")
        .css("color", _options.y3.color)

  appendStationMap: (plotId, appendTarget, results, current) ->
    # Append a google maps popover.
    _ = @
    uuid = @uuid()
    dom_uuid = "map-control-" + uuid
    html = "<li data-toggle=\"popover\" data-placement=\"left\">
          <i class=\"icon-map-marker\" style=\"cursor: pointer\"
          onclick=\"plotter.controls.toggleMap('#{uuid}')\"></i>
        </li>
        <div class=\"popover\" style=\"max-width: 356px;\">
          <div class=\"arrow\"></div>
          <div class=\"popover-content\">
            <div id=\"#{dom_uuid}\" style=\"width: 312px;
              height: 312px;\"></div>
          </div>
        </div>"
    $(appendTarget).prepend(html)

    @markers[uuid] = []
    @maps[uuid] = new google.maps.Map(document.getElementById(dom_uuid), {
      center: new google.maps.LatLng(46.980, -121.980),
      zoom: 6,
      mapTypeId: 'terrain',
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    })

    infowindow = new google.maps.InfoWindow({
      content: ""
    })

    _bounds = new google.maps.LatLngBounds()
    _bound_points = []

    for region in results
      for station in region.dataloggers
        # Append Marker
        color = "rgb(200,200,200)"
        scale = 5
        opacity = 0.5
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
          infowindow.open(_.maps[uuid], this)
        )

        marker.addListener('mouseout', ->
          infowindow.close()
        )

        marker.addListener('click', ->
          _.plotter.addStation(plotId, @dataLoggerId)
        )

        _len = @markers[uuid].push(marker)
        @markers[uuid][_len-1].setMap(@maps[uuid])

    # Fit to Bounds
    for _point in _bound_points
      _bounds.extend(_point)

    @maps[uuid].fitBounds(_bounds)
    @maps[uuid].setZoom(12)

  toggleMap: (mapUuid) ->
    # toggle the map div.
    _offset = $("\#map-control-#{mapUuid}").parent().parent().prev().offset()
    $("\#map-control-#{mapUuid}").parent().parent().toggle()
      .css("left", _offset.left - 356)
      .css("top", _offset.top)
    _center = @plotter.controls.maps[mapUuid].getCenter()
    _zoom = @plotter.controls.maps[mapUuid].getZoom()
    google.maps.event.trigger(@plotter.controls.maps[mapUuid], 'resize')
    @plotter.controls.maps[mapUuid].setCenter(_center)
    @plotter.controls.maps[mapUuid].setZoom(_zoom)

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

    html = "<div class=\"dropdown\">
        <li><a id=\"new-#{uuid}\" class=\"new-dropdown dropdown-toggle\"
          role=\"button\" data-toggle=\"dropdown\" href=\"#\">
          <i class=\"icon-plus\"></i></a>
        <ul id=\"new-#{uuid}-dropdown\"
          class=\"dropdown-menu dropdown-menu-right\" role=\"menu\"
          aria-labelledby=\"new-#{uuid}\">
          <li><a id=\"new-#{uuid}-parameter\"
            style=\"cursor: pointer\">Add Parameter Plot</a></li>
          <li><a id=\"new-#{uuid}-station\"
            style=\"cursor: pointer\">Add Station Plot</a></li>
        </ul>
        </li>
        </div>"

    # Append & Bind Dropdown
    $(appendTarget).append(html)
    $("#new-#{uuid}").dropdown()

    # Bind Click Events
    $("#new-#{uuid}-parameter").on('click', ->
      _.plotter.add("parameter")
    )
    $("#new-#{uuid}-station").on('click', ->
      _.plotter.add("station")
    )

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

  selectInitParameter: () ->
    html = "<ul>

      </ul>"


  selectInitStation: () ->
    html = ""
