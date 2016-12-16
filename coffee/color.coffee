#
#   Northwest Avalanche Center (NWAC)
#   Plotter Tools - Template Manager
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotter ||= {}

window.Plotter.Colors = class Colors
  constructor: ->
    __colors =
      light: [
        "rgb(53, 152, 219)",
        "rgb(241, 196, 14)",
        "rgb(155, 88, 181)",
        "rgb(27, 188, 155)",
        "rgb(52, 73, 94)",
        "rgb(231, 126, 35)",
        "rgb(45, 204, 112)",
        "rgb(232, 76, 61)",
        "rgb(149, 165, 165)"
      ]
      dark: [
        "rgb(45, 62, 80)",
        "rgb(210, 84, 0)",
        "rgb(39, 174, 97)",
        "rgb(192, 57, 43)",
        "rgb(126, 140, 141)",
        "rgb(42, 128, 185)",
        "rgb(239, 154, 15)",
        "rgb(143, 68, 173)",
        "rgb(23, 160, 134)"
      ]

    @color = (shade, key) ->
      return __colors[shade][key]

    @templateColors = {}

  getInitial: (options) ->
    # Set the initial option colors
    for key, row of options.y
      row.color = @get(row.dataLoggerId)
    return options

  get: (dataLoggerId) ->
    # Return the Color from the ordered list.
    _length = Object.keys(@templateColors).length
    if _length is 0
      _length = Math.round(Math.random() * (7 - 1) + 1)
    _offset = (_length*2)%7
    if (@templateColors[dataLoggerId]?) is false
      @templateColors[dataLoggerId] = @color("light", _offset)
    return @templateColors[dataLoggerId]
