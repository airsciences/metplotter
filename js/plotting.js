(function() {
  var LinePlot;

  window.Plotting || (window.Plotting = {});

  window.Plotting.LinePlot = LinePlot = (function() {
    function LinePlot() {
      var defaults, target;
      this.preError = "Plotting.LinePlot.";
      defaults = target = null;
    }

    LinePlot.prototype.responsive = function() {
      var dim, i, len, plot, ref, results;
      dim = {
        width: $(window).width(),
        height: $(window).height()
      };
      ref = this.plots;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        plot = ref[i];
        results.push(this.log("Cats"));
      }
      return results;
    };

    return LinePlot;

  })();

}).call(this);

(function() {
  var Handler;

  window.Plotting || (window.Plotting = {});

  window.Plotting.Handler = Handler = (function() {
    function Handler(auth, options, plots) {
      var access;
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
