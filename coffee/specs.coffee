window.Plotter ||= {}

window.Plotter.Specs = class Specs
  constructor: ->

  getOptions: (variable, dataLoggerId) ->
    _bounds = @getVariableBounds(variable)
    _info = @getVariableInfo(variable)
    yOptions =
      dataLoggerId: dataLoggerId
      variable: variable
      plotType: @getPlotType(variable)
      min: _bounds.min
      max: _bounds.max
      maxBar: _bounds.maxBar
      title: _info.title
      units: _info.units
    return yOptions

  getVariableBounds: (variable) ->
    bounds =
      # {"variable": "battery_voltage", "title": "Battery Voltage"},
      battery_voltage:
        min: 8
        max: 16
        maxBar: null
      # {"variable": "temperature", "title": "Temperature"},
      temperature:
        min: null
        max: null
        maxBar: 32
      # {"variable": "equip_temperature", "title": "Equipment Temperature"},
      equip_temperature:
        min: null
        max: null
        maxBar: null
      # {"variable": "relative_humidity", "title": "Relative Humidity"},
      relative_humidity:
        min: 0
        max: 100
        maxBar: null
      # {"variable": "net_solar", "title": "Net Solar"},
      net_solar:
        min: 0
        max: 800
        maxBar: null
      # {"variable": "snow_depth", "title": "Snow Depth"},
      snow_depth:
        min: 0
        max: 200
        maxBar: null
      # {"variable": "snowfall_24_hour", "title": "24-Hr Snowfall"},
      snowfall_24_hour:
        min: 0
        max: 24
        maxBar: null
      # {"variable": "intermittent_snow", "title": "Intermittent Snow"}
      intermittent_snow:
        min: 0
        max: null
        maxBar: null
      # {"variable": "wind_direction", "title": "Wind Direction"},
      wind_direction:
        min: 0
        max: 350
        maxBar: null
      # {"variable": "precipitation", "title": "Precipitation"},
      precipitation:
        min: 0
        max: 0.35
        maxBar: null
      # {"variable": "wind_speed_average", "title": "Wind Speed"},
      wind_speed_average:
        min: 0
        max: null
        maxBar: null
      # {"variable": "solar_pyranometer", "title": "Solar Pyranometer"},
      solar_pyranometer:
        min: 0
        max: null
        maxBar: null
      # {"variable": "barometric_pressure", "title": "Barometric Pressure"},
      barometric_pressure:
        min: 950
        max: 1050
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
      solar_pyranometer:
        title: "Solar Pyranometer"
        units: "W/m2"
      relative_humidity:
        title: "Relative Humidity"
        units: "%"
      barometric_pressure:
        title: "Barometric Pressure"
        units: "mb"
      snow_depth:
        title: "Snow Depth"
        units: "\""
      snowfall_24_hour:
        title: "24-Hour Snowfall"
        units: "\""
      intermittent_snow:
        title: "Intermittent Snow"
        units: "\""
      wind_direction:
        title: "Wind Direction"
        units: ""
      precipitation:
        title: "Precipitation"
        units: "\""
      temperature:
        title: "Temperature"
        units: "°F"
      equip_temperature:
        title: "Equipment Temperature"
        units: "°F"
      wind_speed_average:
        title: "Wind Speed"
        units: "mph"
    return info[variable]

  getPlotType: (variable) ->
    return switch variable
      when "precipitation" then "bar"
      else "line"

  getPlotDecimals: (variable) ->
    return switch variable
      when "precipitation" then 2
      else 1
