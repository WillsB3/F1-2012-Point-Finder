/*global $, Backbone, _, f1 */
(function () {
	"use strict";
	f1.views.PointsListView = Backbone.View.extend({

		className: "points-list",

		events: {
			'click .js-add-point': 'addPoint',
			'click .js-edit-points': 'editPoints',
			'click .js-done-editing': 'doneEditing',
			'click .js-remove-points': 'removePoints'
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
			this.listenTo(this.points, 'destroy', this.onPointDestroyed);
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

		doneEditing: function () {
			var editedPoints = this.getSelectedPoints();

			_.each(editedPoints, function (pointView) {
				// Toggle the editing state for each 
				// of the selected points
				pointView.disableEditing();
			});

			this.isEditing = false;
			this.updateEditButton();
		},

		editPoints: function () {
			var pointsToEdit = this.getSelectedPoints();

			_.each(pointsToEdit, function (pointView) {
				// Toggle the editing state for each 
				// of the selected points
				pointView.enableEditing();
			});

			this.isEditing = true;
			this.updateEditButton();
		},

		removePoints: function () {
			var pointsToRemove = this.getSelectedPoints();

			_.each(pointsToRemove, function (pointView) {
				// Remove the point model. The point view
				// will be removed automatically.
				pointView.point.destroy();
			});
		},

		getSelectedPoints: function () {
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

		updateEditButton: function () {
			if (this.isEditing) {
				this.$el.find('.js-edit-points')
					.addClass('points-list__section__done-editing-button btn-success js-done-editing')
					.removeClass('points-list__section__edit-points-button js-edit-points')
					.text('Done');
			} else {
				this.$el.find('.js-done-editing')
					.removeClass('points-list__section__done-editing-button btn-success js-done-editing')
					.addClass('points-list__section__edit-points-button js-edit-points')
					.text('Edit');
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

		onPointDestroyed: function (pointModel) {
			// Remove the associated point view
			var view = null, viewIndex = null;

			view = _.find(this.pointViews, function (pointView, index) {
				if (pointView.point === pointModel) {
					viewIndex = index;
					return true;
				}

				return false;
			});

			view.remove();

			// Remove the view from the array of PointViews
			delete this.pointViews[viewIndex];

			this.updateButtons();
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