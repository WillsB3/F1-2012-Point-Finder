/*global $, f1, Backbone, _ */
(function () {
	"use strict";
	f1.pages.BaseMapPageView = f1.pages.BasePageView.extend({
		baseMapOptions: {
			zoom: null,
			center: null,
			mapTypeId: google.maps.MapTypeId.HYBRID,

			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.RIGHT_CENTER
			},

			panControl: true,
			panControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER
			},

			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			},

			scaleControl: false,

			streetViewControl: false,
			streetViewControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER
			}
		},


		map: null,
		template: '<div class="circuit-map"></div>',

		initialize: function () {
			f1.log('BaseMapPageView:initalize');
			f1.pages.BasePageView.prototype.initialize.apply(this);

			// Setup map options
			this.mapOptions = _.extend({}, this.baseMapOptions, this.options.mapOptions);

			return this;
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

			google.maps.event.addListener(this.map, 'projection_changed', function (e) {
				self.onProjectionChanged();
			});

			return this;
		},

		close: function () {
			f1.log('BaseMapPageView:close');

			// Remove all event handlers we might have bound above
			google.maps.event.clearInstanceListeners(this.map);
		}
	});
}());
