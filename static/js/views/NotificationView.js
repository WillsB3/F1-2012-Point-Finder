/*global $, Backbone, _, f1 */
(function () {
	"use strict";
	f1.views.NotificationView = Backbone.View.extend({
		className: 'notification alert is-invisible',

		options: {},

		defaults: {
			block: false,
			permanent: false,
			type: null
		},

		closeTemplate: '<button class="close" data-dismiss="alert" href="#">&times;</button>',
		timeout: 5000,

		initialize: function () {
			f1.log('f1.views.NotificationView::initialize');
			_.bindAll(this, 'hide', 'show');

			this.options = _.extend({}, this.defaults, this.options);

			return this;
		},

		hide: function () {
			var self = this;

			this.$el.addClass('is-invisible');

			setTimeout(function () {
				self.remove();
			}, 100);
		},

		show: function () {
			var self = this;

			setTimeout(function () {
				self.$el.removeClass('is-invisible');

				if (!self.options.permanent) {
					setTimeout(self.hide, self.timeout);
				}
			}, 20);
		},

		remove: function () {
			this.trigger('notification:removed');

			Backbone.View.prototype.remove.apply(this, arguments);
		},

		render: function () {
			f1.log('f1.views.NotificationView::render');

			// Populate the alert with the alert text
			this.$el.html(this.options.contents);
			this.$el.append(this.closeTemplate);

			if (this.options.type) {
				this.$el.addClass(this.options.type);
			}

			if (this.options.block) {
				this.$el.addClass('alert-block');
			}

			// Enable Bootstrap alert functionality
			this.$el.alert();

			return this;
		}
	});
}());