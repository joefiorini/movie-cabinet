(function(app){

  var fixtures = Movies.LOAD_FIXTURE();

  window.Rotten = {
    search: function(keyword, page){
      var fixture = fixtures.getPage(page);
      return fixture;
    }
  };

}).call(Movies);
