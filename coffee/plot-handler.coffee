#
#   NWAC Plotting & Authentication handler.
#

window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (access, options, plots) ->
    @preError = "Plotting.Handler"
    
    defaults =
      target: null
      dateFormat: "%Y-%m-%d %H:%M:%S"
    @options = Object.mergeDefaults options, defaults

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
    # args =
    #   plotHandlerId: @options.plotHandlerId
    _ = @
    
    callback = (data) ->
      if data.responseJSON == null || data.responseJSON.error
        console.log "#{preError}.callback(...) error detected (data)", data
        return
      _.template = data.responseJSON.templateData
      for plot in _.template
        params = plot.dataParams
        console.log "#{preError}.callback(...) (plot, params)", plot, params
        _.getStationParamData plot, params.data_logger, params.fields,
          params.max_datetime, params.limit, null
      
      
    @api.get target, args, callback
    
  setTemplate: () ->
    # Save the Template
    preError = "#{@preError}.setTemplate(...)"
    target = "http://dev.nwac.us/api/v5/template"
    
    callback = (data) ->
      console.log "#{preError}.callback(...) (data)"
    
    @api.put target, args, callback
    
  getStationParamData: \
  ( plot
  , data_logger
  , fields
  , max_datetime
  , limit
  , offset
  ) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getStationParamData(...)"
    target = "http://dev.nwac.us/api/v5/measurement"
    args =
      data_logger: data_logger
      max_datetime: max_datetime
      fields: fields
      limit: limit
      offset: offset
    
    callback = (data) ->
      console.log "#{preError}.callback(...) (plot, data)", plot, data
      plot.data = data.responseJSON
    
    @api.get target, args, callback
    
  append: () ->
    # Master append plots.
    for plot in @template
      instance = new window.Plotting.LinePlot plot.data, plot.options
      instance.append()
      @plots.push instance

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
    
