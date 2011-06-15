// An example Backbone application contributed by
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
  }

  var Hurl = Backbone.Model.extend({

    send: function() {
      var model = this;

      $.ajax({
	url: model.get("url"),
	type: model.get("type"),
	dataType: "text",
	success: function(data, textStatus, jqXHR) {
	  var contentType = jqXHR.getResponseHeader("Content-Type");

	  if (contentType.indexOf("application/xml") !== -1) {
	    var content = formatXml(data);
	  } else if (contentType.indexOf("application/json") !== -1) {
	    var content = js_beautify(data);
	  } else {
	    var content = data;
	  }

	  model.set({
	    response: {
	      content: content,
	      headers: jqXHR.getAllResponseHeaders()
	    },
	    request: {
	    }
	  });
	},
	error: function(jqXHR, textStatus, errorThrown) {
	  model.set({response: textStatus});
	}
      });
    }

  });

  var HurlView = Backbone.View.extend({

    tagName: "div",
    template: Handlebars.compile($("#hurl-template").html()),

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));

      // Highlight the code
      prettyPrint();

      return this;
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#churlapp"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "change #select-method":  "changeMethod",
      "submit form": "hurl"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      _.bindAll(this, 'render', 'changeMethod');
    },

    changeMethod: function(e) {
      e.preventDefault();
    },

    hurl: function(e) {
      e.preventDefault();

      var hurl = new Hurl({
	url: $("input[name='url']").val(),
	type: $("#select-method").val()
      });

      var view = new HurlView({model: hurl});
      $("#current-hurl").html(view.render().el);

      // Send the request
      hurl.send();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {

    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});