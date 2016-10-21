#
#   NWAC Plotting & Authentication handler.
#

window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (access, options, plots) ->
    @preError = "Plotting.Handler"
    
    defaults =
      target: null
      dateFormat: "%Y-%m-%dT%H:%M:%SZ"
      refresh: 1000
      updateLength: 1024
      colors:
        light: [
          "rgb(53, 152, 219)",
          "rgb(241, 196, 14)",
          "rgb(155, 88, 181)",
          "rgb(27, 188, 155)",
          "rgb(52, 73, 94)",
          "rgb(231, 126, 35)",
          "rgb(45, 204, 112)",
          "rgb(232, 76, 61)",
          "rgb(149, 165, 165)"
        ]
        dark: [
          "rgb(45, 62, 80)",
          "rgb(210, 84, 0)",
          "rgb(39, 174, 97)",
          "rgb(192, 57, 43)",
          "rgb(126, 140, 141)",
          "rgb(42, 128, 185)",
          "rgb(239, 154, 15)",
          "rgb(143, 68, 173)",
          "rgb(23, 160, 134)"
        ]
    @options = Object.mergeDefaults options, defaults
    @now = new Date()
    
    @endpoint = null
    accessToken =
      token: null
      expires: null
      expired: true
    access = Object.mergeDefaults access, accessToken
      
    @api = new window.Plotting.API access.token
    @syncronousapi = new window.Plotting.API access.token, false
    @parseDate = d3.timeParse(@options.dateFormat)

    @format = d3.utcFormat(@options.dateFormat)

    @getNow = ->
      return @format(@now)

    @hasAccess = ->
      # Calculate if the token has expired.
      if @parseDate(access.expires) > new Date
        access.expired = true
      if access.expired then false else true
    
  initialize: ->
    # Initialize the page.
    @getTemplate()
    @getTemplatePlotData()
    @append()
    @listen()

  listen: ->
    # Listen to Plot States & Update Data & Visible if Needed
    for key, plot of @template
      state = plot.proto.getState()
      # Min-Side Events
      if state.request.data.min
        @prependData(key)
      if state.request.visible.min
        plot.proto.setVisibleData()
      # Max-Side Events
      if state.request.data.max
        @appendData(key)
      if state.request.visible.max
        plot.proto.setVisibleData()

    setTimeout(Plotting.Handler.prototype.listen.bind(@), @options.refresh)

  getTemplate: (template_uri) ->
    # Request the Template
    preError = "#{@preError}.getTemplate(...)"
    target = "template/1"
    args = null
    _ = @
    
    callback = (data) ->
      if data.responseJSON == null || data.responseJSON.error
        console.log "#{preError}.callback(...) error detected (data)", data
        return
      _.template = data.responseJSON.templateData
    
    @syncronousapi.get target, args, callback

  getStationParamData: (plotId) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getStationParamData()"
    target = "dev.nwac.us/api/v5/measurement"
    _ = @
    args = @template[plotId].dataParams

    callback = (data) ->
      _.template[plotId].data = data.responseJSON
    
    @syncronousapi.get target, args, callback
    
  getTemplatePlotData: ->
    preError = "#{@preError}.getPlotData()"
    for key, plot of @template
      @getStationParamData key
  
  getParameterDropdown: () ->
    # Get a dropdown for each plot
    preError = "#{@preError}.getStationParamData()"
    target = "template/1"
    _ = @
    args = @template[plotId].dataParams
  
  getStationDropdown: () ->
    # Get a dropdown for each plot
    preError = ""
  
  append: () ->
    # Master append plots.
    preError = "#{@preError}.append()"
    
    for key, plot of @template
      target = @utarget(@options.target)
      $(@options.target).append("<div id='#{target}'></div>")
      plot.options.uuid = @uuid()
      plot.options.target = "\##{target}"
      plot.options.dataParams = plot.dataParams
      plot.options.line1Color = @getColor('dark', key)
      plot.options.line1Color = @getColor('light', key)
      data =
        data: plot.data.results
      plot.data = null
      title = @getTitle(plot)
      console.log "#{preError} (plot, data)", plot, data
      instance = new window.Plotting.LinePlot data, plot.options
      instance.append()
      #instance.appendTitle(title.title, title.subtitle)
      @template[key].proto = instance

  mergeTemplateOption: () ->
    # Merge the templated plot options with returned options

  getPrependData: (plotId, dataParams) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getPrependData(key, dataParams)"
    target = "http://dev.nwac.us/api/v5/measurement"
    _ = @
    args = dataParams

    callback = (data) ->
      _.template[plotId].proto.appendData(data.responseJSON.results)
      _.template[plotId].proto.setVisibleData()
    
    @api.get target, args, callback

  getAppendData: (plotId, dataParams) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getAppendData(key, dataParams)"
    target = "http://dev.nwac.us/api/v5/measurement"
    _ = @
    args = dataParams

    callback = (data) ->
      _.template[plotId].proto.appendData(data.responseJSON.results)
      _.template[plotId].proto.setVisibleData()
        
    @api.get target, args, callback

  prependData: (key) ->
    # Move forward a certain offset of time records on all plots.
    preError = "#{@preError}.prependData()"
    
    plot = @template[key]
    state = plot.proto.getState()
    dataParams = plot.proto.options.dataParams
    dataParams.max_datetime = @format(state.range.data.min)
    dataParams.limit = @options.updateLength

    @getPrependData(key, dataParams)
    
  appendData: (key) ->
    # Move forward a certain offset of time records on all plots.
    preError = "#{@preError}.appendData()"
    _now = new Date()
    
    # Get the Current Plot & Plot State
    plot = @template[key]
    state = plot.proto.getState()
    
    if state.range.data.max >= _now
      return
    
    _max_datetime = state.range.data.max.getTime()
    _new_max_datetime = _max_datetime + (@options.updateLength * 3600000)
    
    dataParams = plot.proto.options.dataParams
    dataParams.max_datetime = @format(new Date(_new_max_datetime))
    dataParams.limit = @options.updateLength
    
    @getPrependData(key, dataParams)
      
  zoom: (transform) ->
    # Set the zoom state of all plots. Triggered by a single plot.
    for plot in @template
      plot.proto.setZoomTransform(transform)
    
  crosshair: (transform, mouse) ->
    # Set the cursor hover position of all plots. Triggered by a single plot."
    for plot in @template
      plot.proto.setCrosshair(transform, mouse)

  showCrosshairs: ->
    # Show all Crosshair Command
    for plot in @template
      plot.proto.showCrosshair()

  hideCrosshairs: ->
    # Hide cursor crosshairs.
    for plot in @template
      plot.proto.hideCrosshair()

  appendDropdown: (target, type, data) ->
    # Constuct and append the button dropdown list.
    head = ""
    list = ""
    foot = ""
    
    switch type
      when 'station'
        head = "<button class=\"btn btn-xs btn-default dropdown-toggle\"
            type=\"button\" id=\"dropdownMenu3\" data-toggle=\"dropdown\"
            aria-haspopup=\"true\" aria-expanded=\"false\">
            <span>Stations </span>
            <span class=\"caret\"></span>
          </button>
          <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu3\">"
        for station in data.stations
          list = "#{list}
            <li><a onclick=\"#{parameter.onclick}\">
              <i style=\"color: #{parameter.color}\"
              class=\"icon-circle\"></i> #{station.station}
            </a></li>"
        foot = "</ul>"
      when 'parameter'
        head = "<button class=\"btn btn-xs btn-default dropdown-toggle\"
            type=\"button\" id=\"dropdownMenu3\" data-toggle=\"dropdown\"
            aria-haspopup=\"true\" aria-expanded=\"false\">
            <span>Stations </span>
            <span class=\"caret\"></span>
          </button>
          <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu3\">"
        for parameter in data.parameters
          list = "#{list}
            <li><a onclick=\"#{parameter.onclick}\">
              <i style=\"color: #{parameter.color}\"
              class=\"icon-circle\"></i> #{parameter.title}
            </a></li>"
        foot = "</ul>"
    
    result = "#{head}
        #{list}
        #{foot}"
    
    $(target).append(result)
    
  getColor: (shade, key) ->
    # Return the Color from the ordered list.
    return @options.colors[shade][key]

  getTitle: (plot) ->
    # Get the title.
    result = {}
    if plot.type == 'station'
      result.title = plot.station.station
      #result.subtitle = "#{plot.options.y.title}"
      #if plot.options.y2
      #  result.subtitle = "#{plot.options.y.title} & #{plot.options.y2.title}"
      result.subtitle = ""
    else if plot.type == 'parameter'
      result.title = plot.options.y.title
      result.subtitle = ""
    return result

  getAggregateMethod: (param, start, end) ->
    # Returns the appropriate aggregate method for a give parameter and zoom.
    aggregate = 'hourly'
    interval = new Date end - new Date start
    
    switch param
      when 'temp'
        arregate = 'daily'
      when 'precip'
        aggregate = 'daily'
 
  uuid: (length) ->
    return (((1+Math.random())*0x100000000)|0).toString(16).substring(1)
    
  utarget: (prepend) ->
    prepend = prepend.replace '#', ''
    return "#{prepend}-#{@uuid()}"
    
