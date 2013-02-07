/*global $, Backbone, _, f1, google */
(function () {
	"use strict";
	f1.views.CircuitSelector = Backbone.View.extend({

		className: "circuit-selector",
		template: $('#circuit-selector-template').html(),

		elements: {
			$searchField: null
		},

		searchMarkers: [],
		mapsApiListeners: {},

		events: {
			'focus .search-field': 'expandSearchField',
			'blur .search-field': 'contractSearchField',
			'submit .circuit-selector-search': 'preventDefaultFormBehaviour',
			'change .circuit-selector-select': 'circuitSelected'
		},

		initialize: function () {
			f1.log('CircuitSelector:initalize');
			_.bindAll(this, 'searchSuggestionSelected', 'contractSearchField', 'expandSearchField', 'onSearchInputBlur');

			return this;
		},

		contractSearchField: function (evnt) {
			this.elements.$searchField.css({
				width: '183px'
			});
		},

		expandSearchField: function (evnt) {
			this.elements.$searchField.css({
				width: '400px'
			});
		},

		preventDefaultFormBehaviour: function (evnt) {
			// Prevent the form submitting
			evnt.preventDefault();
		},

		render: function () {
			f1.log('CircuitSelector:render');

			// Render the template
			this.$el.html(f1.template(this.template, { circuits: f1.circuits }));

			// Cache required elements
			this.elements.$searchField = this.$el.find('input.search-field');
			this.elements.$circuitSelector = this.$el.find('select.circuit-selector-select');

			// Pre-select the current circuit
			if (this.options.circuit) {
				this.elements.$circuitSelector.find('option[value="' + this.options.circuit.id + '"]').prop('selected', true);
			}

			this.setupSearchBox();

			return this;
		},

		circuitSelected: function (evnt) {
			var circuit,
				latLng,
				selectedCircuitId = $(evnt.currentTarget).val(),
				zoomLevel;

			// Obtain the correct circuit config object
			circuit = _.find(f1.circuits, function (circuit) {
				return circuit.id === selectedCircuitId;
			});

			// Notify components listening to this view for events that the circuit
			// was changed
			this.trigger('circuit:changed', circuit);

			// Create a google LatLng object at the circuits center
			latLng = new google.maps.LatLng(circuit.mapCenter.lat, circuit.mapCenter.lng);

			// Center the map on the selected circuits location
			this.options.map.panTo(latLng);

			// Zoom to roughly the correct level
			zoomLevel = circuit.mapCenter.zoom || 16;
			this.options.map.setZoom(zoomLevel);

			if (circuit.maxZoom) {
				this.options.map.setOptions({ maxZoom: circuit.maxZoom });
			}
		},

		searchSuggestionSelected: function (evnt) {
			var places = this.searchBox.getPlaces(),
				bounds = new google.maps.LatLngBounds(),
				image,
				marker;

			// Remove existing markers
			_.each(this.searchMarkers, function (marker) {
				marker.setMap(null);
			});
			this.searchMarkes = [];

			// Add new markers
			for (var i = 0, place; place = places[i]; i++) {
				image = new google.maps.MarkerImage(
					place.icon, new google.maps.Size(71, 71),
					new google.maps.Point(0, 0), new google.maps.Point(17, 34),
					new google.maps.Size(25, 25)
				);

				marker = new google.maps.Marker({
					map: this.options.map,
					icon: image,
					title: place.name,
					position: place.geometry.location
				});

				this.searchMarkers.push(marker);
				bounds.extend(place.geometry.location);
			}

			this.options.map.fitBounds(bounds);
		},

		onSearchInputBlur: function (evnt) {
			if (evnt.target !== this.elements.$searchField[0]) {
				this.elements.$searchField.trigger('blur');
			}
		},

		setupSearchBox: function (evnt) {
			// Initialise the search box
			this.searchBox = new google.maps.places.SearchBox(this.elements.$searchField[0]);

			// Blur the search form on click of other UI elements
			$('body').on('click', this.onSearchInputBlur);

			this.mapsApiListeners.searchBox = google.maps.event.addListener(this.searchBox, 'places_changed', this.searchSuggestionSelected);
		},

		close: function () {
			google.maps.event.removeListener(this.mapsApiListeners.searchBox);
			$('body').off('click', this.onSearchInputBlur);
		}
	});
}());