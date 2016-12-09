(function() {
  window.testPlotter = function(plotter) {
    var _proto;
    _proto = new window.Plotter.Tester(plotter);
    console.log("%c Testing Plotter...", 'background: #34495e; color: #2ecc71; font-weight: 900');
    _proto.template();
    _proto.plotOptions();
    return _proto.templateOptionsMatch();
  };

}).call(this);

(function() {
  var Tester;

  window.Plotter || (window.Plotter = {});

  window.Plotter.Tester = Tester = (function() {
    function Tester(plotter) {
      this.plotter = plotter;
    }

    Tester.prototype.template = function() {
      var _template, validA;
      _template = this.plotter.i.template.template;
      console.log("Testing basic template validity...");
      validA = this.plotter.i.template.isValid(_template);
      return console.log("Template validA result is: ", validA);
    };

    Tester.prototype.plotOptions = function() {
      var key, plot, ref, results;
      ref = this.plotter.plots;
      results = [];
      for (key in ref) {
        plot = ref[key];
        results.push(console.log("Testing... (plot)", plot));
      }
      return results;
    };

    Tester.prototype.templateOptionsMatch = function() {
      var _template, _y, count, key, loggers, plot, ref, results, yKey, yRow;
      ref = this.plotter.plots;
      results = [];
      for (key in ref) {
        plot = ref[key];
        _template = this.plotter.i.template.template[key];
        _y = plot.proto.options.y;
        count = _template.y.length === _y.length;
        console.log("Template-Options Match: Length is correct", count);
        loggers = [];
        results.push((function() {
          var i, len, ref1, results1;
          ref1 = _template.y;
          results1 = [];
          for (yRow = i = 0, len = ref1.length; i < len; yRow = ++i) {
            yKey = ref1[yRow];
            logger[yKey] = {
              template: yRow.dataLoggerId,
              options: _y[yKey].dataLoggerId
            };
            logger[yKey].valid = logger[yKey].template === logger[yKey].options;
            results1.push(console.log("Template-Options Match: Logger Matches (y-key)", yKey, logger[yKey].valid));
          }
          return results1;
        })());
      }
      return results;
    };

    return Tester;

  })();

}).call(this);
