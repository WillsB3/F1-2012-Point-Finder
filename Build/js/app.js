/*global $, google, console */
(function () {
	"use strict";

	// Create our custom map type
	function CoordMapType(tileSize) {
		this.tileSize = tileSize;
	}

	CoordMapType.prototype.getTile = function (coord, zoom, ownerDocument) {
		var div = ownerDocument.createElement('div');
		// div.innerHTML = coord;
		// div.style.width = this.tileSize.width + 'px';
		// div.style.height = this.tileSize.height + 'px';
		// div.style.fontSize = '10';
		// div.style.borderStyle = 'solid';
		// div.style.borderWidth = '1px';
		// div.style.borderColor = '#AAAAAA';
		return div;
	};

	function initialize() {
		var albertPark = new google.maps.LatLng(-37.846799, 144.972912),
			map,
			mapOptions = {
				center: albertPark,
				zoom: 14,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			},
			$map = $('.map-google-map-container');

		map = new google.maps.Map($map[0], mapOptions);
		map.overlayMapTypes.insertAt(0, new CoordMapType(new google.maps.Size(256, 256)));
	}

	$(document).ready(function () {
		console.log('Ready');
		initialize();
	});
}());