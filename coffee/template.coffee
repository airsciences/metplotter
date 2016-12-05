#
#   Northwest Avalanche Center (NWAC)
#   Plotting Tools - Template Manager
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotting ||= {}

window.Plotting.Template = class Template
  constructor: (plotter) ->
    @preError = "Plotting.Template."
    @plotter = plotter
    console.log("#{@preError} (plotter.i)", plotter.i)
    @api = @plotter.i.api
    @sapi = @plotter.i.sapi

    @template = null

    __isValid = (template) ->
      # JSON Format Validity Test
      for row in template
        if row.type is undefined then return false
        if row.x is undefined then return false
        if row.y is undefined then return false
        if row.x.variable is undefined then return false
        if row.x.min is undefined then return false
        if row.x.max is undefined then return false
        if row.y[0] is undefined then return false
        for y in row.y
          if y.dataLoggerId is undefined then return false
          if y.variable is undefined then return false
          if y.title is undefined then return false
          if y.units is undefined then return false
      return true

    @parse = (templateData) ->
      # Parse the string format
      __json = JSON.parse(templateData).templateData
      if __isValid(__json)
        return __json
      else
        throw new Error("Plotting template format is invalid. Reference a
          working example.")
        return null

    @stringify = ->
      # Return the String Template
      return JSON.stringify(@template)

    @endpoint = ->
      # Get the Template Engine Endpoint
      return "#{@plotter.options.href}/api/v5/plothandler/\
        #{@plotter.options.templateId}"

  get: ->
    # GET a template from the server
    preError = "#{@preError}get()"
    target = @endpoint()
    args = null
    _ = @

    callback = (data) ->
      if data.responseJSON == null || data.responseJSON.error
        console.log("#{preError}.callback(data) error detected (data)", data)
        return
      _.template = _.parse(data.responseJSON.template_data)

    @api.get(target, args, callback)

  put: ->
    # PUT a template onto the server
    if @plotter.isAdmin() is false
      return
    preError = "#{@preError}put()"
    target = @endpoint()
    args =
      id: @plotter.options.templateId
      template_data:
        templateData: @stringify(@template)
    _ = @

    callback = (data) ->
      if data.responseJSON == null || data.responseJSON.console.error
        console.log("#{preError}.callback(data) error detected (data)", data)
        return
      _.template = data.responseJSON.templateData

    @api.put(target, args, callback)
