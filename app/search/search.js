(function(app){

  var parseArray = function(raw){
    var parsed = raw.map(parseObject);
    return parsed;
  };

  var parseObject = function(raw){
    return Movies.Movie.create(raw);
  };

  var currentPage = 1,
      fetched = [],
      perPage = 10;

  var concatPage = function(page){
    fetched = fetched.concat(page);
    return fetched;
  };

  var Searcher = Ember.Object.extend({
    keyword: null,
    totalPages: null,
    reset: function(){
      fetched = [];
      this.set("currentPage", 1);
    },
    search: function(page){
      var searching = Rotten.search(this.keyword, page || currentPage),
          self = this,
          deferred = $.Deferred();
      searching.then(function(response){
        var movies = parseArray(response.movies);
        self.set("totalPages", Math.ceil(response.total/perPage));
        deferred.resolve(concatPage(movies));
      });
      return deferred.promise();
    },
    nextPage: function(){
      this.incrementProperty("currentPage");
      return this.search(this.get("currentPage"));
    },
    currentPage: function(){
      return currentPage;
    }.property(),
    hasMoreResults: function(){
      return this.get("currentPage") < this.totalPages;
    }.property("currentPage")
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

        searcher.reset();

        var searching = searcher.search();
        var self = this;
        searching.done(function(results){
          self.transitionTo("search.results", results);
        });
      }
    }
  });

  var controller = Ember.ObjectController.extend();

  Ember._.exports("Search", { route: route, controller: controller });
}).call(Movies);
