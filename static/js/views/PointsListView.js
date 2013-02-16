/*global $, Backbone, _, f1 */
(function () {
	"use strict";
	f1.views.PointsListView = Backbone.View.extend({

		className: "points-list",

		events: {
			'click .js-add-point': 'addPoint',
			'click .js-edit-points': 'editPoints',
			'click .js-remove-points': 'removePoints'
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

		buttonStates: {
			ENABLED: "enabled",
			DISABLED: "disabled"
		},

		isEditing: false,

		initialize: function () {
			this.points = new f1.collections.PointList();
			this.pointViews = {};

			// When a point is selected or deselected we need to enable/disable
			// the edit and remove buttons accordingly
			this.listenTo(this.points, 'point:selected', this.updateButtons);

			this.listenTo(this.points, 'add', this.onPointAdded);
			this.listenTo(this.points, 'reset', this.onDataLoaded);

			return this;
		},

		addPoint: function () {
			var location = this.options.map.getCenter(),
				point;

			// Create the model for this point
			point = new f1.models.Point({
				world_lat: location.lat(),
				world_lng: location.lng()
			});

			this.points.add(point);
		},

		editPoints: function () {

		},

		removePoints: function () {

		},

		getSelectedPoints: function () {
			f1.warn('selected');
			return _.filter(this.pointViews, function (pointView) {
				return pointView.isSelected === true;
			});
		},

		updateButtons: function () {
			var selected = this.getSelectedPoints();

			if (selected.length > 0) {
				// Enable Edit/Remove buttons
				this.changeButtonState(this.$el.find('.js-edit-points'), "enabled");
				this.changeButtonState(this.$el.find('.js-remove-points'), "enabled");
			} else {
				// Disable Edit/Remove buttons
				this.changeButtonState(this.$el.find('.js-edit-points'), "disabled");
				this.changeButtonState(this.$el.find('.js-remove-points'), "disabled");
			}
		},

		changeButtonState: function ($button, state) {
			if (state === this.buttonStates.ENABLED) {
				$button.removeClass('disabled');
			} else if (state === this.buttonStates.DISABLED) {
				$button.addClass('disabled');
			}
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

		onDataLoaded: function () {
			var self = this;

			this.points.each(function (point) {
				self.onPointAdded(point, self.points);
			});
		},

		remove: function () {
			_.each(this.pointViews, function (pointView) {
				pointView.remove();
			});

			Backbone.View.prototype.remove.apply(this, arguments);
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