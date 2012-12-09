/*global $, f1, Backbone, _ */
(function () {
	"use strict";
	f1.pages.BasePageView = Backbone.View.extend({

		id: 'app',
		className: '',

		contentPaneClasses: [],
		navigationIdentifier: '',

		meta: {
			pageTitle: ''
		},

		elements: {
			$header: $('.navbar')
		},

		close: function () {
			this.undelegateEvents();
			this.unbind();
			this.remove();
		}
	});
}());
