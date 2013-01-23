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
    search: function(page){
      var response = Rotten.search(this.keyword, page || currentPage),
          movies = parseArray(response.movies);
      this.totalPages = Math.ceil(response.total/perPage);
      return concatPage(movies);
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
        this.transitionTo("search.results", searcher);
      }
    }
  });


  Ember._.exports("Search", { route: route });
}).call(Movies);
