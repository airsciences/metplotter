

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

  appendStationDropdown: (plotId, appendTarget, parameter) ->
    # Append Station Dropdown.
    target = "http://localhost:5000/stations/#{parameter}"
    _ = @
    args = {}
    
    callback = (data) ->
      html = "<li><i class=\"icon-list\" style=\"cursor: pointer\"
          onclick=\"plotter.dropdown.toggle('\#station-dropdown-#{plotId}')\">
          </i>
        <ul id=\"station-dropdown-#{plotId}\"
          class=\"list-group\" style=\"display: none;
          position: absolute;
          box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);\">"
     
      for region in data.responseJSON
        html = "#{html}
            <li class=\"list-group-item subheader\"
              style=\"cursor:pointer;
                background-color: rgb(235, 235, 235);
              border-top: 1px solid rgb(190, 190, 190);
              padding: 3px 10px;\">#{region.region}</li>
            <ul class=\"list-group-item sublist\"
              style=\"display: none; padding: 1px\">"
        for station in region.stations
          html = "#{html}
            <li class=\"list-group-item station\"
              style=\"cursor:pointer;padding: 1px 5px; list-style-type: none\">
              #{station.name}</li>"
        
        html = "#{html}
          </ul>"
      
      html = "#{html}
        </ul>
        </li>"
    
      $(appendTarget).prepend(html)
      
      # Subheader Click Event.
      $(".subheader").click((event) ->
        next = $(this).next()
        if next.is(":visible")
          next.slideUp()
        else
          next.slideDown()
      )
      
      # Station Click Event.
      $(".station").click((event) ->
        if $(this).hasClass("selected")
          $(this).removeClass("selected")
            .css("background-color", "")
          if (
            $(this).siblings().filter(":not(.selected)").length is
            $(this).siblings().length
          )
            $(this).parent()
              .prev()
              .css("background-color","rgb(235,235,235)")
        else
          $(this).addClass("selected")
            .css("background-color", plotter.options.colors.light[7])
            .parent()
            .prev()
            .css("background-color","rgb(210,210,210)")

        event.stopPropagation()
     )
    
    @api.get(target, args, callback)

  appendParameterDropdown: (plotId, appendTarget, dataLoggerId) ->
    # Append Parameter Dropdown.
    target = "http://localhost:5000/parameters/#{dataLoggerId}"
    args = {}
 
    callback = (data) ->
      html = "<li><i class=\"icon-list\" style=\"cursor: pointer\"
          onclick=\"plotter.dropdown.toggle('\#param-dropdown-#{plotId}')\">
          </i>
        <ul id=\"param-dropdown-#{plotId}\"
          class=\"list-group\" style=\"display: none;
          position: absolute;
          box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);\">"
           
      for parameter in data.responseJSON
        html = "#{html}
            <li class=\"list-group-item subheader\"
              style=\"cursor:pointer;
                background-color: rgb(235, 235, 235);
              border-top: 1px solid rgb(190, 190, 190);
              padding: 3px 10px;\">#{parameter.title}</li>"
      
      html = "#{html}
          </ul>
        </li>"
          
      $(appendTarget).prepend(html)
        
    @api.get(target, args, callback)

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
