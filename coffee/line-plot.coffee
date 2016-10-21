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
      dataParams: null
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
          min: 0.3
          max: 5
      visible:
        limit: 2190
      aspectDivisor: 5
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
      requestInterval:
        data: 336
        visible: 168
    if options.x
      options.x = Object.mergeDefaults(options.x, defaults.x)
    if options.y
      options.y = Object.mergeDefaults(options.y, defaults.y)
    if options.y2
      options.y2 = Object.mergeDefaults(options.y2, defaults.y2)
    @options = Object.mergeDefaults options, defaults
    @device = 'full'

    # Wrapped Logging Functions
    @log = (log...) ->
    if @options.debug
      @log = (log...) -> console.log(log)

    # Minor Prototype Support Functions
    @parseDate = d3.timeParse(@options.x.format)
    @bisectDate = d3.bisector((d) -> d.x).left
    @sortDatetimeAsc = (a, b) -> a.x - b.x

    # Prepare the Data & Definition
    _initial = @processData(data.data)
    @data =
      full: _initial.slice(0)
      visible: _initial.slice(0)
    @getDefinition()
    
    # Initialize the State
    @state =
      range:
        data: null
        visible: null
        scale: @getDomainScale(@definition.x)
      length:
        data: null
        visible: null
      interval:
        data: null
        visible: null
      zoom: 1
      request:
        data: null
        visible: null
      mean:
        scale: @getDomainMean(@definition.x)
    @setDataState()
    @setIntervalState()
    @setDataRequirement()

  processData: (data) ->
    # Process a data set.
    result = []
    for key, row of data
      result[key] =
        #x: @parseDate(row[@options.x.variable])
        x: new Date(@parseDate(row[@options.x.variable]).getTime() - 8*3600000)
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
    
    return result.sort(@sortDatetimeAsc)

  appendData: (data) ->
    # Append the full data set.
    for key, row of data
      dtaRow =
        #x: @parseDate(row[@options.x.variable])
        x: new Date(@parseDate(row[@options.x.variable]).getTime() - 8*3600000)
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
      @data.full.push(dtaRow)

    # Sort the Data
    @data.full = @data.full.sort(@sortDatetimeAsc)
    
    console.log("LinePlot.appendData(data) (@data)", @data)
    
    # Reset the Data Range
    @setDataState()
    @setIntervalState()
    @setDataRequirement()
    
  appendVisible: (key, length) ->
    _min = key
    _max = (key + length)
    if length < 0
      _min = (key + length)
      _max = key
    _append = @data.full.slice(_min, _max)
    # console.log("Appending... (_min, _max, _append)", _min, _max, _append)
    @data.visible = @data.visible.concat(_append)
    @data.visible.sort(@sortDatetimeAsc)
    
    @update()
    
    @setDataState()
    @setIntervalState()
    @setDataRequirement()
    
  setVisibleData: ->
    # Set the Visible Data to a Selection of @data.full
    preError = "#{@preError}setVisibleData()"
    
    if @state.request.visible.min
      _min = @data.visible[0]
      for key, row of @data.full
        if row.x == _min.x
          _data_key = parseInt(key)
          break
       if _data_key > 0
         @appendVisible(_data_key,
           parseInt(-1*@options.requestInterval.visible))
    if @state.request.visible.max
      _max = @data.visible[@data.visible.length - 1]
      for key, row of @data.full
        if row.x == _max.x
          _data_key = parseInt(key)
          break
       if _data_key > 0
         @appendVisible(_data_key,
           parseInt(@options.requestInterval.visible))
    if @state.length.visible > @options.visible.limit
      for key, row of @data.visible
        if row.x == @state.mean.scale
          _mid_key = parseInt(key)
          break
      console.log("Plot Exceeds Visible Limit! (_mid_key, mean, row.x)",
        _mid_key, @state.mean.scale)

  setDataState: ->
    # Set Data Ranges
    @state.range.data =
      min: d3.min(@data.full, (d)-> d.x)
      max: d3.max(@data.full, (d)-> d.x)
    @state.range.visible =
      min: d3.min(@data.visible, (d)-> d.x)
      max: d3.max(@data.visible, (d)-> d.x)
    # Set Data Length States
    @state.length.data = @data.full.length
    @state.length.visible = @data.visible.length

  setIntervalState: ->
    # Set the Data Collection Padding Intervals in Hours
    @state.interval.visible =
      min: ((@state.range.scale.min.getTime() -
        @state.range.visible.min.getTime())/3600000)
      max: ((@state.range.visible.max.getTime() -
        @state.range.scale.max.getTime())/3600000)
    @state.interval.data =
      min: ((@state.range.scale.min.getTime() -
        @state.range.data.min.getTime())/3600000)
      max: ((@state.range.data.max.getTime() -
        @state.range.scale.max.getTime())/3600000)

  setDataRequirement: ->
    # Calculate how necessary a download, in what direction, and visible or data
    @state.request.data =
      min: @state.interval.data.min < @options.requestInterval.data
      max: @state.interval.data.max < @options.requestInterval.data
    @state.request.visible =
      min: @state.interval.visible.min < @options.requestInterval.visible
      max: @state.interval.visible.max < @options.requestInterval.visible

  setZoomState: (k)->
    @state.zoom = k

  getDomainScale: (axis) ->
    # Calculate the Min & Max Range of an Axis
    result =
      min: axis.domain()[0]
      max: axis.domain()[1]

  getDomainMean: (axis) ->
    # Calculat the Mean of an Axis
    new Date(d3.mean(axis.domain()))

  getDefinition: ->
    preError = "#{@preError}getDefinition():"
    _ = @

    # Define the Definition
    @definition =
      colorScale: d3.schemeCategory20
    @calculateChartDims()
    @calculateAxisDims(@data.full)

    # Define D3 Methods
    @definition.xAxis = d3.axisBottom().scale(@definition.x)
      .ticks(Math.round($(@options.target).width() / 100))
    @definition.yAxis = d3.axisLeft().scale(@definition.y)
      .ticks(@options.y.ticks)
      
    # Define the Domains
    @definition.x.domain([@definition.x.min, @definition.x.max])
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()
    
    # Define the Zoom Method
    _extent = [
        [-Infinity, 0],
        [(@definition.x(new Date())),
        @definition.dimensions.innerHeight]
    ]
    @definition.zoom = d3.zoom()
      .scaleExtent([@options.zoom.scale.min, @options.zoom.scale.max])
      .translateExtent(_extent)
      .on("zoom", () ->
        transform = _.setZoomTransform()
        plotter.zoom(transform)
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
    height = Math.round(width/@options.aspectDivisor)
    if width > 1000
      margin =
        top: Math.round(height * 0.04)
        right: Math.round(Math.pow(width, 0.6))
        bottom: Math.round(height * 0.08)
        left: Math.round(Math.pow(width, 0.6))
    else if width > 600
      @device = 'mid'
      @options.font.size = @options.font.size/1.25
      height = Math.round(width/(@options.aspectDivisor/1.25))
      margin =
        top: Math.round(height * 0.04)
        right: Math.round(Math.pow(width, 0.6))
        bottom: Math.round(height * 0.12)
        left: Math.round(Math.pow(width, 0.6))
    else
      @device = 'small'
      @options.font.size = @options.font.size/1.5
      height = Math.round(width/(@options.aspectDivisor/1.5))
      margin =
        top: Math.round(height * 0.04)
        right: Math.round(Math.pow(width, 0.6))
        bottom: Math.round(height * 0.18)
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
      d3.min(data, (d)-> d.y)
      d3.min(data, (d)-> d.y2)
      d3.min(data, (d)-> d.yMin)
      d3.min(data, (d)-> d.y2Min)
    ])
    
    @definition.y.max = d3.max([
      d3.max(data, (d)-> d.y)
      d3.max(data, (d)-> d.y2)
      d3.max(data, (d)-> d.yMax)
      d3.max(data, (d)-> d.y2Max)
    ])

    # Restore Viewability if Y-Min = Y-Max
    if @definition.y.min == @definition.y.max
      @definition.y.min = @definition.y.min * 0.8
      @definition.y.max = @definition.y.min * 1.2
     
    # Revert to Options
    @definition.y.min = if @options.y.min is null then @definition.y.min
    else @options.y.min
    @definition.y.max = if @options.y.max is null then @definition.y.max
    else @options.y.max

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
      .style("font-size", @options.font.size)
      .style("font-weight", @options.font.weight)
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
     
    # Append Axis Label
    _y_title = "#{@options.y.title}"
    if @options.y.units
      _y_title = "#{_y_title} #{@options.y.units}"
    
    _y_vert = -95
    _y_offset = -46
    if @device == 'small'
      _y_vert = -50
      _y_offset = -30
      
    @svg.select(".line-plot-axis-y")
      .append("text")
      .text(_y_title)
      .attr("class", "line-plot-y-label")
      .attr("x", _y_vert)
      .attr("y", _y_offset)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .style("font-size", @options.font.size)
      .style("font-weight", @options.font.weight)

    if @options.y2.title
      _y2_title = "#{_y2_title} #{@options.y2.title}"
      
    if @options.y2.units
      _y2_title = "#{_y2_title} #{@options.y2.units}"

    # Append Bands
    if (
      @options.yBand.minVariable != null and
      @options.yBand.maxVariable != null
    )
      @lineband = @svg.append("g")
        .attr("clip-path", "url(\##{@options.target}_clip)")
        .append("path")
        .datum(@data.visible)
        .attr("d", @definition.area)
        .attr("class", "line-plot-area")
        .style("fill", @options.line1Color)
        .style("opacity", 0.15)
        .style("stroke", () ->
          return d3.color(_.options.line1Color).darker(1)
        )

    if (
      @options.y2Band.minVariable != null and
      @options.y2Band.maxVariable != null
    )
      @lineband2 = @svg.append("g")
        .attr("clip-path", "url(\##{@options.target}_clip)")
        .append("path")
        .datum(@data.visible)
        .attr("d", @definition.area2)
        .attr("class", "line-plot-area2")
        .style("fill", @options.line2Color)
        .style("opacity", 0.25)
        .style("stroke", () ->
          return d3.rgb(_.options.line2Color).darker(1)
        )

    # Append the Line Paths
    @svg.append("g")
      .attr("clip-path", "url(\##{@options.target}_clip)")
      .append("path")
      .datum(@data.visible)
      .attr("d", @definition.line)
      .attr("class", "line-plot-path")
      .style("stroke", @options.line1Color)
      .style("stroke-width",
          Math.round(Math.pow(@definition.dimensions.width, 0.1)))
      .style("fill", "none")

    @svg.append("g")
      .attr("clip-path", "url(\##{@options.target}_clip)")
      .append("path")
      .datum(@data.visible)
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
      .style("stroke-dasharray", ("3, 3"))
      .style("fill", "none")
      
    # Create the Focus Label Underlay
    @crosshairs.append("rect")
      .attr("class", "crosshair-x-under")
      .style("fill", "rgb(255,255,255)")
      .style("opacity", 0.1)

    # Create Focus Circles and Labels
    if @options.y.variable != null
      @focusCircle = @svg.append("circle")
        .attr("r", 4)
        .attr("id", "focus-circle-1")
        .attr("class", "focus-circle")
        .attr("fill", @options.line1Color)
        .attr("transform", "translate(-10, -10)")

      @focusText = @svg.append("text")
        .attr("id", "focus-text-1")
        .attr("class", "focus-text")
        .attr("x", 9)
        .attr("y", 7)
        .style("fill", @options.line1Color)
        .style("text-shadow", "-2px -2px 0 rgb(255,255,255),
          2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255),
          2px 2px 0 rgb(255,255,255)")

    if @options.y2.variable != null
      @focusCircle2 = @svg.append("circle")
        .attr("r", 4)
        .attr("id", "focus-circle-2")
        .attr("class", "focus-circle")
        .attr("fill", @options.line2Color)
        .attr("transform", "translate(-10, -10)")

      @focusText2 = @svg.append("text")
        .attr("id", "focus-text-2")
        .attr("class", "focus-text")
        .attr("x", 9)
        .attr("y", 7)
        .style("fill", @options.line2Color)
        .style("text-shadow", "-2px -2px 0 rgb(255,255,255),
          2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255),
          2px 2px 0 rgb(255,255,255)")

    # Append the Crosshair & Zoom Event Rectangle
    @overlay = @svg.append("rect")
      .attr("class", "plot-event-target")
      
    # Append Crosshair & Zoom Listening Targets
    @appendCrosshairTarget()
    @appendZoomTarget()

  update: () ->
    preError = "#{@preError}update()"
    _ = @

    # Pre-Append Data For Smooth transform
    @svg.select(".line-plot-area")
      .datum(@data.visible)
      .attr("d", @definition.area)

    @svg.select(".line-plot-area2")
      .datum(@data.visible)
      .attr("d", @definition.area2)

    @svg.select(".line-plot-path")
      .datum(@data.visible)
      .attr("d", @definition.line)

    @svg.select(".line-plot-path2")
      .datum(@data.visible)
      .attr("d", @definition.line2)

    @overlay.datum(@data.visible)

    @calculateYAxisDims @data.visible
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()

    # Redraw the Bands
    @svg.select(".line-plot-area")
      .datum(@data.visible)
      #.transition()
      #.duration(@options.transitionDuration)
      .attr("d", @definition.area)

    @svg.select(".line-plot-area2")
      .datum(@data.visible)
      #.transition()
      #.duration(@options.transitionDuration)
      .attr("d", @definition.area2)

    # Redraw the Line Paths
    @svg.select(".line-plot-path")
      .datum(@data.visible)
      #.transition()
      #.duration(@options.transitionDuration)
      .attr("d", @definition.line)

    @svg.select(".line-plot-path2")
      .datum(@data.visible)
      #.transition()
      #.duration(@options.transitionDuration)
      .attr("d", @definition.line2)

    # Redraw the Y-Axis
    @svg.select(".line-plot-axis-y")
      #.style("font-size", @options.font.size)
      #.style("font-weight", @options.font.weight)
      #.transition()
      #.duration(@options.transitionDuration)
      #.ease(d3.easeLinear)
      .call(@definition.yAxis)
          
  appendCrosshairTarget: (transform) ->
    # Move Crosshairs and Focus Circle Based on Mouse Location
    preError = "#{@preError}appendCrosshairTarget()"
    _ = @
    
    @overlay.datum(@data.visible)
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
      
  setZoomTransform: (transform) ->
    # Set the current zoom transform state.
    preError = "#{@preError}.setZoomTransform(transform)"
    _ = @
    _transform = if transform then transform else d3.event.transform
    
    # Zoom the X-Axis
    _rescaleX = _transform.rescaleX(@definition.x)
    @svg.select(".line-plot-axis-x").call(
      @definition.xAxis.scale(_rescaleX)
    )
    
    # Set the scaleRange
    @state.range.scale = @getDomainScale(_rescaleX)
    @state.mean.scale = @getDomainMean(_rescaleX)
    @setIntervalState()
    @setDataRequirement()
    @setZoomState(_transform.k)

    # Redefine & Redraw the Area
    @definition.area = d3.area()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y0((d) -> _.definition.y(d.yMin))
      .y1((d) -> _.definition.y(d.yMax))
      .curve(d3.curveMonotoneX)

    @svg.select(".line-plot-area")
      .attr("d", @definition.area)

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

    # Redefine & Redraw the Area2
    @definition.area2 = d3.area()
      .defined((d)->
        !isNaN(d.y2Max) and d.y2Max isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y0((d) -> _.definition.y(d.y2Min))
      .y1((d) -> _.definition.y(d.y2Max))
      .curve(d3.curveMonotoneX)
     
    @svg.select(".line-plot-area2")
      .attr("d", @definition.area2)

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
    return _transform

  setCrosshair: (transform, mouse) ->
    # Set the Crosshair position
    preError = "#{@preError}.setCrosshair(mouse)"
    _ = @
    _dims = @definition.dimensions
    
    _mouseTarget = @overlay.node()
    _datum = @overlay.datum()
    mouse = if mouse then mouse else d3.mouse(_mouseTarget)
    
    x0 = @definition.x.invert(mouse[0] + _dims.leftPadding)
    if transform
      x0 = @definition.x.invert(
        transform.invertX(mouse[0] + _dims.leftPadding)
      )
    i = _.bisectDate(_datum, x0, 1)
    d = if x0.getMinutes() >= 30 then _datum[i] else _datum[i - 1]
    if x0.getTime() < @state.range.visible.min.getTime()
      d = _datum[i - 1]
    if x0.getTime() > @state.range.visible.max.getTime()
      d = _datum[i - 1]
     
    dx = if transform then transform.applyX(@definition.x(d.x)) else
      @definition.x(d.x)
    if @options.y.variable != null
      dy = @definition.y(d.y)
      @focusCircle.attr("transform", "translate(0, 0)")
    if @options.y2.variable != null
      dy2 = @definition.y(d.y2)
      @focusCircle2.attr("transform", "translate(0, 0)")

    cx = dx - _dims.leftPadding
    @crosshairs.select(".crosshair-x")
      .attr("x1", cx)
      .attr("y1", _dims.topPadding)
      .attr("x2", cx)
      .attr("y2", _dims.innerHeight + _dims.topPadding)
      .attr("transform", "translate(#{_dims.leftPadding}, 0)")
       
    @crosshairs.select(".crosshair-x-under")
      .attr("x", cx)
      .attr("y", _dims.topPadding)
      .attr("width", (_dims.innerWidth - cx))
      .attr("height", _dims.innerHeight)
      .attr("transform", "translate(#{_dims.leftPadding}, 0)")

    if @options.y.variable != null
      @focusCircle
        .attr("cx", dx)
        .attr("cy", dy)

      @focusText
        .attr("x", dx + _dims.leftPadding / 10)
        .attr("y", dy - _dims.topPadding / 10)
        .text(d.y.toFixed(2) + " " + @options.y.units)

    if @options.y2.variable != null
      @focusCircle2
        .attr("cx", dx)
        .attr("cy", dy2)

      @focusText2
        .attr("x", dx + _dims.leftPadding / 10)
        .attr("y", dy2 - _dims.topPadding / 10)
        .text(d.y2.toFixed(2) + " " + @options.y2.units)

    # Tooltip Overlap Prevention
    if @options.y.variable != null and @options.y2.variable != null
      ypos = []
      @svg.selectAll('.focus-text')
        .attr("transform", (d, i) ->
          row =
            ind: i
            y: parseInt(d3.select(@).attr("y"))
            offset: 0
          ypos.push(row)
          return ""
        )
        .call((sel) ->
          ypos.sort((a, b) -> a.y - b.y)
          ypos.forEach ((p, i) ->
            if i > 0
              offset = Math.max(0, (ypos[i-1].y + 18) - ypos[i].y)
              if ypos[i].ind == 0
                offset = -offset
              ypos[i].offset = offset
          )
        )
        .attr("transform", (d, i) ->
          return "translate (0, #{ypos[i].offset})"
        )
    
    return mouse
    
  showCrosshair: ->
    # Show the Crosshair
    @crosshairs.select(".crosshair-x")
      .style("display", null)
      
    @crosshairs.select(".crosshair-x-under")
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
    
    @crosshairs.select(".crosshair-x-under")
      .style("display", "none")
    
    if @options.y.variable != null
      @focusCircle.style("display", "none")
      @focusText.style("display", "none")
    
    if @options.y2.variable != null
      @focusCircle2.style("display", "none")
      @focusText2.style("display", "none")

  appendTitle: (title, subtitle) ->
    # Append a Plot Title
    _offsetFactor = 1
    _mainSize = '16px'
    _subSize = '12px'
    # if @device = 'mid'
    #   _offsetFactor = 0.6
    #   _mainSize = '12px'
    #   _subSize = '8px'
    if @device == 'small'
      _offsetFactor = 0.4
      _mainSize = '10px'
      _subSize = '7px'
    
    @title = @svg.append("g")
      .attr("class", "line-plot-title")
      
    @title.append("text")
      .attr("x", (@definition.dimensions.margin.left + 10))
      .attr("y", (@definition.dimensions.margin.top / 2 - (4*_offsetFactor)))
      .style("font-size", _mainSize)
      .style("font-weight", 600)
      .text(title)
    
    if subtitle
      @title.append("text")
        .attr("x", (@definition.dimensions.margin.left + 10))
        .attr("y", (@definition.dimensions.margin.top / 2 + (12*_offsetFactor)))
        .style("font-size", _subSize)
        .text(subtitle)

  getState: ->
    # Return the Current Plot state.
    return @state
