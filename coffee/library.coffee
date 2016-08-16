#
#   NWAC Support Library
#

if !Object.mergeDefaults
  Object.mergeDefaults = (args, defaults) ->
    merge = {}
    for key, val of defaults
      merge[key] = val
    for key1, val1 of args
      merge[key1] = val1
    merge
