/*global $, Backbone, _ */
(function () {
	"use strict";
	f1.views.HeaderView = Backbone.View.extend({

		tagName: 'header',
		template: $('#header-template').html(),

		events: {
			'click .nav a': 'navigate'
		},

		initalize: function () {
			f1.log('HeaderView:initalize');

			return this;
		},

		navigate: function (evnt) {
			var $link = $(evnt.currentTarget),
				url = $link.attr('href');

			// Check that the link wasn't a dropdown toggler
			if ($link.hasClass('dropdown-toggle')) {
				return;
			}

			f1.app.router.navigate(url, { trigger: true });

			evnt.preventDefault();
		},

		render: function () {
			f1.log('HeaderView:render');
			this.$el.html(this.template);

			return this;
		}
	});
}());