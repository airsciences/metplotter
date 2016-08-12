#
#   NWAC - Plotting & Authentication handler.
#

window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (auth, options, plots) ->
    @endpoint = null
    access =
      token: null
      expires: null
      expired: true

    @hasAccess = () ->
      now = new Date
      if access.expires < now
        access.expired = true
          
  alert: (message, type) ->
    # Fire Modal w/ Message
