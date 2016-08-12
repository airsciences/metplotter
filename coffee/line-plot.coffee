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
      
  responsive: ->
    preError = "#{@preError}.responsive()"
    dim =
      width: $(window).width()
      height: $(window).height()

    for plot in @plots
      @log plot

  append: ->
    preError: "#{@preError}.append()"
    _ = @
    
    
    
      
  update: (data) ->
      
