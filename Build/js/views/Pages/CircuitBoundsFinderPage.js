/*global $, f1, Backbone, _ */
(function () {
	"use strict";
	f1.pages.CircuitBoundsFinderPage = f1.pages.BasePageView.extend({
		map: null,

		template: '<div class="circuit-map"></div>',

		initalize: function () {
			f1.log('CircuitBoundsFinderPage:initalize');

			return this;
		},

		render: function () {
			var map,
				mapOptions = {
					zoom: 8,
					center: new google.maps.LatLng(-34.397, 150.644),
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

			f1.log('CircuitBoundsFinderPage:render');

			this.$el.append(this.template);

			// Render the Google map
			this.map = new google.maps.Map(this.$el.find('.circuit-map')[0], mapOptions);

			return this;
		}
	});
}());
