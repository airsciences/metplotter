window.Plotter ||= {}

window.Plotter.InitialSync = class InitialSync
  constructor: (plotter) ->
    @preError = "Plotter.InitialSync"
    @plotter = plotter
    @api = @plotter.i.api

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
      args = @plotter.i.template.forSync(plotId, i, maxDatetime,
        @plotter.options.initialLength)
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

    @api.get(target, args, callback)
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

      # Set Data and Append the Plot.cd
      _.plotter.plots[plotId].proto.skipBandDomainSet = true
      _.plotter.plots[plotId].proto.setData(
        _.plotter.plots[plotId].__data__[dataSetId])
      _.plotter.plots[plotId].proto.setBandDomain(_.plotter.bandDomain)
      _.plotter.plots[plotId].proto.append()

      # Draw the Legend.
      if !(_.plotter.legends[plotId]?)
        _.plotter.legends[plotId] = new window.Plotter.Legend(_.plotter, plotId)
        _.plotter.legends[plotId].draw()

      _.plotter.i.controls.removeSpinner(plotId)

    @api.get(target, args, callback)
    return true

  isReady: ->
    count = 0
    for key, request of @requests
      if request.ready is false
        count++

    return count is 0
