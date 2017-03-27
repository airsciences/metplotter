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
        "rgb(102,194,165)",
        "rgb(252,141,98)",
        "rgb(141,160,203)",
        "rgb(231,138,195)",
        "rgb(166,216,84)",
        "rgb(255,217,47)",
        "rgb(229,196,148)",
        "rgb(179,179,179)",
        # "rgb(228,26,28)",
        # "rgb(55,126,184)",
        # "rgb(152,78,163)",
        # "rgb(77,175,74)",
        # "rgb(255,127,0)",
        # "rgb(166,86,40)",
        # "rgb(247,129,191)",
        # "rgb(224,224,20)",
        # "rgb(140,140,140)",
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
    #if _length is 0
    #  _length = Math.round(Math.random() * (7 - 1) + 1)
    _offset = (_length*2)%7
    if (@templateColors[dataLoggerId]?) is false
      @templateColors[dataLoggerId] = @color("light", _offset)
    return @templateColors[dataLoggerId]
