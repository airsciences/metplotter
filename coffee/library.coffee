#
#   NWAC Support Library
#

if !Object.mergeDefaults
  Object.mergeDefaults = (args, defaults) ->
    merge = {}
    for sub in defaults
      merge[sub] = defaults[sub]
    for sub1 in args
      merge[sub1] = args[sub1]
    merge
