

window.Plotting ||= {}

window.Plotting.Controls = class Controls
  constructor: (access, options) ->
    @preError = "Plotting.Dropdown"
    
    defaults =
      target: null
    @options = Object.mergeDefaults options, defaults

    accessToken =
      token: null
      expires: null
      expired: true
    access = Object.mergeDefaults access, accessToken
    
    @maps = []
    @api = new window.Plotting.API access.token

  appendStationDropdown: (plotId, appendTarget, parameter, current) ->
    # Append Station Dropdown.
    target = "http://localhost:5000/stations/#{parameter}"
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
     
      for region in data.responseJSON
        a_color = ""
        r_color = ""
        _region_selected = 0
        for _station in region.stations
          _row_current = _.isCurrent(current, 'dataLoggerId',
            _station.dataloggerid)
          if _row_current
            _region_selected++
        if _region_selected > 0
          r_color = "style=\"background-color: rgb(248,248,248)\""
          a_color = "style=\"font-weight: 700\""
        html = "#{html}
            <li class=\"subheader\" #{r_color}>
              <a #{a_color} href=\"#\"><i class=\"icon-caret-down\"
                style=\"margin-right: 6px\"></i>
               #{region.region}</a>
            </li>
            <ul class=\"list-group-item sublist\"
              style=\"display: none;\">"
        for station in region.stations
          _row_current = _.isCurrent(current, 'dataLoggerId',
            station.dataloggerid)
          color = ""
          if _row_current
            console.log("Row Current", _row_current)
            color = "style=\"color: #{_row_current.color}\""
          id = "data-logger-#{station.dataloggerid}-plot-#{plotId}"
          _prepend = "<i id=\"#{id}\" class=\"icon-circle\"
            #{color}></i>"
          html = "#{html}
            <li class=\"list-group-item station\"
              style=\"cursor: pointer; padding: 1px 5px;
              list-style-type: none\">#{_prepend}
               #{station.name}</li>"
        
        html = "#{html}
          </ul>"
      
      html = "#{html}
        </ul>
        </li>"
    
      $(appendTarget).prepend(html)
      
      $('#'+uuid).dropdown()
      
      # Subheader Click Event.
      $(".subheader").unbind().on('click', (event) ->
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
      
      # Station Click Event.
      $(".station").unbind().on('click', (event) ->
        if $(this).hasClass("selected")
          $(this).removeClass("selected")
          if (
            $(this).siblings().filter(":not(.selected)").length is
            $(this).siblings().length
          )
            $(this).parent()
              .prev()
              .css("background-color","rgb(235,235,235)")
        else
          $(this).addClass("selected")
            .parent()
            .prev()
            .css("background-color","rgb(210,210,210)")

        event.stopPropagation()
      )
    
    @api.get(target, args, callback)

  appendParameterDropdown: (plotId, appendTarget, dataLoggerId, current) ->
    # Append Parameter Dropdown.
    target = "http://localhost:5000/parameters/#{dataLoggerId}"
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
           
      for parameter in data.responseJSON
        if parameter.parameter instanceof Array
          _add = parameter.parameter[0]
          _id = _add.replace("_", "-")
          id = "#{_id}-plot-#{plotId}"
          if current.variable in parameter.parameter
            _prepend = "<i id=\"#{id}\" class=\"parameter-#{parameter.parameter}
              icon-circle\"
              style=\"color: #{current.color}\"></i>"
        else
          _add = parameter.parameter
          _id = _add.replace("_", "-")
          id = "#{_id}-plot-#{plotId}"
          if current.variable == parameter.parameter
            _prepend = "<i id=\"#{id}\" class=\"icon-circle\"
              style=\"color: #{current.color}\"></i>"
          else
            _prepend = "<i id=\"#{id}\" class=\"icon-circle\" style=\"\"></i>"
    
        html = "#{html}
            <li><a style=\"cursor: pointer\"
              onclick=\"plotter.addVariable(#{plotId},
              '#{_add}')\">#{_prepend}
             #{parameter.title}</a></li>"
      
      html = "#{html}
            </ul>
          </li>
        </div>"
          
      $(appendTarget).prepend(html)
      
      $('#'+uuid).dropdown()
        
    @api.get(target, args, callback)

  updateParameterDropdown: (plotId) ->
    _options = plotter.template[plotId].proto.options
    if _options.y.variable != null
      _id = _options.y.variable.replace('_', '-')
      id = "#{_id}-plot-#{plotId}"
      console.log("Update-Dropdown y", id)
      $(_options.target).find("\##{id}")
        .css("color", _options.line1Color)
    if _options.y2.variable != null
      _id = _options.y2.variable.replace('_', '-')
      id = "#{_id}-plot-#{plotId}"
      console.log("Update-Dropdown y2", id)
      $(_options.target).find("\##{id}")
        .css("color", _options.line2Color)
  
  appendStationMap: (plotId, appendTarget, parameter) ->
    # Append a google maps popover.
    _ = @
    uuid = @uuid()
    dom_uuid = "map-control-" + uuid
    html = "<li>
          <i class=\"icon-map-marker\" style=\"cursor: pointer\"
          onclick=\"plotter.controls.toggleMap('#{uuid}')\"></i>
        </li>
        <div class=\"popover\">
          <div class=\"arrow\"></div>
          <div class=\"popover-content\">
            <div id=\"#{dom_uuid}\" style=\"width: 512px;
              height: 512px;\"></div>
          </div>
        </div>"
    $(appendTarget).prepend(html)
    
    @maps[uuid] = new google.maps.Map(document.getElementById(dom_uuid), {
      center: new google.maps.LatLng(47.6062, -122.3321),
      zoom: 6,
      mapTypeId: 'terrain',
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    })
    
    console.log("Controls.maps (@maps)", @maps)

  toggleMap: (mapUuid) ->
    # toggle the map div.
    $("\#map-control-#{mapUuid}").parent().parent().toggle()
    google.maps.event.trigger(plotter.controls.maps[mapUuid], 'resize')
    
  toggle: (selector) ->
    # Toggle the plotId's station down.
    $(selector).toggle()

  move: (plotId, direction) ->
    # Return the Move Control.
    html = "<i style=\"cursor: pointer;\" class=\"icon-arrow-#{direction}\"
      onclick=\"plotter.move(#{plotId}, '#{direction}')\"></i>"
    
  remove: (plotId) ->
    html = "<i style=\"cursor: pointer;\" class=\"icon-remove\"
      onclick=\"plotter.remove(#{plotId})\"></i>"

  new: () ->
    html = "<i style=\"cursor: pointer;\" class=\"icon-plus\"
      onclick=\"plotter.add()\"></i>"

  uuid: ->
    return (((1+Math.random())*0x100000000)|0).toString(16).substring(1)
    
  isCurrent: (current, key, value) ->
    for cKey, cValue of current
      if cValue[key] == value
        return cValue
    return false
