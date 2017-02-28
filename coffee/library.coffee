#
#   NWAC Support Library
#


window.Plotter ||= {}

window.Plotter.Library = class Library
  constructor: (options) ->
    # Define the Library Formatting Options
    defaults = {
      dateFormat: "%Y-%m-%dT%H:%M:%SZ",
      timeFormat: "%Y-%m-%dT%H:%MZ-08"
    }
    __options = @mergeDefaults(defaults, options)

    # Pass-Through Functions
    @parseDate = d3.timeParse(__options.dateFormat)
    @format = d3.utcFormat(__options.dateFormat)
    @format2 = d3.timeFormat(__options.timeFormat)

    @getNow = ->
      return @format(new Date())

    @getNow2 = ->
      return @format2(new Date())

  mergeDefaults: (args, defaults) ->
    # Merge Two Objects.
    merge = {}
    for key, val of defaults
      merge[key] = val
    for key1, val1 of args
      merge[key1] = val1
    return merge

  indexOfValue: (array, key, value) ->
    # Return the index of an assoc-object key->value
    index = -1
    if array.length > 0
      for i in [0..(array.length-1)]
        if array[i]?
          if `array[i][key] == value`
            index = i
    return index

  uuid: ->
    # Build a Unique Identifier String
    return (((1+Math.random())*0x100000000)|0).toString(16).substring(1)

  utarget: (prepend) ->
    # Build a Unique HTML Target.
    prepend = prepend.replace '#', ''
    return "#{prepend}-#{@uuid()}"

  toLower: (string) ->
    # Return a lower case string with underscores
    return string.replace(" ", "_").toLowerCase()
