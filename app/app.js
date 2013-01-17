require('vendor/jquery');
require('vendor/handlebars');
require('vendor/ember');

window.Movies = Ember.Application.create();

Ember.Router.reopen({
  location: "history"
});

require('app/routes');
