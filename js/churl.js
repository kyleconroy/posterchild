// An example Backbone application contributed by
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

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
      "submit form": "makeRequest"
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

    makeRequest: function(e) {
      e.preventDefault();

      var url = $("input[name='url']").val();
      var type = $("#select-method").val();

      $.ajax({
	url: url,
	type: type,
	success: function(data, textStatus, jqXHR) {
	  console.log(data);
	},
	error: function(jqXHR, textStatus, errorThrown) {
	  console.log(textStatus);
	}
      });

    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {

    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});