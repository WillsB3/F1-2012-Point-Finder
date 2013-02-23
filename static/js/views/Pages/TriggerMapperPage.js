/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.TriggerMapperPage = f1.pages.BaseCircuitPageView.extend({
		drawingManagerOptions: {
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.RIGHT_TOP,
				drawingModes: [
					google.maps.drawing.OverlayType.POLYGON
				]
			},
			polygonOptions: {
				editable: true,
				clickable: false,
				fillColor: '#ff0600',
				fillOpacity: 0.5,
				strokeWeight: 2,
				zIndex: 1
			}
		},

		drawingManager: null,
		polygons: null,

		initialize: function () {
			f1.log('TriggerMapperPage:initalize');
			f1.pages.BaseCircuitPageView.prototype.initialize.apply(this);

			_.bindAll(this, 'onOverlayComplete');

			this.polygons = [];

			return this;
		},

		bindEvents: function () {
			f1.pages.BaseCircuitPageView.prototype.bindEvents.apply(this, arguments);
		},

		unbindEvents: function () {
			f1.pages.BaseCircuitPageView.prototype.unbindEvents.apply(this, arguments);
		},

		deleteNode: function (mev) {
			if (mev.vertex !== null && this.getPath().getLength() > 3) {
				this.getPath().removeAt(mev.vertex);
			} else {
				f1.app.vent.trigger('notify', {
					contents: '<strong>Error</strong> Polygon must have at least 3 points',
					type: 'alert-error'
				});
			}
		},

		onOverlayComplete: function (overlay, evnt) {
			// Only accept the polygon if it has 3 or more points.
			if (evnt.overlay.getPath().getLength() >= 3) {
				if (evnt.type === google.maps.drawing.OverlayType.POLYGON) {
					this.polygons.push(evnt.overlay);

					// Setup deletion of points
					google.maps.event.addListener(evnt.overlay, 'click', this.deleteNode);
				}
			}
		},

		render: function () {
			f1.log('TriggerMapperPage:render');
			f1.pages.BaseCircuitPageView.prototype.render.apply(this);

			var self = this;

			// Create the drawing manager
			this.drawingManager = new google.maps.drawing.DrawingManager(this.drawingManagerOptions);
			this.drawingManager.setMap(this.map);

			// Don't enable polygon drawing by default. User must select the drawing
			// control before they can begin drawing.
			this.drawingManager.setDrawingMode(null);

			// Setup tracking of polygons
			google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function () {
				self.onOverlayComplete.apply(self, [this].concat(Array.prototype.slice.call(arguments)));
			});

			return this;
		},

		close: function () {
			f1.pages.BaseCircuitPageView.close.apply(this, arguments);
		}
	});
}());
