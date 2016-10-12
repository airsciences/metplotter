#
#   NWAC Plotting & Authentication handler.
#

window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (access, options, plots) ->
    @preError = "Plotting.Handler"
    
    defaults =
      target: null
      stage: 1
      dateFormat: "%Y-%m-%dT%H:%M:%SZ"
      updateHourOffset: 5000
    @options = Object.mergeDefaults options, defaults

    @now = new Date()
    @current = null
    @plots = []

    @readyState =
      template: false

    @endpoint = null
    accessToken =
      token: null
      expires: null
      expired: true
    access = Object.mergeDefaults access, accessToken
      
    @api = new window.Plotting.API access.token
    @syncronousapi = new window.Plotting.API access.token, false
    @parseDate = d3.timeParse(@options.dateFormat)

    format = d3.utcFormat @options.dateFormat

    @getCurrent = ->
      return format @current

    @getNow = ->
      return format @now

    @getForwardHours = ->
      # Checks if the zoom forward can happen
      now = new Date()
      Math.floor((now.getTime() - @current.getTime()) / 1000 / 3600)

    @hasForward = ->
      @getForwardHours() > 0

    @hasAccess = ->
      # Calculate if the token has expired.
      if @parseDate(access.expires) > new Date
        access.expired = true
      if access.expired then false else true
    
  initialize: ->
    # Initialize the page.
    @getTemplate()
    @getPlotData(null, false)
    @append()
    @stage()

  stage: ->
    # Stage forward and behind
    for num in [0..@options.stage]
      @backward()
    
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
      _.readyState.template = true
    
    @syncronousapi.get target, args, callback

  getStationParamData: (plotId, async) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getStationParamData(...)"
    target = "http://dev.nwac.us/api/v5/measurement"
    _ = @
    args = @template[plotId].dataParams
    
    # Specify Key Datetime
    if args.max_datetime == undefined
      args.max_datetime = @getNow()
      @current = @now
    else
      @current = new Date args.max_datetime

    callback = (data) ->
      _.template[plotId].data = data.responseJSON
    
    if async == false
      @syncronousapi.get target, args, callback
    else
      @api.get target, args, callback
    
  getPlotData: (direction, async) ->
    # Get data for all plots
    preError = "#{@preError}.getPlotData(...)"
    update = false
    prepend_offset = 0
    
    if direction == 'forward' and @hasForward()
      # Forward is an option, add to the max_datetime
      update = true
      @current = @current.getTime() +
        (@options.updateHourOffset * 60 * 60 * 1000)
    else if direction == 'backward'
      # Backward is an option, extend the offset from current
      console.log "#{preError} (backward)"
      update = true
      prepend_offset = @options.updateHourOffset
    
    preError = "#{@preError}.getPlotData()"
    for key, plot of @template
      # Update the Offset Values
      if update
        @template[key].dataParams.limit = @template[key].dataParams.limit +
          prepend_offset
        @template[key].dataParams.max_datetime = @getCurrent()
    
      @getStationParamData key, async
  
  append: () ->
    preError = "#{@preError}.append()"
    # Master append plots.
    
    for key, plot of @template
      target = @utarget(@options.target)
      $(@options.target).append("<div id='#{target}'></div>")
      plot.options.uuid = @uuid()
      plot.options.target = "\##{target}"
      plot.options.x =
        variable: 'datetime'
        format: @options.dateFormat
      data =
        data: plot.data.results
        
      title = plot.station.station
      subtitle = "#{plot.options.y.title}"
      if plot.options.y2
        subtitle = "#{plot.options.y.title} & #{plot.options.y2.title}"
     
      console.log "#{preError} (plot, data)", plot, data
      instance = new window.Plotting.LinePlot data, plot.options
      instance.append()
      instance.appendTitle(title, subtitle)
      @plots[key] = instance

  mergeTemplateOption: () ->
    # Merge the templated plot options with returned options
      
  getAggregateMethod: (param, start, end) ->
    # Returns the appropriate aggregate method for a give parameter and zoom.
    aggregate = 'hourly'
    interval = new Date end - new Date start
    
    switch param
      when 'temp'
        arregate = 'daily'
      when 'precip'
        aggregate = 'daily'

  update: () ->
    # Move forward a certain offset of time records on all plots.
    preError = "#{@preError}.update()"
    for key, plot of @plots
      console.log "#{preError} ready to go forward (@template[key].data)",
        @template[key].data
      data = @template[key].data.results
      @plots[key].update data
    
  forward: ->
    # Move forward a certain offset of time records on all plots.
    preError = "#{@preError}.forward()"
    @getPlotData("forward")
      
  backward: ->
    # Move backward a certain offset of time records on all plots.
    preError = "#{@preError}.backward()"
    @getPlotData("backward")
      
  zoom: (transform) ->
    # Set the zoom state of all plots. Triggered by a single plot.
    for plot in @plots
      plot.setZoomTransform(transform)
    
  crosshair: (transform, mouse) ->
    # Set the cursor hover position of all plots. Triggered by a single plot."
    for plot in @plots
      plot.setCrosshair(transform, mouse)

  showCrosshairs: ->
    # Show all Crosshair Command
    for plot in @plots
      plot.showCrosshair()

  hideCrosshairs: ->
    # Hide cursor crosshairs.
    for plot in @plots
      plot.hideCrosshair()

  alert: (message, type) ->
    # Fire Modal w/ Message
  
  
  uuid: (length) ->
    return (((1+Math.random())*0x100000000)|0).toString(16).substring(1)
    
  utarget: (prepend) ->
    prepend = prepend.replace '#', ''
    return "#{prepend}-#{@uuid()}"
    
