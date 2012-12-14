/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.TriggerMapperPage = f1.pages.BaseCircuitPageView.extend({
		initialize: function () {
			f1.log('TriggerMapperPage:initalize');
			f1.pages.BaseCircuitPageView.prototype.initialize.apply(this);

			return this;
		},

		render: function () {
			f1.log('TriggerMapperPage:render');
			f1.pages.BaseCircuitPageView.prototype.render.apply(this);

			// Create the drawing manager
			this.drawingManager = new google.maps.drawing.DrawingManager();
			this.drawingManager.setMap(this.map);

			return this;
		}
	});
}());
