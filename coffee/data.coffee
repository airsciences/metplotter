#
#   NWAC Data Merge & Abstract.
#

window.Plotting ||= {}

window.Plotting.Handler = class Handler
  constructor: (access, options, plots) ->
    @preError = "Plotting.Handler"
