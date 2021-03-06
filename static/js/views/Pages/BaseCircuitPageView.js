/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.BaseCircuitPageView = f1.pages.BaseMapPageView.extend({
		options: {
			circuit: f1.circuits[0]
		},

		circuit: null,
		circuitMapType: null,
		circuitMapOpacitySlider: null,

		initialize: function () {
			var self = this;

			_.bindAll(this, 'onProjectionChanged', 'setCircuit');

			f1.log('BaseCircuitPageView:initalize');
			f1.pages.BaseMapPageView.prototype.initialize.apply(this);

			// Set the initial circuit
			this.setCircuit(this.options.circuit, { silent: true });

			// Create the circuit tile opacity slider
			this.circuitMapOpacitySlider = new f1.views.googleMapsOpacitySliderView({
				onChange: function (newValue) {
					if (self.circuitMapType) {
						self.circuitMapType.setOpacity(newValue);
					}
				},
				map: null // We don't have the map until after Render of BaseMapPageView
			});

			this.on('map:ready', this.onMapReady);

			return this;
		},

		bindEvents: function () {
			f1.pages.BaseMapPageView.prototype.bindEvents.apply(this, arguments);
		},

		unbindEvents: function () {
			f1.pages.BaseMapPageView.prototype.unbindEvents.apply(this, arguments);
		},

		createMapType: function () {
			var self = this;

			// Plot markers for debugging
			var circuitSW = new google.maps.LatLng(this.circuit.bounds.SW.lat, this.circuit.bounds.SW.lng);
			var circuitNE = new google.maps.LatLng(this.circuit.bounds.NE.lat, this.circuit.bounds.NE.lng);

			var circuitBounds = new google.maps.LatLngBounds(circuitSW, circuitNE);

			var neMarker = new google.maps.Marker({
				position: circuitNE,
				map: self.map,
				title: 'NE Circuit Bound'
			});

			var swMarker = new google.maps.Marker({
				position: circuitSW,
				map: self.map,
				title: 'SW Circuit Bound'
			});

			// Draw debug bounds
			// var rectangle = new google.maps.Rectangle({
			// 	strokeColor: '#00FF00',
			// 	strokeOpacity: 0.8,
			// 	strokeWeight: 2,
			// 	fillColor: '#00FF00',
			// 	fillOpacity: 0.25,
			// 	map: this.map,
			// 	bounds: circuitBounds
			// });

			var mapMinZoom = 13;
			var mapMaxZoom = 19;
			var opacity = 0.75;

			var projection = this.map.getProjection();
			var tileSize = 256;

			var circuitMapType = new google.maps.ImageMapType({

				getTileUrl: function (coord, zoom) {
					// coord: specifies the current tiles world coordinates

					// If we are outside the supported zoom levels we know we
					// won't have the required tiles early on
					if ((zoom < mapMinZoom) || (zoom > mapMaxZoom)) {
						return null;
					}

					var pixelcoord1 = {
						x: coord.x * tileSize,
						y: (coord.y + 1) * tileSize,
						z: zoom
					};

					var pixelcoord2 = {
						x: (coord.x + 1) * tileSize,
						y: (coord.y) * tileSize,
						z: zoom
					};

					var worldcoord1 = new google.maps.Point(pixelcoord1.x / Math.pow(2, zoom), pixelcoord1.y / Math.pow(2, zoom));
					var worldcoord2 = new google.maps.Point(pixelcoord2.x / Math.pow(2, zoom), pixelcoord2.y / Math.pow(2, zoom));

					var sw = projection.fromPointToLatLng(worldcoord1);
					var ne = projection.fromPointToLatLng(worldcoord2);

					// var neMarker = new google.maps.Marker({
					// 	position: ne,
					// 	map: self.map,
					// 	title: 'NE'
					// });

					// f1.log('NE');
					// f1.log(ne);
					// window.ne = ne;

					// var swMarker = new google.maps.Marker({
					// 	position: sw,
					// 	map: self.map,
					// 	title: 'SW'
					// });

					// f1.log('SW');
					// f1.log(sw);
					// window.sw = sw;

					var tileBounds = new google.maps.LatLngBounds(sw, ne);

					// if (coord.x === 59157 && coord.y === 40221) {
					// 	// Draw debug bounds
					// 	var rectangle = new google.maps.Rectangle({
					// 		strokeColor: '#FF0000',
					// 		strokeOpacity: 0.8,
					// 		strokeWeight: 2,
					// 		fillColor: '#FF0000',
					// 		fillOpacity: 0.35,
					// 		map: self.map,
					// 		bounds: tileBounds
					// 	});


					// 	var neMarker = new google.maps.Marker({
					// 		position: ne,
					// 		map: self.map,
					// 		title: 'NE Tile Bound'
					// 	});

					// 	var swMarker = new google.maps.Marker({
					// 		position: sw,
					// 		map: self.map,
					// 		title: 'SW Tile Bound'
					// 	});
					// }

					var intersects = circuitBounds.intersects(tileBounds);
					var tileServerURL = f1.production ?  f1.tileServer.production : f1.tileServer.development;

					if (intersects) {
						return tileServerURL + self.circuit.placename + '/' + zoom + "/" + coord.x + "/" + coord.y + ".png";
					} else {
						// return tileServerURL + "red.png";
						return null;
					}
				},
				opacity: 0.5,
				tileSize: new google.maps.Size(256, 256)
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

			var circuit = newCircuit,
				latLng,
				zoomLevel;

			// Create a google LatLng object at the circuits center
			latLng = new google.maps.LatLng(circuit.mapCenter.lat, circuit.mapCenter.lng);

			// Center the map on the selected circuits location
			this.map.panTo(latLng);

			// Zoom to roughly the correct level
			zoomLevel = this.circuit.mapCenter.zoom || 16;
			this.map.setZoom(zoomLevel);

			if (circuit.maxZoom) {
				this.map.setOptions({ maxZoom: circuit.maxZoom });
			}
		},

		onMapReady: function () {
			this.off('map:ready', this.onMapReady);
			this.onCircuitChanged(this.circuit);
		},

		onProjectionChanged: function () {
			if (!this.circuitMapType) {
				if (!_.isUndefined(this.map.getProjection())) {
					this.circuitMapType = this.createMapType();
					this.map.overlayMapTypes.push(this.circuitMapType);

					this.trigger('map:ready');
				}
			}
		},

		createDummyControl: function (w, h) {
			var out = $(document.createElement('div')).addClass('dummy-control').css({ 
				'height': h,
				'width': w,
				'z-index': '-100 !important'
			});

			out[0].index = -10;
			return out[0];
		},

		render: function () {
			var self = this;

			f1.log('BaseCircuitPageView:render');
			f1.pages.BaseMapPageView.prototype.render.apply(this);

			this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.createDummyControl('20px', '60px'));
			this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(this.createDummyControl('20px', '60px'));

			google.maps.event.addListener(this.map, 'projection_changed', function () {
				self.onProjectionChanged();
			});

			// Create and render a circuit selector
			this.circuitSelector = new f1.views.CircuitSelector({
				map: this.map,
				circuit: this.circuit
			});

			this.circuitSelector.on('circuit:changed', this.setCircuit);
			this.$el.append(this.circuitSelector.render().$el);

			// Provide the opacity slider access to our map now it's available
			this.circuitMapOpacitySlider.setMap(this.map);
			
			// Render the circuit overlay opacity slider
			this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(this.circuitMapOpacitySlider.render().el);

			return this;
		},

		setCircuit: function (circuit, options) {
			var opts = options || {};
			
			this.circuit = circuit;

			if (!opts.silent) {
				this.onCircuitChanged.apply(this, [this.circuit]);
			}
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
