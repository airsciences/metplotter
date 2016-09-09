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
      
    @api = new window.Plotting.API
    @parseDate = d3.timeParse(@options.dateFormat)

    @hasAccess = () ->
      # Calculate if the token has expired.
      if @parseDate(access.expires) > new Date
        access.expired = true
      if access.expired then false else true
    
  listen: () ->
    # Listen for Data Updates
    
  getTemplate: () ->
    # Request the Template
    
  getStationParamData: (data_logger, fields, limit, offset) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getStationParamData(...)"
    target = "http://dev.nwac.us/api/v5/measurement"
    args =
      data_logger: data_logger
      fields: fields
      limit: limit
      offset: offset
    
    callback = (data) ->
      console.log "#{preError}.callback(...) (data)", data
    
    @api.get target, args, callback
    
  append: () ->
    # Master append plots.
    for plot in @plots
      instance = new window.Plotting.LinePlot plot.data, plot.options
      instance.append()
      @plots.push instance
      
  alert: (message, type) ->
    # Fire Modal w/ Message
    
