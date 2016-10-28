

window.Plotting ||= {}

window.Plotting.Dropdown = class Dropdown
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
    
    @api = new window.Plotting.API access.token

  appendStationDropdown: (plotId, appendTarget, parameter) ->
    # Append Station Dropdown.
    target = "http://localhost:5000/stations/#{parameter}"
    _ = @
    args = {}
    
    callback = (data) ->
      html = "<i class=\"icon-list\" style=\"cursor: pointer\"
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
        </ul>"
    
      $(appendTarget).append(html)
      
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
      html = "<i class=\"icon-list\" style=\"cursor: pointer\"
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
        </ul>"
          
      $(appendTarget).append(html)
        
    @api.get(target, args, callback)

  toggle: (selector) ->
    # Toggle the plotId's station down.
    $(selector).toggle()
