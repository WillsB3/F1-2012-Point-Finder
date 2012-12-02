/*global $, google, console */
(function () {
	"use strict";
	var MAP_CONFIG = {
		repeatOnXAxis: false,
		blankTilePath: 'http://f12012pf.willsbithrey.com/tiles/_empty.jpg',
		tilePath: 'http://f12012pf.willsbithrey.com/tiles/melborune/',
		maxZoom: 5
	};

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













	// // Create our custom map type
	// function CoordMapType(tileSize) {
	// 	this.tileSize = tileSize;
	// }

	// CoordMapType.prototype.getTile = function (coord, zoom, ownerDocument) {
	// 	var div = ownerDocument.createElement('div');
	// 	// div.innerHTML = coord;
	// 	// div.style.width = this.tileSize.width + 'px';
	// 	// div.style.height = this.tileSize.height + 'px';
	// 	// div.style.fontSize = '10';
	// 	// div.style.borderStyle = 'solid';
	// 	// div.style.borderWidth = '1px';
	// 	// div.style.borderColor = '#AAAAAA';
	// 	return div;
	// };

	// function initialize() {
	// 	var albertPark = new google.maps.LatLng(-37.846799, 144.972912),
	// 		map,
	// 		mapOptions = {
	// 			center: albertPark,
	// 			zoom: 14,
	// 			mapTypeId: google.maps.MapTypeId.ROADMAP
	// 		},
	// 		$map = $('.map-google-map-container');

	// 	map = new google.maps.Map($map[0], mapOptions);
	// 	map.overlayMapTypes.insertAt(0, new CoordMapType(new google.maps.Size(256, 256)));
	// }

	$(document).ready(function () {
		console.log('Ready');
		// initialize();
	});
}());