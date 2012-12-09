/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.CircuitBoundsFinderPage = f1.pages.BasePageView.extend({
		map: null,

		template: '<div class="circuit-map"></div>',

		initalize: function () {
			f1.log('CircuitBoundsFinderPage:initalize');

			return this;
		},

		render: function () {
			var map,
				mapOptions = {
					zoom: 8,
					center: new google.maps.LatLng(-34.397, 150.644),
					mapTypeId: google.maps.MapTypeId.HYBRID,

					mapTypeControl: true,
					mapTypeControlOptions: {
						style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
						position: google.maps.ControlPosition.RIGHT_CENTER
					},

					panControl: true,
					panControlOptions: {
						position: google.maps.ControlPosition.LEFT_CENTER
					},

					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.LEFT_CENTER
					},

					scaleControl: false,

					streetViewControl: false,
					streetViewControlOptions: {
						position: google.maps.ControlPosition.LEFT_CENTER
					}
				},
				self = this;

			f1.log('CircuitBoundsFinderPage:render');

			this.$el.append(this.template);

			// Render the Google map
			this.map = new google.maps.Map(this.$el.find('.circuit-map')[0], mapOptions);

			// Attach the click handler
			google.maps.event.addListener(this.map, 'click', function (e) {
				self.placeMarker(e.latLng);
			});

			// Create and render a circuit selector
			this.circuitSelector = new f1.views.CircuitSelector({
				map: this.map
			});
			this.$el.append(this.circuitSelector.render().$el);

			return this;
		},

		placeMarker: function (position) {
			f1.log('Placing marker at position:');
			f1.log(position);

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
