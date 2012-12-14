/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.TriggerMapperPage = f1.pages.BaseMapPageView.extend({
		initalize: function () {
			f1.log('CircuitBoundsFinderPage:initalize');

			return this;
		},

		render: function () {
			f1.log('CircuitBoundsFinderPage:render');

			var map,
				circuit,
				self = this;

			circuit = _.find(f1.circuits, function (circuit) {
				return circuit.id === 'melbourne';
			});


			f1.pages.BaseMapPageView.prototype.render.apply(this);

			// Render the Google map
			this.map = new google.maps.Map(this.$el.find('.circuit-map')[0], this.mapOptions);

			// Attach the click handler
			google.maps.event.addListener(this.map, 'click', function (e) {
				self.placeMarker(e);
			});

			// Create and render a circuit selector
			this.circuitSelector = new f1.views.CircuitSelector({
				map: this.map
			});
			this.$el.append(this.circuitSelector.render().$el);

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
		},

		close: function () {
			// Remove all event handlers we might have bound above
			google.maps.event.clearInstanceListeners(this.map);

			this.circuitSelector.close();

			f1.pages.BasePageView.prototype.close.apply(this);
		}
	});
}());