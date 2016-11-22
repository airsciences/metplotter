#
#   Northwest Avalanche Center (NWAC)
#   Plotting Tools - D3 V.4 Line Plot (line-plot.coffee)
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotting ||= {}

window.Plotting.LinePlot = class LinePlot
  constructor: (plotter, data, options) ->
    @preError = "LinePlot."
    @plotter = plotter
    @initialized = false

    # Default Configuration
    @defaults =
      plotId: null
      uuid: ''
      debug: true
      target: null
      dataParams: null
      merge: false
      x:
        variable: null
        format: "%Y-%m-%dT%H:%M:%SZ"
        min: null
        max: null
        ticks: 7
      y:
        dataLoggerId: null
        variable: null
        ticks: 5
        min: null
        max: null
        maxBarValue: null
        color: "rgb(41, 128, 185)"
      yBand:
        minVariable: null
        maxVariable: null
      y2:
        dataLoggerId: null
        variable: null
        ticks: 5
        min: null
        max: null
        color: "rgb(39, 174, 96)"
      y2Band:
        minVariable: null
        maxVariable: null
      y3:
        dataLoggerId: null
        variable: null
        ticks: 5
        min: null
        max: null
        color: "rgb(142, 68, 173)"
      y3Band:
        minVariable: null
        maxVariable: null
      zoom:
        scale:
          min: 0.3
          max: 10
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
      options.x = Object.mergeDefaults(options.x, @defaults.x)
    if options.y
      options.y = Object.mergeDefaults(options.y, @defaults.y)
    if options.y2
      options.y2 = Object.mergeDefaults(options.y2, @defaults.y2)
    if options.y3
      options.y3 = Object.mergeDefaults(options.y3, @defaults.y3)
    @options = Object.mergeDefaults options, @defaults
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

    # Initialize the State
    _domainScale = null
    _domainMean = null
    if data.length > 0
      _domainScale = @getDomainScale(@definition.x)
      _domainMean = @getDomainMean(@definition.x)

    @state =
      range:
        data: null
        scale: _domainScale
      length:
        data: null
      interval:
        data: null
      zoom: 1
      request:
        data: null
      mean:
        scale: _domainMean

    if data.length > 0
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
        if @options.y.variable == @options.y2.variable
          result[key].y2 = row[@options.y2.variable+"_2"]
        else
          result[key].y2 = row[@options.y2.variable]
      if @options.y3.variable != null
        if (
          @options.y.variable == @options.y3.variable or
          @options.y2.variable == @options.y3.variable
        )
          result[key].y3 = row[@options.y3.variable+"_3"]
        else
          result[key].y3 = row[@options.y3.variable]
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
      if (
        @options.y3Band.minVariable != null and
        @options.y3Band.maxVariable != null
      )
        result[key].y3Min = row[@options.y3Band.minVariable]
        result[key].y3Max = row[@options.y3Band.maxVariable]

    _result = new Plotting.Data(result)
    result = _result._clean(_result.get())

    return result.sort(@sortDatetimeAsc)

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
    _full = new Plotting.Data(@data)
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
      result[_key] = _row
    _full = new Plotting.Data(result)
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
    @state.range.data =
      min: d3.min(@data, (d)-> d.x)
      max: d3.max(@data, (d)-> d.x)

    # Set Data Length States
    @state.length.data = @data.length

  setIntervalState: ->
    # Set the Data Collection Padding Intervals in Hours
    @state.interval.data =
      min: ((@state.range.scale.min.getTime() -
        @state.range.data.min.getTime())/3600000)
      max: ((@state.range.data.max.getTime() -
        @state.range.scale.max.getTime())/3600000)

  setDataRequirement: ->
    # Calculate how necessary a download, in what direction, and  or data
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
        _.plotter.zoom(transform)
      )

    @definition.line = d3.line()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y((d) -> _.definition.y(d.y))

    @definition.line2 = d3.line()
      .defined((d)->
        !isNaN(d.y2) and d.y2 isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y((d) -> _.definition.y(d.y2))

    @definition.line3 = d3.line()
      .defined((d)->
        !isNaN(d.y3) and d.y3 isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y((d) -> _.definition.y(d.y3))

    @definition.area = d3.area()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y0((d) -> _.definition.y(d.yMin))
      .y1((d) -> _.definition.y(d.yMax))

    @definition.area2 = d3.area()
      .defined((d)->
        !isNaN(d.y2) and d.y2 isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y0((d) -> _.definition.y(d.y2Min))
      .y1((d) -> _.definition.y(d.y2Max))

    @definition.area3 = d3.area()
      .defined((d)->
        !isNaN(d.y3) and d.y3 isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y0((d) -> _.definition.y(d.y3Min))
      .y1((d) -> _.definition.y(d.y3Max))

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
    @definition.x.min = if @options.x.min is null then d3.min(data, (d)-> d.x)
    else @parseDate(@options.x.min)
    @definition.x.max = if @options.x.max is null then d3.max(data, (d)-> d.x)
    else @parseDate(@options.x.max)

  calculateYAxisDims: (data) ->
    # Calculate Min & Max Y Values
    @definition.y.min = d3.min([
      d3.min(data, (d)-> d.y)
      d3.min(data, (d)-> d.y2)
      d3.min(data, (d)-> d.y2)
      d3.min(data, (d)-> d.yMin)
      d3.min(data, (d)-> d.y2Min)
      d3.min(data, (d)-> d.y3Min)
    ])

    @definition.y.max = d3.max([
      d3.max(data, (d)-> d.y)
      d3.max(data, (d)-> d.y2)
      d3.max(data, (d)-> d.y3)
      d3.max(data, (d)-> d.yMax)
      d3.max(data, (d)-> d.y2Max)
      d3.max(data, (d)-> d.y3Max)
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

    # Append Axis Label
    _y_title = "#{@options.y.title}"
    if @options.y.units
      _y_title = "#{_y_title} #{@options.y.units}"

    _y_vert = -95
    _y_offset = -52
    if @device == 'small'
      _y_vert = -50
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

    if @options.y2.title
      _y2_title = "#{_y2_title} #{@options.y2.title}"

    if @options.y3.units
      _y3_title = "#{_y3_title} #{@options.y3.units}"

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
        .style("fill", @options.y.color)
        .style("opacity", 0.15)
        .style("stroke", () ->
          return d3.color(_.options.y.color).darker(1)
        )

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
        .style("fill", @options.y2.color)
        .style("opacity", 0.25)
        .style("stroke", () ->
          return d3.rgb(_.options.y2.color).darker(1)
        )

    if (
      @options.y3Band.minVariable != null and
      @options.y3Band.maxVariable != null
    )
      @lineband3 = @svg.append("g")
        .attr("clip-path", "url(\##{@options.target}_clip)")
        .append("path")
        .datum(@data)
        .attr("d", @definition.area3)
        .attr("class", "line-plot-area3")
        .style("fill", @options.y3.color)
        .style("opacity", 0.25)
        .style("stroke", () ->
          return d3.rgb(_.options.y3.color).darker(1)
        )

    # Append the Line Paths
    @svg.append("g")
      .attr("clip-path", "url(\##{@options.target}_clip)")
      .append("path")
      .datum(@data)
      .attr("d", @definition.line)
      .attr("class", "line-plot-path")
      .style("stroke", @options.y.color)
      .style("stroke-width",
          Math.round(Math.pow(@definition.dimensions.width, 0.1)))
      .style("fill", "none")

    @svg.append("g")
      .attr("clip-path", "url(\##{@options.target}_clip)")
      .append("path")
      .datum(@data)
      .attr("d", @definition.line2)
      .attr("class", "line-plot-path2")
      .style("stroke", @options.y2.color)
      .style("stroke-width",
        Math.round(Math.pow(@definition.dimensions.width, 0.1)))
      .style("fill", "none")

    @svg.append("g")
      .attr("clip-path", "url(\##{@options.target}_clip)")
      .append("path")
      .datum(@data)
      .attr("d", @definition.line3)
      .attr("class", "line-plot-path3")
      .style("stroke", @options.y3.color)
      .style("stroke-width",
        Math.round(Math.pow(@definition.dimensions.width, 0.1)))
      .style("fill", "none")

    if @options.y.maxBarValue != null
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

    # Create Focus Circles and Labels
    @focusCircle = @svg.append("circle")
      .attr("r", 4)
      .attr("id", "focus-circle-1")
      .attr("class", "focus-circle")
      .attr("fill", @options.y.color)
      .attr("transform", "translate(-10, -10)")
      .style("display", "none")

    @focusText = @svg.append("text")
      .attr("id", "focus-text-1")
      .attr("class", "focus-text")
      .attr("x", 9)
      .attr("y", 7)
      .style("display", "none")
      .style("fill", @options.y.color)
      .style("text-shadow", "-2px -2px 0 rgb(255,255,255),
        2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255),
        2px 2px 0 rgb(255,255,255)")

    @focusCircle2 = @svg.append("circle")
      .attr("r", 4)
      .attr("id", "focus-circle-2")
      .attr("class", "focus-circle")
      .attr("fill", @options.y2.color)
      .attr("transform", "translate(-10, -10)")
      .style("display", "none")

    @focusText2 = @svg.append("text")
      .attr("id", "focus-text-2")
      .attr("class", "focus-text")
      .attr("x", 9)
      .attr("y", 7)
      .style("display", "none")
      .style("fill", @options.y2.color)
      .style("text-shadow", "-2px -2px 0 rgb(255,255,255),
        2px -2px 0 rgb(255,255,255), -2px 2px 0 rgb(255,255,255),
        2px 2px 0 rgb(255,255,255)")

    @focusCircle3 = @svg.append("circle")
      .attr("r", 4)
      .attr("id", "focus-circle-3")
      .attr("class", "focus-circle")
      .attr("fill", @options.y3.color)
      .attr("transform", "translate(-10, -10)")
      .style("display", "none")

    @focusText3 = @svg.append("text")
      .attr("id", "focus-text-3")
      .attr("class", "focus-text")
      .attr("x", 9)
      .attr("y", 7)
      .style("display", "none")
      .style("fill", @options.y3.color)
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

    @svg.select(".line-plot-area2")
      .datum(@data)
      .attr("d", @definition.area2)

    @svg.select(".line-plot-area3")
      .datum(@data)
      .attr("d", @definition.area3)

    @svg.select(".line-plot-path")
      .datum(@data)
      .attr("d", @definition.line)
      .style("stroke", @options.y.color)
      .style("stroke-width",
        Math.round(Math.pow(@definition.dimensions.width, 0.1)))
      .style("fill", "none")

    @svg.select(".line-plot-path2")
      .datum(@data)
      .attr("d", @definition.line2)
      .style("stroke", @options.y2.color)
      .style("stroke-width",
        Math.round(Math.pow(@definition.dimensions.width, 0.1)))
      .style("fill", "none")

    @svg.select(".line-plot-path3")
      .datum(@data)
      .attr("d", @definition.line3)
      .style("stroke", @options.y3.color)
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

    @svg.select(".line-plot-area2")
      .datum(@data)
      .attr("d", @definition.area2)

    @svg.select(".line-plot-area3")
      .datum(@data)
      .attr("d", @definition.area3)

    # Redraw the Line Paths
    @svg.select(".line-plot-path")
      .datum(@data)
      .attr("d", @definition.line)

    @svg.select(".line-plot-path2")
      .datum(@data)
      .attr("d", @definition.line2)

    @svg.select(".line-plot-path3")
      .datum(@data)
      .attr("d", @definition.line3)

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
      .on("mouseover", () -> _.plotter.showCrosshairs())
      .on("mouseout", () -> _.plotter.hideCrosshairs())
      .on("mousemove", () ->
        mouse = _.setCrosshair(transform)
        _.plotter.crosshair(transform, mouse)
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
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y0((d) -> _.definition.y(d.yMin))
      .y1((d) -> _.definition.y(d.yMax))

    @svg.select(".line-plot-area")
      .attr("d", @definition.area)

    # Redefine & Redraw the Line Path
    @definition.line = d3.line()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y((d) -> _.definition.y(d.y))

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

    @svg.select(".line-plot-area2")
      .attr("d", @definition.area2)

    # Redefine & Redraw the Line2 Path
    @definition.line2 = d3.line()
      .defined((d)->
        !isNaN(d.y2) and d.y2 isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y((d) -> _.definition.y(d.y2))

    @svg.select(".line-plot-path2")
      .attr("d", @definition.line2)

    # Redefine & Redraw the Area3
    @definition.area3 = d3.area()
      .defined((d)->
        !isNaN(d.y3Max) and d.y3Max isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y0((d) -> _.definition.y(d.y3Min))
      .y1((d) -> _.definition.y(d.y3Max))

    @svg.select(".line-plot-area3")
      .attr("d", @definition.area3)

    # Redefine & Redraw the Line2 Path
    @definition.line3 = d3.line()
      .defined((d)->
        !isNaN(d.y3) and d.y3 isnt null
      )
      .x((d) -> _transform.applyX(_.definition.x(d.x)))
      .y((d) -> _.definition.y(d.y3))

    @svg.select(".line-plot-path3")
      .attr("d", @definition.line3)

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
    i = _.bisectDate(_datum, x0, 1)
    d = if x0.getMinutes() >= 30 then _datum[i] else _datum[i - 1]
    if x0.getTime() < @state.range.data.min.getTime()
      d = _datum[i - 1]
    if x0.getTime() > @state.range.data.max.getTime()
      d = _datum[i - 1]

    dx = if transform then transform.applyX(@definition.x(d.x)) else
      @definition.x(d.x)
    if @options.y.variable != null
      dy = @definition.y(d.y)
      if !isNaN(dy)
        @focusCircle.attr("transform", "translate(0, 0)")
    if @options.y2.variable != null
      dy2 = @definition.y(d.y2)
      if !isNaN(dy2)
        @focusCircle2.attr("transform", "translate(0, 0)")
    if @options.y3.variable != null
      dy3 = @definition.y(d.y3)
      if !isNaN(dy3)
        @focusCircle3.attr("transform", "translate(0, 0)")

    if d is null or d is undefined
      console.log("d is broken (d)", d)

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

    if @options.y.variable != null and !isNaN(dy)
      @focusCircle
        .attr("cx", dx)
        .attr("cy", dy)

      @focusText
        .attr("x", dx + _dims.leftPadding / 10)
        .attr("y", dy - _dims.topPadding / 10)
        .text(d.y.toFixed(2) + " " + @options.y.units)

    if @options.y2.variable != null and !isNaN(dy2)
      @focusCircle2
        .attr("cx", dx)
        .attr("cy", dy2)

      @focusText2
        .attr("x", dx + _dims.leftPadding / 10)
        .attr("y", dy2 - _dims.topPadding / 10)
        .text(d.y2.toFixed(2) + " " + @options.y2.units)

    if @options.y3.variable != null and !isNaN(dy3)
      @focusCircle3
        .attr("cx", dx)
        .attr("cy", dy3)

      @focusText3
        .attr("x", dx + _dims.leftPadding / 10)
        .attr("y", dy3 - _dims.topPadding / 10)
        .text(d.y3.toFixed(2) + " " + @options.y3.units)

    # Tooltip Overlap Prevention
    if (
      @options.y.variable != null and
      @options.y2.variable != null and
      @options.y3.variable != null
    )
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
    if !@initialized
      return
    @crosshairs.select(".crosshair-x")
      .style("display", null)

    @crosshairs.select(".crosshair-x-under")
      .style("display", null)

    if @options.y.variable != null
      @focusCircle.style("display", null)
        .attr("fill", @options.y.color)
      @focusText.style("display", null)
        .style("color", @options.y.color)
        .style("fill", @options.y.color)

    if @options.y2.variable != null
      @focusCircle2.style("display", null)
        .attr("fill", @options.y2.color)
      @focusText2.style("display", null)
        .style("color", @options.y2.color)
        .style("fill", @options.y2.color)

    if @options.y3.variable != null
      @focusCircle3.style("display", null)
        .attr("fill", @options.y3.color)
      @focusText3.style("display", null)
        .style("color", @options.y3.color)
        .style("fill", @options.y3.color)

  hideCrosshair: () ->
    # Hide the Crosshair
    if !@initialized
      return
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

    if @options.y3.variable != null
      @focusCircle3.style("display", "none")
      @focusText3.style("display", "none")

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
