window.Plotter ||= {}

window.Plotter.InitialSync = class InitialSync
  constructor: (plotter) ->
    @preError = "Plotter.InitialSync"
    @plotter = plotter

    @requests = []

  stage: (plotId) ->
    maxDatetime = @plotter.i.template[plotId].x.max
    for i in [0..(@plotter.i.template.dataSetCount()-1)]
      args = @plotter.i.template.forSync(plotId, i, )
      uuid = @plotter.lib.uuid()
      console.log("Request id (uuid)", uuid)

  get: (uuid) ->


  append: (plotId) ->


  prepend: (plotId) ->
