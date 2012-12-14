/*global $, f1, Backbone, _ */
(function () {
	"use strict";
	f1.pages.BaseMapPageView = f1.pages.BasePageView.extend({
		baseMapOptions: {
			zoom: null,
			center: null,
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

		options: {
			circuit: 'melbourne'
		},

		circuit: null,
		map: null,
		template: '<div class="circuit-map"></div>',

		initialize: function () {
			f1.log('BaseMapPageView:initalize');

			// Setup map options
			this.mapOptions = _.extend({}, this.baseMapOptions, this.options.mapOptions);

			// Set the initial circuit
			this.setCircuit(this.options.circuit);

			return this;
		},

		setCircuit: function (circuitId) {
			this.circuit = _.find(f1.circuits, function (circuit) {
				return circuit.id === circuitId;
			});
		},

		render: function () {
			f1.log('BaseMapPageView:render');
			var mapPosition = {
					center: new google.maps.LatLng(this.circuit.mapCenter.lat, this.circuit.mapCenter.lng),
					zoom: this.circuit.mapCenter.zoom || 16
				},
				mapOptions = _.extend({}, this.mapOptions, mapPosition);

			// Render the map container to the DOM
			this.$el.append(this.template);

			// Render the Google map
			this.map = new google.maps.Map(this.$el.find('.circuit-map')[0], mapOptions);

			return this;
		},

		close: function () {
			f1.log('BaseMapPageView:close');

			// Remove all event handlers we might have bound above
			google.maps.event.clearInstanceListeners(this.map);
		}
	});
}());
