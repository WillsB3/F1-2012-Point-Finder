/*global $, Backbone, _, f1 */
(function () {
	"use strict";
	f1.views.CircuitSelector = Backbone.View.extend({

		className: "circuit-selector",
		template: $('#circuit-selector-template').html(),

		initalize: function () {
			f1.log('CircuitSelector:initalize');

			return this;
		},

		render: function () {
			f1.log('CircuitSelector:render');
			this.$el.html(f1.template(this.template, { circuits: f1.circuits }));

			return this;
		},

		close: function () {

		}
	});
}());