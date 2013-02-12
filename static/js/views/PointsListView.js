/*global $, Backbone, _ */
(function () {
	"use strict";
	f1.views.PointsListView = Backbone.View.extend({

		className: "points-list",

		events: {
			'click .js-add-point': 'addPoint',
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

		isEditing: false,

		initialize: function () {
			this.points = new f1.collections.PointList();
			this.pointViews = {};

			this.listenTo(this.points, 'add', this.onPointAdded);
			this.listenTo(this.points, 'reset', this.onDataLoaded);

			return this;
		},

		addPoint: function () {
			var location = this.options.map.getCenter();

			// Create the model for this point
			var point = new f1.models.Point({
				world_lat: location.lat(),
				world_lng: location.lng()
			});

			this.points.add(point);
		},

		expandPane: function () {
			this.$el.addClass('is-expanded');
		},

		collapsePane: function () {
			this.$el.removeClass('is-expanded');
		},

		onPointAdded: function (model, collection) {
			// Create a view (marker) for the point.
			// The Point view will automatically render itself
			var pointView = new f1.views.Point({
				tagName: 'tr',
				template: this.pointTemplate,
				point: model,
				map: this.options.map
			});

			this.elements.$pointsTable.find('tbody').append(pointView.render().$el);

			// Store a reference to the point view		
			this.pointViews[model.cid] = pointView;
		},

		onDataLoaded: function() {
			var self = this;
			
			this.points.each(function(point) {
				self.onPointAdded(point, self.points);
			});
		},

		remove: function () {
			_.each(this.pointViews, function (pointView) {
				pointView.remove();
			});
		},

		render: function () {
			this.$el.append(this.template);
			this.elements.$pointsTable = this.$el.find('.js-points-table');

			// Load point data 
			this.points.fetch();

			return this;
		}
	});
}());