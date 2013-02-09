/*global $, Backbone, _ */
(function () {
	"use strict";
	f1.views.Point = function (options) {
		var options = options || {};

		var point = options.point || null;
		var map = options.map || null;

		var marker = null;

	 	this.initialize = function () {
		 	console.log('Point Created');

		 	this.render();
	 	};

	 	this.createMarker = function () {
			var marker = new google.maps.Marker({
				animation: google.maps.Animation.DROP,
				draggable: true,
				map: this.options.map,
				position: this.options.map.getCenter()
			});

			return marker;
	 	};

	 	this.render = function () {
	 		var marker = this.marker;

	 		if (!marker) {
				marker = new google.maps.Marker({
					animation: google.maps.Animation.DROP,
					draggable: true,
					map: map,
					position: map.getCenter()
				});
	 		}
	 	};

	 	this.destroy = function () {
	 		if (this.marker) {
	 			this.marker.setMap(null);
	 		}
	 	};

	 	this.getMap = function () {
	 		return map;
	 	};

	 	this.getMarker = function () {
	 		return marker;
	 	};

	 	this.initialize();

	 	return {
	 		destroy: this.destroy,
	 		render: this.render,
	 		getMap: this.getMap,
	 		getMarker: this.getMarker
	 	}
	};
}());