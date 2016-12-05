window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (access, options, plots) ->
    @preError = "Plotting.Handler"

    # Define the Library
    __libDateFormat = if options.dateFormat then options.dateFormat
    else "%Y-%m-%dT%H:%M:%SZ"
    __libOptions =
      dateFormat: __libDateFormat
    @lib = new window.Plotting.Library(__libOptions)

    # Get the href Root.
    if location.href is "http://localhost:5000"
      __href = "http://dev.nwac.us"
    else
      __href = location.href

    # Defaults
    defaults =
      templateId: null
      href: __href
      target: null
      dateFormat: "%Y-%m-%dT%H:%M:%SZ"
      refresh: 500
      updateLength: 168
    @options = @lib.mergeDefaults(options, defaults)

    # Access Token
    accessToken =
      token: null
      admin: false
    access = @lib.mergeDefaults(options, defaults)

    # Define the Interface (Sub-Method Handlers)
    @i =
      api: new window.Plotting.API(access.token)
      sapi: new window.Plotting.API(access.token, false)
      controls: new window.Plotting.Controls(@, access)

    @updates = 0
    @endpoint = null
