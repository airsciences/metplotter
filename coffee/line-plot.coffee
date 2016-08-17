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
    @options = Object.mergeDefaults options, defaults

    # Wrapped Logging Functions
    @log = (log...) ->
    if @options.debug
      @log = (log...) -> console.log(log)
    @getDefinition()

  getDefinition: ->
    #
    # Calculate the D3 chart parameters from options & data.
    #
    preError = "#{@preError}getDefinition():"
    @log(@preError + "#{preError}JeffIsCool", "cat", 8)
########## Does this need to be defined here?#################################
### [Response:] No, this only used in callback type functions. We likely don't need it here. ##
    _ = @
########### What does the dollar sign do?###################################
### [Response:] The $ represents jQuery, $(htmlElementIdorClass) selects an html element by name. ##
    width = Math.round($(@options.target).width())
    height = Math.round(width/4)
####### where is the theme set?##############################################
### [Response:] Theme is an option that will be specified, airsci & minimum were for salton, we will modify this with responsive. ##
    if @options.theme is 'minimum'
      margin =
        top: height * 0.28
        right: width * 0.03
        bottom: height * 0.18
        left: width * 0.03
####### What does this represent? How far the object is from the left? xOffset was for those additional plot addons & can be deleted. ########
        xOffset: 0
    else
      margin =
        top: height * 0.07
        right: width * 0.03
        bottom: height * 0.07
        left: width * 0.03
        xOffset: 0

    ######### is this everything that I need in this log section? ##########
    ######### considering we are only plotting on a linear axis #######
    ### [Response:] log() is the wrong yDef function, we will want linear() ##

    @log("#{preError} (margin):", margin)
    yDef = d3.scale.log().range([(height-margin.bottom-margin.xOffset),
        (margin.top)])

    if @options.theme isnt 'minimum'
      @options.x.ticks = d3.time.format(@options.x.format)

########## why is this not an else if?################################
### [Response:] because we want to use the category10() color scale when nothing is defined for theme as a catch-all/backup ##
    if @options.theme is 'airsci'
      colorScale = d3.scale
    else
      colorScale = d3.scale.category10()

########### why is the drawing the svg element done in an append function ####
####### rather than a draw function #####################################
### [Response:] append is just a better name for draw, no other reason. ##
    # Begin the Definition
    @definition =
      dimensions:
        width: width
        height: height
        margin: margin
        colorScale: colorScale
        x: d3.time.scale().range([margin.left, (width-margin.right)])
        y: yDef

  responsive: ->
    preError = "#{@preError}responsive()"
    dim =
      width: $(window).width()
      height: $(window).height()

    for plot in @plots
      @log plot

  append: ->
    preError = "#{@preError}append()"
    _ = @
    @log "#{preError}", @options

    # Create the SVG
    @svg = d3.select(@options.target).append("svg")
      .attr("class", "line-plot")
      .attr("width", @definition.dimensions.width)
      .attr("height", @definition.dimensions.height)

    #
    # Append the X-Axis
    #
    ################ what is "g"? and what is exactly happening here?######
    ### [Response:] a "g" element represents a group within an svg svg>g ##
    @svg.append("g")
        .attr("class", "line-plot-axis-x")
        .attr("transform",
            "translate(0, #{parseFloat(innerHeight)})")
            ############ what is a good way to show the data structure?#####
        .style("fill", "none")
        .stroke("stroke", @options.axisColor)
        ######are we appending @definition here?##################
        ### [Response:] no, we are "calling" it's 'xAxis' function to return a D3 axis definition ##
        .call(@definition.xAxis)

    if @options.theme isnt 'minimum'
##############why is this erroring?#############
### [Response:] probably missing the period in the line plot, since it's a class, "line-plot-axis-x" should be ".line-plot-axis-x". ##
        @svg.select("line-plot-axis-x")
        .selectAll("text")
        .style("font-weight", @options.font.weight)

    # Append the Soft X-Axis

    # Append the Y-Axis

    ##### ...

  update: (data) ->
