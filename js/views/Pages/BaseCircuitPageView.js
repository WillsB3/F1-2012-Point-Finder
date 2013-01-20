/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.BaseCircuitPageView = f1.pages.BaseMapPageView.extend({
		options: {
			circuit: 'melbourne'
		},

		circuit: null,
		customMapInitialised: false,

		initialize: function () {
			_.bindAll(this, 'onProjectionChanged');

			f1.log('BaseCircuitPageView:initalize');
			f1.pages.BaseMapPageView.prototype.initialize.apply(this);

			// Set the initial circuit
			this.setCircuit(this.options.circuit);

			return this;
		},

		createMapType: function () {
			var circuitBounds = new google.maps.LatLngBounds(new google.maps.LatLng(this.circuit.bounds.SW.lat, this.circuit.bounds.SW.lng), new google.maps.LatLng(this.circuit.bounds.NE.lat, this.circuit.bounds.NE.lng));
			var mapMinZoom = 13;
			var mapMaxZoom = 19;
			var opacity = 0.75;
			var projection = this.map.getProjection();
			f1.log('Projection is: ');
			f1.log(projection);
			var tileSize = 256;

			var circuitMapType = new google.maps.ImageMapType({
				getTileUrl: function (tile, zoom) {
					// If we are outside the supported zoom levels we know we
					// won't have the required tiles early on
					if ((zoom < mapMinZoom) || (zoom > mapMaxZoom)) {
						return null;
					}

					// Convert tile coordinates to pixel coordinates
					var pixelCoordinates = {
						x: tile.x * tileSize,
						y: tile.y * tileSize
					};

					// convert Tile coordinates to world coordinates
					var worldCoordinates = {
						x: pixelCoordinates.x / (Math.pow(2, zoom)),
						y: pixelCoordinates.y / (Math.pow(2, zoom))
					};

					var ymax = 1 << zoom;
					var y = ymax - tile.y - 1;
					var tileBounds = new google.maps.LatLngBounds(
						// projection.fromPointToLatLng(new google.maps.Point(worldCoordinates.x, worldCoordinates.y));
						projection.fromPointToLatLng(new google.maps.Point((tile.x) * tileSize, (tile.y + 1) * tileSize), zoom),
						projection.fromPointToLatLng(new google.maps.Point((tile.x + 1) * tileSize, (tile.y) * tileSize), zoom)
					);

					if (circuitBounds.intersects(tileBounds)) {
						var tileServerURL = f1.production ?  f1.tileServer.production : f1.tileServer.development;
						return tileServerURL + this.circuit.placename + '/' + zoom + "/" + tile.x + "/" + y + ".png";
					} else {
						return null;
					}
				},
				tileSize: new google.maps.Size(tileSize, tileSize)
			});

			return circuitMapType;
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

		onProjectionChanged: function () {
			if (!this.customMapInitialised) {
				var circuitMapType = this.createMapType();
				this.map.overlayMapTypes.push(circuitMapType);
				this.customMapInitialised = true;
			}
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
