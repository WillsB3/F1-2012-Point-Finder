/*global $, f1, Backbone, _, LANG */
(function () {
	"use strict";
	f1.Application = Backbone.View.extend({
		el: 'body',
		router: null,
		currentView: null,

		header: null,

		templateCache: null,

		elements: {
			$contentPane: $('#app')
		},

		initialize: function () {
			f1.log('Application:initalize');

			// Initialise the main router
			this.router = new f1.Router();

			// Initalise the template cache
			this.templateCache = {};

			// Create a global events hash
			this.vent = _.extend({}, Backbone.Events, {
				list: function () {
					f1.info('The following application level events being listened for:');
					f1.log(this._callbacks);
				}
			});

			return this;
		},

		showPage: function (view, options) {
			f1.log('Application:showPage');

			var circuit = null;

			if (this.currentView) {
				f1.info('Application: Closing the current view');
				
				if (this.currentView.circuit) {
					circuit = this.currentView.circuit;
				}

				this.currentView.close();
				this.currentView = null;

				this.vent.trigger('application:currentView:closed');
			}

			if (_.isUndefined(options)) {
				options = {};
			}

			if (circuit) {
				options.circuit = circuit;
			}

			f1.info('Application: Creating the new page view');

			this.currentView = new f1.pages[view](options);

			// Add the required classes to the content pant
			this.elements.$contentPane.removeClass().addClass(this.currentView.contentPaneClasses.join(' '));

			// Attach the new view do the content pane in the DOM
			this.elements.$contentPane.append(this.currentView.el);

			// Render the new view
			this.currentView.render();

			return this.currentView;
		},

		render: function () {
			f1.log('Application:render');

			// Create the application wide navigation header view
			this.header = new f1.views.HeaderView();
			this.$el.prepend(this.header.render().$el);

			return this;
		}
	});
}());
