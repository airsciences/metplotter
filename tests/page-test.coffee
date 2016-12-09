#
# Tests the Template, Plot Options, and Data Sets.
#

window.testPlotter = (plotter) ->
  _proto = new window.Plotter.Tester(plotter)
  console.log("%c Testing Plotter...",
    'background: #34495e; color: #2ecc71; font-weight: 900')
  _proto.template()
  _proto.plotOptions()
  _proto.templateOptionsMatch()
