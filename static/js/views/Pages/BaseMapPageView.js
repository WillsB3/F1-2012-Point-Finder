/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.BaseMapPageView = f1.pages.BasePageView.extend({
		baseMapOptions: {
			zoom: null,
			center: null,
			mapTypeId: google.maps.MapTypeId.HYBRID,

			mapTypeControl: false,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.RIGHT_TOP
			},

			panControl: true,
			panControlOptions: {
				position: google.maps.ControlPosition.LEFT_TOP
			},

			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_TOP
			},

			scaleControl: false,

			streetViewControl: false,
			streetViewControlOptions: {
			}
		},


		map: null,
		template: '<div class="circuit-map-wrapper"><div class="circuit-map"></div><div class="map-overlay"></div></div>',
		timers: {
			mapOverlay: null
		},

		initialize: function () {
			f1.log('BaseMapPageView:initalize');
			f1.pages.BasePageView.prototype.initialize.apply(this);

			_.bindAll(this, 'onEditingEnabled', 'onEditingDisabled');

			// Setup map options
			this.mapOptions = _.extend({}, this.baseMapOptions, this.options.mapOptions);

			this.bindEvents();

			return this;
		},

		bindEvents: function () {
			f1.app.vent.on('map:editingEnabled', this.onEditingEnabled);
			f1.app.vent.on('map:editingDisabled', this.onEditingDisabled);
		},

		unbindEvents: function () {
			f1.app.vent.off('map:editingEnabled', this.onEditingEnabled);
			f1.app.vent.off('map:editingDisabled', this.onEditingDisabled);
		},

		onEditingEnabled: function () {
			var self = this,
				$overlay = this.$el.find('.map-overlay');

			$overlay
				.removeClass('is-disabled')
				.addClass('is-enabled');

			this.timers.mapOverlay = setTimeout(function () {
				$overlay
					.addClass('is-visible')
					.removeClass('is-hidden');
			}, 20);
		},

		onEditingDisabled: function () {
			var self = this,
				$overlay = this.$el.find('.map-overlay');

			$overlay
				.addClass('is-hidden')
				.removeClass('is-visible');

			this.timers.mapOverlay = setTimeout(function () {
				$overlay
					.removeClass('is-enabled')
					.addClass('is-disabled');
			}, 500);

			this.$el.find('.map-overlay').removeClass('is-enabled');
		},

		getMapOptions: function () {
			return this.mapOptions;
		},

		render: function () {
			var self = this;

			f1.log('BaseMapPageView:render');
			f1.pages.BasePageView.prototype.render.apply(this);

			// Render the map container to the DOM
			this.$el.append(this.template);

			// Render the Google map
			this.map = new google.maps.Map(this.$el.find('.circuit-map')[0], this.getMapOptions());

			// google.maps.event.addListener(this.map, 'projection_changed', function (e) {
			// 	self.onProjectionChanged();
			// });

			return this;
		},

		close: function () {
			f1.log('BaseMapPageView:close');

			this.unbindEvents();

			// Remove all event handlers we might have bound above
			google.maps.event.clearInstanceListeners(this.map);
		}
	});
}());
