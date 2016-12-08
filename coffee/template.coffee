#
#   Northwest Avalanche Center (NWAC)
#   Plotter Tools - Template Manager
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotter ||= {}

window.Plotter.Template = class Template
  constructor: (plotter) ->
    @preError = "Plotter.Template."
    @plotter = plotter
    @api = @plotter.i.api
    @sapi = @plotter.i.sapi

    @template = null
    @dataSets = 0

    @isValid = (template) ->
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

    @newIsValid = (template) ->
      # JSON Format Validity Test
      for row in template
        if row.type is undefined then return false
      return true

    @parse = (templateData) ->
      # Parse the string format
      __json = JSON.parse(templateData).templateData
      if @isValid(__json)
        for row in __json
          row.x.min =
            new window.Plotter.Now(@plotter.lib.format, row.x.min).get()
          row.x.max =
            new window.Plotter.Now(@plotter.lib.format, row.x.max).get()
        return __json
      else
        throw new Error("Plotter template format is invalid. Reference a
          working example.")
        return null

    @stringify = ->
      # Return the String Template
      __prepared =
        templateData: @template
      return JSON.stringify(__prepared)

    @endpoint = ->
      # Get the Template Engine Endpoint
      return "#{@plotter.options.href}/api/v5/plothandler/"

  get: ->
    # GET a template from the server
    preError = "#{@preError}get()"
    target = @endpoint() + @plotter.options.templateId
    args = null
    _ = @

    callback = (data) ->
      if data.responseJSON == null || data.responseJSON.error
        throw new Error("#{preError}.callback(data) error retrieving template.")
        return
      _.template = _.parse(data.responseJSON.template_data)

    @sapi.get(target, args, callback)

  put: ->
    # PUT a template onto the server
    preError = "#{@preError}put()"
    if @plotter.isAdmin() is false
      throw new Error("#{preError}, not authorized for PUT requests.")
      return false
    target = @endpoint()
    args =
      id: @plotter.options.templateId
      template_data: @stringify(@template)
    _ = @

    callback = (data) ->
      console.log("Template PUT completed (data)", data)

    @api.put(target, args, callback)

  add: (options) ->
    # Add a new plot to the template
    preError = "#{@preError}add(options)"
    key = @template.push(options) - 1
    _valid =
    if !@newIsValid(@template)
      throw new Error("#{preError} template invalid after adding new plot.")
    return key

  plotCount: ->
    # Return the number of plots
    return @template.length

  dataSetCount: (plotId) ->
    # Return the number of data sets for the plot.
    return @template[plotId].y.length

  full: ->
    # Return the full template.
    return @template

  forSync: (plotId, lineId, maxDatetime, limit) ->
    # Prepare the template for an API request.
    result =
      data_logger: @template[plotId].y[lineId].dataLoggerId
      max_datetime: maxDatetime
      limit: limit
    return result

  forControls: () ->
    # Prepare the template for building controls.

  forPlots: (plotId) ->
    # Prepare the template for building a plot.
    _x = @template[plotId].x
    _y = @template[plotId].y
    for _row in _y
      if _row.variable is "wind_speed_average"
        _row.band =
          minVariable: "wind_speed_minimum"
          maxVariable: "wind_speed_maximum"

    result =
      plotId: plotId
      x: _x
      y: _y

    return result

  removePlot: (plotId) ->
    # Remove the plot from the template
    delete @template[plotId]
