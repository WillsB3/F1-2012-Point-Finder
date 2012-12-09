/*global $, f1, Backbone, _ */
(function () {
	"use strict";

	f1.Router = Backbone.Router.extend({
		routes: {
			'calibrate/circuit-bounds.html': 'circuitBoundsFinder',
			'': 'home',
		},

		circuitBoundsFinder: function () {
			f1.log('Router:circuitBoundsFinder');
			f1.app.showPage('CircuitBoundsFinderPage');
		}
	});

	$(document).ready(function () {
		f1.app = new f1.Application();
		f1.app.render();
		Backbone.history.start({ pushState: true });
	});
}());