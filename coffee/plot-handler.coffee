###
Northwest Avalanche Center (NWAC)
Plotting Tools - (plotter.js) - v0.9

Air Sciences Inc. - 2016
###

#
#   Northwest Avalanche Center (NWAC)
#   Plotting Tools - Plot Template & API Manager (plot-handler.coffee)
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (access, options, plots) ->
    @preError = "Plotting.Handler"
    
    defaults =
      target: null
      dateFormat: "%Y-%m-%dT%H:%M:%SZ"
      # Performance Variables:
      refresh: 500
      updateLength: 256
      ##
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

    setTimeout(Plotting.Handler.prototype.listen.bind(@), @options.refresh)

  listenTest: ->
    key = 0
    plot = @template[key]
    state = plot.proto.getState()
    if state.request.data.min
      @prependData(key)
    if state.request.data.max
      @appendData(key)

  listenTestLoop: ->
    # Run the update loop
    for key, plot of @template
      state = plot.proto.getState()
      # Min-Side Events
      if state.request.data.min
        @prependData(key)
      # Max-Side Events
      if state.request.data.max
        @appendData(key)

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
    
    @syncronousapi.get(target, args, callback)

  getStationParamData: (plotId, paramsKey) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getStationParamData()"
    target = "#{location.protocol}//dev.nwac.us/api/v5/measurement"
    _ = @
    args = @template[plotId].dataParams[paramsKey]

    callback = (data) ->
      if _.template[plotId].data is undefined
        _.template[plotId].data = [data.responseJSON.results]
      else
        _.template[plotId].data.push(data.responseJSON.results)
      console.log("#{preError} (template.data)", _.template[plotId].data)

    @syncronousapi.get(target, args, callback)
    
  getTemplatePlotData: ->
    preError = "#{@preError}.getPlotData()"
    for key, plot of @template
      for subKey, params of @template[key].dataParams
        @getStationParamData(key, subKey)
  
  append: () ->
    # Master append plots.
    preError = "#{@preError}.append()"
    
    for key, plot of @template
      target = @utarget(@options.target)
      $(@options.target).append("<div id='#{target}'></div>")
      #plot.type = "station"
      plot.type = "parameter"
      if plot.options.y2 is undefined
        plot.options.y2 = {}
      if plot.options.y3 is undefined
        plot.options.y3 = {}
      plot.options.plotId = key
      plot.options.uuid = @uuid()
      plot.options.target = "\##{target}"
      plot.options.dataParams = plot.dataParams
      
      plot.options.y.color = @getColor('light', key)
      plot.options.y2.color = @getColor('light', parseInt(key+4%7))
      plot.options.y3.color = @getColor('light', parseInt(key+6%7))
      
      _bounds = @getVariableBounds(plot.options.y.variable)
      
      if _bounds
        plot.options.y.min = _bounds.min
        plot.options.y.max = _bounds.max
      if plot.options.y.variable == 'temperature'
        plot.options.y.maxBarValue = 32
      
      # Join Multi-Station Data
      __data = new window.Plotting.Data(plot.data[0])
      _len = plot.data.length-1
      if _len > 0
        for i in [1.._len]
          __data.join(plot.data[i], [plot.options.x.variable])
            
      title = @getTitle(plot)
      instance = new window.Plotting.LinePlot(__data.get(), plot.options)
      instance.append()
      #instance.appendTitle(title.title, title.subtitle)
      @template[key].proto = instance
      @appendControls(key)

  mergeTemplateOption: () ->
    # Merge the templated plot options with returned options
      
  getAppendData: (call, plotId, paramsKey) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getAppendData(key, dataParams)"
    target = "http://dev.nwac.us/api/v5/measurement"
    _ = @
    args = @template[plotId].proto.options.dataParams[paramsKey]
    _length = @template[plotId].proto.options.dataParams.length
    
    callback = (data) ->
      plot = _.template[plotId]
      if plot.__data is undefined
        plot.__data = []
      if plot.__data[call] is undefined
        plot.__data[call] = new window.Plotting.Data(data.responseJSON.results)
      else
        plot.__data[call].join(data.responseJSON.results,
          [plot.proto.options.x.variable])
      if plot.__data[call].getSourceCount() is _length
        plot.proto.appendData(plot.__data[call].get())
        plot.proto.update()
        delete plot.__data[call]
        
    @api.get(target, args, callback)

  prependData: (plotId) ->
    # Move forward a certain offset of time records on all plots.
    preError = "#{@preError}.prependData()"
    plot = @template[plotId]
    state = plot.proto.getState()

    call = @uuid()
    for paramsKey, params of plot.proto.options.dataParams
      plot.proto.options.dataParams[paramsKey].max_datetime =
        @format(state.range.data.min)
      plot.proto.options.dataParams[paramsKey].limit = @options.updateLength
      @getAppendData(call, plotId, paramsKey)
    
  appendData: (plotId) ->
    # Move forward a certain offset of time records on all plots.
    preError = "#{@preError}.appendData()"
    plot = @template[plotId]
    state = plot.proto.getState()
    _now = new Date()
    
    # Get the Current Plot & Plot State
    if state.range.data.max >= _now
      return
    
    _max_datetime = state.range.data.max.getTime()
    _new_max_datetime = _max_datetime + (@options.updateLength * 3600000)
    
    call = @uuid()
    for paramsKey, params of plot.proto.options.dataParams
      plot.proto.options.dataParams[paramsKey].max_datetime =
        @format(new Date(_new_max_datetime))
      plot.proto.options.dataParams[paramsKey].limit = @options.updateLength
      @getAppendData(call, plotId, paramsKey)

  addVariable: (plotId, variable) ->
    # Add a variable to the plot.
    state = @template[plotId].proto.getState()
    
    _bounds = @getVariableBounds(variable)
    _info = @getVariableInfo(variable)
    _max_datetime = state.range.data.max.getTime()

    if @template[plotId].proto.options.y.variable == null
      @template[plotId].proto.options.y =
        variable: variable
      if _info
        @template[plotId].proto.options.y.title = _info.title
        @template[plotId].proto.options.y.units = _info.units
      if _bounds
        @template[plotId].proto.options.y.min = _bounds.min
        @template[plotId].proto.options.y.max = _bounds.max
    else if  @template[plotId].proto.options.y2.variable == null
      @template[plotId].proto.options.y2 =
        variable: variable
      if _info
        @template[plotId].proto.options.y2.title = _info.title
        @template[plotId].proto.options.y2.units = _info.units
      if _bounds
        @template[plotId].proto.options.y2.min = _bounds.min
        @template[plotId].proto.options.y2.max = _bounds.max
    else if  @template[plotId].proto.options.y3.variable == null
      @template[plotId].proto.options.y3 =
        variable: variable
      if _info
        @template[plotId].proto.options.y3.title = _info.title
        @template[plotId].proto.options.y3.units = _info.units
      if _bounds
        @template[plotId].proto.options.y3.min = _bounds.min
        @template[plotId].proto.options.y3.max = _bounds.max

    uuid = @uuid()
    for paramsKey, params of @template[plotId].proto.options.dataParams
      @template[plotId].proto.options.dataParams[paramsKey].max_datetime =
        @format(new Date(_max_datetime))
      @template[plotId].proto.options.dataParams[paramsKey].limit =
        state.length.data
      @getAppendData(uuid, plotId, paramsKey)

  addStation: (plotId, dataLoggerId) ->
    # Add another data logger to the plot.
    state = @template[plotId].proto.getState()
    _variable = @template[plotId].proto.options.y.variable
    _bounds = @getVariableBounds(_variable)
    _info = @getVariableInfo(_variable)
    _max_datetime = state.range.data.max.getTime()
    
    _params = $.extend(true, {}, @template[plotId].proto.options.dataParams[0])
    _params.data_logger = dataLoggerId
    _len = @template[plotId].proto.options.dataParams.push(_params)

    console.log("addStation: (dataLoggerId, _len, dataParams)",
      dataLoggerId, _len, @template[plotId].proto.options.dataParams)

    if @template[plotId].proto.options.y.variable == null
      @template[plotId].proto.options.y =
        dataLoggerId: dataLoggerId
        variable: _variable
        color: @getColor('light', parseInt(plotId))
      if _info
        @template[plotId].proto.options.y.title = _info.title
        @template[plotId].proto.options.y.units = _info.units
      if _bounds
        @template[plotId].proto.options.y.min = _bounds.min
        @template[plotId].proto.options.y.max = _bounds.max
    else if  @template[plotId].proto.options.y2.variable == null
      @template[plotId].proto.options.y2 =
        dataLoggerId: dataLoggerId
        variable: _variable
        color: @getColor('light', parseInt(plotId+4%7))
      if _info
        @template[plotId].proto.options.y2.title = _info.title
        @template[plotId].proto.options.y2.units = _info.units
      if _bounds
        @template[plotId].proto.options.y2.min = _bounds.min
        @template[plotId].proto.options.y2.max = _bounds.max
    else if  @template[plotId].proto.options.y3.variable == null
      @template[plotId].proto.options.y3 =
        dataLoggerId: dataLoggerId
        variable: _variable
        color: @getColor('light', parseInt(plotId+6%7))
      if _info
        @template[plotId].proto.options.y2.title = _info.title
        @template[plotId].proto.options.y2.units = _info.units
      if _bounds
        @template[plotId].proto.options.y3.min = _bounds.min
        @template[plotId].proto.options.y3.max = _bounds.max
      
    uuid = @uuid()
    for paramsKey, params of @template[plotId].proto.options.dataParams
      @template[plotId].proto.options.dataParams[paramsKey].max_datetime =
        @format(new Date(_max_datetime))
      @template[plotId].proto.options.dataParams[paramsKey].limit =
        state.length.data
      @getAppendData(uuid, plotId, paramsKey)
    @controls.updateStationDropdown(plotId)

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
      current = [
          @template[plotId].proto.options.y,
          @template[plotId].proto.options.y2,
          @template[plotId].proto.options.y3
      ]
      @controls.appendParameterDropdown(plotId, '#'+selector, 1, current)
    else if @template[plotId].type is "parameter"
      current = [
          @template[plotId].proto.options.y,
          @template[plotId].proto.options.y2,
          @template[plotId].proto.options.y3
      ]
      @controls.appendStationMap(plotId, '#'+selector, 1, current)
      @controls.appendStationDropdown(plotId, '#'+selector, 1, current)

  remove: (plotId) ->
    # Remove a plotId
    $(@template[plotId].proto.options.target).fadeOut(500, ->
      $(this).remove())
    @template[plotId] = null

  move: (plotId, direction) ->
    # Move the plotId.
    _pageOrder = @template[plotId].pageOrder
    selected = $(@template[plotId].proto.options.target)
    if direction is 'up'
      if _pageOrder > 1
        _tradeKey = @indexOfValue(@template, "pageOrder", _pageOrder-1)
        @template[plotId].pageOrder--
        @template[_tradeKey].pageOrder++
        selected.prev().insertAfter(selected)
    else if direction is 'down'
      if _pageOrder < @template.length
        _tradeKey = @indexOfValue(@template, "pageOrder", _pageOrder+1)
        @template[plotId].pageOrder++
        @template[_tradeKey].pageOrder--
        selected.next().insertBefore(selected)

  add: () ->
    # Add a new plot.

  getVariableBounds: (variable) ->
    bounds =
      battery_voltage:
        min: 8
        max: 16
      net_solar:
        min: 0
        max: 800
      relative_humidity:
        min: 0
        max: 100
      snow_depth:
        min: 0
        max: 40
      wind_direction:
        min: 0
        max: 360
      precipitation:
        min: 0
        max: 0.7
      temperature:
        min: 0
        max: 60
      wind_speed:
        min: 0
        max: 60
     return bounds[variable]

  getVariableInfo: (variable) ->
    info =
      battery_voltage:
        title: "Battery Voltage"
        units: "V"
      net_solar:
        title: "Solar Radiation"
        units: "W/m2"
      relative_humidity:
        title: "Relative Humidity"
        units: "%"
      barometric_pressure:
        title: "Barometric Pressure"
        units: "atm"
      snow_depth:
        title: "Snow Depth"
        units: "\""
      wind_direction:
        title: "Wind Direction"
        units: "°"
      precipitation:
        title: "Precipitation"
        units: "\""
      temperature:
        title: "Temperature"
        units: "°F"
      wind_speed:
        title: "Wind Speed"
        units: "mph"
    return info[variable]
        
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

  indexOfValue: (array, key, value) ->
    # Return the index of an assoc-object key->value
    index = -1
    for i in [0..(array.length-1)]
      if array[i][key] == value
        index = i
    return index
            
  uuid: ->
    return (((1+Math.random())*0x100000000)|0).toString(16).substring(1)
    
  utarget: (prepend) ->
    prepend = prepend.replace '#', ''
    return "#{prepend}-#{@uuid()}"
    
