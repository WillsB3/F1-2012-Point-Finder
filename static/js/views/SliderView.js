/*global $, Backbone, _, f1 */
(function () {
	"use strict";
	f1.views.sliderView = Backbone.View.extend({

		className: 'slider',

		options: {
			initialValue: 0.5,
			minValue: 0,
			maxValue: 1,
			handleWidth: 14
		},

		events: {
			'click 	.js-slider__handle': 'onMouseDown',
			'mouseup 	.js-slider__handle': 'onMouseUp'
		},

		$elements: {
			$handle: null
		},

		template: '<span class="slider__handle js-slider__handle"></span>',

		currentValue: 0,
		dragging: false,
		offsets: {
			mouseDown: {
				handle: null,
				slider: null
			},
			mouseMove: {
				handle: null
			}
		},

		initialize: function (options) {
			f1.log('sliderView.initialize()');

			return this;
		},

		onMouseDown: function (evnt) {
			f1.log('sliderView.onMouseDown()');
			this.offsets.mouseDown.slider = this.$el.position().left;
		},

		onHandleMouseDown: function (evnt) {
			f1.warn('sliderView.onHandleMouseDown()');

			this.dragging = true;
			this.offsets.mouseDown.handle = this.$elements.$handle.position().left;
			this.offsets.mouseDown.slider = this.$el.position().left;

			evnt.stopPropagation();
		},

		onMouseMove: function (evnt) {
			// f1.log('sliderView.onMouseMove()');

			if (this.dragging) {
				this.offsets.mouseMove.handle = evnt.pageX;

				// Compute the handles new position
				var handleLeft = this.offsets.mouseDown.handle;
				var sliderLeft = this.offsets.mouseDown.slider;
				var mouseRelativeLeft = this.offsets.mouseMove.handle - sliderLeft - (this.options.handleWidth / 2);
				var valuePercentage = (mouseRelativeLeft / this.$el.width()) * 100;
				f1.log('mouseRelativeLeft: ' + mouseRelativeLeft);
				f1.log('valuePercentage: ' + valuePercentage);
					
				// Update the handle position
				this.setHandlePosition(valuePercentage);
			}
			
			evnt.preventDefault();
			evnt.stopPropagation();
		},

		onMouseUp: function (evnt) {
			f1.log('sliderView.onMouseUp()');

			var sliderLeft = this.offsets.mouseDown.slider;
			var clickedPosition = evnt.pageX;
			var mouseRelativeLeft = clickedPosition - sliderLeft - (this.options.handleWidth / 2);
			var valuePercentage = (mouseRelativeLeft / this.$el.width()) * 100;

			this.setHandlePosition(valuePercentage);
		},

		onHandleMouseUp: function (evnt) {
			f1.log('sliderView.onHandleMouseUp()');

			this.dragging = false;
			this.offsets.mouseDown = null;

			this.offsets = {
				mouseDown: {
					left: null
				},
				mouseMove: {
					left : null
				}
			};

			evnt.stopPropagation();
		},

		setHandlePosition: function (offsetPercentage) {
			var o = parseFloat(offsetPercentage);
			var sliderWidth = this.$el.width();
			var handleWidth = this.options.handleWidth;
			var minLeft = 0;
			var maxLeft = 100;

			f1.log('minLeft: ' + minLeft);
			f1.log('maxLeft: ' + maxLeft);

			// Check we aren't past the minimum
			if (o < minLeft) {
				o = minLeft;
			}

			// Check we aren't past the maximum
			if (o > maxLeft) {
				o = maxLeft;
			}

			this.currentValue = o;
			this.$elements.$handle.css('left', o + '%');

			if (_.isFunction(this.options.onChange)) {
				this.options.onChange.apply(this, [o / 100]);
			}
		},

		setMap: function (map) {
			this.map = map;
		},

		setInitialPosition: function () {
			this.setHandlePosition(this.options.initialValue * 100);
		},

		render: function () {
			f1.log('sliderView.render()');
			
			this.$el.append(this.template);
			this.$elements.$handle = this.$el.find('.js-slider__handle');
			this.setInitialPosition();

			return this;
		}
	});
}());