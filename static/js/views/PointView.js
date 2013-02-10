/*global $, Backbone, _ */
(function () {
	"use strict";
	f1.views.Point = Backbone.View.extend({
		marker: null,
		template: _.template($('#circuit-points-calibration-point').html()),

		initialize: function (options) {
			_.bindAll(this, 'onMarkerMoved', 'onPointUpdated');

			this.point = options.point || null;
			this.map = options.map || null;
			this.marker = null;
			this.template = options.template || this.template;

			this.listenTo(this.point, 'change', this.onPointUpdated);
			this.render();

			return this;
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
	 		if (!this.marker) {
				this.renderMarker();
	 		}

	 		this.$el.html(this.template({
	 			game_x: this.point.get('game_x') || '-',
	 			game_y: this.point.get('game_y') || '-',
	 			world_lat: this.point.get('world_lat') || '-',
	 			world_lng: this.point.get('world_lng') || '-'
	 		}));

	 		return this;
		},

		onMarkerMoved: function () {
			this.point.set({
				'world_lat': this.marker.getPosition().lat(),
				'world_lng': this.marker.getPosition().lng()
			});
		},

		onPointUpdated: function () {
			this.render();
		},

		renderMarker: function () {
			f1.log("rendering marker")
			this.marker = new google.maps.Marker({
				animation: google.maps.Animation.DROP,
				draggable: true,
				map: this.map,
				position: this.map.getCenter()
			});

			// Bind to google events to update the point model when
			// the pin is dragged.
			google.maps.event.addListener(this.marker, 'drag', this.onMarkerMoved);
		},

		remove: function () {
			if (this.marker) {
	 			google.maps.event.clearInstanceListeners(this.marker);
	 			this.marker.setMap(null);
	 		}

	 		Backbone.View.prototype.remove.apply(this, []);
		}
	});
}());