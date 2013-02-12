/*global $, Backbone, _, f1, google */
(function () {
	"use strict";
	f1.views.Point = Backbone.View.extend({
		marker: null,
		template: _.template($('#circuit-points-calibration-point').html()),
		editingTemplate: _.template($('#circuit-points-list-point-editing').html()),

		events: {
			'click .points-table-edit': 'enableEditing',
			'click .points-table-done': 'disableEditing'
		},

		isEditing: false,

		initialize: function (options) {
			_.bindAll(this, 'enableEditing', 'onMarkerMoved', 'onPointUpdated');

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

		disableEditing: function (evnt) {
			f1.app.vent.trigger('map:editingDisabled');

			// Store the values
			this.point.set({
				'game_x': this.$el.find('[name=point-' + this.point.cid + '-x]').val(),
				'game_y': this.$el.find('[name=point-' + this.point.cid + '-y]').val()
			});

			// Save the point
			this.point.save();

			this.isEditing = false;

			this.render();
		},

		enableEditing: function (evnt) {
			f1.app.vent.trigger('map:editingEnabled');

			this.isEditing = true;
			this.render();
		},

		render: function () {
			var templateToUse = this.template;

			if (!this.marker) {
				this.renderMarker();
			}

			if (this.isEditing) {
				templateToUse = this.editingTemplate;
			}

			this.$el.html(templateToUse({
				game_x: this.point.get('game_x') || '-',
				game_y: this.point.get('game_y') || '-',
				point_cid: this.point.cid,
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
			f1.log("rendering marker");
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