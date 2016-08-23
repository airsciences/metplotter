#
#   NWAC Plotting & Authentication handler.
#

window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (access, options, plots) ->
    @options =
      target: null
    @endpoint = null
    access =
      token: null
      expires: null
      expired: true
      
    @api = new window.Plotting.API

    @hasAccess = () ->
      # Calculate if the token has expired.
      if access.expires < new Date
        access.expired = true
      if access.expired then false else true
      

    
  getTemplate: () ->
    # Get the page state from GET vars.
    
    

  append: () ->
    # Master append plots.
    for plot in @plots
      plot
    


  alert: (message, type) ->
    # Fire Modal w/ Message
    
