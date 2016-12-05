window.Plotter ||= {}

window.Plotter.InitialSync = class InitialSync
  constructor: (plotter) ->
    @preError = "Plotter.InitialSync"
    @plotter = plotter

    @requests = []

  stageAll: ->
    for plotId in [0..(@plotter.i.template.plotCount()-1)]
      console.log("Staging plot (id)", plotId)
      @stage(plotId)

  stage: (plotId) ->
    maxDatetime = @plotter.i.template.template[plotId].x.max
    for i in [0..(@plotter.i.template.dataSetCount()-1)]
      args = @plotter.i.template.forSync(plotId, i, maxDatetime, 504)
      uuid = @plotter.lib.uuid()
      console.log("Request id (uuid)", uuid)

  get: (uuid) ->


  append: (plotId) ->


  prepend: (plotId) ->
