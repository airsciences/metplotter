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
    if location.origin is "http://localhost:5000"
      __href = "http://dev.nwac.us"
    else
      __href = location.origin

    # Defaults
    defaults =
      templateId: null
      href: __href
      target: null
      dateFormat: "%Y-%m-%dT%H:%M:%SZ"
      refresh: 500
      updateLength: 168
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
    @i.colors = new window.Plotter.Colors()

    # Define the Plots
    @plots = []

    ###### Pending Usage:
    @updates = 0
    @endpoint = null

  initialize: ->
    # Initialize the Plotter
    @i.template.get()
    @initializePlots()
    @i.initialsync.stageAll()
    @append()

  initializePlots: ->
    # Initialize the Plot Arrays
    _template = @i.template.full()
    for key, row of _template
      _plotRow =
        proto: null
        __data__: []
      @plots[key] = _plotRow

  append: ->
    # Append the Plots
    for key, row of @plots
      row.uuid = @lib.uuid()
      $(@options.target).append("<div id=\"outer-#{row.uuid}\"></div>")

      # Build the Options
      _options = @i.template.forPlots(key)
      _options = @i.colors.getInitial(_options)
      _options.target = "\#outer-#{row.uuid}"
      _options.uuid = row.uuid

      console.log("Appending w/ options", _options)

      # Initialize the Line Plot
      row.proto = new window.Plotter.LinePlot(@, row.__data__, _options)
      row.proto.preAppend()
      row.proto.append()
