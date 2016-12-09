(function() {
  window.testPlotter = function(plotter) {
    var _proto;
    _proto = new window.Plotter.Tester(plotter);
    console.log("%c Testing Plotter...", 'background: #34495e; color: #2ecc71; font-weight: 900');
    _proto.template();
    _proto.plotOptions();
    _proto.templateOptionsMatch();
    return true;
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
      var cat, key, plot, ref, results;
      ref = this.plotter.plots;
      results = [];
      for (key in ref) {
        plot = ref[key];
        results.push(cat = "rawr");
      }
      return results;
    };

    Tester.prototype.templateOptionsMatch = function() {
      var _template, _y, count, key, name, plot, ref, results, valid, yKey, yRow;
      name = "Template-Options Match:";
      ref = this.plotter.plots;
      results = [];
      for (key in ref) {
        plot = ref[key];
        _template = this.plotter.i.template.template[key];
        _y = plot.proto.options.y;
        count = _template.y.length === _y.length;
        console.log(name + " Length is correct", count);
        results.push((function() {
          var ref1, results1;
          ref1 = _template.y;
          results1 = [];
          for (yKey in ref1) {
            yRow = ref1[yKey];
            valid = yRow.dataLoggerId === _y[yKey].dataLoggerId;
            results1.push(console.log(name + " Logger Matches", yKey, yRow.dataLoggerId, _y[yKey].dataLoggerId, valid));
          }
          return results1;
        })());
      }
      return results;
    };

    Tester.prototype.colors = function() {};

    return Tester;

  })();

}).call(this);
