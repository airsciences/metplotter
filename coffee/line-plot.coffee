#
#   NWAC Coffee Plots
#

window.Plotting ||= {}

window.Plotting.LinePlot = class LinePlot
  constructor: (data, options) ->
    @preError = "LinePlot."

    # Default Configuration
    defaults =
      uuid: ''
      debug: true
      target: null
      theme: 'default'
      x:
        variable: null
        format: "%Y-%m-%d %H:%M:%S"
        min: null
        max: null
        ticks: 7
      y:
        variable: null
        ticks: 5
        min: null
        max: null
      yBand:
        minVariable: null
        maxVariable: null
      y2:
        variable: null
        ticks: 5
        min: null
        max: null
      y2Band:
        minVariable: null
        maxVariable: null
      zoom:
        scale:
          min: 0.1
          max: 5
      transitionDuration: 500
      line1Color: "rgb(41, 128, 185)"
      line2Color: "rgb(39, 174, 96)"
      weight: 2
      axisColor: "rgb(0,0,0)"
      font:
        weight: 100
        size: 12
      crosshairX:
        weight: 1
        color: "rgb(149, 165, 166)"
    if options.x
      options.x = Object.mergeDefaults(options.x, defaults.x)
    if options.y
      options.y = Object.mergeDefaults(options.y, defaults.y)
    if options.y2
      options.y2 = Object.mergeDefaults(options.y2, defaults.y2)
    @options = Object.mergeDefaults options, defaults

    # Wrapped Logging Functions
    @log = (log...) ->
    if @options.debug
      @log = (log...) -> console.log(log)

    # Minor Prototype Support Functions
    @parseDate = d3.timeParse(@options.x.format)
    @bisectDate = d3.bisector((d) -> d.x).left
    @sortDatetimeAsc = (a, b) -> a.x - b.x

    # Prepare the Data & Definition
    @data = @processData(data.data)
    @getDefinition()

  processData: (data) ->
    # Process a data set.
    result = []
    for key, row of data
      result[key] =
        x: @parseDate(row[@options.x.variable])
        y: row[@options.y.variable]
      if @options.y2.variable != null
        result[key].y2 = row[@options.y2.variable]
      if (
        @options.yBand.minVariable != null and
        @options.yBand.maxVariable != null
      )
        result[key].yMin = row[@options.yBand.minVariable]
        result[key].yMax = row[@options.yBand.maxVariable]
      if (
        @options.y2Band.minVariable != null and
        @options.y2Band.maxVariable != null
      )
        result[key].y2Min = row[@options.y2Band.minVariable]
        result[key].y2Max = row[@options.y2Band.maxVariable]
    return result.sort @sortDatetimeAsc

  getDefinition: ->
    preError = "#{@preError}getDefinition():"
    _ = @

    # Define the Definition
    @definition =
      colorScale: d3.schemeCategory20
    @calculateChartDims()
    @calculateAxisDims(@data)

    # Define D3 Methods
    @definition.xAxis = d3.axisBottom().scale(@definition.x)
      .ticks(Math.round($(@options.target).width() / 100))
    @definition.yAxis = d3.axisLeft().scale(@definition.y)
      .ticks(@options.y.ticks)
      
    # Define the Domains
    @definition.x.domain([@definition.x.min, @definition.x.max])
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()
      
    @definition.zoom = d3.zoom()
      .scaleExtent([@options.zoom.scale.min, @options.zoom.scale.max])
      .on("zoom", () ->
        _transform = d3.event.transform
        
        # Zoom the X-Axis
        _rescaleX = _transform.rescaleX(_.definition.x)
        _.svg.select(".line-plot-axis-x").call(
          _.definition.xAxis.scale(_rescaleX)
        )
        
        # Redefine & Redraw the Line Path
        _.definition.line = d3.line()
          .defined((d)->
            !isNaN(d.y) and d.y isnt null
          )
          .x((d) -> _transform.applyX(_.definition.x(d.x)))
          .y((d) -> _.definition.y(d.y))
          .curve(d3.curveMonotoneX)

        _.svg.select(".line-plot-path")
          .attr("d", _.definition.line)

        # Redefine & Redraw the Line2 Path
        _.definition.line2 = d3.line()
          .defined((d)->
            !isNaN(d.y2) and d.y2 isnt null
          )
          .x((d) -> _transform.applyX(_.definition.x(d.x)))
          .y((d) -> _.definition.y(d.y2))
          .curve(d3.curveMonotoneX)

        _.svg.select(".line-plot-path2")
          .attr("d", _.definition.line2)
          
        _.appendCrosshairTarget(_transform)
        
        # Pass Transform to Plotter
        plotter.zoom(_transform)
      )

    @definition.line = d3.line()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y((d) -> _.definition.y(d.y))
      .curve(d3.curveMonotoneX)

    @definition.line2 = d3.line()
      .defined((d)->
        !isNaN(d.y2) and d.y2 isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y((d) -> _.definition.y(d.y2))
      .curve(d3.curveMonotoneX)

    @definition.area = d3.area()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y0((d) -> _.definition.y(d.yMin))
      .y1((d) -> _.definition.y(d.yMax))
      .curve(d3.curveMonotoneX)

    @definition.area2 = d3.area()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y0((d) -> _.definition.y(d.y2Min))
      .y1((d) -> _.definition.y(d.y2Max))
      .curve(d3.curveMonotoneX)

  calculateChartDims: ->
    # Calculate Basic DOM & SVG Dimensions
    width = Math.round($(@options.target).width())
    height = Math.round(width/4)
    margin =
      top: Math.round(height * 0.07)
      right: Math.round(Math.pow(width, 0.6))
      bottom: Math.round(height * 0.16)
      left: Math.round(Math.pow(width, 0.6))

    # Basic Dimention
    @definition.dimensions =
      width: width
      height: height
      margin: margin

    # Define Translate Padding
    @definition.dimensions.topPadding =
      parseInt(@definition.dimensions.margin.top)
    @definition.dimensions.bottomPadding =
      parseInt(@definition.dimensions.height -
      @definition.dimensions.margin.bottom)
    @definition.dimensions.leftPadding =
      parseInt(@definition.dimensions.margin.left)
    @definition.dimensions.innerHeight =
      parseInt(@definition.dimensions.height -
      @definition.dimensions.margin.bottom - @definition.dimensions.margin.top)
    @definition.dimensions.innerWidth =
      parseInt(@definition.dimensions.width -
      @definition.dimensions.margin.left - @definition.dimensions.margin.right)
    
    # Define the X & Y Scales
    @definition.x = d3.scaleTime().range([margin.left, (width-margin.right)])
    @definition.y = d3.scaleLinear().range([(height-margin.bottom),
      (margin.top)])

  calculateAxisDims: (data) ->
    @calculateXAxisDims(data)
    @calculateYAxisDims(data)

  calculateXAxisDims: (data) ->
    # Calculate Min & Max X Values
    @definition.x.min = if @options.x.min is null then d3.min(data, (d)-> d.x)
    else @parseDate(@options.x.min)
    @definition.x.max = if @options.x.max is null then d3.max(data, (d)-> d.x)
    else @parseDate(@options.x.max)

  calculateYAxisDims: (data) ->
    # Calculate Min & Max Y Values
    @definition.y.min = d3.min([
      @options.y.min
      d3.min(data, (d)-> d.y)
      d3.min(data, (d)-> d.y2)
      d3.min(data, (d)-> d.yMin)
      d3.min(data, (d)-> d.y2Min)
    ])
    
    @definition.y.max = d3.max([
      @options.y.max
      d3.max(data, (d)-> d.y)
      d3.max(data, (d)-> d.y2)
      d3.max(data, (d)-> d.yMax)
      d3.max(data, (d)-> d.y2Max)
    ])

    # Restore Viewability if Y-Min = Y-Max
    if @definition.y.min == @definition.y.max
      @definition.y.min = @definition.y.min * 0.8
      @definition.y.max = @definition.y.min * 1.2

  append: ->
    preError = "#{@preError}append()"
    _ = @

    # Create the SVG
    @svg = d3.select(@options.target).append("svg")
      .attr("class", "line-plot")
      .attr("width", @definition.dimensions.width)
      .attr("height", @definition.dimensions.height)
      
    # Append a Clip Path
    @svg.append("defs")
      .append("clipPath")
      .attr("id", "#{@options.target}_clip")
      .append("rect")
      .attr("width", @definition.dimensions.innerWidth)
      .attr("height", @definition.dimensions.innerHeight)
      .attr("transform",
        "translate(#{@definition.dimensions.leftPadding},
        #{@definition.dimensions.topPadding})"
      )
    
    # Append the X-Axis
    @svg.append("g")
      .attr("class", "line-plot-axis-x")
      .style("fill", "none")
      .style("stroke", @options.axisColor)
      .call(@definition.xAxis)
      .attr("transform",
        "translate(0, #{@definition.dimensions.bottomPadding})"
      )

    # Append the Y-Axis
    @svg.append("g")
      .attr("class", "line-plot-axis-y")
      .style("fill", "none")
      .style("stroke", @options.axisColor)
      .style("font-size", @options.font.size)
      .style("font-weight", @options.font.weight)
      .call(@definition.yAxis)
      .attr("transform", "translate(#{@definition.dimensions.leftPadding}, 0)")

    # Append Bands
    if (
      @options.yBand.minVariable != null and
      @options.yBand.maxVariable != null
    )
      @lineband = @svg.append("g")
        .attr("clip-path", "url(\##{@options.target}_clip)")
        .append("path")
        .datum(@data)
        .attr("d", @definition.area)
        .attr("class", "line-plot-area")
        .style("fill", "rgb(171, 211, 237)")
        .style("opacity", 0.5)
        .style("stroke", "rgb(0, 0, 0)")
        .style("stroke-width", "1")

    if (
      @options.y2Band.minVariable != null and
      @options.y2Band.maxVariable != null
    )
      @lineband2 = @svg.append("g")
        .attr("clip-path", "url(\##{@options.target}_clip)")
        .append("path")
        .datum(@data)
        .attr("d", @definition.area2)
        .attr("class", "line-plot-area2")
        .style("fill", "rgb(172, 236, 199)")
        .style("opacity", 0.5)
        .style("stroke", "rgb(0, 0, 0)")

    # Append the Line Paths
    @svg.append("g")
      .attr("clip-path", "url(\##{@options.target}_clip)")
      .append("path")
      .datum(@data)
      .attr("d", @definition.line)
      .attr("class", "line-plot-path")
      .style("stroke", @options.line1Color)
      .style("stroke-width",
          Math.round(Math.pow(@definition.dimensions.width, 0.1)))
      .style("fill", "none")

    @svg.append("g")
      .attr("clip-path", "url(\##{@options.target}_clip)")
      .append("path")
      .datum(@data)
      .attr("d", @definition.line2)
      .attr("class", "line-plot-path2")
      .style("stroke", @options.line2Color)
      .style("stroke-width",
        Math.round(Math.pow(@definition.dimensions.width, 0.1)))
      .style("fill", "none")

    # Create Crosshairs
    @crosshairs = @svg.append("g")
      .attr("class", "crosshair")

    # Create Vertical line
    @crosshairs.append("line")
      .attr("class", "crosshair-x")
      .style("stroke", @options.crosshairX.color)
      .style("stroke-width", @options.crosshairX.weight)
      .style("fill", "none")

    # Create Focus Circles and Labels
    if @options.y.variable != null
      @focusCircle = @svg.append("circle")
        .attr("r", 4)
        .attr("class", "focusCircle")
        .attr("fill", @options.line1Color)
        .attr("transform", "translate(-10, -10)")

      @focusText = @svg.append("text")
        .attr("class", "focusText")
        .attr("x", 9)
        .attr("y", 7)
        .style("fill", @options.line1Color)

    if @options.y2.variable != null
      @focusCircle2 = @svg.append("circle")
        .attr("r", 4)
        .attr("class", "focusCircle2")
        .attr("fill", @options.line2Color)
        .attr("transform", "translate(-10, -10)")

      @focusText2 = @svg.append("text")
        .attr("class", "focusText2")
        .attr("x", 9)
        .attr("y", 7)
        .style("fill", @options.line2Color)

    # Append the Crosshair & Zoom Event Rectangle
    @overlay = @svg.append("rect")
      .attr("class", "plot-event-target")
      
    # Append Crosshair & Zoom Listening Targets
    @appendCrosshairTarget()
    @appendZoomTarget()
    
  appendCrosshairTarget: (transform) ->
    # Move Crosshairs and Focus Circle Based on Mouse Location
    preError = "#{@preError}appendCrosshairTarget()"
    _ = @
    
    @overlay.datum(@data)
      .attr("class", "overlay")
      .attr("width", @definition.dimensions.innerWidth)
      .attr("height", @definition.dimensions.innerHeight)
      .attr("transform",
        "translate(#{@definition.dimensions.leftPadding},
        #{@definition.dimensions.topPadding})"
      )
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () -> plotter.showCrosshairs())
      .on("mouseout", () -> plotter.hideCrosshairs())
      .on("mousemove", () ->
        mouse = _.setCrosshair(transform)
        plotter.crosshair(transform, mouse)
      )
      
  appendZoomTarget: ->
    preError = "#{@preError}appendZoomTarget()"
    _ = @
    
    # Append the Zoom Rectangle
    @overlay.attr("class", "zoom-pane")
      .attr("width", @definition.dimensions.innerWidth)
      .attr("height", @definition.dimensions.innerHeight)
      .attr("transform",
        "translate(#{@definition.dimensions.leftPadding},
        #{@definition.dimensions.topPadding})"
      )
      .style("fill", "none")
      .style("pointer-events", "all")
      .style("cursor", "move")
      .call(@definition.zoom, d3.zoomIdentity)

  update: (data) ->
    preError = "#{@preError}update()"
    _ = @

    # Append New Data
    dtOffset = new Date @definition.x.max
    for key, row of data
      dtaRow =
        x: @parseDate(row[@options.x.variable])
        y: row[@options.y.variable]
      if @options.y2.variable != null
        dtaRow.y2 = row[@options.y2.variable]
      if (
        @options.yBand.minVariable != null and
        @options.yBand.maxVariable != null
      )
        dtaRow.yMin = row[@options.yBand.minVariable]
        dtaRow.yMax = row[@options.yBand.maxVariable]
      if (
        @options.y2Band.minVariable != null and
        @options.y2Band.maxVariable != null
      )
        dtaRow.y2Min = row[@options.y2Band.minVariable]
        dtaRow.y2Max = row[@options.y2Band.maxVariable]
      @data.push(dtaRow)

    # Sort the Data
    @data = @data.sort @sortDatetimeAsc
    
    # Pre-Append Data For Smooth transform
    @svg.select(".line-plot-area")
      .datum(@data)
      .attr("d", @definition.area)

    @svg.select(".line-plot-area2")
      .datum(@data)
      .attr("d", @definition.area2)

    @svg.select(".line-plot-path")
      .datum(@data)
      .attr("d", @definition.line)

    @svg.select(".line-plot-path2")
      .datum(@data)
      .attr("d", @definition.line2)

    @calculateYAxisDims @data
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()

    # Redraw the Bands
    @svg.select(".line-plot-area")
      .datum(@data)
      .transition()
      .duration(@options.transitionDuration)
      .attr("d", @definition.area)

    @svg.select(".line-plot-area2")
      .datum(@data)
      .transition()
      .duration(@options.transitionDuration)
      .attr("d", @definition.area2)

    # Redraw the Line Paths
    @svg.select(".line-plot-path")
      .datum(@data)
      .transition()
      .duration(@options.transitionDuration)
      .attr("d", @definition.line)

    @svg.select(".line-plot-path2")
      .datum(@data)
      .transition()
      .duration(@options.transitionDuration)
      .attr("d", @definition.line2)

    # Redraw the Y-Axis
    @svg.select(".line-plot-axis-y")
      .style("font-size", @options.font.size)
      .style("font-weight", @options.font.weight)
      .transition()
      .duration(@options.transitionDuration)
      .ease(d3.easeLinear)
      .call(@definition.yAxis)
      
  setZoomTransform: (transform) ->
    # Set the current zoom transform state.
    preError = "#{@preError}.setZoomTransform(transform)"
    _ = @
    _transform = transform
    
    # Zoom the X-Axis
    _rescaleX = _transform.rescaleX(@definition.x)
    @svg.select(".line-plot-axis-x").call(
      @definition.xAxis.scale(_rescaleX)
    )
    
    # Redefine & Redraw the Line Path
    @definition.line = d3.line()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y((d) -> _.definition.y(d.y))
      .curve(d3.curveMonotoneX)

    @svg.select(".line-plot-path")
      .attr("d", @definition.line)

    # Redefine & Redraw the Line2 Path
    @definition.line2 = d3.line()
      .defined((d)->
        !isNaN(d.y2) and d.y2 isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y((d) -> _.definition.y(d.y2))
      .curve(d3.curveMonotoneX)

    @svg.select(".line-plot-path2")
      .attr("d", @definition.line2)
      
    @appendCrosshairTarget(_transform)

  setCrosshair: (transform, mouse) ->
    # Set the Crosshair position
    preError = "#{@preError}.setCrosshair(mouse)"
    _ = @
    _dims = @definition.dimensions
    
    _mouseTarget = @overlay.node()
    _datum = @overlay.datum()
    mouse = if mouse then mouse else d3.mouse(_mouseTarget)
    
    x0 = _.definition.x.invert(mouse[0] + _dims.leftPadding)
    if transform
      x0 = _.definition.x.invert(
        transform.invertX(mouse[0] + _dims.leftPadding)
      )
    i = _.bisectDate(_datum, x0, 1)
    d = if x0.getMinutes() >= 30 then _datum[i] else _datum[i - 1]
    dx = if transform then transform.applyX(_.definition.x(d.x)) else
      _.definition.x(d.x)
    if _.options.y.variable != null
      dy = _.definition.y(d.y)
      _.focusCircle.attr("transform", "translate(0, 0)")
    if _.options.y2.variable != null
      dy2 = _.definition.y(d.y2)
      _.focusCircle2.attr("transform", "translate(0, 0)")

    cx = dx - _dims.leftPadding
    _.crosshairs.select(".crosshair-x")
      .attr("x1", cx)
      .attr("y1", _dims.topPadding)
      .attr("x2", cx)
      .attr("y2", _dims.innerHeight + _dims.topPadding)
      .attr("transform", "translate(#{_dims.leftPadding}, 0)")

    if _.options.y.variable != null
      _.focusCircle
        .attr("cx", dx)
        .attr("cy", dy)

      _.focusText
        .attr("x", dx + _dims.leftPadding / 10)
        .attr("y", dy - _dims.topPadding / 10)
        .text(d.y.toFixed(1) + " " + "°F")

    if _.options.y2.variable != null
      _.focusCircle2
        .attr("cx", dx)
        .attr("cy", dy2)

      _.focusText2
        .attr("x", dx + _dims.leftPadding / 10)
        .attr("y", dy2 - _dims.topPadding / 10)
        .text(d.y2.toFixed(1) + " " + "°F")
    
    return mouse
    
  showCrosshair: ->
    # Show the Crosshair
    @crosshairs.select(".crosshair-x")
      .style("display", null)
    
    if @options.y.variable != null
      @focusCircle.style("display", null)
      @focusText.style("display", null)
      
    if @options.y2.variable != null
      @focusCircle2.style("display", null)
      @focusText2.style("display", null)
  
  hideCrosshair: () ->
    # Hide the Crosshair
    @crosshairs.select(".crosshair-x")
      .style("display", "none")
    
    if @options.y.variable != null
      @focusCircle.style("display", "none")
      @focusText.style("display", "none")
    
    if @options.y2.variable != null
      @focusCircle2.style("display", "none")
      @focusText2.style("display", "none")

  appendTitle: (title) ->
    @svg.append("g")
      .attr("class", "line-plot-title")
