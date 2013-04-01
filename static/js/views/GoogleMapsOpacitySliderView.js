/*global $, Backbone, _, f1 */
(function () {
	"use strict";
	f1.views.googleMapsOpacitySliderView = f1.views.sliderView.extend({

		className: 'slider slider--tile-opacity-slider',

		events: {

		},

		template: '<span class="slider__handle js-slider__handle"></span>',

		map: null,

		listeners: {
			handle_MouseMove: null,
			body_MouseUp: null
		},

		initialize: function () {
			f1.views.sliderView.prototype.initialize.apply(this, arguments);
			f1.log('googleMapsOpacitySliderView.initialize()');

			this.map = this.options.map;

			return this;
		},

		bindEvents: function () {
			var self = this;

			google.maps.event.addDomListener(this.$elements.$handle.get(0), 'mousedown', function (evnt) {
				self.onHandleMouseDown.apply(self, arguments);
			});

			google.maps.event.addDomListener(this.el, 'mousedown', function () {
				self.onMouseDown.apply(self, arguments);
			});

			google.maps.event.addDomListener(this.el, 'mouseup', function () {
				self.onMouseUp.apply(self, arguments);
			});
		},

		onHandleMouseDown: function (evnt) {
			var self = this;

			f1.views.sliderView.prototype.onHandleMouseDown.apply(this, arguments);

			this.listeners.body_MouseUp = google.maps.event.addDomListener($('body').get(0), 'mouseup', function (evnt) {
				self.releaseHandle.apply(self, arguments);
			});

			// Setup mousemove binding for dragging
			this.listeners.handle_MouseMove = google.maps.event.addDomListener(this.el, 'mousemove', function () {
				self.onMouseMove.apply(self, arguments);
			});
		},

		onHandleMouseUp: function (evnt) {
			f1.views.sliderView.prototype.onHandleMouseUp.apply(this, arguments);

			// Remove mousemove binding
			google.maps.event.removeListener(this.listeners.handle_MouseMove);
		},

		releaseHandle: function (evnt) {
			this.onHandleMouseUp.apply(this, arguments);

			// Remove mouseup binding
			google.maps.event.removeListener(this.listeners.body_MouseUp);
		},

		unbindEvents: function () {
			google.maps.event.clearInstanceListeners(this.el);
		},

		render: function () {
			var self = this;
			
			f1.views.sliderView.prototype.render.apply(this, arguments);
			f1.log('googleMapsOpacitySliderView.render()');

			this.bindEvents();

			return this;
		},

		remove: function () {
			this.unbindEvents();
			Backbone.View.prototype.remove.apply(this, arguments);
		}
	});
}());