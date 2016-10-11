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

    @parseDate = d3.timeParse(@options.x.format)
    @bisectDate = d3.bisector((d) -> d.x).left

    # Sort Data by Datetime (Ascending)
    @sortDatetimeAsc = (a, b) ->
      a.x - b.x

    # Set @data
    @data = []
    for key, row of data.data
      @data[key] =
        x: @parseDate(row[@options.x.variable])
        y: row[@options.y.variable]
      if @options.y2.variable != null
        @data[key].y2 = row[@options.y2.variable]
      if (
        @options.yBand.minVariable != null and
        @options.yBand.maxVariable != null
      )
        @data[key].yMin = row[@options.yBand.minVariable]
        @data[key].yMax = row[@options.yBand.maxVariable]
      if (
        @options.y2Band.minVariable != null and
        @options.y2Band.maxVariable != null
      )
        @data[key].y2Min = row[@options.y2Band.minVariable]
        @data[key].y2Max = row[@options.y2Band.maxVariable]

    # Sort the Data
    @data = @data.sort @sortDatetimeAsc

    # Run Get Definition on Class Construction
    @getDefinition()

    # Responsive Event Listener ######## is this the right spot for this
    ##################### add recalculation when the window changes

    #### window.addEventListener 'resize', Chart.render

    # if window.attachEvent
    #   window.attachEvent 'onresize', ->
    #     alert 'attachEvent - resize'
    #     return
    # else if window.addEventListener
    #   window.addEventListener 'resize', (->
    #     console.log 'addEventListener - resize'
    #     return
    #   ), true
    # else

  getDefinition: ->
    preError = "#{@preError}getDefinition():"
    _ = @

    # Allow Ticks When Large Screen
    if @options.theme isnt 'minimum'
      @options.x.ticks = d3.timeFormat @options.x.format

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
    preError = "#{@preError}calculateChartDims()"

    # Calculate Basic DOM & SVG Dimensions
    width = Math.round($(@options.target).width())
    height = Math.round(width/4)

    if @options.theme is 'minimum'
      margin =
        top: Math.round(height * 0.28)
        right: Math.round(Math.pow(width, 0.6))
        bottom: Math.round(height * 0.18)
        left: Math.round(Math.pow(width, 0.6))
    else
      margin =
        top: Math.round(height * 0.07)
        right: Math.round(Math.pow(width, 0.6))
        bottom: Math.round(height * 0.16)
        left: Math.round(Math.pow(width, 0.6))

    # Basic Dimention
    @definition.dimensions =
      width: width
      stageWidth: (width + 200)
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
    
    @definition.x = d3.scaleTime().range([margin.left, (width-margin.right)])
    @definition.y = d3.scaleLinear().range([(height-margin.bottom),
      (margin.top)])

  calculateAxisDims: (data) ->
    # Shortcut Method to Calculate X & Y-Axis Dims
    preError = "#{@preError}calculateAxisDims(data)"
    @calculateXAxisDims(data)
    @calculateYAxisDims(data)

  calculateXAxisDims: (data) ->
    # Calculate X-Axis Dims
    preError = "#{@preError}calculateXAxisDims(data)"
    
    # Calculate Min & Max X Values
    xmin = if @options.x.min is null then d3.min(data, (d)-> d.x)
    else @parseDate(@options.x.min)-10000
    xmax = if @options.x.max is null then d3.max(data, (d)-> d.x)
    else @parseDate(@options.x.max)
    
    # Insert Values into Definition
    @definition.x.min = xmin
    @definition.x.max = xmax

  calculateYAxisDims: (data) ->
    preError = "#{@preError}calculateYAxisDims(data)"
    
    # Calculate Min & Max Y Values
    yMin = if @options.y.min is null then d3.min(data, (d)-> d.y)
    else @options.y.min
    yMax = if @options.y.max is null then d3.max(data, (d)-> d.y)
    else @options.y.max
    y2Min = if @options.y2.min is null then d3.min(data, (d)-> d.y2)
    else @options.y2.min
    y2Max = if @options.y2.max is null then d3.max(data, (d)-> d.y2)
    else @options.y2.max
    yBandMin = d3.min(data, (d)-> d.yMin)
    yBandMax = d3.max(data, (d)-> d.yMax)
    y2BandMin = d3.min(data, (d)-> d.y2Min)
    y2BandMax = d3.max(data, (d)-> d.y2Max)

    ymin_a = [
      yMin
      y2Min
      yBandMin
      y2BandMin
    ]

    ymax_a = [
      yMax
      y2Max
      yBandMax
      y2BandMax
    ]

    ymin = d3.min(ymin_a)
    ymax = d3.max(ymax_a)

    # Restore Viewability if Y-Min = Y-Max
    ymin = if ymin == ymax then ymin * 0.8 else ymin
    ymax = if ymin == ymax then ymax * 1.2 else ymax

    # Insert Values into Definition
    @definition.y.min = ymin
    @definition.y.max = ymax

  responsive: ->
    # Resize the plot according to current window dimensions.
    preError = "#{@preError}responsive()"
    @calculateChartDims()
    true

  append: ->
    preError = "#{@preError}append()"
    _ = @
    @log "#{preError}", @options

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
    
    # Define the Domains
    @definition.x.domain([@definition.x.min, @definition.x.max])
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()

    # Append the X-Axis
    @svg.append("g")
      .attr("class", "line-plot-axis-x")
      .style("fill", "none")
      .style("stroke", @options.axisColor)
      .call(@definition.xAxis)
      .attr("transform",
        "translate(0, #{@definition.dimensions.bottomPadding})"
      )
            
    # Add Text Labels to X-Axis (Only if Large Scale Theme)
    if @options.theme isnt 'minimum'
      @svg.select(".line-plot-axis-x")
        .selectAll("text")
        .style("font-size", @options.font.size)
        .style("font-weight", @options.font.weight)
      
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
      .on("mouseover", () ->
        _.crosshairs.style("display", null)
        if _.options.y.variable != null
          _.focusCircle.style("display", null)
          _.focusText.style("display", null)
        if _.options.y2.variable != null
          _.focusCircle2.style("display", null)
          _.focusText2.style("display", null)
      )
      .on("mouseout", () ->
        _.crosshairs.style("display", "none")
        if _.options.y.variable != null
          _.focusCircle.style("display", "none")
          _.focusText.style("display", "none")
        if _.options.y2.variable != null
          _.focusCircle2.style("display", "none")
          _.focusText2.style("display", "none")
      )
      .on("mousemove", (d) ->
        mouse = d3.mouse @
        x0 = _.definition.x.invert(mouse[0] +
          _.definition.dimensions.leftPadding)
        if transform
          x0 = _.definition.x.invert(
            transform.invertX(mouse[0] + _.definition.dimensions.leftPadding)
          )
    
        i = _.bisectDate(d, x0, 1)
        min = x0.getMinutes()
        d0 = d[i - 1]
        d1 = d[i]
        d = d0
        d = if min >= 30 then d1 else d0
        # dx = _.definition.x(d.x)
        dx = if transform then transform.applyX(_.definition.x(d.x)) else
          _.definition.x(d.x)
        if _.options.y.variable != null
          dy = _.definition.y(d.y)
          _.focusCircle.attr("transform", "translate(0, 0)")
        if _.options.y2.variable != null
          dy2 = _.definition.y(d.y2)
          _.focusCircle2.attr("transform", "translate(0, 0)")

        cx = dx - _.definition.dimensions.leftPadding
        _.crosshairs.select(".crosshair-x")
          .attr("x1", cx)
          .attr("y1", _.definition.dimensions.topPadding)
          .attr("x2", cx)
          .attr(
            "y2", _.definition.dimensions.innerHeight +
            _.definition.dimensions.topPadding
          )
          .attr("transform",
            "translate(#{_.definition.dimensions.leftPadding}, 0)"
          )

        if _.options.y.variable != null
          _.focusCircle
            .attr("cx", dx)
            .attr("cy", dy)

          _.focusText
            .attr("x", dx + _.definition.dimensions.leftPadding / 10)
            .attr("y", dy - _.definition.dimensions.topPadding / 10)
            .text(d.y.toFixed(1) + " " + "°F")

        if _.options.y2.variable != null
          _.focusCircle2
            .attr("cx", dx)
            .attr("cy", dy2)

          _.focusText2
            .attr("x", dx + _.definition.dimensions.leftPadding / 10)
            .attr("y", dy2 - _.definition.dimensions.topPadding / 10)
            .text(d.y2.toFixed(1) + " " + "°F")
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

    # @calculateAxisDims @data
    @calculateYAxisDims @data
    dtDiff = @definition.x.max - dtOffset
    @log "#{preError} Date Diff Calcs (dtOffset, @def.x.min, dtDiff)",
      dtOffset, @definition.x.max, @dtDiff

    # @definition.x.domain([@definition.x.min, @definition.x.max])
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

    # Redraw the X-Axis
    # @svg.select(".line-plot-axis-x")
    #   .style("font-size", @options.font.size)
    #   .style("font-weight", @options.font.weight)
    #   .transition()
    #   .duration(@options.transitionDuration)
    #   .ease(d3.easeLinear)
    #   .call(@definition.xAxis)

    # Redraw the Y-Axis
    @svg.select(".line-plot-axis-y")
      .style("font-size", @options.font.size)
      .style("font-weight", @options.font.weight)
      .transition()
      .duration(@options.transitionDuration)
      .ease(d3.easeLinear)
      .call(@definition.yAxis)

  @zoomed: () ->
    # Zoom Function
    preError = "#{@preError}.zoomed()"
    @log "#{preError} zoom action occured."
