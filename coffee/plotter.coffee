window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (accessToken, options, plots) ->
    @preError = "Plotting.Handler"

    # Define the Library
    __libDateFormat = if options.dateFormat then options.dateFormat
    else "%Y-%m-%dT%H:%M:%SZ"
    __libOptions =
      dateFormat: __libDateFormat
    @lib = new window.Plotting.Library(__libOptions)

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
      api: new window.Plotting.API(access.token)
      sapi: new window.Plotting.API(access.token, false)
    @i.template = new window.Plotting.Template(@)
    @i.controls = new window.Plotting.Controls(@)

    @updates = 0
    @endpoint = null

  initialize: ->
    # Initialize the Plotter
