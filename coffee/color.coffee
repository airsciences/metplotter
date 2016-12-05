#
#   Northwest Avalanche Center (NWAC)
#   Plotter Tools - Template Manager
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotter ||= {}

window.Plotter.Color = class Color
  constructor: (initial) ->
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

    @getColor = (shade, key) ->
      # Return the Color from the ordered list.
      return @options.colors[shade][key]
