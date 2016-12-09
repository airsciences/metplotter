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
      #console.log("Testing... (plot)", key)
      cat = "rawr"

  templateOptionsMatch: ->
    # Test coherence between the template and plot options data loggers
    name = "Template-Options Match:"
    for key, plot of @plotter.plots
      _template = @plotter.i.template.template[key]
      _y = plot.proto.options.y

      count = _template.y.length == _y.length
      console.log("#{name} Length is correct", count)

      #console.log("#{name} Ready to iterate proto-y", _template.y, _y)
      for yKey, yRow of _template.y
        # Test dataLoggerId Match
        valid = yRow.dataLoggerId == _y[yKey].dataLoggerId
        console.log("#{name} Logger Matches",
          yKey, yRow.dataLoggerId, _y[yKey].dataLoggerId, valid)

  colors: ->
    # Test that colors for each plot match the template color management.
