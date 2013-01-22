(function(app){

  var Searcher = Ember.Object.extend({
    keyword: null,
    search: function(){
      var response = Rotten.search(this.keyword);
      return response.movies.map(function(rawMovie){
        return Movies.Movie.create(rawMovie);
      });
    }
  });

  Movies.Movie = Ember.Object.extend({
    imdbUrl: function(){
      var imdbId = this.get("alternate_ids.imdb");
      return "http://www.imdb.com/title/tt" + imdbId;
    }.property("alternate_ids.imdb"),
    imdbCaption: function(){
      return "View " + this.get("title") + " on IMDb";
    }.property("title")
  });

  var route = Ember.Route.extend({
    model: function(){
      return Searcher.create();
    },
    setupController: function(controller){
      var model = this.model();
      controller.set("searcher", model);
    },
    events: {
      search: function(){
        var controller = this.controllerFor("search"),
            searcher = controller.get("searcher");
        this.transitionTo("search.results", searcher);
      }
    }
  });


  Ember._.exports("Search", { route: route });
}).call(Movies);
