window.Plotter ||= {}

window.Plotter.Tester = class Tester
  constructor: (plotter) ->
    # Test the Plotter
    @plotter = plotter

  template: ->
    # Test the template
    _template = @plotter.i.template.template
    console.log("Testing basic template validity...")
    validA = @plotter.i.template.isValid(_template)
    console.log("Template validA result is: ", validA)

  plotOptions: ->
    for key, plot of @plotter.plots
      console.log("Testing... (plot)", plot)

  templateOptionsMatch: ->
    for key, plot of @plotter.plots
      _template = @plotter.i.template.template[key]
      _y = plot.proto.options.y

      count = _template.y.length == _y.length
      console.log("Template-Options Match: Length is correct", count)
      loggers = []
      for yKey, yRow in _template.y
        logger[yKey] =
          template: yRow.dataLoggerId
          options: _y[yKey].dataLoggerId
        logger[yKey].valid = logger[yKey].template is logger[yKey].options
        console.log("Template-Options Match: Logger Matches (y-key)", yKey,
          logger[yKey].valid)
