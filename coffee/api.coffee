#
#   Northwest Avalanche Center (NWAC)
#   Plotter Tools - API XHR (GET/PUT/POST/DELETE) (api.coffee)
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotter ||= {}

window.Plotter.API = class API
  constructor: (accessToken, async) ->
    @preError = "Plotter.API"
    preError = "#{@preError}.constructor()"

    # Configurations
    @async = true
    if typeof async != "undefined"
      @async = async

    # Attach Authentication
    @getAccessToken = () ->
      accessToken

    @getAccessTokenValue = () ->
      if accessToken is undefined
        throw new Error("#{preError} Access token is not defined.")
      "Token #{accessToken}"

  build: () ->
    # Build the XHR Class
    preError = "#{@preError}.build()"

    xhr = null
    if XMLHttpRequest
      xhr = new XMLHttpRequest
    else
      try
        xhr = new ActiveXObject "Msxml2.XMLHTTP"
      catch error
        try
          xhr = new ActiveXObject "Microsoft.XMLHTTP"
        catch error
          console.error preError, 'Cannot specify XMLHTTPRequest (error)', error
    return xhr

  get: (uri, args, callback) ->
    # Standard GET Method
    preError = "#{@preError}.get(uri, params, callback)"

    # Initialize the Object
    xhr = @build()

    if typeof callback != 'undefined'
      xhr.onreadystatechange = () ->
        # Handle Waiting & Error Cases
        if (xhr.readyState != 4) then return
        if (xhr.status != 200 && xhr.status != 304)
          console.log "#{preError} HTTP error, (status): #{xhr.status}"
          xhr = null
          return

        # Set the Result
        result =
          response: xhr.response
          responseText: xhr.responseText
          responseJSON: null
        try
          result.responseJSON = JSON.parse result.responseText
        catch error
          result.responseJSON = null

        # Run the Callback
        callback result

    # Create a 'GET' formatted argument string
    args = @encodeArgs 'GET', args

    try
      xhr.open 'GET', uri + args, @async
      xhr.setRequestHeader "Authorization", @getAccessTokenValue()
      xhr.send null
    catch error
      throw new Error(preError + ", " + error)

    return

  put: (uri, args, callback) ->
    # Standard PUT Method
    preError = "#{@preError}.put(uri, params, callback)"

    # Initialize the Object
    xhr = @build()

    if typeof callback != 'undefined'
      xhr.onreadystatechange = () ->
        # Handle Waiting & Error Cases
        if (xhr.readyState != 4) then return
        if (xhr.status != 200 && xhr.status != 304)
          console.log "#{preError} HTTP error, (status): #{xhr.status}"
          xhr = null
          return

        # Set the Result
        result =
          response: xhr.response
          responseText: xhr.responseText
          responseJSON: null
        try
          result.responseJSON = JSON.parse result.responseText
        catch error
          result.responseJSON = null

        # Run the Callback
        callback result

    # Create a 'GET' formatted argument string
    args = @encodeArgs 'PUT', args

    try
      xhr.open 'PUT', uri, @async
      xhr.setRequestHeader "Authorization", @getAccessToken()
      xhr.setRequestHeader "Content-Type", "application/json;charset=UTF-8"
      xhr.send args
    catch error
      console.log preError + 'catch(error).', error

    return

  post: (uri, args, callback) ->
    # Standard POST Method
    preError = "#{@preError}.post(uri, params, callback)"

    # Initialize the Object
    xhr = build()

    if typeof callback != 'undefined'
      xhr.onreadystatechange = () ->
        # Handle Waiting & Error Cases
        if (xhr.readyState != 4) then return
        if (xhr.status != 200 && xhr.status != 304)
          console.log "#{preError} HTTP error, (status): #{xhr.status}"
          xhr = null
          return

        # Set the Result
        result =
          response: xhr.response
          responseText: xhr.responseText
          responseJSON: null
        try
          result.responseJSON = JSON.parse result.responseText
        catch error
          result.responseJSON = null

        # Run the Callback
        callback result

    # Create a 'GET' formatted argument string
    args = @encodeArgs 'POST', args

    try
      xhr.open 'POST', uri, @async
      xhr.setRequestHeader "Authorization", @getAccessToken()
      xhr.setRequestHeader "Content-Type", "application/json;charset=UTF-8"
      xhr.send args
    catch error
      console.log preError + 'catch(error).', error

    return

  delete: (uri, args, callback) ->
    # Standard DELETE Method
    preError = "#{@preError}.delete(uri, params, callback)"

    # Initialize the Object
    xhr = @build()

    if typeof callback != 'undefined'
      xhr.onreadystatechange = () ->
        # Handle Waiting & Error Cases
        if (xhr.readyState != 4) then return
        if (xhr.status != 200 && xhr.status != 304)
          console.log "#{preError} HTTP error, (status): #{xhr.status}"
          xhr = null
          return

        # Set the Result
        result =
          response: xhr.response
          responseText: xhr.responseText
          responseJSON: null
        try
          result.responseJSON = JSON.parse result.responseText
        catch error
          result.responseJSON = null

        # Close the Object & Run the Callback
        callback result

    # Create a 'GET' formatted argument string
    args = @encodeArgs 'DELETE', args

    try
      xhr.open 'DELETE', uri, @async
      xhr.setRequestHeader "Authorization", @getAccessToken()
      xhr.setRequestHeader "Content-Type", "application/json;charset=UTF-8"
      xhr.send args
    catch error
      console.log preError + 'catch(error).', error

    return

  encodeArgs: (type, json_args) ->
    # Encode an arguments set from JSON for a PUT/POST/GET Method
    preError = "#{@preError}encodeArgs(type, json_args)"
    argStr = ""
    aCount = 0

    # Parse to JSON if string provided
    if typeof json_args == 'string'
      try
        json_args = JSON.parse(json_args)
      catch error
        console.log(preError + 'catch(error).', error)

    # Prepare for the XHR method action
    if type == 'POST' || type == 'PUT'
      argStr = JSON.stringify json_args
    else if type == 'GET'
      for argument of json_args
        if aCount == 0
          argStr = "?" + argument + "=" + json_args[argument]
        else
          argStr = argStr + "&" + argument + "=" + json_args[argument]
        aCount++

    return argStr
