require('vendor/jquery');
require('vendor/handlebars');
require('vendor/ember');

require('lib/ember-export');

window.Movies = Ember.Application.create();
Ember._.exports.setup(Movies);

require('lib/rotten');
require('lib/fixtures');

require('app/routes');
require('app/search/search');
require('app/search/results');
