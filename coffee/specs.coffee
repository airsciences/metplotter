window.Plotter ||= {}

window.Plotter.Specs = class Specs
  constructor: ->

  getOptions: (variable, dataLoggerId) ->
    _bounds = @getVariableBounds(variable)
    _info = @getVariableInfo(variable)
    yOptions =
      dataLoggerId: dataLoggerId
      variable: variable
      min: _bounds.min
      max: _bounds.max
      maxBar: _bounds.maxBar
      title: _info.title
      units: _info.units
    return yOptions

  getVariableBounds: (variable) ->
    bounds =
      battery_voltage:
        min: 8
        max: 16
        maxBar: null
      net_solar:
        min: 0
        max: 800
        maxBar: null
      relative_humidity:
        min: 0
        max: 102
        maxBar: null
      snow_depth:
        min: 0
        max: 40
        maxBar: null
      wind_direction:
        min: 0
        max: 360
        maxBar: null
      precipitation:
        min: 0
        max: 0.7
        maxBar: null
      temperature:
        min: 0
        max: 60
        maxBar: 32
      wind_speed_average:
        min: 0
        max: 60
        maxBar: null
     return bounds[variable]

  getVariableInfo: (variable) ->
    info =
      battery_voltage:
        title: "Battery Voltage"
        units: "V"
      net_solar:
        title: "Solar Radiation"
        units: "W/m2"
      relative_humidity:
        title: "Relative Humidity"
        units: "%"
      barometric_pressure:
        title: "Barometric Pressure"
        units: "atm"
      snow_depth:
        title: "Snow Depth"
        units: "\""
      wind_direction:
        title: "Wind Direction"
        units: "°"
      precipitation:
        title: "Precipitation"
        units: "\""
      temperature:
        title: "Temperature"
        units: "°F"
      wind_speed_average:
        title: "Wind Speed"
        units: "mph"
    return info[variable]
