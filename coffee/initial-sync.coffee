window.Plotter ||= {}

window.Plotter.InitialSync = class InitialSync
  constructor: (plotter) ->
    @preError = "Plotter.InitialSync"
    @plotter = plotter
    @sapi = @plotter.i.sapi

    @requests = {}

    @endpoint = ->
      return "#{@plotter.options.href}/api/v5/measurement"

  stageAll: ->
    for plotId in [0..(@plotter.i.template.plotCount()-1)]
      @stage(plotId)

  stage: (plotId) ->
    _plotTemplate = @plotter.i.template.template[plotId]
    maxDatetime = _plotTemplate.x.max
    for i in [0..(@plotter.i.template.dataSetCount(plotId)-1)]
      args = @plotter.i.template.forSync(plotId, i, maxDatetime, 504)
      uuid = @plotter.lib.uuid()

      @requests[uuid] =
        plot: plotId
        ready: false
        requested: false
      @requests[uuid]['requested'] = @get(plotId, i, uuid, args)

  get: (plotId, dataSetId, uuid, args) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.get()"
    target = @endpoint()
    _ = @

    callback = (data) ->
      if !(data.responseJSON?)
        throw new Error("#{preError} error requesting data.")
        return null

      if _.plotter.plots[plotId].__data__ is undefined
        _.plotter.plots[plotId].__data__ = []
      _result = data.responseJSON.results

      if data.responseJSON.results.length is 0
        throw new Error("#{preError} no set found.")
        _result = []
      # Correct Data. Stage into Plotter.
      _.requests[uuid].ready = true
      _.plotter.plots[plotId].__data__[dataSetId] = _result

    @sapi.get(target, args, callback)
    return true
