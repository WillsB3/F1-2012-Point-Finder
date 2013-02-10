/*global $, Backbone, _ */
(function () {
	"use strict";
	f1.views.Point = Backbone.View.extend({
		marker: null,

		initialize: function (options) {
			this.point = options.point || null;
			this.map = options.map || null;
			this.marker = null;

			this.$el = null;
			this.el = null;

			console.log('Point Created');
		},

		createMarker: function () {
			var marker = new google.maps.Marker({
				animation: google.maps.Animation.DROP,
				draggable: true,
				map: this.options.map,
				position: this.options.map.getCenter()
			});

			return marker;
		},

		render: function () {
			var marker = this.marker;

	 		if (!marker) {
				marker = new google.maps.Marker({
					animation: google.maps.Animation.DROP,
					draggable: true,
					map: this.map,
					position: this.map.getCenter()
				});
	 		}
		},

		remove: function () {
			if (this.marker) {
	 			this.marker.setMap(null);
	 		}

	 		Backbone.View.prototype.remove.apply(this, []);
		}
	});
}());