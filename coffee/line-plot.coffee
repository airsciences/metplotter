#
#   NWAC Coffee Plots
#

window.Plotting ||= {}

window.Plotting.LinePlot = class LinePlot
  constructor: (data, options) ->
    @preError = "LinePlot."

    # Default Configuration
    defaults =
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
      transitionDuration: 300
      lineColor: "rgb(41,128,185)"
      weight: 2
      axisColor: "rgb(0,0,0)"
      font:
        weight: 100
        size: 12
      crosshairX:
        weight: 1
        color: "rgb(149, 165, 166)"
      crosshairY:
        weight: 1
        color: "rgb(149, 165, 166)"

    if options.x
      options.x = Object.mergeDefaults(options.x, defaults.x)
    if options.y
      options.y = Object.mergeDefaults(options.y, defaults.y)
    @options = Object.mergeDefaults options, defaults

    # Wrapped Logging Functions
    @log = (log...) ->
    if @options.debug
      @log = (log...) -> console.log(log)

    @parseDate = d3.timeParse(@options.x.format)
    @bisectDate = d3.bisector((d) -> d.x).left

    # Set @data
    @data = []
    for key, row of data.data
      @data[key] =
        x: @parseDate(row[@options.x.variable])
        y: row[@options.y.variable]

    # Run Get Definition on Class Construction
    @getDefinition()

    # Responsive Event Listener
