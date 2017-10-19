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

  scale: (kFactor, transform, width) ->
    xTranslated = transform.x - (width - width * transform.k)
    console.log("Zoom->scale (kFactor, transform, xTranslated)",
      kFactor, transform, xTranslated)
    kTransform = transform
      # .translate((xTranslated * kFactor - xTranslated), 0)
      .scale(kFactor)
    console.log("Zoom->scale resized (transform)", kTransform)
    return kTransform
