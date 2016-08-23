#
#   NWAC Plotting API XMLHTTPRequest.
#

window.Plotting ||= {}

window.Plotting.API = class API
  constructor: (accessToken) ->
    @preError = "Plotting.API."
    preError = "#{@preError}constructor()"
    
    # Pre-Define Master Variables
    @xhr = null
    @async = false

    # @build()

    # @xhr.onreadystatechange = () ->
    #   switch _.xhr.readyState
    #     when 4
    #       # Request Complete
    #       _.xhr = null
    #     when 3
    #     when 2
    #       # Connection Opened
    #     when 1
    #       # Waiting
    #     else
    #       # Error State
    
  build: () ->
    # Build the XHR Class
    preError = "#{@preError}.build()"

    @xhr = null
    if XMLHttpRequest
      @xhr = new XMLHttpRequest
    else
      try
        @xhr = new ActiveXObject "Msxml2.XMLHTTP"
      catch error
        try
          @xhr = new ActiveXObject "Microsoft.XMLHTTP"
        catch error
          console.error preError, 'Cannot specify XMLHTTPRequest (error)', e

  get: (uri, params, callback) ->
    # Standard GET Method
    preError = "#{@preError}.get(uri, params, callback)"
    
    # Initialize the Object
    @build()
    _ = @
    
    if typeof callback != 'undefined'
      @xhr.onreadystatechange = () ->
        # Handle Waiting & Error Cases
        if (data.xhr.readyState != 4) then return
        if (data.xhr.status != 200 && data.xhr.status != 304)
          console.log "#{preError} HTTP error, (status): #{_.xhr.status}"
          _.xhr = null
          return
        
        # Set the Result
        result =
          response: _.xhr.response,
          responseText: _.xhr.responseText,
          responseJSON: null
        try
          result.responseJSON = JSON.parse result.responseText
        catch error
          result.responseJSON = null
        
        # Close the Object & Run the Callback
        _.xhr = null
        callback result
      
  put: () ->
    # Standard PUT Method
       
  post: () ->
    # Standard POST Method
      
  delete: () ->
    # Standard DELETE Method
