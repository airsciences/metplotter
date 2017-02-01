#
#   Northwest Avalanche Center (NWAC)
#   Plotter Tools - D3 V.4 Line Plot (bar-plot.coffee)
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotter ||= {}

window.Plotter.BarPlot = class BarPlot
  constructor: (plotter, data, options) ->
    @preError = "BarPlot."
    @plotter = plotter
    @initialized = false

    _y = [
      dataLoggerId: null
      variable: null
      ticks: 5
      min: null
      max: null
      maxBar: null
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
      width: null
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
      focusX:
        color: "rgb(52, 52, 52)"
      crosshairX:
        weight: 1
        color: "rgb(149,165,166)"
      requestInterval: 336
    if options.x
      options.x = @plotter.lib.mergeDefaults(options.x, @defaults.x)
    options.y[0] = @plotter.lib.mergeDefaults(options.y[0], @defaults.y[0])
    @options = @plotter.lib.mergeDefaults(options, @defaults)
    @device = 'full'
    @transform = d3.zoomIdentity

    @links = [
      {"variable": "battery_voltage", "title": "Battery Voltage"},
      {"variable": "temperature", "title": "Temperature"},
      {"variable": "relative_humidity", "title": "Relative Humidity"},
      {"variable": "precipitation", "title": "Precipitation"},
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
    @displayDate = d3.timeFormat("%b. %e, %I:%M %p")
    @sortDatetimeAsc = (a, b) -> a.x - b.x

    # Prepare the Data & Definition
    @data = @processData(data)
    @getDefinition()

    @bars = []
    @focusRect = []
    @focusText = []
    @skipBandDomainSet = false

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

    for setId, set of data
      result[setId] = @processDataSet(set, setId)
    return result

  processDataSet: (data, dataSetId) ->
    # Process a single set of data (Flat, versus 2-Level in processData)
    _yOptions = @options.y[dataSetId]
    result = []

    for key, row of data
      result[key] =
        #x: row[@options.x.variable]
        x: new Date(
          @parseDate(row[@options.x.variable]).getTime() - 8*3600000)
        y: row[_yOptions.variable]
      if _yOptions.band?
        if _yOptions.band.minVariable
          result[key].yMin = row[_yOptions.band.minVariable]
        if _yOptions.band.maxVariable
          result[key].yMax = row[_yOptions.band.maxVariable]

    _result = new Plotter.Data(result)
    result = _result._clean(_result.get())
    return result.sort(@sortDatetimeAsc)

  setData: (data) ->
    # Set the initial data.
    @data = [@processDataSet(data, 0)]
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

  addData: (data, dataSetId) ->
    # Set the initial data.
    @data[dataSetId] = @processDataSet(data, dataSetId)
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

  appendData: (data, dataSetId) ->
    # Append the full data set.
    _data = @processDataSet(data, dataSetId)
    _set = new window.Plotter.Data(@data[dataSetId])
    _set.append(_data, ["x"])
    @data[dataSetId] = _set._clean(_set.get())
    @data[dataSetId] = @data[dataSetId].sort(@sortDatetimeAsc)

    # Reset the Data Range
    if @initialized
      @setDataState()
      @setIntervalState()
      @setDataRequirement()

  removeData: (key) ->
    # Removing sub key from data.
    if key >= 0
      delete @data[key]
      delete @options[key]

      @svg.select(".bar-plot-area-#{key}").remove()
      @svg.select(".bar-plot-path-#{key}").remove()
      @svg.select(".focus-rect-#{key}").remove()
      @svg.select(".focus-text-#{key}").remove()

      if @initialized
        @setDataState()
        @setIntervalState()
        @setDataRequirement()

  setDataState: ->
    # Set Data Ranges
    _len = @data.length-1
    # for i in [0.._len]
    #   if @data[i] is undefined
    #     console.log("data[i] is (i, row)", i, @data[i])
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

    for key, row of @data
      _data_max = @state.interval.data[key].max <
        @options.requestInterval

      @state.request.data[key] =
        min: @state.interval.data[key].min < @options.requestInterval
        max: _data_max

      if !(@state.requested.data[key]?)
        @state.requested.data[key] =
          min: false
          max: false

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
      .ticks(@options.y[0].ticks)

    # Define the Domains
    @definition.x.domain([@definition.x.min, @definition.x.max])
    if !@skipBandDomainSet
      @definition.x1.domain(@data[0].map((d) -> d.x))
      @skipBandDomainSet = false
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()

    # Define the Zoom Method
    _extent = [
        [-Infinity, 0],
        [(@definition.x(new Date()) + @definition.dimensions.margin.left),
        @definition.dimensions.innerHeight]
    ]
    @definition.zoom = d3.zoom()
      .scaleExtent([@options.zoom.scale.min, @options.zoom.scale.max])
      .translateExtent(_extent)
      .on("zoom", () ->
        transform = _.setZoomTransform()
        _.plotter.i.zoom.set(transform)
      )

  setBandDomain: (bandDomain) ->
    @definition.x1 = bandDomain

  calculateChartDims: ->
    # Calculate Basic DOM & SVG Dimensions
    if @options.width?
      width = Math.round(@options.width)
    else
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
      _height = @options.aspectDivisor/1.25
      height = Math.round(width/_height)
      margin =
        top: Math.round(height * 0.04)
        right: Math.round(Math.pow(width, 0.3))
        bottom: Math.round(height * 0.14)
        left: Math.round(Math.pow(width, 0.6))
    else
      @device = 'small'
      @options.font.size = @options.font.size/1.5
      _height = @options.aspectDivisor/1.5
      height = Math.round(width/_height)
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
    @definition.x1 = d3.scaleBand()
      .rangeRound([margin.left, (width-margin.right)], 0.05)
      .padding(0.1)
    @definition.y = d3.scaleLinear().range([(height-margin.bottom),
      (margin.top)])

  calculateAxisDims: (data) ->
    @calculateXAxisDims(data)
    @calculateYAxisDims(data)

  calculateXAxisDims: (data) ->
    # Calculate Min & Max X Values
    if @options.x.min is null
      @definition.x.min = d3.min(data[0], (d)-> d.x)
    else
      @definition.x.min = @parseDate(@options.x.min)
    if @options.x.max is null
      @definition.x.max = d3.max(data[0], (d)-> d.x)
    else
      @definition.x.max = @parseDate(@options.x.max)

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
      if _setMin < @definition.y.min or @definition.y.min is undefined
        @definition.y.min = _setMin
      if _setMax > @definition.y.max or @definition.y.max is undefined
        @definition.y.max = _setMax

    # Restore Viewability if Y-Min = Y-Max
    if @definition.y.min == @definition.y.max
      @definition.y.min = @definition.y.min * 0.8
      @definition.y.max = @definition.y.min * 1.2

    # Revert to Options
    if @options.y[0].min?
      @definition.y.min = @options.y[0].min
    if @options.y[0].max?
      @definition.y.max = @options.y[0].max

  preAppend: ->
    preError = "#{@preError}preAppend()"
    _ = @

    # Create the SVG Div
    @outer = d3.select(@options.target).append("div")
      .attr("class", "bar-plot-body")
      .style("width", "#{@definition.dimensions.width}px")
      .style("height", "#{@definition.dimensions.height}px")
      .style("display", "inline-block")

    # Create the Controls Div
    @ctls = d3.select(@options.target).append("div")
      .attr("class", "plot-controls")
      .style("width", '23px')
      .style("height", "#{@definition.dimensions.height}px")
      .style("display", "inline-block")
      .style("vertical-align", "top")

    #if @data[0].length == 0
    #  if @options.type is "station"
    #    add_text = "Select the Plot's Station"
    #    sub_text = "Station type plots allow comparison of different variab\
    #      les from the same station."
    #  else if @options.type is "parameter"
    #    add_text = "Select the Plot's Parameter"
    #    sub_text = "Parameter type plots allow comparison of a single parama\
    #      ter at multiple stations"
    #  _offset = $(@options.target).offset()
    #  @temp = @outer.append("div")
    #    .attr("class", "new-temp-#{@options.plotId}")
    #    .style("position", "Relative")
    #    .style("top",
    #      "#{parseInt(@definition.dimensions.innerHeight/1.74)}px")
    #    .style("left",
    #      "#{parseInt(@definition.dimensions.innerWidth/6.5)}px")
    #    .style("width", "#{@definition.dimensions.innerWidth}px")
    #    .style("text-align", "center")

    #  @temp.append("p")
    #    .text(sub_text)
    #    .style("color", "#ggg")
    #    .style("font-size", "12px")

    # Create the SVG
    @svg = @outer.append("svg")
      .attr("class", "bar-plot")
      .attr("width", @definition.dimensions.width)
      .attr("height", @definition.dimensions.height)

    # Append a Clip Path
    @svg.append("defs")
      .append("clipPath")
      .attr("id", "line-plot-clip-path")
      .append("rect")
      .attr("width", @definition.dimensions.innerWidth)
      .attr("height", @definition.dimensions.innerHeight)
      .attr("transform",
        "translate(#{@definition.dimensions.leftPadding},
        #{@definition.dimensions.topPadding})"
      )

    # Append the X-Axis
    @svg.append("g")
      .attr("class", "bar-plot-axis-x")
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
      .attr("class", "bar-plot-axis-y")
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
    @svg.select(".bar-plot-axis-x")
      .call(@definition.xAxis)

    @svg.select(".bar-plot-axis-y")
      .call(@definition.yAxis)

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
    @svg.select(".bar-plot-axis-y")
      .append("text")
      .text(_y_title)
      .attr("class", "bar-plot-y-label")
      .attr("x", _y_vert)
      .attr("y", _y_offset)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .style("font-size", @options.font.size)
      .style("font-weight", @options.font.weight)

    # Append Bands & Bar Path
    @barWrapper = @svg.append("g")
      .attr("class", "bar-wrapper")
    for key, row of @data
      @bars[key] = @barWrapper.append("g")
        .attr("clip-path", "url(\#line-plot-clip-path)")
        .selectAll(".bar-#{key}")
        .data(row)
        .enter()
        .append("rect")
        .attr("class", "bar-#{key}")
        .attr("x", (d) -> _.definition.x(d.x))
        .attr("width", d3.max([1, @definition.x1.bandwidth()]))
        .attr("y", (d) -> _.definition.y(d.y))
        .attr("height", (d) ->
          _.definition.dimensions.innerHeight +
          _.definition.dimensions.margin.top - _.definition.y(d.y)
        )
        .style("fill", @options.y[key].color)

    if @options.y[0].maxBar?
      @barWrapper.append("rect")
        .attr("class", "bar-plot-max-bar")
        .attr("x", @definition.dimensions.leftPadding)
        .attr("y", @definition.y(@options.y[0].maxBar))
        .attr("width", (@definition.dimensions.innerWidth))
        .attr("height", 1)
        .style("color", '#gggggg')
        .style("opacity", 0.4)

    @hoverWrapper = @svg.append("g")
      .attr("class", "hover-wrapper")

    # Create Crosshairs
    @crosshairs = @hoverWrapper.append("g")
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

    @focusDateText = @hoverWrapper.append("text")
      .attr("class", "focus-date-text")
      .attr("x", 9)
      .attr("y", 7)
      .style("display", "none")
      .style("fill", "#000000")
      .style("text-shadow", "-2px -2px 0 rgb(255,255,255),
        2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255),
        2px 2px 0 rgb(255,255,255)")

    for key, row of @data
      # Create Focus Circles and Labels
      @focusRect[key] = @hoverWrapper.append("rect")
        .attr("width", @definition.x1.bandwidth())
        .attr("height", 2)
        .attr("class", "focus-rect-#{key}")
        .attr("fill", @options.focusX.color)
        #.attr("fill", @options.y[key].color)
        .attr("transform", "translate(-10, -10)")
        .style("display", "none")
        .style("stroke", "rgb(255,255,255)")
        .style("opacity", 0.75)

      @focusText[key] = @hoverWrapper.append("text")
        .attr("class", "focus-text-#{key}")
        .attr("x", 11)
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
    @appendCrosshairTarget(@transform)
    @appendZoomTarget(@transform)

  update: ->
    preError = "#{@preError}update()"
    _ = @

    _rescaleX = @transform.rescaleX(@definition.x)
    _bandwidth = Math.floor(@transform.k * @definition.x1.bandwidth())

    # Pre-Append Data For Smooth transform
    for key, row of @data
      if row? and _.options.y[key]?
        if @svg.selectAll(".bar-#{key}").node()[0] is null
          console.log("Adding new BarPlot data set.")
          @bars[key] = @barWrapper.append("g")
            .attr("clip-path", "url(\#line-plot-clip-path)")
            .selectAll(".bar-#{key}")
            .data(row)
            .enter()
            .append("rect")
            .attr("class", "bar-#{key}")
            .attr("x", (d) -> _rescaleX(d.x))
            .attr("width", d3.max([1, _bandwidth]))
            #.attr("x", (d) -> _.definition.x(d.x))
            #.attr("width", d3.max([1, @definition.x1.bandwidth()]))
            .attr("y", (d) -> _.definition.y(d.y))
            .attr("height", (d) ->
              _.definition.dimensions.innerHeight +
              _.definition.dimensions.margin.top - _.definition.y(d.y)
            )
            .style("fill", @options.y[key].color)

          # Create Focus Circles and Labels
          @focusRect[key] = @hoverWrapper.append("rect")
            .attr("width", @definition.x1.bandwidth())
            .attr("height", 2)
            .attr("class", "focus-rect-#{key}")
            .attr("fill", @options.focusX.color)
            #.attr("fill", @options.y[key].color)
            .attr("transform", "translate(-10, -10)")
            .style("display", "none")
            .style("stroke", "rgb(255,255,255)")
            .style("opacity", 0.75)

          @focusText[key] = @hoverWrapper.append("text")
            .attr("class", "focus-text-#{key}")
            .attr("x", 11)
            .attr("y", 7)
            .style("display", "none")
            .style("fill", @options.y[key].color)
            .style("text-shadow", "-2px -2px 0 rgb(255,255,255),
              2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255),
              2px 2px 0 rgb(255,255,255)")
        else
          # Update Data
          @bars[key] = @barWrapper.select("g")
            .selectAll(".bar-#{key}")
            .data(row)

          # Append new rect.
          @bars[key].enter()
            .append("rect")
            .attr("class", "bar-#{key}")
            .attr("x", (d) -> _rescaleX(d.x))
            .attr("width", d3.max([1, _bandwidth]))
            #.attr("x", (d) -> _.definition.x(d.x))
            #.attr("width", d3.max([1, @definition.x1.bandwidth()]))
            .attr("y", (d) -> _.definition.y(d.y))
            .attr("height", (d) ->
              _.definition.dimensions.innerHeight +
              _.definition.dimensions.margin.top - _.definition.y(d.y)
            )
            .style("fill", @options.y[key].color)

          # Remove deleted rect.
          @bars[key].exit()
            .remove()

          # transitionDurationbar
          @bars[key].attr("x", (d) -> _rescaleX(d.x))
            .attr("width", d3.max([1, _bandwidth]))
            #.attr("x", (d) -> _.definition.x(d.x))
            #.attr("width", d3.max([1, @definition.x1.bandwidth()]))
            .attr("y", (d) -> _.definition.y(d.y))
            .attr("height", (d) ->
              _.definition.dimensions.innerHeight +
              _.definition.dimensions.margin.top - _.definition.y(d.y)
            )

    # Reset the overlay to last position.
    @overlay.remove()
    @overlay = @svg.append("rect")
      .attr("class", "plot-event-target")
    @appendCrosshairTarget(@transform)
    @appendZoomTarget(@transform)

    @calculateYAxisDims(@data)
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()

    #_rescaleX = @transform.rescaleX(@definition.x)
    #for key, row of @data
    #  # Redraw the Bars
    #  @svg.selectAll(".bar-#{key}")
    #    .attr("x", (d) -> _rescaleX(d.x))
    #    .attr("width", Math.floor(@transform.k * @definition.x1.bandwidth()))

    # Redraw the Y-Axis
    @svg.select(".bar-plot-axis-y")
      .call(@definition.yAxis)

    if @options.y[0].maxBar?
      @barWrapper.select(".bar-plot-max-bar")
        .attr("y", @definition.y(@options.y[0].maxBar))

    # Reset the zoom state
    @setZoomTransform(@transform)

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

  appendZoomTarget: (transform) ->
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

    @svg.call(@definition.zoom, transform)

  setZoomTransform: (transform) ->
    # Set the current zoom transform state.
    if !@initialized
      return
    preError = "#{@preError}.setZoomTransform(transform)"
    _ = @

    #_transform = if transform then transform else d3.event.transform
    if transform?
      @transform = transform
    else if d3.event?
      @transform = d3.event.transform
    _transform = @transform

    # Zoom the X-Axis
    _rescaleX = _transform.rescaleX(@definition.x)
    #_rescaleX1 = _transform.rescaleX(@definition.x1)
    @svg.select(".bar-plot-axis-x").call(
      @definition.xAxis.scale(_rescaleX)
    )

    # Set the scaleRange
    @state.range.scale = @getDomainScale(_rescaleX)
    @state.mean.scale = @getDomainMean(_rescaleX)
    @setDataState()
    @setIntervalState()
    @setDataRequirement()
    @setZoomState(_transform.k)

    # Redraw Bars
    for key, row of @data
      @svg.selectAll(".bar-#{key}")
        .attr("x", (d) -> _rescaleX(d.x))
        .attr("width",
          d3.max([1, Math.floor(_transform.k * @definition.x1.bandwidth())]))

    @appendCrosshairTarget(_transform)
    return _transform

  setCrosshair: (transform, mouse) ->
    # Set the Crosshair position
    if !@initialized
      return
    preError = "#{@preError}.setCrosshair(mouse)"
    _ = @
    _dims = @definition.dimensions

    directionLabel = (dir) ->
      # Return a direction label for wind direction type items.
      return switch
        when dir > 360 or dir < 0 then "INV"
        when dir >= 0 and dir < 11.25 then "N"
        when dir >= 11.25 and dir < 33.75 then "NNE"
        when dir >= 33.75 and dir < 56.25 then "NE"
        when dir >= 56.25 and dir < 78.75 then "ENE"
        when dir >= 78.75 and dir < 101.25 then "E"
        when dir >= 101.25 and dir < 123.75 then "ESE"
        when dir >= 123.75 and dir < 146.25 then "SE"
        when dir >= 146.25 and dir < 168.75 then "SSE"
        when dir >= 168.75 and dir < 191.25 then "S"
        when dir >= 191.25 and dir < 213.75 then "SSW"
        when dir >= 213.75 and dir < 236.25 then "SW"
        when dir >= 236.25 and dir < 258.75 then "WSW"
        when dir >= 258.75 and dir < 281.25 then "W"
        when dir >= 281.25 and dir < 303.75 then "WNW"
        when dir >= 303.75 and dir < 326.25 then "NW"
        when dir >= 326.25 and dir < 348.75 then "NNW"
        when dir >= 348.75 and dir <= 360 then "N"

    for key, row of @data
      _mouseTarget = @overlay.node()
      #_datum = @overlay.datum()
      _datum = row
      mouse = if mouse then mouse else d3.mouse(_mouseTarget)

      x0 = @definition.x.invert(mouse[0] + _dims.leftPadding)
      if transform
        x0 = @definition.x.invert(
          transform.invertX(mouse[0] + _dims.leftPadding))

      i1 = _.bisectDate(_datum, x0, 1)
      i = if x0.getMinutes() >= 30 then i1 else (i1 - 1)

      # Correct for Max & Min
      if x0.getTime() <= @state.range.data[key].min.getTime()
        i = i1
      if x0.getTime() >= @state.range.data[key].max.getTime()
        i = i1 - 1

      if _datum[i]?
        if transform
          dx = transform.applyX(@definition.x(_datum[i].x))
        else
          dx = @definition.x(_datum[i].x)
        dy = []
        _value = []
        if @options.y[key].variable != null
          _value[key] = _datum[i]
          if _value[key]?
            dy[key] = @definition.y(_value[key].y)
            _date = @displayDate(_value[key].x)
            if !isNaN(dy[key]) and _value[key].y?
              @focusRect[key].attr("transform", "translate(0, 0)")

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

          @focusDateText
            .attr("x", cx - 120)
            .attr("y", (_dims.topPadding + _dims.innerHeight - 3))
            .attr("transform", "translate(#{_dims.leftPadding}, 0)")
            .text(_date)

          if (
            @options.y[key].variable != null and !isNaN(dy[key]) and
            _value[key].y?
          )
            @focusRect[key]
              .attr("width", transform.k * @definition.x1.bandwidth())
              .attr("x", dx)
              .attr("y", dy[key])

            @focusText[key]
              .attr("x", dx + _dims.leftPadding / 10 +
                transform.k * @definition.x1.bandwidth() + 2)
              .attr("y", dy[key] - _dims.topPadding / 10)
              .text(
                if _value[key].y?
                  if _.options.y[0].variable is "wind_direction"
                    directionLabel(_value[key].y)
                  else
                    _value[key].y.toFixed(2) + " " + @options.y[key].units)

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
    @focusDateText.style("display", null)

    for setId, row of @options.y
      if row.variable != null
        if @focusRect[setId]?
          @focusRect[setId].style("display", null)
            .attr("fill", @options.focusX.color)
            #.attr("fill", row.color)
        if @focusText[setId]?
          @focusText[setId].style("display", null)
            .style("color", row.color)
            .style("fill", row.color)

  hideCrosshair: ->
    # Hide the Crosshair
    if !@initialized
      return

    @crosshairs.select(".crosshair-x")
      .style("display", "none")
    @crosshairs.select(".crosshair-x-under")
      .style("display", "none")
    @focusDateText.style("display", "none")

    for setId, row of @options.y
      if row.variable != null
        if @focusRect[setId]?
          @focusRect[setId].style("display", "none")
        if @focusText[setId]?
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
      .attr("class", "bar-plot-title")

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
