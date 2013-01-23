(function(app){

  var Rotten;

  if(app.FIXTURES === true){
    var fixtures = Movies.LOAD_FIXTURE();

    Rotten = {
      search: function(keyword, page){
        var fixture = fixtures.getPage(page);
        return fixture;
      }
    };

    window.Rotten = Rotten;

    return;

  }

  Rotten = {
    baseUrl: "http://api.rottentomatoes.com/api/public/v1.0",
    search: function(keyword, page){
      return Rotten.Api.search(keyword, page, 10);
    }
  }

  $.ajaxSetup({
    data: { "apikey": "79zhuxca2esyzyn5km6v5bv9" },
    dataType: "jsonp"
  });

  var _cachedKeys = {};

  var keyCache = {
    getLink: function(key){
      return _cachedKeys[key];
    },
    addLink: function(key, link){
      _cachedKeys[key] = link;
    },
    removeLink: function(key){
      delete _cachedKeys[key];
    },
    hasKey: function(key){
      return _cachedKeys[key] !== undefined && _cachedKeys[key] != null;
    }
  }

  function formatUrl(url){
    return url + "?callback=?&apikey=";
  }

  function executioner(key, deferred){
    return function(data){
      $.get(data.links[key]).done(deferred.resolve);
    }
  }

  function executionerT(deferred, parser){
    return function(data){
      var link = parser(data.link_template);
      $.get(link).done(deferred.resolve);
    };
  }

  Rotten.Api = {
    home: function(){
      return $.get(Rotten.baseUrl).done(function(data){
        keyCache.addLink("movies", data.links.movies);
      });
    },
    movies: function(){
      var deferred = $.Deferred();
      if(keyCache.hasKey("movies")){
        $.get(keyCache.getLink("movies")).done(deferred.resolve);
      } else {
        Rotten.Api.home().then(executioner("movies", deferred));
        deferred.done(function(data){
          keyCache.addLink("search.template", data.link_template);
        });
      }
      return deferred.promise();
    },
    search: function(keyword, page, perPage){
      var deferred = $.Deferred();
      function parseTemplate(template){
        var link = template.replace("{search-term}", keyword)
                                  .replace("{results-per-page}", perPage)
                                  .replace("{page-number}", page);
        return link;
      }

      if(keyCache.hasKey("search.template")){
        var link = parseTemplate(keyCache.getLink("search.template"));
        $.get(link).done(deferred.resolve);
      } else {
        Rotten.Api.movies().done(executionerT(deferred, parseTemplate));
      }

      return deferred.promise();
    }
  }

  window.Rotten = Rotten;


}).call(this, Movies);
