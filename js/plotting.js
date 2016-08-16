(function() {
  if (!Object.mergeDefaults) {
    Object.mergeDefaults = function(args, defaults) {
      var key, key1, merge, val, val1;
      merge = {};
      for (key in defaults) {
        val = defaults[key];
        merge[key] = val;
      }
      for (key1 in args) {
        val1 = args[key1];
        merge[key1] = val1;
      }
      return merge;
    };
  }

}).call(this);

(function() {
  var LinePlot,
    slice = [].slice;

  window.Plotting || (window.Plotting = {});

  window.Plotting.LinePlot = LinePlot = (function() {
    function LinePlot(data, options) {
      var defaults;
      this.preError = "LinePlot.";
      defaults = {
        debug: true,
        target: null
      };
      this.options = Object.mergeDefaults(options, defaults);
      this.log = function() {
        var log;
        log = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      };
      if (this.options.debug) {
        this.log = function() {
          var log;
          log = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return console.log(log);
        };
      }
    }

    LinePlot.prototype.getDefinition = function() {
      var preError;
      preError = this.preError + "getDefinition():";
      return this.log(this.preError + (preError + "JeffIsCool"), "cat", 8);
    };

    LinePlot.prototype.responsive = function() {
      var dim, i, len, plot, preError, ref, results;
      preError = this.preError + "responsive()";
      dim = {
        width: $(window).width(),
        height: $(window).height()
      };
      ref = this.plots;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        results.push(this.log(plot));
      }
      return results;
    };

    LinePlot.prototype.append = function() {
      var _, preError;
      preError = this.preError + "append()";
      _ = this;
      this.log("" + preError, this.options);
      return this.svg = d3.select(this.options.target).append("svg");
    };

    LinePlot.prototype.update = function(data) {};

    return LinePlot;

  })();

}).call(this);

(function() {
  var Handler;

  window.Plotting || (window.Plotting = {});

  window.Plotting.Handler = Handler = (function() {
    function Handler(access, options, plots) {
      this.endpoint = null;
      access = {
        token: null,
        expires: null,
        expired: true
      };
      this.hasAccess = function() {
        var now;
        now = new Date;
        if (access.expires < now) {
          return access.expired = true;
        }
      };
    }

    Handler.prototype.alert = function(message, type) {};

    return Handler;

  })();

}).call(this);
