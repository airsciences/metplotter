#
#   NWAC Plotting & Authentication handler.
#

window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (access, options, plots) ->
    @preError = "Plotting.Handler"
    
    defaults =
      target: null
      dateFormat: "%Y-%m-%dT%H:%M:%S%Z"
    @options = Object.mergeDefaults options, defaults

    @plots = []

    @endpoint = null
    accessToken =
      token: null
      expires: null
      expired: true
    access = Object.mergeDefaults access, accessToken
      
    @api = new window.Plotting.API access.token
    @parseDate = d3.timeParse(@options.dateFormat)

    @hasAccess = () ->
      # Calculate if the token has expired.
      if @parseDate(access.expires) > new Date
        access.expired = true
      if access.expired then false else true
    
  listen: () ->
    # Listen for Data Updates
    
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
      
    @api.get target, args, callback

  getStationParamData: (plotId) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getStationParamData(...)"
    target = "http://dev.nwac.us/api/v5/measurement"
    _ = @
    args = @template[plotId].dataParams

    console.log "#{preError} (args)", args

    callback = (data) ->
      console.log "#{preError}->callback() Returning API (plotId)", plotId
      _.template[plotId].data = data.responseJSON
    
    @api.get target, args, callback
    
  getPlotData: () ->
    # GET all plot data.
    preError = "#{@preError}.getPlotData()"
    for key, plot of @template
      @getStationParamData(key)
  
  append: () ->
    preError = "#{@preError}.append()"
    # Master append plots.
    
    for plot in @template
      target = @utarget(@options.target)
      $(@options.target).append("<div id='#{target}'></div>")
      plot.options.uuid = @uuid()
      plot.options.target = "\##{target}"
      plot.options.x =
        variable: 'datetime'
        format: @options.dateFormat
      plot.options.y =
        variable: 'wind_speed_average'
      data =
        data: plot.data.results
      console.log "#{preError} (plot)", plot
      instance = new window.Plotting.LinePlot data, plot.options
      instance.append()
      @plots.push instance

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

  forward: (offset) ->
    # Move forward a certain offset of time records on all plots.

      
  backward: (offset) ->
    # Move backward a certain offset of time records on all plots.
    
      
  zoom: (level) ->
    # Change the zoom level
    

  alert: (message, type) ->
    # Fire Modal w/ Message
  
  
  uuid: (length) ->
    return (((1+Math.random())*0x100000000)|0).toString(16).substring(1)
    
  utarget: (prepend) ->
    prepend = prepend.replace '#', ''
    return "#{prepend}-#{@uuid()}"
    
