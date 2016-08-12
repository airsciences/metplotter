#
#   NWAC Coffee Plots
#

window.Plotting ||= {}

window.Plotting.LinePlot = class LinePlot
  constructor: () ->
    @preError = "Plotting.LinePlot."
    
    # Default Configuration
    defaults =
      target = null
      
  responsive: () ->
    dim =
      width: $(window).width()
      height: $(window).height()

    for plot in @plots
      @log "Cats"