#     if(window.attachEvent) {
#       window.attachEvent('onresize', function() {
#         alert('attachEvent - resize');
#         });
#     }
#     else if(window.addEventListener) {
#       window.addEventListener('resize', function() {
#         console.log('addEventListener - resize');
#         }, true);
#     }
# ######### do we need this? ################
#     else{
#       }

  getDefinition: ->
    preError = "#{@preError}getDefinition():"
    _ = @



    # Allow Ticks When Large Screen
    if @options.theme isnt 'minimum'
      @options.x.ticks = d3.timeFormat @options.x.format

    # Define the Definition
    @definition = {}

    @calculateChartDims()

    @definition.colorScale = d3.schemeCategory20

    @calculateAxisDims(@data)

    # Define D3 Methods
    @definition.xAxis = d3.axisBottom().scale(@definition.x)
      .ticks(Math.round($(@options.target).width() / 100))
    @definition.yAxis = d3.axisLeft().scale(@definition.y)
      .ticks(@options.y.ticks)
    @definition.line = d3.line()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y((d) -> _.definition.y(d.y))
      ######################.curve(d3.curveCatmullRom.alpha(0.5))

  calculateChartDims: ->
    preError = "#{@preError}calculateChartDims()"

    # Calculate Basic DOM & SVG Dimensions
    width = Math.round($(@options.target).width())
    height = Math.round(width/2.5)
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

    @definition.dimensions =
      width: width
      height: height
      margin: margin
    @definition.x = d3.scaleTime().range([margin.left, (width-margin.right)])
    @definition.y = d3.scaleLinear().range([(height-margin.bottom),
      (margin.top)])

  calculateAxisDims: (data) ->
    preError = "#{@preError}calculateAxisDims(data)"

    # Calculate X & Y, Min & Max
    xmin = if @options.x.min is null then d3.min(data, (d)-> d.x)
    else @parseDate(@options.x.min)
    xmax = if @options.x.max is null then d3.max(data, (d)-> d.x)
    else @parseDate(@options.x.max)
    ymin = if @options.y.min is null then d3.min(data, (d)-> d.y)
    else @options.y.min
    ymax = if @options.y.max is null then d3.max(data, (d)-> d.y)
    else @options.y.max

    # Restore Viewability if Y-Min = Y-Max
    ymin = if ymin == ymax then ymin * 0.8 else ymin
    ymax = if ymin == ymax then ymax * 1.2 else ymax

    # Insert Values into Definition
    @definition.x.min = xmin
    @definition.x.max = xmax
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

    # Define Translate Padding
    topPadding = parseInt(@definition.dimensions.margin.top)
    bottomPadding = parseInt(@definition.dimensions.height -
      @definition.dimensions.margin.bottom)
    leftPadding = parseInt(@definition.dimensions.margin.left)
    innerHeight = parseInt(@definition.dimensions.height -
      @definition.dimensions.margin.bottom - @definition.dimensions.margin.top)
    innerWidth = parseInt(@definition.dimensions.width -
      @definition.dimensions.margin.left - @definition.dimensions.margin.right)

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
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("transform", "translate(#{leftPadding}, #{topPadding})")

    # Define the Domains
    @definition.x.domain([@definition.x.min, @definition.x.max])
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()

    # Append the X-Axis
    @svg.append("g")
      .attr("class", "line-plot-axis-x")
      .attr("transform", "translate(0, #{bottomPadding})")
      .style("fill", "none")
      .style("stroke", @options.axisColor)
      .call(@definition.xAxis)

    # Add Text Labels to X-Axis (Only if Large Scale Theme)
    if @options.theme isnt 'minimum'
      @svg.select(".line-plot-axis-x")
        .selectAll("text")
        .style("font-size", @options.font.size)
        .style("font-weight", @options.font.weight)

    # Append the Y-Axis
    @svg.append("g")
      .attr("class", "line-plot-axis-y")
      .attr("transform", "translate(#{leftPadding}, 0)")
      .style("fill", "none")
      .style("stroke", @options.axisColor)
      .style("font-size", @options.font.size)
      .style("font-weight", @options.font.weight)
      .call(@definition.yAxis)


    # Append the Line Path
    @svg.append("g")
      .attr("clip-path", "url(\##{@options.target}_clip)")
      .append("path")
      .datum(@data)
      .attr("d", @definition.line)
      .attr("class", "line-plot-path")
      .style("stroke", @options.lineColor)
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

    _ = @

    # Create Focus Circle
    @focusCircle = @svg.append("circle")
      .attr("r", 5)
      .attr("class", "focusCircle")
      .attr("fill", "rgb(44, 62, 80)")

    # Move Crosshairs and Focus Circle Based on Mouse Location
    @svg.append("rect")
      .datum(@data)
      .attr("class", "overlay")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("transform", "translate(#{leftPadding}, #{topPadding})")
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () ->
        _.crosshairs.style("display", null)
        _.focusCircle.style("display", null)
      )
      .on("mouseout", () ->
        _.crosshairs.style("display", "none")
        _.focusCircle.style("display", "none")
      )

      .on("mousemove", (d) ->
        mouse = d3.mouse @
        x0 = _.definition.x.invert(mouse[0])
        i = _.bisectDate(d, x0, 1)
        d0 = d[i - 1]
        d1 = d[i]
        d = if x0 - (d0.Date) > (d1.Date) - x0 then d1 else d0
        dy = _.definition.y(d.y)
        dx = _.definition.x(d.x)
        _.log(dx)

        _.crosshairs.select(".crosshair-x")
          .attr("x1", mouse[0])
          .attr("y1", topPadding)
          .attr("x2", mouse[0])
          .attr("y2", innerHeight + topPadding)
          .attr("transform", "translate(#{leftPadding}, 0)")
############################################################################
        _.focusCircle.select(".focusCircle")
          .attr("cx", dx)
          .attr("cy", dy)
          #.attr("transform", "translate(0, #{topPadding})")
        )


  update: (data) ->
    preError = "#{@preError}update()"
    _ = @

    # Append New Data
    dtOffset = new Date @definition.x.max
    for key, row of data
      @data.push(
        x: @parseDate(row[@options.x.variable])
        y: row[@options.y.variable]
      )

    # Pre-Append Data For Smooth transform
    @svg.select(".line-plot-path")
      .datum(@data)
      .attr("d", @definition.line)

    @calculateAxisDims @data
    dtDiff = @definition.x.max - dtOffset
    @log "#{preError} Date Diff Calcs (dtOffset, @def.x.min, dtDiff)",
      dtOffset, @definition.x.max, @dtDiff

    @definition.x.domain([@definition.x.min, @definition.x.max])
    @definition.y.domain([@definition.y.min, @definition.y.max]).nice()

    # Redraw the X-Axis
    @svg.select(".line-plot-axis-x")
      .style("font-size", @options.font.size)
      .style("font-weight", @options.font.weight)
      .transition()
      .duration(@options.transitionDuration)
      .ease(d3.easeLinear)
      .call(@definition.xAxis)

    # Redraw the Y-Axis
    @svg.select(".line-plot-axis-y")
      .style("font-size", @options.font.size)
      .style("font-weight", @options.font.weight)
      .transition()
      .duration(@options.transitionDuration)
      .ease(d3.easeLinear)
      .call(@definition.yAxis)

    # Redraw the Line Path
    @svg.select(".line-plot-path")
      .datum(@data)
      .transition()
      .duration(@options.transitionDuration)
      .attr("d", @definition.line)
