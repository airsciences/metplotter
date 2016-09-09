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
    @async = true

    # Attach Authentication
    @getAccessToken = () ->
      accessToken
    
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
          console.error preError, 'Cannot specify XMLHTTPRequest (error)', error

  get: (uri, params, callback) ->
    # Standard GET Method
    preError = "#{@preError}.get(uri, params, callback)"
    
    # Initialize the Object
    @build()
    _ = @
    
    if typeof callback != 'undefined'
      @xhr.onreadystatechange = () ->
        # Handle Waiting & Error Cases
        if (_.xhr.readyState != 4) then return
        if (_.xhr.status != 200 && _.xhr.status != 304)
          console.log "#{preError} HTTP error, (status): #{_.xhr.status}"
          _.xhr = null
          return
        
        console.log "#{preError} (callback)", callback
        # Set the Result
        result =
          response: _.xhr.response
          responseText: _.xhr.responseText
          responseJSON: null
        try
          result.responseJSON = JSON.parse result.responseText
        catch error
          result.responseJSON = null
        
        # Close the Object & Run the Callback
        _.xhr = null
        callback result

    # Create a 'GET' formatted argument string
    args = @encodeArgs 'GET', args

    try
      @xhr.setRequestHeader "Authorization", @getAccessToken()
      @xhr.open 'GET', uri + args, @async
      @xhr.send null
    catch error
      console.log preError + 'catch(error).', error

    return
      
  put: () ->
    # Standard PUT Method
    
    
    
  post: () ->
    # Standard POST Method
      
  delete: () ->
    # Standard DELETE Method

  encodeArgs: (type, json_args) ->
    # Encode an arguments set from JSON for a PUT/POST/GET Method
    argStr = ""
    aCount = 0

    # Parse to JSON if string provided
    if typeof json_args == 'string'
      try
        json_args = JSON.parse json_args
      catch error
        console.log preError + 'catch(error).', error
    
    # Prepare for the XHR method action
    if type == 'POST' || type == 'PUT'
      argStr = JSON.stringify json_args
    else if type == 'GET'
      for argument of json_args
        if aCount == 0
          argStr = "?" + argument + "=" + args[argument]
        else
          argStr = argStr + "&" + argument + "=" + args[argument]
          aCount++

    return argStr
