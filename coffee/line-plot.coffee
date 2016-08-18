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
        ticks: null
        format: "%Y-%m-%d %H:%M:%S"
      axisColor: "rgb(0,0,0)"
    @options = Object.mergeDefaults options, defaults

    # Wrapped Logging Functions
    @log = (log...) ->
    if @options.debug
      @log = (log...) -> console.log(log)
    
    # Run Get Definition on Class Construction
    @getDefinition()
    
    # Responsive Event Listener
    ## [Add Event Listener for window.resize]
    ## http://stackoverflow.com/questions/13651274/
    ##  how-can-i-attach-a-window-resize-event-listener-in-javascript#answers

  getDefinition: ->
    preError = "#{@preError}getDefinition():"
    
    width = Math.round($(@options.target).width())
    height = Math.round(width/4)
    if @options.theme is 'minimum'
      margin =
        top: height * 0.28
        right: width * 0.03
        bottom: height * 0.18
        left: width * 0.03
    else
      margin =
        top: height * 0.07
        right: width * 0.03
        bottom: height * 0.07
        left: width * 0.03

    @log "#{preError} (margin):", margin
    
    if @options.theme isnt 'minimum'
      # !D3 Version 4 No Longer has d3.time (why .format is not working).
      # [D3 Reference:] https://github.com/d3/d3-time-format/blob/master/
      #   README.md#timeFormat
      # @options.x.ticks = d3.time.format @options.x.format
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
    @svg = d3.select(@options.target).append("svg")
      .attr("class", "line-plot")
      .attr("width", @definition.dimensions.width)
      .attr("height", @definition.dimensions.height)

    # Append the X-Axis
    @svg.append("g")
        .attr("class", "line-plot-axis-x")
        .attr("transform",
            "translate(0, #{parseFloat(innerHeight)})")
        .style("fill", "none")
        .style("stroke", @options.axisColor)
        .call(@definition.xAxis)

    # Add Text Labels to X-Axis
    if @options.theme isnt 'minimum'
      @svg.select(".line-plot-axis-x")
        .selectAll("text")
        .style("font-weight", @options.font.weight)

    # Append the Soft X-Axis

  update: (data) ->
