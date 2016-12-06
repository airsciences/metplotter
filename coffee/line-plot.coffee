#
#   Northwest Avalanche Center (NWAC)
#   Plotter Tools - D3 V.4 Line Plot (line-plot.coffee)
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotter ||= {}

window.Plotter.LinePlot = class LinePlot
  constructor: (plotter, data, options) ->
    @preError = "LinePlot."
    @plotter = plotter
    @initialized = false

    _y = [
      dataLoggerId: null
      variable: null
      ticks: 5
      min: null
      max: null
      maxBarValue: null
      color: "rgb(41, 128, 185)"
      band:
        minVariable: null
        maxVariable: null
    ]

    # Default Configuration
    @defaults =
      plotId: null
      uuid: ''
      debug: true
      target: null
      merge: false
      x:
        variable: null
        format: "%Y-%m-%dT%H:%M:%SZ"
        min: null
        max: null
        ticks: 7
      y: _y
      zoom:
        scale:
          min: 0.05
          max: 5
      aspectDivisor: 5
      transitionDuration: 500
      weight: 2
      axisColor: "rgb(0,0,0)"
      font:
        weight: 100
        size: 12
      crosshairX:
        weight: 1
        color: "rgb(149,165,166)"
      requestInterval:
        data: 336
    if options.x
      options.x = @plotter.lib.mergeDefaults(options.x, @defaults.x)
    if options.y
      options.y = @plotter.lib.mergeDefaults(options.y, @defaults.y)
    @options = @plotter.lib.mergeDefaults options, @defaults
    @device = 'full'

    @links = [
      {"variable": "battery_voltage", "title": "Battery Voltage"},
      {"variable": "temperature", "title": "Temperature"},
      {"variable": "relative_humidity", "title": "Relative Humidity"},
      {"variable": "precitation", "title": "Precipitation"},
      {"variable": "snow_depth", "title": "Snow Depth"},
      {"variable": "wind_direction", "title": "Wind Direction"},
      {"variable": "wind_speed_average", "title": "Wind Speed"},
      {"variable": "net_solar", "title": "Net Solar"},
      {"variable": "solar_pyranometer", "title": "Solar Pyranometer"},
      {"variable": "equip_temperature", "title": "Equipment Temperature"},
      {"variable": "barometric_pressure", "title": "Barometric Pressure"},
      {"variable": "snowfall_24_hour", "title": "24-Hr Snowfall"},
      {"variable": "intermittent_snow", "title": "Intermittent Snow"}
    ]

    # Wrapped Logging Functions
    @log = (log...) ->
    if @options.debug
      @log = (log...) -> console.log(log)

    # Minor Prototype Support Functions
    @parseDate = d3.timeParse(@options.x.format)
    @bisectDate = d3.bisector((d) -> d.x).left
    @sortDatetimeAsc = (a, b) -> a.x - b.x

    # Prepare the Data & Definition
    @data = @processData(data)
    @getDefinition()

    @bands = []
    @lines = []
    @focusCircle = []
    @focusText = []

    # Initialize the State
    _domainScale = null
    _domainMean = null
    if data.length > 0
      _domainScale = @getDomainScale(@definition.x)
      _domainMean = @getDomainMean(@definition.x)

    @state =
      range:
        data: []
        scale: _domainScale
      length:
        data: []
      interval:
        data: []
      zoom: 1
      request:
        data: []
      requested:
        data: []
      mean:
        scale: _domainMean

    if data[0].length > 0
      @setDataState()
      @setIntervalState()
      @setDataRequirement()

  processData: (data) ->
    # Process a data set.
    result = []
    _result = []

    for setId, set of data
      result[setId] = []
      _yOptions = @options.y[setId]
      for key, row of set
        result[setId][key] =
          #x: row[@options.x.variable]
          x: new Date(
            @parseDate(row[@options.x.variable]).getTime() - 8*3600000)
          y: row[_yOptions.variable]
        if _yOptions.band?
          if _yOptions.band.minVariable
            result[setId][key].yMin = row[_yOptions.band.minVariable]
          if _yOptions.band.maxVariable
            result[setId][key].yMax = row[_yOptions.band.maxVariable]

      _result[setId] = new Plotter.Data(result[setId])
      result[setId] = _result[setId]._clean(_result[setId].get())
      result[setId].sort(@sortDatetimeAsc)
    return result

  setData: (data) ->
    # Set the initial data.
    @data = @processData(data)
    @getDefinition()

    # Initialize the State
    _domainScale = null
    _domainMean = null
    if data.length > 0
      _domainScale = @getDomainScale(@definition.x)
      _domainMean = @getDomainMean(@definition.x)

    @state.range.scale = _domainScale
    @state.mean.scale = _domainMean

    if data.length > 0
      @setDataState()
      @setIntervalState()
      @setDataRequirement()

  appendData: (data) ->
    # Append the full data set.
    _data = @processData(data)
    _full = new Plotter.Data(@data)
    _full.append(_data, ["x"])
    @data = _full._clean(_full.get())
    @data = @data.sort(@sortDatetimeAsc)

    # Reset the Data Range
    if @initialized
      @setDataState()
      @setIntervalState()
      @setDataRequirement()

  removeData: (key) ->
    # Removing sub key from data.
    result = []
    for _key, _row of @data
      delete _row[key]
      delete _row[key + "Min"]
      delete _row[key + "Max"]
      result[_key] = _row
    _full = new Plotter.Data(result)
    @data = _full.get()
    @data = @data.sort(@sortDatetimeAsc)

    if @initialized
      @setDataState()
      @setIntervalState()
      @setDataRequirement()

  setDataState: ->
    # Set Data Ranges
    _len = @data.length-1
    for i in [0.._len]
      if @data[i] is undefined
        console.log("data[i] is (i, row)", i, @data[i])
    for key, row of @data
      @state.range.data[key] =
        min: d3.min(@data[key], (d)-> d.x)
        max: d3.max(@data[key], (d)-> d.x)

      # Set Data Length States
      @state.length.data[key] = @data[key].length

  setIntervalState: ->
    # Set the Data Collection Padding Intervals in Hours
    for key, row of @data
      @state.interval.data[key] =
        min: ((@state.range.scale.min.getTime() -
          @state.range.data[key].min.getTime())/3600000)
        max: ((@state.range.data[key].max.getTime() -
          @state.range.scale.max.getTime())/3600000)

  setDataRequirement: ->
    # Calculate how necessary a download, in what direction, and/or data
    _now = new Date()
    _data_max = false

    if @state.range.data.max < _now
      _data_max = @state.interval.data.max < @options.requestInterval.data

    @state.request.data =
      min: @state.interval.data.min < @options.requestInterval.data
      max: _data_max

  setZoomState: (k)->
    @state.zoom = k

  getDomainScale: (axis) ->
    # Calculate the Min & Max Range of an Axis
    result =
      min: axis.domain()[0]
      max: axis.domain()[1]

  getDomainMean: (axis) ->
    # Calculat the Mean of an Axis
    center = new Date(d3.mean(axis.domain()))
    center.setHours(center.getHours() + Math.round(center.getMinutes()/60))
    center.setMinutes(0)
    center.setSeconds(0)
    center.setMilliseconds(0)
    return center

  getDefinition: ->
    preError = "#{@preError}getDefinition():"
    _ = @

    # Define the Definition
    @definition = {}
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
        _.plotter.i.zoom.set(transform)
      )

    @definition.line = d3.line()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y((d) -> _.definition.y(d.y))

    @definition.area = d3.area()
      .defined((d)->
        !isNaN(d.yMin) and d.yMin isnt null and
        !isNaN(d.yMax) and d.yMax isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y0((d) -> _.definition.y(d.yMin))
      .y1((d) -> _.definition.y(d.yMax))

  calculateChartDims: ->
    # Calculate Basic DOM & SVG Dimensions
    width = Math.round($(@options.target).width()) - 24
    height = Math.round(width/@options.aspectDivisor)
    if width > 1000
      margin =
        top: Math.round(height * 0.04)
        right: Math.round(Math.pow(width, 0.3))
        bottom: Math.round(height * 0.12)
        left: Math.round(Math.pow(width, 0.6))
    else if width > 600
      @device = 'mid'
      @options.font.size = @options.font.size/1.25
      height = Math.round(width/(@options.aspectDivisor/1.25))
      margin =
        top: Math.round(height * 0.04)
        right: Math.round(Math.pow(width, 0.3))
        bottom: Math.round(height * 0.14)
        left: Math.round(Math.pow(width, 0.6))
    else
      @device = 'small'
      @options.font.size = @options.font.size/1.5
      height = Math.round(width/(@options.aspectDivisor/1.5))
      margin =
        top: Math.round(height * 0.04)
        right: Math.round(Math.pow(width, 0.3))
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
    @definition.x.min = if @options.x.min is null then d3.min(data[0],
      (d)-> d.x)
    else @parseDate(@options.x.min)
    @definition.x.max = if @options.x.max is null then d3.max(data[0],
      (d)-> d.x)
    else @parseDate(@options.x.max)

  calculateYAxisDims: (data) ->
    # Calculate Min & Max Y Values
    @definition.y.min = 0
    @definition.y.max = 0

    for subId, set of data
      _setMin = d3.min([
        d3.min(set, (d)-> d.y)
        d3.min(set, (d)-> d.yMin)
      ])
      _setMax = d3.max([
        d3.max(set, (d)-> d.y)
        d3.max(set, (d)-> d.yMax)
      ])
      if _setMin < @definition.y.min
        @definition.y.min = _setMin
      if _setMax > @definition.y.max
        @definition.y.max = _setMax

    # Restore Viewability if Y-Min = Y-Max
    if @definition.y.min == @definition.y.max
      @definition.y.min = @definition.y.min * 0.8
      @definition.y.max = @definition.y.min * 1.2

    # Revert to Options
    @definition.y.min = if @options.y[0].min? then @options.y.min
    else @definition.y.min
    @definition.y.max = if @options.y[0].max? then @options.y.max
    else @definition.y.max

  preAppend: ->
    preError = "#{@preError}preAppend()"
    _ = @

    # Create the SVG Div
    @outer = d3.select(@options.target).append("div")
      .attr("class", "line-plot-body")
      .style("width", "#{@definition.dimensions.width}px")
      .style("height", "#{@definition.dimensions.height}px")
      .style("display", "inline-block")

    # Create the Controls Div
    @ctls = d3.select(@options.target).append("div")
      .attr("class", "line-plot-controls")
      .style("width", '23px')
      .style("height", "#{@definition.dimensions.height}px")
      .style("display", "inline-block")
      .style("vertical-align", "top")

    if @data.length == 0
      if @options.type is "station"
        add_text = "Select the Plot's Station"
        sub_text = "Station type plots allow comparison of different variab\
          les from the same station."
      else if @options.type is "parameter"
        add_text = "Select the Plot's Parameter"
        sub_text = "Parameter type plots allow comparison of a single parama\
          ter at multiple stations"
      _offset = $(@options.target).offset()
      @temp = @outer.append("div")
        .attr("class", "new-temp-#{@options.plotId}")
        .style("position", "absolute")
        .style("top",
          "#{parseInt(_offset.top+@definition.dimensions.innerHeight/2-18)}px")
        .style("left",
          "#{parseInt(_offset.left+@definition.dimensions.margin.left)}px")
        .style("width", "#{@definition.dimensions.innerWidth}px")
        .style("text-align", "center")

      @dropdown = @temp.append("div")
        .attr("class", "dropdown")

      @dropdown.append("a")
        .text(add_text)
        .attr("class", "dropdown-toggle")
        .attr("data-toggle", "dropdown")

      @dropdown.append("ul")
        .attr("class", "dropdown-menu")
        .selectAll("li")
        .data(_.links)
        .enter().append("li")
        .append("a")
        .text((d) -> return d.title)
        .on("click", (d) ->
          _.plotter.initVariable(_.options.plotId, d.variable, d.title)
        )

      @temp.append("p")
        .text(sub_text)
        .style("color", "#ggg")
        .style("font-size", "12px")

    # Create the SVG
    @svg = @outer.append("svg")
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

  append: ->
    @initialized = true
    if !@initialized
      return
    preError = "#{@preError}append()"
    _ = @

    # Update the X-Axis
    @svg.select(".line-plot-axis-x")
      .call(@definition.xAxis)

    # Append Axis Label
    _y_title = "#{@options.y[0].title}"
    if @options.y[0].units
      _y_title = "#{_y_title} #{@options.y[0].units}"

    _y_vert = -15
    _y_offset = -52
    if @device == 'small'
      _y_vert = -10
      _y_offset = -30

    # Y-Axis Title
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

    # Append Bands & Line Path
    for key, row of @data
      @bands[key] = @svg.append("g")
        .attr("clip-path", "url(\##{@options.target}_clip)")
        .append("path")
        .datum(row)
        .attr("d", @definition.area)
        .attr("class", "line-plot-area-#{key}")
        .style("fill", @options.y[key].color)
        .style("opacity", 0.15)
        .style("stroke", () ->
          return d3.color(_.options.y[key].color).darker(1)
        )

      @lines[key] = @svg.append("g")
        .attr("clip-path", "url(\##{@options.target}_clip)")
        .append("path")
        .datum(row)
        .attr("d", @definition.line)
        .attr("class", "line-plot-path-#{key}")
        .style("stroke", @options.y[key].color)
        .style("stroke-width",
            Math.round(Math.pow(@definition.dimensions.width, 0.1)))
        .style("fill", "none")

    if @options.y[0].maxBarValue?
      @svg.append("rect")
        .attr("class", "line-plot-max-bar")
        .attr("x", @definition.dimensions.leftPadding)
        .attr("y", @definition.y(32))
        .attr("width", (@definition.dimensions.innerWidth))
        .attr("height", 1)
        .style("color", '#gggggg')
        .style("opacity", 0.4)

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

    for key, row of @data
      # Create Focus Circles and Labels
      @focusCircle[key] = @svg.append("circle")
        .attr("r", 4)
        .attr("class", "focus-circle-#{key}")
        .attr("fill", @options.y[key].color)
        .attr("transform", "translate(-10, -10)")
        .style("display", "none")

      @focusText[key] = @svg.append("text")
        .attr("class", "focus-text-#{key}")
        .attr("x", 9)
        .attr("y", 7)
        .style("display", "none")
        .style("fill", @options.y[key].color)
        .style("text-shadow", "-2px -2px 0 rgb(255,255,255),
          2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255),
          2px 2px 0 rgb(255,255,255)")

    # Append the Crosshair & Zoom Event Rectangle
    @overlay = @svg.append("rect")
      .attr("class", "plot-event-target")

    # Append Crosshair & Zoom Listening Targets
    @appendCrosshairTarget()
    @appendZoomTarget()

  update: ->
    preError = "#{@preError}update()"
    _ = @

    # Pre-Append Data For Smooth transform
    @svg.select(".line-plot-area")
      .datum(@data)
      .attr("d", @definition.area)
      .style("fill", @options.y.color)
      .style("stroke", () ->
        return d3.rgb(_.options.y.color).darker(1)
      )

    @svg.select(".line-plot-path")
      .datum(@data)
      .attr("d", @definition.line)
      .style("stroke", @options.y.color)
      .style("stroke-width",
        Math.round(Math.pow(@definition.dimensions.width, 0.1)))
      .style("fill", "none")

    @overlay.datum(@data)

    @calculateYAxisDims @data
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()

    # Redraw the Bands
    @svg.select(".line-plot-area")
      .datum(@data)
      .attr("d", @definition.area)

    # Redraw the Line Paths
    @svg.select(".line-plot-path")
      .datum(@data)
      .attr("d", @definition.line)

    # Redraw the Y-Axis
    @svg.select(".line-plot-axis-y")
      .call(@definition.yAxis)

  removeTemp: ->
    @temp.remove()

  appendCrosshairTarget: (transform) ->
    # Move Crosshairs and Focus Circle Based on Mouse Location
    if !@initialized
      return
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
      .on("mouseover", () -> _.plotter.i.crosshairs.show())
      .on("mouseout", () -> _.plotter.i.crosshairs.hide())
      .on("mousemove", () ->
        mouse = _.setCrosshair(transform)
        _.plotter.i.crosshairs.set(transform, mouse)
      )

  appendZoomTarget: ->
    if !@initialized
      return
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
    if !@initialized
      return
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
    @setDataState()
    @setIntervalState()
    @setDataRequirement()
    @setZoomState(_transform.k)

    # Redefine & Redraw the Area
    @definition.area = d3.area()
      .defined((d)->
        !isNaN(d.yMin) and d.yMin isnt null and
        !isNaN(d.yMax) and d.yMax isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y0((d) -> _.definition.y(d.yMin))
      .y1((d) -> _.definition.y(d.yMax))

    # Redefine & Redraw the Line Path
    @definition.line = d3.line()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y((d) -> _.definition.y(d.y))

    for key, row of @data
      @svg.select(".line-plot-area-#{key}")
        .attr("d", @definition.area)
      @svg.select(".line-plot-path-#{key}")
        .attr("d", @definition.line)

    @appendCrosshairTarget(_transform)
    return _transform

  setCrosshair: (transform, mouse) ->
    # Set the Crosshair position
    if !@initialized
      return
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

    i = _.bisectDate(_datum[0], x0, 1)
    if x0.getTime() < @state.range.data[0].min.getTime()
      i--
    if x0.getTime() > @state.range.data[0].max.getTime()
      i--
    i = if x0.getMinutes() >= 30 then i else (i - 1)

    dx = if transform then transform.applyX(@definition.x(_datum[0][i].x)) else
      @definition.x(_datum[0][i].x)
    dy = []
    _value = []
    for key, row of @data
      if @options.y[key].variable != null
        _value[key] = _datum[key][i]
        dy[key] = @definition.y(_value[key].y)
        if !isNaN(dy[key])
          @focusCircle[key].attr("transform", "translate(0, 0)")

    cx = dx - _dims.leftPadding
    if cx >= 0
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

    for key, row of @data
      if @options.y[key].variable != null and !isNaN(dy[key])
        @focusCircle[key]
          .attr("cx", dx)
          .attr("cy", dy[key])

        @focusText[key]
          .attr("x", dx + _dims.leftPadding / 10)
          .attr("y", dy[key] - _dims.topPadding / 10)
          .text(if _value[key].y then _value[key].y.toFixed(1) +
            " " + @options.y[key].units)

    # Tooltip Overlap Prevention
    #if (
    #  @options.y.variable != null and
    #  @options.y2.variable != null and
    #  @options.y3.variable != null
    #)
    #  ypos = []
    #  @svg.selectAll('.focus-text')
    #    .attr("transform", (d, i) ->
    #      row =
    #        ind: i
    #        y: parseInt(d3.select(@).attr("y"))
    #        offset: 0
    #      ypos.push(row)
    #      return ""
    #    )
    #    .call((sel) ->
    #      ypos.sort((a, b) -> a.y - b.y)
    #      ypos.forEach ((p, i) ->
    #        if i > 0
    #          offset = Math.max(0, (ypos[i-1].y + 18) - ypos[i].y)
    #          if ypos[i].ind == 0
    #            offset = -offset
    #          ypos[i].offset = offset
    #      )
    #    )
    #    .attr("transform", (d, i) ->
    #      return "translate (0, #{ypos[i].offset})"
    #    )

    return mouse

  showCrosshair: ->
    # Show the Crosshair
    if !@initialized
      return

    @crosshairs.select(".crosshair-x")
      .style("display", null)
    @crosshairs.select(".crosshair-x-under")
      .style("display", null)

    for setId, row of @options.y
      if row.variable != null
        @focusCircle[setId].style("display", null)
          .attr("fill", row.color)
        @focusText[setId].style("display", null)
          .style("color", row.color)
          .style("fill", row.color)

  hideCrosshair: () ->
    # Hide the Crosshair
    if !@initialized
      return

    @crosshairs.select(".crosshair-x")
      .style("display", "none")
    @crosshairs.select(".crosshair-x-under")
      .style("display", "none")

    for setId, row of @options.y
      if row.variable != null
        @focusCircle[setId].style("display", "none")
        @focusText[setId].style("display", "none")

  appendTitle: (title, subtitle) ->
    # Append a Plot Title
    _offsetFactor = 1
    _mainSize = '16px'
    _subSize = '12px'
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
