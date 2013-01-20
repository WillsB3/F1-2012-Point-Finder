/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.BaseCircuitPageView = f1.pages.BaseMapPageView.extend({
		options: {
			circuit: 'melbourne'
		},

		circuit: null,

		initialize: function () {
			f1.log('BaseCircuitPageView:initalize');
			f1.pages.BaseMapPageView.prototype.initialize.apply(this);

			// Set the initial circuit
			this.setCircuit(this.options.circuit);

			return this;
		},

		createMapType: function (latLngBounds, minZoom, maxZoom) {
			this.circuitMapType = new google.maps.ImageMapType({
				getTileUrl: function (coord, zoom) {
					if (zoom < 17 || zoom > 20 ||
							bounds[zoom][0][0] > coord.x || coord.x > bounds[zoom][0][1] ||
							bounds[zoom][1][0] > coord.y || coord.y > bounds[zoom][1][1]) {
						return null;
					}

					return ['http://www.gstatic.com/io2010maps/tiles/5/L2_',
							zoom, '_', coord.x, '_', coord.y, '.png'].join('');
				},
				tileSize: new google.maps.Size(256, 256)
			});
		},

		getMapOptions: function () {
			var mapPosition = {
					center: new google.maps.LatLng(this.circuit.mapCenter.lat, this.circuit.mapCenter.lng),
					zoom: this.circuit.mapCenter.zoom || 16
				},
				mapOptions = _.extend({}, this.mapOptions, mapPosition);

			return mapOptions;
		},

		onCircuitChanged: function (newCircuit) {
			f1.log('BaseCircuitPageView:onCircuitChanged');
			this.circuit = newCircuit;
		},

		render: function () {
			f1.log('BaseCircuitPageView:render');
			f1.pages.BaseMapPageView.prototype.render.apply(this);

			// Create and render a circuit selector
			this.circuitSelector = new f1.views.CircuitSelector({
				map: this.map,
				circuit: this.circuit
			});

			this.circuitSelector.on('circuit:changed', this.onCircuitChanged);

			this.$el.append(this.circuitSelector.render().$el);

			// Create circuit overlay map type


			return this;
		},

		setCircuit: function (circuitId) {
			this.circuit = _.find(f1.circuits, function (circuit) {
				return circuit.id === circuitId;
			});
		},

		close: function () {
			f1.log('BaseCircuitPageView:close');

			this.circuit = null;

			this.circuitSelector.off('circuit:changed');
			this.circuitSelector.close();

			f1.pages.BaseMapPageView.prototype.close.apply(this);
		}
	});
}());
