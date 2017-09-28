#
#   NWAC Support Library
#


window.Plotter ||= {}

window.Plotter.Zoom = class Zoom
  constructor: (plotter) ->
    @preError = "Plotter.Zoom."
    @plotter = plotter

  set: (transform, callingPlotId) ->
    # Set the zoom state of all plots. Triggered by a single plot.
    for plotId, plot of @plotter.plots
      if plot?
        # if !(plotId == callingPlotId)
        #   console.log("setting (callingId, plotId), ", callingPlotId, plotId)
        plot.proto.setZoomTransform(transform)
