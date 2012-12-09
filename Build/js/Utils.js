/*global $, _ */
var f1;

(function (window, document) {
	"use strict";

	f1 = {
		debugMode: true,
		pageStartTime: new Date().getTime(),

		circuits: [
			{
				id: 'melbourne',
				circuit: "Albert park",
				placename: "Melbourne",
				image: "melbourne.jpg",
				bounds: {
					NW: {
						lat: null,
						lng: null
					},

					SE: {
						lat: null,
						lng: null
					}
				},
				mapCenter: {
					lat: -37.846663684549135,
					lng: 144.97056484222412
				},
				round: 1
			},
			{
				id: 'sepang',
				circuit: "Sepang International Circuit",
				placename: "Kuala Lumpur",
				image: "melbourne.jpg",
				bounds: {
					NW: {
						lat: null,
						lng: null
					},

					SE: {
						lat: null,
						lng: null
					}
				},
				mapCenter: {
					lat: 2.7603622912363823,
					lng: 101.73752903938293
				},
				round: 2
			}
		],

		msg: function (args, level) {
			if (f1.debugMode && window.console) {
				var validLogLevels = ['log', 'info', 'warn', 'error'],
					timeDiff = new Date().getTime() - f1.pageStartTime;

				if (!_.isArray(args)) {
					args = _.toArray(args);
				}

				if (_.isUndefined(level) || _.indexOf(validLogLevels, level) === -1) {
					level = 'log';
				}
				if (args.length === 1) {
					if (!_.isObject(args[0])) {
						window.console[level](timeDiff + "ms | " + args[0]);
					} else {
						window.console.info('Log at: ' + timeDiff + "ms");
						window.console[level](args[0]);
					}
				} else {
					window.console[level](timeDiff + "ms | " + args.join(' '));
				}
			}
		},

		log: function () {
			f1.msg(arguments, 'log');
		},

		info: function () {
			f1.msg(arguments, 'info');
		},

		warn: function () {
			f1.msg(arguments, 'warn');
		},

		error: function () {
			f1.msg(arguments, 'error');
		},

		template: function (templateString, data, settings) {
			var tmCache = f1.app.templateCache,
				template = tmCache[templateString],
				selector = templateString.charAt(0) === '#' ? true : false;
			if (selector) {
				if (!template) {
					// If the tempalate is not in the template cache, we need to fetch it from the DOM if it's a selector
					template = $(templateString).html();

					// Precompile the template
					template = _.template(template);

					tmCache[templateString] = template;
				}

				return template(data);
			} else {
				return _.template(templateString, data);
			}
		},

		pages: {},
		views: {}
	};
}(window, document));