#
#   NWAC Support Library
#


window.Plotting ||= {}

window.Plotting.Library = class Library
  constructor: (options) ->
    # Define the Library Formatting Options
    defaults =
      dateFormat: "%Y-%m-%dT%H:%M:%SZ"
    __options = @mergeDefaults(defaults, options)

    # Pass-Through Functions
    @parseDate = d3.timeParse(__options.dateFormat)
    @format = d3.utcFormat(__options.dateFormat)

    @getNow = ->
      return @format(new Date())

  mergeDefaults: (args, defaults) ->
    merge = {}
    for key, val of defaults
      merge[key] = val
    for key1, val1 of args
      merge[key1] = val1
    return merge
