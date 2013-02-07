Movies.Router.map(function(){
  this.resource("search", function(){
    this.route("results", { path: "/:keyword" });
  });
});

Movies.IndexRoute = Ember.Route.extend({
  redirect: function(){
    this.transitionTo("search");
  }
});
