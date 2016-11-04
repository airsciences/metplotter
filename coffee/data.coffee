#
#   Northwest Avalanche Center (NWAC)
#   Plotting Tools - Data Process Tool (data.coffee)
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotting ||= {}

window.Plotting.Data = class Data
  constructor: (data) ->
    @preError = "Plotting.Data."
    preError = "#{@preError}.constructor(...)"
    if data not instanceof Array
      console.log("#{preError} data not of type array.")
      return
    # Deep Copy the Array
    @data = $.extend(true, [], data)
    @sourceCount = 1

    _len = @data.length-1
    for i in [0.._len]
      if @data[i] is undefined
        console.log("#{preError} on construct, @data[i] is (i, row)",
        i, @data[i])

    @test = (row, joinRow, onKeys) ->
      # Test the row match
      preError = "#{@preError}test(...):"
      _required = onKeys.length
      _calculated = 0
      testResult = false

      for testRow in onKeys
        if row[testRow] is undefined
          throw new Error("#{preError} key '#{testRow}'
            not found in primary data set.")
        if joinRow[testRow] is undefined
          throw new Error("#{preError} key '#{testRow}'
            not found in joining data set.")
        if row[testRow] instanceof Date
          if row[testRow].getTime() == joinRow[testRow].getTime()
            _calculated++
        else
          if row[testRow] == joinRow[testRow]
            _calculated++

      if _calculated == _required
        testResult = true
      return testResult

  join: (data, onKeys) ->
    # Join a new data set.
    preError = "#{@preError}.join(data, onKeys)"
    result = []
    _offset = "_#{parseInt(@sourceCount+1)}"
    
    _protoKeys = Object.keys(@data[0])
    _dataKeys = Object.keys(data[0])

    if data.length > @data.length
      _primary = $.extend(true, [], data)
      _secondary = $.extend(true, [], @data)
    else
      _primary = $.extend(true, [], @data)
      _secondary = $.extend(true, [], data)
        
    for key, row of _primary
      _len = result.push($.extend(true, {}, row))
      for _key, _row of _secondary
        _test = @test(row, _row, onKeys)
        if _test
          for _subKey, _value of _row
            if _subKey not in onKeys
              result[_len - 1][_subKey + _offset] = _value
          _secondary.splice(_key, 1)
          break

    @sourceCount++
    @data = @_clean(result)
    #@_tryError(@data, preError)
    return @data

  merge: (data, onKeys) ->
    # Merge a new data set (overwrites original value with subkey match
    #   appends new)
    preError = "#{@preError}.merge(data, onKeys)"
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
      _len = result.push($.extend(true, {}, row))
      for _key, _row of _secondary
        _test = @test(row, _row, onKeys)
        if _test
          for _subKey, _value of _row
            if _subKey not in onKeys
              result[_len - 1][_subKey] = _value
          _secondary.splice(_key, 1)
          break

    @data = @_clean(result)
    #@_tryError(@data, preError)
    return @data

  append: (data, onKeys) ->
    preError = "#{@preError}.append(data, onKeys)"
    
    # Append/Prepend new data.
    _primary = $.extend(true, [], @data)
    _secondary = $.extend(true, [], data)
    
    # Overwrite @data with overlapping new data
    for key, row of _primary
      for _key, _row of _secondary
        _test = @test(row, _row, onKeys)
        if _test
          for _subKey, _value of _row
            if _subKey not in onKeys
              _primary[key][_subKey] = _value
          _secondary.splice(_key, 1)

    result = _primary.concat(_secondary)

    @data = @_clean(result)
    #@_tryError(@data, preError)
    return @data
     
  sub: (start, end) ->
    # Trim the data set.
    @data = @_clean($.extend(true, [], @data.slice(start, end)))
    return @data

  get: ->
    return $.extend(true, [], @data)

  getSourceCount: ->
    return @sourceCount

  _clean: (data) ->
    _data = $.extend(true, [], data)
    _len = _data.length - 1
    
    for i in [0.._len]
      if _data[i] is undefined
        _data.splice(i, 1)
    return $.extend(true, [], _data)

  _tryError: (data, preError) ->
    _len = data.length-1
    for i in [0.._len]
      if data[i] is undefined
        console.log("@data[i] is (i, row)", i, row)
        throw new Error("#{preError} undefined row")
