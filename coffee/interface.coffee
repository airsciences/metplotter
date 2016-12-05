#
#   Northwest Avalanche Center (NWAC)
#   Plotting Tools - Controlled Access Interface
#
#   Air Sciences Inc. - 2016
#   Jacob Fielding
#

window.Plotting ||= {}

window.Plotting.Interface = class Interface
  constructor: (plotter, access) ->
    @api = new window.Plotting.API(access.token)
    @syncronousapi = new window.Plotting.API(access.token, false)
    @controls = new window.Plotting.Controls(plotter, access.token)
