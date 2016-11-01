#
#   NWAC Coffee Data Manager
#

window.Plotting ||= {}

window.Plotting.Data = class Data
  constructor: (data) ->
    @preError = "Data."
    preError = "#{@preError}.constructor(data)"
    if data not instanceof Array
      console.log("#{preError} data not of type array.")
      return
    # Deep Copy the Array
    @data = $.extend(true, [], data)

    @test = (row, joinRow, onKeys) ->
      # Test the row match
      _required = onKeys.length
      _calculated = 0
      testResult = false

      for testRow in onKeys
        if row[testRow] == joinRow[testRow]
          _calculated++
      
      if _calculated == _required
        testResult = true
      return testResult

  join: (data, onKeys) ->
    # Join a new data set.
    result = []
    
    _protoKeys = Object.keys(@data[0])
    _dataKeys = Object.keys(data[0])

    if data.length > @data.length
      _primary = $.extend(true, [], data)
      _secondary = $.extend(true, [], @data)
    else
      _primary = $.extend(true, [], @data)
      _secondary = $.extend(true, [], data)
        
    for key, row of _primary
      # console.log("Running Row 1 of _primary (key, row)", key, row)
      for _key, _row of _secondary
        _test = @test(row, _row, onKeys)
        # console.log("Running Row 2 of _secondary (key, row, test)",
        #   _key, _row, _test)
        _len = result.push($.extend(true, {}, row))
        if _test
          # row matches.
          for _subKey, _value of _row
            if _subKey not in onKeys
              result[_len - 1][_subKey + "_2"] = _value

    @data = $.extend(true, [], data)
    return @data

  merge: (data, onKeys) ->
    # Join a new data set.
    result = []
    
    _protoKeys = Object.keys(@data[0])
    _dataKeys = Object.keys(data[0])

    if data.length > @data.length
      _primary = $.extend(true, [], data)
      _secondary = $.extend(true, [], @data)
    else
      _primary = $.extend(true, [], @data)
      _secondary = $.extend(true, [], data)
        
    for key, row of _primary
      for _key, _row of _secondary
        _test = @test(row, _row, onKeys)
        _len = result.push($.extend(true, {}, row))
        if _test
          for _subKey, _value of _row
            if _subKey not in onKeys
              result[_len - 1][_subKey] = _value

    @data = $.extend(true, [], data)
    return @data

  append: (data, onKeys) ->
    # Append/Prepend new data.
    _primary = $.extend(true, [], @data)
    _secondary = $.extend(true, [], data)
    
    for key, row of _primary
      for _key, _row of _secondary
        _test = @test(row, _row, onKeys)
        if _test
          for _subKey, _value of _row
            if _subKey not in onKeys
              _primary[key][_subKey] = _value
          delete _secondary[_key]

     _total = _primary.concat(_secondary)
     @data = $.extend(true, [], _total)
     return @data
     
  sub: (start, end) ->
    # Trim the data set.
    @data = $.extend(true, [], @data.slice(start, end))
    return @data

  get: ->
    return $.extend(true, [], @data)
