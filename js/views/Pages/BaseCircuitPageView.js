/*global $, f1, Backbone, _ */
(function () {
	"use strict";
	f1.pages.BaseCircuitPageView = f1.pages.BaseMapPageView.extend({
		initialize: function () {
			f1.log('BaseCircuitPageView:initalize');
			f1.pages.BaseMapPageView.prototype.initialize.apply(this);

			return this;
		},

		render: function () {
			f1.log('BaseCircuitPageView:render');
			f1.pages.BaseMapPageView.prototype.render.apply(this);

			// Create and render a circuit selector
			this.circuitSelector = new f1.views.CircuitSelector({
				map: this.map
			});

			this.$el.append(this.circuitSelector.render().$el);

			return this;
		},

		close: function () {
			f1.log('BaseCircuitPageView:close');

			this.circuitSelector.close();
			f1.pages.BaseMapPageView.prototype.close.apply(this);
		}
	});
}());
