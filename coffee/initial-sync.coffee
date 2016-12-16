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

  add: (plotId) ->
    _plotTemplate = @plotter.i.template.template[plotId]
    _state = @plotter.plots[0].proto.getState()
    maxDatetime = @plotter.lib.format(_state.range.data[0].max)
    limit = _state.length.data[0]

    args = @plotter.i.template.forSync(plotId, 0, maxDatetime, limit)
    uuid = @plotter.lib.uuid()

    @requests[uuid] =
      plotId: plotId
      ready: false
      requested: false
    @requests[uuid]['requested'] = @getAppend(plotId, 0, uuid, args)

  get: (plotId, dataSetId, uuid, args) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.get()"
    target = @endpoint()
    _ = @

    callback = (data) ->
      if !(data.responseJSON?)
        throw new Error("#{preError} error requesting data.")
        return null

      if data.responseJSON.results.length is 0
        throw new Error("#{preError} no set found.")
        return null

      # Correct Data. Stage into Plotter.
      _.requests[uuid].ready = true
      _.plotter.plots[plotId].__data__[dataSetId] = data.responseJSON.results

    @sapi.get(target, args, callback)
    return true

  getAppend: (plotId, dataSetId, uuid, args) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.get()"
    target = @endpoint()
    _ = @

    callback = (data) ->
      if !(data.responseJSON?)
        throw new Error("#{preError} error requesting data.")
        return null

      if data.responseJSON.results.length is 0
        throw new Error("#{preError} no set found.")
        return null

      # Set __data__ if Undefined
      if !(_.plotter.plots[plotId].__data__?)
        _.plotter.plots[plotId].__data__ = []

      # Correct Data. Stage into Plotter.
      _.requests[uuid].ready = true
      _.plotter.plots[plotId].__data__[dataSetId] = data.responseJSON.results

      # Set Data and Append the Plot.
      _.plotter.plots[plotId].proto.setData(
        _.plotter.plots[plotId].__data__[dataSetId])
      _.plotter.plots[plotId].proto.append()
      _.plotter.i.controls.removeSpinner(plotId)

    @sapi.get(target, args, callback)
    return true
