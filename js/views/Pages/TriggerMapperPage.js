/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.TriggerMapperPage = f1.pages.BaseCircuitPageView.extend({
		drawingManagerOptions: {
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.BOTTOM_CENTER,
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

		initialize: function () {
			f1.log('TriggerMapperPage:initalize');
			f1.pages.BaseCircuitPageView.prototype.initialize.apply(this);

			return this;
		},

		render: function () {
			f1.log('TriggerMapperPage:render');
			f1.pages.BaseCircuitPageView.prototype.render.apply(this);

			// Create the drawing manager
			this.drawingManager = new google.maps.drawing.DrawingManager(this.drawingManagerOptions);
			this.drawingManager.setMap(this.map);

			return this;
		}
	});
}());
