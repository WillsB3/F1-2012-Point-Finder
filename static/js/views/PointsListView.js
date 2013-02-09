/*global $, Backbone, _ */
(function () {
	"use strict";
	f1.views.PointsListView = Backbone.View.extend({

		className: "points-list",

		template: $('#circuit-points-list').html(),

		options: {},

		initialize: function () {

			return this;
		},

		render: function () {
			this.$el.append(this.template);

			return this;
		}
	});
}());