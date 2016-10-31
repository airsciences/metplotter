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
      refresh: 500
      updateLength: 256
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
    @controls = new window.Plotting.Controls
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
    @listenViewport()

  listen: ->
    # Listen to Plot States & Update Data & Visible if Needed
    for key, plot of @template
      state = plot.proto.getState()
      # Min-Side Events
      if state.request.data.min
        @prependData(key)
      # Max-Side Events
      if state.request.data.max
        @appendData(key)

    #setTimeout(Plotting.Handler.prototype.listen.bind(@), @options.refresh)

  listenViewport: ->
    # Listen to Plot States & Update Data & Visible if Needed
    for key, plot of @template
      state = plot.proto.getState()
      # Min-Side Events
      if state.request.visible.min
        # console.log("Listen[#{key}]: Request Visible Min Update")
        plot.proto.setVisibleData()
      # Max-Side Events
      if state.request.visible.max
        # console.log("Listen[#{key}]: Request Visible Max Update")
        plot.proto.setVisibleData()

    setTimeout(Plotting.Handler.prototype.listenViewport.bind(@),
      @options.refreshViewport)
  
  getTemplate: (template_uri) ->
    # Request the Template
    preError = "#{@preError}.getTemplate(...)"
    target = "template/#{@options.plotHandlerId}"
    args = null
    _ = @
    
    callback = (data) ->
      if data.responseJSON == null || data.responseJSON.error
        console.log "#{preError}.callback(...) error detected (data)", data
        return
      _.template = data.responseJSON.templateData
    
    @syncronousapi.get target, args, callback

  getStationParamData: (plotId, key) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getStationParamData()"
    target = "#{location.protocol}//dev.nwac.us/api/v5/measurement"
    _ = @
    _is_array = @template[plotId].dataParams instanceof Array
    if _is_array
      args = @template[plotId].dataParams[key]
    else
      args = @template[plotId].dataParams

    callback = (data) ->
      if _is_array
        if parseInt(key) == 0
          _.template[plotId].data = []
        _.template[plotId].data[key] = data.responseJSON
      else
        _.template[plotId].data = data.responseJSON
    
    @syncronousapi.get target, args, callback
    
  getTemplatePlotData: ->
    preError = "#{@preError}.getPlotData()"
    for key, plot of @template
      if @template[key].dataParams instanceof Array
        for subKey, params of @template[key].dataParams
          @getStationParamData key, subKey
      else
        @getStationParamData key
  
  getParameterDropdown: () ->
    # Get a dropdown for each plot
    preError = "#{@preError}.getStationParamData()"
    target = "template/#{plotHandlerId}"
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
      plot.type = "station"
      #plot.type = "parameter"
      plot.options.plotId = key
      plot.options.uuid = @uuid()
      plot.options.target = "\##{target}"
      plot.options.dataParams = plot.dataParams
      plot.options.line1Color = @getColor('dark', key)
      plot.options.line1Color = @getColor('light', key)
      
      if plot.options.y.variable == 'temperature'
        plot.options.y.maxBarValue = 32
      
      if plot.data instanceof Array
        plot.options.merge = true
        data =
          data: []
        for dKey, row of plot.data
          data.data[dKey] = row.results
        plot.data = [null, null]
      else
        data =
          data: plot.data.results
        plot.data = null
      
      title = @getTitle(plot)
      console.log "#{preError} (plot, data)", plot, data
      instance = new window.Plotting.LinePlot data, plot.options
      instance.append()
      #instance.appendTitle(title.title, title.subtitle)
      @template[key].proto = instance
      @appendControls(key)

  mergeTemplateOption: () ->
    # Merge the templated plot options with returned options

  getPrependData: (plotId, dataParams, key) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getPrependData(key, dataParams)"
    target = "http://dev.nwac.us/api/v5/measurement"
    _ = @
    _is_array = dataParams instanceof Array
    args = dataParams
    
    if _is_array
      console.log("#{preError} (_is_array, args)", _is_array, args)
      append = ->
        console.log("Appending data set (_.template[plotId].data)",
          _.template[plotId].data)
        _.template[plotId].proto.appendMergeData(_.template[plotId].data)
        _.template[plotId].proto.setVisibleData()
        _.template[plotId].data = [null, null]
      
      callback1 = (data) ->
        console.log("Callback1 (data)", data)
        _.template[plotId].data[0] = data.responseJSON.results
        if (_.template[plotId].data[0] != null and
            _.template[plotId].data[1] != null)
          append()
    
      callback2 = (data) ->
        console.log("Callback2 (data)", data)
        _.template[plotId].data[1] = data.responseJSON.results
        if (_.template[plotId].data[0] != null and
            _.template[plotId].data[1] != null)
          append()
    
      @api.get(target, args[0], callback1)
      @api.get(target, args[1], callback2)
    else
      callback = (data) ->
        _.template[plotId].proto.appendData(data.responseJSON.results)
        _.template[plotId].proto.setVisibleData()
    
      @api.get(target, args, callback)
      
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
    
    if plot.proto.options.dataParams instanceof Array
      dataParams = []
      for pKey, params of plot.proto.options.dataParams
        dataParams[pKey] = params
        dataParams[pKey].max_datetime = @format(state.range.data.min)
        dataParams[pKey].limit = @options.updateLength
    else
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
    
    if plot.proto.options.dataParams instanceof Array
      dataParams = []
      for pKey, params of plot.proto.options.dataParams
        dataParams[pKey] = plot.proto.options.dataParams[pKey]
        dataParams[pKey].max_datetime = @format(new Date(_new_max_datetime))
        dataParams[pKey].limit = @options.updateLength
    else
      dataParams = plot.proto.options.dataParams
      dataParams.max_datetime = @format(new Date(_new_max_datetime))
      dataParams.limit = @options.updateLength
    
    @getPrependData(key, dataParams)

  addVariable: (plotId, variable) ->
    _bounds = @template[plotId].proto
    if @template[plotId].proto.options.y is undefined
      @template[plotId].proto.options.y =
        variable: variable
    else if  @template[plotId].proto.options.y2 is undefined
      @template[plotId].proto.options.y2 =
        variable: variable
    
    # @getStationParamData(plotId)
    # @template[plotId].proto.append()
    
    console.log("addVariable().. (proto, variable, dataParams)",
      @template[plotId].proto,
      variable, @template[plotId].proto.options.dataParams)
      
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

  appendControls: (plotId) ->
    # Append the Control Set to the Plot
    selector = "plot-controls-#{plotId}"
    _li_style = ""
    _new_control = @controls.new()
    _remove_control = @controls.remove(plotId)
    _up_control = @controls.move(plotId, 'up')
    _down_control = @controls.move(plotId, 'down')
    
    html = "<ul id=\"#{selector}\" class=\"unstyled\"
        style=\"list-style-type: none; padding-left: 6px;\">
        <li>#{_up_control}</li>
        <li>#{_remove_control}</li>
        <li>#{_new_control}</li>
        <li>#{_down_control}</i></li>
      </ul>"
    
    $(@template[plotId].proto.options.target)
      .find(".line-plot-controls").append(html)
    
    if @template[plotId].type is "station"
      current = @template[plotId].proto.options.y
      current.color = @template[plotId].proto.options.line1Color
      @controls.appendParameterDropdown(plotId, '#'+selector, 1, current)
    else if @template[plotId].type is "parameter"
      @controls.appendStationMap(plotId, '#'+selector, 1)
      @controls.appendStationDropdown(plotId, '#'+selector, 1)
    
  remove: (plotId) ->
    # Remove a plotId
    $(@template[plotId].proto.options.target).fadeOut(500, ->
      $(this).remove())
    @template[plotId] = null

  move: (plotId, direction) ->
    # Move the plotId.
    selected = $(@template[plotId].proto.options.target)
    if direction is 'up'
      selected.prev().insertAfter(selected)
    else if direction is 'down'
      selected.next().insertBefore(selected)
    
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

  uuid: ->
    return (((1+Math.random())*0x100000000)|0).toString(16).substring(1)
    
  utarget: (prepend) ->
    prepend = prepend.replace '#', ''
    return "#{prepend}-#{@uuid()}"
    
