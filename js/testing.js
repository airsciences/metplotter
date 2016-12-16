(function() {
  window.testPlotter = function(plotter) {
    var _proto;
    _proto = new window.Plotter.Tester(plotter);
    console.log("%c Testing Plotter...", 'background: #34495e; color: #2ecc71; font-weight: 900');
    _proto.template();
    _proto.plotOptions();
    _proto.templateOptionsMatch();
    _proto.domOrdering();
    return "Finished.";
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
      var _template, result, validA;
      result = false;
      _template = this.plotter.i.template.template;
      validA = this.plotter.i.template.isValid(_template);
      console.log("Template validA result is: ", validA);
      return result;
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

    Tester.prototype.domOrdering = function() {
      var _last, _target, key, name, plot, ref, results, valid;
      name = "DOM Overlay Ordering:";
      ref = this.plotter.plots;
      results = [];
      for (key in ref) {
        plot = ref[key];
        _target = plot.proto.options.target;
        _last = $("" + _target).find("svg").children().last();
        valid = _last.hasClass("zoom-pane") && _last.is("rect");
        results.push(console.log(name + " listener is last", valid));
      }
      return results;
    };

    return Tester;

  })();

}).call(this);
