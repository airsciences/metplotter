window.Plotter ||= {}

window.Plotter.Now = class Now
  constructor: (format, datetime) ->
    @parse = (datetime) ->
      if datetime.includes("now")
        newDatetime = new Date()
        if datetime.includes("(")
          _offset = parseInt(datetime.replace("(", "")
            .replace(")", "").replace("now", ""))
          newDatetime = new Date(newDatetime.getTime() + (_offset * 3600000))
        datetime = format(newDatetime)
      return datetime

    # Process the datetime.
    @datetime = @parse(datetime)
    return @datetime

  set: (datetime) ->
    # Set the datetime
    @datetime = @parse(datetime)
    return true

  get: ->
    return @datetime
