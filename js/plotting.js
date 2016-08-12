(function() {
  if (!Object.mergeDefaults) {
    Object.mergeDefaults = function(args, defaults) {
      var i, j, len, len1, merge, sub, sub1;
      merge = {};
      for (i = 0, len = defaults.length; i < len; i++) {
        sub = defaults[i];
        merge[sub] = defaults[sub];
      }
      for (j = 0, len1 = args.length; j < len1; j++) {
        sub1 = args[j];
        merge[sub1] = args[sub1];
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

    LinePlot.prototype.responsive = function() {
      var dim, i, len, plot, preError, ref, results;
      preError = this.preError + ".responsive()";
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
      var _;
      ({
        preError: this.preError + ".append()"
      });
      return _ = this;
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
