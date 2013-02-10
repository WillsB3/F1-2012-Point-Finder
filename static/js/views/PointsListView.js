/*global $, Backbone, _ */
(function () {
	"use strict";
	f1.views.PointsListView = Backbone.View.extend({

		className: "points-list",

		events: {
			'click .js-add-point--pair': 'addPoint'
			// 'mouseenter .points-list__wrapper': 'expandPane',
			// 'mouseleave .points-list__wrapper': 'collapsePane'
		},

		template: $('#circuit-points-list').html(),
		pointTemplate: _.template($('#circuit-points-list-point').html()),

		points: null,
		pointViews: null,

		elements: {
			$pointsTable: null
		},

		initialize: function () {
			this.points = new f1.collections.PointList();
			this.pointViews = {};

			this.listenTo(this.points, 'add', this.onPointAdded);

			return this;
		},

		addPoint: function () {

			// Create the model for this point
			var point = new f1.models.Point({
				location: this.options.map.getCenter(),
				map: this.options.map
			});

			this.points.add(point);
		},

		expandPane: function () {
			this.$el.addClass('is-expanded');
		},

		collapsePane: function () {
			this.$el.removeClass('is-expanded');
		},

		onPointAdded: function (model, collection, options) {
			console.log('Point Added');

			// Create a view (marker) for the point.
			// The Point view will automatically render itself
			var pointView = new f1.views.Point({
				point: model,
				map: this.options.map
			});

			// We aren't attaching the view to the DOM since
			// it doesn't require an element. It just renders
			// the marker on the Google map via the Maps API.
			pointView.render();

			this.pointViews[model.cid] = pointView;

			// Add an entry in the points table
			var rowHtml = this.pointTemplate({
				game_coord_x: '-',
				game_coord_y: '-',
				world_coord_lat: model.get('location').lat(),
				world_coord_lng: model.get('location').lng()
			});

			this.elements.$pointsTable.find('tbody').append(rowHtml);
		},

		render: function () {
			this.$el.append(this.template);
			this.elements.$pointsTable = this.$el.find('.js-points-table');

			return this;
		}
	});
}());