/*global $, f1, Backbone, _ */
(function () {
	"use strict";
	f1.pages.BasePageView = Backbone.View.extend({

		className: 'l-page',

		contentPaneClasses: [],
		navigationIdentifier: '',

		meta: {
			pageTitle: ''
		},

		elements: {
			$header: $('.navbar')
		},

		initialize: function () {
			f1.log('BasePageView:initalize');

			return this;
		},

		render: function () {
			f1.log('BasePageView:render');

			return this;
		},

		close: function () {
			this.undelegateEvents();
			this.unbind();
			this.remove();
		}
	});
}());
