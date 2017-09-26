window.Plotter ||= {}

window.Plotter.Tester = class Tester
  constructor: (plotter) ->
    # Test the Plotter
    @plotter = plotter

  template: ->
    # Test the template
    result = false
    _template = @plotter.i.template.template

    validA = @plotter.i.template.isValid(_template)
    console.log("Template validA result is: ", validA)

    return result

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



  domOrdering: ->
    # Test that the overlay rectangle is the top element
    # on the DOM for each plot!
    name = "DOM Overlay Ordering:"
    for key, plot of @plotter.plots
      _target = plot.proto.options.target
      _legend = $("#{_target}").find("svg").children().last()
      _zoom = $("#{_target}").find("svg").children().eq(-2)
      validLeg = _legend.hasClass("legend")
      valid = _zoom.hasClass("zoom-pane") and _zoom.is("rect")
      console.log("#{name} legend is over zoom pane (is true?)", validLeg)
      console.log("#{name} zoom pane is front (is true?)", valid)
