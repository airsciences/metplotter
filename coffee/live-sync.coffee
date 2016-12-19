window.Plotter ||= {}

window.Plotter.LiveSync = class LiveSync
  constructor: (plotter) ->
    @preError = "Plotter.LiveSync"
    @plotter = plotter
    @api = @plotter.i.api

    # Requests Object
    @requests = {}

    @endpoint = ->
      return "#{@plotter.options.href}/api/v5/measurement"

  append: (plotId, dataSetId, state) ->
    # Append a Plot's Data Set.
    _now = new Date()
    if state.range.data[dataSetId].max >= _now
      # Plot already at maximum append update
      return true

    limit = @plotter.options.updateLength
    currentMax = state.range.data[dataSetId].max.getTime()
    newMax = new Date(currentMax + (@plotter.options.updateLength * 3600000))

    if newMax > _now
      limit = Math.round((newMax.getTime() - _now.getTime()) / 3600000)

    maxDatetime = @plotter.lib.format(new Date(newMax))
    if limit < @plotter.options.minUpdateLength
      # Limit too small.
      return true

    args = @plotter.i.template.forSync(plotId, dataSetId, maxDatetime, limit)
    uuid = @plotter.lib.uuid()

    @requests[uuid] =
      ready: false
      requested: false
    @requests[uuid]['requested'] = @get(plotId, dataSetId, uuid, args, "max")

  prepend: (plotId, dataSetId, state) ->
    # Prepend a Plot's Data Set.
    maxDatetime = @plotter.lib.format(state.range.data[dataSetId].min)
    limit = @plotter.options.updateLength

    args = @plotter.i.template.forSync(plotId, dataSetId, maxDatetime, limit)
    uuid = @plotter.lib.uuid()

    @requests[uuid] =
      ready: false
      requested: false
    @requests[uuid]['requested'] = @get(plotId, dataSetId, uuid, args, "min")

  add: (plotId, dataSetId, state) ->
    # Add a new Plot Data Set.
    _now = new Date()
    if state.range.data[0].max >= _now
      # Plot already at maximum append update
      return true

    maxDatetime = @plotter.lib.format(state.range.data[0].max)
    limit = state.length.data[0]

    args = @plotter.i.template.forSync(plotId, dataSetId, maxDatetime, limit)
    uuid = @plotter.lib.uuid()

    @requests[uuid] =
      ready: false
      requested: false
    @requests[uuid]['requested'] = @getNew(plotId, dataSetId, uuid, args)

  get: (plotId, dataSetId, uuid, args, direction) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.get()"
    target = @endpoint()
    _ = @

    callback = (data) ->
      _proto = _.plotter.plots[plotId].proto
      if !(data.responseJSON?)
        throw new Error("#{preError} error requesting data.")
        return null

      _result = data.responseJSON.results

      if _.plotter.plots[plotId].__data__ is undefined
        throw new Error("#{preError} appending to empty data set.")
        _.plotter.plots[plotId].__data__ = new window.Plotter.Data([])

      if data.responseJSON.results.length is 0
        throw new Error("#{preError} no new data found.")
        _result = []
      # Correct Data. Stage into Plotter.
      _proto.appendData(_result, dataSetId)
      _proto.update()

      # Reset the current request count and status
      _.requests[uuid].ready = true
      _proto.state.requested.data[dataSetId][direction] = false
      _.plotter.updates = if _.plotter.updates < 0 then 0 else
        _.plotter.updates - 1

    @api.get(target, args, callback)
    return true

  getNew: (plotId, dataSetId, uuid, args) ->
    # Request a station's dataset (param specific)
    preError = "#{@preError}.getNew()"
    target = @endpoint()
    _ = @

    callback = (data) ->
      _proto = _.plotter.plots[plotId].proto
      if !(data.responseJSON?)
        throw new Error("#{preError} error requesting data.")
        return null

      _result = data.responseJSON.results

      if _.plotter.plots[plotId].__data__ is undefined
        throw new Error("#{preError} appending to empty data set.")
        _.plotter.plots[plotId].__data__ = new window.Plotter.Data([])

      if data.responseJSON.results.length is 0
        throw new Error("#{preError} no new data found.")
        _result = []

      # Correct Data. Stage into Plotter.
      _proto.addData(_result, dataSetId)
      _proto.update()

      # Reset the current request count and status
      _.requests[uuid].ready = true
      _.plotter.i.controls.removeSpinner(plotId)
      _.plotter.updates = if _.plotter.updates < 0 then 0 else
        _.plotter.updates - 1

    @api.get(target, args, callback)
    return true
