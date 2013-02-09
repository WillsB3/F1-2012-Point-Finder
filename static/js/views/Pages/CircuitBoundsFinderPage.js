/*global $, f1, Backbone, _, google */
(function () {
	"use strict";
	f1.pages.CircuitBoundsFinderPage = f1.pages.BaseCircuitPageView.extend({

		pointsListView: null,

		initialize: function () {
			f1.log('CircuitBoundsFinderPage:initalize');
			f1.pages.BaseCircuitPageView.prototype.initialize.apply(this);

			return this;
		},

		render: function () {
			f1.log('CircuitBoundsFinderPage:render');
			
			var self = this;
			f1.pages.BaseCircuitPageView.prototype.render.apply(this);

			this.pointsListView = new f1.views.PointsListView({
				map: this.map
			});

			// Render the points list view
			this.$el.append(this.pointsListView.render().$el);

			return this;
		}
	});
}());
