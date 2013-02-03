/*global $, google, console */
/*
	Lat = y axis
	Lng = x axis

*/
(function () {
	"use strict";
	var MAP_CONFIG = {
		repeatOnXAxis: false,
		blankTilePath: 'http://f12012pf.willsbithrey.com/tiles/_empty.jpg',
		tilePath: 'http://f12012pf.willsbithrey.com/tiles/melbourne/',
		maxZoom: 5
	};

	var CALIBRATING = false,
		CIRCUITS = {
			MELBOURNE: {
				calibrationPoints: [
					{
						simed: {
							x: -104.216,
							y: -388.953
						},
						gmaps: {
							x: 120.625,
							y: 155.53125
						}
					},
					{
						simed: {
							x: -191.783,
							y: 920.459
						},
						gmaps: {
							x: 114.25,
							y: 61.3125
						}
					},
				],
				scale: 1,
				tilePath: 'http://f12012pf.willsbithrey.com/tiles/melbourne/'
			}
		};

	function calibrate(circuitName) {
		var circuit = CIRCUITS[circuitName];
		var points = circuit.calibrationPoints;
		console.log('Running calibration for ' + circuitName.toLowerCase());

		var simedDeltaX = Math.abs(points[0].simed.x - points[1].simed.x);
		var simedDeltaY = Math.abs(points[0].simed.y - points[1].simed.y);

		var gmapsDeltaX = Math.abs(points[0].gmaps.x - points[1].gmaps.x);
		var gmapsDeltaY = Math.abs(points[0].gmaps.y - points[1].gmaps.y);

		var scaleX = simedDeltaX / gmapsDeltaX;
		var scaleY = simedDeltaY / gmapsDeltaY;
		var scaleAvg = (scaleX + scaleY) / 2;

		console.log('3dSimEd Delta ('+ simedDeltaX + ', ' + simedDeltaY + ')');
		console.log('GMaps Delta (' + gmapsDeltaX + ', ' + gmapsDeltaY + ')');

		console.log('scaleX:   ' + scaleX);
		console.log('scaleY:   ' + scaleY);
		console.log('scaleAvg: ' + scaleAvg);

		console.log('Calibrated');

		circuit.scale = scaleAvg;
	}

	/*
	 * Helper function which normalizes the coords so that tiles can repeat across the X-axis (horizontally) like the standard Google map tiles.
	 * ----------------
	 */

	function getNormalizedCoord(coord, zoom) {

		if (!MAP_CONFIG.repeatOnXAxis) {
			return coord;
		}

		var y = coord.y;
		var x = coord.x;

		// tile range in one direction range is dependent on zoom level
		// 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
		var tileRange = 1 << zoom;

		// don't repeat across Y-axis (vertically)
		if (y < 0 || y >= tileRange) {
			return null;
		}

		// repeat across X-axis
		if (x < 0 || x >= tileRange) {
			x = (x % tileRange + tileRange) % tileRange;
		}

		return {
			x: x,
			y: y
		};
	}

	function enableCalibration() {
		CALIBRATING = true;
		$('.circuit_calibrate').removeClass('btn-inverse').addClass('btn-info').text('Calibrating');
		$('.calibrating-alert').css('display', 'block').fadeIn();
	}

	function disableCalibration() {
		CALIBRATING = false;
		$('.circuit_calibrate').removeClass('btn-info').addClass('btn-inverse').text('Calibrate');
		$('.calibrating-alert').fadeOut(function() {
			$(this).css('display', 'none');
		});
	}

	// Define our custom map type
	var circuitMapType = new google.maps.ImageMapType({
		getTileUrl: function (coord, zoom) {
			var normalizedCoord = getNormalizedCoord(coord, zoom);
			if (normalizedCoord && (normalizedCoord.x < Math.pow(2, zoom)) && (normalizedCoord.x > -1) && (normalizedCoord.y < Math.pow(2, zoom)) && (normalizedCoord.y > -1)) {
				return MAP_CONFIG.tilePath + zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.jpg';
			} else {
				return MAP_CONFIG.blankTilePath;
			}
		},
		tileSize: new google.maps.Size(256, 256),
		maxZoom: MAP_CONFIG.maxZoom,
		name: 'Champagne in the park'
	});

	// Basic options for our map
	var circuitMapOptions = {
		center: new google.maps.LatLng(0, 0),
		draggableCursor: 'crosshair',
		zoom: 2,
		minZoom: 0,
		streetViewControl: false,
		mapTypeControl: false,
		mapTypeControlOptions: {
			mapTypeIds: ["circuit_map"]
		}
	};

	// Initialise the map
	var $mapContainer = $('.map-google-map-container'),
		map = new google.maps.Map($mapContainer[0], circuitMapOptions);

	// Hook the our custom map type to the map and activate it
	map.mapTypes.set('circuit_map', circuitMapType);
	map.setMapTypeId('circuit_map');

	google.maps.event.addListener(map, "rightclick", function(event) {
		if (CALIBRATING) {
			var knownCoord = window.prompt('Enter the clicked points coordinate');
			if (!knownCoord) {
				return;
			} else {
				knownCoord = knownCoord.split(' ');
			}

			// Melbourne Known location
			// 464.928 -214.710
			var knownX = knownCoord[0];
			var knownY = knownCoord[1];

			var gmapsX = event.ga.x * CIRCUITS.MELBOURNE.scale;
			var gmapsY = event.ga.y * CIRCUITS.MELBOURNE.scale;

			// If gmapsX < knownX then Google Map is offset left of game map
			var directionX = gmapsX < knownX ? 1 : -1;

			// If gmapsY < knownY then Google Map is offset above of game map
			var directionY = gmapsY < knownY ? -1 : 1;

			// Red and white stripe box at -383.613 -96.137

			var xa, xb;
			var ya, yb;

			if (gmapsX > knownX) {
				xa = gmapsX;
				xb = knownX;
			} else {
				xa = knownX;
				xb = gmapsX;
			}

			if (gmapsY > knownY) {
				ya = gmapsY;
				yb = knownY;
			} else {
				ya = knownY;
				yb = gmapsY;
			}

			var offsetX = directionX * (xa - xb);
			var offsetY = directionY * (ya - yb);

			console.log('diffX: ' + offsetX);
			console.log('diffY: ' + offsetY);

			CIRCUITS.MELBOURNE.offsetX = offsetX;
			CIRCUITS.MELBOURNE.offsetY = offsetY;

			disableCalibration();
		} else {
			debugger
			var signX = event.ga.x > 0 ? 1 : -1;
			var signY = event.ga.y > 0 ? 1 : -1;

			var gmapsX = signX * (event.ga.x * CIRCUITS.MELBOURNE.scale);
			var gmapsY = signY * (event.ga.y * CIRCUITS.MELBOURNE.scale);
			var offsetX = CIRCUITS.MELBOURNE.offsetX;
			var offsetY = CIRCUITS.MELBOURNE.offsetY;

			var xa, xb;
			var ya, yb;

			if (gmapsX > offsetX) {
				xa = gmapsX;
				xb = offsetX;
			} else {
				xa = offsetX;
				xb = gmapsX;
			}

			if (gmapsY > offsetY) {
				ya = gmapsY;
				yb = offsetY;
			} else {
				ya = offsetY;
				yb = gmapsY;
			}

			var diffX = xa - xb;
			var diffY = ya - yb;

			var gameX = gmapsX + offsetX;
			var gameY = gmapsY + offsetY;

			console.log("World Coordinate (" + event.ga.x + ', ' + event.ga.y + ")");
			console.log("Computed Game Coordinate (" + gameX + ', ' + gameY + ")");
		}
	});

	// Calibrate the selected circuit
	calibrate('MELBOURNE');

	// Bind UI
	$('.circuit_calibrate').on('click', function(evnt) {
		if (CALIBRATING) {
			disableCalibration();
		} else {
			enableCalibration();
		}
	});

	$(document).ready(function () {
		console.log('Ready');
		// initialize();
	});
}());