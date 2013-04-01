/*global $, Backbone, _, f1, google */
(function () {
	"use strict";
	f1.views.PointsListView = Backbone.View.extend({

		className: "points-list",

		events: {
			'click .js-add-point': 'addPoint',
			'click .js-edit-points': 'editPoints',
			'click .js-done-editing': 'doneEditing',
			'click .js-remove-points': 'removePoints',
			'click .js-save-all-points': 'savePoints',
			'click .js-calibrate-points': 'calibrate'
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
			_.bindAll(this, 'savePoints');

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

		calibrate: function () {
			var scale  = {x: null, y: null},
				offset = {x: null, y: null},
				self = this;

			// Stage 1 - Scale computation
			// ------------
			// Compute the difference in scale between the game 
			// coordinates and the points corresponding world coordinates
			function computeScale() {
				var averageScale = { x: null, y: null },
					scales = {
						x: [],
						y: []
					};

				self.points.each(function (point, index) {
					debugger;
					var pointLatLng,
						pointGameCoords = { x: null, y: null },
						pointWorldCoords = { x: null, y: null },
						map = self.options.map;

					pointGameCoords = {
						x: point.get('game_x'),
						y: point.get('game_y')
					};

					pointLatLng = new google.maps.LatLng(point.get('world_lat'), point.get('world_lng'));
					pointWorldCoords = map.getProjection().fromLatLngToPoint(pointLatLng);

					// Compare against all other points
					self.points.each(function (otherPoint, otherIndex) {

						// Check points are not equal
						if (point.cid === otherPoint.cid) {
							return;
						}

						var gameDelta = { x: null, y: null },
							otherPointLatLng,
							otherPointGameCoords,
							otherPointWorldCoords,
							scale = { x: null, y: null },
							worldDelta = { x: null, y: null };

						otherPointGameCoords = {
							x: otherPoint.get('game_x'),
							y: otherPoint.get('game_y')
						};

						otherPointLatLng = new google.maps.LatLng(otherPoint.get('world_lat'), otherPoint.get('world_lng'));
						otherPointWorldCoords = map.getProjection().fromLatLngToPoint(otherPointLatLng);

						// Calculate the distance between world coordinates
						worldDelta.x = pointWorldCoords.x - otherPointWorldCoords.x;
						worldDelta.y = pointWorldCoords.y - otherPointWorldCoords.y;

						// Calculate the distance between game coordinates
						gameDelta.x =  pointGameCoords.x - otherPointGameCoords.x;
						gameDelta.y =  pointGameCoords.y - otherPointGameCoords.y;

						// Calculate the scale based on this point
						scale.x = gameDelta.x / worldDelta.x;
						scale.y = gameDelta.y / worldDelta.y;

						// Store the computed differences
						scales.x.push(scale.x);
						scales.y.push(scale.y);
					});
				});

				averageScale.x = _.reduce(scales.x, function (memo, scale) { return memo + scale; }) / scales.x.length;
				averageScale.y = _.reduce(scales.y, function (memo, scale) { return memo + scale; }) / scales.y.length;

				f1.log('Average scale: ' + averageScale.x + ' ' + averageScale.y);

				return averageScale;
			}

			function computeOffset() {
				// Stage 2 - Offset computation
				// ------------
				// Compute the average difference between the added game
				// coordinates and their corresponding world coordinates

				var averages = { x: 0, y: 0 },
					deltas = [];

				// Iterate through all points and compute the difference between
				// game coordinated and world coordinates
				self.points.each(function (point, index) {
					var game = { x: null, y: null},
						delta = { x: null, y: null },
						latLng = null,
						world = { x: null, y: null };

					game.x = point.get('game_x');
					game.y = point.get('game_y');

					latLng = new google.maps.LatLng(point.get('world_lat'), point.get('world_lng'));
					world = self.options.map.getProjection().fromLatLngToPoint(latLng);

					// debugger;
					delta.x = world.x - game.x;
					delta.y = world.y - game.y;
					f1.log('Point at ' + index + ': delta-x = ' + delta.x + ' delta-y = ' + delta.y);
					deltas.push(delta);

					averages.x += delta.x;
					averages.y += delta.y;
				});

				averages.x = averages.x / deltas.length;
				averages.y = averages.y / deltas.length;
				f1.log('Average delta {x: ' + averages.x + ', y: ' + averages.y + '}');

				return averages;
			}

			var scale = computeScale();
			var offset = computeOffset();

			debugger;
			var listener = google.maps.event.addListener(self.options.map, 'mousemove', function (evnt) {
				debugger;
				var world_coords = self.options.map.getProjection().fromLatLngToPoint(evnt.latLng);
				var game_coords = {
					x: (world_coords.x - offset.x) / scale.x
				};

				f1.log('game x: ' + game_coords.x);
				// f1.log('world x: ' + world_coords.x + 'world y: ' + world_coords.y);
			});
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

		savePoints: function () {
			// Save all points
			this.points.each(function (point) {
				point.save();
			});

			f1.app.vent.trigger('notify', {
				contents: '<strong>Success</strong> Points saved successfully',
				type: 'alert-success'
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
					.addClass('points-list__section__done-editing-button js-done-editing')
					.removeClass('points-list__section__edit-points-button js-edit-points')
					.text('Done');
			} else {
				this.$el.find('.js-done-editing')
					.removeClass('points-list__section__done-editing-button js-done-editing')
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