/*global $, _ */
var f1;

(function (window, document) {
	"use strict";

	f1 = {
		debugMode: true,
		pageStartTime: new Date().getTime(),
		production: null, // Will be over-ridden by Django
		tileServer: {
			production: 'http://tiles.f12012pf.willsbithrey.com/',
			development: 'http://tiles.dev/'
		},

		circuits: [
			{
				id: 'melbourne',
				circuit: "Albert park",
				placename: "Melbourne",
				image: "melbourne.jpg",
				bounds: {
					// NW: {
					// 	lat: -37.8549105451,
					// 	lng: 144.960886
					// },

					// SE: {
					// 	lat: -37.835617,
					// 	lng: 144.980000736
					// },

					SW: {
						lat: -37.8549105451,
						lng: 144.960886
					},

					NE: {
						lat: -37.835617,
						lng: 144.980000736
					}

					// SW: {
					// 	lat: -37.85491054512458,
					// 	lng: -37.85491054512458
					// },

					// NE: {
					// 	lat: -37.83561699999996,
					// 	lng: 144.980000736
					// }
				},
				mapCenter: {
					lat: -37.846663684549135,
					lng: 144.97056484222412,
					zoom: 16
				},
				maxZoom: 19,
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
					lng: 101.73752903938293,
					zoom: 16
				},
				round: 2
			},

			{
				id: 'shanghai',
				circuit: "Shanghai International Circuit",
				placename: "Shanghai",
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
					lat: 31.34102901000588,
					lng: 121.2207841873169,
					zoom: 16
				},
				round: 3
			},

			{
				id: 'sakhir',
				circuit: "Bahrain International Circuit",
				placename: "Sakhir",
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
					lat: 26.031701220817023,
					lng: 50.51309823989868,
					zoom: 16
				},
				round: 4
			},

			{
				id: 'barcelona',
				circuit: "Circuit de Catalunya",
				placename: "Barcelona",
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
					lat: 41.56936882301982,
					lng: 2.2587203979492188,
					zoom: 16
				},
				round: 5
			},

			{
				id: 'monte_carlo',
				circuit: "Circuit de Monaco",
				placename: "Monte Carlo",
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
					lat: 43.734825030172594,
					lng: 7.422831058502197,
					zoom: 16
				},
				round: 6
			},

			{
				id: 'montreal',
				circuit: "Circuit Gilles Villeneuve",
				placename: "Montreal",
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
					lat: 45.505264141298525,
					lng: -73.52585077285767,
					zoom: 15
				},
				round: 7
			},

			{
				id: 'valencia',
				circuit: "Valencia Street Circuit",
				placename: "Valencia",
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
					lat: 39.45862849182396,
					lng: -0.32783031463623047,
					zoom: 15
				},
				round: 8
			},

			{
				id: 'silverstone',
				circuit: "Silverstone Circuit",
				placename: "Silverstone",
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
					lat: 52.071883159541464,
					lng: -1.0155487060546875,
					zoom: 15
				},
				round: 9
			},

			{
				id: 'hockenheim',
				circuit: "Hockenheimring",
				placename: "Hockenheim",
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
					lat: 49.33029630958617,
					lng: 8.57306957244873,
					zoom: 16
				},
				round: 10
			},

			{
				id: 'budapest',
				circuit: "Hungaroring",
				placename: "Budapest",
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
					lat: 47.583212944708805,
					lng: 19.25079345703125,
					zoom: 16
				},
				round: 11
			},

			{
				id: 'spa',
				circuit: "Circuit de Spa-Francorchamps",
				placename: "Spa",
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
					lat: 50.43741803666471,
					lng: 5.971155166625977,
					zoom: 15
				},
				round: 12
			},

			{
				id: 'monza',
				circuit: "Autodromo Nazionale Monza",
				placename: "Monza",
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
					lat: 45.62256209689009,
					lng: 9.286022186279297,
					zoom: 15
				},
				round: 13
			},

			{
				id: 'singapore',
				circuit: "Marina Bay Street Circuit",
				placename: "Singapore",
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
					lat: 1.2918355143455886,
					lng: 103.85809421539307,
					zoom: 16
				},
				round: 13
			},

			{
				id: 'suzuka',
				circuit: "Suzuka Circuit",
				placename: "Suzuka",
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
					lat: 34.84563108514324,
					lng: 136.53154134750366,
					zoom: 16
				},
				round: 13
			},

			{
				id: 'yeongam',
				circuit: "Korea International Circuit",
				placename: "Yeongam",
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
					lat: 34.73596993148604,
					lng: 126.41334772109985,
					zoom: 16
				},
				round: 13
			},

			{
				id: 'india',
				circuit: "Buddh International Circuit",
				placename: "India",
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
					lat: 28.34990117892842,
					lng: 77.53543138504028,
					zoom: 16
				},
				round: 13
			},

			{
				id: 'abu_dhabi',
				circuit: "Yas Marina Circuit",
				placename: "Abu Dhabi",
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
					lat: 24.47146688629941,
					lng: 54.60548400878906,
					zoom: 16
				},
				round: 13
			},

			{
				id: 'texas',
				circuit: "Circuit of the Americas",
				placename: "Austin, Texas",
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
					lat: 30.135162294028376,
					lng: -97.63603448867798,
					zoom: 16
				},
				round: 13
			},

			{
				id: 'sao_paulo',
				circuit: "Autódromo José Carlos Pace",
				placename: "São Paulo",
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
					lat: -23.702379629984165,
					lng: -46.697494983673096,
					zoom: 16
				},
				round: 13
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

		collections: {},
		models: {},
		maps: {},
		pages: {},
		views: {}
	};
}(window, document));