require('vendor/jquery');
require('vendor/handlebars');
require('vendor/ember');
require('vendor/foundation/jquery.foundation.tooltips');
require('vendor/foundation/modernizr.foundation');
require('vendor/foundation/app');
require('vendor/jquery.inview');

require('lib/ember-export');

window.Movies = Ember.Application.create();
Ember._.exports.setup(Movies);

require('lib/fixtures');
require('lib/rotten');

require('app/routes');
require('app/search/search');
require('app/search/results');
