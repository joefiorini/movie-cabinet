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
      console.log("link: ", link);
      $.get(link).done(deferred.resolve);
    };
  }

  Rotten.Api = {
    home: function(){
      return $.get(Rotten.baseUrl);
    },
    movies: function(){
      var deferred = $.Deferred();
      Rotten.Api.home().then(executioner("movies", deferred));
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
      Rotten.Api.movies().done(executionerT(deferred, parseTemplate));
      return deferred.promise();
    }
  }

  window.Rotten = Rotten;


}).call(this, Movies);
