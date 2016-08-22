#
#   NWAC Plotting & Authentication handler.
#

window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (access, options, plots) ->
    @endpoint = null
    access =
      token: null
      expires: null
      expired: true

    @hasAccess = () ->
      # Calculate if the token has expired.
      now = new Date
      if access.expires < now
        access.expired = true
      if access.expired then false else true
      
  alert: (message, type) ->
    # Fire Modal w/ Message
    
    
  getTemplate: () ->
    # Get the page state from GET vars.
    
    

  append: () ->
    # Master append plots.
