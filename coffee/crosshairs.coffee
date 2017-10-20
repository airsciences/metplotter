#
#   NWAC Support Library
#

window.Plotter ||= {}

window.Plotter.Crosshairs = class Crosshairs
  constructor: (plotter) ->
    @preError = "Plotter.Crosshairs."
    @plotter = plotter

  set: (transform, mouse)->
    # Set the cursor hover position of all plots. Triggered by a single plot."
    for plot in @plotter.plots
      if plot?
        plot.proto.setCrosshair(transform, mouse)

  show: ->
    # Show all Crosshair Command
    for plot in @plotter.plots
      if plot?
        plot.proto.showCrosshair()

  hide: ->
    # Show all Crosshair Command
    for plot in @plotter.plots
      if plot?
        plot.proto.hideCrosshair()

  roundDate: (date) ->
    date.setHours(date.getHours() + Math.round(date.getMinutes()/60))
    date.setMinutes(0)
    return date
