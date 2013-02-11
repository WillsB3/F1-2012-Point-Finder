/*
* Backbone Collections 
*/

(function () {
	"use strict";
	f1.collections.PointList = Backbone.Collection.extend({

		localStorage: new Backbone.LocalStorage("PointList"),

		model: f1.models.Point,

		initialize: function () {
			f1.log('PointList::initialize');
		}

	});

	f1.collections.CalibrationSet = f1.collections.PointList.extend({

		initialize: function () {
			f1.log('CalibrationSet::initialize');
		}

	});

}());