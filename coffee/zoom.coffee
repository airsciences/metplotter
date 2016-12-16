#
#   NWAC Support Library
#


window.Plotter ||= {}

window.Plotter.Zoom = class Zoom
  constructor: (plotter) ->
    @preError = "Plotter.Zoom."
    @plotter = plotter

  set: (transform) ->
    # Set the zoom state of all plots. Triggered by a single plot.
    for plot in @plotter.plots
      if plot?
        plot.proto.setZoomTransform(transform)
