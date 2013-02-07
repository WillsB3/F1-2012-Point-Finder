/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.CircuitBoundsFinderPage = f1.pages.BaseCircuitPageView.extend({
		points: {
			codemasters: {},
			gMaps: {}
		},

		templates: {
			pointsList: $('#circuit-points-list').html()
		},

		initialize: function () {
			f1.log('CircuitBoundsFinderPage:initalize');
			f1.pages.BaseCircuitPageView.prototype.initialize.apply(this);

			return this;
		},

		render: function () {
			f1.log('CircuitBoundsFinderPage:render');
			
			var self = this;
			f1.pages.BaseCircuitPageView.prototype.render.apply(this);

			// Attach the click handler
			google.maps.event.addListener(this.map, 'click', function (e) {
				self.placeMarker(e);
			});
			
			this.$el.append(this.templates.pointsList);

			return this;
		},

		placeMarker: function (evnt) {
			var position = evnt.latLng;

			f1.log('Placing marker at position:');
			f1.log(position);

			f1.log('World coordinates:');
			f1.log(evnt.ga);

			var marker = new google.maps.Marker({
				position: position,
				map: this.map
			});
		}
	});
}());
