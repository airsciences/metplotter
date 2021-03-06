#
#   D3 V4 Legend Method (legend.coffee)
#
#   Air Sciences Inc. - 2017
#   Jacob Fielding
#

window.Plotter ||= {}

window.Plotter.Legend = class Legend
  constructor: (plotter, plotId) ->
    @preError = "Plotter.Legend."
    preError = "#{@preError}.constructor(...)"

    @plotter = plotter
    @svg = @plotter.plots[plotId].proto.svg
    @plotId = @plotter.plots[plotId].proto.options.plotId
    @dimensions = @plotter.plots[plotId].proto.definition.dimensions

    @legend = @svg.append("g")
      .attr("class", "legend")

  set: ->
    @data = []
    _options = @plotter.plots[@plotId].proto.options
    _count = 0
    for key, row of _options.y
      _datalogger = @plotter.i.controls.getLoggerName(@plotId, row.dataLoggerId)
      _count++
      _result =
        offset: _count
        title: "#{_datalogger}"
        color: row.color
      @data.push(_result)
    return @data

  draw: ->
    # Append the Legend the SVG
    @set()

    _rect = @legend.selectAll("rect")
      .data(@data)

    _rect.attr("y", (d) -> d.offset * 12)
      .style("fill", (d) -> d.color)

    _rect.enter()
      .append("rect")
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("width", 6)
      .attr("height", 6)
      .attr("x", @dimensions.margin.left + 20)
      .attr("y", (d) -> d.offset * 12)
      .style("fill", (d) -> d.color)

    _rect.exit()
      .remove()

    _text = @legend.selectAll("text")
      .data(@data)

    _text.attr("y", (d) -> d.offset * 12 + 6)
      .text((d) -> d.title)

    _text.enter()
      .append("text")
      .attr("x", @dimensions.margin.left + 30)
      .attr("y", (d) -> d.offset * 12 + 6)
      .text((d) -> d.title)
      .style("font-size", "12px")
      .style("font-weight", 500)

    _text.exit()
      .remove()

    remove: ->
      # Remove the Legend
      @legend.selectAll(".legend")
        .remove()
