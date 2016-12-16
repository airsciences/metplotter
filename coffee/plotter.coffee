window.Plotter ||= {}

window.Plotter.Handler = class Handler
  constructor: (accessToken, options, plots) ->
    @preError = "Plotter.Handler"

    # Define the Library
    __libDateFormat = if options.dateFormat then options.dateFormat
    else "%Y-%m-%dT%H:%M:%SZ"
    __libOptions =
      dateFormat: __libDateFormat
    @lib = new window.Plotter.Library(__libOptions)

    # Get the href Root.
    if location.origin.includes(":5000")
      __href = "http://dev.nwac.us"
    else
      __href = location.origin

    # Defaults
    defaults =
      templateId: null
      uuid: @lib.uuid()
      href: __href
      target: null
      dateFormat: "%Y-%m-%dT%H:%M:%SZ"
      refresh: 500
      updateLength: 168
      updateLimit: 6
      width: null
    @options = @lib.mergeDefaults(options, defaults)

    # Access Token & Admin
    __accessToken =
      token: null
      admin: false
    access = @lib.mergeDefaults(accessToken, __accessToken)

    @isAdmin = ->
      return access.admin

    # Define the Interface (Sub-Method Handlers)
    @i =
      api: new window.Plotter.API(access.token)
      sapi: new window.Plotter.API(access.token, false)
    @i.template = new window.Plotter.Template(@)
    @i.controls = new window.Plotter.Controls(@)
    @i.initialsync = new window.Plotter.InitialSync(@)
    @i.livesync = new window.Plotter.LiveSync(@)
    @i.zoom = new window.Plotter.Zoom(@)
    @i.crosshairs = new window.Plotter.Crosshairs(@)
    @i.specs = new window.Plotter.Specs()
    @i.colors = new window.Plotter.Colors()

    # Define the Plots
    @plots = []
    @updates = 0

    @isReady = ->
      return @updates <= @options.updateLimit

  initialize: ->
    # Initialize the Plotter
    @i.template.get()
    @initializePlots()
    @i.initialsync.stageAll()
    @append()
    #@listen(true)
    @listen()

  initializePlots: ->
    # Initialize the Plot Arrays
    _template = @i.template.full()
    for key, row of _template
      _plotRow =
        proto: null
        __data__: []
      @plots[key] = _plotRow

  listen: (test) ->
    for plotId, plot of @plots
      if plot?
        if plot.proto.initialized
          state = plot.proto.getState()
          for dataSetId, request of state.request.data
            # Min-Sided Events
            if (
              request.min is true and @isReady() and
              plot.proto.state.requested.data[dataSetId].min is false
            )
              @updates++
              plot.proto.state.requested.data[dataSetId].min = true
              @i.livesync.prepend(plotId, dataSetId, state)
            # Max-Sided Events
            if (
              request.max is true and @isReady() and
              plot.proto.state.requested.data[dataSetId].max is false
            )
              @updates++
              plot.proto.state.requested.data[dataSetId].max = true
              @i.livesync.append(plotId, dataSetId, state)

    if !test
      setTimeout(Plotter.Handler.prototype.listen.bind(@), @options.refresh)

  append: ->
    _ = @

    # Append the Plots
    for key, row of @plots
      row.uuid = @lib.uuid()
      $(@options.target).append("<div id=\"outer-#{row.uuid}\"></div>")

      # Build the Options
      _options = @i.template.forPlots(key)
      _options = @i.colors.getInitial(_options)
      _options.target = "\#outer-#{row.uuid}"
      _options.uuid = row.uuid
      if @options.width?
        _options.width = @options.width

      # Initialize the Line Plot
      row.proto = new window.Plotter.LinePlot(@, row.__data__, _options)
      row.proto.preAppend()
      row.proto.append()

      # Append controls
      @i.controls.append(key)

    # Template Save Control.
    @appendSave()

  remove: (plotId) ->
    # Remove a plotId
    $(@plots[plotId].proto.options.target).fadeOut(500, ->
      $(this).remove())
    @i.template.removePlot(plotId)
    delete @plots[plotId]

  move: (plotId, direction) ->
    # Move the plotId.
    _template = @i.template.template
    _primary = _template[plotId]
    _pageOrder = _primary.pageOrder
    selected = $(@plots[plotId].proto.options.target)
    if direction is 'up'
      if _pageOrder > 1
        _tradeKey = @lib.indexOfValue(
          _template, "pageOrder", _pageOrder-1)
        _swap = _template[_tradeKey]
        _primary.pageOrder--
        _swap.pageOrder++
        selected.prev().insertAfter(selected)
    else if direction is 'down'
      if _pageOrder < _template.length
        _tradeKey = @lib.indexOfValue(
          _template, "pageOrder", _pageOrder+1)
        _swap = _template[_tradeKey]
        _primary.pageOrder++
        _swap.pageOrder--
        selected.next().insertBefore(selected)

  add: (type) ->
    # Add a new plot.
    uuid = @lib.uuid()
    _target = "outer-#{uuid}"
    plot =
      pageOrder: @i.template.plotCount() + 1
      type: type
      target: '#' + _target
      y: []

    html = "<div id=\"#{_target}\"></div>"
    $(@options.target).append(html)

    _key = @i.template.add(plot)
    @plots[_key] = {}

    @plots[_key].proto = new window.Plotter.LinePlot(@, [[]], plot)
    @plots[_key].proto.preAppend()
    @plots[_key].proto.options.plotId = _key
    @plots[_key].proto.options.uuid = uuid
    @appendSave()

  initializePlot: (plotId, variable, title) ->
    # Initialize the Plot Variable.
    _yOptions = @i.specs.getOptions(variable, null)
    @i.template.template[plotId].x = $.extend(
      true, {}, @i.template.template[0].x)
    @i.template.template[plotId].y = [_yOptions]
    _revisedOptions =  @i.template.forPlots(plotId)
    @plots[plotId].proto.options.x = _revisedOptions.x
    @plots[plotId].proto.options.y = _revisedOptions.y

    # Append Controls on the New Plot
    @i.controls.append(plotId)

    # Remove the Temp Methods
    @plots[plotId].proto.removeTemp()

  addStation: (plotId, dataLoggerId) ->
    # Add another data logger to the plot.
    if !@plots[plotId].proto.initialized
      # Add to an empty plot.
      @plots[plotId].proto.options.y[0].dataLoggerId = dataLoggerId
      @plots[plotId].proto.options.y[0].color = @i.colors.get(dataLoggerId)
      @i.initialsync.add(plotId)
      @i.controls.updateStationDropdown(plotId)
      @i.controls.updateStationMap(plotId)
      return true

    # Add another station.
    _state = @plots[plotId].proto.getState()
    maxDatetime = _state.range.data[0].max.getTime()

    # Build Options
    _yOptions = $.extend(true, {}, @plots[plotId].proto.options.y[0])
    _yOptions.dataLoggerId = dataLoggerId
    _yOptions.color = @i.colors.get(dataLoggerId)
    dataSetId = @plots[plotId].proto.options.y.push(_yOptions) - 1

    # Update Controls.
    @i.controls.updateStationDropdown(plotId)
    @i.controls.updateStationMap(plotId)
    @i.livesync.add(plotId, dataSetId, _state)
    return true

  removeStation: (plotId, dataLoggerId) ->
    _key = @lib.indexOfValue(@plots[plotId].proto.options.y, "dataLoggerId",
      dataLoggerId)

    if _key > 0
      delete @i.template.template[plotId].y[_key]
      @plots[plotId].proto.removeData(_key)
      @plots[plotId].proto.getDefinition()
      @plots[plotId].proto.update()

      @i.controls.updateStationDropdown(plotId)
      @i.controls.updateStationMap(plotId)
    @i.controls.removeSpinner(plotId)

  appendSave: ->
    # Template Save Control.
    $("#save-#{@options.uuid}").parent().remove()
    if @isAdmin() or @options.uuid?
      $(@options.target).append(
        "<small><a style=\"cusor:pointer\"
          id=\"save-#{@options.uuid}\">Save Template</a></small>")
      $("#save-#{@options.uuid}").on("click", (event) ->
        _.i.template.put()
      )
