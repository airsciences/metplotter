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
    @api = @plotter.i.api
    @sapi = @plotter.i.sapi

    @template = null

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
      if data.responseJSON == null || data.responseJSON.console.error
        console.log("#{preError}.callback(data) error detected (data)", data)
        return
      _.template = data.responseJSON.templateData

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
        templateData: @template
    _ = @

    callback = (data) ->
      if data.responseJSON == null || data.responseJSON.console.error
        console.log("#{preError}.callback(data) error detected (data)", data)
        return
      _.template = data.responseJSON.templateData

    @api.put(target, args, callback)
