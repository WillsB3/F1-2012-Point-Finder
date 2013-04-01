/*
* Backbone Models 
*/

(function () {
	"use strict";
	f1.models.Point = Backbone.Model.extend({
		
		defaults: {
			"game_x": null,
			"game_y": null,
			"world_lat": null,
			"world_lng": null
		},

		initialize: function () {
			f1.log('Point::initialize');

		}
		
	});

}());