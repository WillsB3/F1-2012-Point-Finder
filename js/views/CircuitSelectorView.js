/*global $, Backbone, _, f1, google */
(function () {
	"use strict";
	f1.views.CircuitSelector = Backbone.View.extend({

		className: "circuit-selector",
		template: $('#circuit-selector-template').html(),

		elements: {
			$searchField: null
		},

		events: {
			'focus .search-field': 'expandSearchField',
			'blur .search-field': 'contractSearchField',
			'submit .circuit-selector-search': 'preventDefaultFormBehaviour'
		},

		initalize: function () {
			f1.log('CircuitSelector:initalize');

			_.bindAll(this, 'contractSearchField', 'expandSearchField');

			return this;
		},

		contractSearchField: function (evnt) {
			this.elements.$searchField.css({
				width: '183px'
			});
		},

		expandSearchField: function (evnt) {
			this.elements.$searchField.css({
				width: '400px'
			});
		},

		preventDefaultFormBehaviour: function (evnt) {
			// Prevent the form submitting
			evnt.preventDefault();
		},

		render: function () {
			f1.log('CircuitSelector:render');

			// Render the template
			this.$el.html(f1.template(this.template, { circuits: f1.circuits }));

			// Cache required elements
			this.elements.$searchField = this.$el.find('input.search-field');

			// Initialise the search box
			this.searchBox = new google.maps.places.SearchBox(this.elements.$searchField[0]);

			return this;
		},

		close: function () {

		}
	});
}());