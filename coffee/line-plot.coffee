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
        ticks: null
        format: "%Y-%m-%d %H:%M:%S"
        min: null
        max: null
      y:
        variable: null
        min: null
        max: null
        ticks: 5
      color: "#2980b9"
      weight: 2
      axisColor: "rgb(0,0,0)"
      font:
        weight: 400

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

    # Set @data
    @data = []
    for key, row of data.data
      @data[key] =
        x: @parseDate(row[@options.x.variable])
        y: row[@options.y.variable]

    @log "@data", @data

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

    width = Math.round($(@options.target).width())
    height = Math.round(width/2)
    if @options.theme is 'minimum'
      margin =
        top: Math.round(height * 0.28)
        right: Math.round(width * 0.03)
        bottom: Math.round(height * 0.18)
        left: Math.round(width * 0.03)
    else
      margin =
        top: Math.round(height * 0.07)
        right: Math.round(width * 0.03)
        bottom: Math.round(height * 0.16)
        left: Math.round(width * 0.03)

    @log "#{preError} (margin):", margin

    if @options.theme isnt 'minimum'
      @options.x.ticks = d3.timeFormat @options.x.format

    if @options.theme is 'airsci'
      # colorScale = d3.scale
    else
      colorScale = d3.schemeCategory20

    # Begin the Definition
    @definition =
      dimensions:
        width: width
        height: height
        margin: margin
      colorScale: colorScale
      x: d3.scaleTime().range([margin.left, (width-margin.right)])
      y: d3.scaleLinear().range([(height-margin.bottom),(margin.top)])

    @calculateAxes()

    # Define D3 Methods
    @definition.xAxis = d3.axisBottom().scale(@definition.x)
    @definition.yAxis = d3.axisLeft().scale(@definition.y)
      .ticks(@options.y.ticks)
    @definition.line = d3.line()
      .defined((d)->
        !isNaN(d.y) and d.y isnt null
      )
      .x((d) -> _.definition.x(d.x))
      .y((d) -> _.definition.y(d.y))
      .curve(d3.curveCatmullRom.alpha(0.5))

  calculateAxes: ->
    preError = "#{@preError}calculateAxes()"
    # Calculate X & Y, mins & maxes
    xmin = if @options.x.min is null then d3.min(@data, (d)-> d.x)
    else @parseDate(@options.x.min)

    xmax = if @options.x.max is null then d3.max(@data, (d)-> d.x)
    else @parseDate(@options.x.max)

    ymin = if @options.y.min is null then d3.min(@data,
      (d)-> d.y)
    else @options.y.min

    ymax = if @options.y.max is null then d3.max(@data,
      (d)-> d.y)
    else @options.y.max

    # Restore Viewability if ymin == ymax
    ymin = if ymin == ymax then ymin * 0.8 else ymin
    ymax = if ymin == ymax then ymax * 1.2 else ymax
    @log("#{preError} (xmin, xmax, ymin, ymax)", xmin, xmax, ymin, ymax)

    @definition.x.min = xmin
    @definition.x.max = xmax
    @definition.y.min = ymin
    @definition.y.max = ymax

    # Define the Domains
    @definition.x.domain([xmin, xmax])
    @definition.y.domain([ymin, ymax]).nice()

  responsive: ->
    # Resize the plot according to current window dimensions.
    preError = "#{@preError}responsive()"
    dim =
      width: $(window).width()
      height: $(window).height()

  append: ->
    preError = "#{@preError}append()"
    _ = @
    @log "#{preError}", @options

    # Create the SVG
    innerHeight = parseInt(@definition.dimensions.height-
    @definition.dimensions.margin.bottom)
    innerWidth = parseInt(@definition.dimensions.margin.left)
    @svg = d3.select(@options.target).append("svg")
      .attr("class", "line-plot")
      .attr("width", @definition.dimensions.width)
      .attr("height", @definition.dimensions.height)
    # Append the X-Axis
    @svg.append("g")#ab
        .attr("class", "line-plot-axis-x")
        .attr("transform", "translate(0, #{innerHeight})")
        .style("fill", "none")
        .style("stroke", @options.axisColor)
        .call(@definition.xAxis)
#######################should lables be displying yet?##################
    # Add Text Labels to X-Axis
    if @options.theme isnt 'minimum'
      @svg.select(".line-plot-axis-x")
        .selectAll("text")
        .style("font-weight", @options.font.weight)

    # Append the Y Axi
    @svg.append("g")
        .attr("class", "line-plot-axis-y")
        .attr("transform",
            "translate(#{innerWidth}, 0)")
        .style("fill", "none")
        .style("stroke", @options.axisColor)
        .call(@definition.yAxis)

    # Append the Path
    @svg.append("path")
      .attr("d", @definition.line(@data))
      .attr("class", "line-plot-path")
      .style("stroke", @options.color)
      .style("stroke-width", @options.weight)
      .style("fill", "none")



  update: (data) ->
    preError = "#{@preError}update()"
    _ = @

    # Append New Data
    for key, row of data
      @data.push(
        x: @parseDate(row[@options.x.variable])
        y: row[@options.y.variable]
      )

    @calculateAxes()

    @svg.transition()
#      .duration(9000)

    @svg.select(".line-plot-path")
      .attr("d", @definition.line(@data))
