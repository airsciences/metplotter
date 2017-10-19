window.Plotter ||= {}

window.Plotter.Handler = class Handler
  constructor: (accessToken, options, plots) ->
    @preError = "Plotter.Handler"

    # Define the Library
    __libDateFormat = if options.dateFormat then options.dateFormat
    else "%Y-%m-%dT%H:%M:%S-08:00"
    __libOptions =
      dateFormat: __libDateFormat
    @lib = new window.Plotter.Library(__libOptions)

    # Get the href Root.
    if location.origin.indexOf(":5000") >= 0
      __href = "http://dev.nwac.us"
    else
      __href = location.origin

    # Defaults
    defaults =
      templateId: null
      uuid: null
      localId: @lib.uuid()
      href: __href
      target: null
      dateFormat: "%Y-%m-%dT%H:%M:%S-08:00"
      refresh: 500
      futureWait: 180000
      updateLength: 168
      initialLength: 168
      requestPaddingInterval: 336
      newDataInterval: 168
      minUpdateLength: 0
      updateLimit: 6
      width: null
      responsive: false
    @options = @lib.mergeDefaults(options, defaults)

    # Refresh Wait Counters
    @waitCounter = parseInt(@options.futureWait / @options.refresh)
    @refreshCounter = 0

    # Access Token & Admin
    __accessToken =
      token: null
      csrfToken: null
      admin: false
    access = @lib.mergeDefaults(accessToken, __accessToken)

    @isAdmin = ->
      return access.admin

    # Define the Interface (Sub-Method Handlers)
    @i =
      api: new window.Plotter.API(access)
      sapi: new window.Plotter.API(access, false)
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
    @legends = []
    @updates = 0
    @bandDomain = null

    @isReady = ->
      return @updates <= @options.updateLimit

  initialize: ->
    # Initialize the Plotter
    @i.template.get()
    @appendLoading()
    @initializePlots()
    @i.initialsync.stageAll()

    _ = @

    # Wait for append
    __wait = () ->
      if _.i.initialsync.isReady()
        _.append()
        _.removeLoading()
        _.listen()
      else
        setTimeout(__wait, 100)
        return true

    __wait()

  initializePlots: ->
    # Initialize the Plot Arrays
    _template = @i.template.full()
    for key, row of _template
      _plotRow =
        proto: null
        __data__: []
      @plots[key] = _plotRow

  listen: (test) ->
    @refreshCounter++
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
            _now = new Date()
            if (
              (@refreshCounter % @waitCounter) is 0 or
              (plot.proto.state.range.data[0].max.getTime() <
              (_now.getTime() - @options.newDataInterval * 3600000))
            )
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
      _options.requestInterval = @options.requestPaddingInterval
      _options.uuid = row.uuid
      if @options.width?
        _options.width = @options.width

      # Initialize the Line Plot
      if _options.plotType is "bar"
        row.proto = new window.Plotter.BarPlot(@, row.__data__, _options)
      else
        row.proto = new window.Plotter.LinePlot(@, row.__data__, _options)
      row.proto.preAppend()
      row.proto.append()
      # row.proto.appendZoomTarget(row.proto.transform)

      # Append controls
      @i.controls.append(key)

      # Append the Legend
      @legends[key] = new window.Plotter.Legend(@, key)
      #@legends[key].append()

    # Set the Global Band Domain
    @bandDomain = @plots[0].proto.definition.x1

    # Template Save Control.
    @appendSave()
    @appendPoweredBy()

    if @options.responsive
      @__windowWidth = $(window).width()
      $(window).on('resize', ->
        _.resize()
      )

  appendLoading: ->
    # Append Temp
    $(@options.target).append("<div class=\"plotter-loading\"
      style=\"text-align: center; \">
        <span>
          <i class=\"icon-spinner icon-spin icon-large\"></i>
          Loading Plots...
        </span>
      </div>")

  removeLoading: ->
    $(@options.target).find(".plotter-loading").remove()

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

  add: (type, variable) ->
    # Add a new plot.
    uuid = @lib.uuid()
    _target = "outer-#{uuid}"
    plot =
      width: @options.width
      pageOrder: @i.template.plotCount() + 1
      type: type
      target: '#' + _target
      requestInterval: @options.requestPaddingInterval
      y: []

    html = "<div id=\"#{_target}\"></div>"
    $(@options.target).append(html)

    _key = @i.template.add(plot)
    @plots[_key] = {}

    _plotType = @i.specs.getPlotType(variable)

    # Special Precip LinePlot
    if variable is "precipitation_line"
      variable = "precipitation"
      _plotType = "line"

    _decimals = @i.specs.getPlotDecimals(variable)

    if _plotType is "bar"
      @plots[_key].proto = new window.Plotter.BarPlot(@, [[]], plot)
    else
      @plots[_key].proto = new window.Plotter.LinePlot(@, [[]], plot)
    @plots[_key].proto.preAppend()
    @plots[_key].proto.options.plotType = _plotType
    @plots[_key].proto.options.plotId = _key
    @plots[_key].proto.options.uuid = uuid
    @plots[_key].proto.options.decimals = _decimals
    @appendSave()

    # Update Options
    _yOptions = @i.specs.getOptions(variable, null)

    for template in @i.template.template
      if template != undefined
        @i.template.template[_key].x = $.extend(
          true, {}, template.x)
        break
    @i.template.template[_key].y = [_yOptions]

    _revisedOptions =  @i.template.forPlots(_key)
    @plots[_key].proto.options.x = _revisedOptions.x
    @plots[_key].proto.options.y = _revisedOptions.y

    # Append the Plot Controls
    @i.controls.append(_key)

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

    if @plots[plotId].proto.options.plotType is 'bar'
      @i.controls.removeSpinner(plotId)
      alert("Bar plots only support one station.
        Please add a new Precipitation Line Plot to view multiple stations.")
      return false

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
    _ = @
    $("#save-#{@options.localId}").parent().remove()
    if @isAdmin() or @options.uuid?
      $(@options.target).prepend(
        "<small><a style=\"cursor:pointer\"
          id=\"save-#{@options.localId}\">Save Graph</a></small>")
      $("#save-#{@options.localId}").on("click", (event) ->
        _last = ": Last Saved: " + _.lib.getNowDisplay()
        if $("#save-#{_.options.localId}").html() == "Save Graph"
          @.append(_last)
        else
          $("#save-#{_.options.localId}").html("Save Graph#{_last}")

        _.i.template.put()
      )

  appendPoweredBy: ->
    $(@options.target).parent().append("<p
      style=\"font-size: 11px; font-weight: 300\">Powered by Air Sciences Inc. |
      <a href=\"http://airsci.com\">www.airsci.com</a></p>")

  resize: ->
    # Resize all plots & subs
    # kFactor = $(window).width() / @__windowWidth

    for plotId, plot of @plots
      __plotSize = plot.proto.definition.dimensions.width
      plot.proto.resize()
      kFactor = plot.proto.definition.dimensions.width / __plotSize
      @legends[plotId].resize()
      @i.controls.resize(plotId)
      # plot.proto.setZoomTransform(d3.zoomIdentity)
      # plot.proto.setZoomTransform(
      #    @i.zoom.scale(kFactor, plot.proto.transform, __plotSize))
      # plot.proto.drawZoomTransform(plot.proto.transform)

    # @__windowWidth = $(window).width()
